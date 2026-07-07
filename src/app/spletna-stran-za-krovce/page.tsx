import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CtaBand, Eyebrow, PageShell } from "@/components/site-shell";
import { BrowserMockup, FeatureGrid } from "@/components/feature-sections";
import { HeroVisual } from "@/components/hero-visual";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createMetadata } from "@/lib/seo";
import { roofers } from "@/lib/site-data";

export const metadata = createMetadata({
  title: "Spletna stran za krovce od 99 € na mesec",
  description:
    "Profesionalna spletna stran za krovce z obrazcem za povpraševanja, SMS obvestili, Google ocenami in popolnim vzdrževanjem.",
  path: "/spletna-stran-za-krovce",
  keywords: [
    "spletna stran za krovce",
    "marketing za krovce",
    "povpraševanja za krovce",
    "izdelava spletne strani za krovsko podjetje",
  ],
});

export default function RoofersPage() {
  return (
    <PageShell>
      <section className="relative isolate overflow-hidden bg-[linear-gradient(180deg,#F3F0FF_0%,#FAF9FE_58%,#fff_100%)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full bg-[linear-gradient(90deg,rgba(106,90,224,.07)_1px,transparent_1px),linear-gradient(180deg,rgba(106,90,224,.05)_1px,transparent_1px)] bg-[size:96px_96px] [mask-image:linear-gradient(180deg,black,transparent_82%)]" />
        <div className="pointer-events-none absolute right-[-80px] top-[-120px] -z-10 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(106,90,224,.14)_0%,rgba(255,255,255,0)_70%)]" />
        <div className="relative mx-auto grid max-w-[1200px] items-center gap-12 px-5 py-[60px] pb-20 md:px-8 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E4E0F4] bg-white px-[13px] py-1.5 text-[13px] font-semibold text-[#56535F] shadow-[0_2px_8px_rgba(20,19,29,.05)]">
              <span className="nv-pulse h-[7px] w-[7px] rounded-full bg-[#22B07D]" />
              Za krovce in krovska podjetja
            </div>
            <h1 className="mt-[22px] text-balance text-[42px] font-extrabold leading-[1.05] tracking-[-.035em] md:text-[54px]">
              Spletna stran za krovce, ki <span className="rounded-[14px] bg-[#E7E1FE] px-2.5 text-[#5A48D6] [-webkit-box-decoration-break:clone] [box-decoration-break:clone]">polni vaš koledar</span>
            </h1>
            <p className="mt-5 max-w-[490px] text-[18.5px] leading-[1.55] text-[#54515E]">
              Profesionalna stran, SMS obvestila za vas, e-poštna potrdila za stranke in več Google ocen — da vas najdejo lastniki streh v vaši okolici.
            </p>
            <p className="mt-2.5 text-[18.5px] font-semibold leading-[1.5]">
              Vse za samo <span className="text-[#6A5AE0]">99 € na mesec.</span>
            </p>
            <div className="mt-[30px] flex flex-wrap items-center gap-3.5">
              <Button asChild>
                <Link href="/kontakt">
                  Želim brezplačen posvet <ArrowRight size={17} />
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/cenik">Poglej cenik</Link>
              </Button>
            </div>
            <div className="mt-[30px] flex items-center gap-3.5">
              <div className="text-sm font-bold">★★★★★ <span className="font-medium text-[#54515E]">4,9 / 5</span></div>
              <div className="text-[13px] text-[#7A7785]">Zaupajo nam krovci po vsej Sloveniji</div>
            </div>
          </div>
          <HeroVisual label="[ foto: krovec na strehi ]" roofers />
        </div>
      </section>

      <section className="bg-[#16151D] px-5 py-[84px] text-white md:px-8">
        <div className="mx-auto max-w-[880px] text-center">
          <Eyebrow className="text-[#8C7BF0]">Težava krovcev</Eyebrow>
          <h2 className="mt-4 text-balance text-[36px] font-extrabold leading-[1.1] tracking-[-.03em] md:text-[44px]">Medtem ko ste na strehi, zvoni telefon</h2>
          <p className="mx-auto mt-[22px] max-w-[600px] text-[18.5px] leading-[1.6] text-[#B6B3C2]">
            Ne morete dvigniti telefona na višini. Dokler pokličete nazaj, je stranka že naročila pri drugem krovcu. Posel izgubljen — ne zaradi kakovosti, ampak zaradi odziva.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            {roofers.pains.map((pain) => (
              <span key={pain} className="rounded-xl border border-white/10 bg-white/[.06] px-[18px] py-[11px] text-sm font-medium text-[#CFCDD9]">
                {pain}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-[90px] md:px-8">
        <div className="mx-auto max-w-[1140px]">
          <div className="mx-auto max-w-[620px] text-center">
            <Eyebrow>Rešitev</Eyebrow>
            <h2 className="mt-3.5 text-[36px] font-extrabold leading-[1.12] tracking-[-.03em] md:text-[42px]">Zakaj krovci izberejo Obrtio</h2>
            <p className="mt-3.5 text-[17px] leading-[1.55] text-[#54515E]">Sistem, ki ujame vsak klic in vsako povpraševanje — tudi ko ste na terenu.</p>
          </div>
          <FeatureGrid items={roofers.benefits} />
        </div>
      </section>

      <section className="bg-[#F6F4FC] px-5 py-[88px] md:px-8">
        <div className="mx-auto grid max-w-[1080px] items-center gap-12 lg:grid-cols-[1.15fr_.85fr]">
          <BrowserMockup label="[ predogled: spletna stran za krovstvo ]" />
          <div>
            <Eyebrow>Vaša nova stran</Eyebrow>
            <h2 className="mt-3 text-[34px] font-extrabold leading-[1.15] tracking-[-.03em]">Videti boste profesionalno — ker ste</h2>
            <p className="mt-3.5 text-base leading-[1.6] text-[#54515E]">Čista, hitra in mobilno optimizirana stran, ki gradi zaupanje že v prvih treh sekundah.</p>
            <div className="mt-[22px] flex flex-col gap-3">
              {roofers.siteBullets.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[7px] bg-[#6A5AE0] text-xs text-white">✓</span>
                  <span className="text-[15px] font-semibold text-[#28262F]">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-[90px] md:px-8">
        <div className="mx-auto max-w-[1140px]">
          <div className="mx-auto max-w-[560px] text-center">
            <Eyebrow>Krovci o Obrtio</Eyebrow>
            <h2 className="mt-3 text-[36px] font-extrabold leading-[1.12] tracking-[-.03em] md:text-[40px]">Več povpraševanj, manj skrbi</h2>
          </div>
          <div className="mt-11 grid gap-[18px] lg:grid-cols-3">
            {roofers.reviews.map((review) => (
              <Card key={review.name}>
                <CardContent className="p-7">
                  <div className="text-[15px] text-[#F5A623]">★★★★★</div>
                  <p className="mt-3.5 text-[15px] leading-[1.6] text-[#3D3A47]">»{review.text}«</p>
                  <div className="mt-5 flex items-center gap-3 border-t border-[#F0EEF6] pt-[18px]">
                    <div className="h-10 w-10 rounded-full bg-[repeating-linear-gradient(135deg,#E7E4F1,#E7E4F1_5px,#F1EFF8_5px,#F1EFF8_10px)]" />
                    <div>
                      <div className="text-sm font-bold">{review.name}</div>
                      <div className="text-[12.5px] text-[#8C8898]">{review.meta}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 pb-[88px] md:px-8">
        <div className="relative mx-auto grid max-w-[1080px] items-center gap-10 overflow-hidden rounded-[26px] bg-[linear-gradient(160deg,#6A5AE0,#4B3BC9)] p-8 text-white md:p-12 lg:grid-cols-[1fr_.9fr]">
          <div className="absolute right-[-40px] top-[-70px] h-[280px] w-[280px] rounded-full bg-white/10" />
          <div className="relative">
            <div className="text-[13px] font-bold uppercase tracking-[.06em] text-white/75">Cel sistem za krovce</div>
            <div className="mt-3.5 flex items-baseline gap-2.5">
              <span className="text-[60px] font-extrabold leading-none tracking-[-.03em]">99 €</span>
              <span className="text-lg opacity-85">/ mesec</span>
            </div>
            <p className="mt-3 max-w-[380px] text-base text-white/85">Spletna stran, SMS sistem, Google ocene in kampanje — vse vključeno. Brez vezave.</p>
            <Button asChild variant="inverse" className="mt-6 text-[#4B3BC9]">
              <Link href="/kontakt">Začni danes →</Link>
            </Button>
          </div>
          <div className="relative grid gap-x-4 gap-y-2.5 sm:grid-cols-2">
            {roofers.planMini.map((item) => (
              <div key={item} className="flex items-center gap-2 text-[14.5px] font-medium">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-white/20 text-[11px]">✓</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#F0EEF6] bg-[#FBFAFF] px-5 py-20 text-center md:px-8">
        <div className="mx-auto max-w-[900px]">
          <Eyebrow>Tudi za vašo panogo</Eyebrow>
          <h2 className="mt-3 text-[34px] font-extrabold leading-[1.14] tracking-[-.03em]">Ne le za krovce</h2>
          <p className="mx-auto mt-3 max-w-[520px] text-[16.5px] leading-[1.55] text-[#54515E]">Isti sistem prilagodimo vsaki obrti — z besedami in primeri, ki jih vaše stranke iščejo.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-2.5">
            {roofers.otherTrades.map((trade) => (
              <Link key={trade} href="/storitve" className="rounded-full border border-[#E8E6F0] bg-white px-[18px] py-[11px] text-[14.5px] font-semibold text-[#3D3A47] no-underline shadow-[0_1px_3px_rgba(20,19,29,.04)] transition-colors hover:border-[#6A5AE0] hover:text-[#6A5AE0]">
                {trade}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand dark title="Naj vas najde več lastnikov streh" text="Vi pokrivate strehe. Mi poskrbimo, da imate vedno polno povpraševanj." />
    </PageShell>
  );
}
