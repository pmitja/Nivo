import Link from "next/link";
import { cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import {
  ArrowRight,
  BellRing,
  Check,
  ChevronRight,
  CircleCheck,
  Clock3,
  Globe2,
  MailCheck,
  MessageSquareText,
  MousePointerClick,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  UsersRound,
} from "lucide-react";

import { FaqAccordion } from "@/components/faq-accordion";
import { PromoVideoPlayer } from "@/components/promo-video-player";
import { PageShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { faqsLanding } from "@/lib/site-data";

const trades = ["Krovci", "Električarji", "Vodovodarji", "Gradbinci", "Fasaderji", "HVAC", "Solarni monterji"];

const included = [
  "Profesionalna spletna stran do 5 podstrani",
  "Vsebina, gostovanje in vzdrževanje",
  "Kontaktni obrazci in pregled povpraševanj",
  "SMS obvestilo ob novem povpraševanju",
  "E-poštno potrdilo vaši stranki",
  "Sistem za pridobivanje Google ocen",
  "Marketinške in priporočilne akcije",
  "Analitika, podpora in popolna skrb ekipe",
];

const englishCopy: Record<string, string> = {
  "Krovci": "Roofers",
  "Električarji": "Electricians",
  "Vodovodarji": "Plumbers",
  "Gradbinci": "General contractors",
  "Fasaderji": "Exterior contractors",
  "Solarni monterji": "Solar installers",
  "Profesionalna spletna stran do 5 podstrani": "Professional website with up to 5 pages",
  "Vsebina, gostovanje in vzdrževanje": "Copy, hosting and maintenance",
  "Kontaktni obrazci in pregled povpraševanj": "Contact forms and inquiry management",
  "SMS obvestilo ob novem povpraševanju": "Instant SMS alert for every new inquiry",
  "E-poštno potrdilo vaši stranki": "Email confirmation for your customer",
  "Sistem za pridobivanje Google ocen": "Google review request system",
  "Marketinške in priporočilne akcije": "Marketing and referral campaigns",
  "Analitika, podpora in popolna skrb ekipe": "Analytics, support and a fully managed system",
  "Video predstavitev sistema Obrtio": "Obrtio system overview",
  "obrtio.si — predstavitev sistema": "obrtio.com — system overview",
  "Novo povpraševanje": "New inquiry",
  "SMS poslan takoj": "SMS sent instantly",
  "Google ocene": "Google reviews",
  "Več zaupanja. Več klicev.": "More trust. More calls.",
  "Celoten sistem za slovenske obrtnike": "The complete growth system for contractors",
  "Vi opravljate delo.": "You do the work.",
  "Mi poskrbimo za stranke.": "We bring the customers.",
  "Profesionalna spletna stran in sistem, ki zajame povpraševanja, vas takoj obvesti ter pomaga pridobivati več ocen in novih strank.": "A professional website and customer system that captures inquiries, alerts you instantly and helps you win more reviews and new work.",
  "Rezervirajte brezplačen posvet": "Book a free call",
  "Poglejte, kako deluje": "See how it works",
  "Brez vezave": "No contract",
  "Vse uredimo mi": "We handle everything",
  "99 € / mesec": "$199 / month",
  "Zasnovano za podjetja, kjer šteje vsako povpraševanje": "Built for businesses where every inquiry matters",
  "Zakaj Obrtio": "Why Obrtio",
  "Dobra izvedba ni dovolj, če vas stranke ne najdejo ali predolgo čakajo.": "Great work is not enough if customers cannot find you or wait too long for a reply.",
  "Obrtio poveže vse ključne korake — od prvega obiska spletne strani do novega povpraševanja in odlične ocene.": "Obrtio connects every important step — from the first website visit to a new inquiry and a five-star review.",
  "Več pravih povpraševanj": "More qualified inquiries",
  "Spletna stran jasno predstavi vaše storitve in obiskovalca usmeri do oddaje povpraševanja.": "Your website clearly presents your services and guides visitors toward requesting a quote.",
  "Odzovete se pravočasno": "Reply at the right time",
  "Ob novem zanimanju prejmete SMS, stranka pa takoj dobi profesionalno e-poštno potrdilo.": "You receive an SMS for every new inquiry while the customer gets an immediate professional confirmation.",
  "Zaupanje raste z ocenami": "Build trust with reviews",
  "Po opravljenem delu stranki enostavno pošljete prošnjo za Google oceno.": "After the job, send the customer a friendly Google review request in a few clicks.",
  "Enostaven potek": "A simple process",
  "Od spletnega obiska do vašega telefona v nekaj sekundah.": "From a website visit to your phone in seconds.",
  "Stranki olajšamo prvi korak, vam pa omogočimo, da se odzovete hitro in pregledno.": "We make the first step easy for customers and help you respond quickly with everything organized.",
  "Stranka vas najde": "A customer finds you",
  "Profesionalna stran predstavi delo in zgradi zaupanje.": "A professional website presents your work and builds trust.",
  "Odda povpraševanje": "They send an inquiry",
  "Obrazec zbere vse podatke, ki jih potrebujete za prvi odziv.": "The form collects everything you need for the first response.",
  "Vi prejmete SMS": "You receive an SMS",
  "Povpraševanje je takoj shranjeno v sistemu in na vašem telefonu.": "The inquiry is saved instantly in your dashboard and sent to your phone.",
  "Prenova strehe": "Roof replacement",
  "Novo": "New",
  "Tomaž Kovač": "John Smith",
  "Kranj": "Austin",
  "Streha, 180 m²": "Roof, 1,900 sq ft",
  "Pred 8 sekundami": "8 seconds ago",
  "SMS obrtniku": "SMS to contractor",
  "Poslano takoj": "Sent instantly",
  "Potrdilo stranki": "Customer confirmation",
  "Dostavljeno": "Delivered",
  "Vse na enem mestu": "Everything in one place",
  "Ne dobite samo spletne strani. Dobite sistem za stranke.": "You do not just get a website. You get a customer system.",
  "Spletna stran, za katero skrbimo mi": "A website fully managed by our team",
  "Pripravimo vsebino, slike in do pet podstrani. Poskrbimo tudi za gostovanje, spremembe in tehnično delovanje.": "We prepare the copy, images and up to five pages. Hosting, updates and technical maintenance are included.",
  "Vsebina · slike · gostovanje · vzdrževanje": "Copy · images · hosting · maintenance",
  "Vsa povpraševanja pregledno zbrana": "Every inquiry in one clear view",
  "Namesto izgubljenih sporočil dobite urejen pregled strank, statusov in naslednjih akcij.": "Instead of lost messages, you get an organized view of customers, statuses and next actions.",
  "Povpraševanja · stranke · statusi · opombe": "Inquiries · customers · statuses · notes",
  "Več odličnih Google ocen": "More five-star Google reviews",
  "Po opravljenem delu pošljete prijazno SMS prošnjo za oceno in postopoma gradite močnejši ugled.": "After each job, send a friendly SMS review request and build a stronger reputation over time.",
  "SMS prošnja · povratne informacije · pregled": "SMS requests · feedback · overview",
  "Akcije za nove in obstoječe stranke": "Campaigns for new and past customers",
  "Ostanite v stiku s strankami in spodbudite nova naročila ali priporočila ob pravem času.": "Stay in touch with customers and encourage repeat work or referrals at the right time.",
  "Marketinške akcije · priporočila · rezultati": "Campaigns · referrals · results",
  "Jasna cena": "Simple pricing",
  "Vse potrebno za profesionalen začetek in dolgoročno rast.": "Everything you need for a professional start and long-term growth.",
  "Brez visokega začetnega vložka, brez tehničnih skrbi in brez vezave. Če potrebujete dodatno pomoč, so Google Business Profil, SEO in oglaševanje na voljo posebej.": "No large upfront investment, no technical burden and no contract. Google Business Profile, SEO and advertising are available when you need more visibility.",
  "Brez vezave in skritih stroškov": "No contract or hidden fees",
  "Plačujete, dokler uporabljate spletno stran, sistem in podporo ekipe Obrtio.": "You pay while you use the website, system and Obrtio support.",
  "Obrtio osnovni paket": "Obrtio core plan",
  "/ mesec": "/ month",
  "Vse vključeno": "Everything included",
  "Dogovorite se za brezplačen posvet": "Book a free call",
  "Ali 950 € za 12 mesecev · prekinitev kadarkoli": "Or $1,900 per year · cancel anytime",
  "99 €": "$199",
  "Pogosta vprašanja": "Frequently asked questions",
  "Kar obrtniki vprašajo pred začetkom.": "What contractors ask before getting started.",
  "Naj vaše dobro delo pripelje do več novih strank.": "Turn your great work into more new customers.",
  "Na kratkem posvetu vam pokažemo, kako bi Obrtio deloval za vaše storitve in vaše območje.": "On a short call, we will show you how Obrtio can work for your services and service area.",
  "Ali je spletna stran res vključena?": "Is the website really included?",
  "Da. V mesečno ceno je vključena profesionalna spletna stran, postavitev sistema, gostovanje, vzdrževanje in osnovne funkcije za povpraševanja.": "Yes. Your subscription includes a professional website, system setup, hosting, maintenance and inquiry management.",
  "Kdo skrbi za spletno stran?": "Who manages the website?",
  "Za spletno stran v celoti skrbi ekipa Obrtio — od vsebine in slik do gostovanja, posodobitev in tehničnega vzdrževanja. Vam se s tem ni treba ukvarjati.": "The Obrtio team manages everything — copy, images, hosting, updates and technical maintenance.",
  "Ali potrebujem tehnično znanje?": "Do I need technical knowledge?",
  "Ne. Sistem je pripravljen tako, da ga lahko uporablja podjetnik brez tehničnega znanja.": "No. The system is designed for busy business owners without technical knowledge.",
  "Kaj se zgodi, ko nekdo pošlje povpraševanje?": "What happens when someone sends an inquiry?",
  "Vi prejmete SMS obvestilo, stranka prejme e-poštno potrdilo, povpraševanje pa se shrani v sistem.": "You receive an SMS alert, the customer receives an email confirmation and the inquiry is saved in your dashboard.",
  "Za koga je to primerno?": "Who is Obrtio for?",
  "Za obrtnike, izvajalce in lokalna podjetja, ki pridobivajo stranke preko povpraševanj, priporočil, Google iskanja ali socialnih omrežij.": "For contractors and local service businesses that win customers through inquiries, referrals, Google or social media.",
  "Ali mi zagotavljate nove stranke?": "Do you guarantee new customers?",
  "Ne obljubljamo nemogočega. Postavimo pa sistem, ki poveča možnosti, da vas stranke kontaktirajo, da hitreje odgovorite in da iz obstoječih strank dobite več priporočil ter ocen.": "We do not make impossible promises. We build a system that helps more customers contact you, helps you respond faster and creates more opportunities for reviews and referrals.",
};

const englishRoutes: Record<string, string> = {
  "/kontakt": "/contact",
  "/kako-deluje": "/how-it-works",
  "#kako-deluje": "#how-it-works",
  "kako-deluje": "how-it-works",
};

function translateString(value: string): string {
  const trimmed = value.trim();
  const translated = englishCopy[trimmed] ?? englishRoutes[trimmed];
  if (!translated) return value;

  return `${value.slice(0, value.indexOf(trimmed))}${translated}${value.slice(value.indexOf(trimmed) + trimmed.length)}`;
}

function translateValue(value: unknown): unknown {
  if (typeof value === "string") return translateString(value);
  if (Array.isArray(value)) {
    return value.map((item, index) => {
      const translated = translateValue(item);
      return isValidElement(translated) && translated.key === null
        ? cloneElement(translated, { key: index })
        : translated;
    });
  }
  if (isValidElement(value)) return translateNode(value);
  if (value && typeof value === "object" && Object.getPrototypeOf(value) === Object.prototype) {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, translateValue(item)]));
  }
  return value;
}

