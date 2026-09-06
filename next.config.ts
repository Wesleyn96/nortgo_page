import type { NextConfig } from "next";

// Site 100% estático hospedado no Cloudflare Pages: `next build` gera a pasta
// `out/` (output: "export"). Nesse modo o Next NÃO aplica headers() — os
// cabeçalhos de segurança (CSP, HSTS, etc.) vivem em `public/_headers`, no
// formato do Cloudflare Pages. Mantenha os dois em sincronia.
//
// `images.unoptimized`: o otimizador de imagem do Next precisa de servidor;
// no export ele é desligado e as imagens são servidas como estão. Os assets
// de marca já têm tamanho adequado.
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  poweredByHeader: false,
};

export default nextConfig;
