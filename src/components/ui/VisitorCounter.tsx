"use client";

import CountUp from "@/components/ui/CountUp";
import { useVisitorCount } from "@/hooks/useVisitorCount";

type Props = {
  variant?: "hero" | "footer" | "inline";
  className?: string;
};

export default function VisitorCounter({ variant = "inline", className = "" }: Props) {
  const { counts, loading } = useVisitorCount();

  if (loading || !counts?.configured) return null;

  const unique = String(counts.unique);
  const total = counts.total.toLocaleString();

  if (variant === "hero") {
    return (
      <div className={`min-w-[92px] ${className}`}>
        <CountUp
          value={unique}
          className="font-display text-2xl font-light leading-none stat-gradient sm:text-3xl"
        />
        <div className="mt-1 text-[11px] leading-tight text-muted">profile viewers</div>
      </div>
    );
  }

  if (variant === "footer") {
    return (
      <div
        className={`flex items-center gap-2 text-sm text-muted ${className}`}
        title={`${total} total page views`}
      >
        <span className="relative flex h-2 w-2" aria-hidden>
          <span className="orb-pulse absolute inline-flex h-full w-full rounded-full bg-[var(--accent-2)]" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent-2)]" />
        </span>
        <span>
          <span className="tabular-nums text-fg">{unique}</span> profile viewers
        </span>
      </div>
    );
  }

  return (
    <span className={`tabular-nums ${className}`} title={`${total} total page views`}>
      {unique}
    </span>
  );
}
