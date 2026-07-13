import { inArray } from "drizzle-orm";
import { cache } from "react";

import { db } from "@/db";
import { companies, type Company } from "@/db/schema";

export type Trade = {
  slug: string;
  plural: string;
  singular: string;
  searchPhrase: string;
  icon: string;
  intro: string;
  keywords: string[];
};

export const trades: Trade[] = [
  {
    slug: "elektricar",
    plural: "Električarji",
    singular: "električar",
    searchPhrase: "električarja",
    icon: "/directory/elektricar-transparent.webp",
    intro: "Elektroinštalacije, priklopi, meritve in odprava napak.",
    keywords: ["elektri", "elektro"],
  },
  {
    slug: "vodovodar",
    plural: "Vodovodarji",
    singular: "vodovodar",
    searchPhrase: "vodovodarja",
    icon: "/directory/vodovodar-transparent.webp",
    intro: "Vodovodne inštalacije, popravila, adaptacije kopalnic.",
    keywords: ["vodovod", "vodoinstal", "instalater", "instalacij"],
  },
  {
    slug: "krovec",
    plural: "Krovci",
    singular: "krovec",
    searchPhrase: "krovca",
    icon: "/directory/krovec-transparent.webp",
    intro: "Nove strehe, prekrivanje, popravila in kleparska dela.",
    keywords: ["krov", "streh", "klepar"],
  },
  {
    slug: "fasader",
    plural: "Fasaderji",
    singular: "fasader",
    searchPhrase: "fasaderja",
    icon: "/directory/fasader-transparent.webp",
    intro: "Izdelava in obnova fasad ter toplotnih izolacij.",
    keywords: ["fasad", "izolacij"],
  },
  {
    slug: "monter-klim",
    plural: "Monterji klim",
    singular: "monter klimatskih naprav",
    searchPhrase: "monterja klim",
    icon: "/directory/monter-klim-transparent.webp",
    intro: "Montaža, servis in vzdrževanje klimatskih naprav.",
    keywords: ["klim", "hvac", "hlajen", "prezrac", "prezrač"],
  },
  {
    slug: "toplotne-crpalke",
    plural: "Monterji toplotnih črpalk",
    singular: "monter toplotnih črpalk",
    searchPhrase: "monterja toplotnih črpalk",
    icon: "/directory/toplotne-crpalke-transparent.webp",
    intro: "Toplotne črpalke in sodobni ogrevalni sistemi.",
    keywords: ["toplotn", "crpalk", "ogrevan"],
  },
  {
    slug: "soncne-elektrarne",
    plural: "Monterji sončnih elektrarn",
    singular: "monter sončnih elektrarn",
    searchPhrase: "monterja sončnih elektrarn",
    icon: "/directory/soncne-elektrarne-transparent.webp",
    intro: "Sončne elektrarne, fotovoltaika in hranilniki energije.",
    keywords: ["soncn", "solar", "fotovolt", "elektrarn"],
  },
  {
    slug: "gradbeno-podjetje",
    plural: "Gradbena podjetja",
    singular: "gradbeno podjetje",
    searchPhrase: "gradbeno podjetje",
    icon: "/directory/gradbeno-podjetje-transparent.webp",
    intro: "Novogradnje, adaptacije in splošna gradbena dela.",
    keywords: ["gradb", "gradnj", "adaptacij"],
  },
  {
    slug: "keramicar",
    plural: "Keramičarji",
    singular: "keramičar",
    searchPhrase: "keramičarja",
    icon: "/directory/keramicar-transparent.webp",
    intro: "Polaganje keramike, ploščic in kamna.",
    keywords: ["kerami", "plosc", "polaganje"],
  },
  {
    slug: "mizar",
    plural: "Mizarji",
    singular: "mizar",
    searchPhrase: "mizarja",
    icon: "/directory/mizar-transparent.webp",
    intro: "Pohištvo po meri, kuhinje in mizarska dela.",
    keywords: ["mizar", "pohistv", "les"],
  },
  {
    slug: "slikopleskar",
    plural: "Slikopleskarji",
    singular: "slikopleskar",
    searchPhrase: "slikopleskarja",
    icon: "/directory/slikopleskar-transparent.webp",
    intro: "Pleskanje, gladke stene in dekorativni ometi.",
    keywords: ["pleskar", "slikoplesk", "barvan"],
  },
];

export function getTrade(slug: string): Trade | undefined {
  return trades.find((trade) => trade.slug === slug);
}

const DIACRITICS: Record<string, string> = { č: "c", š: "s", ž: "z", ć: "c", đ: "d" };

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[čšžćđ]/g, (ch) => DIACRITICS[ch] ?? ch)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export function slugifyCity(city: string): string {
  return normalize(city.trim())
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function matchTrade(industry: string | null): Trade | undefined {
  if (!industry) return undefined;
  const normalized = normalize(industry);
  return trades.find((trade) => trade.keywords.some((keyword) => normalized.includes(keyword)));
}

export type DirectoryCompany = {
  id: string;
  name: string;
  city: string;
  citySlug: string;
  industry: string;
  phone: string;
  email: string;
  domain: string | null;
  logoUrl: string | null;
  trade: Trade;
};

const VISIBLE_STATUSES: Company["status"][] = ["active"];

export const getDirectoryCompanies = cache(async (): Promise<DirectoryCompany[]> => {
  const rows = await db
    .select({
      id: companies.id,
      name: companies.name,
      city: companies.city,
      industry: companies.industry,
      phone: companies.phone,
      email: companies.email,
      domain: companies.domain,
      logoUrl: companies.logoUrl,
    })
    .from(companies)
    .where(inArray(companies.status, VISIBLE_STATUSES))
    .orderBy(companies.name);

  return rows.flatMap((row) => {
    const trade = matchTrade(row.industry);
    if (!trade || !row.city?.trim()) return [];
    return [
      {
        id: row.id,
        name: row.name,
        city: row.city.trim(),
        citySlug: slugifyCity(row.city),
        industry: row.industry!.trim(),
        phone: row.phone,
        email: row.email,
        domain: row.domain?.trim() || null,
        logoUrl: row.logoUrl,
        trade,
      },
    ];
  });
});

export async function getCompaniesForTrade(tradeSlug: string): Promise<DirectoryCompany[]> {
  const all = await getDirectoryCompanies();
  return all.filter((company) => company.trade.slug === tradeSlug);
}

export type CityGroup = { citySlug: string; city: string; companies: DirectoryCompany[] };

export function groupByCity(list: DirectoryCompany[]): CityGroup[] {
  const groups = new Map<string, CityGroup>();
  for (const company of list) {
    const group = groups.get(company.citySlug);
    if (group) {
      group.companies.push(company);
    } else {
      groups.set(company.citySlug, { citySlug: company.citySlug, city: company.city, companies: [company] });
    }
  }
  return [...groups.values()].sort((a, b) => b.companies.length - a.companies.length || a.city.localeCompare(b.city, "sl"));
}

export function companyWebsiteUrl(company: DirectoryCompany): string | null {
  if (!company.domain) return null;
  return company.domain.startsWith("http") ? company.domain : `https://${company.domain}`;
}

export function companyContactUrl(company: DirectoryCompany): string {
  return `/obrazec/${company.id}`;
}

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://obrtio.si";
