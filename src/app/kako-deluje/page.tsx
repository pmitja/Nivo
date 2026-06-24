import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { FaqAccordion } from "@/components/faq-accordion";
import { CtaBand, Eyebrow, PageShell, SectionHeading } from "@/components/site-shell";
import { BrowserMockup, PhonePair } from "@/components/feature-sections";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { flow, processFaqs, processSteps, setup } from "@/lib/site-data";

export default function HowItWorksPage() {
  return (
    <PageShell active="kako">
      <section className="relative bg-[linear-gradient(180deg,#FBFAFF,#fff_75%)] px-5 py-[72px] pb-[60px] text-center md:px-8">
        <div className="pointer-events-none absolute right-[-60px] top-[-120px] h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,#EFEBFF_0%,rgba(255,255,255,0)_70%)]" />
        <div className="relative mx-auto max-w-[780px]">
          <Eyebrow>Kako deluje</Eyebrow>
          <h1 className="mt-4 text-balance text-[40px] font-extrabold leading-[1.07] tracking-[-.035em] md:text-[52px]">
            Od pogovora do prvih povpraševanj v 10 dneh
          </h1>
          <p className="mx-auto mt-5 max-w-[600px] text-[18.5px] leading-[1.55] text-[#54515E]">
            Postavimo sistem, ki stranke obvesti, vas opozori in poskrbi, da nobeno povpraševanje ne ostane pozabljeno.
          </p>
        </div>
      </section>

      <section className="bg-white px-5 py-10 pb-[88px] md:px-8">
        <div className="mx-auto grid max-w-[1100px] gap-5 lg:grid-cols-3">
          {processSteps.map((step) => (
            <Card key={step.num}>
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#6A5AE0] text-[21px] font-extrabold text-white shadow-[0_8px_18px_rgba(106,90,224,.30)]">{step.num}</div>
                  <span className="rounded-full bg-[#EFEBFF] px-3 py-1.5 font-mono text-xs font-medium text-[#6A5AE0]">{step.time}</span>
                </div>
                <h3 className="mt-[22px] text-xl font-bold tracking-[-.01em]">{step.title}</h3>
                <p className="mt-2.5 text-[14.5px] leading-[1.6] text-[#6A6775]">{step.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-[linear-gradient(180deg,#FBFAFF,#F6F4FC)] px-5 py-[88px] md:px-8">
        <div className="mx-auto max-w-[1100px]">
          <SectionHeading eyebrow="SMS sistem" title="Pot vsakega povpraševanja" text="Od oddanega obrazca do prevzetega posla — samodejno, v nekaj sekundah." />
          <div className="mt-[46px] grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
            {flow.map((item) => (
              <Card key={item.step}>
                <CardContent className="p-[22px]">
                  <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[11px] bg-[#EFEBFF] text-[17px] text-[#6A5AE0]">{item.icon}</div>
                  <div className="mt-3.5 font-mono text-[11px] text-[#9A97A5]">{item.step}</div>
                  <h3 className="mt-1 text-base font-bold tracking-[-.01em]">{item.title}</h3>
                  <p className="mt-[7px] text-[13.5px] leading-[1.5] text-[#6A6775]">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-6">
            <PhonePair contractorLabel="Izvajalec prejme" customerLabel="Stranka prejme" />
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-[88px] md:px-8">
        <div className="mx-auto grid max-w-[1000px] items-center gap-14 lg:grid-cols-[.85fr_1.15fr]">
          <div>
            <Eyebrow>Postavitev</Eyebrow>
            <h2 className="mt-3.5 text-[34px] font-extrabold leading-[1.12] tracking-[-.03em] md:text-[38px]">Kaj postavimo namesto vas</h2>
            <p className="mt-4 text-[16.5px] leading-[1.6] text-[#54515E]">V 7–10 dneh sestavimo celoten sistem. Vi nam date nekaj osnovnih podatkov — za vse ostalo poskrbimo mi.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {setup.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-[13px] border border-[#ECEAF3] bg-[#FBFAFF] p-4">
                <span className="mt-px flex h-6 w-6 shrink-0 items-center justify-center rounded-[7px] bg-[#6A5AE0] text-xs text-white">✓</span>
                <span className="text-[14.5px] font-semibold leading-[1.4] text-[#28262F]">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-[96px] md:px-8">
        <div className="mx-auto max-w-[760px]">
          <div className="text-center">
            <Eyebrow>Pogosta vprašanja</Eyebrow>
            <h2 className="mx-auto mt-4 max-w-[640px] text-balance text-[40px] font-extrabold leading-[1.04] tracking-[-.035em] md:text-[56px]">
              Vprašanja, ki jih imajo obrtniki pred začetkom
            </h2>
          </div>
          <FaqAccordion items={processFaqs} />
        </div>
      </section>

      <section className="bg-[#FBFAFF] px-5 py-[88px] md:px-8">
        <div className="mx-auto grid max-w-[1080px] items-center gap-12 lg:grid-cols-[1.15fr_.85fr]">
          <BrowserMockup label="[ predogled: sistem za povpraševanja ]" />
          <div>
            <Eyebrow>Predogled</Eyebrow>
            <h2 className="mt-3 text-[34px] font-extrabold leading-[1.15] tracking-[-.03em]">Sistem je pripravljen, preden ga potrebujete</h2>
            <p className="mt-3.5 text-base leading-[1.6] text-[#54515E]">Obrazci, SMS-i, kampanje in osnovna analitika so povezani v en jasen potek.</p>
            <Button asChild className="mt-6">
              <Link href="/kontakt">
                Rezerviraj brezplačen posvet <ArrowRight size={17} />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <CtaBand title="Začnimo z 20-minutnim pogovorom" text="Brez obveznosti. Povejte nam, kje izgubljate stranke — predlagamo rešitev." />
    </PageShell>
  );
}
