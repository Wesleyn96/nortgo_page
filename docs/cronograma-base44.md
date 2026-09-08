# Cronograma completo até publicar nas lojas (versão WhatsApp)

Cobre **tudo** que a Google Play e a App Store exigem — incluindo o teste
fechado de 12 pessoas por 14 dias. Marcado quem faz cada coisa:
**[BASE44]** = o desenvolvedor · **[VOCÊ]** = Wesley.

O que o Base44 constrói são as **Fases 1 e 2**. O resto é conta, ficha da loja,
teste e envio — feito por você, mas está aqui para o Base44 entender o prazo.

Detalhe técnico em `prompt-base44-conformidade.md` (Fase 1) e
`prompt-base44-pagamento.md` (Fase 2). Respostas do formulário "Segurança dos
dados" em `play-store-data-safety.md`.

---

## COLE A PARTIR DAQUI

*NortGo — cronograma completo para publicar na Play Store e na App Store*

*[BASE44]* = o desenvolvedor faz · *[VOCÊ]* = Wesley faz
O Base44 constrói as Fases 1 e 2. O resto entra aqui pra dar o prazo real.

━━━━━━━━━━━━━━━━━━
*FASE 0 — Decisões e contas (antes de tudo)*

*A) [VOCÊ] Decidir: pessoa física ou CNPJ* _(decide o cronograma inteiro)_
• Com *CNPJ* (conta de organização no Google): você fica *isento do teste de 12 pessoas / 14 dias*. Vai direto pra revisão.
• Com *pessoa física*: obrigatório o teste fechado de 12 testers por 14 dias corridos antes de poder publicar.
👉 Recomendação: abrir um *MEI* (grátis, na hora, no gov.br) e criar a conta como organização. Economiza 2 a 3 semanas.

*B) [VOCÊ] Criar a conta Google Play Console* — US$ 25 (uma vez). Verificação de identidade e endereço pode levar alguns dias.

*C) [VOCÊ] Criar a conta Apple Developer* — US$ 99/ano. Fazer em paralelo.

*D) [VOCÊ] Me mandar razão social, CNPJ e endereço* — eu preencho os Termos e a Política.

*E) [VOCÊ] Advogado revisa* os Termos e a Política (produto pago + dados de saúde/finanças = CDC + LGPD).

*F) [VOCÊ] Confirmar que contato@nortgo.com recebe e-mail.*

━━━━━━━━━━━━━━━━━━
*FASE 1 — [BASE44] Conformidade (destrava a revisão das lojas)* _(~1 semana)_

*1) Rota /inicio* _(rápido)_
nortgo.com.br/ agora redireciona pra fora, então a tela inicial de quem está logado não pode mais ser "/". Criar /inicio com o conteúdo de "/", mandar pra lá depois do login, apontar logo e botões de início pra /inicio.

*2) Exclusão de conta* _(médio)_
a) Botão "Excluir minha conta" em Configurações: apaga perfil + todo o conteúdo (tarefas, notas, compromissos, rotinas, saúde, finanças), cancela a assinatura, e-mail de confirmação.
b) Página pública nortgo.com.br/excluir-conta: abre *sem login*, formulário de e-mail + confirmação por link. A Google exige.
(Textos e e-mails prontos no documento de conformidade.)

*3) Links de Termos e Política dentro do app* _(rápido)_
Rodapé ou Configurações: "Termos de Uso" → nortgo.com/termos · "Política de Privacidade" → nortgo.com/privacidade. Sem isso o app é reprovado.

*4) Checkbox de aceite no cadastro (web)* _(rápido)_
Checkbox *desmarcado*: "Li e concordo com os Termos de Uso e a Política de Privacidade" (com links). Botão "Criar conta" travado até marcar. Gravar data/hora e versão do aceite.

*5) Build Android targetando Android 16 (API 36)* _(o Base44 cuida)_
Requisito da Play pra apps novos desde 31/08/2026.

━━━━━━━━━━━━━━━━━━
*FASE 2 — [BASE44] Assinatura e pagamento* _(~2 a 3 semanas)_

