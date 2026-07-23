const stats = [
  { value: "7–10 dni", label: "do delujočega sistema" },
  { value: "99 €", label: "na mesec, brez vezave" },
  { value: "$0", label: "začetnih stroškov" },
  { value: "24/7", label: "sistem sprejema povpraševanja" },
];

export function StatsBand() {
  return (
    <section className="bg-white px-5 pb-6 md:px-8">
      <div className="relative mx-auto max-w-[1100px] overflow-hidden rounded-[24px] bg-[#16151D] px-6 py-10 text-white md:px-12">
        <div className="pointer-events-none absolute left-1/2 top-[-140px] h-[280px] w-[560px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(140,123,240,.28),rgba(140,123,240,0))]" />
        <div className="relative grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.value}>
              <div className="text-[34px] font-extrabold tracking-[-.03em] md:text-[38px]">{stat.value}</div>
              <div className="mt-1.5 text-[13.5px] font-semibold text-[#A5A2B4]">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
