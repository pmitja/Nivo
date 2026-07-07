import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

import { CtaBand, Eyebrow, SectionHeading } from "@/components/site-shell";
import { FeatureGrid, PhonePair } from "@/components/feature-sections";
import { HeroVisual } from "@/components/hero-visual";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createMetadata } from "@/lib/seo";
import { english } from "@/lib/site-data";

export const metadata = createMetadata({
  title: "Websites and lead management for contractors",
  description:
    "Obrtio builds your website and helps you manage leads, SMS alerts, customer reviews and campaigns in one simple system.",
  path: "/en",
  locale: "en_US",
  keywords: ["contractor website", "lead management for contractors", "home service marketing"],
});

export default function EnglishLandingPage() {
  return (
    <div lang="en" className="marketing-page w-full overflow-x-clip bg-white">
      <header className="sticky top-0 z-50 border-b border-[#ECEAF3] bg-white/80 backdrop-blur-[10px] backdrop-saturate-150">
        <nav className="mx-auto flex max-w-[1200px] items-center justify-between gap-6 px-5 py-4 md:px-8">
          <Link href="/en" className="flex items-center gap-2.5 text-[#16151D] no-underline">
            <span className="flex h-[30px] w-[30px] items-center justify-center rounded-[9px] bg-[#6A5AE0] shadow-[0_4px_12px_rgba(106,90,224,.35)]">
              <span className="h-[13px] w-[13px] rotate-45 rounded-[3px] border-[2.5px] border-white" />
            </span>
            <span className="text-xl font-extrabold tracking-[-.02em]">Obrtio</span>
          </Link>
          <div className="hidden items-center gap-[30px] md:flex">
            {["Services", "How it works", "Pricing", "Contact"].map((item) => (
              <a key={item} href={`#${item.toLowerCase().split(" ")[0]}`} className="text-[14.5px] font-medium text-[#56535F] no-underline hover:text-[#16151D]">
                {item}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3.5">
            <a href="#contact" className="hidden text-[14.5px] font-semibold text-[#16151D] no-underline sm:inline">
              Log in
            </a>
            <Button asChild size="sm">
              <a href="#contact">Book a free call</a>
            </Button>
          </div>
        </nav>
      </header>

      <section className="relative bg-[linear-gradient(180deg,#FBFAFF_0%,#fff_70%)]">
        <div className="pointer-events-none absolute right-[-80px] top-[-120px] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,#EFEBFF_0%,rgba(255,255,255,0)_70%)]" />
        <div className="relative mx-auto grid max-w-[1200px] items-center gap-12 px-5 py-16 pb-20 md:px-8 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E8E6F0] bg-white px-[13px] py-1.5 text-[13px] font-semibold text-[#56535F] shadow-[0_2px_8px_rgba(20,19,29,.04)]">
              <span className="nv-pulse h-[7px] w-[7px] rounded-full bg-[#22B07D]" />
              The growth system for home-service pros
            </div>
            <h1 className="mt-[22px] text-[44px] font-extrabold leading-[1.04] tracking-[-.035em] md:text-[60px]">
              More jobs.
              <br />
              Less hassle.
            </h1>
            <p className="mt-[22px] max-w-[490px] text-[18.5px] leading-[1.55] text-[#54515E]">We build your website, automate every lead, collect reviews, and help you win more work.</p>
            <p className="mt-2.5 max-w-[490px] text-[18.5px] font-semibold leading-[1.55]">All for just <span className="text-[#6A5AE0]">$150 a month.</span></p>
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <Button asChild>
                <a href="#contact">
                  Book a free call <ArrowRight size={17} />
                </a>
              </Button>
              <Button asChild variant="secondary">
                <a href="#how">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EFEBFF] text-[#6A5AE0]">
                    <Play size={10} fill="currentColor" />
                  </span>
                  See how it works
                </a>
              </Button>
            </div>
            <div className="mt-[30px] flex items-center gap-3.5">
              <div>
                <div className="text-sm font-bold">★★★★★ <span className="font-medium text-[#54515E]">4.9 / 5</span></div>
                <div className="text-[13px] text-[#7A7785]">Trusted by contractors across the U.S.</div>
              </div>
            </div>
          </div>
          <HeroVisual label="[ photo: contractor on the job ]" />
        </div>
        <div className="mx-auto max-w-[1200px] px-5 pb-14 md:px-8">
          <div className="text-center text-[13px] font-semibold uppercase tracking-[.06em] text-[#9A97A5]">Built for the trades that keep America running</div>
          <div className="mt-[18px] flex flex-wrap justify-center gap-2.5">
            {english.trades.map((trade) => (
              <span key={trade} className="rounded-full border border-[#EAE8F1] bg-white px-4 py-2 text-sm font-semibold text-[#54515E] shadow-[0_1px_3px_rgba(20,19,29,.04)]">
                {trade}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#16151D] px-5 py-[90px] text-white md:px-8">
        <div className="mx-auto max-w-[920px] text-center">
          <Eyebrow className="text-[#8C7BF0]">The problem</Eyebrow>
          <h2 className="mt-4 text-balance text-[38px] font-extrabold leading-[1.1] tracking-[-.03em] md:text-[46px]">How many jobs do you lose before you even call back?</h2>
          <p className="mx-auto mt-6 max-w-[660px] text-[19px] leading-[1.6] text-[#B6B3C2]">Most contractors lose work to slow replies, missed calls, or an outdated website.</p>
          <p className="mt-[22px] text-[21px] font-semibold leading-[1.5]">
            {"Not because they aren't good."}
            <br />
            <span className="text-[#8C7BF0]">{"It's because they don't have a system."}</span>
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {["Missed calls", "Slow replies", "Too few reviews", "Outdated website", "Word-of-mouth only"].map((item) => (
              <span key={item} className="rounded-xl border border-white/10 bg-white/[.06] px-[18px] py-[11px] text-sm font-medium text-[#CFCDD9]">{item}</span>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="bg-white px-5 py-24 md:px-8">
        <div className="mx-auto max-w-[1200px]">
          <SectionHeading eyebrow="The solution" title="Everything you need to win more work" text="One system that works for you — from your first website to your latest 5-star review." />
          <FeatureGrid items={english.solutions} columns="four" />
        </div>
      </section>

      <section className="bg-[linear-gradient(180deg,#FBFAFF,#F6F4FC)] px-5 py-24 md:px-8">
        <div className="mx-auto grid max-w-[1100px] items-center gap-14 lg:grid-cols-[.92fr_1.08fr]">
          <div>
            <Eyebrow>SMS system</Eyebrow>
            <h2 className="mt-3.5 text-[36px] font-extrabold leading-[1.12] tracking-[-.03em] md:text-[42px]">No lead slips through the cracks</h2>
            <p className="mt-[18px] text-[17px] leading-[1.6] text-[#54515E]">
              {"The moment a customer submits your form, you get an SMS alert and they receive an email confirmation. You're on the job site; the system keeps everyone informed."}
            </p>
          </div>
          <PhonePair contractorLabel="You get an SMS" customerLabel="Customer gets an email" />
        </div>
      </section>

      <section id="how" className="bg-white px-5 py-24 md:px-8">
        <div className="mx-auto max-w-[1100px]">
          <SectionHeading eyebrow="How it works" title="From free call to live system" text="We set it up for you, then keep it running." />
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {english.steps.map((step) => (
              <Card key={step.num}>
                <CardContent className="p-8">
                  <div className="flex items-center justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#6A5AE0] text-[21px] font-extrabold text-white shadow-[0_8px_18px_rgba(106,90,224,.30)]">{step.num}</span>
                    <span className="rounded-full bg-[#EFEBFF] px-3 py-1.5 font-mono text-xs font-medium text-[#6A5AE0]">{step.time}</span>
                  </div>
                  <h3 className="mt-[22px] text-xl font-bold tracking-[-.01em]">{step.title}</h3>
                  <p className="mt-2.5 text-[14.5px] leading-[1.6] text-[#6A6775]">{step.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="bg-[#F6F4FC] px-5 py-[88px] md:px-8">
        <div className="mx-auto max-w-[1100px]">
          <SectionHeading eyebrow="Pricing" title="Simple monthly pricing" text="Your growth system, website, SMS, reviews, campaigns, and support." />
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {english.addons.map((addon) => (
              <Card key={addon.title}>
                <CardContent className="p-6">
                  <h3 className="text-[16.5px] font-bold tracking-[-.01em]">{addon.title}</h3>
                  <p className="mt-1.5 text-[13.5px] leading-[1.45] text-[#6A6775]">{addon.desc}</p>
                  <div className="mt-[18px] flex items-baseline gap-1.5">
                    <span className="text-2xl font-extrabold tracking-[-.02em] text-[#6A5AE0]">{addon.price}</span>
                    <span className="text-[12.5px] font-medium text-[#9A97A5]">{addon.unit}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="contact">
        <CtaBand title="Ready to win more jobs?" text="Book a free call and we'll show you how Obrtio would work for your trade, city, and customers." />
      </section>
    </div>
  );
}
