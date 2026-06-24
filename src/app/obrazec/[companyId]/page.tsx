import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { companies } from "@/db/schema";
import { PublicLeadForm } from "./lead-form";

export default async function PublicLeadFormPage({ params }: { params: Promise<{ companyId: string }> }) {
  const { companyId } = await params;
  const [company] = await db.select().from(companies).where(eq(companies.id, companyId)).limit(1);

  if (!company || company.status === "cancelled" || company.status === "suspended") {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#F7F6FB] px-5 py-10 text-[#16151D]">
      <div className="mx-auto max-w-[900px] rounded-[28px] border border-[#E7E4EF] bg-white p-6 shadow-[0_28px_70px_rgba(20,19,29,.10)] md:p-10">
        <div className="mb-8">
          <p className="text-sm font-extrabold uppercase tracking-[.08em] text-[#6A5AE0]">{company.name}</p>
          <h1 className="mt-3 text-[34px] font-extrabold leading-[1.08] tracking-[-.03em] md:text-[48px]">
            Pošljite povpraševanje
          </h1>
          <p className="mt-4 max-w-[620px] text-[16px] leading-7 text-[#65616F]">
            Opišite, kaj potrebujete. Podjetje prejme SMS obvestilo, vi pa potrditev prejema.
          </p>
        </div>
        <PublicLeadForm companyId={company.id} />
      </div>
    </main>
  );
}
