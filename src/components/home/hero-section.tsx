import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PlayButtonLink } from "@/components/feature-sections";
import { trades } from "@/lib/site-data";

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[#FBFAFF]">
      <Image
        src="/home/nivo-hero.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(255,255,255,.94)_0%,rgba(255,255,255,.86)_42%,rgba(245,243,255,.92)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-[linear-gradient(180deg,rgba(255,255,255,0),#F5F3FF)]" />

      <div className="relative mx-auto max-w-[1240px] px-5 md:px-8">
        <div className="nv-float pointer-events-none absolute left-0 top-[130px] hidden w-[230px] select-none xl:block">
          <div className="rounded-[14px] border border-[#F0EEF6] bg-white px-4 py-3 shadow-[0_16px_40px_rgba(20,19,29,.16)]">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-[#EFEBFF] text-[#6A5AE0]">
                <Mail size={15} strokeWidth={2.4} />
              </div>
              <div>
                <div className="text-[13px] font-bold">Novo povpraševanje</div>
                <div className="text-[11.5px] text-[#8C8898]">pred 8 sekundami</div>
              </div>
            </div>
            <div className="mt-2.5 rounded-[9px] bg-[#F8F7FB] px-2.5 py-2 text-[12.5px] leading-[1.4] text-[#54515E]">
              Marko išče izvajalca za fasado. SMS poslan takoj.
            </div>
          </div>
        </div>

        <div className="nv-float pointer-events-none absolute left-0 top-[310px] hidden w-[228px] select-none xl:block">
          <div className="rounded-[14px] bg-[#6A5AE0] px-4 py-3 text-white shadow-[0_16px_40px_rgba(106,90,224,.30)]">
            <div className="text-[11px] font-bold uppercase tracking-[.04em] opacity-80">Samodejni odgovor</div>
            <div className="mt-1.5 text-[12.5px] leading-[1.45]">
              Hvala za povpraševanje. Odgovorimo vam takoj, ko bo mogoče.
            </div>
          </div>
        </div>

        <div className="nv-float pointer-events-none absolute right-0 top-[200px] hidden w-[184px] select-none xl:block">
          <div className="rounded-[14px] border border-[#F0EEF6] bg-white px-4 py-3.5 shadow-[0_16px_40px_rgba(20,19,29,.16)]">
            <div className="text-xs font-semibold text-[#8C8898]">Google ocena</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-[28px] font-extrabold tracking-[-.02em]">4,9</span>
              <span className="text-sm text-[#F5A623]">★★★★★</span>
            </div>
            <div className="mt-px text-xs text-[#7A7785]">Več zaupanja. Več klicev.</div>
          </div>
        </div>

        <div className="mx-auto max-w-[760px] py-[56px] text-center lg:py-[68px]">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E8E6F0] bg-white px-[13px] py-1.5 text-[13px] font-semibold text-[#56535F] shadow-[0_2px_8px_rgba(20,19,29,.04)]">
            <span className="nv-pulse h-[7px] w-[7px] rounded-full bg-[#22B07D]" />
            Sistem za obrtnike in lokalna podjetja
          </div>
          <h1 className="mt-[22px] text-[50px] font-extrabold leading-[1.04] tracking-[-.035em] text-balance md:text-[64px] lg:text-[66px]">
            Več povpraševanj.
            <br />
            Manj izgubljenih strank.
          </h1>
          <p className="mx-auto mt-6 max-w-[520px] text-[18px] leading-[1.58] text-[#54515E]">
            Postavimo vam spletno stran in sistem, ki poskrbi, da vsako novo povpraševanje prejmete takoj — tudi ko ste na terenu.
          </p>
          <p className="mx-auto mt-3 max-w-[460px] text-[14.5px] leading-[1.55] text-[#7A7785]">
            SMS obvestila, samodejni odgovori, Google ocene in kampanje. Vse na enem mestu.
          </p>
          <p className="mt-4 text-[16.5px] font-semibold">
            Že od <span className="text-[#6A5AE0]">99 € / mesec.</span>
          </p>
          <div className="relative mt-9">
            <div className="relative flex flex-wrap items-center justify-center gap-3.5">
              <Button asChild size="lg">
                <Link href="/kontakt">
                  Rezerviraj brezplačen posvet <ArrowRight size={17} />
                </Link>
              </Button>
              <PlayButtonLink />
            </div>
          </div>
          <div className="mt-5 text-[12.5px] text-[#9A97A5]">
            Brez vezave · Brez tehničnega znanja · Pripravljeno za uporabo
          </div>
          <div className="mt-3.5 flex items-center justify-center gap-[11px]">
            <span className="text-[14px] text-[#F5A623]">★★★★★</span>
            <span className="text-[13px] text-[#7A7785]">Za obrtnike, izvajalce in lokalna podjetja</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-5 pb-[64px] md:px-8">
        <div className="mx-auto max-w-[560px] text-center text-[12.5px] font-semibold uppercase tracking-[.05em] text-[#9A97A5]">
          Zasnovano za podjetja, kjer šteje vsak klic in vsako povpraševanje
        </div>
        <div className="mt-5 flex flex-wrap justify-center gap-2.5">
          {trades.map((trade) => (
            <span
              key={trade}
              className="rounded-full border border-[#EAE8F1] bg-white px-4 py-2 text-sm font-semibold text-[#54515E] shadow-[0_1px_3px_rgba(20,19,29,.04)]"
            >
              {trade}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
