import { SectionHeading } from "@/components/site-primitives";
import { steps } from "@/lib/site-data";

export function StepsSection() {
  return (
    <section className="bg-white px-5 py-24 md:px-8">
      <div className="mx-auto max-w-[1100px]">
        <SectionHeading
          eyebrow="Kako deluje"
          title="Do delujočega sistema v treh korakih"
          text="Vse postavimo namesto vas, vi pa dobite jasen sistem za odziv na povpraševanja."
        />
        <div className="mt-14 grid items-stretch gap-6 lg:grid-cols-[1fr_1.05fr]">
          <StepsVisual />
          <div className="flex flex-col justify-center gap-4">
            {steps.map((step, i) => (
              <div
                key={step.num}
                className="flex items-start gap-5 rounded-[20px] border border-[#ECEAF3] bg-[#FBFAFF] p-6 transition-all duration-200 hover:border-[#CFC9F8] hover:bg-white hover:shadow-[0_18px_44px_rgba(106,90,224,.10)]"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[13px] bg-[#6A5AE0] text-[15px] font-extrabold text-white shadow-[0_8px_18px_rgba(106,90,224,.28)]">
                  0{i + 1}
                </span>
                <div>
                  <h3 className="text-[18px] font-bold tracking-[-.01em]">{step.title}</h3>
                  <p className="mt-1.5 text-[14.5px] leading-[1.55] text-[#6A6775]">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StepsVisual() {
  return (
    <div className="relative overflow-hidden rounded-[24px] bg-[linear-gradient(160deg,#6A5AE0,#4B3BC9)] p-7 md:p-9">
      <div className="pointer-events-none absolute right-[-70px] top-[-90px] h-64 w-64 rounded-full bg-white/10" />
      <div className="relative">
        <div className="text-[12px] font-bold uppercase tracking-[.06em] text-white/70">Vaš sistem</div>
        <div className="mt-1.5 text-[22px] font-extrabold leading-[1.2] tracking-[-.02em] text-white">
          Pripravljen v 7–10 dneh
        </div>

        <div className="mt-6 overflow-hidden rounded-[16px] bg-white shadow-[0_24px_56px_rgba(22,21,29,.24)]">
          <div className="flex items-center gap-1.5 border-b border-[#ECEAF3] bg-[#F6F5FA] px-3.5 py-2.5">
            <span className="h-2 w-2 rounded-full bg-[#E5867E]" />
            <span className="h-2 w-2 rounded-full bg-[#E8C16B]" />
            <span className="h-2 w-2 rounded-full bg-[#7FC08C]" />
            <div className="ml-2 flex-1 rounded-[6px] border border-[#E4E2EC] bg-white px-2.5 py-1 font-mono text-[10.5px] text-[#8C8898]">
              vase-podjetje.si
            </div>
          </div>
          <div className="p-4">
            <div className="h-3 w-2/3 rounded-full bg-[#E7E1FE]" />
            <div className="mt-2.5 h-2 w-full rounded-full bg-[#F1EFF8]" />
            <div className="mt-1.5 h-2 w-4/5 rounded-full bg-[#F1EFF8]" />
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              <div className="rounded-[10px] border border-[#ECEAF3] bg-[#FBFAFF] p-2.5">
                <div className="text-[10px] font-bold uppercase tracking-[.04em] text-[#9A97A5]">Povpraševanja</div>
                <div className="mt-1 text-[19px] font-extrabold tracking-[-.02em] text-[#16151D]">12</div>
              </div>
              <div className="rounded-[10px] border border-[#ECEAF3] bg-[#FBFAFF] p-2.5">
                <div className="text-[10px] font-bold uppercase tracking-[.04em] text-[#9A97A5]">Google ocena</div>
                <div className="mt-1 text-[19px] font-extrabold tracking-[-.02em] text-[#16151D]">4,9 ★</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3 rounded-[14px] bg-white/10 px-4 py-3 text-white backdrop-blur">
          <span className="nv-pulse h-2 w-2 shrink-0 rounded-full bg-[#7BE2B0]" />
          <span className="text-[13px] font-semibold">Novo povpraševanje pravkar prejeto — SMS poslan</span>
        </div>
      </div>
    </div>
  );
}
