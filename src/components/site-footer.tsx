import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

function FooterColumn({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <div className="mb-3.5 text-[13px] font-bold text-white">{title}</div>
      <div className="flex flex-col gap-2.5">
        {links.map(([label, href]) => (
          <Link key={label} href={href} className="text-sm text-[#9D9AAB] no-underline transition-colors hover:text-white">
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-[#0F0E15] px-5 py-16 pb-8 text-white md:px-8">
      <div className="mx-auto grid max-w-[1200px] gap-10 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Link href="/" aria-label="Obrtio domov">
            <Logo className="h-8 w-[128px]" dark />
          </Link>
          <p className="mt-4 max-w-[280px] text-[14.5px] leading-[1.6] text-[#9D9AAB]">
            Vi opravljate delo. Mi poskrbimo za stranke. Sistem za rast gradbenih in obrtniških podjetij.
          </p>
        </div>
        <FooterColumn
          title="Storitve"
          links={[
            ["Spletna stran", "/storitve"],
            ["SMS sistem", "/storitve"],
            ["Google ocene", "/storitve"],
            ["AI pomočnik", "/storitve"],
          ]}
        />
        <FooterColumn
          title="Podjetje"
          links={[
            ["Kako deluje", "/kako-deluje"],
            ["Cenik", "/cenik"],
            ["Imenik izvajalcev", "/izvajalci"],
            ["Kontakt", "/kontakt"],
          ]}
        />
        <div>
          <div className="mb-3.5 text-[13px] font-bold text-white">Začnite danes</div>
          <p className="mb-3.5 text-sm leading-[1.55] text-[#9D9AAB]">Rezervirajte 20-minutni brezplačen posvet.</p>
          <Button asChild size="sm">
            <Link href="/kontakt">Brezplačen posvet</Link>
          </Button>
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-[1200px] flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6">
        <div className="text-[13px] text-[#76737F]">© 2026 Obrtio. Vse pravice pridržane.</div>
        <div className="text-[13px] text-[#76737F]">Brez vezave · Prekinitev kadarkoli</div>
      </div>
    </footer>
  );
}
