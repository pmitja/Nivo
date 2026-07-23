import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("text-[13px] font-bold uppercase tracking-[.08em] text-[#6A5AE0]", className)}>
      {children}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  text,
  dark,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  text?: string;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto max-w-[680px] text-center", className)}>
      {eyebrow ? <Eyebrow className={dark ? "text-[#8C7BF0]" : undefined}>{eyebrow}</Eyebrow> : null}
      <h2
        className={cn(
          "mt-3.5 text-[34px] font-extrabold leading-[1.12] tracking-[-.03em] text-balance md:text-[44px]",
          dark && "text-white",
        )}
      >
        {title}
      </h2>
      {text ? (
        <p className={cn("mt-4 text-[17px] leading-[1.55] text-[#54515E]", dark && "text-[#B6B3C2]")}>{text}</p>
      ) : null}
    </div>
  );
}

export function CtaBand({
  title,
  text,
  dark,
  locale = "sl",
}: {
  title: string;
  text: string;
  dark?: boolean;
  locale?: "sl" | "en";
}) {
  return (
    <section className={cn("bg-white px-5 py-20 md:px-8", dark && "bg-[#FBFAFF]")}>
      <div
        className={cn(
          "relative mx-auto max-w-[1100px] overflow-hidden rounded-[28px] px-6 py-16 text-center text-white md:px-12",
          dark ? "bg-[#16151D]" : "bg-[linear-gradient(160deg,#6A5AE0,#4B3BC9)]",
        )}
      >
        <div className="pointer-events-none absolute left-1/2 top-[-100px] h-[340px] w-[560px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,.12),rgba(255,255,255,0)_70%)]" />
        <div className="relative">
          <h2 className="text-balance text-[36px] font-extrabold leading-[1.1] tracking-[-.03em] md:text-[42px]">
            {title}
          </h2>
          <p className="mx-auto mt-[18px] max-w-[540px] text-lg leading-[1.55] text-white/85">{text}</p>
          <Button asChild variant={dark ? "default" : "inverse"} size="lg" className="mt-[30px]">
            <Link href={locale === "en" ? "/contact" : "/kontakt"}>
              {locale === "en" ? "Book a free call" : "Rezerviraj brezplačen posvet"} <ArrowRight size={17} />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
