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
*PARTE DO RICARDO (Base44) — construir no app*

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

Prazo do Ricardo: R1–R4 ~1 semana · R5–R6 ~2 a 3 semanas · R7 pode ficar por último.

━━━━━━━━━━━━━━━━━━
*PARTE DO WESLEY*

*W1) Confirmar o tipo da conta Google Play* _(decide o cronograma inteiro)_
No Play Console → Configurações → Detalhes da conta do desenvolvedor: é *"Pessoal"* ou *"Organização"*?
• *Organização* (tem CNPJ): *isento do teste de 12 pessoas / 14 dias*.
• *Pessoal*: obrigatório o teste fechado de 12 testers por 14 dias corridos antes de publicar.
👉 Se for pessoal, dá pra migrar para organização com um CNPJ (um MEI serve, grátis, sai na hora). Economiza 2 a 3 semanas.

*W2) Definir CNPJ / razão social / endereço* e me passar → eu preencho os Termos e a Política. Devem bater com os dados da conta Google.

*W3) Advogado revisar* os Termos e a Política (produto pago + dados de saúde/finanças = CDC + LGPD).

*W4) Confirmar que contato@nortgo.com recebe e-mail.*

*W5) Criar a conta Apple Developer* — US$ 99/ano. Em paralelo.

*W6) Preparar o Play Console* (pode adiantar enquanto o Ricardo desenvolve):
• Ficha da loja: nome, descrição curta e completa, ícone 512×512, imagem de destaque 1024×500, mínimo 2 prints de celular, categoria, e-mail de contato.
• Classificação de conteúdo (questionário IARC).
• Formulário "Segurança dos dados" — já tenho as respostas rascunhadas.
• Declarações de "Conteúdo do app": política (URL), anúncios (nenhum), público 18+, recursos financeiros, apps de saúde, "acesso ao app" com uma conta de teste com assinatura ativa pro revisor.
• URL de exclusão de conta: nortgo.com.br/excluir-conta (da parte do Ricardo).

*W7) Testes* (depende do W1):
• Teste interno (até 100 pessoas, ativa na hora): QA do app.
• Se conta *pessoal*: teste fechado — recrutar no mínimo 12 pessoas reais, todas com opt-in, usando o app de verdade (a Google verifica), por 14 dias corridos → depois "solicitar acesso à produção" → Google analisa (~7 dias).
• Se conta *organização*: pula, vai direto pra produção.
• A Google roda um relatório de pré-lançamento automático em aparelhos reais.

*W8) Enviar e publicar*:
• Criar a versão de produção, subir o AAB (o Ricardo gera).
• Enviar pra revisão. A primeira revisão de um app novo costuma demorar mais — de alguns dias a 1–2 semanas.
• Corrigir e reenviar se reprovar (comum na primeira). Publicar.

*W9) App Store (Apple)*, em paralelo desde o W6:
• App Store Connect: ficha, prints por tamanho de tela, "Privacidade do app" (rótulos), URL da política, classificação etária, conformidade de exportação.
• A exclusão de conta no app (R1) também vale pra Apple.
• Revisão da Apple: normalmente 24 a 48 h.

━━━━━━━━━━━━━━━━━━
*ORDEM (o que trava o quê)*

1. *Agora:* Wesley faz W1, W2, W4, W5 · Ricardo começa R1–R4.
2. *Em paralelo:* Wesley faz W3 (advogado) e W6 (ficha da loja) · Ricardo faz R5–R6.
3. *Quando o app estiver pronto (R1–R6 + W6):* Wesley faz W7 (testes).
4. *Depois do teste:* Wesley faz W8 (enviar) e W9 (Apple).

*ESTIMATIVA*
• Conta de organização: ~3 a 5 semanas até no ar.
• Conta pessoal: +2 a 3 semanas por causa do teste fechado.

Vou te enviar os documentos com o detalhe: *conformidade* (R1–R7), *pagamento* (R6) e *segurança dos dados* (W6).

## FIM DO TEXTO PARA COLAR
