import type { MetadataRoute } from "next";

// Exigido com output: "export" — gerado uma vez no build.
export const dynamic = "force-static";

const siteUrl = "https://www.nortgo.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // A página de privacidade já pede noindex no próprio metadata;
      // reforçamos aqui para crawlers que ignoram a meta tag.
      disallow: "/privacidade",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
