# NortGo no Base44 — passo a passo em linguagem simples

Objetivo: deixar o NortGo pronto para entrar na **Google Play** e na **App Store**,
com as pessoas conseguindo se cadastrar, pagar e usar.

## O que já está pronto

- O aplicativo funciona (cadastro, login, as 6 áreas).
- O site `nortgo.com` está no ar.
- Os dois domínios já apontam para o lugar certo.

## O que ainda falta, resumido

1. Abrir um **MEI** e ajustar a conta da loja (isso muda o prazo — ver o Passo 0).
2. Algumas **regras** que as lojas de aplicativo exigem.
3. O **sistema de pagamento**.
4. Preparar a **página do app na loja** (a "vitrine").
5. **Testar**.
6. **Enviar** para a Google e a Apple aprovarem.

Dividido entre **o que o Ricardo faz** (ele programa e cuida da parte
técnica/burocrática no Base44) e **o que você faz** (Wesley).

---

# PASSO 0 — Abrir o MEI (a decisão que muda o prazo) — RICARDO

**A situação:** a conta do Google Play hoje é do tipo **"pessoal"**.

**O problema:** conta pessoal obriga um **teste de 12 pessoas usando o app por 14
dias seguidos** antes de você poder publicar. Isso atrasa tudo em 2 a 3 semanas.

**A solução:** abrir um **MEI** (Microempreendedor Individual). É **de graça**,
sai **na hora** pelo site do governo (gov.br), e com o CNPJ dá para mudar a conta
do Google Play para **"de organização"**. Aí o teste de 14 dias **deixa de ser
obrigatório**.

**O que precisa acontecer:**
1. Abrir o MEI.
2. Mudar o tipo da conta no Google Play para "organização" (usando o CNPJ do
   MEI).
3. Passar para o Wesley: **razão social, CNPJ e endereço** — o Claude usa esses
   dados para preencher os espaços em branco dos Termos e da Política.

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

### B1. Um advogado revisar os Termos e a Política

**Por quê:** você vai **cobrar dinheiro** e guardar **dados de saúde e
finanças**. Antes da primeira cobrança, vale ter um advogado (de Direito do
Consumidor e proteção de dados) confirmando que está tudo certo.

### B2. Conferir se o e-mail `contato@nortgo.com` está recebendo mensagens

É o canal oficial que aparece nos Termos, na Política e nas lojas. Se ele não
funcionar, dá problema na aprovação e com os clientes.

### B3. Criar a conta de desenvolvedor da Apple

Custa **US$ 99 por ano**. Pode fazer em paralelo com o resto.

### B4. Preparar a "vitrine" do app na loja

- Nome do app, uma descrição curta e uma completa.
- O ícone (imagem quadrada de 512×512).
- Uma imagem de destaque (1024×500).
- No mínimo 2 fotos do app funcionando (prints de celular).
- Escolher a categoria.
- Responder um questionário sobre o conteúdo (define a faixa etária — vai ser
  18+).
- Preencher o formulário de "Segurança dos dados" — o Claude já deixou as
  respostas prontas no documento `play-store-data-safety.md`.

### B5. Fazer os testes

- **Teste interno:** você e o time usam o app para ver se está tudo funcionando.
- **Se o Passo 0 (MEI) foi feito e a conta virou "organização":** não precisa de
  mais nada, vai direto para a aprovação.
- **Se a conta continuar "pessoal":** aí sim precisa do teste de 12 pessoas reais
  usando por 14 dias seguidos (elas têm que realmente abrir e usar o app — o
  Google verifica).

### B6. Enviar para a Google e a Apple revisarem

- Eles analisam o app. A primeira vez costuma demorar mais — de alguns dias a
  duas semanas.
- **É normal ser reprovado na primeira.** Eles dizem o que corrigir, você
  corrige e reenvia.

### B7. Publicar 🎉

---

# A ordem das coisas

**Primeiro de tudo:**
- Ricardo: **Passo 0** (abrir o MEI + mudar a conta do Google + passar os dados).

**Depois (podem acontecer ao mesmo tempo):**
- Você: B1 (advogado), B2 (e-mail), B3 (conta Apple)
- Ricardo: A1, A2, A3, A4

**Em seguida:**
- Você: B4 (vitrine)
- Ricardo: A5, A6, A7

**Quando o app estiver pronto (A1 a A6 + B4):**
- Você: B5 (testes)

**Por último:**
- Você: B6 (enviar) e B7 (publicar)

---

# Quanto tempo, mais ou menos

- **Com o MEI feito** (conta de organização): cerca de **3 a 5 semanas** até
  estar no ar.
- **Sem o MEI** (conta continua pessoal): some **mais 2 a 3 semanas** por causa
  do teste de 14 dias.
- O trabalho do Ricardo: itens A1–A4 em torno de **1 semana**; A5–A6 em torno de
  **2 a 3 semanas**.

# Documentos de apoio

- `cronograma-base44.md` — a mesma lista, para mandar no WhatsApp.
- `prompt-base44-conformidade.md` — o detalhe técnico dos itens A1–A7, com os
  textos prontos da página de exclusão de conta.
- `prompt-base44-pagamento.md` — o detalhe técnico do pagamento (A6).
- `play-store-data-safety.md` — as respostas prontas do formulário de segurança
  dos dados (B4).
