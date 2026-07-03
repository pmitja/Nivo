import type { Metadata } from "next";

export const SITE_NAME = "Nivo";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://nivo.si";
export const DEFAULT_DESCRIPTION =
  "Spletna stran in sistem za obrtnike: povpraševanja, SMS obvestila, Google ocene, kampanje in pregled strank na enem mestu.";

type SeoOptions = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  locale?: "sl_SI" | "en_US";
};

export function createMetadata({
  title,
  description,
  path,
  keywords = [],
  locale = "sl_SI",
}: SeoOptions): Metadata {
  const canonical = path === "/" ? SITE_URL : `${SITE_URL}${path}`;

  return {
    title,
    description,
    keywords,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export const noIndexMetadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};
