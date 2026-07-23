import Link from "next/link";

import { LanguageSwitcher } from "@/components/language-switcher";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { LEGAL_NAME } from "@/lib/seo";

const links = [
  ["Services", "/services"],
  ["How it works", "/how-it-works"],
  ["Pricing", "/pricing"],
  ["Contractors", "/contractors"],
  ["Contact", "/contact"],
] as const;

export function EnglishSiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div lang="en" className="marketing-page w-full overflow-x-clip bg-white">
      <header className="sticky top-0 z-50 border-b border-[#ECEAF3] bg-white/90 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-[1200px] items-center justify-between gap-5 px-5 py-4 md:px-8">
          <Link href="/" aria-label="Obrtio home">
            <Logo className="h-8 w-[128px]" />
          </Link>
          <div className="hidden items-center gap-7 lg:flex">
            {links.map(([label, href]) => (
              <Link key={href} href={href} className="text-sm font-semibold text-[#5D5967] transition-colors hover:text-[#16151D]">
                {label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher locale="en" />
            <Link href="/prijava" className="hidden text-sm font-semibold text-[#16151D] xl:inline">Log in</Link>
            <Button asChild size="sm" className="hidden md:inline-flex"><Link href="/contact">Book a free call</Link></Button>
          </div>
        </nav>
      </header>
      {children}
      <footer className="bg-[#0F0E15] px-5 py-12 text-white md:px-8">
        <div className="mx-auto flex max-w-[1200px] flex-col justify-between gap-8 md:flex-row">
          <div>
            <Logo className="h-8 w-[128px]" dark />
            <p className="mt-4 max-w-[360px] text-sm leading-6 text-[#9D9AAB]">You do the work. We bring the customers. One simple system for home-service businesses.</p>
          </div>
          <div className="grid grid-cols-2 gap-x-10 gap-y-3 text-sm">
            {links.map(([label, href]) => <Link key={href} href={href} className="text-[#B7B3C1] hover:text-white">{label}</Link>)}
          </div>
        </div>
        <div className="mx-auto mt-10 flex max-w-[1200px] flex-wrap justify-between gap-3 border-t border-white/10 pt-6 text-xs text-[#76737F]">
          <span>© 2026 {LEGAL_NAME}. Obrtio.</span>
          <span>No contract · Cancel anytime</span>
        </div>
      </footer>
    </div>
  );
}
