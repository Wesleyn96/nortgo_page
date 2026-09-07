# NortGo — Documento de Acompanhamento do Projeto

> Documento vivo. Registra **onde o projeto está**, **por que as decisões foram
> tomadas** e **para onde vamos**. Atualizar sempre que algo relevante mudar
> (feature, decisão de produto/design, mudança de rumo, marco atingido).

- **Última atualização:** 2026-09-06
- **Responsável pelo projeto:** Wesley Nascimento
- **Repositório (landing):** git, branch principal `main` — remoto atual em namespace pessoal (`Wesleyn96/nortgo_page`), ver [§10](#10-riscos-e-pontos-de-atenção)
- **Domínios (decisão 2026-09-06):** `nortgo.com` = site institucional (Cloudflare Workers, no ar) · `nortgo.com.br` = app (Base44/Render), **em definitivo**. Dois domínios, propósitos distintos, **sem redirecionamento** entre eles. Revoga o alvo anterior (`app.nortgo.com` + `.com.br` redirecionando). Registrar `nortgo.com`: GoDaddy → nameservers hoje na Locaweb → migrando p/ Cloudflare. `nortgo.app` era só pretensão, removido do código.

> **▶ Estado (2026-09-06):** **site NO AR** em
> `https://nortgo-page.wesleynascimentojob.workers.dev` (Cloudflare Workers —
> a conta nova só oferece o fluxo Workers, não Pages; `wrangler.jsonc` publica
> a pasta `out/` como assets estáticos). Cabeçalhos de segurança do
> `public/_headers` confirmados na resposta; `/robots.txt`, `/sitemap.xml`,
> OG image (com `Content-Type: image/png`) e 404 ok. Build no Cloudflare:
> `npm run build`, deploy `npx wrangler deploy` — redeploy automático a cada
> push na `main`.
> **Falta:** apontar o domínio `nortgo.com` (trocar nameservers Locaweb →
> Cloudflare; checar MX/e-mail antes). Revisão do Codex dos commits: pendente.
> Teste de escrita do isolamento de dados (item 2): pendente.
>
> **▶ Estado (2026-09-03):** mudança de rumo na landing (decisão do dono). A
> landing longa deu lugar a uma **tela de entrada curta** (`src/components/Entrada.tsx`):
> proposta em uma frase + 3 exemplos ("você fala/escreve → o NortGo organiza") +
> `Começar` / `Já tenho conta` que vão **direto ao app no Base44**. Waitlist e
> Formspree **removidos** (só pararam de ser importados; arquivos no repo).
> Domínio trocado `nortgo.app` → `www.nortgo.com` em todo o código. Política de
> privacidade reescrita para "site não coleta dados; cadastro é no app".
> **Aprovado pelo dono e commitado** em `feat/tela-entrada` (2026-09-05, ainda
> não mergeado): wordmark virou ícone + texto (acompanha o tema), CSP sem o
> `formspree.io` morto. Passo 4 muda de forma:
> analytics/uptime continuam pendentes; "backup dos leads" **deixou de existir**
> (não há mais lista); reencode de vídeo **saiu de escopo** (a tela não tem vídeo).
> Ambiente de dev: Codex stop-review gate LIGADO, `npm run verify`, regras de
> processo no `CLAUDE.md`.

---

## Como manter este documento

1. **O que entra aqui:** direção do produto, decisões e o motivo delas, status de
   cada frente, roadmap, riscos, pendências. Nada que o código/git já conte
   sozinho.
2. **O que NÃO entra aqui:** segredos (tokens, senhas, `DATABASE_URL`),
   estratégia comercial sensível, dados de pessoas, números não divulgados. Isso
   vai em **`PROJETO.local.md`** (raiz, fora do git); credenciais em `.env.local`.
3. **Referências locais** (não versionadas, em `docs/referencia/`): o Plano Mestre
   de Lançamento (PDF do dono), o levantamento Mercado Pago/hospedagem, e a
   posição do Claude no debate de próximos passos.
4. **Ritmo:** a cada sessão significativa, atualize a seção afetada, registre em
   [Registro de decisões](#11-registro-de-decisões) / [Histórico](#12-histórico-do-documento)
   e atualize a data no topo.
5. **Fonte de verdade:** este arquivo é a verdade da *intenção*; o código é a
   verdade da *implementação da landing*; o Base44 é a verdade da *implementação
   do app*.

---

## 1. Visão geral do produto

**NortGo** é um sistema pessoal de organização da vida: reúne **rotina, tarefas,
notas, agenda, finanças e saúde** num só lugar e mostra **apenas o que merece
atenção agora**, sem exigir que o usuário organize nada.

- **Proposta central:** reduzir carga mental. "Você joga tudo nele → o NortGo
  filtra por prazo/rotina/prioridade → você vê só o essencial do dia."
- **"Espaços":** áreas da vida que o usuário organiza do próprio jeito, para o
  que não cabe nas seis categorias.
- **Plataformas-alvo:** Web, iOS (App Store), Android (Google Play); Desktop via
  PWA depois.
- **Modelo de negócio (decisão 2026-09-07):** **produto pago, sem plano grátis.**
  Sem assinatura ativa, o app não abre (paywall). NortGo — **R$ 9,90/mês** via
  **Mercado Pago** (Assinaturas). Opção de **7 dias de teste grátis sem cartão**
  na mesma arquitetura. "Essencial gratuito" pode voltar depois (é só afrouxar
  um `if`), não é o lançamento. Ver [§8](#8-pagamento-e-cobrança) e
  `docs/billing-arquitetura.md` v3.
- **Posicionamento:** para quem está sobrecarregado com a vida espalhada em
  vários apps. Diferencial de mensagem: os concorrentes "te dão mais uma lista
  para olhar"; o NortGo "faz o oposto". Tom de marca: editorial, calmo, quente.

---

## 2. Escopo e fronteiras de responsabilidade

O NortGo tem **duas frentes** + uma zona compartilhada. Este documento cobre
tudo, mas com um estado de implementação por frente.

| Frente | Onde vive | Estado | Este documento… |
|---|---|---|---|
| **App / produto** | **Base44** (plataforma no-code) | **Pronto, faltando lançar** — segundo o dono (2026-09-01) | …rastreia como dependência externa; detalhes pendem de inventário factual (passo 1) |
| **Landing / presença Web** | **Este repositório** (Next.js 16) | Funcional, faltam itens de produção | …é a fonte de verdade — código + este doc |
| **Operação de lançamento** | Compartilhado (marca, domínio, contas, jurídico, billing, lojas, monitoramento) | Não iniciada de forma estruturada | …rastreia via o plano da [§7](#7-próximos-passos--plano-convergido) |

- O **Plano Mestre de Lançamento** (`docs/referencia/plano-mestre-lancamento-base44.txt`)
  descreve a operação de lançamento inteira (~20 workstreams). Ele é
  **referência**, não status deste repo. A landing = seção 8 + roadmap fase 7
  ("Presença Web") do Plano Mestre.
- ⚠️ **Contradição resolvida em 2026-09-01:** versões anteriores deste doc diziam
  "não existe app". O dono confirmou que o app no Base44 está em **fase final
  (pronto, faltando lançar)**. "Pronto" aqui é a avaliação do dono; a validação
  de segurança e portabilidade (passos 1, 2 e 5) segue sendo **condição de
  go-live** conforme o Plano Mestre §6 e §20.

---

## 3. Situação atual — resumo executivo

| Frente | Status | Observação |
|---|---|---|
| App no Base44 | 🟡 Pronto p/ dono; go-live não validado | Falta inventário factual, prova de portabilidade, auditoria de segurança |
| Landing (design + copy) | 🟢 Funcional e coesa | Todas as seções implementadas |
| Captação de leads (waitlist) | 🟡 Operacional, sem backup | Via Formspree; sem exportação/restauração/responsável |
| SEO técnico | 🟢 Encaminhado em código | metadata, OG, Twitter, sitemap, robots, JSON-LD — não validado em produção |
| Cabeçalhos de segurança (landing) | 🟢 Em código | CSP, HSTS, etc. em `next.config.ts` — não verificado em produção |
| Política de privacidade | 🟡 Modelo inicial | Placeholders `[destaque]` + revisão jurídica pendente |
| Termos de Uso | 🔴 Não existe | Rodapé só tem "Privacidade" |
| Copy vs. realidade | 🟡 FAQ corrigido; resto pendente | FAQ + JSON-LD ajustados (mergeado). Falta o passe de voz da marca no resto da landing |
| Preços / cobrança | 🔴 Em aberto | Taxas MP levantadas ([§8](#8-pagamento-e-cobrança)); modelo e valores não definidos |
| Propriedade de ativos | 🔴 Não estruturada | Domínio, contas corporativas, MFA, GitHub org — a confirmar |
| Analytics / métricas | 🔴 Não integrado | `data-track` no HTML, sem funil/eventos definidos, sem ferramenta |
| Monitoramento / uptime | 🔴 Inexistente | Nenhum alerta de indisponibilidade da landing ou do app |
| Backup / DR | 🔴 Não definido | Sem RPO/RTO, sem teste de restauração (landing e app) |
| Testes / CI | 🟡 Base montada | Vitest + Testing Library (15 testes: waitlist, FAQ, footer, tema); CI (`.github/workflows/ci.yml`) roda lint + typecheck + testes + build. Falta cobertura mais ampla e o branch chegar na `main` |
| Performance do hero | 🔴 Vídeo de 23,5 MB | `nortgo-demo.mp4` (30 s, 1524×980) com autoplay; receita de reencode pronta em `scripts/optimize-demo-video.sh` |

Legenda: 🟢 ok · 🟡 atenção · 🔴 pendente/não iniciado

---

## 4. Stack técnica (landing)

- **Framework:** Next.js `16.3.3` (App Router, `src/app/`). Versão fixada.
- **UI:** React `19.2.8`, TypeScript `^5` (strict), Tailwind CSS `^4`.
- **Animação:** Motion `^13.1.1` (`motion/react`); easing `[0.22, 1, 0.36, 1]` em
  `src/lib/motion.ts`.
- **Imagens:** `next/image` com imports estáticos.
- **Lint:** ESLint `^9` Flat Config (`npm run lint`).
- **Type-check:** `npm run typecheck` (`tsc --noEmit`).
- **Testes:** Vitest `^4` + React Testing Library + jsdom (`npm test` /
  `npm run test:watch`); config em `vitest.config.mts`, setup em
  `vitest.setup.ts`; testes colocados em `src/**/*.test.{ts,tsx}`.
- **CI:** GitHub Actions (`.github/workflows/ci.yml`) — lint, typecheck,
  testes e build em push na `main` e em todo PR.
- **Pacotes:** npm. **Hospedagem:** Cloudflare Workers (assets estáticos via
  `wrangler.jsonc`, publica `out/`). No ar em
  `nortgo-page.wesleynascimentojob.workers.dev`; domínio `nortgo.com` pendente.
- **Integrações externas:** apenas **Formspree** (`src/lib/waitlist.ts`).

### ⚠️ Este Next.js tem breaking changes (ver `AGENTS.md`)

Antes de codar, consultar `node_modules/next/dist/docs/`:

- Turbopack é o bundler padrão de `dev` **e** `build`.
- `params`, `searchParams`, `cookies()`, `headers()`, `draftMode()` são
  **exclusivamente assíncronos**.
- `middleware.ts` depreciado → convenção nova é **`proxy.ts`**.
- `next lint` removido (o projeto já chama `eslint` direto).
- Node `20.9+`, TS `5.1+`. React Compiler e Cache Components **não habilitados**.

---

## 5. Estrutura de arquivos (landing)

```
src/
  app/
    layout.tsx           layout raiz: pt-BR, metadata, favicons, JSON-LD,
                         script anti-flash de tema, Nav + Footer + ThemeToggle
    page.tsx             composição das seções (Pricing importado mas comentado)
    globals.css          tokens dos temas, tipografia, gradientes, botões, animações
    privacidade/page.tsx política de privacidade (noindex) — MODELO INICIAL
    robots.ts / sitemap.ts   home indexável, /privacidade fora
    opengraph-image.tsx / twitter-image.tsx   imagem social 1200×630
  components/            uma seção por arquivo
    Hero, Preview, Problem, SixApps, Features, HowItWorks,
    CtaBand, Platforms, Faq, CtaFinal            → página ativa
    Nav, Footer, ThemeToggle, Waitlist, WaitlistProof → compartilhados
    IpadMockup, IphoneMockup, AppMockup          → mockups
    Pricing.tsx                                  → implementado, NÃO renderizado
  lib/
    motion.ts / waitlist.ts
public/
  brand/  features/  nortgo-demo.mp4 (~23,5 MB ⚠️)  nortgo-app-mobile.png
.env.example             variáveis FUTURAS (Mercado Pago, banco) — nada usado hoje
next.config.ts           poweredByHeader:false + cabeçalhos de segurança globais
```

Separação intencional: `app/` só rotas, `components/` só UI. Lógica de servidor
futura em `src/app/api/`, segredos em variáveis de ambiente.

---

## 6. O que já está implementado / decidido

### 6.1 Funcionalidades da landing

- Nav sticky; Hero com vídeo em mockup de iPad; Preview mobile; seção "Problema";
  SixApps (animação por scroll, com fallback `prefers-reduced-motion`); Recursos
  (6 cards); Como funciona (3 passos); 3 CTAs de captura; FAQ (`<details>` +
  JSON-LD); tema dark padrão + toggle; SEO completo; rodapé.
- **Waitlist:** POST ao Formspree; e-mail obrigatório (máx. 254); consentimento
  obrigatório ligado à política; honeypot `_gotcha`; estados acessíveis.
- **Prova social honesta:** sem `WAITLIST_COUNT` comprovado → copy sem número.
- **Segurança (código):** CSP (`'unsafe-inline'` em script pela hidratação RSC do
  Next; `'unsafe-eval'` só em dev), `X-Frame-Options: DENY`, `nosniff`,
  `Referrer-Policy`, `Permissions-Policy`, HSTS `preload`. `connect-src`/
  `form-action` só `formspree.io`.

### 6.2 Decisões de design

| Área | Decisão | Motivo |
|---|---|---|
| Tema | Dark padrão (`<html data-theme="dark">`) | Estética "SaaS técnico premium"; light preservado |
| Toggle de tema | Existe como **controle de prévia** | Não decidido se vira feature ou sai |
| Superfície dark | Fundo `#060606`; cards por borda + sombra | Visual limpo |
| Paleta | Só quente: cobre/bronze na **identidade** (logo, títulos, botões, chrome). **Azul e roxo proibidos** aí. Exceção (decisão do dono, 2026-09-06): **ícones semânticos em mockups do app** podem usar cores funcionais — azul p/ agenda, verde p/ dinheiro, vermelho p/ atraso — porque representam a UI do produto, não a marca | Identidade da marca |
| Gradiente dos títulos | `#E87B00 → #FFC77E → #E87B00`, só na frase-chave | Mesmo tom dos botões |
| Botões | "Liquid glass" (iOS 26) | Relevo via `box-shadow` em camadas |
| Tipografia | Chrome/identidade: stack de sistema (Helvetica), **sem webfont**. Exceção (dono, 2026-09-06): os **cards de prévia** usam **Inter** — auto-hospedada (`public/fonts/`, pesos 600/700, ~24 KB cada, servida de `'self'`, `font-display: swap`). Sem Google Fonts, sem mudar CSP | Zero download no chrome; Inter só nos cards |
| Prova social | Nunca inflar contagem | Confiança + CDC art. 37 |
| Seção "Planos" | Desativada (código mantido) | Preços não definidos |

Tokens (dark): `cobre #e0824a` · `cobre claro #f3a267` · `cobre profundo #bf6631`
· `texto cobre #ef9f66` · `texto principal #f5f3f0` · `secundário #a6a4af` ·
`fundo #060606`.

### 6.3 Estado do Git (landing)

Commits de produto até `d1dc1f8` (30/08/2026). Em 2026-09-02, mergeado na `main`
e empurrado para `origin` (`main` = `origin/main` = `0380b0e`, history linear):
o doc de acompanhamento, as correções de copy do FAQ + JSON-LD, a correção do
lint pré-existente do `ThemeToggle` (migrado para `useSyncExternalStore`), e
Vitest + CI mínima.

> ✅ `npm run lint`, `npm run typecheck`, `npm test` e `npm run build` passam
> (verificado em 2026-09-02 na `main`).

---

## 7. Próximos passos — plano convergido

> Resultado do debate Claude Code × Codex (2026-09-01). Detalhe do debate em
> `docs/referencia/_debate-proximos-passos-claude.md` + réplica do Codex no
> histórico da conversa. Ordem pensada para **escalabilidade** e **cobrir todas
> as camadas** de um produto comercial.

| # | Passo | Entrega / por quê |
|---|---|---|
| **0** *(semana 1, paralelo, barato)* | **(a)** ~~Definir estado real do app~~ ✅ pronto p/ lançar · **(b)** 🟡 corrigir promessas não comprovadas da landing — FAQ + JSON-LD ✅ (mergeado); **falta** o passe de voz da marca no resto da landing (decisão do dono) e a política de privacidade (vai no passo 3) · **(c)** 🔴 domínio `nortgo.app` + contas corporativas + MFA + repo para org da empresa · **(d)** ~~merge dos branches na `main` + push~~ ✅ feito 2026-09-02 | Remove contradição, risco legal barato e dependência de conta pessoal |
| **1** | **Inventário factual do Base44** — telas, entidades, campos sensíveis, auth, papéis, automações, integrações, arquivos, limites do plano, capacidade de exportação | Fonte de verdade para todo o resto |
| **2** | **Prova de saída documental** — exportar amostra real de código/schema/dados/arquivos; registrar o que **não** sai; como recriar auth/automações; definir gatilhos **quantitativos** de migração | Mede lock-in de verdade, não por intenção |
| **3** | **Jurídico + dados** — finalizar política de privacidade; redigir Termos de Uso; inventário LGPD; classificação de dados (**notas/saúde/finanças = sensível**); registrar residência e subprocessadores do Base44; fluxo de exclusão/exportação de conta | Bloqueia divulgação ampla e submissão às lojas |
| **4** 🟡 *em andamento — reescopado 2026-09-03* | **Site pronto para tráfego** — ✅ testes + CI; ✅ tela de entrada curta (`Entrada.tsx`); ✅ domínio `www.nortgo.com` no código; ✅ política de privacidade alinhada ao novo fluxo · **falta:** migrar hospedagem para Cloudflare Pages + apontar `nortgo.com`/`app.nortgo.com`/`.com.br`; e-mail `contato@nortgo.com` (Cloudflare Email Routing); definir funil/eventos antes de instalar analytics (Cloudflare Web Analytics, sem cookie); uptime + alerta (UptimeRobot); acessibilidade da nova tela · **saiu de escopo:** backup dos leads (não há mais lista), reencode de vídeo (a tela não tem vídeo), nav mobile (não há nav) | O entregável "Presença Web" |
| **5** | **MVP + gates de go-live** (app) — fluxos essenciais; matriz CRUD + RLS/FLS; testes IDOR/BOLA entre 2+ contas; backup/restore + RPO/RTO; observabilidade **separada** (landing / app / billing / Base44); suporte com **menor privilégio** | Condição para cobrar e para o rollout |
| **6** | **Oferta + billing ponta a ponta** — preço mensal + anual; **unit economics** (taxa MP + custo Base44/usuário + IA + arquivos + suporte + imposto + chargeback + CAC); fonte de verdade do entitlement; webhook **idempotente** + conciliação; reembolso/cancelamento/downgrade/NF; **piloto pago 5–20 usuários** (entitlement manual aceitável nesse tamanho) antes de tráfego amplo | Receita com segurança |
| **contínuo** | **Reavaliar Base44** nos marcos — protótipo · beta fechado · 50 usuários · 100 usuários — medindo custo, latência, limites e exportabilidade. Não esperar 1.000. | Decisão de migração por dado |

### Consenso do debate (D1–D6)

- **D1 — Base44 agora:** sim, mas lock-in **não** se resolve só com "código
  versionado + dados exportáveis" — exige a prova de saída (passo 2).
- **D2 — Cobrança:** desenhar **as duas modalidades** (mensal recorrente + anual
  à vista) desde já; **ativar só** depois de entitlement + conciliação seguros
  (passo 6). Não vender antes do go-live validado. Piloto pode ter entitlement
  manual.
- **D3 — Formspree:** manter temporariamente **com** exportação automática +
  restauração testada + prazo de reavaliação. Gatilhos de migração: volume,
  custo, automação, LGPD — não só "app ter auth".
- **D4 — Locaweb:** **não** agora. O levantamento não tem cota real, SLA, backup
  ou capacidade comprovada — nem é hoje uma alternativa comparável.
- **D5 — Ordem:** ativos + inventário + segurança + "verdade da oferta" **antes**
  de tráfego; jurídico em paralelo; pagamento **desenhado** cedo, **ativado**
  tarde.
- **D6 — Camadas:** ver [§9](#9-camadas-de-um-projeto-completo).

---

## 8. Pagamento e cobrança

> Intel completa em `docs/referencia/mercado-pago-e-hospedagem.md`. Decisões de
> valor/estratégia vão em `PROJETO.local.md`.

**Modelo pretendido:** duas opções separadas — **plano anual à vista** (link de
pagamento; Pix a 0%) + **plano recorrente mensal no cartão** (assinatura;
**não parcela**).

**Taxas Mercado Pago (painel consultado 01/09/2026):**

| Forma | Taxa (recebimento "na hora") |
|---|---|
| Pix | **0,00%** |
| Débito | 1,99% |
| Assinatura no cartão | 4,98% (na hora) · 4,49% (14 d) · 3,98% (30 d) |
| Crédito à vista | 4,98% |
| Crédito 2–6× | 2,99% · 7–12× 3,09% · 13–18× 3,19% |
| Parcelado Comprador | até 5,31% |

**Implicação:** anual à vista via Pix é o cenário de menor custo; assinatura no
cartão "na hora" é o mais caro (~5%). Prazos de recebimento mais longos reduzem
bastante a taxa.

**Pendências:** valores (mensal/anual), fonte de verdade do entitlement,
integração (Checkout Pro primeiro), webhook idempotente, conciliação, fluxos
comerciais (reembolso, arrependimento, inadimplência, downgrade, NF), regras das
lojas para pagamento dentro do app.

---

## 9. Camadas de um projeto completo

Cada camada precisa de um **dono** e um **estado**. (Preencher donos em
`PROJETO.local.md` se envolver pessoas.)

| Camada | Onde | Estado |
|---|---|---|
| Gestão de produto / escopo (o que é o MVP) | Compartilhado | 🔴 |
| Identidade / autenticação | Base44 | 🟡 a inventariar |
| Autorização por dado (CRUD, RLS/FLS, IDOR/BOLA) | Base44 | 🟡 leitura validada (preliminar) — ver §11 2026-09-06 |
| Arquitetura de dados / portabilidade | Base44 | 🔴 prova de saída pendente |
| Ciclo de vida de dados (retenção, exclusão, exportação) | Base44 + jurídico | 🔴 |
| Billing / assinatura / unit economics | Compartilhado + Mercado Pago | 🔴 |
| Observabilidade (landing / app / billing / Base44 — separadas) | Compartilhado | 🔴 |
| Backup / DR (RPO/RTO, restauração testada) | Base44 + landing | 🔴 |
| Performance / capacidade (Core Web Vitals, carga, créditos Base44) | Ambos | 🔴 |
| Suporte com menor privilégio | Compartilhado | 🔴 |
| Jurídico / LGPD (política, Termos, inventário, subprocessadores) | Compartilhado | 🟡 |
| Segurança de desenvolvimento (staging, rollback, regressão pós-alteração Base44) | Ambos | 🔴 |
| CI / qualidade / testes | Landing (e app se possível) | 🔴 |
| Acessibilidade | Landing + app | 🟡 parcial na landing |
| Distribuição (Google Play, App Store, PWA) | Compartilhado | 🔴 |
| Aquisição / ativação / retenção (funil, métricas) | Compartilhado | 🔴 |
| Gestão de fornecedores / continuidade (Base44, Formspree, MP, Vercel) | Compartilhado | 🔴 |
| Propriedade de ativos (domínio, contas, MFA, recuperação) | Compartilhado | 🔴 |

---

## 10. Riscos e pontos de atenção

- **Portabilidade não comprovada (lock-in Base44):** sem evidência de exportação
  completa de schema, relações, automações, auth, arquivos, logs. Exportar código
  ≠ poder reconstruir o serviço.
- **Acoplamento de identidade e de billing:** migração futura pode invalidar
  IDs/sessões; indefinido qual sistema é a fonte de verdade da assinatura.
- **Dados sensíveis:** notas, saúde e finanças elevam o impacto de vazamento,
  retenção indevida e acesso admin — falta classificação/minimização por campo.
- **Promessas vs. realidade na landing:** FAQ afirma Mercado Pago, criptografia e
  IA como se existissem. Risco legal/reputacional. Corrigir no passo 0(b).
- **Formspree como cópia única dos leads:** o Plano Mestre proíbe manter o único
  backup no mesmo provedor.
- **Contas em namespace pessoal:** repo remoto `Wesleyn96/nortgo_page`; provável
  dependência de conta individual. Migrar para org da empresa + branch protection.
- **Unit economics desconhecida:** taxa MP é só uma parcela; falta custo
  Base44/usuário, IA, suporte, imposto, chargeback, CAC.
- **Sem observabilidade:** uptime externo não mede erros internos, latência por
  fluxo, consumo de créditos Base44, falhas silenciosas.
- **Vídeo de 23,5 MB no hero com autoplay:** impacto direto em LCP/dados.
  Mitigação pronta (não aplicada): `scripts/optimize-demo-video.sh`.
- **Política de privacidade incompleta** coletando e-mails reais: risco LGPD.
- ~~**Sem testes nem CI**~~ — mitigado: Vitest + CI na `main` (15 testes).
  Cobertura ainda estreita.

---

## 11. Registro de decisões

> Formato: data — decisão — motivo — impacto. Mais recente no topo.

- **2026-09-07** — **Reset da arquitetura de pagamento → v3 "pago, dentro do
  Base44".** Duas decisões do dono: (1) o app **fica no Base44** por ora (sem
  plano de sair); (2) **sem plano grátis** — produto pago (R$ 9,90/mês), sem
  assinatura o app não abre; opção de 7 dias de teste. — Motivo: a v2 (serviço
  de billing separado, Cloudflare Worker + D1) só se justificava pela premissa
  "vamos sair do Base44"; era ela que criava a sincronia entre 2 bancos e os 10
  bugs que o Codex achou. Removida a premissa, o billing vai **dentro do Base44**,
  ao lado de `user.plan` — **um banco, uma fonte de verdade, zero sincronia**. —
  Impacto: `docs/billing-arquitetura.md` **reescrito (v3)**, ~1/3 do tamanho.
  Fluxo: cadastra → paywall → paga (função server-side do Base44 cria assinatura
  no MP) → webhook seta `user.plan`. `nortgo.com` **não** move: continua landing
  estática no Cloudflare, "Começar" → `nortgo.com.br`. **Incógnita que decide
  tudo:** o backend do Base44 recebe webhook / faz HTTP de saída / guarda secret?
  → 3 cenários (tudo no Base44 / adaptador Worker de ~50 linhas sem banco /
  piloto manual). Spike (fase 0) responde. Histórico da v2 no `git log` do doc.
- **2026-09-06** — **Arquitetura de pagamento: PROPOSTA v2 (não aprovada).**
  Billing = **serviço separado** (decisão firme; **não** dentro do Base44, **não**
  nas páginas estáticas). Fluxo automático "pagar antes no nortgo.com": pagamento
  no Worker → webhook MP → e-mail com link de ativação (uso único) → login no
  Base44 → Base44 consulta o billing (pull) e/ou billing empurra pro Base44
  (push). — Motivo: o dono quer automático; o guia do MP exige backend confiável.
  — A **revisão adversarial do Codex** (2026-09-06) achou 3 `high` (identidade não
  amarrada ao usuário; eventos fora de ordem; indisponibilidade do billing derruba
  pagantes) + 2 `medium` (ADR de compute ausente; reconciliação só alerta). A **v2
  de `docs/billing-arquitetura.md`** responde a todos: asserção assinada
  server-to-server (sem `account_id` do cliente); máquina de estados monotônica
  com terminais dominantes + dedupe por efeito; token de direito assinado + cache
  + janela de tolerância 72h + respostas distintas "não tem"×"não consegui";
  reconciliador que **repara** + fila de exceções + runbook; ADR Worker+D1 vs
  Render (fallback claro). — **Incógnita que trava tudo:** o Base44 aceita ser
  consultado no login (pull)? → **spike de validação** (fase 0) antes de decidir.
  Nada implementado; só depois do passo 5. **Doc v2 congelado (2026-09-06)** após
  **10 rodadas do stop-gate do Codex** (10 achados fechados: outbox transacional,
  convergência de dead-letter, varredura completa do canal, auth do lookup,
  replay do HMAC, etc.); pendências futuras = TODO de implementação. **Stop-review
  gate do Codex DESLIGADO** neste projeto — o loop de revisão de *texto* tinha
  atingido retorno decrescente; religar (`/codex:setup --enable-review-gate`)
  antes de escrever código de billing.
- **2026-09-06** — **Domínio `nortgo.com` no ar no Cloudflare Workers.** Migrado
  da Locaweb: nameservers GoDaddy → Cloudflare; registro A antigo apagado;
  `nortgo.com` e `www` como Custom Domain do Worker `nortgo-page`; SSL automático;
  MX/TXT (e-mail Locaweb) preservados. — Impacto: site institucional em produção
  no domínio real.
- **2026-09-06** — **Fundo da tela de entrada trocado + Inter nos cards + rede
  de segurança anti-scroll-horizontal.** (a) A foto lifestyle deu lugar a duas
  artes "limbo de planeta com brilho quente" (`bg-desktop.webp` paisagem /
  `bg-responsive.webp` retrato, ~15 KB cada, troca por `@media 768px`); topo
  quase preto → scrim leve. (b) Inter auto-hospedada só nos `.cards-preview`
  (pesos 600/700, `public/fonts/`, servida de `'self'` — sem Google Fonts).
  (c) `overflow-x: clip` em `html`/`body` + grid dos cards em `md:` (empilha
  até 768px) — garante zero rolagem horizontal em qualquer largura. — Motivo:
  pedidos do dono. — Impacto: exceção à regra "sem webfont" (§6.2), registrada.
- **2026-09-06** — **Prévia da tela de entrada: dois cards "ATRASADOS / HOJE"**
  no modelo enviado pelo dono (substitui o card único de exemplos). Estrutura,
  tamanhos, ícones SVG (Tabler inline) e cinzas idênticos ao modelo. — Motivo:
  mostrar o que o produto *devolve* (o dia já organizado), não só a entrada. —
  Impacto: **exceção à regra "azul proibido" (§6.2)** — o ícone de agenda usa
  azul `#3B82F6` por ser ícone semântico de mockup do app, não identidade da
  marca. A fonte "Inter" do modelo **não** foi adotada (regra "sem webfont"
  mantida); tamanhos/pesos casados com a stack de sistema.
- **2026-09-06** — **App fica em `nortgo.com.br` em definitivo** (decisão do
  dono). Revoga o alvo de 2026-09-03 (`app.nortgo.com` + `.com.br` redirecionando).
  — Motivo: decisão do dono; `.com.br` já é onde o app roda e é reconhecido. —
  Impacto: `nortgo.com` = só o site; `nortgo.com.br` = só o app; sem
  redirecionamento entre eles. `src/lib/links.ts` mantém `nortgo.com.br` (comentário
  atualizado). Cobrança futura: acontece dentro do app, em `nortgo.com.br`
  (Mercado Pago não liga pro TLD; NF/imposto/conta MP amarrados ao CNPJ, não ao
  domínio).
- **2026-09-06** — **Site no ar no Cloudflare Workers.** A conta nova do
  Cloudflare só oferece o fluxo Workers (Pages absorvido). Como o site é
  `output: "export"` (estático), foi feito um "Worker de assets": `wrangler.jsonc`
  com `assets.directory: "./out"`, deploy `npx wrangler deploy`, redeploy
  automático a cada push na `main`. URL: `nortgo-page.wesleynascimentojob.workers.dev`.
  — Motivo: implementa a decisão de 2026-09-03 (sair da Locaweb). — Impacto:
  cabeçalhos de `public/_headers` confirmados em produção; custo ~R$ 0/mês.
  Falta só o domínio `nortgo.com` (nameservers Locaweb → Cloudflare).
- **2026-09-06** — **Teste de isolamento de dados no Base44 (item 2 dos 5
  checks de "produto profissional") — aprovação preliminar.** Feito com 2 contas
  reais (A no Chrome, B no Edge). Confirmado: (a) B abrindo a URL da nota de A,
  autenticado, recebe "não encontrada" — o backend nega `GET .../entities/
  InboxNote/{id}` de outro dono (teste IDOR por registro, passou); (b) B chamando
  a API de listagem de tarefas (`/api/apps/{app}/entities/Tarefa`) recebe **só**
  as tarefas dele; A idem — o filtro por dono é no servidor, não na tela;
  (c) chamada anônima à API devolve `[]`. A API usa um handler único por
  entidade (`/api/apps/{appId}/entities/{X}`) com a mesma checagem de login, então
  o padrão provavelmente vale pro app todo. **Falta antes de cobrar:** teste de
  **escrita** (B consegue editar/apagar item de A?) e as demais entidades. —
  Impacto: item de autorização por dado sai de 🔴 p/ 🟡; não bloqueia o site,
  bloqueia cobrança e divulgação ampla. Nota: o app roda em backend Python
  (uvicorn) na Render, atrás de Cloudflare + Caddy — já é código rodando, não
  Base44 "puro" (relevante pro item 3, portabilidade).
- **2026-09-03** — **Arquitetura de domínios definida.** Site = `nortgo.com`;
  app (Base44) = `app.nortgo.com`; `nortgo.com.br` vira redirecionamento para
  `.com`. `nortgo.app` (que o dono não tem) removido do código. — Motivo: uma
  marca, um domínio principal; subdomínios do mesmo domínio pai permitem
  compartilhar login/cookies/medição entre site e app no futuro, o que dois TLDs
  separados travariam. — Impacto: código aponta para `www.nortgo.com`; URL do
  app centralizada em `src/lib/links.ts` (hoje `www.nortgo.com.br`). Guia de
  infraestrutura (hospedagem + custos, linguagem simples) entregue ao dono.
- **2026-09-06** — **Build migrado para export estático** (`output: "export"`).
  — Motivo: implementar a decisão de 2026-09-03 (Cloudflare Pages). Sem servidor,
  o `headers()` do Next não roda → cabeçalhos de segurança foram para
  `public/_headers` (formato nativo do Pages, precisa ser mantido em sincronia
  com a política). Rotas de metadata (`robots`, `sitemap`, `opengraph-image`,
  `twitter-image`) ganharam `dynamic = "force-static"`. `images.unoptimized`
  ligado (otimizador precisa de servidor). — Impacto: `next build` gera `out/`;
  deploy = subir essa pasta. Config do Pages: build `npm run build`, output dir
  `out`, Node 22 (`.nvmrc`).
- **2026-09-03** — **Hospedagem do site: sair da Locaweb para Cloudflare Pages.**
  — Motivo: site é 100% estático; Cloudflare Pages é grátis para uso comercial,
  com CDN/HTTPS/deploy-por-git; Vercel Hobby é proibido para uso comercial. —
  Impacto: custo de infra do site ~R$ 0/mês; único gasto fixo é a renovação dos
  domínios (~R$ 130/ano). Ainda não migrado.
- **2026-09-03** — **Landing longa → tela de entrada curta** (decisão do dono).
  Uma frase de proposta + 3 exemplos ("você fala/escreve → o NortGo organiza") +
  `Começar` / `Já tenho conta` levando **direto ao cadastro no Base44**. — Motivo:
  a landing longa contrariava a tese de simplicidade do produto; o problema real
  era o "antes e depois do cadastro", não o cadastro. — Impacto: `Entrada.tsx`
  nova; Nav e as 11 seções antigas + Waitlist/Formspree pararam de ser importados
  (arquivos mantidos no repo). **Sem lista de e-mails** — "backup dos leads" sai
  do passo 4; reencode do vídeo sai de escopo. Política de privacidade reescrita
  para refletir "site não coleta dados; cadastro é no app". Pré-condição: o app
  no Base44 precisa suportar cadastro público de verdade (passo 5).
- **2026-09-03** — **Ambiente de dev profissionalizado** (auditoria + Prioridade 1).
  Codex stop-review gate LIGADO (revisão automática ao fim de cada tarefa),
  `npm run verify` como gate de conclusão, regras de processo no `CLAUDE.md`. —
  Impacto: toda mudança passa por verify + revisão independente do Codex antes de
  "concluída". Falta `.claude/settings.json` de permissões (o dono cria).
- **2026-09-02** — Merge dos dois branches pendentes na `main` (history linear:
  ff no doc, rebase + ff no `fix/faq-copy-claims`). — Motivo: baixo risco (doc +
  copy já revisada, build passa); mantê-los abertos só criava divergência. —
  Impacto: `main` avançou; push para `origin` feito no fim da sessão.
- **2026-09-02** — Início do passo 4 no branch `chore/step4-traffic-ready`:
  (a) lint pré-existente do `ThemeToggle` corrigido trocando `useState` +
  `useEffect` por `useSyncExternalStore` — a fonte de verdade do tema é o
  atributo `data-theme` que o script anti-flash escreve; (b) Vitest + Testing
  Library + jsdom, 15 testes na superfície de tráfego (waitlist, FAQ, footer,
  tema, prova social); (c) CI mínima em GitHub Actions (lint, typecheck, testes,
  build); (d) `scripts/optimize-demo-video.sh` com a receita de reencode do
  vídeo do hero. — Motivo: destravar a CI e ter rede de segurança antes de
  mexer mais na landing. — Impacto: passo 4 passa a 🟡; falta analytics, uptime,
  backup dos leads, reencode do vídeo e acessibilidade.
- **2026-09-01** — Correção de copy da landing: escopo "só o essencial factual"
  (escolha do dono). Feito: 4 inconsistências do FAQ ("garante condição especial",
  "coleta apenas o e-mail" vs. política, "seus dados", "via Mercado Pago") +
  remoção de `operatingSystem` do JSON-LD. — Motivo: revisão do Codex apontou
  contradição com a própria política e risco de oferta vinculante (CDC art. 37).
  — Impacto: o passe de voz da marca (abrandar absolutos no resto da landing)
  fica adiado como decisão do dono; a política de privacidade vai no passo 3.
- **2026-09-01** — Estado real do app esclarecido: **pronto, faltando lançar** no
  Base44 (avaliação do dono). — Motivo: os documentos se contradiziam ("não
  existe" × "em construção" × "fase final"). — Impacto: o foco do projeto passa a
  ser a **operação de lançamento**; validação de segurança/portabilidade continua
  sendo condição de go-live.
- **2026-09-01** — Plano de próximos passos definido por debate Claude Code ×
  Codex (passos 0–6 + reavaliação contínua do Base44). — Motivo: alinhar
  prioridade com escalabilidade e cobertura de todas as camadas. — Impacto:
  substitui o backlog solto anterior; ver [§7](#7-próximos-passos--plano-convergido).
- **2026-09-01** — Modelo de cobrança: desenhar mensal recorrente + anual à vista
  desde já; ativar só após entitlement seguro. Locaweb descartada por ora. —
  Motivo: taxas MP levantadas; anual/Pix = 0%, recorrência ~4–5%. — Impacto:
  billing entra no passo 6, não antes.
- **2026-09-01** — Criado o acompanhamento (`docs/PROJETO.md` versionado +
  `PROJETO.local.md` local + `docs/referencia/` para material bruto). — Impacto:
  toda mudança relevante passa a ser registrada aqui.
- *(decisões de design anteriores estão consolidadas na [§6.2](#62-decisões-de-design)
  a partir da leitura do código; sem registro datado individual)*

---

## 12. Histórico do documento

| Data | Alteração | Por |
|---|---|---|
| 2026-09-06 | Build para hospedagem estática: `output: "export"`, headers → `public/_headers`, `.nvmrc`, `force-static` nas rotas de metadata/OG. Pronto para Cloudflare Pages. Merge na `main` + push. Teste preliminar de isolamento de dados no Base44 (§11): leitura isolada confirmada, falta escrita. | Claude + Wesley |
| 2026-09-05 | Dono aprovou a tela de entrada. Wordmark PNG branco → ícone + texto (some no tema claro); CSP sem `formspree.io`; `<mark>` de amostra da política com contraste. `npm run verify` ok. Commitado em `feat/tela-entrada` (não mergeado). | Claude + Wesley |
| 2026-09-03 | Mudança de rumo: landing longa → tela de entrada curta; waitlist/Formspree removidos; CTA vai ao Base44. Domínio `nortgo.app` → `www.nortgo.com`; arquitetura de domínios + hospedagem (Cloudflare Pages) decididas; guia de infra entregue. Política de privacidade reescrita. Ambiente de dev profissionalizado (Codex gate, `npm run verify`, `CLAUDE.md`). Topo, §11, §12 atualizados. | Claude + Wesley |
| 2026-09-02 | Merge dos branches na `main`; passo 4 iniciado (lint corrigido, Vitest + CI, script de reencode do vídeo); §3, §4, §6.3, §7, §10, §11 atualizadas. | Claude + Wesley |
| 2026-09-01 | Nota de continuidade no topo (branches abertos); passo 0(b) marcado como parcial; registro da correção de copy do FAQ + JSON-LD. | Claude + Wesley |
| 2026-09-01 | Reestruturação: escopo/fronteiras, resumo executivo revisado, plano convergido de próximos passos (debate Claude × Codex), camadas do projeto, seção de pagamento (Mercado Pago), riscos de lock-in. Estado do app corrigido para "pronto, faltando lançar". | Claude + Codex + Wesley |
| 2026-09-01 | Versão inicial: panorama completo a partir da análise do código (Codex + revisão manual). | Claude + Wesley |

---

## 13. Anexo sensível

`PROJETO.local.md` (raiz, ignorado pelo git): contas/serviços, dados da empresa,
números não divulgados, precificação, donos das camadas. Credenciais em
`.env.local`.
