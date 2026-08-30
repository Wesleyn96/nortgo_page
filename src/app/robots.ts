import type { MetadataRoute } from "next";

const siteUrl = "https://nortgo.app";

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
