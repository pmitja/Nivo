import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { AddonPricingCards } from "@/components/addon-pricing-cards";
import { CtaBand, Eyebrow, PageShell, SectionHeading } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { IncludedCheck } from "@/components/storitve/included-check";
import { ServiceVisual } from "@/components/storitve/service-visual";
import { AiAddonSection } from "@/components/storitve/ai-addon-section";
import { serviceAddons } from "@/lib/site-data";

const serviceAddonCards = serviceAddons.map((addon) => ({
  ...addon,
  unit: addon.title === "Oglasi" ? "kampanje" : addon.unit,
}));

const monthlyIncludedCards = [
  {
    num: "01",
    title: "Profesionalna spletna stran",
    desc: "Spletna stran do 5 podstrani, prilagojena vašim storitvam, lokaciji in strankam, ki iščejo izvajalca.",
    features: ["Spletna stran", "Kontaktni obrazci", "Mobilna optimizacija", "Osnovna SEO struktura", "Gostovanje"],
    visual: "site",
  },
  {
    num: "02",
    title: "Sistem za povpraševanja",
    desc: "Ko stranka odda povpraševanje, ga prejmete takoj. Sistem poskrbi tudi za samodejni odgovor, da stranka ve, da je njeno sporočilo prejeto.",
    features: ["SMS obvestila", "Samodejni odgovor stranki", "Pregled povpraševanj", "Sledenje kontaktom", "Analitika"],
    visual: "inquiries",
  },
  {
    num: "03",
    title: "Stranke, ocene in priporočila",
    desc: "Zadovoljne stranke lažje pustijo Google oceno ali vas priporočijo naprej. Obstoječim strankam lahko pošljete tudi akcije in obvestila.",
    features: ["Sistem za zbiranje ocen", "Kampanje za priporočila", "Kampanje za obstoječe stranke", "Pregled odzivov"],
    visual: "reviews",
  },
  {
    num: "04",
    title: "CMS, podpora in vzdrževanje",
    desc: "Vsebino lahko urejate sami, za tehnične stvari pa poskrbimo mi. Brez programerja za vsako majhno spremembo.",
    features: ["CMS sistem", "Urejanje vsebine", "Podpora", "Vzdrževanje", "Posodobitve"],
    visual: "cms",
  },
];

const packageHighlights = [
  "Spletna stran do 5 podstrani",
  "Povpraševanja in kontaktni obrazci",
  "SMS obvestila in samodejni odgovor",
  "Google ocene, priporočila in kampanje",
  "CMS, gostovanje, podpora in vzdrževanje",
];

export default function ServicesPage() {
  return (
    <PageShell active="storitve">
      <HeroSection />
      <IncludedSection />
      <AiAddonSection />
      <AddonsSection />
      <CtaBand
        title="En sistem. Ena cena. Več strank."
        text="Začnite z 80 € na mesec. Brez vezave, prekinitev kadarkoli."
      />
    </PageShell>
  );
}