function translateNode(node: ReactNode): ReactNode {
  if (typeof node === "string") return translateString(node);
  if (Array.isArray(node)) {
    return node.map((item, index) => {
      const translated = translateNode(item);
      return isValidElement(translated) && translated.key === null
        ? cloneElement(translated, { key: index })
        : translated;
    });
  }
  if (!isValidElement(node)) return node;
  const element = node as ReactElement<Record<string, unknown>>;
  const props = Object.fromEntries(Object.entries(element.props).map(([key, value]) => [
    key,
    key === "children" ? translateNode(value as ReactNode) : translateValue(value),
  ]));
  return cloneElement(element, props);
}

function Kicker({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div className={`mb-4 text-[12px] font-extrabold uppercase tracking-[.13em] ${dark ? "text-[#B9B0FF]" : "text-[#6654DB]"}`}>
      {children}
    </div>
  );
}

function DashboardPreview({ locale = "sl" }: { locale?: "sl" | "en" }) {
  const copy = locale === "en"
    ? {
        ariaLabel: "Obrtio system overview",
        browserLabel: "obrtio.com — system overview",
        inquiry: "New inquiry",
        sms: "SMS sent instantly",
        reviews: "Google reviews",
        rating: "4.9",
      }
    : {
        ariaLabel: "Video predstavitev sistema Obrtio",
        browserLabel: "obrtio.si — predstavitev sistema",
        inquiry: "Novo povpraševanje",
        sms: "SMS poslan takoj",
        reviews: "Google ocene",
        rating: "4,9",
      };

  return (
    <div className="relative mx-auto w-full max-w-[1040px]" aria-label={copy.ariaLabel}>
      <div className="absolute -inset-10 -z-10 rounded-[44px] bg-[#7464E8]/15 blur-3xl" />
      <div className="overflow-hidden rounded-[18px] border border-white/70 bg-white shadow-[0_40px_100px_rgba(37,29,83,.22)] ring-1 ring-[#2F235F]/10">
        <div className="flex h-11 items-center gap-2 border-b border-[#EDEBF4] bg-[#F8F7FB] px-4">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF8B85]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#F4C86E]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#72C58D]" />
          <div className="mx-auto mr-[38%] hidden rounded-md bg-white px-16 py-1 text-[10px] text-[#AAA6B5] shadow-sm sm:block">{copy.browserLabel}</div>
        </div>
        <div className="relative aspect-video bg-[#EDE8F8]">
          <PromoVideoPlayer />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#17141F]/25 to-transparent" />
        </div>
      </div>
      <div className="absolute -left-4 bottom-16 hidden w-[225px] rounded-2xl border border-[#EAE7F2] bg-white p-4 shadow-[0_22px_55px_rgba(35,28,65,.18)] md:block lg:-left-20">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#EEEBFF] text-[#6654DB]"><BellRing size={17} /></span>
          <div><div className="text-xs font-extrabold">{copy.inquiry}</div><div className="mt-0.5 text-[10px] text-[#8A8695]">{copy.sms}</div></div>
        </div>
      </div>
      <div className="absolute -right-4 top-20 hidden w-[190px] rounded-2xl border border-[#EAE7F2] bg-white p-4 shadow-[0_22px_55px_rgba(35,28,65,.18)] md:block lg:-right-16">
        <div className="text-[10px] font-bold uppercase tracking-wider text-[#9995A3]">{copy.reviews}</div>
        <div className="mt-1 flex items-end gap-2"><span className="text-2xl font-extrabold">{copy.rating}</span><span className="pb-1 text-xs text-[#F5A623]">★★★★★</span></div>
      </div>
    </div>
  );
}

