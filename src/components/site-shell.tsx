import Link from "next/link";

import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/mobile-nav";
import { Logo } from "@/components/logo";
import { SiteFooter } from "@/components/site-footer";
import { getCurrentUser } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { navLinks } from "@/lib/site-data";

export { Logo } from "@/components/logo";
export { Eyebrow, SectionHeading, CtaBand } from "@/components/site-primitives";

export async function SiteNav({ active }: { active?: string }) {
  const user = await getCurrentUser();
  const dashboardHref = user?.role === "super_admin" ? "/admin" : "/dashboard";

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
          <Link href={user ? dashboardHref : "/prijava"} className="hidden text-[14.5px] font-semibold text-[#16151D] no-underline sm:inline md:inline">
            {user ? "Sistem" : "Prijava"}
          </Link>
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/kontakt">Brezplačen posvet</Link>
          </Button>
          <MobileNav active={active} dashboardHref={user ? dashboardHref : null} />
        </div>
      </nav>
    </header>
  );
}

export function PageShell({ active, children }: { active?: string; children: React.ReactNode }) {
  return (
    <div className="marketing-page w-full overflow-x-clip bg-white">
      <SiteNav active={active} />
      {children}
      <SiteFooter />
    </div>
  );
}
