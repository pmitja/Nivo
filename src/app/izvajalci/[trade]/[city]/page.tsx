import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CompanyCard } from "@/components/directory/company-card";
import { PageShell } from "@/components/site-shell";
import { CtaBand } from "@/components/site-primitives";
import { HeroHighlight, SubpageHero } from "@/components/subpage-hero";
import { getCompaniesForTrade, getDirectoryCompanies, getTrade, groupByCity, siteUrl } from "@/lib/directory";

export const revalidate = 3600;

type Params = { trade: string; city: string };

export async function generateStaticParams(): Promise<Params[]> {
  const all = await getDirectoryCompanies().catch(() => []);
  const seen = new Set<string>();
  const params: Params[] = [];
  for (const company of all) {
    const key = `${company.trade.slug}/${company.citySlug}`;
    if (!seen.has(key)) {
      seen.add(key);
      params.push({ trade: company.trade.slug, city: company.citySlug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { trade: tradeSlug, city: citySlug } = await params;
  const trade = getTrade(tradeSlug);
  if (!trade) return {};

  const companies = (await getCompaniesForTrade(trade.slug)).filter((company) => company.citySlug === citySlug);
  const cityName = companies[0]?.city ?? citySlug.replace(/-/g, " ");

  const singular = trade.singular.charAt(0).toUpperCase() + trade.singular.slice(1);
  const title = `${singular} ${cityName} in okolica — preverjeni izvajalci | Nivo`;
  const description = `Iščete ${trade.searchPhrase} v kraju ${cityName} in okolici? Preverjeni lokalni izvajalci, ki hitro odgovorijo na povpraševanje. ${trade.intro}`;

  return {
    title,
    description,
    alternates: { canonical: `${siteUrl}/izvajalci/${trade.slug}/${citySlug}` },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/izvajalci/${trade.slug}/${citySlug}`,
      locale: "sl_SI",
      type: "website",
    },
  };
}

export default async function TradeCityPage({ params }: { params: Promise<Params> }) {
  const { trade: tradeSlug, city: citySlug } = await params;
  const trade = getTrade(tradeSlug);
  if (!trade) notFound();

  const allForTrade = await getCompaniesForTrade(trade.slug);
  const companies = allForTrade.filter((company) => company.citySlug === citySlug);
  if (companies.length === 0) notFound();

  const cityName = companies[0].city;
  const otherCities = groupByCity(allForTrade).filter((group) => group.citySlug !== citySlug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${trade.plural} — ${cityName} in okolica`,
    numberOfItems: companies.length,
    itemListElement: companies.map((company, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "LocalBusiness",
        name: company.name,
        telephone: company.phone,
        address: { "@type": "PostalAddress", addressLocality: company.city, addressCountry: "SI" },
        url: `${siteUrl}/obrazec/${company.id}`,
      },
    })),
  };

  return (
    <PageShell active="izvajalci">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SubpageHero
        badge={`Imenik izvajalcev · ${trade.plural}`}
        title={
          <>
            {trade.plural} — <HeroHighlight>{cityName} in okolica</HeroHighlight>
          </>
        }
        text={`${trade.intro} Izberite izvajalca in mu pošljite povpraševanje — odgovor dobite hitro, saj vsi uporabljajo SMS obvestila Nivo.`}
      />

      <section className="bg-white px-5 pb-24 pt-4 md:px-8">
        <div className="mx-auto max-w-[1100px]">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {companies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>

          {otherCities.length > 0 ? (
            <div className="mt-14 rounded-[20px] border border-[#ECEAF3] bg-[#FBFAFF] p-7">
              <div className="text-xs font-bold uppercase tracking-[.06em] text-[#9A97A5]">
                {trade.plural} v drugih krajih
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {otherCities.map((group) => (
                  <Link
                    key={group.citySlug}
                    href={`/izvajalci/${trade.slug}/${group.citySlug}`}
                    className="rounded-full border border-[#ECEAF3] bg-white px-4 py-1.5 text-[13.5px] font-semibold text-[#56535F] no-underline transition-colors hover:border-[#6A5AE0] hover:text-[#6A5AE0]"
                  >
                    {group.city} in okolica
                  </Link>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-12 text-center">
            <Link href={`/izvajalci/${trade.slug}`} className="text-[14.5px] font-bold text-[#6A5AE0] no-underline hover:underline">
              ← Vsi {trade.plural.toLowerCase()} po Sloveniji
            </Link>
          </div>
        </div>
      </section>

      <CtaBand
        title={`Ste ${trade.singular} v kraju ${cityName}?`}
        text="Pridružite se sistemu Nivo — dobite spletno stran, SMS obvestila in mesto v imeniku, kjer vas stranke same najdejo."
      />
    </PageShell>
  );
}
