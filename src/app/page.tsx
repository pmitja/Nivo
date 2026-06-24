import { FaqAccordion } from "@/components/faq-accordion";
import { CtaBand, Eyebrow, PageShell, SectionHeading } from "@/components/site-shell";
import { CheckList, PhonePair } from "@/components/feature-sections";
import { FeatureCarousel } from "@/components/feature-carousel";
import { PromoVideoPlayer } from "@/components/promo-video-player";
import { Card, CardContent } from "@/components/ui/card";
import { HeroSection } from "@/components/home/hero-section";
import { ProblemSection } from "@/components/home/problem-section";
import { CampaignsSection, ReviewsSection } from "@/components/home/campaigns-section";
import { CompareSection } from "@/components/home/compare-section";
import { PricingSection } from "@/components/home/pricing-section";
import { aiQuestions, cmsItems, faqsLanding, features, smsBullets, steps } from "@/lib/site-data";

export default function Home() {
  return (
    <PageShell>
      <HeroSection />

      <section className="bg-white px-5 pb-20 pt-4 md:px-8">
        <div className="mx-auto max-w-[920px]">
          <div className="relative aspect-video overflow-hidden rounded-[22px] border border-[#ECEAF3] bg-[repeating-linear-gradient(135deg,#ECEAF5,#ECEAF5_11px,#F4F3FA_11px,#F4F3FA_22px)] shadow-[0_30px_70px_rgba(20,19,29,.10)]">
            <PromoVideoPlayer />
          </div>
        </div>
      </section>

      <ProblemSection />

      <section id="storitve" className="bg-white px-5 py-24 md:px-8">
        <div className="mx-auto max-w-[1200px]">
          <SectionHeading
            eyebrow="Rešitev"
            title="Vse, kar potrebujete za več povpraševanj — brez kompliciranja"
            text="Nivo združuje spletno stran, obvestila, avtomatizacijo, Google ocene, kampanje in urejanje vsebine v en enostaven sistem."
          />
          <FeatureCarousel features={features} />
        </div>
      </section>

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
            <Eyebrow>AI pomočnik</Eyebrow>
            <h2 className="mt-3 text-[32px] font-extrabold leading-[1.14] tracking-[-.03em] md:text-[38px]">
              Stranka lažje pove, kaj potrebuje
            </h2>
            <p className="mt-4 text-[16.5px] leading-[1.6] text-[#54515E]">
              Sistem lahko stranki pomaga oddati jasnejše povpraševanje. Vi dobite več informacij in hitreje pripravite
              odgovor ali ponudbo.
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
            <Eyebrow>Urejanje vsebine</Eyebrow>
            <h2 className="mt-3 text-[32px] font-extrabold leading-[1.14] tracking-[-.03em] md:text-[38px]">
              Spremembe brez razvijalca
            </h2>
            <p className="mt-4 text-[16.5px] leading-[1.6] text-[#54515E]">
              Sami lahko uredite osnovne vsebine, slike, storitve in kontaktne podatke. Brez čakanja, brez dodatnih e-mailov.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-24 md:px-8">
        <div className="mx-auto max-w-[1100px]">
          <SectionHeading
            eyebrow="Kako deluje"
            title="Od posveta do delujočega sistema"
            text="Vse postavimo namesto vas, vi pa dobite jasen sistem za odziv na povpraševanja."
          />
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {steps.map((step) => (
              <Card key={step.num}>
                <CardContent className="p-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#6A5AE0] text-[21px] font-extrabold text-white shadow-[0_8px_18px_rgba(106,90,224,.30)]">
                    {step.num}
                  </div>
                  <h3 className="mt-[22px] text-xl font-bold tracking-[-.01em]">{step.title}</h3>
                  <p className="mt-2.5 text-[14.5px] leading-[1.6] text-[#6A6775]">{step.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

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
