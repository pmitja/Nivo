import Image from "next/image";

import { cn } from "@/lib/utils";

export function Logo({
  dark = false,
  className,
  markClassName,
  textClassName,
}: {
  dark?: boolean;
  className?: string;
  markClassName?: string;
  textClassName?: string;
}) {
  return (
    <span className={cn("flex items-center gap-2.5 no-underline", dark ? "text-white" : "text-[#16151D]", className)}>
      <span
        className={cn(
          "relative h-[30px] w-[30px] shrink-0 overflow-hidden rounded-[9px] shadow-[0_4px_12px_rgba(106,90,224,.35)]",
          markClassName,
        )}
      >
        <Image
          src="/nivo-logo-mark.svg"
          alt=""
          width={30}
          height={30}
          className="h-full w-full scale-[1.625]"
          priority
        />
      </span>
      <span className={cn("text-xl font-extrabold tracking-[-.02em]", textClassName)}>Nivo</span>
    </span>
  );
}
