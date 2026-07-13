"use client";

import { useRef, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ContactFormField } from "@/db/schema";

type Appearance = "default" | "electrician";

export function PublicLeadForm({
  companyId,
  fields,
  submitLabel,
  successMessage,
  appearance = "default",
  showAttachment = true,
}: {
  companyId: string;
  fields: ContactFormField[];
  submitLabel: string;
  successMessage: string;
  appearance?: Appearance;
  showAttachment?: boolean;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");
  const formStartedAt = useRef<number | null>(null);
  const electrician = appearance === "electrician";

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("sending");
    setMessage("");

    const formData = new FormData(form);
    formData.set("formStartedAt", String(formStartedAt.current ?? Date.now()));
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
    <form
      onSubmit={onSubmit}
      onFocusCapture={() => {
        formStartedAt.current ??= Date.now();
      }}
      className="grid gap-4"
    >
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />
      <div className="grid gap-4 md:grid-cols-2">
        {fields.filter((field) => field.enabled && field.type !== "textarea").map((field) => (
          <Field key={field.name} field={field} appearance={appearance} />
        ))}
      </div>
      {fields.filter((field) => field.enabled && field.type === "textarea").map((field) => (
        <div key={field.name} className="grid gap-2">
          <Label htmlFor={field.name} className={electrician ? "font-bold text-[#45536b]" : undefined}>
            {field.label}{field.required ? " *" : ""}
          </Label>
          <Textarea
            id={field.name}
            name={field.name}
            required={field.required}
            minLength={10}
            placeholder={electrician ? "Na kratko opišite, kaj potrebujete …" : undefined}
            className={electrician ? "min-h-28 rounded-xl border-[#d7deea] bg-white text-base focus-visible:border-[#ffbf00] focus-visible:ring-[#ffbf00]/25" : "min-h-36 text-[15px]"}
          />
        </div>
      ))}
      {showAttachment ? (
        <div className="grid gap-2">
          <Label htmlFor="attachment">Popis del (Excel) — neobvezno</Label>
          <Input id="attachment" name="attachment" type="file" accept=".xls,.xlsx,.csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv" className="h-12 text-[15px] file:mr-3 file:h-full file:border-0 file:bg-transparent file:text-sm file:font-semibold" />
        </div>
      ) : null}
      <div className="flex items-start gap-3">
        <Checkbox id="privacyConsent" name="privacyConsent" required className={electrician ? "mt-1 border-[#9ba8ba] data-[state=checked]:border-[#0f6cf2] data-[state=checked]:bg-[#0f6cf2]" : "mt-1"} />
        <Label htmlFor="privacyConsent" className={`cursor-pointer text-sm font-semibold leading-6 ${electrician ? "text-[#59677e]" : "text-[#55515F]"}`}>
          Strinjam se z obdelavo podatkov za namen obravnave povpraševanja. *
        </Label>
      </div>
      <div className="flex items-start gap-3">
        <Checkbox id="marketingConsent" name="marketingConsent" className={electrician ? "mt-1 border-[#9ba8ba] data-[state=checked]:border-[#0f6cf2] data-[state=checked]:bg-[#0f6cf2]" : "mt-1"} />
        <Label htmlFor="marketingConsent" className={`cursor-pointer text-sm font-semibold leading-6 ${electrician ? "text-[#59677e]" : "text-[#55515F]"}`}>
          Želim prejemati obvestila o akcijah, novostih in posebnih ponudbah.
        </Label>
      </div>
      {message ? (
        <p role="status" className={`rounded-[14px] px-4 py-3 text-sm font-bold ${status === "error" ? "bg-[#FFF5F5] text-[#9B2C2C]" : "bg-[#F0FFF6] text-[#167E53]"}`}>
          {message}
        </p>
      ) : null}
      <Button disabled={status === "sending"} className={electrician ? "h-14 cursor-pointer rounded-xl bg-[#ffc400] text-base font-extrabold text-[#0b1729] shadow-none transition-colors hover:bg-[#ffd138] focus-visible:ring-[#ffc400]" : "h-12"}>
        {status === "sending" ? "Pošiljam..." : submitLabel}
        {electrician ? null : <Send className="h-4 w-4" />}
      </Button>
      {electrician ? <p className="text-center text-xs font-medium leading-5 text-[#8a96a9]">Vaše podatke uporabimo izključno za pripravo odgovora na povpraševanje.</p> : null}
    </form>
  );
}

function Field({ field, appearance }: { field: ContactFormField; appearance: Appearance }) {
  const electrician = appearance === "electrician";
  const controlClasses = electrician
    ? "h-12 rounded-xl border-[#d7deea] bg-white text-base focus-visible:border-[#ffbf00] focus-visible:ring-[#ffbf00]/25"
    : "h-12 text-[15px]";

  return (
    <div className={`grid gap-2 ${field.name === "service" ? "md:col-span-2" : ""}`}>
      <Label htmlFor={field.name} className={electrician ? "font-bold text-[#45536b]" : undefined}>
        {field.label}{field.required ? " *" : ""}
      </Label>
      {field.type === "select" ? (
        <select id={field.name} name={field.name} required={field.required} defaultValue="" className={`w-full cursor-pointer appearance-none border px-4 outline-none transition-shadow focus-visible:ring-2 ${controlClasses}`}>
          <option value="" disabled>Izberite storitev</option>
          {field.options?.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      ) : (
        <Input id={field.name} name={field.name} type={field.type} required={field.required} className={controlClasses} />
      )}
    </div>
  );
}