*6) Página /assinatura (paywall)* _(médio)_
Pra onde vai quem não tem assinatura ativa (após o cadastro e ao fim do teste de 7 dias). Antes do botão de pagar: "7 dias grátis sem cartão", "depois R$ 9,90/mês, renovação automática, cancele quando quiser", "cobrança pelo Mercado Pago", e "Ao assinar você concorda com os Termos" (link). Logado sem assinatura: /inicio manda pra /assinatura.

*7) Pagamento recorrente Mercado Pago* _(grande)_
Assinatura recorrente no cartão + webhook seguro (idempotente, validação de assinatura, conciliação). Arquitetura no documento de pagamento.

⚠️ *O app de celular é só LOGIN.* Sem cadastro e sem pagamento dentro dele. Nada de link/botão que leve ao pagamento no app de celular (regra da Google e da Apple).

━━━━━━━━━━━━━━━━━━
*FASE 3 — [VOCÊ] Preparar o Play Console (em paralelo com as Fases 1 e 2)*

• *Ficha da loja:* nome, descrição curta e completa, ícone 512×512, imagem de destaque 1024×500, no mínimo 2 prints de celular, categoria, e-mail de contato.
• *Classificação de conteúdo:* responder o questionário (IARC).
• *Formulário "Segurança dos dados":* já tenho as respostas rascunhadas.
• *Declarações de "Conteúdo do app":* política de privacidade (URL), anúncios (nenhum), público 18+, recursos financeiros, apps de saúde, e "acesso ao app" com uma *conta de teste com assinatura ativa* pro revisor.
• *URL de exclusão de conta:* nortgo.com.br/excluir-conta (da Fase 1).

━━━━━━━━━━━━━━━━━━
*FASE 4 — [VOCÊ] Testes* _(esta é a fase que depende da decisão da Fase 0-A)_

• *Teste interno* (até 100 pessoas, ativa na hora): o time faz o QA do app.
• *SE conta pessoa física — teste fechado obrigatório:*
  – recrutar *no mínimo 12 pessoas reais*, todas fazendo *opt-in*;
  – elas precisam *usar o app de verdade* (a Google verifica);
  – manter *14 dias corridos* com as 12 dentro;
  – só então "solicitar acesso à produção" → a Google analisa (pode levar ~7 dias).
• *SE conta de organização (CNPJ):* pula essa etapa, vai direto pra produção.
• A Google também roda um *relatório de pré-lançamento* automático em aparelhos reais.

━━━━━━━━━━━━━━━━━━
*FASE 5 — [VOCÊ] Enviar e publicar*

• Criar a versão de produção, subir o AAB (o Base44 gera).
• Enviar pra revisão. *A primeira revisão de um app novo costuma demorar mais* — de alguns dias a 1–2 semanas.
• Se reprovar (comum na primeira), corrigir e reenviar.
• Publicar.

━━━━━━━━━━━━━━━━━━
*FASE 6 — [VOCÊ] App Store (Apple), em paralelo desde a Fase 3*

• App Store Connect: ficha, prints por tamanho de tela, "Privacidade do app" (rótulos), URL da política, classificação etária, conformidade de exportação.
• A exclusão de conta no app (Fase 1) também vale pra Apple.
• Revisão da Apple: normalmente 24 a 48 h.

━━━━━━━━━━━━━━━━━━
*ESTIMATIVA REALISTA*

• Com CNPJ: ~4 a 6 semanas do zero até no ar (verificação de conta + Base44 + revisão).
• Com pessoa física: some +2 a 3 semanas por causa do teste fechado.
• Base44: Fase 1 ~1 semana · Fase 2 ~2 a 3 semanas (podem correr em paralelo com as Fases 0, 3 e 4).

Vou te enviar os documentos com o detalhe: *conformidade* (Fase 1), *pagamento* (Fase 2) e *segurança dos dados* (Fase 3).

## FIM DO TEXTO PARA COLAR
