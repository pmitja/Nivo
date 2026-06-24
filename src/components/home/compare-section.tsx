import type { ReactNode } from "react";
import { Check, X } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/site-shell";
import { compareNew, compareOld } from "@/lib/site-data";

export function CompareSection() {
  return (
    <section className="bg-[#F7F8FC] px-5 py-24 md:px-8">
      <div className="mx-auto max-w-[1100px]">
        <div className="mx-auto max-w-[720px] text-center">
          <h2 className="text-[36px] font-extrabold leading-[1.12] md:text-[48px]">Iz nevidnega v prvo izbiro</h2>
          <p className="mt-4 text-[16.5px] leading-[1.6] text-[#54515E]">
            Vaše delo je vrhunsko. Tudi spletni nastop naj to pokaže.
          </p>
        </div>
        <div className="mx-auto mt-14 grid max-w-[920px] items-stretch gap-4 lg:grid-cols-[1.02fr_.98fr] lg:gap-0">
          <CompareCard
            title={
              <Logo
                className="justify-center"
                markClassName="h-7 w-7 rounded-[8px]"
                textClassName="text-[25px] md:text-[28px]"
              />
            }
            items={compareNew}
            accent
          />
          <CompareCard title="Brez sistema" items={compareOld} />
        </div>
      </div>
    </section>
  );
}

function CompareCard({ title, items, accent }: { title: ReactNode; items: string[]; accent?: boolean }) {
  return (
    <Card
      className={
        accent
          ? "relative z-10 rounded-[18px] border-[#D7D2F6] shadow-[0_28px_60px_rgba(28,26,44,.18)] lg:-mr-4 lg:-translate-y-1"
          : "rounded-[18px] border-[#EEF0F6] bg-white/72 shadow-[0_14px_38px_rgba(28,26,44,.06)] lg:my-2 lg:pl-8"
      }
    >
      <CardContent className="p-8 md:p-10">
        <h3 className="text-center text-[25px] font-extrabold leading-tight md:text-[28px]">{title}</h3>
        <div className="mx-auto mt-8 h-px max-w-[300px] bg-[#E9E8EE]" />
        <div className="mx-auto mt-3 max-w-[330px] divide-y divide-[#EEEFF4]">
          {items.map((item) => (
            <div key={item} className="flex min-h-[54px] items-center gap-3 py-3">
              <span
                className={`flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-[7px] text-xs ${
                  accent ? "bg-transparent text-[#20C36B]" : "bg-transparent text-[#E53935]"
                }`}
              >
                {accent ? <Check size={20} strokeWidth={2.8} /> : <X size={18} strokeWidth={2.7} />}
              </span>
              <span
                className={`text-[15.5px] leading-[1.45] ${
                  accent ? "font-semibold text-[#16151D]" : "font-medium text-[#77737F]"
                }`}
              >
                {item}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
