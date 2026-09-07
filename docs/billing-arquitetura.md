# NortGo — Arquitetura de Pagamento (PROPOSTA v2)

> **Status: PROPOSTA.** Não é "aprovada". Só vira decisão depois do **spike de
> validação** (§10) fechar as duas incógnitas: (a) Cloudflare Worker faz
> HMAC-SHA256 + transação D1 + Cron + chamada ao MP sandbox; (b) o Base44
> **aceita** ser empurrado (inbound webhook com secret) **ou** consultado
> (outbound HTTP no login). Se (b) falhar, o fluxo automático não existe neste
> app — vira manual ou muda a plataforma do app.
>
> **Não implementar antes do passo 5** (`docs/PROJETO.md` §7).
> **Base:** guia técnico Mercado Pago v5.2.0 + revisão adversarial do Codex
> (2026-09-06, 3 achados `high` + 2 `medium` — esta v2 responde a todos).

---

## 1. O fluxo que o dono quer (pagar antes, no nortgo.com)

```
1. nortgo.com  →  "Começar"  →  /assinar (página servida pelo Worker de billing)
2. Usuário informa o e-mail + clica "Assinar Plus (R$ 9,90/mês)"
3. Worker cria a assinatura no Mercado Pago  →  redireciona pro checkout do MP
4. Usuário paga no ambiente do MP  →  MP redireciona de volta pra /assinar/ok
5. MP  →  webhook  →  Worker valida, confirma na API do MP, grava a compra
6. Worker manda e-mail com um LINK DE ATIVAÇÃO (uso único, expira em 30 min)
7. Usuário clica  →  /ativar?token=...  →  Worker:
     • marca o e-mail como "ativado"
     • EMPURRA pro Base44: "libere Plus para <email>"  (push)
     • redireciona pro nortgo.com.br/login
8. Usuário faz login no Base44 com o mesmo e-mail
9. Base44, no login, CONSULTA o Worker: "o <email autenticado> tem Plus?"  (pull)
     → recebe um token de direito assinado (24 h) e libera as features
```

**Push (passo 7) + Pull (passo 9) juntos**, de propósito:
- **Push** = acesso funciona já no primeiro login, sem esperar.
- **Pull** = pega o que o push perdeu, e **derruba** o acesso quando há
  chargeback / cancelamento / falta de pagamento.

---

## 2. Identidade e autorização — resolve Codex #1 (`account_id` não é do cliente)

**Regra dura: nenhuma rota do billing aceita `account_id` (nem e-mail) vindo do
navegador ou do cliente.** A conta é sempre resolvida internamente.

### 2.1 A chave de junção é o e-mail verificado

- No pagamento, o e-mail vem de **dois lugares que conferem**: o campo do form
  **e** o `payer.email` que o MP devolve no webhook. Se divergirem → estado
  `email_mismatch`, não ativa, cai pra revisão manual.
- O e-mail só é considerado **verificado** quando o usuário **clica o link de
  ativação** (passo 7). Antes disso: `status = paid_unverified`.
- O billing cria seu próprio `account_id` (UUID) e guarda
  `{ account_id, email (lower, único), base44_user_ref, ... }`.

### 2.2 Quem pode chamar cada rota

| Rota | Quem chama | Como se autentica | Como a conta é resolvida |
|---|---|---|---|
| `POST /assinar` (cria assinatura) | o próprio Worker (form da página) | rate-limit por IP + captcha leve + `Origin` = nortgo.com | cria conta nova pelo e-mail do form (status `pending`) |
| `POST /webhooks/mercadopago` | Mercado Pago | **HMAC-SHA256** (`x-signature`) + GET do recurso no MP | pelo `external_reference` = `account_id` que **nós** setamos ao criar |
| `GET /ativar?token=` | o usuário (link do e-mail) | **token de ativação**: JWT assinado, `jti` único, TTL 30 min, `aud=activate`, gravado como usado após 1 clique | o `account_id` está **dentro** do token assinado |
| `POST /entitlement/check` | **o Base44** (login) | **asserção server-to-server assinada**: JWT com a chave do app, contendo `email` (o que o Base44 acabou de autenticar), `aud=nortgo-billing`, `exp` ≤ 60 s, `nonce` (anti-replay, guardado) | resolve `account_id` pelo `email` **da asserção** (nunca do cliente) |
| `POST /cancel` | o Base44 (a mando do usuário logado) | mesma asserção server-to-server + `email` | idem |
| `POST /admin/*` | operador | chave de admin separada + IP allowlist | — |

