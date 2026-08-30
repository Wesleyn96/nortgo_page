# NortGo — Site

Landing page de conversão do NortGo, construída em [Next.js](https://nextjs.org) (App Router) + TypeScript + Tailwind CSS.

## Rodando localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Estrutura de pastas

```
src/
  app/                 rotas (App Router)
    page.tsx           home
    privacidade/       política de privacidade
    layout.tsx          fontes, metadata, Nav/Footer globais
    globals.css        tokens de design (cor, tipografia, animação)
  components/          componentes de UI, um arquivo por seção
public/
  brand/               logo e assets de marca (não editar sem atualizar Nav/Footer/Preview)
```

Sem pasta `lib/`, `api/` ou banco de dados ainda — o site atual é 100% estático,
focado em design e captura de lista de espera. Essa separação (`app/` só para
rotas, `components/` para UI) já deixa espaço para crescer sem reorganizar:
quando entrar integração de pagamento (Mercado Pago) ou backend próprio, a
lógica de servidor entra em `src/app/api/` e segredos em variáveis de
ambiente — nunca em código.

## Segurança

- **Sem segredos no repositório.** `.env*` está no `.gitignore`; use
  `.env.example` como referência do que será necessário quando o backend de
  pagamento for implementado (nada disso é usado hoje).
- **Cabeçalhos de segurança** (CSP, `X-Frame-Options`, `Referrer-Policy`,
  `Permissions-Policy`, HSTS) são aplicados globalmente em `next.config.ts`.
- **Formulário de lista de espera** usa Formspree com honeypot anti-spam;
  o endpoint do formulário é público por design (não é um segredo).
- Ao adicionar o webhook do Mercado Pago no futuro, valide sempre a
  assinatura da notificação no servidor antes de gravar qualquer dado.

## Deploy

Recomendado: [Vercel](https://vercel.com/new) (HTTPS automático, preview
por PR). Qualquer host compatível com Next.js funciona.
