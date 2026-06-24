import { Check } from "lucide-react";

export function IncludedCheck({
  children,
  size = "sm",
}: {
  children: React.ReactNode;
  size?: "sm" | "lg";
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={
          size === "lg"
            ? "flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-[#EFEBFF] text-[#6A5AE0]"
            : "mt-0.5 flex h-3 w-3 shrink-0 items-center justify-center rounded-full bg-[#6A5AE0] text-white"
        }
      >
        {size === "lg" ? <Check size={17} strokeWidth={3} /> : null}
      </span>
      <span
        className={
          size === "lg"
            ? "text-[16px] font-bold leading-[1.35] text-[#28262F]"
            : "text-[15px] font-semibold leading-[1.4] text-[#28262F]"
        }
      >
        {children}
      </span>
    </div>
  );
}
