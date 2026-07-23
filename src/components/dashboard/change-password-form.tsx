"use client";

import { useActionState, useEffect, useRef } from "react";
import { LoaderCircle, LockKeyhole } from "lucide-react";
import { toast } from "sonner";
import { changePasswordAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ChangePasswordForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(changePasswordAction, { message: "", ok: false });

  useEffect(() => {
    if (state.message) {
      if (state.ok) toast.success(state.message);
      else toast.error(state.message);
    }
    if (state.ok) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={action} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="currentPassword">Current password</Label>
        <Input id="currentPassword" name="currentPassword" type="password" autoComplete="current-password" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="newPassword">New password</Label>
        <Input id="newPassword" name="newPassword" type="password" autoComplete="new-password" required minLength={10} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="confirmPassword">Confirm new password</Label>
        <Input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" required minLength={10} />
      </div>

      {state.message ? (
        <p className={`rounded-[12px] px-4 py-3 text-sm font-bold ${state.ok ? "bg-[#EEFDF5] text-[#167E53]" : "bg-[#FFF5F5] text-[#9B2C2C]"}`}>
          {state.message}
        </p>
      ) : null}

      <Button type="submit" disabled={pending} className="justify-self-start">
        {pending ? (
          <LoaderCircle className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
        ) : (
          <LockKeyhole className="h-4 w-4" />
        )}
        {pending ? "Saving..." : "Change password"}
      </Button>
    </form>
  );
}
