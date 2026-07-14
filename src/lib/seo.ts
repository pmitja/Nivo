import type { Metadata } from "next";

export const SITE_NAME = "Obrtio";
export const LEGAL_NAME = "MIPA, Mitja Pak s.p.";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://www.obrtio.si";
export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "info@obrtio.si";
export const CONTACT_PHONE =
  process.env.NEXT_PUBLIC_CONTACT_PHONE?.trim() || "031 285 143";
export const CONTACT_PHONE_HREF = CONTACT_PHONE.replace(/\s+/g, "");
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
  languages?: Record<string, string>;
};

export function createMetadata({
  title,
  description,
  path,
  keywords = [],
  locale = "sl_SI",
  languages,
}: SeoOptions): Metadata {
  const canonical = path === "/" ? SITE_URL : `${SITE_URL}${path}`;

  return {
    title,
    description,
    keywords,
    alternates: { canonical, languages },
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

export type BreadcrumbItem = {
  name: string;
  path: string;
};

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.path === "/" ? SITE_URL : `${SITE_URL}${item.path}`,
    })),
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function serviceJsonLd({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@type": "Service",
    name,
    description,
    url: `${SITE_URL}${path}`,
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: { "@type": "Country", name: "Slovenija" },
    audience: {
      "@type": "BusinessAudience",
      audienceType: "Obrtniki in lokalna izvajalska podjetja",
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
