# NortGo — Arquitetura de Pagamento (desenho; ativar depois)

> **Status:** desenho aprovado como direção (2026-09-06). **Não implementado.**
> Ativar só depois dos gates do passo 5 (isolamento de dados testado, backup,
> observabilidade) — ver `docs/PROJETO.md` §7.
> **Fonte:** guia técnico do Mercado Pago v5.2.0 (API de Orders + preapproval,
> SDK MercadoPago.js V2) + debate de arquitetura.

---

## 1. A pergunta e a resposta

**Onde o pagamento vive: dentro do Base44 (app), no `nortgo.com` (site), ou
separado?**

**Resposta: um serviço de billing separado**, dono da verdade da assinatura, que
o app e o site apenas consultam. Não é o Base44 (vamos sair dele) e não são as
páginas estáticas do `nortgo.com` (não têm servidor).

O que o guia do Mercado Pago exige de qualquer integração **decide isso sozinho**:

| Exigência do MP | Implicação |
|---|---|
| O **Access Token** cria a cobrança e **nunca** pode ir pro cliente nem pro código-fonte (só env var + `.gitignore`) | Precisa de um backend com gestão de segredo |
| Webhook validado por **HMAC-SHA256** (`x-signature` + `x-request-id` + `data_id` + secret) em **toda** chamada | Precisa de código de servidor que veja a requisição crua |
| Depois do webhook, fazer **GET do recurso na API do MP por ID** pra confirmar (não confiar no corpo) | Precisa de backend que chama a API do MP |
| Endpoint **DEVE** responder `200/201` em **≤ 22 s**, senão o MP reenvia (0min, 15min, 30min, 6h, 48h, 96h×3) | Precisa de endpoint confiável + **idempotência** (dedupe de evento) → banco |
| `external_reference` em **todas** as transações (pra conciliar) | É onde amarramos a assinatura ao **nosso** `account_id` portátil |
| **Reconciliação** diária via relatórios financeiros (CSV/XLSX, assinados com BCrypt) | Precisa de job agendado (cron) |
| Pontuação mínima de qualidade **73/100** pra ir a produção (100 recomendado p/ antifraude) | Webhooks ativos + payload completo de `payer` + libs atualizadas |

Um site estático não faz nada disso. E fazer "dentro do Base44" reprova no
**teste da migração**: *"se eu apagar o app e reconstruir, o billing continua
rodando sem eu tocar nele?"* — se está acoplado ao Base44, a resposta é não, e
você arranca o billing no pior momento (durante outra migração).

---

## 2. A arquitetura

```
nortgo.com (site estático)
      │  "Começar"
      ▼
nortgo.com.br (app — Base44 hoje, outra coisa amanhã)
      │  login → tela "NortGo Plus R$ 9,90/mês" → "Assinar"
      │  POST /subscribe { account_id }           GET /entitlement?account_id=X
      ▼                                                     ▲
┌─────────────────────────────────────────────────────────────────┐
│  SERVIÇO DE BILLING  (Cloudflare Worker + D1)                    │
│  — NÃO é Base44, NÃO é as páginas do site —                      │
│  • cria preapproval no MP (Access Token só aqui)                 │
│  • recebe + valida webhook (HMAC-SHA256) + GET do recurso no MP  │
│  • guarda a verdade: quem paga, qual plano, até quando           │
│  • cron diário de reconciliação contra os relatórios do MP       │
└─────────────────────────────────────────────────────────────────┘
      │  cria / gerencia
      ▼
Mercado Pago — Assinaturas (preapproval_plan + preapproval)
```

### 2.1 Âncora de identidade (o que sobrevive ao Base44)

No cadastro, o **serviço de billing** (ou o app chamando o billing) cria um
`account_id` = **UUID nosso**, e guarda:

```
accounts: { account_id (PK), email, base44_user_id, created_at }
```

- `account_id` **nunca muda**.
- `base44_user_id` é só uma coluna — na migração vira `novo_app_user_id`.
- A assinatura no MP é criada com `external_reference = account_id`.
- O app (qualquer app) pergunta `GET /entitlement?account_id=X`.

### 2.2 Stack

