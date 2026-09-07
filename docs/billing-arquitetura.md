# NortGo — Arquitetura de Pagamento (v3 — pago, dentro do Base44)

> **Substitui a v2.** A v2 foi desenhada assumindo "vamos sair do Base44" e virou
> um serviço de billing separado com 10 rodadas de correção de sincronia. A
> premissa mudou:
>
> - **O app fica no Base44** (por ora, sem plano de sair).
> - **Sem plano grátis.** Produto **pago**: sem assinatura ativa, o app não abre.
> - Logo: **o billing vive DENTRO do Base44**, ao lado do usuário. Não há dois
>   bancos, não há validação cruzada, não há a "bagunça".
>
> **Status: proposta.** Nada implementado. **Só depois do passo 5**
> (`docs/PROJETO.md` §7). **Base:** guia técnico Mercado Pago v5.2.0.
> Histórico da v2 (serviço separado): `git log docs/billing-arquitetura.md`.

---

## 1. O fluxo

```
nortgo.com  ──"Assinar / Testar"──▶  nortgo.com.br (Base44)
      (landing, Cloudflare estático — NÃO move)          │
                                            cadastro (e-mail + senha / Google)
                                                          │
                                          conta criada com  plan = 'none'
                                                          │
                                        tela de paywall: "Assine o NortGo"
                                                          │
                                              clica "Assinar — R$ 9,90/mês"
                                                          │
              função server-side do Base44 cria a assinatura no Mercado Pago
                 (external_reference = id do usuário no Base44, payer_email = e-mail)
                                                          │
                              redireciona pro checkout hospedado do MP
                                                          │
                                    usuário paga  →  volta pro app
                                                          │
                    MP  ──webhook──▶  função do Base44:
                        valida x-signature (HMAC-SHA256)
                        confirma o recurso na API do MP por ID
                        seta  user.plan = 'plus',  user.plan_until = <fim do período>
                                                          │
                       o app libera tudo se  plan == 'plus' && plan_until > agora
```

**Cadastra sempre antes de pagar** — assim, na hora do pagamento já existe um
usuário autenticado pra amarrar a assinatura (`external_reference = user_id`).
Isso elimina link mágico, casamento de e-mail e "registro de pagamento pendente
fora da tabela de usuários" — que era toda a complexidade da v2.

### 1.1 Opção: 7 dias de teste grátis (recomendado, mesma arquitetura)

No cadastro: `plan = 'trial'`, `trial_until = +7 dias`. O app libera se
`plan == 'plus'` **ou** (`plan == 'trial'` **e** `trial_until > agora`). Acabou o
trial → paywall. É só uma regra a mais no `if`; **não muda nada** no resto.

---

## 2. Onde cada peça vive

| Peça | Onde | Observação |
|---|---|---|
| Landing (`nortgo.com`) | **Cloudflare estático (fica como está)** | Só HTML apontando pro app. Sem dado, sem sincronia. Rápido, SEO próprio, sobrevive a queda do Base44. |
| Cadastro, login | Base44 | já existe |
| Página de planos / paywall | **Base44** (dentro do app) | o app mostra quando `plan` não libera |
| Criar assinatura no MP | **função server-side do Base44** | Access Token só no env do Base44 |
| Receber + validar webhook do MP | **função do Base44** (endpoint) | HMAC-SHA256 |
| Estado da assinatura + `user.plan` | **banco do Base44** | fonte única da verdade |
| Reconciliação diária | **função agendada do Base44** | varre a própria tabela vs API do MP |

**`nortgo.com` não recebe pagamento e não guarda nada de billing.** Zero segundo
banco.

---

## 3. A ÚNICA incógnita: o que o backend do Base44 faz? (passo 1 do inventário)

| Base44 consegue... | Arquitetura de billing |
|---|---|
| função server-side + **receber webhook** (endpoint HTTP) + guardar **secret** + **chamada HTTP de saída** | ✅ **Tudo no Base44.** Este doc, direto. Zero peças extras. |
| função + chamada de saída + secret, mas **não** recebe webhook cru | 🟡 **Adaptador mínimo** (Cloudflare Worker, ~50 linhas, **sem banco**): recebe o webhook do MP → valida o HMAC → chama a API do Base44 (autenticada) pra atualizar o usuário. Stateless, sem lógica de negócio. |
| **nada** externo (nem entrada nem saída autenticada) | 🔴 **Piloto manual**: você libera 5–20 usuários na mão a partir da notificação do MP. Automatiza quando o Base44 permitir ou o app sair de lá. |

