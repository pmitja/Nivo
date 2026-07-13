import type { MetadataRoute } from "next";

import { getDirectoryCompanies, siteUrl, trades } from "@/lib/directory";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/storitve`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/kako-deluje`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/cenik`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/kontakt`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/spletna-stran-za-obrtnike`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/spletna-stran-za-krovce`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/izvajalci`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/en`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const all = await getDirectoryCompanies().catch(() => []);
  const populatedTrades = new Set(all.map((company) => company.trade.slug));
  const tradePages: MetadataRoute.Sitemap = trades
    .filter((trade) => populatedTrades.has(trade.slug))
    .map((trade) => ({
      url: `${siteUrl}/izvajalci/${trade.slug}`,
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  const seen = new Set<string>();
  const cityPages: MetadataRoute.Sitemap = [];
  for (const company of all) {
    const path = `/izvajalci/${company.trade.slug}/${company.citySlug}`;
    if (!seen.has(path)) {
      seen.add(path);
      cityPages.push({ url: `${siteUrl}${path}`, changeFrequency: "weekly", priority: 0.8 });
    }
  }

  return [...staticPages, ...tradePages, ...cityPages];
}
