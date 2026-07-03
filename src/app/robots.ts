import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/directory";

export default function robots(): MetadataRoute.Robots {
  return {
    host: siteUrl,
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/dashboard", "/prijava", "/api", "/test-povprasevanje"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
