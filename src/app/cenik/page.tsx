import { AddonPricingCards } from "@/components/addon-pricing-cards";
import { FaqAccordion } from "@/components/faq-accordion";
import { PricingSwitcher } from "@/components/pricing-switcher";
import { CtaBand, PageShell, SectionHeading } from "@/components/site-shell";
import { HeroHighlight, SubpageHero } from "@/components/subpage-hero";
import { createMetadata } from "@/lib/seo";
import { priceFaqs } from "@/lib/site-data";

export const metadata = createMetadata({
  title: "Cenik — spletna stran in sistem od 99 €",
  description:
    "Spletna stran, SMS obvestila, Google ocene, kampanje, gostovanje in podpora za 99 € na mesec ali 950 € na leto. Brez vezave.",
  path: "/cenik",
  keywords: ["cena spletne strani", "spletna stran 99 €", "cenik za obrtnike"],
});

const addons = [
  {
    title: "AI Pomočnik",
    price: "Pride kmalu",
    unit: "",
    features: ["Povzetki sporočil", "Osnutki ponudb", "V pripravi"],
  },
  {
    title: "Google Business Profil",
    price: "500 €",
    unit: "enkratno",
    features: ["Nastavitev profila", "Optimizacija kategorij", "Boljši lokalni vtis"],
  },
  {
    title: "SEO Optimizacija",
    price: "500 €",
    unit: "enkratno",
    features: ["Lokalni SEO", "Tehnična ureditev", "Ključne vsebine"],
  },
  {
    title: "Oglasi",
    price: "Po ponudbi",
    unit: "kampanje",
    features: ["Google oglasi", "Meta in TikTok", "Vodenje kampanj"],
  },
];

export default function PricingPage() {
  return (
    <PageShell active="cenik">
      <SubpageHero
        badge="Cenik"
        title={
          <>
            Preprost cenik, <HeroHighlight>brez skritih stroškov</HeroHighlight>
          </>
        }
        text="Spletna stran, SMS sistem, Google ocene, kampanje, gostovanje in podpora v enem paketu."
      />

      <PricingSwitcher />

      <section className="bg-[#F6F4FC] px-5 py-[76px] md:px-8">
        <div className="mx-auto max-w-[1080px]">
          <SectionHeading eyebrow="Dodatne storitve" title="Dodajte, ko ste pripravljeni" />
          <div className="mt-10">
            <AddonPricingCards items={addons} />
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-[88px] md:px-8">
        <div className="mx-auto max-w-[760px]">
          <SectionHeading eyebrow="Pogosta vprašanja" title="Vse o ceni in pogojih" />
          <FaqAccordion items={priceFaqs} />
        </div>
      </section>

      <CtaBand title="Pripravljeni na več povpraševanj?" text="99 € na mesec ali 950 € za 12 mesecev. Brez vezave. Začnete prejemati povpraševanja v 10 dneh." />
    </PageShell>
  );
}
