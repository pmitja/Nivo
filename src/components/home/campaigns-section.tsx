import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/site-shell";
import { CheckList } from "@/components/feature-sections";
import { campaigns, reviewBullets } from "@/lib/site-data";

export function CampaignsSection() {
  return (
    <section className="bg-white px-5 py-24 md:px-8">
      <div className="mx-auto grid max-w-[1100px] items-center gap-12 lg:grid-cols-2">
        <div>
          <Eyebrow>Marketing brez agencije</Eyebrow>
          <h2 className="mt-3 text-[32px] font-extrabold leading-[1.14] tracking-[-.03em] md:text-[38px]">
            En klik do novih povpraševanj iz obstoječih strank
          </h2>
          <p className="mt-4 text-[16.5px] leading-[1.6] text-[#54515E]">
            Vaše prejšnje stranke so lahko vaš najboljši vir novega dela. Pošljite jim akcijo, opomnik ali prošnjo za
            priporočilo — brez kompliciranja in brez dodatnih orodij.
          </p>
          <Button asChild variant="link" className="mt-5">
            <Link href="/kontakt">
              Pokaži mi primer kampanje <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
        <div className="rounded-[20px] border border-[#ECEAF3] bg-[linear-gradient(135deg,#F7F5FD,#FBFAFF)] p-6">
          <div className="mb-3.5 text-xs font-bold uppercase tracking-[.04em] text-[#9A97A5]">
            Pripravljene kampanje
          </div>
          <div className="flex flex-col gap-2.5">
            {campaigns.map((campaign) => (
              <div
                key={campaign}
                className="flex items-center gap-3 rounded-xl border border-[#ECEAF3] bg-white px-[15px] py-[13px]"
              >
                <span className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[9px] bg-[#EFEBFF] text-[#6A5AE0]">
                  <Zap size={15} strokeWidth={2.4} />
                </span>
                <span className="text-sm font-semibold text-[#28262F]">{campaign}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ReviewsSection() {
  return (
    <section className="bg-[#16151D] px-5 py-24 text-white md:px-8">
      <div className="mx-auto grid max-w-[1100px] items-center gap-14 lg:grid-cols-2">
        <div className="lg:order-2">
          <Eyebrow className="text-[#8C7BF0]">Več zaupanja</Eyebrow>
          <h2 className="mt-3 text-[32px] font-extrabold leading-[1.14] tracking-[-.03em] md:text-[38px]">
            Več dobrih Google ocen brez prosjačenja strank
          </h2>
          <p className="mt-4 text-[16.5px] leading-[1.6] text-[#B6B3C2]">
            Ko je delo končano, lahko stranki pošljete prijazen link za oddajo mnenja. Zadovoljne stranke lažje pustijo
            oceno; če stranka ni zadovoljna, vam najprej pošlje povratno informacijo, da težavo rešite profesionalno.
          </p>
          <CheckList items={reviewBullets} dark />
        </div>
        <div className="rounded-[18px] border border-white/10 bg-white/[.05] p-6">
          <div className="flex items-center gap-3">
            <div className="h-[46px] w-[46px] rounded-full bg-[repeating-linear-gradient(135deg,#3A3850,#3A3850_5px,#44425C_5px,#44425C_10px)]" />
            <div>
              <div className="text-sm font-bold">Andreja P.</div>
              <div className="text-[13px] text-[#F5A623]">★★★★★</div>
            </div>
          </div>
          <p className="mt-4 text-[15px] leading-[1.6] text-[#CFCDD9]">
            »Hitro so se odzvali, prišli na dogovorjen termin in delo opravili profesionalno.«
          </p>
        </div>
      </div>
    </section>
  );
}
