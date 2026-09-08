# Cronograma para o Base44 (versão WhatsApp)

Texto abaixo formatado para colar direto numa conversa de WhatsApp. O detalhe
técnico está em `prompt-base44-conformidade.md` (fases 1 e 3) e
`prompt-base44-pagamento.md` (fase 2).

---

## COLE A PARTIR DAQUI

*NortGo — o que falta para publicar na Play Store e na App Store*

Contexto rápido:
• O app já tem cadastro e login em nortgo.com.br
• É pago: R$ 9,90/mês, com 7 dias grátis sem cartão
• nortgo.com.br/ já redireciona para nortgo.com (a landing)
• Termos: nortgo.com/termos — Política: nortgo.com/privacidade
• O app de celular é *só login*: cadastro e pagamento só na versão web. Dentro do app de celular não pode ter link/botão que leve ao pagamento (regra da Google e da Apple).

━━━━━━━━━━━━━━━━━━
*FASE 1 — Urgente (destrava o login e a revisão das lojas)*

*1) Rota /inicio* _(rápido)_
Como nortgo.com.br/ agora redireciona para fora, a tela inicial de quem está logado não pode mais ser "/". Criar a rota /inicio com o conteúdo que hoje fica em "/", mandar o usuário para lá depois do login, e apontar o logo e os botões de "início" para /inicio.

*2) Exclusão de conta* _(médio)_
a) Botão "Excluir minha conta" em Configurações: apaga o perfil e todo o conteúdo (tarefas, notas, compromissos, rotinas, saúde, finanças), cancela a assinatura e envia e-mail de confirmação.
b) Página pública nortgo.com.br/excluir-conta: abre *sem login*, com formulário de e-mail e confirmação por link enviado no e-mail. A Google exige essa página.
(Todos os textos e e-mails já estão prontos no documento de conformidade.)

*3) Links de Termos e Política dentro do app* _(rápido)_
No rodapé ou em Configurações: "Termos de Uso" → nortgo.com/termos e "Política de Privacidade" → nortgo.com/privacidade. Sem esse link o app é reprovado na revisão.

*4) Checkbox de aceite no cadastro (web)* _(rápido)_
Checkbox *desmarcado*: "Li e concordo com os Termos de Uso e a Política de Privacidade" (com os dois links). O botão "Criar conta" fica travado até marcar. Gravar data/hora e a versão do aceite.

━━━━━━━━━━━━━━━━━━
*FASE 2 — Assinatura e pagamento (o grosso do trabalho)*

*5) Página /assinatura (paywall)* _(médio)_
Para onde vai quem não tem assinatura ativa: logo após o cadastro e quando os 7 dias de teste acabam. Mostrar, antes do botão de pagar: "7 dias grátis sem cartão", "depois R$ 9,90/mês, renovação automática, cancele quando quiser", "cobrança pelo Mercado Pago" e a linha "Ao assinar você concorda com os Termos" (com link). Usuário logado sem assinatura: /inicio redireciona para /assinatura.

*6) Pagamento recorrente com Mercado Pago* _(grande)_
Assinatura recorrente no cartão de crédito + webhook seguro (idempotente, com validação de assinatura e conciliação). Toda a arquitetura de segurança está no documento de pagamento.

━━━━━━━━━━━━━━━━━━
*FASE 3 — Depois do lançamento*

*7) Exportar meus dados* _(médio)_
Botão em Configurações que gera um arquivo (JSON ou CSV) com todo o conteúdo do usuário. É o direito de portabilidade da LGPD, prometido na Política.

━━━━━━━━━━━━━━━━━━
Estimativa: a Fase 1 sai em poucos dias. A Fase 2 é o item maior. A Fase 3 pode ir depois do lançamento.

Vou te enviar dois documentos com o detalhe técnico: um de *conformidade* (fases 1 e 3) e um de *pagamento* (fase 2).

## FIM DO TEXTO PARA COLAR
