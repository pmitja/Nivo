"use client";

import { Minus, Plus } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FaqAccordion({ items, initial = 0 }: { items: { q: string; a: string }[]; initial?: number }) {
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={initial >= 0 ? `faq-${initial}` : undefined}
      className="mt-9 flex flex-col gap-3"
    >
      {items.map((item, index) => (
        <AccordionItem key={item.q} value={`faq-${index}`}>
          <AccordionTrigger
            icon={
              <span className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#EFEBFF] text-[#6A5AE0] transition-colors duration-200 group-data-[state=open]:bg-[#6A5AE0] group-data-[state=open]:text-white">
                <Plus
                  aria-hidden="true"
                  className="absolute left-1/2 top-1/2 h-[17px] w-[17px] -translate-x-1/2 -translate-y-1/2 opacity-100 transition-opacity duration-200 group-data-[state=open]:opacity-0"
                  strokeWidth={3}
                />
                <Minus
                  aria-hidden="true"
                  className="absolute left-1/2 top-1/2 h-[17px] w-[17px] -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-200 group-data-[state=open]:opacity-100"
                  strokeWidth={3}
                />
              </span>
            }
          >
            <span className="text-[16.5px] font-bold tracking-[-.01em]">{item.q}</span>
          </AccordionTrigger>
          <AccordionContent>{item.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
