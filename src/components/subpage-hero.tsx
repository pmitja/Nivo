export function SubpageHero({
  badge,
  title,
  text,
  children,
}: {
  badge: string;
  title: React.ReactNode;
  text?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-[linear-gradient(180deg,#F3F0FF_0%,#FAF9FE_58%,#fff_100%)] px-5 pb-[56px] pt-[64px] text-center md:px-8 md:pt-[76px]">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full bg-[linear-gradient(90deg,rgba(106,90,224,.07)_1px,transparent_1px),linear-gradient(180deg,rgba(106,90,224,.05)_1px,transparent_1px)] bg-[size:96px_96px] [mask-image:linear-gradient(180deg,black,transparent_82%)]" />
      <div className="pointer-events-none absolute left-1/2 top-[-280px] -z-10 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(106,90,224,.15),rgba(106,90,224,0))]" />
      <div className="nv-enter relative mx-auto max-w-[820px]">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#E4E0F4] bg-white px-[13px] py-1.5 text-[13px] font-semibold text-[#56535F] shadow-[0_2px_8px_rgba(20,19,29,.05)]">
          <span className="h-[7px] w-[7px] rounded-full bg-[#6A5AE0]" />
          {badge}
        </div>
        <h1 className="mt-5 text-balance text-[40px] font-extrabold leading-[1.07] tracking-[-.035em] md:text-[54px]">
          {title}
        </h1>
        {text ? (
          <p className="mx-auto mt-5 max-w-[600px] text-[18px] leading-[1.58] text-[#54515E]">{text}</p>
        ) : null}
        {children}
      </div>
    </section>
  );
}

export function HeroHighlight({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-[14px] bg-[#E7E1FE] px-2.5 text-[#5A48D6] [-webkit-box-decoration-break:clone] [box-decoration-break:clone]">
      {children}
    </span>
  );
}
