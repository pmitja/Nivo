import { AddonPricingCards } from "@/components/addon-pricing-cards";
import { FaqAccordion } from "@/components/faq-accordion";
import { PricingSwitcher } from "@/components/pricing-switcher";
import { CtaBand, Eyebrow, PageShell, SectionHeading } from "@/components/site-shell";
import { priceFaqs } from "@/lib/site-data";

const addons = [
  {
    title: "AI Pomočnik",
    price: "20 €",
    unit: "/ mesec",
    features: ["Povzetki sporočil", "Osnutki ponudb", "Manj administracije"],
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
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#FBFAFF_0%,#fff_78%)] px-5 pb-10 pt-[68px] text-center md:px-8 md:pt-[78px]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-full bg-[linear-gradient(90deg,rgba(106,90,224,.08)_1px,transparent_1px),linear-gradient(180deg,rgba(106,90,224,.06)_1px,transparent_1px)] bg-[size:118px_118px] [mask-image:linear-gradient(180deg,black,transparent_76%)]" />
        <div className="relative mx-auto max-w-[760px]">
          <Eyebrow>Cenik</Eyebrow>
          <h1 className="mt-4 text-balance text-[42px] font-extrabold leading-[1.04] tracking-[-.035em] md:text-[60px]">
            Preprost cenik, <span className="rounded-[12px] border border-[#E2DFF0] bg-white px-2 text-[#6A6775] shadow-[0_8px_24px_rgba(20,19,29,.06)] [-webkit-box-decoration-break:clone] [box-decoration-break:clone]">brez skritih stroškov</span>
          </h1>
          <p className="mx-auto mt-5 max-w-[600px] text-[18px] leading-[1.6] text-[#54515E]">
            Spletna stran, SMS sistem, Google ocene, kampanje, gostovanje in podpora v enem paketu.
          </p>
        </div>
      </section>

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

      <CtaBand title="Pripravljeni na več povpraševanj?" text="80 € na mesec ali 780 € za eno leto. Brez vezave. Začnete prejemati povpraševanja v 10 dneh." />
    </PageShell>
  );
}
