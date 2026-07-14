"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useLinkStatus } from "next/link";
import { Loader2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * useLinkStatus deluje samo znotraj <Link>, progress bar pa stoji v glavi strani.
 * Zato povezave svoje stanje javijo v to majhno shrambo, ki jo bar posluša.
 */
let pendingCount = 0;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function useReportPending(pending: boolean) {
  useEffect(() => {
    if (!pending) return;

    pendingCount += 1;
    emit();

    return () => {
      pendingCount -= 1;
      emit();
    };
  }, [pending]);
}

/** Ikona povezave, ki se med nalaganjem strani spremeni v vrtavko. */
export function NavIcon({
  icon: Icon,
  className,
  strokeWidth,
}: {
  icon: LucideIcon;
  className?: string;
  strokeWidth?: number;
}) {
  const { pending } = useLinkStatus();
  useReportPending(pending);

  if (pending) {
    return <Loader2 aria-hidden className={cn(className, "animate-spin")} strokeWidth={strokeWidth} />;
  }

  return <Icon aria-hidden className={className} strokeWidth={strokeWidth} />;
}

/** Vrtavka za povezave brez ikone (podstatusi povpraševanj). */
export function NavSpinner({ className }: { className?: string }) {
  const { pending } = useLinkStatus();
  useReportPending(pending);

  if (!pending) return null;

  return <Loader2 aria-hidden className={cn("h-3.5 w-3.5 shrink-0 animate-spin", className)} />;
}

/** Črta napredka na vrhu zaslona, dokler se nova stran nalaga. */
export function NavProgressBar() {
  const pending = useSyncExternalStore(
    subscribe,
    () => pendingCount > 0,
    () => false,
  );

  if (!pending) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px] bg-[#EEEAFE]" role="status" aria-live="polite">
      <div className="nv-nav-progress h-full w-full bg-gradient-to-r from-[#6A5AE0] to-[#9A8CF5]" />
      <span className="sr-only">Nalaganje strani</span>
    </div>
  );
}
