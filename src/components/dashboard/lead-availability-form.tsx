"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarOff, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import {
  updateLeadAvailabilityAction,
  type LeadAvailabilityState,
} from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const initialState: LeadAvailabilityState = { message: "", ok: false };

export function LeadAvailabilityForm({
  acceptingLeads,
  pauseReason,
}: {
  acceptingLeads: boolean;
  pauseReason: "vacation" | "capacity" | null;
}) {
  const router = useRouter();
  const [paused, setPaused] = useState(!acceptingLeads);
  const [state, formAction, pending] = useActionState(updateLeadAvailabilityAction, initialState);

  useEffect(() => {
    if (!state.message) return;

    if (state.ok) {
      toast.success(state.message);
      router.refresh();
    } else {
      toast.error(state.message);
    }
  }, [router, state]);

  return (
    <form action={formAction} className="grid gap-4">
      <label
        htmlFor="pause-leads"
        className="flex min-h-14 cursor-pointer items-start gap-3 rounded-xl border border-[#E3E4E8] bg-[#FAFAFB] p-3.5 transition hover:border-[#D3CEE9]"
      >
        <Checkbox
          id="pause-leads"
          name="pauseLeads"
          checked={paused}
          onCheckedChange={(checked) => setPaused(checked === true)}
          className="mt-0.5 h-5 w-5"
        />
        <span>
          <span className="block text-sm font-bold text-[#24262B]">Trenutno ne sprejemamo novih povpraševanj</span>
          <span className="mt-1 block text-xs leading-5 text-[#777A83]">
            Povpraševanja se še vedno shranijo, vendar se SMS-i ne pošljejo.
          </span>
        </span>
      </label>

      {paused ? (
        <div className="grid gap-2">
          <Label htmlFor="pause-reason">Razlog</Label>
          <Select name="pauseReason" defaultValue={pauseReason ?? "vacation"}>
            <SelectTrigger id="pause-reason" className="min-h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vacation">Dopust ali odsotnost</SelectItem>
              <SelectItem value="capacity">Trenutno smo polni</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs leading-5 text-[#777A83]">
            Ta razlog bo jasno naveden v e-pošti pošiljatelju in na shranjenem povpraševanju.
          </p>
        </div>
      ) : (
        <div className="flex items-start gap-3 rounded-xl bg-[#EEF9F4] p-3.5 text-sm text-[#176B4C]">
          <CalendarOff className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p className="font-semibold leading-5">Povpraševanja sprejemate normalno, vključno z SMS obvestili.</p>
        </div>
      )}

      <Button type="submit" size="sm" disabled={pending} className="w-full sm:w-fit">
        {pending ? (
          <>
            <LoaderCircle className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
            Shranjujem...
          </>
        ) : "Shrani nastavitev"}
      </Button>
    </form>
  );
}
