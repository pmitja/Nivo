"use client";

import { LoaderCircle } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button, type ButtonProps } from "@/components/ui/button";

type SubmitButtonProps = Omit<ButtonProps, "asChild" | "type"> & {
  pendingText?: string;
};

export function SubmitButton({
  children,
  disabled,
  pendingText = "Shranjujem...",
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      {...props}
      type="submit"
      disabled={pending || disabled}
      aria-disabled={pending || disabled}
      aria-live="polite"
    >
      {pending ? (
        <>
          <LoaderCircle className="h-4 w-4 shrink-0 animate-spin motion-reduce:animate-none" aria-hidden="true" />
          <span>{pendingText}</span>
        </>
      ) : children}
    </Button>
  );
}
