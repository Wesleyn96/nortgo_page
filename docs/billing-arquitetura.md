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
subscriptions:
  account_id            (FK)
  mp_preapproval_id
  status
  paid_through          ← vem da RESPOSTA do MP (fim do período pago), não "+1 mês"
  last_mp_event_ts      ← date_created do evento no MP (não a hora que chegou aqui)
  last_payment_id
  amount, currency
  updated_at
```

### 3.3 Toda escrita é condicional e transacional

```sql
BEGIN;
UPDATE subscriptions
   SET status = :new_status, paid_through = :mp_paid_through,
       last_mp_event_ts = :mp_event_ts, last_payment_id = :pid, updated_at = now()
 WHERE account_id = :acc
   AND last_mp_event_ts < :mp_event_ts          -- monotônico: ignora evento mais velho
   AND status NOT IN ('revoked','canceled','abandoned')  -- terminais não voltam
   AND NOT (:new_status = 'active' AND status = 'revoked');
INSERT INTO audit_log (...) VALUES (...);
COMMIT;
```

- Se o `UPDATE` afeta 0 linhas → evento obsoleto ou conflito com terminal →
  registra no `audit_log` e responde 200 (não é erro, é ordem).

### 3.4 Deduplicação por efeito, não só por `event_id`

```
processed_effects: (mp_resource_id, effect_kind)  PRIMARY KEY
```

- `effect_kind` ∈ {`payment_approved`, `payment_rejected`, `sub_canceled`,
  `chargeback_opened`, ...}. Duas notificações diferentes com o mesmo efeito
  sobre o mesmo recurso são aplicadas **uma vez**.

---

## 4. Disponibilidade e degradação — resolve Codex #3

**Problema:** se o billing vira dependência síncrona de todo login e ele cai,
ninguém entra (fail-closed) ou todos entram de graça (fail-open).

### 4.1 Token de direito assinado + cache no app

- `POST /entitlement/check` devolve um **entitlement token**: JWT assinado pelo
  billing, TTL **24 h**, payload `{ email, plan, valid_until, issued_at }`.
- O Base44 **guarda esse token** na sessão do usuário. Enquanto ele for válido
  (não expirou), o Base44 **decide localmente** — não chama o billing.
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
     • MP canceled / D1 active   → repara: D1 = canceled + push Base44
     • MP active+pago / D1 past_due (webhook perdido) → repara: D1 = active + push
     • MP chargeback / D1 qualquer → D1 = revoked + push (remove acesso)
     • valores divergentes / disputa em curso → NÃO repara sozinho:
         joga na FILA DE EXCEÇÕES pra revisão humana (runbook, SLA 1 dia útil)
4. Todo reparo é transacional e idempotente (mesma regra condicional do §3.3):
   rodar 2× não causa efeito duplo.
5. Cada reparo gera audit_log + notificação pro operador.
```

Runbook (`docs/referencia/`, local): quem responde, como validar manualmente no
painel do MP, como reverter um reparo errado.

---

## 6. Integração com o Base44 (push + pull) — a incógnita a validar

O automático **depende** de o Base44 conseguir **pelo menos um** dos dois:

| Mecanismo | O que o Base44 precisa | Se não der |
|---|---|---|
| **Push** (billing → Base44): `POST {base44}/hooks/entitlement` com `{ email, plan, valid_until }` + header `X-Billing-Signature` (HMAC) | aceitar um endpoint HTTP externo autenticado que grava um campo `plan`/`valid_until` no usuário | sem push: acesso só libera no 1º login (via pull) — aceitável |
| **Pull** (Base44 → billing) no login: `POST {billing}/entitlement/check` com a asserção assinada | fazer 1 chamada HTTP no fluxo de login e ler a resposta | **sem pull: não há automático seguro** — o Base44 nunca fica sabendo de chargeback/cancelamento. Aí: manual, ou trocar a plataforma do app |

➡️ **O spike (§10) tem que confirmar o Pull.** É o item que decide se "automático"
é possível neste app.

### 6.1 O campo no Base44

O Base44 guarda por usuário: `plan` (`free`/`plus`), `plan_valid_until` (data),
`billing_account_ref` (o nosso `account_id`, pra suporte). O app libera feature
Plus se `plan == 'plus'` **e** `plan_valid_until > hoje`.

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
| 11 | Reconciliador que **repara** (não só alerta) + fila de exceções + runbook | **§5 (Codex #5)** |
| 12 | Chargeback → `revoked` terminal e dominante + push imediato | §3.1, §5 |
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
   **Push** — o app aceita um endpoint externo que escreve um campo no usuário?
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
