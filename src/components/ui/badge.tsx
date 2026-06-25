import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-[999px] px-2.5 py-1 text-xs font-extrabold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[#F1EFF8] text-[#5C55B8]",
        success: "bg-[#EEFDF5] text-[#167E53]",
        warning: "bg-[#FFF7E8] text-[#A75B00]",
        danger: "bg-[#FFF1F0] text-[#B42318]",
        outline: "border border-[#E2DFEA] bg-white text-[#5F5B68]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({ className, variant, ...props }: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