| Peça | Escolha | Por quê |
|---|---|---|
| Compute | **Cloudflare Worker** (repo próprio ou pasta `billing/`) | Já temos conta CF; isola do app; HMAC via WebCrypto nativo; Cron Triggers nativos; Secrets nativos; portátil (código padrão) |
| Banco | **Cloudflare D1** (SQLite) | `wrangler d1 export` → `.sql`, 100% portátil. Alternativa: Postgres (Neon/Supabase/Render) se preferir SQL "de verdade" |
| Modalidade MP | **Assinaturas** (`preapproval_plan` + `preapproval`) | É recorrência mensal (R$ 9,90). Não é Checkout Pro avulso nem Orders avulso |
| Captura do cartão | **Fluxo hospedado do MP** (`init_point` / redirect) primeiro | Menor escopo PCI (SAQ-A), menos código, o MP renderiza o formulário. Migrar pra Checkout Transparente/Bricks só se o redirect doer na conversão |

### 2.3 Endpoints do serviço de billing

| Método | Rota | Quem chama | O que faz |
|---|---|---|---|
| `POST` | `/subscribe` | o app (autenticado server-to-server) | cria `preapproval` no MP com `external_reference=account_id`; devolve `init_point` |
| `POST` | `/webhooks/mercadopago` | o Mercado Pago | valida HMAC; GET do recurso no MP por ID; dedupe por `event_id`; atualiza `subscriptions`; responde 200 em < 22 s |
| `GET` | `/entitlement?account_id=` | o app (autenticado) | `{ plan, status, valid_until }` — dados mínimos |
| `POST` | `/admin/reconcile` | Cron Trigger (diário) | baixa o relatório do MP, compara com o D1, alerta divergência |
| `POST` | `/cancel` | o app | `PUT /preapproval/{id}` status `canceled` |

### 2.4 Tabelas D1

```
accounts        { account_id, email, base44_user_id, created_at }
subscriptions   { account_id, mp_preapproval_id, plan, status,
                  current_period_end, amount, updated_at }
webhook_events  { event_id (PK), received_at, processed }      -- idempotência
audit_log       { id, account_id, event, detail, mp_event_id, at }  -- append-only
```

`status`: `pending` · `active` · `past_due` · `canceled` · `revoked` (chargeback)

---

## 3. Fluxo de pagamento (assinatura R$ 9,90/mês)

1. Usuário logado no app → "Assinar NortGo Plus".
2. App → `POST /subscribe { account_id }`.
3. Billing → MP: `POST /preapproval` (`payer_email`, `back_url`,
   `external_reference = account_id`, `auto_recurring.transaction_amount = 9.90`,
   `frequency = 1 month`). Recebe `init_point`.
4. App redireciona o usuário pro `init_point` (página do MP).
5. Usuário põe o cartão no **ambiente do MP** e autoriza.
6. MP → **webhook** `subscription_authorized_payment` pro billing.
7. Billing: valida `x-signature` (HMAC-SHA256); `GET /authorized_payments/{id}`
   no MP; confere o **valor** (= 9,90); marca `status=active`,
   `current_period_end = +1 mês`; grava no `audit_log`; responde 200.
8. MP redireciona o usuário de volta pro app (`back_url`). **O acesso NÃO vem
   do redirect** — vem do passo 7.
9. App recarrega e chama `GET /entitlement` → Plus ativo.
10. **Todo mês:** MP cobra sozinho → webhook → billing estende
    `current_period_end`.
11. **Cartão recusado:** MP tenta de novo (máx. 4× em 10 dias úteis); após 3
    parcelas recusadas seguidas o MP **cancela a assinatura**. O billing, ao ver
    a recusa, marca `past_due`; passado o prazo de carência → app cai pro grátis.

---

## 4. Camadas de segurança (mapeadas ao guia do MP)

