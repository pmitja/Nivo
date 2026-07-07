import Link from "next/link";
import { ArrowRight, Mail, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PlayButtonLink } from "@/components/feature-sections";
import { PromoVideoPlayer } from "@/components/promo-video-player";
import { trades } from "@/lib/site-data";

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[linear-gradient(180deg,#F3F0FF_0%,#FAF9FE_52%,#fff_100%)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[720px] bg-[linear-gradient(90deg,rgba(106,90,224,.07)_1px,transparent_1px),linear-gradient(180deg,rgba(106,90,224,.05)_1px,transparent_1px)] bg-[size:96px_96px] [mask-image:linear-gradient(180deg,black,transparent_82%)]" />
      <div className="pointer-events-none absolute left-1/2 top-[-260px] -z-10 h-[560px] w-[880px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(106,90,224,.16),rgba(106,90,224,0))]" />

      <div className="relative mx-auto max-w-[1240px] px-5 md:px-8">
        <div className="nv-enter mx-auto max-w-[820px] pt-[52px] text-center md:pt-[64px]">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E4E0F4] bg-white px-[13px] py-1.5 text-[13px] font-semibold text-[#56535F] shadow-[0_2px_8px_rgba(20,19,29,.05)]">
            <span className="nv-pulse h-[7px] w-[7px] rounded-full bg-[#22B07D]" />
            Sistem za obrtnike in lokalna podjetja
          </div>
          <h1 className="mt-[22px] text-[46px] font-extrabold leading-[1.06] tracking-[-.035em] text-balance md:text-[62px]">
            Več{" "}
            <span className="rounded-[14px] bg-[#E7E1FE] px-2.5 text-[#5A48D6] [-webkit-box-decoration-break:clone] [box-decoration-break:clone]">povpraševanj</span>.
            <br />
            Manj izgubljenih strank.
          </h1>
          <p className="mx-auto mt-6 max-w-[560px] text-[18px] leading-[1.58] text-[#54515E]">
            Postavimo vam spletno stran in sistem, ki poskrbi, da vsako novo povpraševanje prejmete takoj — tudi ko ste
            na terenu. SMS obvestila za vas, e-poštna potrdila za stranke, Google ocene in kampanje na enem mestu.
          </p>
          <p className="mt-4 text-[16.5px] font-semibold">
            Že od <span className="text-[#6A5AE0]">99 € / mesec.</span>
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <Button asChild size="lg">
              <Link href="/kontakt">
                Rezerviraj brezplačen posvet <ArrowRight size={17} />
              </Link>
            </Button>
            <PlayButtonLink />
          </div>
          <div className="mt-5 text-[12.5px] text-[#9A97A5]">
            Brez vezave · Brez tehničnega znanja · Pripravljeno za uporabo
          </div>
        </div>

        <div className="relative mx-auto mt-12 max-w-[960px] md:mt-14">
          <div className="nv-float pointer-events-none absolute left-[-104px] top-[52px] z-10 hidden w-[236px] select-none xl:block">
            <div className="rounded-[16px] border border-[#F0EEF6] bg-white px-4 py-3 shadow-[0_20px_48px_rgba(20,19,29,.16)]">
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

          <div className="nv-float pointer-events-none absolute bottom-[86px] left-[-88px] z-10 hidden w-[224px] select-none xl:block [animation-delay:1.2s]">
            <div className="rounded-[16px] bg-[#6A5AE0] px-4 py-3 text-white shadow-[0_20px_48px_rgba(106,90,224,.34)]">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.04em] opacity-85">
                <Mail size={12} strokeWidth={2.6} /> E-poštno potrdilo
              </div>
              <div className="mt-1.5 text-[12.5px] leading-[1.45]">
                Hvala za povpraševanje. Odgovorimo vam takoj, ko bo mogoče.
              </div>
            </div>
          </div>

          <div className="nv-float pointer-events-none absolute right-[-84px] top-[110px] z-10 hidden w-[186px] select-none xl:block [animation-delay:.6s]">
            <div className="rounded-[16px] border border-[#F0EEF6] bg-white px-4 py-3.5 shadow-[0_20px_48px_rgba(20,19,29,.16)]">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8C8898]">
                <Star size={12} className="text-[#F5A623]" fill="currentColor" /> Google ocena
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-[28px] font-extrabold tracking-[-.02em]">4,9</span>
                <span className="text-sm text-[#F5A623]">★★★★★</span>
              </div>
              <div className="mt-px text-xs text-[#7A7785]">Več zaupanja. Več klicev.</div>
            </div>
          </div>

          <div className="overflow-hidden rounded-[20px] border border-[#E4E2EC] bg-white shadow-[0_40px_90px_rgba(38,28,92,.18)]">
            <div className="flex items-center gap-[7px] border-b border-[#ECEAF3] bg-[#F6F5FA] px-4 py-3">
              <span className="h-[11px] w-[11px] rounded-full bg-[#E5867E]" />
              <span className="h-[11px] w-[11px] rounded-full bg-[#E8C16B]" />
              <span className="h-[11px] w-[11px] rounded-full bg-[#7FC08C]" />
              <div className="ml-2.5 flex-1 rounded-[7px] border border-[#E4E2EC] bg-white px-3 py-1.5 font-mono text-xs text-[#8C8898]">
                obrtio.si — sistem za povpraševanja
              </div>
            </div>
            <div className="relative aspect-video bg-[#EDE8F8]">
              <PromoVideoPlayer />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-5 pb-[60px] pt-12 md:px-8">
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
