"use client";

import { useActionState, useEffect } from "react";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { sendReviewRequestForLeadAction, type SendReviewRequestState } from "@/app/actions";
import { Button, type ButtonProps } from "@/components/ui/button";

export function SendReviewRequestButton({
  leadId,
  alreadySent = false,
  ...buttonProps
}: { leadId: string; alreadySent?: boolean } & ButtonProps) {
  const [state, formAction, isPending] = useActionState<SendReviewRequestState, FormData>(
    sendReviewRequestForLeadAction,
    null,
  );
  const sent = alreadySent || state?.ok === true;

  useEffect(() => {
    if (!state) return;
    if (state.ok) {
      toast.success(state.message);
    } else {
      toast.error(state.message);
    }
  }, [state]);

  if (sent) {
    return (
      <Button {...buttonProps} disabled>
        Request sent
      </Button>
    );
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="leadId" value={leadId} />
      <Button {...buttonProps} disabled={isPending || buttonProps.disabled}>
        {isPending ? (
          <>
            <LoaderCircle className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
            Sending...
          </>
        ) : "Send review request"}
      </Button>
    </form>
  );
}
