import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/directory";

const disallowedPaths = ["/admin", "/dashboard", "/api"];

export default function robots(): MetadataRoute.Robots {
  return {
    host: siteUrl,
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: disallowedPaths,
      },
      {
        userAgent: [
          "OAI-SearchBot",
          "ChatGPT-User",
          "GPTBot",
          "ClaudeBot",
          "PerplexityBot",
          "Google-Extended",
        ],
        allow: "/",
        disallow: disallowedPaths,
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
