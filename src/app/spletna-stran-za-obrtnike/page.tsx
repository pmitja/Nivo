import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  Check,
  Gauge,
  Globe2,
  MapPin,
  MessageSquareText,
  ShieldCheck,
  Star,
  Wrench,
} from "lucide-react";

import { FaqAccordion } from "@/components/faq-accordion";
import { JsonLd } from "@/components/json-ld";
import { MarketingHeading, MarketingHero } from "@/components/premium-marketing";
import { CtaBand, PageShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { breadcrumbJsonLd, createMetadata, faqJsonLd, serviceJsonLd } from "@/lib/seo";

const description =
  "Profesionalna spletna stran za obrtnike od 99 € mesečno. Vključeni so vsebina, gostovanje, vzdrževanje, obrazci, SMS obvestila in Google ocene.";

const faqs = [
  {
    q: "Koliko stane spletna stran za obrtnika?",
    a: "Obrtio osnovni paket stane 99 € na mesec ali 950 € za 12 mesecev. Vključuje izdelavo spletne strani do pet podstrani, gostovanje, vzdrževanje, obrazce, SMS obvestila, zbiranje Google ocen, analitiko in podporo.",
  },
  {
    q: "Koliko časa traja izdelava spletne strani?",
    a: "Običajna postavitev traja od 7 do 10 dni po uvodnem pogovoru in prejemu osnovnih informacij o podjetju, storitvah in območju dela.",
  },
  {
    q: "Ali moram sam napisati besedila in urejati stran?",
    a: "Ne. Ekipa Obrtio pripravi strukturo in vsebino ter skrbi za slike, posodobitve, gostovanje in tehnično delovanje strani.",
  },
  {
    q: "Kako dobim obvestilo o novem povpraševanju?",
    a: "Ko obiskovalec odda obrazec, obrtnik takoj prejme SMS, stranka pa e-poštno potrdilo. Povpraševanje se shrani tudi v preglednem sistemu.",
  },
  {
    q: "Ali je spletna stran prilagojena iskanju na Googlu?",
    a: "Da. Stran ima urejeno tehnično osnovo, jasno strukturo storitev, mobilno izvedbo in vsebino za panogo ter območje dela. Za razširjeno lokalno SEO optimizacijo je na voljo dodatna storitev.",
  },
  {
    q: "Ali je potrebna vezava?",
    a: "Ne. Naročnino lahko prekinete kadarkoli. Ob prekinitvi se spletna stran in pripadajoči sistem deaktivirata.",
  },
];

const benefits = [
  [Globe2, "Jasna predstavitev storitev", "Obiskovalec takoj razume, kaj delate, kje delate in kako lahko pošlje povpraševanje."],
  [MapPin, "Pripravljeno za lokalno iskanje", "Vsebino uredimo okoli vaše panoge, storitev in območja, na katerem sprejemate stranke."],
  [Gauge, "Hitro tudi na telefonu", "Stran je odzivna, pregledna in pripravljena za ljudi, ki izvajalca iščejo na terenu ali doma."],
  [MessageSquareText, "Obrazec za prava povpraševanja", "Stranko vprašamo po podatkih, ki jih potrebujete za hiter in konkreten prvi odziv."],
  [BellRing, "SMS ob vsakem kontaktu", "O novem povpraševanju izveste takoj, stranka pa prejme e-poštno potrdilo."],
  [Star, "Sistem za Google ocene", "Po opravljenem delu lahko stranki hitro pošljete prošnjo za oceno in gradite zaupanje."],
] as const;

const trades = [
  ["Krovci", "/spletna-stran-za-krovce"],
  ["Električarji", "/izvajalci/elektricar"],
  ["Vodovodarji", "/izvajalci/vodovodar"],
  ["Fasaderji", "/izvajalci/fasader"],
  ["Monterji klim", "/izvajalci/monter-klim"],
  ["Toplotne črpalke", "/izvajalci/toplotne-crpalke"],
  ["Sončne elektrarne", "/izvajalci/soncne-elektrarne"],
  ["Gradbena podjetja", "/izvajalci/gradbeno-podjetje"],
] as const;

export const metadata = createMetadata({
  title: "Spletna stran za obrtnike od 99 € na mesec",
  description,
  path: "/spletna-stran-za-obrtnike",
  keywords: [
    "spletna stran za obrtnike",
    "izdelava spletnih strani za obrtnike",
    "spletna stran za gradbeno podjetje",
    "marketing za obrtnike",
  ],
});

export default function WebsiteForTradesPage() {
  return (
    <PageShell>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Domov", path: "/" },
            { name: "Spletna stran za obrtnike", path: "/spletna-stran-za-obrtnike" },
          ]),
          serviceJsonLd({
            name: "Izdelava spletne strani za obrtnike",
            description,
            path: "/spletna-stran-za-obrtnike",
          }),
          faqJsonLd(faqs),
        ]}
      />
      <main>
        <MarketingHero
          eyebrow="Spletna stran za obrtnike"
          title="Spletna stran, ki vaše delo spremeni v"
          highlight="nova povpraševanja."
          text="Za slovenske obrtnike izdelamo hitro in profesionalno spletno stran, nato pa skrbimo za vsebino, gostovanje, spremembe in tehnično delovanje."
          secondary={{ label: "Kaj je vključeno", href: "#vkljuceno" }}
        />

        <section className="border-y border-[#ECEAF2] bg-white px-5 py-7 md:px-8">
          <div className="mx-auto flex max-w-[950px] flex-wrap justify-center gap-x-8 gap-y-3 text-[13px] font-bold text-[#55515E]">
            {["Do 5 podstrani", "Postavitev v 7–10 dneh", "Brez vezave", "Gostovanje vključeno"].map((item) => (
              <span key={item} className="flex items-center gap-2"><Check size={14} className="text-[#219A6B]" />{item}</span>
            ))}
          </div>
        </section>

        <section id="vkljuceno" className="px-5 py-24 md:px-8 md:py-28">
          <div className="mx-auto max-w-[1120px]">
            <MarketingHeading
              eyebrow="Narejeno za izvajalce"
              title="Ni le lepa stran. Je jasna pot do nove stranke."
              text="Vsak del strani ima nalogo: zgraditi zaupanje, razložiti storitev in obiskovalcu olajšati naslednji korak."
            />
            <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {benefits.map(([Icon, title, text]) => (
                <article key={title} className="rounded-[24px] border border-[#E8E5EE] bg-[#FCFBFD] p-7">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#EEEAFE] text-[#6654DB]"><Icon size={22} /></span>
                  <h2 className="mt-6 text-xl font-extrabold tracking-[-.02em]">{title}</h2>
                  <p className="mt-3 text-sm leading-6 text-[#696470]">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#17141F] px-5 py-24 text-white md:px-8 md:py-28">
          <div className="mx-auto grid max-w-[1080px] items-start gap-14 lg:grid-cols-[.85fr_1.15fr]">
            <div>
              <div className="text-xs font-extrabold uppercase tracking-[.13em] text-[#B9B0FF]">Kaj dobite</div>
              <h2 className="mt-4 text-balance text-[36px] font-extrabold leading-[1.12] tracking-[-.038em] md:text-[48px]">Za spletno stran in sistem skrbi ena ekipa.</h2>
              <p className="mt-5 text-[16px] leading-7 text-[#AAA5B4]">Ni vam treba iskati oblikovalca, pisca, gostovanja in razvijalca. Povejte nam, kaj delate, mi pa pripravimo in vzdržujemo celoto.</p>
              <Button asChild variant="inverse" className="mt-7"><Link href="/kontakt">Pogovorimo se <ArrowRight size={17} /></Link></Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                "Struktura in besedila",
                "Do pet podstrani",
                "Mobilna izvedba",
                "Kontaktni obrazci",
                "SMS obvestila",
                "E-poštna potrdila",
                "Gostovanje in varnost",
                "Spremembe vsebine",
                "Google ocene",
                "Osnovna analitika",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm font-semibold">
                  <Check size={16} className="shrink-0 text-[#AFA4FF]" />{item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#F7F5FC] px-5 py-24 md:px-8 md:py-28">
          <div className="mx-auto max-w-[1060px]">
            <MarketingHeading
              eyebrow="Pripravljeno za vašo panogo"
              title="Besede, storitve in primeri, ki jih vaše stranke razumejo."
              text="Spletna stran za krovca ni enaka strani električarja. Vsebino prilagodimo delu, območju in vprašanjem vaših strank."
            />
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {trades.map(([name, href]) => (
                <Link key={name} href={href} className="inline-flex items-center gap-2 rounded-full border border-[#E2DEEC] bg-white px-5 py-3 text-sm font-bold text-[#4E4957] no-underline transition-colors hover:border-[#6654DB] hover:text-[#6654DB]">
                  <Wrench size={15} />{name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-24 md:px-8 md:py-28">
          <div className="mx-auto grid max-w-[1060px] gap-12 lg:grid-cols-[.75fr_1.25fr]">
            <div>
              <div className="text-xs font-extrabold uppercase tracking-[.13em] text-[#6654DB]">Jasen začetek</div>
              <h2 className="mt-4 text-[34px] font-extrabold leading-tight tracking-[-.035em]">Od pogovora do objave v treh korakih.</h2>
              <div className="mt-7 flex items-start gap-3 rounded-2xl border border-[#E2DEF1] bg-[#FCFBFD] p-5">
                <ShieldCheck className="mt-0.5 shrink-0 text-[#6654DB]" size={21} />
                <p className="text-sm leading-6 text-[#696470]">Brez vezave in brez ločenega začetnega stroška za postavitev osnovnega paketa.</p>
              </div>
            </div>
            <ol className="space-y-4">
              {[
                ["01", "Spoznamo vaše podjetje", "Zberemo storitve, območje dela, reference, fotografije in cilje."],
                ["02", "Pripravimo spletno stran", "Napišemo vsebino, oblikujemo podstrani ter povežemo obrazce in obvestila."],
                ["03", "Objavimo in skrbimo zanjo", "Stran ostaja posodobljena, gostovana in tehnično vzdrževana."],
              ].map(([number, title, text]) => (
                <li key={number} className="flex gap-5 rounded-[20px] border border-[#E8E5EE] p-6">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#6654DB] text-xs font-black text-white">{number}</span>
                  <div><h3 className="font-extrabold">{title}</h3><p className="mt-1.5 text-sm leading-6 text-[#696470]">{text}</p></div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-[#F7F5FC] px-5 py-24 md:px-8 md:py-28">
          <div className="mx-auto max-w-[780px]">
            <MarketingHeading eyebrow="Pogosta vprašanja" title="Preden se odločite za novo spletno stran." />
            <FaqAccordion items={faqs} />
          </div>
        </section>

        <CtaBand title="Naj spletna stran dela tudi takrat, ko ste vi na terenu." text="Na brezplačnem 20-minutnem posvetu pogledamo vašo panogo, območje in najbolj smiselno strukturo strani." />
      </main>
    </PageShell>
  );
}
