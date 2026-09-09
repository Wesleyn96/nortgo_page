# Cronograma até publicar nas lojas — quem faz o quê (versão WhatsApp)

Divide o trabalho entre **[RICARDO]** (desenvolvedor, Base44) e **[WESLEY]**
(dono). Cobre tudo que a Google Play e a App Store exigem, incluindo o teste
fechado de 12 pessoas por 14 dias.

Detalhe técnico: `prompt-base44-conformidade.md` (parte do Ricardo, conformidade),
`prompt-base44-pagamento.md` (parte do Ricardo, pagamento),
`play-store-data-safety.md` (parte do Wesley, formulário do Console).

**Já resolvido (não entra no cronograma):**
- Conta Google Play Console criada e **aprovada**.
- Domínios unificados: `nortgo.com` e `nortgo.com.br` levam à landing; a home de
  quem já tem conta é `nortgo.com.br/home`.

---

## COLE A PARTIR DAQUI

*NortGo — cronograma para publicar na Play Store e na App Store*

Já feito: conta Google Play aprovada · domínios unificados (nortgo.com.br leva à landing; a home de quem tem conta é nortgo.com.br/home).

━━━━━━━━━━━━━━━━━━
*PARTE DO RICARDO (Base44)*

*R0) PRIMEIRO: abrir MEI + mudar a conta do Google Play para "organização"* _(desbloqueia tudo)_
A conta do Google Play hoje é *pessoal* — o que obriga um teste de 12 pessoas por 14 dias antes de publicar. Abrindo um *MEI* (grátis, na hora, gov.br) e mudando a conta para *"organização"* com o CNPJ, esse teste *deixa de ser obrigatório* (economiza 2–3 semanas). Depois: passar razão social, CNPJ e endereço pro Wesley (vão nos Termos e na Política).

*R1) Exclusão de conta* _(médio)_
a) Botão "Excluir minha conta" em Configurações: apaga o perfil e todo o conteúdo (tarefas, notas, compromissos, rotinas, saúde, finanças), cancela a assinatura, envia e-mail de confirmação.
b) Página pública *nortgo.com.br/excluir-conta*: abre *sem login*, formulário de e-mail + confirmação por link enviado no e-mail. A Google exige.
(Todos os textos e e-mails prontos no documento de conformidade.)

*R2) Links de Termos e Política dentro do app* _(rápido)_
No rodapé ou em Configurações: "Termos de Uso" → nortgo.com/termos e "Política de Privacidade" → nortgo.com/privacidade. Sem esse link o app é reprovado.

*R3) Checkbox de aceite no cadastro (web)* _(rápido)_
Checkbox *desmarcado*: "Li e concordo com os Termos de Uso e a Política de Privacidade" (com os dois links). Botão "Criar conta" travado até marcar. Gravar data/hora e a versão do aceite.

*R4) Build Android targetando Android 16 (API 36)* _(o Base44 cuida)_
Requisito da Play pra apps novos desde 31/08/2026.

*R5) Página /assinatura (paywall)* _(médio)_
Pra onde vai quem não tem assinatura ativa (após o cadastro e ao fim do teste de 7 dias). Antes do botão de pagar: "7 dias grátis sem cartão", "depois R$ 9,90/mês, renovação automática, cancele quando quiser", "cobrança pelo Mercado Pago", e "Ao assinar você concorda com os Termos" (link). Quem está logado sem assinatura em nortgo.com.br/home é levado pra /assinatura.

*R6) Pagamento recorrente com Mercado Pago* _(grande)_
Assinatura recorrente no cartão + webhook seguro (idempotente, validação de assinatura, conciliação). Arquitetura completa no documento de pagamento.

*R7) Exportar meus dados* _(médio)_
Botão em Configurações que gera um arquivo (JSON ou CSV) com todo o conteúdo do usuário. Direito de portabilidade da LGPD, prometido na Política.

⚠️ *O app de celular é só LOGIN.* Sem cadastro e sem pagamento dentro dele. Nada de link/botão que leve ao pagamento no app de celular (regra da Google e da Apple).

Prazo do Ricardo: R0 (MEI) sai na hora · R1–R4 ~1 semana · R5–R6 ~2 a 3 semanas · R7 por último.

━━━━━━━━━━━━━━━━━━
*PARTE DO WESLEY*

_(A conta do Google Play é *pessoal* — por isso o R0. Se o MEI/organização não for feito, é obrigatório o teste de 12 pessoas × 14 dias no W6.)_

*W1) Advogado revisar* os Termos e a Política (produto pago + dados de saúde/finanças = CDC + LGPD).

*W2) Confirmar que contato@nortgo.com recebe e-mail.*

*W3) Criar a conta Apple Developer* — US$ 99/ano. Em paralelo.

*W4) Preparar o Play Console* (pode adiantar enquanto o Ricardo desenvolve):
• Ficha da loja: nome, descrição curta e completa, ícone 512×512, imagem de destaque 1024×500, mínimo 2 prints de celular, categoria, e-mail de contato.
• Classificação de conteúdo (questionário IARC).
• Formulário "Segurança dos dados" — já tenho as respostas rascunhadas.
• Declarações de "Conteúdo do app": política (URL), anúncios (nenhum), público 18+, recursos financeiros, apps de saúde, "acesso ao app" com uma conta de teste com assinatura ativa pro revisor.
• URL de exclusão de conta: nortgo.com.br/excluir-conta (da parte do Ricardo).

*W5) Testes*:
• Teste interno (até 100 pessoas, ativa na hora): QA do app.
• Se o R0 (MEI/organização) foi feito: pula o teste fechado, vai direto pra produção.
• Se a conta continuar *pessoal*: teste fechado — recrutar no mínimo 12 pessoas reais, todas com opt-in, usando o app de verdade (a Google verifica), por 14 dias corridos → depois "solicitar acesso à produção" → Google analisa (~7 dias).
• A Google roda um relatório de pré-lançamento automático em aparelhos reais.

*W6) Enviar e publicar*:
• Criar a versão de produção, subir o AAB (o Ricardo gera).
• Enviar pra revisão. A primeira revisão de um app novo costuma demorar mais — de alguns dias a 1–2 semanas.
• Corrigir e reenviar se reprovar (comum na primeira). Publicar.

*W7) App Store (Apple)*, em paralelo desde o W4:
• App Store Connect: ficha, prints por tamanho de tela, "Privacidade do app" (rótulos), URL da política, classificação etária, conformidade de exportação.
• A exclusão de conta no app (R1) também vale pra Apple.
• Revisão da Apple: normalmente 24 a 48 h.

━━━━━━━━━━━━━━━━━━
*ORDEM (o que trava o quê)*

1. *Primeiro:* Ricardo faz o *R0* (MEI + conta de organização + passar os dados).
2. *Em paralelo:* Wesley faz W1 (advogado), W2 (e-mail), W3 (conta Apple) · Ricardo faz R1–R4.
3. *Em seguida:* Wesley faz W4 (ficha da loja) · Ricardo faz R5–R7.
4. *Quando o app estiver pronto (R1–R6 + W4):* Wesley faz W5 (testes).
5. *Por último:* Wesley faz W6 (enviar) e W7 (Apple).

*ESTIMATIVA*
• Com o R0 feito (conta de organização): ~3 a 5 semanas até no ar.
• Sem o R0 (conta continua pessoal): +2 a 3 semanas por causa do teste fechado.

Vou te enviar os documentos com o detalhe: *conformidade* (R1–R7), *pagamento* (R6) e *segurança dos dados* (W4).

## FIM DO TEXTO PARA COLAR
