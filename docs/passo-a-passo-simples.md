# NortGo no Base44 — passo a passo em linguagem simples

Objetivo: deixar o NortGo pronto para entrar na **Google Play** e na **App Store**,
com as pessoas conseguindo se cadastrar, pagar e usar.

## O que já está pronto

- O aplicativo funciona (cadastro, login, as 6 áreas).
- O site `nortgo.com` está no ar.
- Os dois domínios já apontam para o lugar certo.

## O que ainda falta, resumido

1. Algumas **regras** que as lojas de aplicativo exigem.
2. O **sistema de pagamento**.
3. Preparar a **página do app na loja** (a "vitrine").
4. **Testar**.
5. **Enviar** para a Google e a Apple aprovarem.

Abaixo, cada coisa explicada. Dividido entre **o que o Ricardo faz** (ele
programa no Base44) e **o que você faz** (Wesley).

---

# PARTE A — O que o RICARDO precisa fazer no app

### A1. Botão para a pessoa apagar a própria conta

**Por quê:** o Google obriga. Se a pessoa criou uma conta, ela tem que conseguir
apagar tudo quando quiser.

**O que é:**
- Um botão "Excluir minha conta" dentro das configurações do app.
- E uma página na internet (`nortgo.com.br/excluir-conta`) onde qualquer pessoa
  pede para apagar a conta — sem nem precisar entrar no app. O Google testa se
  essa página existe e funciona.

Quando a pessoa confirma, o app apaga tudo que ela guardou (tarefas, notas,
finanças, saúde) e cancela a assinatura.

### A2. Colocar os links de "Termos de Uso" e "Política de Privacidade" dentro do app

**Por quê:** o Google confere isso na hora de aprovar. Sem esses dois links, o
app é reprovado.

**O que é:** dois links, no rodapé ou nas configurações do app, que abrem
`nortgo.com/termos` e `nortgo.com/privacidade` (as páginas já existem).

### A3. Caixinha de "li e concordo" na hora de criar a conta

**Por quê:** o NortGo é pago e guarda dados de saúde e de dinheiro. A lei
brasileira exige que a pessoa confirme que leu as regras **antes** de criar a
conta.

**O que é:** um quadradinho para marcar — "Li e concordo com os Termos de Uso e a
Política de Privacidade" — e o botão "Criar conta" só libera depois que a pessoa
marca. O sistema guarda a data em que ela concordou.

### A4. Gerar a versão do app no padrão atual do Google

**Por quê:** o Google só aceita apps novos feitos para a versão recente do
Android (Android 16).

**O que é:** o Base44 já cuida disso; é só gerar a versão certa na hora de enviar.

### A5. A tela de "assine para continuar"

**Por quê:** a pessoa tem 7 dias grátis. Depois disso, para continuar usando,
precisa assinar.

**O que é:** uma página (`nortgo.com.br/assinatura`) que mostra, de forma bem
clara, antes de qualquer botão de pagar:
- "7 dias grátis, sem precisar de cartão"
- "Depois: R$ 9,90 por mês, renova sozinho, cancele quando quiser"
- "Cobrança pelo Mercado Pago"
- um link para os Termos de Uso

Quem está sem assinatura, ao abrir o app, cai nessa página.

### A6. O sistema de pagamento (Mercado Pago)

**Por quê:** é como o dinheiro entra. A cobrança acontece sozinha todo mês no
cartão da pessoa.

**O que é:** ligar o app ao Mercado Pago para cobrar a assinatura mensal e
receber o aviso automático quando o pagamento dá certo ou falha. É a parte mais
trabalhosa e a que precisa de mais cuidado com segurança — tem um documento só
sobre isso (`prompt-base44-pagamento.md`).

**Importante:** o app de celular vai ser **só de login**. O cadastro e o
pagamento acontecem só na versão de navegador. Dentro do app de celular **não
pode** ter nenhum botão ou link levando ao pagamento — é regra da Google e da
Apple.

### A7. Botão de "baixar meus dados"

**Por quê:** a lei dá à pessoa o direito de levar os próprios dados embora.

**O que é:** um botão nas configurações que gera um arquivo com tudo que a pessoa
guardou no NortGo.

---