| # | Camada | Implementação |
|---|---|---|
| 1 | **Segredo do MP** | Access Token só nas *Secrets* do Worker. Nunca no cliente, no repo ou no Base44. (regra #1 do guia MP) |
| 2 | **Autenticidade do webhook** | Valida `x-signature` (HMAC-SHA256 com `x-request-id` + `data_id` + secret) via WebCrypto. Rejeita 401 se inválido |
| 3 | **Confirmação na fonte** | Depois do webhook, `GET` do recurso na API do MP por ID — não confia no corpo da notificação |
| 4 | **Idempotência** | `X-Idempotency-Key` (UUIDv4) na criação; `webhook_events` deduplica cada `event_id`; processa 1× só |
| 5 | **Validação de valor** | Webhook "pago" → confere se o valor bate com o preço do plano. Impede "pago R$ 1, ganho Plus" |
| 6 | **Vínculo de conta** | `external_reference = account_id`. Nunca inferir a conta de nada que o usuário controle |
| 7 | **Redirect não dá acesso** | O `back_url` é só UX. Acesso só do webhook validado + D1 |
| 8 | **Entitlement server-to-server** | App prova que é o app (segredo compartilhado / JWT assinado). Rate-limit. Retorna o mínimo |
| 9 | **App nunca confia no cliente** | "É Plus?" sempre é checagem no servidor ou token curto assinado pelo billing |
| 10 | **Escopo PCI mínimo** | Cartão nunca toca nosso servidor (fluxo hospedado do MP) → SAQ-A |
| 11 | **Reconciliação** | Cron diário: relatório do MP (valida assinatura BCrypt) × D1. Pega webhook perdido, cancelamento fora de banda, disputa |
| 12 | **Chargeback / reembolso** | Webhook `topic_chargebacks_wh` → `status=revoked` na hora. `stop_delivery_op_wh` (fraude) → **não tem retry**, trata na 1ª tentativa |
| 13 | **Log de auditoria** | `audit_log` append-only: toda mudança de estado (quando, por quê, qual `mp_event_id`) |
| 14 | **Menor privilégio** | D1 do billing não é lido pelo app nem pelo Base44. App tem 1 credencial que só chama `GET /entitlement` |
| 15 | **Ambientes** | Credenciais *sandbox* do MP. Fluxo inteiro testado no sandbox (cartões `APRO`/`FUND`/`SECU`...) antes do real. `test`/`prod` separados no Worker |
| 16 | **Rate limiting** | `/subscribe` limitado por conta. Previne spam de criação de assinatura |
| 17 | **Qualidade MP ≥ 73** | Webhooks ativos + `external_reference` sempre + payload completo de `payer` (antifraude). Rodar `/mp-review` |

---

## 5. Acelerador: plugin oficial do Mercado Pago

O MP tem um **plugin para Claude Code e Codex**:

```
claude plugin install mercadopago@claude-plugins-official
```

Comandos úteis: `/mp-connect` (OAuth no navegador — **nunca** cola token no
chat), `/mp-integrate [descrição]` (gera o código da integração), `/mp-webhooks
configure` / `simulate` / `diagnose`, `/mp-test-setup` (usuários e cartões de
teste), `/mp-review` (checklist de qualidade e segurança, precisa ≥ 73).

Isso confirma a direção: o caminho "IA gera a integração" pressupõe um **backend
de código** — não um builder no-code.

---

## 6. O que "facilita depois"

- **Sair do Base44:** billing intacto. `account_id` é a âncora; `base44_user_id`
  é uma coluna; a assinatura no MP está amarrada a `external_reference`, não ao
  Base44. O app novo chama o mesmo `GET /entitlement`.
- **Trocar de provedor de pagamento** (Stripe, Pagar.me...): só o serviço de
  billing muda; o contrato `GET /entitlement` que o app conhece não muda.
- **Plano anual à vista (Pix 0%)** depois: outro endpoint no mesmo serviço
  (`preference` avulsa em vez de `preapproval`), mesma tabela.
- **Painel admin / suporte / app mobile:** todos consultam o mesmo serviço.

---

## 7. Próximos passos (quando ativar — pós passo 5)

1. Decidir compute do billing: Worker+D1 (recomendado) ou serviço Python na Render.
2. `git` repo/pasta do billing + `wrangler.jsonc` + Secrets (sandbox primeiro).
3. Implementar os 5 endpoints + tabelas + cron.
4. Instalar o plugin MP, `/mp-integrate`, `/mp-webhooks configure`.
5. Testar o fluxo inteiro no **sandbox** (cartões `APRO`, `FUND`, `SECU`, `CONT`).
6. `/mp-review` até ≥ 73 (mirar 100).
7. Ponto de integração no app Base44: tela de plano + chamada `/subscribe` +
   checagem de `/entitlement` no load.
8. **Piloto pago 5–20 usuários** antes de tráfego amplo (`docs/PROJETO.md` §7 passo 6).
9. `PROJETO.local.md`: preço final, unit economics (taxa MP 4,98%/4,49%/3,98% +
   custo Base44/usuário + IA + imposto + chargeback + CAC).

**Fica de fora deste desenho:** valores finais e unit economics (sensível →
`PROJETO.local.md`); NF-e; fluxo de reembolso/arrependimento comercial (CDC).
