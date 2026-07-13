import Link from "next/link";
import { Check, Phone, Zap } from "lucide-react";
import { eq } from "drizzle-orm";
import { PublicLeadForm } from "@/app/obrazec/[companyId]/lead-form";
import { db } from "@/db";
import { companies, contactForms, type ContactFormField } from "@/db/schema";

export const dynamic = "force-dynamic";

const fallbackFields: ContactFormField[] = [
  { name: "name", label: "Ime in priimek", type: "text", required: true, enabled: true },
  { name: "phone", label: "Telefonska številka", type: "tel", required: true, enabled: true },
  { name: "email", label: "E-mail naslov", type: "email", required: true, enabled: true },
  { name: "location", label: "Lokacija izvedbe", type: "text", required: true, enabled: true },
  {
    name: "service",
    label: "Vrsta storitve",
    type: "select",
    options: ["Elektroinštalacije", "Električne polnilnice", "Razsvetljava", "Pametne inštalacije", "Meritve", "Vzdrževanje"],
    required: true,
    enabled: true,
  },
  { name: "message", label: "Kratek opis projekta", type: "textarea", required: true, enabled: true },
];

const benefits = [
  "Elektro dela za domove in podjetja",
  "Urejena in natančna izvedba",
  "Delujemo v Mariboru in okolici",
  "Svetovanje, izvedba in preverjanje",
];