# PARTE B — O que VOCÊ (Wesley) precisa fazer

### B1. Descobrir se sua conta do Google Play é "Pessoal" ou "de Organização"

**Por quê:** isso muda MUITO o prazo.
- Conta **pessoal** → o Google obriga um teste de **12 pessoas usando o app por
  14 dias seguidos** antes de você poder publicar.
- Conta **de organização** (com CNPJ) → **pula** esse teste, vai direto para a
  aprovação.

**Onde ver:** no Play Console → Configurações → Detalhes da conta do
desenvolvedor.

### B2. Decidir: pessoa física ou CNPJ (MEI)?

Isso define o nome que vai nos Termos e na Política, e resolve o B1.

**Recomendação:** abrir um **MEI**. É de graça, sai na hora pelo site do governo
(gov.br), e faz sua conta virar "de organização" — economizando 2 a 3 semanas de
teste.

### B3. Me passar os dados da empresa

Razão social (ou seu nome completo), CNPJ (se tiver) e endereço. Com isso eu
preencho os espaços em branco dos Termos e da Política de Privacidade.

### B4. Um advogado revisar os Termos e a Política

**Por quê:** você vai **cobrar dinheiro** e guardar **dados de saúde e
finanças**. Antes da primeira cobrança, vale ter um advogado (de Direito do
Consumidor e proteção de dados) confirmando que está tudo certo.

### B5. Conferir se o e-mail `contato@nortgo.com` está recebendo mensagens

É o canal oficial que aparece nos Termos, na Política e nas lojas. Se ele não
funcionar, dá problema na aprovação e com os clientes.

### B6. Criar a conta de desenvolvedor da Apple

Custa **US$ 99 por ano**. Pode fazer em paralelo com o resto.

### B7. Preparar a "vitrine" do app na loja

- Nome do app, uma descrição curta e uma completa.
- O ícone (imagem quadrada de 512×512).
- Uma imagem de destaque (1024×500).
- No mínimo 2 fotos do app funcionando (prints de celular).
- Escolher a categoria.
- Responder um questionário sobre o conteúdo (define a faixa etária — vai ser
  18+).
- Preencher o formulário de "Segurança dos dados" — eu já deixei as respostas
  prontas no documento `play-store-data-safety.md`.

### B8. Fazer os testes

- **Teste interno:** você e o time usam o app para ver se está tudo funcionando.
- **Se a conta for pessoal:** o teste de 12 pessoas reais usando por 14 dias
  seguidos. As pessoas precisam realmente abrir e usar o app (o Google verifica).
- **Se a conta for de organização:** pula direto.

### B9. Enviar para a Google e a Apple revisarem

- Eles analisam o app. A primeira vez costuma demorar mais — de alguns dias a
  duas semanas.
- **É normal ser reprovado na primeira.** Eles dizem o que corrigir, você
  corrige e reenvia.

### B10. Publicar 🎉

---

# A ordem das coisas

**Agora (podem acontecer ao mesmo tempo):**
- Você: B1, B2, B3, B5, B6
- Ricardo: A1, A2, A3, A4

**Em seguida:**
- Você: B4 (advogado), B7 (vitrine)
- Ricardo: A5, A6, A7

**Quando o app estiver pronto (A1 a A6 + B7):**
- Você: B8 (testes)

**Por último:**
- Você: B9 (enviar) e B10 (publicar)

---

# Quanto tempo, mais ou menos

- Se a conta for de **organização** (CNPJ): cerca de **3 a 5 semanas** até estar
  no ar.
- Se a conta for **pessoal**: some **mais 2 a 3 semanas** por causa do teste de
  14 dias.
- O trabalho do Ricardo: itens A1–A4 em torno de **1 semana**; A5–A6 em torno de
  **2 a 3 semanas**.

# Documentos de apoio

- `cronograma-base44.md` — a mesma lista, para mandar no WhatsApp.
- `prompt-base44-conformidade.md` — o detalhe técnico dos itens A1–A7, com os
  textos prontos da página de exclusão de conta.
- `prompt-base44-pagamento.md` — o detalhe técnico do pagamento (A6).
- `play-store-data-safety.md` — as respostas prontas do formulário de segurança
  dos dados (B7).
