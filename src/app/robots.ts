import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/directory";

export default function robots(): MetadataRoute.Robots {
  return {
    host: siteUrl,
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/dashboard",
          "/api",
          "/test-povprasevanje",
          "/nova-domaca",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
