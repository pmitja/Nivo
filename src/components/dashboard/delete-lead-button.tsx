"use client";

import { useActionState, useEffect, useState } from "react";
import { LoaderCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteLeadAction, type DeleteLeadState } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function DeleteLeadButton({ leadId, leadName }: { leadId: string; leadName: string }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState<DeleteLeadState, FormData>(deleteLeadAction, null);
  // Po uspešnem brisanju se pogovorno okno zapre samo, brez setState v efektu.
  const deleted = state?.ok === true;

  useEffect(() => {
    if (!state) return;

    if (state.ok) {
      toast.success(state.message);
    } else {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <Dialog open={open && !deleted} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="secondary"
          className="border-[#F2D4D1] text-[#B42318] hover:border-[#E4A9A3] hover:text-[#912018]"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Izbriši
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Izbriši povpraševanje?</DialogTitle>
          <DialogDescription>
            Povpraševanje stranke {leadName} bo trajno izbrisano, skupaj z zgodovino statusov. Tega dejanja ni mogoče
            razveljaviti.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="flex flex-wrap justify-end gap-2 p-4 pt-0">
          <input type="hidden" name="leadId" value={leadId} />
          <Button type="button" size="sm" variant="secondary" onClick={() => setOpen(false)} disabled={isPending}>
            Prekliči
          </Button>
          <Button
            type="submit"
            size="sm"
            className="bg-[#B42318] shadow-[0_10px_26px_rgba(180,35,24,.28)] hover:bg-[#912018]"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
                Brišem...
              </>
            ) : (
              "Da, izbriši"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
