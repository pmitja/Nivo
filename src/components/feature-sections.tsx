import Link from "next/link";
import { Check, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function FeatureGrid({
  items,
  columns = "three",
}: {
  items: { icon?: string; title: string; desc: string }[];
  columns?: "three" | "four";
}) {
  return (
    <div
      className={cn(
        "mt-12 grid gap-4",
        columns === "four" ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-3",
      )}
    >
      {items.map((item) => (
        <Card
          key={item.title}
          className="transition-all duration-200 hover:-translate-y-0.5 hover:border-[#6A5AE0] hover:shadow-[0_14px_34px_rgba(106,90,224,.12)]"
        >
          <CardContent className="p-6">
            {item.icon ? (
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EFEBFF] text-lg font-extrabold text-[#6A5AE0]">
                {item.icon}
              </div>
            ) : null}
            <h3 className="mt-4 text-[17px] font-bold tracking-[-.01em]">{item.title}</h3>
            <p className="mt-2 text-sm leading-[1.55] text-[#6A6775]">{item.desc}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function CheckList({ items, dark = false }: { items: string[]; dark?: boolean }) {
  return (
    <div className="mt-6 flex flex-col gap-3">
      {items.map((item) => (
        <div key={item} className="flex items-center gap-3">
          <span
            className={cn(
              "flex h-6 w-6 shrink-0 items-center justify-center rounded-[7px] text-xs",
              dark ? "bg-[#8C7BF0]/20 text-[#A99BF5]" : "bg-[#6A5AE0] text-white",
            )}
          >
            <Check size={13} strokeWidth={3} />
          </span>
          <span className={cn("text-[15px] font-semibold", dark ? "text-[#E7E6EC]" : "text-[#28262F]")}>
            {item}
          </span>
        </div>
      ))}
    </div>
  );
}

export function PhonePair({
  contractorLabel = "Vi prejmete",
  customerLabel = "Stranka prejme",
}: {
  contractorLabel?: string;
  customerLabel?: string;
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <PhoneCard label={contractorLabel} side="left" />
      <PhoneCard label={customerLabel} side="right" />
    </div>
  );
}

function PhoneCard({ label, side }: { label: string; side: "left" | "right" }) {
  const isRight = side === "right";
  return (
    <div className="rounded-[22px] border border-[#ECEAF3] bg-white px-4 py-[18px] shadow-[0_20px_48px_rgba(20,19,29,.10)]">
      <div className="text-xs font-bold uppercase tracking-[.04em] text-[#9A97A5]">{label}</div>
      <div className="mt-3.5 flex flex-col gap-2">
        <div
          className={cn(
            "max-w-[94%] rounded-[14px] px-[13px] py-[11px] text-[13px] font-semibold leading-[1.45]",
            isRight
              ? "self-end rounded-br bg-[#6A5AE0] text-white"
              : "self-start rounded-bl bg-[#F1EFF8] text-[#16151D]",
          )}
        >
          {isRight
            ? "Hvala za povpraševanje. Prejeli smo vaše sporočilo in se vam oglasimo takoj, ko bo mogoče."
            : "Novo povpraševanje: Janez Novak"}
        </div>
        {!isRight ? (
          <div className="max-w-[94%] self-start rounded-[14px] bg-[#F1EFF8] px-[13px] py-2.5 text-[12.5px] leading-[1.45] text-[#54515E]">
            Obnova kopalnice · Maribor · 041 000 000
          </div>
        ) : null}
        <div className={cn("text-[11px] text-[#A9A6B3]", isRight ? "self-end" : "self-start")}>
          {isRight ? "Nivo · samodejno ✓✓" : "zdaj"}
        </div>
      </div>
    </div>
  );
}

export function BrowserMockup({ label }: { label: string }) {
  return (
    <div className="overflow-hidden rounded-[14px] border border-[#E4E2EC] bg-white shadow-[0_24px_60px_rgba(20,19,29,.14)]">
      <div className="flex items-center gap-[7px] border-b border-[#ECEAF3] bg-[#F6F5FA] px-4 py-3">
        <span className="h-[11px] w-[11px] rounded-full bg-[#E5867E]" />
        <span className="h-[11px] w-[11px] rounded-full bg-[#E8C16B]" />
        <span className="h-[11px] w-[11px] rounded-full bg-[#7FC08C]" />
        <div className="ml-2.5 flex-1 rounded-[7px] border border-[#E4E2EC] bg-white px-3 py-1.5 font-mono text-xs text-[#8C8898]">
          krovstvo-novak.si
        </div>
      </div>
      <div className="flex aspect-video items-center justify-center bg-[repeating-linear-gradient(135deg,#ECEAF5,#ECEAF5_11px,#F4F3FA_11px,#F4F3FA_22px)]">
        <span className="rounded-lg bg-white px-3 py-1.5 font-mono text-xs text-[#8C8898] shadow-[0_4px_14px_rgba(0,0,0,.06)]">
          {label}
        </span>
      </div>
    </div>
  );
}

export function PlayButtonLink() {
  return (
    <Button asChild variant="secondary">
      <Link href="/kako-deluje">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EFEBFF] text-[#6A5AE0]">
          <Play size={10} fill="currentColor" />
        </span>
        Poglej, kako deluje
      </Link>
    </Button>
  );
}
