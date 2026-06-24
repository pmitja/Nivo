import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/mobile-nav";
import { Logo } from "@/components/logo";
import { SiteFooter } from "@/components/site-footer";
import { cn } from "@/lib/utils";
import { navLinks } from "@/lib/site-data";

export { Logo } from "@/components/logo";

export function SiteNav({ active }: { active?: string }) {
  return (
    <header className="relative sticky top-0 z-50 border-b border-[#ECEAF3] bg-white/80 backdrop-blur-[10px] backdrop-saturate-150">
      <nav className="mx-auto flex max-w-[1200px] items-center justify-between gap-6 px-5 py-4 md:px-8">
        <Link href="/" aria-label="Nivo domov">
          <Logo />
        </Link>
        <div className="hidden items-center gap-[30px] md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className={cn(
                "text-[14.5px] font-medium text-[#56535F] no-underline transition-colors hover:text-[#16151D]",
                active === link.key && "font-bold text-[#6A5AE0]",
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3.5">
          <Link href="/kontakt" className="hidden text-[14.5px] font-semibold text-[#16151D] no-underline sm:inline md:inline">
            Prijava
          </Link>
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/kontakt">Brezplačen posvet</Link>
          </Button>
          <MobileNav active={active} />
        </div>
      </nav>
    </header>
  );
}

export function PageShell({ active, children }: { active?: string; children: React.ReactNode }) {
  return (
    <div className="w-full overflow-x-clip bg-white">
      <SiteNav active={active} />
      {children}
      <SiteFooter />
    </div>
  );
}

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
}: {
  title: string;
  text: string;
  dark?: boolean;
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
            <Link href="/kontakt">
              Rezerviraj brezplačen posvet <ArrowRight size={17} />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
