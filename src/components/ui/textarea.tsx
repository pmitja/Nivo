import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "flex min-h-24 w-full rounded-[12px] border border-[#E2DFEA] bg-white px-3 py-3 text-sm font-semibold text-[#16151D] shadow-sm transition-colors",
        "placeholder:text-[#A9A6B3]",
        "focus-visible:border-[#6A5AE0] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6A5AE0]/10",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