function HeroSection() {
  return (
    <section className="relative bg-[linear-gradient(180deg,#FBFAFF,#fff_75%)] px-5 py-[72px] pb-[60px] text-center md:px-8">
      <div className="pointer-events-none absolute right-[-60px] top-[-120px] h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,#EFEBFF_0%,rgba(255,255,255,0)_70%)]" />
      <div className="relative mx-auto max-w-[760px]">
        <Eyebrow>Storitve</Eyebrow>
        <h1 className="mt-4 text-balance text-[40px] font-extrabold leading-[1.07] tracking-[-.035em] md:text-[52px]">
          Vse, kar potrebujete za več strank — v enem sistemu
        </h1>
        <p className="mx-auto mt-5 max-w-[600px] text-[18.5px] leading-[1.55] text-[#54515E]">
          Spletna stran, avtomatizirana povpraševanja, zbiranje ocen in marketing — vse poskrbljeno. Brez sestavljanja orodij, brez agencij.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3.5">
          <Button asChild>
            <Link href="/kontakt">
              Želim brezplačen posvet <ArrowRight size={17} />
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/cenik">Poglej cenik</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function IncludedSection() {
  return (
    <section className="bg-white px-5 py-[88px] md:px-8">
      <div className="mx-auto max-w-[1140px]">
        <SectionHeading
          eyebrow="Vključeno v mesečno naročnino"
          title="Ne dobite samo spletne strani. Dobite celoten spletni nastop."
          text="Postavimo vam profesionalno spletno stran in dodamo orodja, ki vam pomagajo sprejemati povpraševanja, obveščati stranke, zbirati ocene in urejati vsebino — brez dodatnih aplikacij in tehničnih skrbi."
          className="max-w-[820px]"
        />
        <div className="relative mt-[52px]">
          <div className="pointer-events-none absolute -left-[180px] top-[-70px] hidden h-[720px] w-[720px] rounded-full border-[88px] border-[#16151D] opacity-[.06] lg:block" />
          <div className="relative grid gap-5 lg:grid-cols-[.92fr_1.5fr]">
            <PackageCard />
            <div className="grid gap-5 md:grid-cols-2">
              {monthlyIncludedCards.map((item) => (
                <ServiceCard key={item.num} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PackageCard() {
  return (
    <div className="rounded-[28px] border border-[#E8E6F0] bg-white p-6 shadow-[0_28px_70px_rgba(20,19,29,.10)] md:p-8 lg:min-h-[720px]">
      <div className="inline-flex rounded-full bg-[#EFEBFF] px-4 py-2 text-[13px] font-extrabold text-[#6A5AE0]">
        od 80 € / mesec
      </div>
      <h3 className="mt-8 text-[38px] font-extrabold leading-[1.05] tracking-[-.035em] md:text-[48px]">
        Spletna stran + sistem v enem paketu
      </h3>
      <p className="mt-5 text-[17px] leading-[1.55] text-[#6A6775]">
        Primerno za obrtnike in lokalna podjetja, ki želijo profesionalen nastop, hitrejši odziv in manj dela z administracijo.
      </p>
      <ServiceVisual variant="package" />
      <div className="mt-7 flex flex-col gap-4">
        {packageHighlights.map((item) => (
          <IncludedCheck key={item} size="lg">
            {item}
          </IncludedCheck>
        ))}
      </div>
      <Button asChild size="lg" className="mt-7 w-full">
        <Link href="/kontakt">
          Rezerviraj brezplačen posvet <ArrowRight size={17} />
        </Link>
      </Button>
    </div>
  );
}

function ServiceCard({ item }: { item: (typeof monthlyIncludedCards)[number] }) {
  return (
    <article className="flex min-h-[350px] flex-col rounded-[24px] border border-[#E8E6F0] bg-white p-6 shadow-[0_18px_46px_rgba(20,19,29,.07)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#CFC9F8] hover:shadow-[0_24px_56px_rgba(106,90,224,.12)]">
      <div className="flex items-start justify-between gap-4">
        <span className="inline-flex h-[46px] min-w-[54px] items-center justify-center rounded-2xl bg-[#EFEBFF] px-4 text-[17px] font-extrabold text-[#6A5AE0]">
          {item.num}
        </span>
        <ServiceVisual variant={item.visual} compact />
      </div>
      <h3 className="mt-6 text-[25px] font-extrabold leading-[1.12] tracking-[-.025em] text-[#16151D] md:text-[29px]">
        {item.title}
      </h3>
      <p className="mt-4 text-[15.5px] leading-[1.55] text-[#6A6775]">{item.desc}</p>
      <div className="mt-6 flex flex-col gap-3">
        {item.features.map((feature) => (
          <IncludedCheck key={feature}>{feature}</IncludedCheck>
        ))}
      </div>
    </article>
  );
}

function AddonsSection() {
  return (
    <section className="bg-[#F6F4FC] px-5 py-[88px] md:px-8">
      <div className="mx-auto max-w-[1140px]">
        <SectionHeading
          eyebrow="Dodatne storitve"
          title="Razširite, ko ste pripravljeni"
          text="Enkratne nadgradnje za večjo vidnost in več povpraševanj."
        />
        <div className="mt-[46px]">
          <AddonPricingCards items={serviceAddonCards} columns="three" />
        </div>
      </div>
    </section>
  );
}