- A asserção do Base44 é **assinada pela chave privada do app** e verificada com
  a pública no Worker. Sem asserção válida → 401. `nonce` já visto → 401.
- O `/cancel` exige que o `email` da asserção **seja o dono** daquela assinatura.

---

## 3. Máquina de estados + ordenação de eventos — resolve Codex #2

### 3.1 Estados (transições monotônicas; terminais dominam)

```
pending ──paga──▶ active ──renova──▶ active
   │                 │  └──recusa──▶ past_due ──paga──▶ active
   │                 │                   └──3 recusas / prazo──▶ canceled
   │                 └──usuário cancela──▶ canceled        (terminal)
   └──expira sem pagar──▶ abandoned                        (terminal)
                     active/past_due ──chargeback──▶ revoked (terminal, dominante)
```

- `canceled`, `revoked`, `abandoned` são **terminais**. Um evento antigo de
  "aprovado" que chega atrasado **não reabre** — só um **novo `preapproval`**
  (nova assinatura) sai de terminal.
- `revoked` (chargeback) **domina tudo**: mesmo um "aprovado" com timestamp
  posterior não tira de `revoked` — só resolução manual da disputa.

### 3.2 O que se persiste (nunca calcular na hora de chegada)

```
accounts:
  account_id            (PK, UUID nosso; keyed pelo e-mail lower/único — nunca é apagado)
  email
  base44_user_ref
  eff_entitled          ← direito EFETIVO calculado (bool). Derivado de TODAS as
  eff_valid_until         assinaturas da conta (regra abaixo). É o que o Base44 recebe.
  state_version         ← inteiro sempre-crescente, +1 SÓ quando (eff_entitled,
                          eff_valid_until) muda de verdade. NUNCA reseta.
                          É o "as_of" que o Base44 compara.
  created_at

subscriptions:                         (uma conta pode ter várias ao longo do tempo)
  subscription_id       (PK)
  account_id            (FK)
  mp_preapproval_id
  status                ← pending | active | past_due | canceled | revoked | abandoned
  paid_through          ← vem da RESPOSTA do MP (fim do período pago), não "+1 mês"
  last_mp_event_ts      ← date_created do evento no MP (não a hora que chegou aqui)
  last_payment_id
  amount, currency
  updated_at

push_outbox:            (padrão outbox transacional — a garantia de entrega do push)
  id                    (PK)
  account_id, email
  reason                ← ex. 'entitlement_changed'
  state_version         ← o as_of no momento da mudança
  created_at
  attempts              (default 0)
  next_attempt_at       (default now)
  delivered_at          (NULL até entregar)
  dead                  (bool; true após esgotar as tentativas)
```

### 3.2.1 Direito efetivo = UNIÃO das assinaturas, não "a mais recente"

```
eff_entitled  = existe alguma assinatura da conta com
                  status ∈ { active, past_due, canceled }
                  E paid_through > agora
eff_valid_until = MAX(paid_through) entre essas assinaturas
```

- **`pending`** (nova assinatura ainda não paga): contribui `false`/nada. **Não
  remove** um Plus que ainda vale de outra assinatura. → resolve
  "nova assinatura `pending` remove Plus válido".
- **`past_due`** e **`canceled`**: ainda contam **enquanto `paid_through > agora`**
  (o usuário pagou o período; cancelar não devolve dinheiro).
- **`abandoned`**: nunca contribui.
- **`revoked`** (chargeback): aquela assinatura para de contribuir na hora. Se a
  conta tiver **outra** assinatura com período válido, o Plus continua por ela
  (um chargeback de um pagamento não mata uma assinatura separada legítima).