export function HomePage({ locale = "sl" }: { locale?: "sl" | "en" }) {
  const page = (
    <PageShell locale={locale}>
      <main className="bg-white">
        <section className="relative isolate overflow-hidden bg-[#F8F7FC] px-5 pb-24 pt-16 md:px-8 md:pb-32 md:pt-24">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(111,93,226,.17),transparent_38%)]" />
          <div className="absolute inset-0 -z-10 opacity-40 [background-image:linear-gradient(rgba(104,88,206,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(104,88,206,.08)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_62%)]" />
          <div className="mx-auto max-w-[1180px]">
            <div className="mx-auto max-w-[850px] text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#DFDAF6] bg-white/80 px-3.5 py-2 text-[12px] font-bold text-[#554F69] shadow-sm backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-[#27AD79]" /> Celoten sistem za slovenske obrtnike
              </div>
              <h1 className="mt-7 text-balance text-[43px] font-extrabold leading-[1.04] tracking-[-.047em] text-[#17141F] sm:text-[58px] md:text-[72px]">
                Vi opravljate delo.<br /><span className="text-[#6654DB]">Mi poskrbimo za stranke.</span>
              </h1>
              <p className="mx-auto mt-7 max-w-[680px] text-pretty text-[17px] leading-[1.7] text-[#5D5967] md:text-[19px]">
                Profesionalna spletna stran in sistem, ki zajame povpraševanja, vas takoj obvesti ter pomaga pridobivati več ocen in novih strank.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button asChild size="lg" className="w-full sm:w-auto"><Link href="/kontakt">Rezervirajte brezplačen posvet <ArrowRight size={17} /></Link></Button>
                <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto"><Link href="#kako-deluje">Poglejte, kako deluje</Link></Button>
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[12px] font-semibold text-[#7B7686]">
                <span className="flex items-center gap-1.5"><CircleCheck size={14} className="text-[#27AD79]" /> Brez vezave</span>
                <span className="flex items-center gap-1.5"><CircleCheck size={14} className="text-[#27AD79]" /> Vse uredimo mi</span>
                <span className="flex items-center gap-1.5"><CircleCheck size={14} className="text-[#27AD79]" /> 99 € / mesec</span>
              </div>
            </div>
            <div className="nv-hero-video mt-16 md:mt-20"><DashboardPreview locale={locale} /></div>
          </div>
        </section>

        <section className="border-y border-[#ECEAF2] bg-white px-5 py-8 md:px-8">
          <div className="mx-auto max-w-[1100px] text-center">
            <p className="text-[11px] font-extrabold uppercase tracking-[.14em] text-[#9A96A4]">Zasnovano za podjetja, kjer šteje vsako povpraševanje</p>
            <div className="mt-5 flex flex-wrap justify-center gap-x-8 gap-y-3 text-[14px] font-bold text-[#55515E]">{trades.map((trade) => <span key={trade}>{trade}</span>)}</div>
          </div>
        </section>

        <section className="px-5 py-24 md:px-8 md:py-32">
          <div className="mx-auto max-w-[1120px]">
            <div className="mx-auto max-w-[720px] text-center"><Kicker>Zakaj Obrtio</Kicker><h2 className="text-balance text-[36px] font-extrabold leading-[1.12] tracking-[-.035em] md:text-[50px]">Dobra izvedba ni dovolj, če vas stranke ne najdejo ali predolgo čakajo.</h2><p className="mx-auto mt-5 max-w-[620px] text-[17px] leading-[1.7] text-[#625E6A]">Obrtio poveže vse ključne korake — od prvega obiska spletne strani do novega povpraševanja in odlične ocene.</p></div>
            <div className="mt-14 grid gap-5 md:grid-cols-3">
              {[
                [MousePointerClick, "Več pravih povpraševanj", "Spletna stran jasno predstavi vaše storitve in obiskovalca usmeri do oddaje povpraševanja."],
                [Clock3, "Odzovete se pravočasno", "Ob novem zanimanju prejmete SMS, stranka pa takoj dobi profesionalno e-poštno potrdilo."],
                [Star, "Zaupanje raste z ocenami", "Po opravljenem delu stranki enostavno pošljete prošnjo za Google oceno."],
              ].map(([Icon, title, text]) => {
                const ItemIcon = Icon as typeof MousePointerClick;
                return <article key={title as string} className="rounded-[22px] border border-[#E9E7EF] bg-[#FCFBFD] p-7 transition-transform duration-200 hover:-translate-y-1"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#EEEAFE] text-[#6654DB]"><ItemIcon size={22} /></span><h3 className="mt-6 text-xl font-extrabold tracking-[-.02em]">{title as string}</h3><p className="mt-3 text-[15px] leading-[1.7] text-[#66616E]">{text as string}</p></article>;
              })}
            </div>
          </div>
        </section>

        <section id="kako-deluje" className="overflow-hidden bg-[#17141F] px-5 py-24 text-white md:px-8 md:py-32">
          <div className="mx-auto grid max-w-[1120px] items-center gap-16 lg:grid-cols-[.84fr_1.16fr]">
            <div><Kicker dark>Enostaven potek</Kicker><h2 className="text-balance text-[36px] font-extrabold leading-[1.12] tracking-[-.035em] md:text-[49px]">Od spletnega obiska do vašega telefona v nekaj sekundah.</h2><p className="mt-5 text-[17px] leading-[1.7] text-[#AAA5B4]">Stranki olajšamo prvi korak, vam pa omogočimo, da se odzovete hitro in pregledno.</p>
              <div className="mt-9 space-y-6">{[
                ["01", "Stranka vas najde", "Profesionalna stran predstavi delo in zgradi zaupanje."],
                ["02", "Odda povpraševanje", "Obrazec zbere vse podatke, ki jih potrebujete za prvi odziv."],
                ["03", "Vi prejmete SMS", "Povpraševanje je takoj shranjeno v sistemu in na vašem telefonu."],
              ].map(([number, title, text]) => <div key={number} className="flex gap-4"><span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/15 bg-white/5 text-[11px] font-black text-[#B9B0FF]">{number}</span><div><h3 className="font-extrabold">{title}</h3><p className="mt-1 text-sm leading-6 text-[#9994A3]">{text}</p></div></div>)}</div>
            </div>
            <div className="relative">
              <div className="absolute -inset-20 bg-[#6654DB]/20 blur-3xl" />
              <div className="relative rounded-[26px] border border-white/10 bg-[#211D2A] p-4 shadow-2xl sm:p-7">
                <div className="rounded-2xl bg-white p-5 text-[#17141F] sm:p-7"><div className="flex items-center justify-between"><div><div className="text-[11px] font-bold uppercase tracking-wider text-[#928D9B]">Novo povpraševanje</div><div className="mt-1 text-lg font-extrabold">Prenova strehe</div></div><span className="rounded-full bg-[#E9F8F1] px-3 py-1.5 text-[10px] font-bold text-[#16865D]">Novo</span></div><div className="mt-6 grid gap-3 sm:grid-cols-2">{[[UsersRound, "Tomaž Kovač"], [Globe2, "Kranj"], [MessageSquareText, "Streha, 180 m²"], [Clock3, "Pred 8 sekundami"]].map(([Icon, value]) => { const I = Icon as typeof UsersRound; return <div key={value as string} className="flex items-center gap-3 rounded-xl bg-[#F7F6FA] p-3.5 text-xs font-bold"><I size={15} className="text-[#6654DB]" />{value as string}</div> })}</div></div>
                <div className="mx-auto my-3 h-7 w-px bg-white/15" />
                <div className="grid gap-3 sm:grid-cols-2"><div className="rounded-2xl border border-white/10 bg-white/5 p-4"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#6654DB]"><BellRing size={16} /></span><div><div className="text-xs font-bold">SMS obrtniku</div><div className="text-[10px] text-[#9994A3]">Poslano takoj</div></div></div></div><div className="rounded-2xl border border-white/10 bg-white/5 p-4"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#2D875F]"><MailCheck size={16} /></span><div><div className="text-xs font-bold">Potrdilo stranki</div><div className="text-[10px] text-[#9994A3]">Dostavljeno</div></div></div></div></div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 py-24 md:px-8 md:py-32">
          <div className="mx-auto max-w-[1120px]"><div className="max-w-[700px]"><Kicker>Vse na enem mestu</Kicker><h2 className="text-balance text-[36px] font-extrabold leading-[1.12] tracking-[-.035em] md:text-[50px]">Ne dobite samo spletne strani. Dobite sistem za stranke.</h2></div>
            <div className="mt-14 grid gap-5 lg:grid-cols-2">
              {[
                [Globe2, "Spletna stran, za katero skrbimo mi", "Pripravimo vsebino, slike in do pet podstrani. Poskrbimo tudi za gostovanje, spremembe in tehnično delovanje.", "Vsebina · slike · gostovanje · vzdrževanje"],
                [MessageSquareText, "Vsa povpraševanja pregledno zbrana", "Namesto izgubljenih sporočil dobite urejen pregled strank, statusov in naslednjih akcij.", "Povpraševanja · stranke · statusi · opombe"],
                [Star, "Več odličnih Google ocen", "Po opravljenem delu pošljete prijazno SMS prošnjo za oceno in postopoma gradite močnejši ugled.", "SMS prošnja · povratne informacije · pregled"],
                [Send, "Akcije za nove in obstoječe stranke", "Ostanite v stiku s strankami in spodbudite nova naročila ali priporočila ob pravem času.", "Marketinške akcije · priporočila · rezultati"],
              ].map(([Icon, title, text, meta]) => { const I = Icon as typeof Globe2; return <article key={title as string} className="group rounded-[24px] border border-[#E9E7EF] bg-white p-7 shadow-[0_14px_40px_rgba(28,23,46,.05)] sm:p-9"><div className="flex items-start justify-between"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#EEEAFE] text-[#6654DB]"><I size={22} /></span><ChevronRight size={20} className="text-[#C8C4D0] transition-transform group-hover:translate-x-1" /></div><h3 className="mt-7 text-[22px] font-extrabold tracking-[-.025em]">{title as string}</h3><p className="mt-3 max-w-[470px] text-[15px] leading-[1.75] text-[#66616E]">{text as string}</p><div className="mt-6 border-t border-[#EEECF2] pt-5 text-[11px] font-bold uppercase tracking-[.08em] text-[#8C8794]">{meta as string}</div></article> })}
            </div>
          </div>
        </section>

        <section className="bg-[#F7F5FC] px-5 py-24 md:px-8 md:py-32">
          <div className="mx-auto grid min-w-0 max-w-[1080px] items-center gap-14 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)]">
            <div className="min-w-0"><Kicker>Jasna cena</Kicker><h2 className="text-balance text-[36px] font-extrabold leading-[1.12] tracking-[-.035em] md:text-[48px]">Vse potrebno za profesionalen začetek in dolgoročno rast.</h2><p className="mt-5 text-[16px] leading-[1.7] text-[#66616E]">Brez visokega začetnega vložka, brez tehničnih skrbi in brez vezave. Če potrebujete dodatno pomoč, so Google Business Profil, SEO in oglaševanje na voljo posebej.</p>
              <div className="mt-8 rounded-2xl border border-[#E2DEF1] bg-white p-5"><div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 text-[#6654DB]" size={21} /><div><div className="text-sm font-extrabold">Brez vezave in skritih stroškov</div><p className="mt-1 text-xs leading-5 text-[#797482]">Plačujete, dokler uporabljate spletno stran, sistem in podporo ekipe Obrtio.</p></div></div></div>
            </div>
            <div className="min-w-0 rounded-[28px] border border-[#DED9F2] bg-white p-7 shadow-[0_25px_70px_rgba(57,43,113,.13)] sm:p-10"><div className="flex min-w-0 flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><div className="text-sm font-extrabold text-[#6654DB]">Obrtio osnovni paket</div><div className="mt-3 flex flex-wrap items-end gap-2"><span className="text-[52px] font-extrabold leading-none tracking-[-.05em]">99 €</span><span className="pb-1 text-sm text-[#787380]">/ mesec</span></div></div><span className="shrink-0 rounded-full bg-[#EEEAFE] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#6654DB]">Vse vključeno</span></div><div className="my-8 h-px bg-[#ECEAF1]" /><div className="grid min-w-0 gap-3 sm:grid-cols-2">{included.map((item) => <div key={item} className="flex min-w-0 gap-2.5 text-[13px] font-semibold leading-5 text-[#4E4A55]"><span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#E9F8F1] text-[#16865D]"><Check size={12} strokeWidth={3} /></span>{item}</div>)}</div><Button asChild size="lg" className="mt-9 w-full"><Link href="/kontakt">Dogovorite se za brezplačen posvet <ArrowRight size={17} /></Link></Button><p className="mt-4 text-center text-[11px] text-[#8E8996]">Ali 950 € za 12 mesecev · prekinitev kadarkoli</p></div>
          </div>
        </section>

        <section className="px-5 py-24 md:px-8 md:py-28"><div className="mx-auto max-w-[780px]"><div className="text-center"><Kicker>Pogosta vprašanja</Kicker><h2 className="text-[36px] font-extrabold tracking-[-.035em] md:text-[46px]">Kar obrtniki vprašajo pred začetkom.</h2></div><div className="mt-10"><FaqAccordion items={faqsLanding} /></div></div></section>

        <section className="px-5 pb-20 md:px-8 md:pb-28"><div className="relative mx-auto max-w-[1120px] overflow-hidden rounded-[30px] bg-[#6654DB] px-6 py-16 text-center text-white sm:px-12 md:py-20"><div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,white_0,transparent_30%),radial-gradient(circle_at_80%_80%,white_0,transparent_28%)]" /><div className="relative mx-auto max-w-[700px]"><Sparkles className="mx-auto mb-5 text-[#D8D2FF]" /><h2 className="text-balance text-[36px] font-extrabold leading-[1.1] tracking-[-.035em] md:text-[50px]">Naj vaše dobro delo pripelje do več novih strank.</h2><p className="mx-auto mt-5 max-w-[570px] text-[16px] leading-[1.7] text-[#E0DCFA]">Na kratkem posvetu vam pokažemo, kako bi Obrtio deloval za vaše storitve in vaše območje.</p><Button asChild variant="inverse" size="lg" className="mt-8"><Link href="/kontakt">Rezervirajte brezplačen posvet <ArrowRight size={17} /></Link></Button></div></div></section>
      </main>
    </PageShell>
  );
  return locale === "en" ? translateNode(page) : page;
}
