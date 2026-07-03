import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { PageShell } from "@/components/site-shell";
import { CtaBand } from "@/components/site-primitives";
import { HeroHighlight, SubpageHero } from "@/components/subpage-hero";
import { getDirectoryCompanies, groupByCity, trades } from "@/lib/directory";
import { createMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = createMetadata({
  title: "Preverjeni izvajalci po Sloveniji",
  description:
    "Poiščite preverjenega električarja, vodovodarja, krovca ali drugega izvajalca v svojem kraju. Vsi izvajalci odgovarjajo hitro in imajo urejeno spletno stran.",
  path: "/izvajalci",
  keywords: ["izvajalci Slovenija", "lokalni izvajalci", "preverjeni obrtniki"],
});

export default async function DirectoryIndexPage() {
  const all = await getDirectoryCompanies();

  const byTrade = trades
    .map((trade) => {
      const companies = all.filter((company) => company.trade.slug === trade.slug);
      return { trade, count: companies.length, cities: groupByCity(companies).slice(0, 4) };
    })
    .sort((a, b) => b.count - a.count);

  return (
    <PageShell active="izvajalci">
      <SubpageHero
        badge="Imenik izvajalcev"
        title={
          <>
            Najdite <HeroHighlight>preverjenega izvajalca</HeroHighlight> v svojem kraju
          </>
        }
        text="Vsi izvajalci v imeniku uporabljajo sistem Nivo — to pomeni hitre odgovore, urejeno spletno stran in resen odnos do strank."
      />

      <section className="bg-white px-5 pb-24 pt-4 md:px-8">
        <div className="mx-auto grid max-w-[1100px] gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {byTrade.map(({ trade, count, cities }) => (
            <Link
              key={trade.slug}
              href={`/izvajalci/${trade.slug}`}
              className="group flex flex-col rounded-[20px] border border-[#ECEAF3] bg-white p-6 no-underline shadow-[0_2px_10px_rgba(20,19,29,.04)] transition-all duration-200 hover:-translate-y-1 hover:border-[#D8D2F0] hover:shadow-[0_18px_44px_rgba(20,19,29,.10)]"
            >
              <div className="flex items-center justify-between">
                <Image
                  src={trade.icon}
                  alt=""
                  width={64}
                  height={64}
                  className="object-contain"
                />
                {count > 0 ? (
                  <span className="rounded-full bg-[#EFEBFF] px-2.5 py-1 text-[12.5px] font-bold text-[#6A5AE0]">
                    {count} {count === 1 ? "izvajalec" : count === 2 ? "izvajalca" : count < 5 ? "izvajalci" : "izvajalcev"}
                  </span>
                ) : null}
              </div>
              <h2 className="mt-4 text-[18px] font-extrabold tracking-[-.01em] text-[#16151D]">{trade.plural}</h2>
              <p className="mt-1.5 text-[14px] leading-[1.5] text-[#54515E]">{trade.intro}</p>
              {cities.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {cities.map((group) => (
                    <span key={group.citySlug} className="rounded-full border border-[#ECEAF3] px-2.5 py-0.5 text-[12.5px] font-semibold text-[#56535F]">
                      {group.city}
                    </span>
                  ))}
                </div>
              ) : null}
              <span className="mt-auto flex items-center gap-1.5 pt-4 text-[14px] font-bold text-[#6A5AE0]">
                Poglej izvajalce <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <CtaBand
        title="Ste izvajalec in vas še ni na seznamu?"
        text="Pridružite se sistemu Nivo — dobite spletno stran, SMS obvestila in mesto v imeniku, kjer vas stranke same najdejo."
      />
    </PageShell>
  );
}