- O direito **expira** quando `eff_valid_until` passa — não é um evento do MP.
  Tratado por **duas frentes que sempre persistem** (nunca só "calcula na hora e
  responde"):
  1. **Read-through-repair no pull** (§4.1): o `/entitlement/check` recalcula o
     direito efetivo; **se difere** do `eff_*` guardado, roda a transação do
     §3.3 (grava `eff_*`, **bump de `state_version`**, insere no outbox — mesma transação, §3.3) **antes** de
     responder. A resposta sai sempre com `as_of` consistente com `entitled` —
     nunca "entitled novo com as_of velho".
  2. **Sweep** (§5), a cada hora: pra toda conta `eff_valid_until <= agora AND
     eff_entitled` → mesma transação. Cobre quem não faz login.

Uma **reativação** depois de `canceled` cria uma **assinatura nova** (linha
nova), na **mesma conta** — `state_version` continua de onde parou.

### 3.3 Toda escrita é condicional e transacional

```sql
BEGIN;
-- 1. transição de estado da assinatura (condicional/monotônica por evento do MP)
UPDATE subscriptions
   SET status = :new_status, paid_through = :mp_paid_through,
       last_mp_event_ts = :mp_event_ts, last_payment_id = :pid, updated_at = now()
 WHERE subscription_id = :sub
   AND last_mp_event_ts < :mp_event_ts          -- ignora evento mais velho
   AND status NOT IN ('revoked','canceled','abandoned')  -- terminais não voltam
   AND NOT (:new_status = 'active' AND status = 'revoked');

-- 2. RECALCULA o direito efetivo da conta a partir de TODAS as assinaturas (§3.2.1)
--    e só faz o bump se (eff_entitled, eff_valid_until) mudou de verdade.
WITH derived AS (
  SELECT
    EXISTS (SELECT 1 FROM subscriptions
             WHERE account_id = :acc
               AND status IN ('active','past_due','canceled')
               AND paid_through > now())            AS ent,
    (SELECT MAX(paid_through) FROM subscriptions
      WHERE account_id = :acc
        AND status IN ('active','past_due','canceled')
        AND paid_through > now())                   AS vu
)
UPDATE accounts
   SET eff_entitled   = derived.ent,
       eff_valid_until = derived.vu,
       state_version  = state_version + 1
  FROM derived
 WHERE account_id = :acc
   AND (accounts.eff_entitled, accounts.eff_valid_until)
       IS DISTINCT FROM (derived.ent, derived.vu);   -- só bump se mudou

-- 3. SE o direito efetivo mudou (etapa 2 afetou 1 linha) → OUTBOX na MESMA transação.
--    É isto que garante o push: se o processo cair depois do COMMIT, a linha do
--    outbox continua lá pra ser entregue depois.
INSERT INTO push_outbox (account_id, email, reason, state_version, next_attempt_at)
SELECT :acc, a.email, 'entitlement_changed', a.state_version, now()
  FROM accounts a
 WHERE a.account_id = :acc AND :rows_affected_step2 > 0;

INSERT INTO audit_log (...) VALUES (...);
COMMIT;
```

- **Quem chama esta transação:** o handler de webhook (com etapa 1), o pull
  read-through-repair (só a etapa 2, quando o recálculo difere) e o sweep
  horário (só a etapa 2). Todos usam a mesma etapa 2 → o `state_version` é
  sempre consistente com `eff_*`, venha a mudança de onde vier.
- Etapa 1 afeta 0 linhas → evento obsoleto/terminal → só `audit_log`, sem bump.
- **Criar assinatura `pending`**: etapa 1 é um `INSERT` separado; etapa 2 roda
  → o `pending` não muda `(eff_entitled, eff_valid_until)` → **sem bump** → o
  Base44 mantém o Plus que ainda vale. ✅
- `pending → active` (1º pagamento): etapa 2 vê `eff_valid_until` estender →
  **bump**.
- `state_version` só sobe quando o **direito efetivo** muda. É o `as_of` que vai
  no `entitlement token` e na resposta do `/entitlement/check`.
- Reativação depois de `canceled`: quando a nova assinatura vira `active`, o
  `eff_*` muda e o `state_version` (que nunca resetou) sobe → maior que o
  guardado no Base44 → aplicado.

### 3.4 Deduplicação por efeito, não só por `event_id`

```
processed_effects: (mp_resource_id, effect_kind)  PRIMARY KEY
```

- `effect_kind` ∈ {`payment_approved`, `payment_rejected`, `sub_canceled`,
  `chargeback_opened`, ...}. Duas notificações diferentes com o mesmo efeito
  sobre o mesmo recurso são aplicadas **uma vez**.

### 3.5 Entrega do push — outbox transacional + retry pós-commit

A linha em `push_outbox` é escrita **na mesma transação** da mudança de direito
(§3.3 etapa 3). A entrega em si é **pós-commit**, num processo separado:

- **Drenador:** um Cron Trigger a cada **1 min** (ou consumer de fila) pega
  `push_outbox WHERE delivered_at IS NULL AND next_attempt_at <= now()`, em lotes.
- Para cada linha: `POST {base44}/hooks/billing-changed` com `{ email, changed_at }`
  + `X-Billing-Signature` (HMAC).
  - **2xx** → `delivered_at = now()`.
  - falha/timeout → `attempts += 1`, `next_attempt_at = now() + backoff(attempts)`.
- **Sem dead-letter permanente.** O backoff tem duas faixas e **nunca desiste**:
  - faixa rápida (attempts 1–6): 30 s, 2 min, 10 min, 1 h, 6 h, 12 h;
  - faixa lenta (attempts 7+): **a cada 12 h, para sempre**, até entregar.
  - ao entrar na faixa lenta: alerta pro operador; re-alerta a cada 24 h enquanto
    a linha seguir sem `delivered_at`.
  - `dead` (a coluna) vira só um rótulo de "está na faixa lenta / precisa de
    olhar humano" — **não para as tentativas**.
- **At-least-once, idempotente:** o push não carrega estado (§6.1); o Base44
  responde sempre com um pull. Entregar 2× = 1 pull a mais, sem efeito.
- Linhas com `delivered_at` são podadas depois de 30 dias. Linhas sem
  `delivered_at` **nunca são podadas**.

### 3.5.1 Reconciliador do canal de notificação (resolve "dead-letter não converge")

Um push que ficou preso (faixa lenta) **não gera linha nova** nos sweeps
seguintes, porque `eff_*` já está correto no billing. Então há um job **diário**,
junto da reconciliação (§5), que garante a convergência do **canal**, não só dos
fatos de dinheiro:

1. **Redrive:** toda linha de `push_outbox` sem `delivered_at` (inclusive faixa
   lenta) → força `next_attempt_at = now()` uma vez por dia, além do ciclo de
   12 h. (Cobre falha longa do lado do Base44 que já se resolveu.)
2. **Detecção de drift:** o billing pergunta ao Base44, em lote,
   `GET {base44}/billing-sync?since=<cursor>` → o Base44 devolve, por usuário,
   o `billing_as_of` que ele tem guardado. Para **toda conta** (sem filtrar por
   `eff_entitled` — o drift perigoso é justamente `eff_entitled=false` no billing
   mas ainda Plus no Base44, ex. chargeback com push perdido) onde
   `base44.billing_as_of < billing.state_version` **e não há linha de outbox
   pendente** → o billing **insere uma linha de outbox nova**. Assim o drift é
   detectado e re-notificado **nas duas direções** (liberar E revogar).
   - Se o Base44 **não expõe** esse endpoint de leitura em lote → backstop:
     **heartbeat semanal** — o billing enfileira uma re-notificação pra **toda
     conta que já teve alguma assinatura** (`state_version > 0`), **entitled ou
     não**, 1×/semana. Barato (só um gatilho de pull) e garante teto de 7 dias
     pro drift silencioso, inclusive de revogações/cancelamentos.
3. Toda ação gera `audit_log`.

---

## 4. Disponibilidade e degradação — resolve Codex #3

**Problema:** se o billing vira dependência síncrona de todo login e ele cai,
ninguém entra (fail-closed) ou todos entram de graça (fail-open).

### 4.1 Token de direito assinado + cache no app

- `POST /entitlement/check` é um **read-through-repair**:
  1. recalcula o direito efetivo (§3.2.1) a partir de todas as assinaturas;
  2. **se difere** do `eff_*` guardado na conta → roda a transação do §3.3
     (grava `eff_*`, **`state_version += 1`**, insere no outbox — mesma transação) **dentro da mesma
     requisição**, e relê o `state_version`;
  3. devolve `{ entitled, plan, valid_until, as_of, token }` com
     `as_of = accounts.state_version` (já atualizado se houve mudança).
  → **Invariante:** a resposta nunca traz um `entitled` novo com um `as_of`
  velho. Dois pulls concorrentes: o `UPDATE` condicional do §3.3 faz um deles
  afetar 0 linhas; ambos releem o mesmo `state_version` e respondem igual.
- O **entitlement token** é um JWT assinado pelo billing, TTL **24 h**, payload
  `{ email, plan, valid_until, as_of, issued_at }`.
- O Base44 **guarda esse token** na sessão do usuário. Enquanto ele for válido
  (não expirou), o Base44 **decide localmente** — não chama o billing.
- Ao aplicar, o Base44 compara `as_of` (§6.2): token com `as_of` menor que o já
  guardado é descartado (protege contra reaplicação de token velho).
- Só chama o billing quando: token ausente, ou faltando < 2 h pra expirar.
- Efeito colateral bom: consulta vira **rara** (1×/dia por usuário ativo), o que
  mantém tudo dentro do free tier do Cloudflare (100k req/dia).

### 4.2 Respostas distintas (nunca confundir "não tem" com "não consegui")

| Situação | Resposta do billing | O que o Base44 faz |
|---|---|---|
| Tem Plus | `200 { entitled:true, token }` | libera, guarda token |
| Não tem Plus | `200 { entitled:false }` | mantém no plano grátis |
| Billing indisponível / timeout (500 ms) | o app **não recebe resposta** | usa o **último token válido** por uma **janela de tolerância de 72 h**; passado isso, fail-closed com mensagem clara: *"não conseguimos confirmar sua assinatura agora — tente novamente em instantes"* (≠ "você não é assinante") |

### 4.3 Operação

- `GET /health` no Worker; alerta se o processamento de webhook atrasar > 15 min.
- Circuit breaker no lado do Base44 (se 3 timeouts seguidos, para de tentar por
  5 min e usa cache).
- SLO alvo: 99,9% no `/entitlement/check`; erro orçado documentado.

---

## 5. Reconciliação que REPARA — resolve Codex #5

O cron diário **não** só alerta. Ele corrige.

```
1. Baixa: lista de preapprovals + relatório "Dinheiro em Conta" do MP
   (valida a assinatura BCrypt do relatório).
2. Janela sobreposta: reprocessa os últimos 3 dias (watermark), pra não perder
   evento na borda; valida completude do relatório (se veio parcial → aborta e
   re-tenta depois, não repara com dado incompleto).
3. Para cada assinatura, o MP é a FONTE DE VERDADE dos fatos de dinheiro:
     • MP canceled / D1 active   → repara: D1 = canceled + outbox
     • MP active+pago / D1 past_due (webhook perdido) → repara: D1 = active + outbox
     • MP chargeback / D1 qualquer → D1 = revoked + outbox (remove acesso)
     • valores divergentes / disputa em curso → NÃO repara sozinho:
         joga na FILA DE EXCEÇÕES pra revisão humana (runbook, SLA 1 dia útil)
4. Todo reparo é transacional e idempotente (mesma regra condicional do §3.3):
   rodar 2× não causa efeito duplo. Depois do reparo, RECALCULA o direito
   efetivo (§3.2.1); se mudou, faz o bump de state_version + outbox (§3.5).
5. SWEEP de expiração — roda a CADA HORA (barato: só WHERE eff_valid_until <=
   agora AND eff_entitled): recalcula (dá false), bump, outbox. Cobre o "período
   pago acabou" pra quem não faz login (o pull já cobre quem faz — §4.1).
6. RECONCILIAÇÃO DO CANAL DE NOTIFICAÇÃO (§3.5.1): redrive de todo outbox preso +
   detecção de drift contra o `billing_as_of` do Base44 (ou heartbeat semanal).
   Garante que dead-letter/push perdido converge sem depender de login.
7. Cada reparo gera audit_log + notificação pro operador.
```

Runbook (`docs/referencia/`, local): quem responde, como validar manualmente no
painel do MP, como reverter um reparo errado.

---

## 6. Integração com o Base44 (push + pull) — a incógnita a validar

O automático **depende** de o Base44 conseguir **pelo menos um** dos dois:

| Mecanismo | O que o Base44 precisa | Se não der |
|---|---|---|
| **Push** (billing → Base44): `POST {base44}/hooks/billing-changed` com **só** `{ email, changed_at }` + `X-Billing-Signature` (HMAC). **NÃO manda `plan` nem `valid_until`.** É um sinal "re-verifique este e-mail", não um dado. | aceitar um endpoint HTTP externo autenticado que dispara uma re-consulta (pull) | sem push: acesso só atualiza no próximo login ou no ciclo da reconciliação — aceitável |
| **Pull** (Base44 → billing): `POST {billing}/entitlement/check` com a asserção assinada. Disparado **no login** E **ao receber um push**. Resposta traz `{ entitled, plan, valid_until, as_of, token }` — `as_of` = versão monotônica do estado no billing. | fazer 1 chamada HTTP (no login e no handler do push) e ler a resposta | **sem pull: não há automático seguro** — o Base44 nunca fica sabendo de chargeback/cancelamento. Aí: manual, ou trocar a plataforma do app |

➡️ **O spike (§10) tem que confirmar o Pull.** É o item que decide se "automático"
é possível neste app.

### 6.1 Push NÃO carrega estado — resolve "stale push restaura acesso revogado"

O único jeito de um push atrasado reabrir um acesso revogado seria o Base44
**confiar no conteúdo** do push. Então o push **não tem conteúdo de estado**:

- Push = `{ email, changed_at }`. O Base44, ao receber, **ignora o corpo** (só
  usa o `email`) e **faz um pull**. Quem manda é sempre o pull, que lê o estado
  **monotônico** do billing (§3) — onde `revoked`/`canceled` são terminais.
- Push perdido / dead-letter → converge por **3 frentes independentes**: o
  drenador nunca desiste (faixa lenta 12 h para sempre, §3.5), o reconciliador
  do canal (§3.5.1: redrive + detecção de drift ou heartbeat semanal), e o pull
  do próximo login. Janela máxima de acesso indevido pós-chargeback, para um
  usuário que **nunca abre o app**: até o próximo ciclo que entregar o push —
  teto de **7 dias** (heartbeat) mesmo no pior caso; horas no caso normal.
  Documentado como limite conhecido.

### 6.2 O Base44 aplica o resultado do pull de forma monotônica

O Base44 guarda por usuário: `plan` (`free`/`plus`), `plan_valid_until`,
`billing_account_ref` (o `account_id`), e `billing_as_of` = o `state_version`
**da conta** da última resposta aplicada.

- `as_of` no pull/token = `accounts.state_version`, que é **por conta e nunca
  reseta** (§3.2–3.3). Como o e-mail sempre mapeia pro mesmo `account_id`, uma
  **reativação** depois de `canceled` tem `state_version` **maior** → passa na
  comparação e é aplicada. Não há o problema de "contador que reinicia".
- Se o `billing_account_ref` da resposta **diferir** do guardado (não deveria
  acontecer, mas por segurança) → o Base44 trata como conta nova: aplica sem
  comparar e passa a comparar a partir daí.

Regra de escrita no Base44 (uma comparação, não uma máquina de estados):

```
se resposta.as_of  >  billing_as_of  →  aplica (plan, plan_valid_until, as_of)
se resposta.as_of  <= billing_as_of  →  descarta (resultado obsoleto)
```

- `as_of` é um inteiro sempre-crescente que o billing incrementa a **cada
  transição de estado** (§3.3). Dois pulls concorrentes → o mais velho não
  sobrescreve o mais novo.
- O app libera Plus só se `plan == 'plus'` **e** `plan_valid_until > hoje`.
- Se o Base44 **não conseguir** fazer essa comparação condicional (plano
  limitado): o pull passa a devolver **só um token de direito assinado com TTL
  curto (ex. 1 h)** e o Base44 guarda "o token mais recente que recebeu"; expira
  sozinho, então um token velho reaplicado morre em 1 h. Pior caso vira ruído de
  1 h, não restauração permanente.

---

## 7. ADR — Base44 vs Cloudflare Worker+D1 vs Python+Postgres/Render — resolve Codex #4

> Os requisitos do MP (token no servidor, HMAC, webhook, idempotência, cron)
> provam que precisa de **capacidade server-side** — **não** provam sozinhos que
> deve ser Worker+D1. Comparação honesta:

| Critério | Dentro do Base44 | **Cloudflare Worker + D1** | Python + Postgres (Render) |
|---|---|---|---|
| Segredo do MP isolado do app | ❓ depende do plano | ✅ Secrets | ✅ env |
| HMAC-SHA256 na requisição crua | ❓ o Base44 expõe o body cru? | ✅ WebCrypto | ✅ |
| Transação p/ escrita condicional (§3.3) | ❓ | ⚠️ D1 tem transações, mas é SQLite (1 writer) | ✅ Postgres |
| Cron / jobs longos (reconciliação) | ❓ | ✅ Cron Triggers (mas CPU/tempo limitados por invocação) | ✅ sem limite prático |
| Processar relatório CSV/XLSX grande | ⚠️ | ⚠️ limite de CPU/memória do Worker | ✅ |
| Backup + restore **ensaiado** | ❓ (é o risco do passo 2) | ⚠️ `d1 export`; restore precisa ser testado | ✅ dump/restore padrão |
| Observabilidade | ❓ | ✅ Workers Analytics + Logpush | ✅ |
| Isolamento do "vamos sair do Base44" | ❌ acoplado | ✅ separado | ✅ separado |
| Custo | incluso | **grátis** no free tier | ~US$ 7–14/mês (serviço + DB) |
| Competência operacional do time | — | mais nova | mais familiar (o app já é Python/uvicorn na Render) |

**Recomendação da proposta:** **Worker + D1** para começar, **com estas
condições**:
- o spike confirmar que D1 aguenta as transações condicionais e o cron da
  reconciliação dentro dos limites de CPU do Worker;
- se o relatório de reconciliação estourar o limite do Worker → mover **só a
  reconciliação** pra um cron job Python na Render (o resto fica no Worker).

**Fallback claro:** se o spike falhar em D1/transações → **tudo em
Python+Postgres na Render** (mesma stack do app, Postgres de verdade), ainda
como serviço **separado** do app. A decisão "serviço separado" é firme; a
decisão "Worker+D1" é condicional ao spike.

---

## 8. Modalidade Mercado Pago

- **Assinaturas**: `POST /preapproval_plan` (plano R$ 9,90/mês) + `POST
  /preapproval` (assinatura, `external_reference = account_id`, `payer_email`).
- Cartão capturado no **fluxo hospedado do MP** (`init_point` / redirect) →
  escopo PCI mínimo (SAQ-A). Migrar pra Checkout Transparente/Bricks só se o
  redirect derrubar conversão de forma medida.
- Retentativa do MP: 4× em 10 dias úteis; cancela após 3 recusas seguidas.
- Webhook: responder `200` em ≤ 22 s; tópicos `subscription_authorized_payment`,
  `payment`, `topic_chargebacks_wh`, `stop_delivery_op_wh` (fraude — **sem
  retry**, trata na 1ª).

---

## 9. Camadas de segurança (consolidado v2)

| # | Camada | Onde nesta v2 |
|---|---|---|
| 1 | Access Token do MP só nas Secrets do Worker | §2.2, §8 |
| 2 | Webhook HMAC-SHA256 + GET do recurso no MP | §2.2, §8 |
| 3 | `account_id`/e-mail **nunca** do cliente; asserção assinada server-to-server | **§2 (Codex #1)** |
| 4 | Link de ativação: JWT `jti`, TTL 30 min, uso único | §2.2 |
| 5 | Idempotência por `(mp_resource_id, effect_kind)` | **§3.4 (Codex #2)** |
| 6 | Transições monotônicas + terminais dominantes, em transação | **§3 (Codex #2)** |
| 7 | `paid_through` e `last_mp_event_ts` vêm do MP, não da hora de chegada | **§3.2 (Codex #2)** |
| 8 | Validação de valor (bate com o preço do plano) | §8 |
| 9 | Token de direito assinado + cache + janela de tolerância 72 h | **§4 (Codex #3)** |
| 10 | Resposta distinta "não tem" × "não consegui" | **§4.2 (Codex #3)** |
| 10b | Push **não carrega estado** (só sinal "re-verifique"); Base44 aplica pull por `as_of` = `accounts.state_version` (**por conta, nunca reseta**, sobe **só quando o direito efetivo muda**) → push atrasado não restaura revogado, contador não bloqueia reativação, e **assinatura `pending` nova não remove** um Plus ainda válido de outra assinatura | **§3.2–3.3, §6.1–6.2 (stop-gate Codex)** |
| 11 | Reconciliador que **repara** (não só alerta) + fila de exceções + runbook | **§5 (Codex #5)** |
| 12 | Chargeback → `revoked` terminal e dominante + outbox (drenado em ~1 min) | §3.1, §5 |
| 12b | Push via **outbox transacional** + drenador que **nunca desiste** (faixa lenta 12 h) + **reconciliador do canal** (redrive + drift vs `billing_as_of` do Base44 sobre **todas as contas**, ou heartbeat semanal sobre **toda conta com `state_version > 0`, entitled ou não**) → crash pós-commit não perde a notificação; dead-letter converge sem login; drift converge **nas duas direções** (liberar E revogar); teto = 7 dias | **§3.2–3.5.1, §5, §6.1 (stop-gate Codex ×3)** |
| 13 | `audit_log` append-only | §3.3 |
| 14 | Menor privilégio: D1 não é lido pelo app; app só chama `/entitlement/check` e `/cancel` | §2.2, §6 |
| 15 | Sandbox primeiro; `test`/`prod` separados | §10 |
| 16 | Rate-limit em `/assinar` e `/entitlement/check` | §2.2 |
| 17 | Nota de qualidade MP ≥ 73 (`/mp-review`) | §10 |

---

## 10. Plano de execução — **spike primeiro**

### Fase 0 — Spike de validação (1–2 dias, antes de qualquer decisão)

1. Worker "hello": recebe um POST, valida uma assinatura HMAC-SHA256 com
   WebCrypto, grava em D1 dentro de uma transação com `UPDATE ... WHERE`
   condicional, e um Cron Trigger que roda uma rotina de ~30 s.
2. Chama o **sandbox do MP**: cria `preapproval_plan` + `preapproval`, recebe o
   webhook, faz o GET do recurso.
3. **Base44:** provar o **Pull** — o app consegue, no login, fazer um `POST`
   HTTP pra uma URL externa, mandar um header assinado e ler a resposta? E o
   **Push** — o app aceita um endpoint externo (com secret) que dispara um pull?
   E o **`GET /billing-sync` em lote** (§3.5.1) — o app consegue devolver, por
   usuário, o `billing_as_of` que guardou? (Se não → usa o heartbeat semanal.)
4. Medir: o cron de reconciliação (baixar + parsear um CSV de ~10k linhas) cabe
   no limite de CPU do Worker? Se não → reconciliação vai pra Render.

**Saída do spike:** decide Worker+D1 vs Render, e confirma se "automático" é
viável neste app. Vira uma ADR curta em `docs/`.

### Fase 1 — Implementação (só depois do passo 5 do PROJETO.md)

5. Serviço de billing: os endpoints do §2.2, tabelas §3.2, máquina de estados
   §3, reconciliador §5.
6. Página `/assinar` no Worker + e-mail (Resend free tier).
7. Instalar plugin MP (`claude plugin install mercadopago@claude-plugins-official`),
   `/mp-integrate`, `/mp-webhooks configure`.
8. Testar no sandbox todos os caminhos: aprovado, recusado (`FUND`, `SECU`),
   pendente (`CONT`), **evento fora de ordem** (reenviar aprovado depois de um
   cancelado), **retry concorrente**, **chargeback**, **billing offline no
   login**, **link de ativação reusado**, **e-mail divergente**.
9. `/mp-review` até ≥ 73 (mirar 100).
10. Integração no Base44: campo `plan`/`plan_valid_until`, chamada de pull no
    login, endpoint de push.
11. **Piloto pago 5–20 usuários** com o automático + botão de "forçar
    reconciliação" e revisão manual da fila de exceções todo dia.

**Fora deste doc:** valores finais e unit economics → `PROJETO.local.md`; NF-e;
fluxo comercial de reembolso/arrependimento (CDC).
