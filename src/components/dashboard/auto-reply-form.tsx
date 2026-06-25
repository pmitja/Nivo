"use client";

import { useActionState } from "react";
import { Save } from "lucide-react";
import { updateAutoReplyMessageAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { defaultCustomerAutoReply } from "@/lib/sms-copy";

export function AutoReplyForm({ initialMessage }: { initialMessage?: string | null }) {
  const [state, action, pending] = useActionState(updateAutoReplyMessageAction, { ok: false, message: "" });

  return (
    <form action={action} className="grid gap-3">
      <div className="grid gap-2">
        <Label htmlFor="autoReplyMessage">Avtomatski SMS odgovor stranki</Label>
        <Textarea
          id="autoReplyMessage"
          name="autoReplyMessage"
          required
          minLength={20}
          maxLength={480}
          defaultValue={initialMessage || defaultCustomerAutoReply}
          className="min-h-28"
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-semibold leading-5 text-[#777382]">
          To sporočilo se pošlje stranki takoj po oddaji povpraševanja.
        </p>
        <Button type="submit" disabled={pending} size="sm">
          <Save className="h-4 w-4" />
          {pending ? "Shranjujem..." : "Shrani"}
        </Button>
      </div>
      {state.message ? (
        <p className={`rounded-[12px] px-4 py-3 text-sm font-bold ${state.ok ? "bg-[#EEFDF5] text-[#167E53]" : "bg-[#FFF5F5] text-[#9B2C2C]"}`}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
