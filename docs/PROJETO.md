# NortGo — Documento de Acompanhamento do Projeto

> Documento vivo. Registra **onde o projeto está**, **por que as decisões foram
> tomadas** e **para onde vamos**. Atualizar sempre que algo relevante mudar
> (feature, decisão de produto/design, mudança de rumo, marco atingido).

- **Última atualização:** 2026-09-01
- **Responsável pelo projeto:** Wesley Nascimento
- **Repositório (landing):** git, branch principal `main` — remoto atual em namespace pessoal (`Wesleyn96/nortgo_page`), ver [§10](#10-riscos-e-pontos-de-atenção)
- **Domínio de produção previsto:** https://nortgo.app

> **⏸ Estado ao pausar (2026-09-01):** dois branches abertos, **nada mergeado na
> `main`** — `docs/projeto-acompanhamento` (este doc) e `fix/faq-copy-claims`
> (correções de copy do FAQ + JSON-LD, `npm run build` passa). Detalhe de
> continuidade e comandos de merge em `docs/referencia/_estado-da-sessao.md`
> (local). Próxima ação: decidir o merge e seguir para o passo 0(c).

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
- **Modelo de negócio:** plano "Essencial" gratuito + "NortGo Plus" pago,
  pagamento via **Mercado Pago**. Preços **não definidos** — ver [§8](#8-pagamento-e-cobrança).
  Lista de espera ganha condição especial de lançamento.
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
| Copy vs. realidade | 🔴 Afirma recursos não comprovados | FAQ fala de Mercado Pago, criptografia, IA como se já existissem |
| Preços / cobrança | 🔴 Em aberto | Taxas MP levantadas ([§8](#8-pagamento-e-cobrança)); modelo e valores não definidos |
| Propriedade de ativos | 🔴 Não estruturada | Domínio, contas corporativas, MFA, GitHub org — a confirmar |
| Analytics / métricas | 🔴 Não integrado | `data-track` no HTML, sem funil/eventos definidos, sem ferramenta |
| Monitoramento / uptime | 🔴 Inexistente | Nenhum alerta de indisponibilidade da landing ou do app |
| Backup / DR | 🔴 Não definido | Sem RPO/RTO, sem teste de restauração (landing e app) |
| Testes / CI | 🔴 Inexistentes | `package.json` sem script `test` |

Legenda: 🟢 ok · 🟡 atenção · 🔴 pendente/não iniciado

---

## 4. Stack técnica (landing)

- **Framework:** Next.js `16.3.3` (App Router, `src/app/`). Versão fixada.
- **UI:** React `19.2.8`, TypeScript `^5` (strict), Tailwind CSS `^4`.
- **Animação:** Motion `^13.1.1` (`motion/react`); easing `[0.22, 1, 0.36, 1]` em
  `src/lib/motion.ts`.
- **Imagens:** `next/image` com imports estáticos.
- **Lint:** ESLint `^9` Flat Config. **Sem** script de testes ou type-check.
- **Pacotes:** npm. **Hospedagem prevista:** Vercel.
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
| Paleta | Só quente: cobre/bronze. **Azul e roxo proibidos** | Identidade da marca |
| Gradiente dos títulos | `#E87B00 → #FFC77E → #E87B00`, só na frase-chave | Mesmo tom dos botões |
| Botões | "Liquid glass" (iOS 26) | Relevo via `box-shadow` em camadas |
| Tipografia | Stack de sistema (Helvetica). **Sem webfont** | Zero download |
| Prova social | Nunca inflar contagem | Confiança + CDC art. 37 |
| Seção "Planos" | Desativada (código mantido) | Preços não definidos |

Tokens (dark): `cobre #e0824a` · `cobre claro #f3a267` · `cobre profundo #bf6631`
· `texto cobre #ef9f66` · `texto principal #f5f3f0` · `secundário #a6a4af` ·
`fundo #060606`.

### 6.3 Estado do Git (landing)

Commits de produto até `d1dc1f8` (30/08/2026, "Gradient-highlight the key phrase
in every section title"). Em 2026-09-01: adicionados `docs/PROJETO.md` e
`.gitignore` no branch `docs/projeto-acompanhamento` — **nada de código mudou**.

> ⚠️ `npm run lint` + `npm run build` **não foram executados** recentemente —
> sem garantia registrada de que compila. Rodar e anotar.

---

## 7. Próximos passos — plano convergido

> Resultado do debate Claude Code × Codex (2026-09-01). Detalhe do debate em
> `docs/referencia/_debate-proximos-passos-claude.md` + réplica do Codex no
> histórico da conversa. Ordem pensada para **escalabilidade** e **cobrir todas
> as camadas** de um produto comercial.

| # | Passo | Entrega / por quê |
|---|---|---|
| **0** *(semana 1, paralelo, barato)* | **(a)** ~~Definir estado real do app~~ ✅ pronto p/ lançar · **(b)** 🟡 corrigir promessas não comprovadas da landing — FAQ + JSON-LD feitos (branch `fix/faq-copy-claims`, revisado pelo Codex); **falta** o passe de voz da marca no resto da landing (decisão do dono) e a política de privacidade (vai no passo 3) · **(c)** domínio `nortgo.app` + contas corporativas + MFA + repo para org da empresa · **(d)** merge dos branches na `main` | Remove contradição, risco legal barato e dependência de conta pessoal |
| **1** | **Inventário factual do Base44** — telas, entidades, campos sensíveis, auth, papéis, automações, integrações, arquivos, limites do plano, capacidade de exportação | Fonte de verdade para todo o resto |
| **2** | **Prova de saída documental** — exportar amostra real de código/schema/dados/arquivos; registrar o que **não** sai; como recriar auth/automações; definir gatilhos **quantitativos** de migração | Mede lock-in de verdade, não por intenção |
| **3** | **Jurídico + dados** — finalizar política de privacidade; redigir Termos de Uso; inventário LGPD; classificação de dados (**notas/saúde/finanças = sensível**); registrar residência e subprocessadores do Base44; fluxo de exclusão/exportação de conta | Bloqueia divulgação ampla e submissão às lojas |
| **4** | **Landing pronta para tráfego** — definir funil/eventos **antes** de instalar analytics (sem cookie, ex. Plausible/Umami); uptime + alerta; backup dos leads (responsável, frequência, formato portátil, dedup, teste de restauração — cópia **fora** do Formspree); otimizar `nortgo-demo.mp4` + poster; testes básicos + CI mínima; acessibilidade (nav mobile, foco pós-sucesso, FAQ) | O entregável "Presença Web" |
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
| Autorização por dado (CRUD, RLS/FLS, IDOR/BOLA) | Base44 | 🔴 não validado |
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
- **Política de privacidade incompleta** coletando e-mails reais: risco LGPD.
- **Sem testes nem CI:** refactor grande é feito no escuro.

---

## 11. Registro de decisões

> Formato: data — decisão — motivo — impacto. Mais recente no topo.

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
| 2026-09-01 | Nota de continuidade no topo (branches abertos); passo 0(b) marcado como parcial; registro da correção de copy do FAQ + JSON-LD. | Claude + Wesley |
| 2026-09-01 | Reestruturação: escopo/fronteiras, resumo executivo revisado, plano convergido de próximos passos (debate Claude × Codex), camadas do projeto, seção de pagamento (Mercado Pago), riscos de lock-in. Estado do app corrigido para "pronto, faltando lançar". | Claude + Codex + Wesley |
| 2026-09-01 | Versão inicial: panorama completo a partir da análise do código (Codex + revisão manual). | Claude + Wesley |

---

## 13. Anexo sensível

`PROJETO.local.md` (raiz, ignorado pelo git): contas/serviços, dados da empresa,
números não divulgados, precificação, donos das camadas. Credenciais em
`.env.local`.
