import { CalendarCheck, Check, Clock3, Mail, MessageSquareText, Phone, ShieldCheck } from "lucide-react";

import { ContactForm } from "@/components/contact-form";
import { JsonLd } from "@/components/json-ld";
import { MarketingHeading } from "@/components/premium-marketing";
import { PageShell } from "@/components/site-shell";
import { breadcrumbJsonLd, CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_HREF, createMetadata } from "@/lib/seo";

export const metadata = createMetadata({ title: "Kontakt in brezplačen posvet", description: "Rezervirajte brezplačen 20-minutni posvet za boljšo spletno stran, več povpraševanj in Google ocen.", path: "/kontakt", keywords: ["brezplačen posvet", "Obrtio kontakt", "spletna stran za obrtnike"] });

export default function ContactPage() {
  return <PageShell active="kontakt">
    <JsonLd data={breadcrumbJsonLd([{ name: "Domov", path: "/" }, { name: "Kontakt", path: "/kontakt" }])} />
    <main>
      <section className="relative overflow-hidden bg-[#17141F] px-5 py-20 text-white md:px-8 md:py-28">
        <div className="absolute right-[-10%] top-[-30%] h-[620px] w-[620px] rounded-full bg-[#6654DB]/20 blur-3xl" />
        <div className="relative mx-auto grid max-w-[1100px] items-start gap-14 lg:grid-cols-[.9fr_1.1fr]">
          <div className="pt-3"><div className="text-[12px] font-extrabold uppercase tracking-[.13em] text-[#B9B0FF]">Brezplačen posvet</div><h1 className="mt-5 text-balance text-[43px] font-extrabold leading-[1.05] tracking-[-.045em] md:text-[60px]">Poglejmo, kako lahko pridobite <span className="text-[#AFA4FF]">več strank.</span></h1><p className="mt-6 max-w-[520px] text-[17px] leading-[1.75] text-[#B3AEBC]">V 20 minutah spoznamo vaše podjetje, pokažemo primer rešitve in jasno povemo, ali je Obrtio prava izbira za vas.</p>
            <div className="mt-9 space-y-4">{[[Clock3,"20 minut, brez obveznosti"],[MessageSquareText,"Pogovor brez prodajnega pritiska"],[ShieldCheck,"Jasna cena in naslednji koraki"]].map(([Icon,text]) => { const I=Icon as typeof Clock3; return <div key={text as string} className="flex items-center gap-3 text-sm font-semibold text-[#E5E2EA]"><span className="grid h-9 w-9 place-items-center rounded-xl bg-white/7 text-[#B9B0FF]"><I size={17}/></span>{text as string}</div>})}</div>
            <div className="mt-10 border-t border-white/10 pt-7"><div className="text-xs font-bold uppercase tracking-wider text-[#817C8B]">Lahko nas tudi kontaktirate</div><div className="mt-4 flex flex-col gap-3 text-sm"><a href={`tel:${CONTACT_PHONE_HREF}`} className="flex items-center gap-2 text-white no-underline"><Phone size={15} className="text-[#AFA4FF]"/>{CONTACT_PHONE}</a><a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center gap-2 text-white no-underline"><Mail size={15} className="text-[#AFA4FF]"/>{CONTACT_EMAIL}</a></div></div>
          </div>
          <ContactForm />
        </div>
      </section>
      <section className="px-5 py-24 md:px-8 md:py-28"><div className="mx-auto max-w-[1050px]"><MarketingHeading eyebrow="Kaj sledi" title="Od prvega pogovora do delujočega sistema." text="Postopek je jasen, hiter in brez tehničnega dela na vaši strani."/><div className="mt-14 grid gap-5 md:grid-cols-3">{[[CalendarCheck,"1. Brezplačen posvet","Spoznamo vaše storitve, območje in način dela."],[MessageSquareText,"2. Konkreten predlog","Pokažemo strukturo strani in pot vaših povpraševanj."],[Check,"3. Postavitev","Po potrditvi vse pripravimo in povežemo v 7–10 dneh."]].map(([Icon,title,text]) => { const I=Icon as typeof Check; return <article key={title as string} className="rounded-[22px] border border-[#E9E7EF] bg-[#FCFBFD] p-7"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#EEEAFE] text-[#6654DB]"><I size={20}/></span><h2 className="mt-6 text-lg font-extrabold">{title as string}</h2><p className="mt-2 text-sm leading-6 text-[#6A6571]">{text as string}</p></article>})}</div></div></section>
    </main>
  </PageShell>;
}
