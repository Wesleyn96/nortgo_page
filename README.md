# NortGo — Site

Site institucional do NortGo (`nortgo.com`), em [Next.js](https://nextjs.org)
16 (App Router, export estático) + TypeScript + Tailwind CSS v4. É só uma **tela
de entrada** curta que leva ao app (que roda no Base44, em `nortgo.com.br`) —
não coleta dados nem faz requisições externas.

## Rodando localmente

```bash
npm install
npm run dev     # http://localhost:3000
npm run verify  # lint + typecheck + testes + build
```

## Estrutura

```
src/
  app/
    page.tsx              <Entrada />
    layout.tsx            metadata, favicons, JSON-LD, tema dark fixo, <Footer />
    globals.css           tokens de tema, .entrada-*, .btn-glass-copper, animações
    privacidade/page.tsx  Política de Privacidade (noindex)
    termos/page.tsx       Termos de Uso (noindex)
    robots.ts sitemap.ts opengraph-image.tsx twitter-image.tsx
  components/
    Entrada.tsx  Footer.tsx  (+ .test.tsx)
  lib/
    links.ts             URLs do app no Base44
public/
  brand/  bg-*.webp  favicons + og
_headers                 cabeçalhos de segurança (formato Cloudflare)
next.config.ts           output: "export", images.unoptimized
wrangler.jsonc           deploy (Cloudflare Workers, assets de ./out)
```

Acompanhamento do projeto: `docs/PROJETO.md`. Fluxo de trabalho: `CLAUDE.md`.

## Segurança

- **Sem segredos no repo.** `.env*` no `.gitignore`; `.env.example` só documenta
  o que o backend de pagamento futuro vai precisar (nada usado hoje).
- **Cabeçalhos de segurança** (CSP restrita com `connect-src 'self'`,
  `X-Frame-Options: DENY`, HSTS `preload`, etc.) ficam em `public/_headers`
  (o `next.config.ts` do export estático não serve headers).

## Deploy

**Cloudflare Workers** via `wrangler.jsonc` — publica a pasta `./out` gerada
por `npm run build`. Redeploy automático a cada push na `main`.
