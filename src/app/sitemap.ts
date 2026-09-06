import type { MetadataRoute } from "next";

// Exigido com output: "export" — gerado uma vez no build.
export const dynamic = "force-static";

const siteUrl = "https://www.nortgo.com";

// Site pequeno e estático: só a home entra no índice. A política de
// privacidade fica de fora de propósito (noindex).
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