➡️ O **spike (§9)** confirma qual linha. É o que decide tudo — não dá pra pular.

---

## 4. Modelo de dados (no banco do Base44)

Campos no **usuário** (ou tabela `subscription` 1‑1 com o usuário):

```
plan            : 'none' | 'trial' | 'plus' | 'past_due' | 'canceled' | 'revoked'
plan_until      : data — fim do período pago (vem da RESPOSTA do MP)
trial_until     : data — só se usar trial
mp_preapproval_id
mp_payer_id
last_mp_event_at : timestamp do evento no MP (date_created), não a hora que chegou
updated_at
```

Tabela auxiliar de **idempotência de webhook**:

```
mp_processed_events : (mp_event_id)  PK      -- cada notificação aplicada 1× só
```

Tabela de **log de billing** (append-only, pra suporte e disputa):

```
billing_log : id, user_id, event, detail, mp_event_id, at
```

O app libera Plus **lendo `user.plan` direto do banco** em toda requisição —
uma fonte, sem cache pra dessincronizar. (É isso que some da v2: não há segundo
sistema pra manter em dia.)

---

## 5. Integração Mercado Pago

- **Modalidade: Assinaturas** — `POST /preapproval_plan` (plano R$ 9,90/mês) +
  `POST /preapproval` (assinatura). `external_reference = user_id`,
  `payer_email = user.email`, `back_url = nortgo.com.br/assinatura/ok`.
- **Cartão no checkout hospedado do MP** (`init_point` / redirect) → escopo PCI
  mínimo (SAQ‑A). O cartão nunca toca o Base44.
- **Retentativa do MP:** 4× em 10 dias úteis; cancela após 3 recusas seguidas.
- **Webhook** (`subscription_authorized_payment`, `payment`,
  `topic_chargebacks_wh`, `stop_delivery_op_wh`): responder `200` em ≤ 22 s.

### 5.1 Segurança (tudo dentro de UM backend agora — muito mais simples)

| # | Camada |
|---|---|
| 1 | Access Token do MP só no **env/secret do Base44**. Nunca no cliente, nunca no código, nunca no `nortgo.com`. |
| 2 | Webhook: validar `x-signature` (HMAC‑SHA256 com `x-request-id` + `data_id` + secret). Inválido → `401`. |
| 3 | Depois do webhook, **GET do recurso na API do MP por ID** — não confiar no corpo da notificação. |
| 4 | Idempotência: `mp_processed_events` deduplica cada `mp_event_id`. |
| 5 | **Validar o valor**: webhook "pago" → conferir se bate com R$ 9,90. Impede "pago R$ 1, ganho Plus". |
| 6 | Vínculo: `external_reference = user_id`. Nunca inferir o usuário de nada que o cliente controle. |
| 7 | **Redirect (`back_url`) não dá acesso.** Só o webhook validado muda `user.plan`. |
| 8 | Ordenação: aplicar update só se `evento.date_created > last_mp_event_at`. `revoked`/`canceled` **dominam** (evento "aprovado" atrasado não reabre). |
| 9 | Reconciliação diária (§6). |
| 10 | `billing_log` append-only. |
| 11 | Sandbox primeiro (cartões `APRO`/`FUND`/`SECU`/`CONT`); credenciais `test`/`prod` separadas. |
| 12 | Nota de qualidade MP ≥ 73 (rodar o `/mp-review` do plugin do MP). |
| 13 | Se usar o adaptador Worker (§3): a chamada Worker→Base44 é autenticada por HMAC com timestamp **dentro** da assinatura + nonce uso‑único (senão dá replay). |

---

## 6. Reconciliação (função agendada do Base44, 1×/dia)

Agora é **uma varredura de uma tabela contra a API do MP** — sem protocolo entre
sistemas:

1. Baixa a lista de `preapproval` da conta + o relatório "Dinheiro em Conta" do
   MP (valida a assinatura BCrypt do relatório).
