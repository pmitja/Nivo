import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CompanyCard } from "@/components/directory/company-card";
import { JsonLd } from "@/components/json-ld";
import { PageShell } from "@/components/site-shell";
import { CtaBand, SectionHeading } from "@/components/site-primitives";
import { HeroHighlight, SubpageHero } from "@/components/subpage-hero";
import { getCompaniesForTrade, getTrade, groupByCity, siteUrl, trades } from "@/lib/directory";
import { breadcrumbJsonLd, createMetadata } from "@/lib/seo";

export const revalidate = 3600;

type Params = { trade: string };

export function generateStaticParams(): Params[] {
  return trades.map((trade) => ({ trade: trade.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { trade: tradeSlug } = await params;
  const trade = getTrade(tradeSlug);
  if (!trade) return {};

  const singular = trade.singular.charAt(0).toUpperCase() + trade.singular.slice(1);
  const title = `${singular} — preverjeni izvajalci po Sloveniji`;
  const description = `Iščete ${trade.searchPhrase}? Preverjeni izvajalci po Sloveniji, ki hitro odgovorijo na povpraševanje. ${trade.intro}`;
  return createMetadata({
    title,
    description,
    path: `/izvajalci/${trade.slug}`,
    keywords: [trade.plural.toLowerCase(), `${trade.singular} Slovenija`, `preverjeni ${trade.plural.toLowerCase()}`],
  });
}

export default async function TradePage({ params }: { params: Promise<Params> }) {
  const { trade: tradeSlug } = await params;
  const trade = getTrade(tradeSlug);
  if (!trade) notFound();

  const companies = await getCompaniesForTrade(trade.slug);
  const cityGroups = groupByCity(companies);

  const jsonLd = {
    "@type": "ItemList",
    name: `${trade.plural} po Sloveniji`,
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
      <JsonLd data={[breadcrumbJsonLd([{name:"Domov",path:"/"},{name:"Izvajalci",path:"/izvajalci"},{name:trade.plural,path:`/izvajalci/${trade.slug}`}]), jsonLd]} />
      <SubpageHero
        badge={`Imenik izvajalcev · ${trade.plural}`}
        title={
          <>
            <HeroHighlight>{trade.plural}</HeroHighlight> po Sloveniji
          </>
        }
        text={`${trade.intro} Vsi izvajalci na seznamu hitro odgovorijo na povpraševanje — pošljete ga v minuti.`}
      >
        {cityGroups.length > 0 ? (
          <div className="mt-7 flex flex-wrap justify-center gap-2">
            {cityGroups.map((group) => (
              <Link
                key={group.citySlug}
                href={`/izvajalci/${trade.slug}/${group.citySlug}`}
                className="rounded-full border border-[#E4E0F4] bg-white px-4 py-1.5 text-[13.5px] font-semibold text-[#56535F] no-underline shadow-[0_2px_8px_rgba(20,19,29,.05)] transition-colors hover:border-[#6A5AE0] hover:text-[#6A5AE0]"
              >
                {group.city} in okolica
              </Link>
            ))}
          </div>
        ) : null}
      </SubpageHero>

      <section className="bg-white px-5 pb-24 pt-4 md:px-8">
        <div className="mx-auto max-w-[1100px]">
          {companies.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {companies.map((company) => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </div>
          ) : (
            <SectionHeading
              title="Na tem seznamu še ni izvajalcev"
              text={`Prvi ${trade.singular} bo dodan kmalu. Ste izvajalec? Pridružite se sistemu Obrtio in stranke vas bodo našle tukaj.`}
            />
          )}
          <div className="mt-12 text-center">
            <Link href="/izvajalci" className="text-[14.5px] font-bold text-[#6A5AE0] no-underline hover:underline">
              ← Vse panoge v imeniku
            </Link>
          </div>
        </div>
      </section>

      <CtaBand
        title={`Ste ${trade.singular} in vas še ni na seznamu?`}
        text="Pridružite se sistemu Obrtio — dobite spletno stran, SMS obvestila in mesto v imeniku, kjer vas stranke same najdejo."
      />
    </PageShell>
  );
}
