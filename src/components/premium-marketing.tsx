import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { Button } from "@/components/ui/button";

export function MarketingHero({ eyebrow, title, highlight, text, secondary, children, locale = "sl" }: { eyebrow: string; title: string; highlight: string; text: string; secondary?: { label: string; href: string }; children?: React.ReactNode; locale?: "sl" | "en" }) {
  const english = locale === "en";
  return <section className="relative isolate overflow-hidden bg-[#F7F5FC] px-5 pb-20 pt-20 text-center md:px-8 md:pb-28 md:pt-28">
    <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(105,89,223,.18),transparent_42%)]" />
    <div className="absolute inset-0 -z-10 opacity-40 [background-image:linear-gradient(rgba(104,88,206,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(104,88,206,.08)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_75%)]" />
    <div className="nv-enter mx-auto max-w-[880px]">
      <div className="inline-flex rounded-full border border-[#DFDAF6] bg-white/80 px-3.5 py-2 text-[12px] font-extrabold uppercase tracking-[.1em] text-[#6654DB] shadow-sm">{eyebrow}</div>
      <h1 className="mt-7 text-balance text-[43px] font-extrabold leading-[1.04] tracking-[-.047em] sm:text-[56px] md:text-[68px]">{title} <span className="text-[#6654DB]">{highlight}</span></h1>
      <p className="mx-auto mt-6 max-w-[680px] text-pretty text-[17px] leading-[1.7] text-[#5D5967] md:text-[19px]">{text}</p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Button asChild size="lg"><Link href={english ? "/contact" : "/kontakt"}>{english ? "Book a free call" : "Brezplačen posvet"} <ArrowRight size={17} /></Link></Button>{secondary ? <Button asChild size="lg" variant="secondary"><Link href={secondary.href}>{secondary.label}</Link></Button> : null}</div>
      <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[12px] font-semibold text-[#7B7686]">{(english ? ["No contract", "We handle everything", "From $199 / month"] : ["Brez vezave", "Vse uredimo mi", "Od 99 € / mesec"]).map(x => <span key={x} className="flex items-center gap-1.5"><Check size={14} className="text-[#219A6B]" />{x}</span>)}</div>
    </div>
    {children ? <div className="nv-hero-video mx-auto mt-14 max-w-[1120px] text-left">{children}</div> : null}
  </section>
}

export function MarketingHeading({ eyebrow, title, text, align = "center" }: { eyebrow: string; title: string; text?: string; align?: "center" | "left" }) {
  return <div className={align === "center" ? "mx-auto max-w-[740px] text-center" : "max-w-[680px]"}><div className="text-[12px] font-extrabold uppercase tracking-[.13em] text-[#6654DB]">{eyebrow}</div><h2 className="mt-4 text-balance text-[35px] font-extrabold leading-[1.12] tracking-[-.038em] md:text-[49px]">{title}</h2>{text ? <p className="mt-5 text-[16px] leading-[1.75] text-[#66616E] md:text-[17px]">{text}</p> : null}</div>
}

export function BrowserFrame({ children, label = "app.obrtio.si" }: { children: React.ReactNode; label?: string }) {
  return <div className="overflow-hidden rounded-[20px] border border-white/70 bg-white shadow-[0_35px_90px_rgba(37,29,83,.19)] ring-1 ring-[#2F235F]/10"><div className="flex h-11 items-center gap-2 border-b border-[#EDEBF4] bg-[#F8F7FB] px-4"><span className="h-2.5 w-2.5 rounded-full bg-[#FF8B85]"/><span className="h-2.5 w-2.5 rounded-full bg-[#F4C86E]"/><span className="h-2.5 w-2.5 rounded-full bg-[#72C58D]"/><span className="mx-auto hidden rounded-md bg-white px-14 py-1 text-[10px] text-[#AAA6B5] shadow-sm sm:block">{label}</span></div>{children}</div>
}
