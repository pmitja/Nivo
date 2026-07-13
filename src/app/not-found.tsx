import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Home, SearchX } from "lucide-react";

import { PageShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Stran ni najdena",
  description: "Iskana stran ne obstaja ali je bila odstranjena.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <PageShell>
      <main className="relative isolate min-h-[68vh] overflow-hidden bg-[#F7F5FC] px-5 py-20 md:px-8 md:py-28">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(102,84,219,.18),transparent_42%)]" />
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-35 [background-image:linear-gradient(rgba(104,88,206,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(104,88,206,.08)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />

        <section className="mx-auto grid max-w-[980px] items-center gap-12 lg:grid-cols-[1fr_.8fr]">
          <div className="text-center lg:text-left">
            <div className="text-[12px] font-extrabold uppercase tracking-[.13em] text-[#6654DB]">Napaka 404</div>
            <h1 className="mt-5 text-balance text-[42px] font-extrabold leading-[1.06] tracking-[-.045em] text-[#17141F] sm:text-[54px] md:text-[64px]">
              Te strani ni več tukaj.
            </h1>
            <p className="mx-auto mt-6 max-w-[580px] text-[17px] leading-[1.7] text-[#625E6A] lg:mx-0">
              Povezava je morda zastarela ali pa je bila stran odstranjena. Na domači strani boste hitro našli vse o sistemu Obrtio.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/">
                  <Home size={17} /> Nazaj na domačo stran
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
                <Link href="/kontakt">
                  Potrebujete pomoč? <ArrowRight size={17} />
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[360px]">
            <div className="absolute -inset-8 -z-10 rounded-full bg-[#6654DB]/15 blur-3xl" />
            <div className="rounded-[30px] border border-white/80 bg-white/90 p-8 text-center shadow-[0_30px_80px_rgba(57,43,113,.16)] backdrop-blur sm:p-10">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-[20px] bg-[#EEEAFE] text-[#6654DB]">
                <SearchX size={30} strokeWidth={2.2} />
              </span>
              <div className="mt-7 text-[72px] font-extrabold leading-none tracking-[-.07em] text-[#17141F] sm:text-[88px]">404</div>
              <div className="mt-3 text-sm font-bold text-[#777280]">Stran ni bila najdena</div>
            </div>
          </div>
        </section>
      </main>
    </PageShell>
  );
}
