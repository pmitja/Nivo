import type { Metadata } from "next";

export const SITE_NAME = "Obrtio";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://obrtio.si";
export const DEFAULT_DESCRIPTION =
  "Spletna stran in sistem za obrtnike: povpraševanja, SMS obvestila, Google ocene, kampanje in pregled strank na enem mestu.";
export const OG_IMAGE = `${SITE_URL}/opengraph-image.png`;
export const OG_IMAGE_ALT = "Obrtio — več povpraševanj za obrtnike";

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
      images: [
        {
          url: OG_IMAGE,
          width: 1200,
          height: 630,
          alt: OG_IMAGE_ALT,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE],
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