2. Para cada assinatura, **o MP é a verdade dos fatos de dinheiro**:
   - MP `cancelled` / banco `plus` → corrige: `plan = 'canceled'` (mantém acesso
     até `plan_until`, depois o app gateia sozinho).
   - MP `authorized` + pago / banco `past_due` (webhook perdido) → corrige:
     `plan = 'plus'`, estende `plan_until`.
   - MP chargeback → `plan = 'revoked'` **na hora**.
   - valor divergente / disputa em curso → **não corrige sozinho** → fila de
     exceções + alerta pro operador (runbook em `docs/referencia/`).
3. Janela sobreposta de 3 dias (watermark); se o relatório veio parcial → não
   repara com dado incompleto, re-tenta depois.
4. Todo reparo é idempotente e vai pro `billing_log`.

**Expiração** (`plan_until` passou — não é evento do MP): o app checa
`plan_until > agora` **em toda requisição**, então expira sozinho. A
reconciliação diária só arruma o rótulo `plan` (`plus` → `past_due`/`none`) pra
relatório ficar certo.

---

## 7. Casos de borda (todos = mudar `user.plan` no mesmo banco)

| Evento | Ação |
|---|---|
| Pagou (1ª vez / renovação) | `plan = 'plus'`, `plan_until = <fim do período do MP>` |
| Cartão recusado | MP tenta de novo; app continua liberando até `plan_until`; se passar → gateia. Opcional: `plan = 'past_due'` pra mostrar aviso |
| Usuário cancela | mantém acesso até `plan_until`, depois `plan = 'none'` |
| Chargeback | `plan = 'revoked'` imediato (perde acesso agora) |
| Reembolso | `plan = 'canceled'`, acesso encerra |
| Trial acaba | `plan` continua `'trial'`; o app gateia por `trial_until`; paywall aparece |

---

## 8. Página de planos

Uma tela no **app Base44** (`/planos` ou o próprio paywall):

- Um plano: **NortGo — R$ 9,90/mês**. (Anual à vista via Pix a 0% fica pra
  depois — outro botão, mesma tabela, `preference` avulsa em vez de `preapproval`.)
- Botão "Assinar" → função do Base44 cria o `preapproval` → redireciona pro MP.
- O **texto de marketing** dos planos pode ficar em `nortgo.com` (estático) com
  um "Assinar" que leva pro `nortgo.com.br` — mas o **checkout** é sempre no app.

---

## 9. Plano de execução — spike primeiro

### Fase 0 — Spike (1–2 dias, antes de qualquer código de produção)

1. **Base44:** provar as 3 capacidades do §3 —
   (a) função server-side que guarda um secret e faz `POST` externo (criar
   `preapproval` no **sandbox** do MP);
   (b) endpoint que **recebe** o webhook do MP e lê o corpo cru + headers (pra
   validar HMAC); se não der → testar (c) uma API autenticada do Base44 que um
   Worker externo possa chamar pra setar um campo no usuário.
   (d) função **agendada** (a reconciliação diária).
2. Testar no sandbox: pagar (`APRO`), recusar (`FUND`), pendente (`CONT`),
   **evento fora de ordem**, **chargeback**, webhook duplicado.
3. **Saída:** decide entre "tudo no Base44", "adaptador Worker" ou "manual".
   Vira uma ADR curta em `docs/`.

### Fase 1 — Implementação (só depois do passo 5 do PROJETO.md)

4. Plano + assinatura no MP (`/preapproval_plan`, `/preapproval`).
5. Função de webhook: validação HMAC + GET do recurso + idempotência + update
   de `user.plan`.
6. Tela de paywall + tela de planos no app.
7. Reconciliação agendada + fila de exceções + runbook.
8. `/mp-review` até ≥ 73 (mirar 100).
9. **Piloto pago 5–20 usuários** antes de tráfego amplo; revisar a fila de
   exceções todo dia.

---

## 10. Fora deste doc

- Valores finais e **unit economics** (taxa MP 4,98%/4,49%/3,98% + custo
  Base44/usuário + IA + imposto + chargeback + CAC) → `PROJETO.local.md`.
- NF‑e; fluxo comercial de reembolso/arrependimento (CDC).
- Plano anual à vista (Pix) — adicionar depois como 2º botão.
