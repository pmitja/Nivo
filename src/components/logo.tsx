import Image from "next/image";

import { cn } from "@/lib/utils";

export function Logo({
  className,
}: {
  dark?: boolean;
  className?: string;
  markClassName?: string;
  textClassName?: string;
}) {
  return (
    <span className={cn("relative block h-8 w-[128px] shrink-0 no-underline", className)}>
      <Image src="/obrtio-logo.webp" alt="Obrtio" fill sizes="128px" className="object-contain" priority />
    </span>
  );
}
