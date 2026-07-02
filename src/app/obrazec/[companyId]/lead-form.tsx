"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ContactFormField } from "@/db/schema";

export function PublicLeadForm({
  companyId,
  fields,
  submitLabel,
  successMessage,
}: {
  companyId: string;
  fields: ContactFormField[];
  submitLabel: string;
  successMessage: string;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("sending");
    setMessage("");

    const formData = new FormData(form);
    const response = await fetch(`/api/forms/${companyId}/submissions`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setStatus("error");
      setMessage(data?.message ?? "Povpraševanja trenutno ni bilo mogoče poslati.");
      return;
    }

    form.reset();
    setStatus("sent");
    setMessage(successMessage);
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        {fields.filter((field) => field.enabled && field.type !== "textarea").map((field) => (
          <Field key={field.name} name={field.name} label={field.label} type={field.type} required={field.required} />
        ))}
      </div>
      {fields.filter((field) => field.enabled && field.type === "textarea").map((field) => (
        <div key={field.name} className="grid gap-2">
          <Label htmlFor={field.name}>{field.label}</Label>
          <Textarea id={field.name} name={field.name} required={field.required} minLength={10} className="min-h-36 text-[15px]" />
        </div>
      ))}
      <div className="grid gap-2">
        <Label htmlFor="attachment">Popis del (Excel) — neobvezno</Label>
        <Input
          id="attachment"
          name="attachment"
          type="file"
          accept=".xls,.xlsx,.csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
          className="h-12 text-[15px] file:mr-3 file:h-full file:border-0 file:bg-transparent file:text-sm file:font-semibold"
        />
      </div>
      <div className="flex items-start gap-3">
        <Checkbox id="privacyConsent" name="privacyConsent" required className="mt-1" />
        <Label htmlFor="privacyConsent" className="cursor-pointer text-sm font-semibold leading-6 text-[#55515F]">
          Strinjam se z obdelavo podatkov za namen obravnave povpraševanja.
        </Label>
      </div>
      <div className="flex items-start gap-3">
        <Checkbox id="marketingConsent" name="marketingConsent" className="mt-1" />
        <Label htmlFor="marketingConsent" className="cursor-pointer text-sm font-semibold leading-6 text-[#55515F]">
          Želim prejemati obvestila o akcijah, novostih in posebnih ponudbah.
        </Label>
      </div>
      {message ? (
        <p className={`rounded-[14px] px-4 py-3 text-sm font-bold ${status === "error" ? "bg-[#FFF5F5] text-[#9B2C2C]" : "bg-[#F0FFF6] text-[#167E53]"}`}>
          {message}
        </p>
      ) : null}
      <Button
        disabled={status === "sending"}
        className="h-12"
      >
        {status === "sending" ? "Pošiljam..." : submitLabel}
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  required = false,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        required={required}
        className="h-12 text-[15px]"
      />
    </div>
  );
}
