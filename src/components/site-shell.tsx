import Link from "next/link";

import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/mobile-nav";
import { Logo } from "@/components/logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { SiteFooter } from "@/components/site-footer";
import { cn } from "@/lib/utils";
import { navLinks } from "@/lib/site-data";

export { Logo } from "@/components/logo";
export { Eyebrow, SectionHeading, CtaBand } from "@/components/site-primitives";

const englishNavLinks = [
  { label: "Services", href: "/services", key: "storitve" },
  { label: "How it works", href: "/how-it-works", key: "kako" },
  { label: "Pricing", href: "/pricing", key: "cenik" },
  { label: "Contractors", href: "/contractors", key: "izvajalci" },
  { label: "Contact", href: "/contact", key: "kontakt" },
];

export function SiteNav({ active, locale = "sl" }: { active?: string; locale?: "sl" | "en" }) {
  const links = locale === "en" ? englishNavLinks : navLinks;
  return (
    <header className="relative sticky top-0 z-50 border-b border-[#ECEAF3] bg-white/80 backdrop-blur-[10px] backdrop-saturate-150">
      <nav className="mx-auto flex max-w-[1200px] items-center justify-between gap-6 px-5 py-4 md:px-8">
        <Link href={locale === "en" ? "/" : "/sl"} aria-label={locale === "en" ? "Obrtio home" : "Obrtio domov"}>
          <Logo className="h-8 w-[128px]" />
        </Link>
        <div className="hidden items-center gap-[30px] md:flex">
          {links.map((link) => (
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
          <LanguageSwitcher locale={locale} englishHref="/" slovenianHref="/sl" />
          <Link href="/prijava" className="hidden text-[14.5px] font-semibold text-[#16151D] no-underline sm:inline md:inline">
            {locale === "en" ? "Log in" : "Prijava"}
          </Link>
          <Button asChild size="sm" className="hidden md:inline-flex">
            <Link href={locale === "en" ? "/contact" : "/kontakt"}>{locale === "en" ? "Book a free call" : "Brezplačen posvet"}</Link>
          </Button>
          <MobileNav active={active} dashboardHref={null} locale={locale} />
        </div>
      </nav>
    </header>
  );
}

export function PageShell({ active, children, locale = "sl" }: { active?: string; children: React.ReactNode; locale?: "sl" | "en" }) {
  return (
    <div lang={locale} className="marketing-page w-full overflow-x-clip bg-white">
      <SiteNav active={active} locale={locale} />
      {children}
      <SiteFooter locale={locale} />
    </div>
  );
}
