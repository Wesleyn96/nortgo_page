import type { MetadataRoute } from "next";

const siteUrl = "https://nortgo.app";

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
