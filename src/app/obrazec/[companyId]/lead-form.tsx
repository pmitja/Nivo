"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function PublicLeadForm({ companyId }: { companyId: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyId,
        name: formData.get("name"),
        phone: formData.get("phone"),
        email: formData.get("email"),
        location: formData.get("location"),
        service: formData.get("service"),
        message: formData.get("message"),
        privacyConsent: formData.get("privacyConsent") === "on",
        marketingConsent: formData.get("marketingConsent") === "on",
      }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setStatus("error");
      setMessage(data?.message ?? "Povpraševanja trenutno ni bilo mogoče poslati.");
      return;
    }

    event.currentTarget.reset();
    setStatus("sent");
    setMessage("Hvala za povpraševanje. Prejeli smo vaše sporočilo in se vam javimo v najkrajšem možnem času.");
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Field name="name" label="Ime in priimek" required />
        <Field name="phone" label="Telefon" required />
        <Field name="email" label="Email" type="email" />
        <Field name="location" label="Lokacija" />
      </div>
      <Field name="service" label="Kaj potrebujete?" required />
      <div className="grid gap-2">
        <Label htmlFor="message">Sporočilo</Label>
        <Textarea
          id="message"
          name="message"
          required
          minLength={10}
          className="min-h-36 text-[15px]"
          placeholder="Na kratko opišite, kaj želite urediti."
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
        {status === "sending" ? "Pošiljam..." : "Pošlji povpraševanje"}
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
