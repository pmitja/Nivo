import { FaqAccordion } from "@/components/faq-accordion";
import { CtaBand, Eyebrow, PageShell, SectionHeading } from "@/components/site-shell";
import { CheckList, PhonePair } from "@/components/feature-sections";
import { HeroSection } from "@/components/home/hero-section";
import { StatsBand } from "@/components/home/stats-band";
import { FeatureBento } from "@/components/home/feature-bento";
import { StepsSection } from "@/components/home/steps-section";
import { ProblemSection } from "@/components/home/problem-section";
import { CampaignsSection, ReviewsSection } from "@/components/home/campaigns-section";
import { CompareSection } from "@/components/home/compare-section";
import { PricingSection } from "@/components/home/pricing-section";
import { aiQuestions, cmsItems, faqsLanding, smsBullets } from "@/lib/site-data";

export default function Home() {
  return (
    <PageShell>
      <HeroSection />

      <StatsBand />

      <ProblemSection />

      <FeatureBento />

      <section className="bg-[linear-gradient(180deg,#FBFAFF,#F6F4FC)] px-5 py-24 md:px-8">
        <div className="mx-auto grid max-w-[1100px] items-center gap-14 lg:grid-cols-[.92fr_1.08fr]">
          <div>
            <Eyebrow>Takojšen odziv</Eyebrow>
            <h2 className="mt-3.5 text-[34px] font-extrabold leading-[1.12] tracking-[-.03em] md:text-[40px]">
              Novo povpraševanje prejmete takoj na telefon
            </h2>
            <p className="mt-[18px] text-[17px] leading-[1.6] text-[#54515E]">
              Večina obrtnikov ne izgublja strank zato, ker slabo dela. Izgublja jih zato, ker povpraševanje vidi prepozno.
            </p>
            <p className="mt-3 text-[17px] leading-[1.6] text-[#54515E]">
              Zato vsako novo povpraševanje sproži SMS obvestilo — hitro pokličete stranko, ji odgovorite ali si jo shranite za kasneje.
            </p>
            <CheckList items={smsBullets} />
          </div>
          <PhonePair />
        </div>
      </section>

      <CampaignsSection />

      <ReviewsSection />

      <section className="bg-white px-5 py-24 md:px-8">
        <div className="mx-auto grid max-w-[1100px] items-center gap-12 lg:grid-cols-[.9fr_1.1fr]">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <Eyebrow>AI pomočnik</Eyebrow>
              <span className="rounded-full border border-[#DCD6FF] bg-[#F4F1FF] px-3 py-1.5 text-xs font-extrabold uppercase tracking-[.06em] text-[#6A5AE0]">
                Pride kmalu
              </span>
            </div>
            <h2 className="mt-3 text-[32px] font-extrabold leading-[1.14] tracking-[-.03em] md:text-[38px]">
              Povzetki in osnutki ponudb so v pripravi
            </h2>
            <p className="mt-4 text-[16.5px] leading-[1.6] text-[#54515E]">
              AI pomočnik bo pomagal urediti povpraševanja, izluščiti ključne podatke in pripraviti osnutek ponudbe.
              Funkcija prihaja kmalu in ponudb ne bo pošiljala brez vaše potrditve.
            </p>
          </div>
          <div className="rounded-[20px] border border-[#ECEAF3] bg-[#FBFAFF] p-6">
            <div className="mb-3.5 text-xs font-bold uppercase tracking-[.04em] text-[#9A97A5]">Primer vprašanj</div>
            <div className="grid gap-3 sm:grid-cols-2">
              {aiQuestions.map((item) => (
                <div key={item} className="rounded-[13px] border border-[#ECEAF3] bg-white p-4 text-[14.5px] font-semibold text-[#28262F]">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(180deg,#FBFAFF,#F6F4FC)] px-5 py-24 md:px-8">
        <div className="mx-auto grid max-w-[1100px] items-center gap-12 lg:grid-cols-2">
          <div className="rounded-[20px] border border-[#ECEAF3] bg-white p-6 shadow-[0_20px_48px_rgba(20,19,29,.08)]">
            <div className="grid gap-3 sm:grid-cols-2">
              {cmsItems.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-[12px] border border-[#ECEAF3] bg-[#FBFAFF] px-4 py-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-[7px] bg-[#6A5AE0] text-xs text-white">✓</span>
                  <span className="text-[14.5px] font-semibold text-[#28262F]">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <Eyebrow>Popolna skrb za spletno stran</Eyebrow>
              <span className="rounded-full border border-[#DCD6FF] bg-white px-3 py-1.5 text-xs font-extrabold uppercase tracking-[.06em] text-[#6A5AE0]">
                Vključeno
              </span>
            </div>
            <h2 className="mt-3 text-[32px] font-extrabold leading-[1.14] tracking-[-.03em] md:text-[38px]">
              Vi delate. Za spletno stran skrbimo mi.
            </h2>
            <p className="mt-4 text-[16.5px] leading-[1.6] text-[#54515E]">
              Poskrbimo za vsebino, slike, posodobitve, gostovanje in tehnično vzdrževanje. S spletno stranjo se vam ni treba ukvarjati.
            </p>
          </div>
        </div>
      </section>

      <StepsSection />

      <CompareSection />

      <PricingSection />

      <section className="bg-white px-5 pb-24 pt-10 md:px-8">
        <div className="mx-auto max-w-[780px]">
          <SectionHeading eyebrow="Pogosta vprašanja" title="Vprašanja, ki jih imajo obrtniki pred začetkom" />
          <FaqAccordion items={faqsLanding} />
        </div>
      </section>

      <CtaBand
        title="Pripravljeni na več povpraševanj?"
        text="Na brezplačnem posvetu vam pokažemo, kako bi sistem deloval za vaše storitve, vašo lokacijo in vaše stranke."
      />
    </PageShell>
  );
}
