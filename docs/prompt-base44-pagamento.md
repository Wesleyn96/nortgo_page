# Prompt para o Base44 — sistema de assinatura paga (Mercado Pago)

> Copie o bloco abaixo e envie ao construtor do Base44. Ele descreve o que
> construir, o fluxo, o modelo de dados e **todas as camadas de segurança** que
> o Mercado Pago exige. Baseado em: guia técnico MP v5.2.0 + docs oficiais de
> Assinaturas (`/preapproval`) e de validação de webhook (`x-signature`).
>
> **Antes de enviar:** decida se quer **7 dias de teste grátis** (recomendado) ou
> **paywall imediato** — o prompt cobre os dois, marque o que vale.

---

```
CONTEXTO

O NortGo é um app de organização pessoal construído aqui no Base44, publicado em
www.nortgo.com.br. Ele JÁ TEM cadastro e login funcionando (e-mail/senha e
Google).

DOMÍNIOS:
- www.nortgo.com  = a LANDING (página de apresentação). Site estático, hospedado
  no Cloudflare, FORA do Base44. Não mexa nele.
- www.nortgo.com.br = ESTE app (Base44).
- Os dois domínios devem levar o visitante à MESMA landing. Para isso: quando
  alguém acessa www.nortgo.com.br SEM ESTAR LOGADO e SEM UM CAMINHO específico
  (a raiz "/"), o Base44 deve REDIRECIONAR para https://www.nortgo.com.
  Usuário JÁ LOGADO na raiz → vai direto pro app, como hoje.
- A landing (www.nortgo.com) tem um botão "Assinar" que aponta para
  https://www.nortgo.com.br/login. É por aí que o visitante entra.

FLUXO DE ENTRADA (a ordem):
1. Visitante na landing clica "Assinar" → vai para www.nortgo.com.br/login.
2. Faz o cadastro / login (que já existe).
3. Depois de logado, se NÃO tiver assinatura válida → o app o leva para
   www.nortgo.com.br/planos (o paywall). Se tiver → entra no app normal.

MUDANÇA DE MODELO: o NortGo passa a ser um PRODUTO PAGO. Sem assinatura ativa, o
app NÃO abre. Preço: R$ 9,90/mês, cobrança RECORRENTE no CARTÃO DE CRÉDITO via
Mercado Pago (produto "Assinaturas" / preapproval).
[ ] Com 7 dias de teste grátis sem cartão   (marque um)
[ ] Paywall imediato após o cadastro


OBJETIVO

Construir, DENTRO deste app Base44, o sistema completo de assinatura:
1. Uma tela de "paywall / planos" que aparece para todo usuário sem assinatura.
2. A criação da assinatura no Mercado Pago (backend).
3. Um endpoint de webhook que recebe as notificações do Mercado Pago e atualiza
   o acesso do usuário.
4. Uma rotina agendada diária de reconciliação.
5. O "gate" de acesso: o app inteiro só funciona se o usuário tiver assinatura
   válida.

Toda a lógica de dinheiro fica NESTE app Base44 — não há segundo sistema, não há
segundo banco. O campo que libera o acesso fica no próprio usuário.


MODELO DE DADOS

Adicione ao usuário (ou uma entidade "assinatura" 1‑para‑1 com o usuário):
  - plan            : texto — um de: none | trial | active | past_due | canceled | revoked
  - plan_until      : data/hora — fim do período pago (vem da RESPOSTA do Mercado Pago)
  - trial_until     : data/hora — só se usar trial
  - mp_preapproval_id : texto — id da assinatura no Mercado Pago
  - mp_payer_email  : texto
  - last_mp_event_at : data/hora — o "date_created" do último evento do MP já aplicado

Entidade "mp_webhook_events" (idempotência):
  - mp_event_id (único / chave)  — id da notificação
  - received_at, processed (bool)

Entidade "billing_log" (auditoria, só insere, nunca edita/apaga):
  - user_id, event, detail (texto/json), mp_event_id, created_at


REGRA DE ACESSO (o "gate")

Em toda a área logada, o usuário só tem acesso se:
  plan == 'active'  E  plan_until > agora
  OU  (usando trial:)  plan == 'trial'  E  trial_until > agora
Caso contrário → redireciona para a tela de paywall. Sem exceção, em todas as
telas do app.


FLUXO DE ASSINATURA (passo a passo)

1. Usuário sem assinatura vê o paywall: "Assine o NortGo — R$ 9,90/mês" + botão.

2. Ao clicar, uma FUNÇÃO DE BACKEND (nunca o frontend) chama o Mercado Pago:
   POST https://api.mercadopago.com/preapproval
   Headers: Authorization: Bearer <ACCESS_TOKEN>   (ver SEGURANÇA #1)
            X-Idempotency-Key: <UUID v4 único por tentativa>
   Corpo:
   {
     "reason": "NortGo — assinatura mensal",
     "external_reference": "<ID DO USUÁRIO NESTE APP BASE44>",   <-- OBRIGATÓRIO
     "payer_email": "<e-mail do usuário logado>",
     "auto_recurring": {
       "frequency": 1,
       "frequency_type": "months",
       "transaction_amount": 9.90,
       "currency_id": "BRL"
       // se for usar trial pago pelo MP: "free_trial": { "frequency": 7, "frequency_type": "days" }
     },
     "back_url": "https://www.nortgo.com.br/assinatura/retorno",
     "status": "pending"
   }
   Guarde o "id" retornado em user.mp_preapproval_id.
   Redirecione o usuário para o "init_point" retornado (checkout hospedado do MP).

3. Usuário coloca o cartão NO AMBIENTE DO MERCADO PAGO (nunca neste app) e
   autoriza.

4. O Mercado Pago redireciona o usuário de volta para a back_url.
   IMPORTANTE: essa volta é só visual. Ela NÃO deve liberar o acesso.
   Nessa tela, mostre "confirmando seu pagamento..." e faça o app re-checar o
   estado do usuário (que só muda pelo webhook, passo 5).

5. O Mercado Pago chama o WEBHOOK (endpoint deste app). Ver a seção WEBHOOK.

6. Renovação mensal: o MP cobra sozinho todo mês e dispara webhook. A função
   estende user.plan_until.

7. Falha de cobrança: o MP tenta de novo (até 4× em 10 dias úteis) e CANCELA a
   assinatura automaticamente após 3 recusas seguidas. A função marca
   user.plan = 'past_due' ao ver a recusa; quando plan_until passar, o gate já
   bloqueia sozinho.


WEBHOOK — endpoint que recebe as notificações do Mercado Pago

Crie um endpoint público (ex.: POST /api/webhooks/mercadopago). Ele DEVE, NESTA
ORDEM, antes de qualquer outra coisa:

A) VALIDAR A ASSINATURA (x-signature) — HMAC-SHA256. Sem isto, rejeite com 401.
   - Leia os headers: "x-signature" e "x-request-id".
   - O header x-signature vem assim:  ts=1700000000000,v1=<hash hex>
     Separe o "ts" e o "v1".
   - Pegue o "data.id" (id do recurso) do corpo OU do query param "data.id"
     (use minúsculo; se vier com letras, mantenha como veio).
   - Monte a string do manifesto EXATAMENTE assim (com os ponto-e-vírgula e sem
     espaços):
       id:<data.id>;request-id:<x-request-id>;ts:<ts>;
   - Calcule HMAC-SHA256(secret = <WEBHOOK_SECRET>, mensagem = manifesto), em
     hexadecimal.
     (<WEBHOOK_SECRET> é a "Chave secreta" do painel do MP em
      Webhooks > Configurar notificação — guarde como secret, ver SEGURANÇA #1)
   - Compare, em tempo constante, com o "v1". Diferente → 401 e pare.

B) VALIDAR O TIMESTAMP (anti-replay):
   - Rejeite (401) se |agora - ts| > 5 minutos.
   - Guarde o par (mp_event_id) processado; se já existe em mp_webhook_events →
     responda 200 e NÃO reprocesse (idempotência).

C) CONFIRMAR NA FONTE (não confie no corpo da notificação):
   - Faça um GET na API do MP pelo id recebido:
       tópico preapproval / subscription_authorized_payment:
         GET https://api.mercadopago.com/authorized_payments/<id>
       tópico payment:
         GET https://api.mercadopago.com/v1/payments/<id>
       tópico preapproval (estado da assinatura):
         GET https://api.mercadopago.com/preapproval/<id>
     com Authorization: Bearer <ACCESS_TOKEN>.
   - Use os dados DESSA resposta, não os do webhook.

D) RESOLVER O USUÁRIO:
   - Pegue o "external_reference" do recurso → é o ID do usuário neste app.
   - Se não bater com nenhum usuário → billing_log + alerta, responde 200, não faz nada.
   - NUNCA resolva o usuário por e-mail vindo do cliente ou por qualquer campo
     que o comprador possa ter digitado.

E) VALIDAR O VALOR:
   - Se o recurso indica pagamento aprovado, confira que o valor é R$ 9,90
     (transaction_amount / amount). Valor diferente → billing_log + alerta, não libera.

F) APLICAR A MUDANÇA (com ordenação):
   - Só aplique se  evento.date_created  >  user.last_mp_event_at  (ignore evento
     mais antigo que o último já aplicado).
   - Estados 'revoked' (chargeback) e 'canceled' são DOMINANTES: um evento de
     "aprovado" que chega depois NÃO reabre o acesso.
   - Mapeamento:
       pagamento aprovado / assinatura authorized  → plan='active',
                                                      plan_until = fim do período do MP
       pagamento recusado                          → plan='past_due'
       assinatura cancelled (pelo usuário/MP)      → plan='canceled'
                                                     (mantém acesso até plan_until)
       chargeback (topic_chargebacks_wh)           → plan='revoked' IMEDIATO
       reembolso                                   → plan='canceled'
   - Atualize user.last_mp_event_at com o date_created do evento.
   - Grave tudo em billing_log.

G) RESPONDER:
   - Responda HTTP 200 (ou 201) em ATÉ 22 SEGUNDOS, sempre. Se demorar, o MP
     considera perdido e reenvia (0min, 15min, 30min, 6h, 48h, 96h x3).
   - Faça o processamento pesado (GET na API, etc.) de forma rápida; se precisar,
     responda 200 e continue em background — mas só depois de já ter gravado o
     mp_event_id como recebido.

H) ALERTA DE FRAUDE (tópico stop_delivery_op_wh):
   - Esse tópico NÃO tem retry. Se receber, responda 200 na hora e trate o
     usuário como suspeito (plan='revoked' + alerta pro operador).


CAMADAS DE SEGURANÇA — checklist obrigatório

1. ACCESS TOKEN e WEBHOOK SECRET do Mercado Pago ficam SÓ como secret/variável de
   ambiente do backend. NUNCA no frontend, NUNCA em campo de entidade, NUNCA em
   log. O frontend só recebe o "init_point" (URL de checkout).
2. O webhook SEMPRE valida x-signature (HMAC-SHA256) ANTES de qualquer lógica.
3. O webhook SEMPRE faz GET do recurso na API do MP por id para confirmar —
   nunca decide pelo corpo da notificação.
4. Idempotência: cada mp_event_id é processado uma única vez.
5. Validação de valor: pagamento aprovado só libera se for R$ 9,90.
6. Vínculo por external_reference = ID do usuário no app. Nunca por dado que o
   cliente controla.
7. A volta do checkout (back_url) é apenas visual — NÃO concede acesso.
8. O acesso é decidido SEMPRE lendo user.plan + user.plan_until do banco, em
   toda requisição da área logada. Sem cache que possa ficar desatualizado.
9. Ordenação de eventos: aplica só se mais novo que o último; chargeback e
   cancelamento são dominantes e não são revertidos por evento posterior.
10. billing_log é append-only (só insere).
11. HTTPS obrigatório em tudo (já é o padrão aqui).
12. A criação da assinatura (POST /preapproval) só pode ser disparada por um
    usuário AUTENTICADO, e usa o ID DELE — um usuário não pode criar/cancelar
    assinatura em nome de outro.
13. Rate-limit no endpoint que cria a assinatura (evita spam).
14. Ambiente de teste (sandbox) do Mercado Pago com credenciais SEPARADAS das de
    produção. Todo o fluxo testado no sandbox antes de ligar em produção.
15. Nenhum dado de cartão passa por este app (checkout hospedado do MP) — mantém
    o escopo PCI mínimo (SAQ-A).


RECONCILIAÇÃO — rotina agendada diária

Uma função que roda 1x/dia:
1. Lista as assinaturas da conta no MP (GET /preapproval/search) e compara com o
   que está no banco deste app.
2. O Mercado Pago é a fonte de verdade dos fatos de dinheiro. Corrija o banco:
   - MP cancelou / banco 'active'      → banco = 'canceled'
   - MP ativo e pago / banco 'past_due' (webhook perdido) → banco = 'active',
     estende plan_until
   - MP chargeback / banco qualquer    → banco = 'revoked'
3. Divergência de valor ou disputa em andamento → NÃO corrige sozinho: registra
   numa "fila de exceções" e alerta o operador.
4. Todo reparo é idempotente (rodar 2x não muda nada a mais) e vai pro billing_log.


TELA DE PLANOS / PAYWALL

- Um plano: "NortGo — R$ 9,90/mês", cobrança recorrente no cartão.
- Se usar trial: "7 dias grátis, depois R$ 9,90/mês. Cancele quando quiser."
- Botão "Assinar" → dispara a função de backend (POST /preapproval) → redireciona
  pro checkout do MP.
- Logo abaixo do botão, um aviso de aceite (exigência do Código de Defesa do
  Consumidor): "Ao assinar, você concorda com os Termos de Uso e a Política de
  Privacidade." — "Termos de Uso" linka para https://www.nortgo.com/termos e
  "Política de Privacidade" para https://www.nortgo.com/privacidade (abrem em
  nova aba). Registre no billing_log que o usuário aceitou (data/hora + versão).
- Um link "Já assinei / atualizar status" que re-checa o estado do usuário.
- Área "Minha assinatura": mostra status, próxima cobrança (plan_until), e um
  botão "Cancelar assinatura" (chama PUT /preapproval/<id> com status "cancelled";
  mantém acesso até plan_until).


O QUE VOCÊ (BASE44) PRECISA ME CONFIRMAR OU AVISAR

Antes de construir, me diga claramente se ESTE app consegue:
  a) Rodar função de BACKEND que guarda um SECRET e faz chamada HTTP de saída
     (para api.mercadopago.com).  [sim/não]
  b) Expor um ENDPOINT PÚBLICO que RECEBE POST externo e me dá acesso ao CORPO
     CRU + HEADERS da requisição (necessário para validar o x-signature).  [sim/não]
  c) Rodar uma FUNÇÃO AGENDADA (cron) diária.  [sim/não]
  d) REDIRECIONAR a raiz "/" de www.nortgo.com.br, quando o visitante NÃO está
     logado, para uma URL externa (https://www.nortgo.com).  [sim/não]

Se (b) for "não": me avise — nesse caso o webhook do Mercado Pago será recebido
por um pequeno serviço externo (sem banco) que valida a assinatura e chama uma
API deste app para atualizar o usuário; você me diz qual API autenticada posso
usar para setar user.plan / user.plan_until.

Se algo aqui não for possível no plano atual do Base44, liste exatamente o quê.
```

---

## Fontes técnicas usadas neste prompt

- Guia técnico Mercado Pago v5.2.0 (fornecido pelo dono).
- [Mercado Pago — Criar assinatura (`POST /preapproval`)](https://www.mercadopago.com.br/developers/pt/reference/subscriptions/_preapproval/post)
- [Mercado Pago — Assinaturas com plano associado](https://www.mercadopago.com.br/developers/pt/docs/subscriptions/integration-configuration/subscription-associated-plan)
- [Mercado Pago — Pagamentos autorizados de assinatura](https://www.mercadopago.com.br/developers/pt/docs/subscriptions/integration-configuration/subscription-no-associated-plan/authorized-payments)
- [Validação do `x-signature` (HMAC-SHA256), manifesto `id:...;request-id:...;ts:...;`](https://www.mercadopago.com.mx/developers/en/docs/checkout-pro/payment-notifications.md)
