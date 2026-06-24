import Link from "next/link";

import { Button } from "@/components/ui/button";
import { aiFeatures } from "@/lib/site-data";

export function AiAddonSection() {
  return (
    <section className="bg-[linear-gradient(180deg,#fff,#F6F4FC)] px-5 pb-[88px] pt-10 md:px-8">
      <div className="relative mx-auto max-w-[1100px] overflow-hidden rounded-[26px] bg-[#16151D] p-6 text-white md:p-[52px]">
        <div className="pointer-events-none absolute right-[-40px] top-[-80px] h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(140,123,240,.30),rgba(22,21,29,0)_70%)]" />
        <div className="relative grid items-center gap-12 lg:grid-cols-[.95fr_1.05fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#8C7BF0]/25 bg-[#8C7BF0]/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[.06em] text-[#8C7BF0]">
              ✦ AI pomočnik · doplačilo
            </div>
            <h2 className="mt-[18px] text-[34px] font-extrabold leading-[1.12] tracking-[-.03em] md:text-[38px]">
              Manj administracije.
              <br />
              Hitrejše ponudbe.
            </h2>
            <p className="mt-4 text-[16.5px] leading-[1.6] text-[#B6B3C2]">
              AI prebere sporočila strank, izlušči ključne podatke in pripravi osnutek ponudbe — vi samo potrdite.
            </p>
            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-[44px] font-extrabold tracking-[-.03em]">20 €</span>
              <span className="text-base font-medium text-[#9D9AAB]">/ mesec · doplačilo</span>
            </div>
            <Button asChild className="mt-6">
              <Link href="/kontakt">Dodaj AI pomočnika</Link>
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {aiFeatures.map((item) => (
              <div key={item} className="flex items-start gap-2.5 rounded-[13px] border border-white/10 bg-white/[.05] p-4">
                <span className="mt-px flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[7px] bg-[#8C7BF0]/20 text-xs text-[#A99BF5]">
                  ✓
                </span>
                <span className="text-sm font-medium leading-[1.4] text-[#E7E6EC]">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
