# Prompt para o Base44 — o que falta para o NortGo entrar na Play Store e na App Store

Texto abaixo é para colar no Base44. A arquitetura de **pagamento** (Mercado
Pago recorrente + webhook) está no documento `prompt-base44-pagamento.md` — este
aqui cobre o resto: exclusão de conta, aceite dos termos, links legais, paywall,
rota inicial e exportação de dados.

---

## COLE A PARTIR DAQUI

### Contexto

O NortGo é um organizador pessoal **pago**: R$ 9,90/mês, com 7 dias de teste
grátis sem cartão. O app já tem cadastro e login em `nortgo.com.br`. Ele vai ser
publicado na **Google Play** e na **App Store**, e por isso precisa cumprir
algumas exigências dessas lojas e da LGPD.

- Site institucional: `https://www.nortgo.com` (fora do Base44). `nortgo.com.br/`
  já redireciona para lá.
- Termos de Uso: `https://www.nortgo.com/termos`
- Política de Privacidade: `https://www.nortgo.com/privacidade`

### Regras que valem para tudo

1. **O app para celular (Play Store / App Store) é só LOGIN.** Cadastro e
   pagamento acontecem só na versão web (`nortgo.com.br`).
2. **Dentro do app para celular, não coloque link nem botão que leve à página de
   pagamento.** Pode existir um texto tipo "assinatura inativa — assine pelo
   navegador em nortgo.com.br". (Regra da Google e da Apple.)
3. Os textos legais (Termos, Política) ficam no `nortgo.com` — o app só **linka**
   para eles, nunca hospeda uma cópia.

---

### 1. Exclusão de conta

#### 1a. Dentro do app (web e celular)

- Em **Configurações → Minha conta**, um botão **"Excluir minha conta"**.
- Pede confirmação (digitar a senha, ou digitar a palavra `EXCLUIR`).
- Ao confirmar:
  - apaga o perfil e **todo** o conteúdo do usuário: tarefas, notas,
    compromissos, rotinas, dados de saúde e dados financeiros;
  - cancela a assinatura no Mercado Pago (se houver);
  - desloga e mostra "Sua conta foi excluída";
  - envia um e-mail de confirmação da exclusão.
- **Não apagar**, mas manter isolado e sem uso: registros de acesso (por 6
  meses, exigência do Marco Civil) e dados de cobrança/nota fiscal (por 5 anos).

#### 1b. Página pública de exclusão — OBRIGATÓRIA pela Google

- URL exata: **`https://nortgo.com.br/excluir-conta`**
- Tem que abrir **sem estar logado** e **sem instalar o app**. Nunca pode ficar
  atrás de login.
- Conteúdo: um formulário com campo de **e-mail** + botão "Solicitar exclusão".
- Ao enviar: manda para esse e-mail um **link de confirmação** (para provar que a
  pessoa é a dona da conta).
- Ao clicar no link de confirmação: executa a mesma exclusão do item 1a.
- A página explica, em texto: o que será apagado e o que é retido por obrigação
  legal (registros de acesso 6 meses, dados fiscais 5 anos).

---

### 2. Aceite dos Termos e da Política no cadastro (web)

No formulário de **criar conta**:

- Um checkbox **desmarcado por padrão** (caixa pré-marcada não é permitida):

  > ☐ Li e concordo com os **Termos de Uso** e a **Política de Privacidade**

  - "Termos de Uso" → link para `https://www.nortgo.com/termos` (abre em nova aba)
  - "Política de Privacidade" → link para `https://www.nortgo.com/privacidade`

- O botão **"Criar conta" fica desabilitado** enquanto o checkbox não estiver
  marcado.
- Ao criar a conta, gravar no banco de dados do usuário: **data e hora do
  aceite** e a **versão dos documentos aceita** (use `2026-09-07` por enquanto).

---

### 3. Links de Termos e Política dentro do app (web e celular)

- No **rodapé** ou no menu de **Configurações**, dois links sempre visíveis:
  - "Termos de Uso" → `https://www.nortgo.com/termos`
  - "Política de Privacidade" → `https://www.nortgo.com/privacidade`
- A Google verifica isso na revisão. Sem esse link no app, o app é reprovado.

---

### 4. Página de assinatura (paywall) — `nortgo.com.br/assinatura`

Para onde o usuário **sem assinatura ativa** é enviado: logo depois de criar a
conta, e de novo quando os 7 dias de teste acabam.

A página precisa mostrar, de forma clara e **antes** de qualquer botão de pagar:

- "**7 dias grátis**, sem precisar de cartão"
- "Depois: **R$ 9,90 por mês**, renovação automática, cancele quando quiser"
- "Cobrança processada pelo **Mercado Pago**"
- uma linha: "Ao assinar, você concorda com os [Termos de Uso]" (link para
  `https://www.nortgo.com/termos`)

Botão: **"Começar meus 7 dias grátis"**. O fluxo de pagamento em si está no
documento de pagamento.

---

### 5. Rota inicial do app logado — `/inicio`

Hoje `nortgo.com.br/` redireciona para `nortgo.com` (a landing). Por isso a tela
inicial de quem está logado **não pode mais ser `/`**.

- Criar a rota **`/inicio`** com o conteúdo que hoje fica em `/`.
- Depois do login bem-sucedido, enviar o usuário para `/inicio`.
- O logo e qualquer botão de "início" dentro do app apontam para `/inicio`.
- Se o usuário logado **não tem assinatura ativa**, `/inicio` redireciona para
  `/assinatura`.

---

### 6. Exportar meus dados

- Em **Configurações → Minha conta**, botão **"Exportar meus dados"**.
- Gera um arquivo (JSON ou CSV) com **todo** o conteúdo do usuário (tarefas,
  notas, compromissos, rotinas, saúde, finanças, dados do perfil).
- Entrega por e-mail com link de download, ou download direto.
- Isso atende ao direito de portabilidade da LGPD, que está prometido na
  Política de Privacidade.

---

### Resumo — checklist do que entregar

- [ ] Botão "Excluir minha conta" no app (web + celular) com confirmação
- [ ] Página pública `nortgo.com.br/excluir-conta` (sem login, com confirmação por e-mail)
- [ ] Checkbox de aceite (Termos + Política) no cadastro, botão travado até marcar, aceite gravado com data/versão
- [ ] Links "Termos de Uso" e "Política de Privacidade" no rodapé/Configurações do app
- [ ] Página `nortgo.com.br/assinatura` com preço, teste grátis, renovação e link dos Termos
- [ ] Rota `/inicio` como tela inicial do logado; `/` deixa de ser a home do app
- [ ] `/inicio` redireciona para `/assinatura` quando não há assinatura ativa
- [ ] Botão "Exportar meus dados" no app

## FIM DO TEXTO PARA COLAR
