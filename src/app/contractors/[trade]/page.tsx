import Link from "next/link";
import { notFound } from "next/navigation";

import { CompanyCard } from "@/components/directory/company-card";
import { PageShell } from "@/components/site-shell";
import { CtaBand, SectionHeading } from "@/components/site-primitives";
import { HeroHighlight, SubpageHero } from "@/components/subpage-hero";
import { getCompaniesForTrade, getDirectoryCountries, getTradeByEnglishSlug } from "@/lib/directory";

const tradeNames: Record<string, string> = { elektricar: "Electricians", vodovodar: "Plumbers", krovec: "Roofers", fasader: "Exterior contractors", "monter-klim": "HVAC installers", "toplotne-crpalke": "Heat-pump installers", "soncne-elektrarne": "Solar installers", "gradbeno-podjetje": "General contractors", keramicar: "Tile installers", mizar: "Carpenters", slikopleskar: "Painters" };

export default async function ContractorTradePage({ params, searchParams }: { params: Promise<{ trade: string }>; searchParams: Promise<{ country?: string }> }) {
  const [{ trade: tradeSlug }, { country: requestedCountry }] = await Promise.all([params, searchParams]);
  const trade = getTradeByEnglishSlug(tradeSlug);
  if (!trade) notFound();
  const countries = await getDirectoryCountries();
  const country = countries.includes((requestedCountry ?? "").toUpperCase()) ? requestedCountry!.toUpperCase() : (countries.includes("SI") ? "SI" : countries[0] ?? "SI");
  const companies = await getCompaniesForTrade(trade.slug, country);
  const tradeName = tradeNames[trade.slug] ?? trade.plural;

  return <PageShell active="izvajalci" locale="en"><main><SubpageHero badge={`Contractor directory · ${tradeName}`} title={<><HeroHighlight>{tradeName}</HeroHighlight> in {country}</>} text={`${trade.intro} Browse local businesses and send an inquiry directly — every listed contractor receives instant notifications.`} /><section className="bg-white px-5 pb-24 pt-4 md:px-8"><div className="mx-auto max-w-[1100px]">{companies.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{companies.map((company) => <CompanyCard key={company.id} company={company} locale="en" />)}</div> : <SectionHeading title="There are no contractors in this category yet" text="The first contractor will be added soon. Are you a contractor? Join Obrtio and let customers find you here." />}<div className="mt-12 text-center"><Link href={`/contractors?country=${country}`} className="text-[14.5px] font-bold text-[#6A5AE0] no-underline hover:underline">← All contractor categories</Link></div></div></section><CtaBand locale="en" title={`Are you a ${tradeName.toLowerCase()}?`} text="Join Obrtio and get a website, instant notifications and a place in the directory." /></main></PageShell>;
}
