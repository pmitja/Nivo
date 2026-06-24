export function ServiceVisual({
  variant,
  compact = false,
}: {
  variant: string;
  compact?: boolean;
}) {
  const baseClass = compact
    ? "relative h-[76px] w-[120px] shrink-0 overflow-hidden rounded-2xl border border-[#ECEAF3] bg-[#FBFAFF]"
    : "relative mt-7 h-[188px] overflow-hidden rounded-[22px] border border-[#ECEAF3] bg-[#FBFAFF]";

  return (
    <div className={baseClass} aria-label="Začasna vizualna postavitev" role="img">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#fff_0%,#F7F5FD_58%,#EFEBFF_100%)]" />
      <div className="absolute inset-x-0 top-0 h-9 border-b border-[#ECEAF3] bg-white/70" />
      <div className="absolute left-4 top-3 flex gap-1.5">
        <span className="h-2 w-2 rounded-full bg-[#E8E6F0]" />
        <span className="h-2 w-2 rounded-full bg-[#D9D4F8]" />
        <span className="h-2 w-2 rounded-full bg-[#CFC9F8]" />
      </div>
      <ServiceVisualContent variant={variant} />
    </div>
  );
}

function ServiceVisualContent({ variant }: { variant: string }) {
  if (variant === "package") {
    return (
      <>
        <div className="absolute left-5 top-14 h-7 w-[58%] rounded-lg bg-[#16151D]" />
        <div className="absolute left-5 top-[92px] h-3 w-[48%] rounded-full bg-[#D9D6E3]" />
        <div className="absolute left-5 top-[115px] h-3 w-[36%] rounded-full bg-[#E8E6F0]" />
        <div className="absolute bottom-5 left-5 h-9 w-32 rounded-xl bg-[#6A5AE0]" />
        <div className="absolute bottom-5 right-5 h-[88px] w-[38%] rounded-2xl bg-white shadow-[0_16px_34px_rgba(20,19,29,.10)]" />
      </>
    );
  }
  if (variant === "site") {
    return (
      <>
        <div className="absolute left-4 top-12 h-4 w-14 rounded-md bg-[#16151D]" />
        <div className="absolute left-4 top-[72px] h-2 w-20 rounded-full bg-[#D9D6E3]" />
        <div className="absolute bottom-4 left-4 h-5 w-16 rounded-lg bg-[#6A5AE0]" />
        <div className="absolute bottom-4 right-4 h-10 w-9 rounded-xl bg-white shadow-[0_8px_16px_rgba(20,19,29,.10)]" />
      </>
    );
  }
  if (variant === "inquiries") {
    return (
      <>
        <div className="absolute left-4 top-12 h-8 w-20 rounded-xl bg-white shadow-[0_8px_18px_rgba(20,19,29,.08)]" />
        <div className="absolute right-4 top-[54px] h-7 w-16 rounded-xl bg-[#6A5AE0]" />
        <div className="absolute bottom-4 left-6 h-2 w-20 rounded-full bg-[#CFC9F8]" />
      </>
    );
  }
  if (variant === "reviews") {
    return (
      <>
        <div className="absolute left-1/2 top-[46px] flex -translate-x-1/2 gap-1 text-[13px] font-bold text-[#F5A623]">
          <span>*</span>
          <span>*</span>
          <span>*</span>
          <span>*</span>
          <span>*</span>
        </div>
        <div className="absolute bottom-4 left-4 h-8 w-[88px] rounded-xl bg-white shadow-[0_8px_18px_rgba(20,19,29,.08)]" />
      </>
    );
  }
  return (
    <>
      <div className="absolute left-4 top-12 grid grid-cols-2 gap-2">
        <span className="h-5 w-8 rounded-lg bg-white shadow-[0_6px_14px_rgba(20,19,29,.08)]" />
        <span className="h-5 w-8 rounded-lg bg-[#EFEBFF]" />
        <span className="h-5 w-8 rounded-lg bg-[#EFEBFF]" />
        <span className="h-5 w-8 rounded-lg bg-white shadow-[0_6px_14px_rgba(20,19,29,.08)]" />
      </div>
      <div className="absolute bottom-4 right-4 h-8 w-8 rounded-xl bg-[#6A5AE0]" />
    </>
  );
}
