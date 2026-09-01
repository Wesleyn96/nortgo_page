# NortGo — Documento de Acompanhamento do Projeto

> Documento vivo. Registra **onde o projeto está**, **por que as decisões foram
> tomadas** e **para onde vamos**. Deve ser atualizado sempre que algo relevante
> mudar (nova feature, decisão de produto/design, mudança de rumo, marco atingido).

- **Última atualização:** 2026-09-01
- **Responsável pelo projeto:** Wesley Nascimento
- **Repositório:** git, branch principal `main`
- **Domínio de produção previsto:** https://nortgo.app

---

## Como manter este documento

1. **O que entra aqui:** direção do produto, decisões e o motivo delas, status de
   cada frente, roadmap, riscos e pendências. Nada que o próprio código/git já
   conte sozinho (estrutura de pastas trivial, histórico de commit).
2. **O que NÃO entra aqui:** segredos (tokens, senhas, `DATABASE_URL`), estratégia
   comercial sensível, dados de pessoas. Isso vai em **`PROJETO.local.md`** (na
   raiz, fora do git) ou, no caso de credenciais, em `.env.local`.
3. **Ritmo:** a cada sessão de trabalho significativa, atualize a seção afetada e
   registre a mudança em [Registro de decisões](#registro-de-decisões) e/ou
   [Histórico do documento](#histórico-do-documento). Atualize a data no topo.
4. **Ao usar o Codex/agente:** peça uma releitura do estado atual e concilie com
   o que está escrito aqui — este arquivo é a fonte de verdade da *intenção*, o
   código é a fonte de verdade da *implementação*.

---

## 1. Visão geral do produto

**NortGo** é um sistema pessoal de organização da vida: reúne **rotina, tarefas,
notas, agenda, finanças e saúde** num único lugar e mostra **apenas o que merece
atenção agora**, sem exigir que o usuário organize nada manualmente.

- **Proposta central:** reduzir carga mental. "Você joga tudo nele → o NortGo
  filtra por prazo/rotina/prioridade → você vê só o essencial do dia."
- **Também existem "Espaços":** áreas da vida que o usuário organiza do próprio
  jeito, para o que não cabe nas seis categorias.
- **Plataformas-alvo:** Web, App Store (iOS) e Google Play (Android) — mesmo
  sistema em todos.
- **Estado atual do produto:** **não existe app**. O que existe é a **landing
  page de conversão** (este repositório), focada em captar lista de espera até o
  lançamento.
- **Modelo de negócio pretendido:** plano essencial gratuito + plano pago
  ("NortGo Plus"), pagamento via Mercado Pago dentro do app. Preços ainda não
  definidos. Quem entra na lista de espera ganha condição especial de lançamento.

### Público e posicionamento

- Pessoas sobrecarregadas por ter a vida espalhada em vários apps.
- Diferencial de mensagem: os concorrentes "te dão mais uma lista para olhar"; o
  NortGo "faz o oposto" — recebe tudo e devolve só o essencial.
- Tom da marca: editorial, calmo, quente. Sem hype de produtividade agressiva.

---

## 2. Situação atual — resumo executivo

| Frente | Status | Observação |
|---|---|---|
| Landing page (design + copy) | 🟢 Funcional e coesa | Todas as seções implementadas |
| Captação de leads (waitlist) | 🟢 Operacional | Via Formspree; falta fluxo de exportação/contato |
| SEO técnico | 🟢 Encaminhado | metadata, OG, Twitter, sitemap, robots, JSON-LD |
| Cabeçalhos de segurança | 🟢 Aplicados | CSP, HSTS, etc. em `next.config.ts` |
| Política de privacidade | 🟡 Modelo inicial | Campos `[destaque]` a preencher + revisão jurídica |
| Preços / planos | 🔴 Em aberto | `Pricing.tsx` existe mas está desativado; Plus "A definir" |
| Backend / pagamento | 🔴 Não iniciado | Só planejado (`.env.example`) |
| Testes automatizados | 🔴 Inexistentes | Nenhum framework configurado |
| Analytics / métricas | 🔴 Não integrado | Há `data-track` no HTML, sem biblioteca |
| App (produto real) | 🔴 Não iniciado | Fora do escopo deste repo hoje |

Legenda: 🟢 ok · 🟡 atenção · 🔴 pendente/não iniciado

---

## 3. Stack técnica

- **Framework:** Next.js `16.3.3` (App Router, `src/app/`). Versão fixada.
- **UI:** React `19.2.8`, TypeScript `^5` (strict), Tailwind CSS `^4`
  (`@import "tailwindcss"` + `@tailwindcss/postcss`).
- **Animação:** Motion `^13.1.1` (`motion/react`). Easing cinematográfico
  compartilhado em `src/lib/motion.ts` (`[0.22, 1, 0.36, 1]`).
- **Imagens:** `next/image` com imports estáticos.
- **Lint:** ESLint `^9` Flat Config (`eslint.config.mjs`), regras
  `core-web-vitals` + TS do `eslint-config-next`.
- **Gerenciador de pacotes:** npm (`package-lock.json`).
- **Scripts:** `dev`, `build`, `start`, `lint`. **Sem** script de testes ou
  type-check dedicado.
- **Hospedagem recomendada:** Vercel (HTTPS automático, preview por PR).
- **Integrações externas:** apenas **Formspree** (formulário da waitlist),
  endpoint em `src/lib/waitlist.ts`.

### ⚠️ Este Next.js tem breaking changes (ver `AGENTS.md`)

Antes de escrever código, consultar `node_modules/next/dist/docs/`. Pontos que
mordem:

- Turbopack é o bundler padrão de `dev` **e** `build`.
- `params`, `searchParams`, `cookies()`, `headers()`, `draftMode()` são
  **exclusivamente assíncronos**.
- `middleware.ts` foi depreciado → convenção nova é **`proxy.ts`**.
- `next lint` foi removido (o projeto já chama `eslint` direto).
- Requer Node.js `20.9+`, TypeScript `5.1+`.
- React Compiler e Cache Components/PPR são suportados mas **não estão
  habilitados**.

---

## 4. Estrutura de arquivos (mapa)

```
src/
  app/
    layout.tsx           layout raiz: pt-BR, metadata, favicons, JSON-LD
                         SoftwareApplication, script anti-flash de tema,
                         Nav + Footer + ThemeToggle
    page.tsx             composição e ordem das seções da home
                         (Pricing importado mas comentado)
    globals.css          tokens dos temas claro/escuro, tipografia, gradientes,
                         botões liquid-glass, sombras, animações CSS
    privacidade/page.tsx política de privacidade (noindex) — MODELO INICIAL
    robots.ts            permite home, bloqueia /privacidade
    sitemap.ts           só a home entra no índice
    opengraph-image.tsx  imagem social 1200×630 gerada
    twitter-image.tsx    reaproveita a arte OG
  components/            um arquivo por seção/peça visual
    Hero, Preview, Problem, SixApps, Features, HowItWorks,
    CtaBand, Platforms, Faq, CtaFinal            → seções da página ativa
    Nav, Footer, ThemeToggle, Waitlist, WaitlistProof → compartilhados
    IpadMockup, IphoneMockup, AppMockup          → mockups do produto
    Pricing.tsx                                  → implementado, NÃO renderizado
  lib/
    motion.ts            easing cinematográfico compartilhado
    waitlist.ts          endpoint Formspree + lógica ética da prova social
public/
  brand/                 ícone, wordmark, logo completo, badges das lojas, seta
  features/              6 imagens: rotina, tarefa, nota, agenda, financa, saude
  nortgo-demo.mp4        vídeo do hero (~23,5 MB) ⚠️ pesado
  nortgo-app-mobile.png  screenshot do mockup de iPhone
.env.example             variáveis FUTURAS (Mercado Pago, banco) — nada usado hoje
next.config.ts           poweredByHeader:false + cabeçalhos de segurança globais
```

Separação intencional: `app/` só rotas, `components/` só UI. Quando entrar
backend/pagamento, a lógica de servidor vai para `src/app/api/` e segredos para
variáveis de ambiente — nunca no código.

---

## 5. Funcionalidades implementadas

- **Navegação sticky** que muda fundo/borda/sombra após 24 px de scroll; links
  internos (Recursos, Como funciona, FAQ) + CTA para a lista.
- **Hero:** headline com frase-chave em gradiente, argumento de valor, formulário
  compacto, entrada escalonada (Motion), mockup de iPad tocando
  `/nortgo-demo.mp4` (autoplay, mudo, loop, inline).
- **Preview mobile:** mockup de iPhone + aviso explícito de que o produto pode
  mudar até o lançamento.
- **Problema central:** seção editorial sobre carga mental, com glow/fade quente.
- **SixApps:** as seis categorias convergem para a marca conforme o scroll
  (`useScroll`/`useTransform`, sem prender a seção); versão estática para
  `prefers-reduced-motion`.
- **Recursos:** grade responsiva 3×2 com os seis cards + animação ao entrar na
  viewport. Nota sobre "Espaços".
- **Como funciona:** fluxo em três passos com setas responsivas.
- **CTAs (3 pontos de captura):** hero, faixa intermediária (`CtaBand`),
  fechamento (`CtaFinal`).
- **Lista de espera (`Waitlist`):** POST assíncrono ao Formspree; e-mail
  obrigatório (máx. 254 chars, `autocomplete`); checkbox de consentimento
  obrigatório ligado à política; honeypot `_gotcha` anti-spam; estados
  loading/sucesso/erro com `role="status"`/`role="alert"`; variantes
  `default` e `compact`.
- **Prova social (`WaitlistProof`):** texto derivado de `formatWaitlistProof()`.
  Enquanto `WAITLIST_COUNT === null`, mostra "Lista de lançamento aberta" —
  **nenhum número fictício**.
- **Plataformas:** card âmbar comunicando Web + App Store + Google Play (em
  breve).
- **FAQ:** 5 perguntas em `<details>/<summary>` + JSON-LD `FAQPage`.
- **Tema:** dark é o padrão; toggle flutuante para light; persistência em
  `localStorage` (`nortgo-theme`); script inline no `<head>` evita flash.
- **SEO:** `metadata` + `viewport` no layout, keywords, Open Graph, Twitter Card,
  `sitemap.ts`, `robots.ts`, favicons, JSON-LD `SoftwareApplication` e
  `FAQPage`.
- **Rodapé:** colunas Produto/Suporte/Legal + badges das lojas + copyright
  dinâmico. Ícones sociais só renderizam se `href` for preenchido.
- **Segurança:** CSP (com `'unsafe-inline'` em script por causa da hidratação RSC
  do Next; `'unsafe-eval'` só em dev), `X-Content-Type-Options`,
  `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`, HSTS
  `preload`. `connect-src`/`form-action` liberam só `formspree.io`.

---

## 6. Decisões de design (registro)

| Área | Decisão | Motivo |
|---|---|---|
| Tema | Dark é o padrão (`<html data-theme="dark">`) | Estética "SaaS técnico premium"; light preservado para comparar |
| Toggle de tema | Existe como **controle de prévia** | Ainda não decidido se vira feature real ou sai — ver backlog |
| Superfície dark | Fundo chapado `#060606`; cards se distinguem por borda + sombra | Visual limpo, sem hierarquia por fill |
| Paleta | Só quente: cobre/bronze como único acento. **Azul e roxo proibidos** | Identidade da marca (comentário explícito no CSS) |
| Gradiente dos títulos | `#E87B00 → #FFC77E → #E87B00`, só na frase-chave (`.text-grad`) | Mesmo tom dos botões; realce pontual, não o título inteiro |
| Botões | "Liquid glass" (iOS 26): `.btn-primary` translúcido, `.btn-glass-copper` com fill laranja | Relevo todo via `box-shadow` em camadas |
| Tipografia | Stack de sistema (Helvetica Neue / Helvetica / Arial). **Sem webfont** | Zero download, performance |
| Escala tipográfica | Classes semânticas próprias (`display-title`, `section-title`, `sub-heading`, `lead`, `caption`, `eyebrow`) + `clamp` fluido | Componentes só somam classes de layout |
| Motion | Easing `[0.22, 1, 0.36, 1]` compartilhado; tempos 200/400/900 ms | Consistência cinematográfica |
| Prova social | Nunca inflar `WAITLIST_COUNT`; sem número comprovável → copy sem número | Confiança + CDC art. 37 (publicidade enganosa) |
| Seção "Planos" | Desativada em `page.tsx`, `Nav.tsx`, `Footer.tsx` (código mantido) | Preços não definidos; evita prometer o que não existe |

### Tokens principais (tema escuro)

`cobre #e0824a` · `cobre claro #f3a267` · `cobre profundo #bf6631` ·
`texto cobre #ef9f66` · `texto principal #f5f3f0` · `texto secundário #a6a4af` ·
`fundo #060606`

---

## 7. Estado do Git

- **Branch:** `main`, alinhada com `origin/main`, working tree limpo (no momento
  desta análise).
- **Commits até agora:**
  1. `1072be6` — Initial commit from Create Next App
  2. `ffdf2ba` — Build NortGo landing page *(entrega principal)*
  3. `efd2f5a` — Dark theme default, stores card, gradient/motion polish
  4. `423abd4` — Match font gradient tone to the buttons (#E87B00)
  5. `f69c04a` — Lighten font gradient mid-stop (#FFC77E)
  6. `d1dc1f8` — Gradient-highlight the key phrase in every section title *(30/08/2026)*

> ⚠️ Build/lint/testes **não foram executados** na análise — não há garantia
> registrada de que o estado atual compila sem erros. Rodar `npm run lint` +
> `npm run build` numa próxima sessão e anotar o resultado aqui.

---

## 8. Roadmap / backlog

### Antes de divulgar a landing publicamente

- [ ] **Política de privacidade:** preencher todos os `[destaque]` de
      `src/app/privacidade/page.tsx` (razão social, CNPJ, DPO) e revisar com
      advogado de proteção de dados.
- [ ] **Revisar afirmações da copy** ainda hipotéticas: criptografia,
      sincronização, prioridades por IA, migração automática. Não prometer o que
      não existe.
- [ ] **Redes sociais:** preencher `href` de Instagram e X em `Footer.tsx` (ou
      remover as entradas).
- [ ] **Rodar `lint` + `build`** e registrar resultado.
- [ ] **Comprimir o vídeo do hero** (~23,5 MB hoje): gerar versão menor,
      `poster`, formatos alternativos, carregamento condicionado.
- [ ] Auditar peso das imagens PNG de `brand/` e `features/`.

### Decisões de produto em aberto

- [ ] **Preços** do plano Plus (hoje "A definir"). Definir → reativar
      `Pricing.tsx` em `page.tsx`, `Nav.tsx` e `Footer.tsx`.
- [ ] **Toggle de tema:** vira feature definitiva (com preferência do sistema) ou
      sai antes do lançamento?
- [ ] **Analytics:** escolher solução compatível com consentimento (LGPD),
      definir eventos de conversão e ligar aos `data-track` já existentes.
- [ ] **Operação da waitlist:** definir fluxo de exportação dos e-mails do
      Formspree e como esses leads serão contatados no lançamento.

### Qualidade / técnica

- [ ] **Testes:** escolher framework. Prioridades: `formatWaitlistProof`,
      submissão/erros do formulário, persistência de tema, navegação por âncoras,
      abrir/fechar FAQ.
- [ ] **Acessibilidade:** contraste real dos gradientes/botões nos dois temas;
      foco após sucesso do formulário; teclado + leitor de tela no FAQ;
      **navegação móvel** (os links principais somem abaixo de `md` — hoje só
      logo + CTA); estender `prefers-reduced-motion` a Hero, Features e
      HowItWorks.
- [ ] **SEO:** validar OG/Twitter/JSON-LD em produção (Rich Results Test etc.).
- [ ] **`README.md`:** corrigir o trecho que diz "sem pasta `lib/`" (já existe).
- [ ] **Core Web Vitals:** medir; avaliar custo das animações ligadas ao scroll.

### Futuro (quando houver produto)

- [ ] Backend próprio (API em `src/app/api/`, banco — `DATABASE_URL`).
- [ ] Integração Mercado Pago: **sempre validar a assinatura do webhook no
      servidor** antes de gravar qualquer dado.
- [ ] O app em si (Web + iOS + Android) — provavelmente fora deste repositório.

---

## 9. Riscos e pontos de atenção

- **Promessas vs. realidade:** o FAQ e a copy já falam de plano grátis, plano
  pago, Mercado Pago, IA e segurança de dados. Nada disso existe. Risco de
  imagem/legal se a landing for muito divulgada nesse estado.
- **Vídeo de 23,5 MB no hero com autoplay:** impacto direto em LCP e consumo de
  dados no mobile.
- **Política de privacidade incompleta** coletando e-mails reais: risco de LGPD.
- **Sem testes nem CI:** qualquer refactor grande é feito no escuro.
- **Formspree como único canal de leads:** dependência de terceiro; sem backup
  próprio dos e-mails captados.

---

## 10. Registro de decisões

> Formato: data — decisão — motivo — impacto. Adicionar no topo.

- **2026-09-01** — Criado este documento de acompanhamento (`docs/PROJETO.md`
  versionado + `PROJETO.local.md` local para o que for sensível). — Motivo: ter
  uma fonte de verdade da intenção do projeto que evolui junto com o código. —
  Impacto: toda mudança relevante passa a ser registrada aqui.
- *(decisões anteriores a esta data estão consolidadas nas seções 6 e 7 a partir
  da leitura do código; não há registro datado individual delas)*

---

## 11. Histórico do documento

| Data | Alteração | Por |
|---|---|---|
| 2026-09-01 | Versão inicial: panorama completo a partir da análise do código (Codex + revisão manual). | Claude + Wesley |

---

## 12. Anexo sensível

Informações que **não** ficam neste arquivo (porque ele é versionado):
`PROJETO.local.md` na raiz do projeto (ignorado pelo git). Credenciais reais
vão em `.env.local`.
