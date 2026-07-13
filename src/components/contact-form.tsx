"use client";

import { useRef, useState, useTransition } from "react";
import Link from "next/link";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { submitContactInquiry } from "@/app/kontakt/actions";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const tradeOptions = [
  "Krovci",
  "Električarji",
  "Vodovodarji",
  "Monterji toplotnih črpalk",
  "Gradbena podjetja",
  "Fasaderji",
  "Urejanje okolice",
  "Sončne elektrarne",
  "Drugo",
];

type Errors = Partial<Record<"name" | "email" | "phone", string>>;

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [pending, startTransition] = useTransition();
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    panoga: "",
    message: "",
    website: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const formStartedAt = useRef<number | null>(null);

  function validate() {
    const next: Errors = {};
    if (!values.name.trim()) next.name = "Vnesite ime in priimek.";
    if (!values.email.trim()) next.email = "Vnesite e-pošto.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) next.email = "Neveljaven e-naslov.";
    const digits = (values.phone.match(/\d/g) || []).length;
    if (!values.phone.trim()) next.phone = "Vnesite telefon.";
    else if (digits < 6) next.phone = "Neveljavna številka.";
    return next;
  }

  function submit() {
    const next = validate();
    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }
    setErrors({});
    startTransition(async () => {
      const result = await submitContactInquiry({ ...values, formStartedAt: formStartedAt.current ?? Date.now() });
      if (result.ok) {
        setSubmitted(true);
      } else {
        toast.error(result.error);
      }
    });
  }

  function update(field: keyof typeof values, value: string) {
    formStartedAt.current ??= Date.now();
    setValues((current) => ({ ...current, [field]: value }));
  }

  if (submitted) {
    return (
      <div className="rounded-[22px] border border-[#ECEAF3] bg-white p-9 text-center shadow-[0_16px_44px_rgba(20,19,29,.07)]">
        <div className="mx-auto flex h-[68px] w-[68px] items-center justify-center rounded-full bg-[#E4F6EE] text-[#1F8A5B]">
          <Check size={32} strokeWidth={3} />
        </div>
        <h2 className="mt-[22px] text-[26px] font-extrabold tracking-[-.02em]">Hvala za povpraševanje!</h2>
        <p className="mx-auto mt-3 max-w-[380px] text-base leading-[1.6] text-[#54515E]">
          Oglasimo se v 24 urah. Medtem si lahko ogledate, kako sistem deluje.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild size="sm">
            <Link href="/kako-deluje">Kako deluje →</Link>
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setValues({ name: "", email: "", phone: "", panoga: "", message: "", website: "" });
              formStartedAt.current = null;
              setErrors({});
              setSubmitted(false);
            }}
          >
            Pošlji novo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[22px] border border-[#ECEAF3] bg-white p-6 shadow-[0_16px_44px_rgba(20,19,29,.07)] md:p-9">
      <h2 className="text-[22px] font-extrabold tracking-[-.02em]">Pošljite povpraševanje</h2>
      <p className="mt-1.5 text-sm text-[#6A6775]">Odgovorimo v 24 urah, običajno mnogo prej.</p>
      <Field
        className="mt-6"
        label="Ime in priimek"
        value={values.name}
        error={errors.name}
        placeholder="Janez Novak"
        onChange={(value) => update("name", value)}
      />
      <div className="mt-[18px] grid gap-3.5 md:grid-cols-2">
        <Field label="E-pošta" value={values.email} error={errors.email} placeholder="janez@email.si" onChange={(value) => update("email", value)} />
        <Field label="Telefon" value={values.phone} error={errors.phone} placeholder="041 123 456" onChange={(value) => update("phone", value)} />
      </div>
      <div className="mt-[18px]">
        <span className="mb-[7px] block text-[13.5px] font-semibold text-[#3D3A47]">Vaša panoga</span>
        <Select value={values.panoga} onValueChange={(value) => update("panoga", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Izberite panogo" />
          </SelectTrigger>
          <SelectContent>
            {tradeOptions.map((trade) => (
              <SelectItem key={trade} value={trade}>
                {trade}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <label className="mt-[18px] block">
        <span className="mb-[7px] block text-[13.5px] font-semibold text-[#3D3A47]">
          Sporočilo <span className="font-medium text-[#A9A6B3]">(neobvezno)</span>
        </span>
        <textarea
          value={values.message}
          onChange={(event) => update("message", event.target.value)}
          rows={4}
          placeholder="Na kratko opišite, kaj potrebujete..."
          className="w-full resize-y rounded-[11px] border border-[#E1DEEC] bg-white px-[15px] py-[13px] font-sans text-[15px] leading-[1.5] text-[#16151D] outline-none transition-shadow focus:border-[#6A5AE0] focus:shadow-[0_0_0_3px_rgba(106,90,224,.12)]"
        />
      </label>
      <input
        type="text"
        name="website"
        value={values.website}
        onChange={(event) => update("website", event.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />
      <Button type="button" onClick={submit} disabled={pending} className="mt-6 w-full rounded-[13px] py-4 text-base">
        {pending ? (
          <>
            <Loader2 size={18} className="animate-spin" /> Pošiljam …
          </>
        ) : (
          "Rezerviraj brezplačen posvet"
        )}
      </Button>
      <div className="mt-3.5 text-center text-[12.5px] text-[#9A97A5]">20 minut · brez obveznosti · brez vezave</div>
    </div>
  );
}

function Field({
  label,
  value,
  error,
  placeholder,
  onChange,
  className,
}: {
  label: string;
  value: string;
  error?: string;
  placeholder: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-[7px] block text-[13.5px] font-semibold text-[#3D3A47]">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-[11px] border bg-white px-[15px] py-[13px] font-sans text-[15px] text-[#16151D] outline-none transition-shadow focus:border-[#6A5AE0] focus:shadow-[0_0_0_3px_rgba(106,90,224,.12)]",
          error ? "border-[#E8A0A0]" : "border-[#E1DEEC]",
        )}
      />
      {error ? <div className="mt-1.5 text-[12.5px] text-[#D14343]">{error}</div> : null}
    </label>
  );
}
