import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { companies, contactForms, type ContactFormField } from "@/db/schema";
import { PublicLeadForm } from "./lead-form";

export default async function PublicLeadFormPage({ params }: { params: Promise<{ companyId: string }> }) {
  const { companyId } = await params;
  const [[company], [form]] = await Promise.all([
    db.select().from(companies).where(eq(companies.id, companyId)).limit(1),
    db.select().from(contactForms).where(eq(contactForms.companyId, companyId)).limit(1),
  ]);

  if (!company || company.status === "cancelled" || company.status === "suspended" || form?.active === false) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#F7F6FB] px-5 py-10 text-[#16151D]">
      <div className="mx-auto max-w-[900px] rounded-[28px] border border-[#E7E4EF] bg-white p-6 shadow-[0_28px_70px_rgba(20,19,29,.10)] md:p-10">
        <div className="mb-8">
          <p className="text-sm font-extrabold uppercase tracking-[.08em] text-[#6A5AE0]">{company.name}</p>
          <h1 className="mt-3 text-[34px] font-extrabold leading-[1.08] tracking-[-.03em] md:text-[48px]">
            {form?.title ?? "Request a quote"}
          </h1>
          <p className="mt-4 max-w-[620px] text-[16px] leading-7 text-[#65616F]">
            {form?.intro ?? "Tell us what you need and we will get back to you as soon as possible."}
          </p>
        </div>
        <PublicLeadForm
          companyId={company.id}
          fields={withRequiredEmail(form?.fields ?? defaultFields).map(translateLegacyField)}
          submitLabel={form?.submitLabel === "Pošlji povpraševanje" || !form?.submitLabel ? "Send inquiry" : form.submitLabel}
          successMessage={form?.successMessage === "Hvala za povpraševanje." || !form?.successMessage ? "Thank you. We received your inquiry." : form.successMessage}
        />
      </div>
    </main>
  );
}

const defaultFields: ContactFormField[] = [
  { name: "name", label: "Full name", type: "text", required: true, enabled: true },
  { name: "phone", label: "Phone", type: "tel", required: true, enabled: true },
  { name: "email", label: "Email", type: "email", required: true, enabled: true },
  { name: "location", label: "Location", type: "text", required: false, enabled: true },
  { name: "service", label: "What do you need?", type: "text", required: true, enabled: true },
  { name: "message", label: "Message", type: "textarea", required: true, enabled: true },
];

function withRequiredEmail(fields: ContactFormField[]): ContactFormField[] {
  const hasEmail = fields.some((field) => field.name === "email");
  const normalized = fields.map((field) =>
    field.name === "email" ? { ...field, enabled: true, required: true } : field,
  );
  const requiredEmailField: ContactFormField = {
    name: "email",
    label: "Email",
    type: "email",
    required: true,
    enabled: true,
  };

  return hasEmail
    ? normalized
    : [...normalized, requiredEmailField];
}

function translateLegacyField(field: ContactFormField): ContactFormField {
  const labels: Partial<Record<ContactFormField["name"], string>> = {
    name: "Full name",
    phone: "Phone",
    email: "Email",
    location: "Location",
    service: "What do you need?",
    message: "Message",
  };
  return { ...field, label: labels[field.name] ?? field.label };
}
