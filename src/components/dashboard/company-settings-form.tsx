"use client";

import { useActionState, useEffect } from "react";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { updateClientCompanySettingsAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CompanySettingsFormProps = {
  company: {
    contactName: string;
    email: string;
    phone: string;
    address: string | null;
    city: string | null;
    googleReviewUrl: string | null;
  };
};

const initialState = { message: "", ok: false };

export function CompanySettingsForm({ company }: CompanySettingsFormProps) {
  const [state, formAction, pending] = useActionState(updateClientCompanySettingsAction, initialState);

  useEffect(() => {
    if (!state.message) return;
    if (state.ok) toast.success(state.message);
    else toast.error(state.message);
  }, [state]);

  return (
    <form action={formAction} className="grid gap-4">
      <div className="grid gap-3 md:grid-cols-2">
        <Field id="settings-contact-name" label="Kontaktna oseba">
          <Input id="settings-contact-name" name="contactName" required defaultValue={company.contactName} />
        </Field>
        <Field id="settings-email" label="Email">
          <Input id="settings-email" name="email" required type="email" defaultValue={company.email} />
        </Field>
        <Field id="settings-phone" label="Telefon">
          <Input id="settings-phone" name="phone" required defaultValue={company.phone} />
        </Field>
        <Field id="settings-city" label="Kraj">
          <Input id="settings-city" name="city" defaultValue={company.city ?? ""} />
        </Field>
        <Field id="settings-address" label="Naslov">
          <Input id="settings-address" name="address" defaultValue={company.address ?? ""} />
        </Field>
        <Field id="settings-review-url" label="Google review povezava">
          <Input id="settings-review-url" name="googleReviewUrl" defaultValue={company.googleReviewUrl ?? ""} placeholder="https://..." />
        </Field>
      </div>
      {state.message ? (
        <div className={state.ok ? "text-sm font-bold text-[#167E53]" : "text-sm font-bold text-[#B42318]"}>
          {state.message}
        </div>
      ) : null}
      <Button disabled={pending} aria-live="polite">
        {pending ? (
          <>
            <LoaderCircle className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
            Shranjujem...
          </>
        ) : "Shrani podatke"}
      </Button>
    </form>
  );
}

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}
