import type { Metadata } from "next";
import { CheckCircle2, MessageSquareText, Send } from "lucide-react";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { PublicLeadForm } from "@/app/obrazec/[companyId]/lead-form";
import { db } from "@/db";
import { companies } from "@/db/schema";

export const metadata: Metadata = {
  title: "Test povpraševanja | Obrtio",
  robots: { index: false, follow: false },
};

const testCompanyId = "11111111-1111-4111-8111-111111111111";

const testFields = [
  { name: "name", label: "Ime in priimek", type: "text", required: true, enabled: true },
  { name: "phone", label: "Vaša telefonska številka", type: "tel", required: true, enabled: true },
  { name: "email", label: "E-pošta za potrdilo", type: "email", required: true, enabled: true },
  { name: "location", label: "Lokacija", type: "text", required: false, enabled: true },
  { name: "service", label: "Kaj potrebujete?", type: "text", required: true, enabled: true },
  { name: "message", label: "Opišite povpraševanje", type: "textarea", required: true, enabled: true },
] as const;

export default async function TestLeadPage() {
  const [company] = await db
    .select({ id: companies.id, name: companies.name, phone: companies.phone })
    .from(companies)
    .where(eq(companies.id, testCompanyId))
    .limit(1);

  if (!company) notFound();

  return (
    <main className="min-h-screen bg-[#F6F7F9] px-5 py-8 text-[#16151D] md:py-12">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-lg border border-[#E3E5E8] bg-white shadow-[0_24px_70px_rgba(22,21,29,.10)] lg:grid-cols-[.78fr_1.22fr]">
        <aside className="border-b border-[#D8E9DF] bg-[#EAF6EF] p-7 lg:border-r lg:border-b-0 lg:p-10">
          <div className="inline-flex items-center gap-2 text-sm font-bold text-[#176B48]">
            <span className="h-2 w-2 rounded-full bg-[#23A66F]" />
            Testno okolje
          </div>
          <h1 className="mt-6 text-3xl font-extrabold leading-tight md:text-4xl">
            Preveri celoten tok povpraševanja
          </h1>
          <p className="mt-4 leading-7 text-[#486055]">
            Oddaja uporabi isti sistem kot pravi obrazec podjetja {company.name}.
          </p>
          <ol className="mt-8 grid gap-5">
            <Step icon={Send} number="01" text="Povpraševanje se shrani v bazo." />
            <Step icon={MessageSquareText} number="02" text={`SMS se pošlje obrtniku na ${company.phone}.`} />
            <Step icon={CheckCircle2} number="03" text="E-poštno potrdilo se pošlje prek Resenda." />
          </ol>
        </aside>

        <section className="p-7 lg:p-10">
          <p className="text-sm font-extrabold uppercase text-[#6A5AE0]">{company.name}</p>
          <h2 className="mt-2 text-2xl font-extrabold">Testno povpraševanje</h2>
          <p className="mt-2 text-sm leading-6 text-[#686473]">
            Vsa polja z zvezdico so obvezna. Oddaja sproži pravi SMS.
          </p>
          <div className="mt-7">
            <PublicLeadForm
              companyId={company.id}
              fields={[...testFields]}
              submitLabel="Pošlji testno povpraševanje"
              successMessage="Test je oddan. Preveri SMS, e-pošto in Obrtio dashboard."
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function Step({
  icon: Icon,
  number,
  text,
}: {
  icon: typeof Send;
  number: string;
  text: string;
}) {
  return (
    <li className="grid grid-cols-[44px_1fr] items-start gap-3">
      <span className="flex h-11 w-11 items-center justify-center rounded-md border border-[#BBDDC9] bg-white text-[#176B48]">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span>
        <span className="block text-xs font-extrabold text-[#4F7C68]">{number}</span>
        <span className="mt-1 block text-sm font-bold leading-6 text-[#244B3A]">{text}</span>
      </span>
    </li>
  );
}