export default async function ElektroLabPage() {
  const [company] = await db.select().from(companies).where(eq(companies.name, "Elektro Lab")).limit(1);
  const [form] = company
    ? await db.select().from(contactForms).where(eq(contactForms.companyId, company.id)).limit(1)
    : [];
  const phone = company?.phone ?? "+386 40 000 000";

  return (
    <main className="min-h-screen bg-[#071426] text-white">
      <header className="border-b border-[#d8dee8] bg-white text-[#0b1729]">
        <div className="mx-auto flex min-h-20 max-w-[1500px] items-center justify-between gap-5 px-5 py-3 lg:px-10">
          <Link href="/elektro-lab" className="flex items-center text-xl font-black tracking-[-.04em] sm:text-2xl" aria-label="Elektro Lab, domov">
            ELEK<span className="relative pr-1">T<Zap className="absolute -right-1 -top-1 h-5 w-5 fill-[#ffc400] text-[#ffc400]" /></span>RO LAB
          </Link>
          <nav className="hidden items-center gap-9 text-sm font-bold text-[#526078] lg:flex" aria-label="Glavna navigacija">
            <a href="#domov" className="border-b-2 border-[#ffc400] py-2 text-[#0b1729]">Domov</a>
            <a href="#storitve" className="py-2 transition-colors hover:text-[#0b1729]">Storitve</a>
            <a href="#rezultati" className="py-2 transition-colors hover:text-[#0b1729]">Reference</a>
            <a href="#kontakt" className="py-2 transition-colors hover:text-[#0b1729]">Kontakt</a>
          </nav>
          <div className="flex items-center gap-4">
            <a href={`tel:${phone.replace(/\s/g, "")}`} className="hidden min-h-11 items-center gap-2 font-extrabold sm:flex">
              <Phone className="h-5 w-5" /> {phone}
            </a>
            <a href="#kontakt" className="inline-flex min-h-11 cursor-pointer items-center rounded-xl bg-[#ffc400] px-4 text-sm font-extrabold transition-colors hover:bg-[#ffd138] sm:px-6">Pošlji povpraševanje</a>
          </div>
        </div>
      </header>

      <section id="domov" className="relative overflow-hidden border-b border-white/10 bg-[linear-gradient(rgba(82,103,132,.20)_1px,transparent_1px),linear-gradient(90deg,rgba(82,103,132,.20)_1px,transparent_1px)] bg-[size:64px_64px]">
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-[radial-gradient(circle_at_right,rgba(255,196,0,.12),transparent_62%)]" />
        <div className="relative mx-auto grid max-w-[1500px] gap-12 px-5 py-14 lg:grid-cols-[1.12fr_.88fr] lg:px-10 lg:py-24">
          <div className="flex flex-col justify-center">
            <div className="mb-8 inline-flex w-fit items-center gap-3 rounded-full border border-white/20 px-4 py-2 text-xs font-extrabold uppercase tracking-[.16em] text-[#bcc7d6]">
              <span className="h-2 w-2 rounded-full bg-[#ffc400]" /> Elektro storitve · Maribor in okolica
            </div>
            <h1 className="max-w-[820px] text-5xl font-black leading-[1.02] tracking-[-.045em] sm:text-6xl xl:text-7xl">
              Električar za <span className="text-[#ffc400]">Maribor</span><br />in okolico
            </h1>
            <p className="mt-7 max-w-[760px] text-lg font-medium leading-8 text-[#b8c2d1] sm:text-xl">
              Zanesljive elektro storitve za domove, stanovanja, novogradnje in podjetja. Poskrbimo za varne, urejene in strokovno izvedene elektro rešitve.
            </p>
            <div id="storitve" className="mt-8 grid gap-4 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-3 text-sm font-bold text-[#d5dce7] sm:text-base">
                  <Check className="h-5 w-5 shrink-0 stroke-[3] text-[#ffc400]" /> {benefit}
                </div>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap gap-4">
              <a href="#kontakt" className="inline-flex min-h-14 cursor-pointer items-center rounded-xl bg-[#ffc400] px-7 font-extrabold text-[#0b1729] transition-colors hover:bg-[#ffd138]">Pošlji povpraševanje</a>
              <a href={`tel:${phone.replace(/\s/g, "")}`} className="inline-flex min-h-14 cursor-pointer items-center rounded-xl border border-white/35 px-7 font-extrabold transition-colors hover:bg-white/10">Pokliči električarja</a>
            </div>
            <div className="mt-12 border-t border-white/20 pt-6 text-sm font-bold leading-7 text-[#8f9bae]">
              Elektroinštalacije <span className="px-3 text-[#ffc400]">·</span> Prenove <span className="px-3 text-[#ffc400]">·</span> Meritve <span className="px-3 text-[#ffc400]">·</span> Razsvetljava <span className="px-3 text-[#ffc400]">·</span> Pametne inštalacije
            </div>
          </div>

          <aside id="kontakt" className="scroll-mt-6 self-start rounded-[28px] bg-[#fbfbfc] p-6 text-[#101c2f] shadow-[0_30px_80px_rgba(0,0,0,.28)] sm:p-9 lg:p-10">
            <h2 className="text-3xl font-black tracking-[-.035em] sm:text-4xl">{form?.title ?? "Pošljite povpraševanje"}</h2>
            <p className="mb-8 mt-3 text-base font-medium leading-7 text-[#627087]">
              {form?.intro ?? "Na kratko opišite, kaj potrebujete. Odgovorili vam bomo v najkrajšem možnem času."}
            </p>
            {company ? (
              <PublicLeadForm companyId={company.id} fields={form?.fields ?? fallbackFields} submitLabel={form?.submitLabel ?? "Pošlji povpraševanje"} successMessage={form?.successMessage ?? "Hvala za povpraševanje. Kmalu se vam oglasimo."} appearance="electrician" showAttachment={false} />
            ) : (
              <p className="rounded-xl border border-[#f1c7c7] bg-[#fff3f3] p-4 font-bold text-[#a33a3a]">Obrazec je trenutno v pripravi.</p>
            )}
          </aside>
        </div>

        <div id="rezultati" className="relative mx-auto grid max-w-[1420px] grid-cols-2 gap-px overflow-hidden rounded-t-[28px] bg-white/15 md:grid-cols-4">
          {[["Lokalna", "odzivna ekipa"], ["10+", "let izkušenj"], ["300+", "izvedenih projektov"], ["100%", "strokovna izvedba"]].map(([value, label]) => (
            <div key={value} className="bg-[#0d1c33] px-5 py-7 text-center">
              <div className="text-2xl font-black text-[#ffc400] sm:text-4xl">{value}</div>
              <div className="mt-1 text-xs font-bold uppercase tracking-[.08em] text-[#aeb9c9] sm:text-sm">{label}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
