"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-[12px] text-[15.5px] font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6A5AE0]/15 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[#6A5AE0] text-white shadow-[0_10px_26px_rgba(106,90,224,.32)] hover:-translate-y-0.5 hover:bg-[#4B3BC9]",
        secondary:
          "border border-[#E4E2EC] bg-white text-[#16151D] hover:border-[#C9C5D8]",
        inverse:
          "bg-white text-[#16151D] shadow-[0_18px_40px_rgba(0,0,0,.22)] hover:-translate-y-0.5",
        link: "bg-transparent p-0 text-[#6A5AE0] shadow-none hover:gap-3",
      },
      size: {
        default: "h-auto px-6 py-[15px]",
        sm: "h-auto rounded-[10px] px-[18px] py-[10px] text-[14.5px] font-semibold",
        lg: "h-auto rounded-[14px] px-8 py-[17px] text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
