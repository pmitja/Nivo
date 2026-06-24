import Link from "next/link";

import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/site-shell";
import { addonsLanding, planFeaturesLanding } from "@/lib/site-data";

export function PricingSection() {
  return (
    <section id="cenik" className="bg-white px-5 py-24 md:px-8">
      <div className="mx-auto max-w-[1100px]">
        <SectionHeading
          eyebrow="Cena"
          title="Ena cena. Cel sistem."
          text="Brez visokega začetnega stroška. Vse, kar potrebujete za profesionalen nastop in boljši odziv na povpraševanja."
        />
        <div className="mt-12 grid items-start gap-6 lg:grid-cols-[1.25fr_1fr]">
          <MainPlanCard />
          <div className="flex flex-col gap-3.5">
            <div className="mb-0.5 text-[13px] font-bold uppercase tracking-[.06em] text-[#9A97A5]">
              Dodatne možnosti
            </div>
            {addonsLanding.map((addon) => (
              <div
                key={addon.title}
                className="flex items-center justify-between gap-4 rounded-2xl border border-[#ECEAF3] bg-white px-[22px] py-5 transition-colors hover:border-[#6A5AE0]"
              >
                <div>
                  <div className="text-base font-bold">{addon.title}</div>
                  <div className="mt-1 text-[13px] leading-[1.4] text-[#6A6775]">{addon.desc}</div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-[17px] font-extrabold tracking-[-.01em] text-[#6A5AE0]">{addon.price}</div>
                  <div className="text-xs text-[#9A97A5]">{addon.unit}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function MainPlanCard() {
  return (
    <div className="relative overflow-hidden rounded-[24px] bg-[linear-gradient(160deg,#6A5AE0,#4B3BC9)] p-8 text-white shadow-[0_30px_64px_rgba(106,90,224,.34)] md:p-10">
      <div className="absolute right-[-40px] top-[-60px] h-60 w-60 rounded-full bg-white/10" />
      <div className="relative">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-lg font-bold">Sistem za rast podjetja</div>
          <span className="rounded-full bg-white/20 px-3 py-1.5 text-xs font-bold">Najbolj priljubljeno</span>
        </div>
        <div className="mt-[22px] flex items-baseline gap-2">
          <span className="text-[58px] font-extrabold tracking-[-.03em]">99 €</span>
          <span className="text-[17px] font-medium opacity-85">/ mesec</span>
        </div>
        <p className="mt-1.5 text-[14.5px] text-white/80">
          Vključuje spletno stran, sistem za povpraševanja, SMS obvestila, osnovni CRM in urejanje vsebine.
        </p>
        <div className="mt-6 grid gap-x-4 gap-y-3 sm:grid-cols-2">
          {planFeaturesLanding.map((feature) => (
            <div key={feature} className="flex items-center gap-2 text-sm font-medium">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-white/20 text-[11px]">
                ✓
              </span>
              {feature}
            </div>
          ))}
        </div>
        <Button asChild variant="inverse" className="mt-[30px] w-full text-[#4B3BC9]">
          <Link href="/kontakt">Začni danes →</Link>
        </Button>
        <div className="mt-3 text-center text-[12.5px] text-white/70">
          Brez vezave. Najprej se pogovorimo, ali je sistem primeren za vas.
        </div>
      </div>
    </div>
  );
}
