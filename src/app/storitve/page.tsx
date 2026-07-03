import Link from "next/link";
import { ArrowRight, Check, Globe2, LifeBuoy, Mail, Star } from "lucide-react";

import { AddonPricingCards } from "@/components/addon-pricing-cards";
import { CtaBand, PageShell, SectionHeading } from "@/components/site-shell";
import { HeroHighlight, SubpageHero } from "@/components/subpage-hero";
import { Button } from "@/components/ui/button";
import { AiAddonSection } from "@/components/storitve/ai-addon-section";
import { serviceAddons } from "@/lib/site-data";

const serviceAddonCards = serviceAddons.map((addon) => ({
  ...addon,
  unit: addon.title === "Oglasi" ? "kampanje" : addon.unit,
}));

const monthlyIncludedCards = [
  {
    num: "01",
    icon: Globe2,
    title: "Profesionalna spletna stran",
    desc: "Spletna stran do 5 podstrani, prilagojena vašim storitvam, lokaciji in strankam, ki iščejo izvajalca.",
    features: ["Spletna stran", "Kontaktni obrazci", "Mobilna optimizacija", "Osnovna SEO struktura", "Gostovanje"],
  },
  {
    num: "02",
    icon: Mail,
    title: "Sistem za povpraševanja",
    desc: "Ko stranka odda povpraševanje, vi takoj prejmete SMS, stranka pa e-poštno potrdilo, da je bilo sporočilo uspešno poslano.",
    features: ["SMS obvestilo obrtniku", "E-poštno potrdilo stranki", "Pregled povpraševanj", "Sledenje kontaktom", "Analitika"],
  },
  {
    num: "03",
    icon: Star,
    title: "Stranke, ocene in priporočila",
    desc: "Zadovoljne stranke lažje pustijo Google oceno ali vas priporočijo naprej. Obstoječim strankam lahko pošljete tudi akcije in obvestila.",
    features: ["Sistem za zbiranje ocen", "Kampanje za priporočila", "Kampanje za obstoječe stranke", "Pregled odzivov"],
  },
  {
    num: "04",
    icon: LifeBuoy,
    title: "Popolna skrb za spletno stran",
    desc: "Za vsebino, posodobitve, gostovanje in tehnično vzdrževanje v celoti skrbi ekipa Nivo. Vi se lahko posvetite svojemu delu.",
    features: ["Urejanje vsebine", "Tehnična podpora", "Gostovanje", "Vzdrževanje", "Posodobitve"],
  },
];

const packageHighlights = [
  "Spletna stran do 5 podstrani",
  "Povpraševanja in kontaktni obrazci",
  "SMS obrtniku in e-poštno potrdilo stranki",
  "Google ocene, priporočila in kampanje",
  "Popolna skrb, gostovanje, podpora in vzdrževanje",
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
        text="Začnite z 99 € na mesec ali 950 € za 12 mesecev. Brez vezave, prekinitev kadarkoli."
      />
    </PageShell>
  );
}

function HeroSection() {
  return (
    <SubpageHero
      badge="Storitve"
      title={
        <>
          Vse za več strank — v <HeroHighlight>enem sistemu</HeroHighlight>
        </>
      }
      text="Spletna stran, avtomatizirana povpraševanja, zbiranje ocen in marketing — vse poskrbljeno. Brez sestavljanja orodij, brez agencij."
    >
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
    </SubpageHero>
  );
}

function IncludedSection() {
  return (
    <section className="bg-white px-5 py-[88px] md:px-8">
      <div className="mx-auto max-w-[1140px]">
        <SectionHeading
          eyebrow="Vključeno v mesečno naročnino"
          title="Ne dobite samo spletne strani. Dobite celoten spletni nastop."
          text="Postavimo vam profesionalno spletno stran in dodamo orodja za povpraševanja, obvestila, ocene in kampanje. Za vsebino ter tehnično delovanje spletne strani ves čas skrbimo mi."
          className="max-w-[820px]"
        />
        <div className="mt-14 grid items-stretch gap-4 lg:grid-cols-[.95fr_1.45fr]">
          <PackageCard />
          <div className="grid gap-4 md:grid-cols-2">
            {monthlyIncludedCards.map((item) => (
              <ServiceCard key={item.num} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PackageCard() {
  return (
    <div className="relative flex flex-col overflow-hidden rounded-[24px] bg-[linear-gradient(160deg,#6A5AE0,#4B3BC9)] p-7 text-white shadow-[0_30px_64px_rgba(106,90,224,.30)] md:p-9">
      <div className="pointer-events-none absolute right-[-70px] top-[-90px] h-64 w-64 rounded-full bg-white/10" />
      <div className="relative flex flex-1 flex-col">
        <div className="inline-flex self-start rounded-full bg-white/15 px-4 py-2 text-[13px] font-extrabold">
          od 99 € / mesec
        </div>
        <h3 className="mt-7 text-[34px] font-extrabold leading-[1.08] tracking-[-.03em] md:text-[40px]">
          Spletna stran + sistem v enem paketu
        </h3>
        <p className="mt-4 text-[16px] leading-[1.55] text-white/80">
          Primerno za obrtnike in lokalna podjetja, ki želijo profesionalen nastop, hitrejši odziv in manj dela z
          administracijo.
        </p>
        <div className="mt-7 flex flex-col gap-3.5">
          {packageHighlights.map((item) => (
            <div key={item} className="flex items-center gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[7px] bg-white/20">
                <Check size={13} strokeWidth={3} />
              </span>
              <span className="text-[15px] font-semibold">{item}</span>
            </div>
          ))}
        </div>
        <div className="flex-1" />
        <Button asChild variant="inverse" size="lg" className="mt-8 w-full text-[#4B3BC9]">
          <Link href="/kontakt">
            Rezerviraj brezplačen posvet <ArrowRight size={17} />
          </Link>
        </Button>
      </div>
    </div>
  );
}

function ServiceCard({ item }: { item: (typeof monthlyIncludedCards)[number] }) {
  return (
    <article className="flex flex-col rounded-[22px] border border-[#ECEAF3] bg-[#FBFAFF] p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#CFC9F8] hover:bg-white hover:shadow-[0_24px_56px_rgba(106,90,224,.12)]">
      <div className="flex items-center justify-between gap-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-[11px] bg-[#EFEBFF] text-[#6A5AE0]">
          <item.icon size={18} strokeWidth={2.3} />
        </span>
        <span className="font-mono text-[13px] font-bold text-[#9A97A5]">{item.num}</span>
      </div>
      <h3 className="mt-5 text-[19px] font-extrabold leading-[1.2] tracking-[-.015em] text-[#16151D]">
        {item.title}
      </h3>
      <p className="mt-2.5 text-[14px] leading-[1.55] text-[#6A6775]">{item.desc}</p>
      <div className="mt-5 flex flex-col gap-2.5 border-t border-[#EEECF5] pt-5">
        {item.features.map((feature) => (
          <div key={feature} className="flex items-center gap-2.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] bg-[#6A5AE0] text-white">
              <Check size={11} strokeWidth={3.2} />
            </span>
            <span className="text-[14px] font-semibold text-[#28262F]">{feature}</span>
          </div>
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
