"use client";

import { useEffect, useRef, useState } from "react";

// Animates a numeric value when scrolled into view. Preserves any prefix/suffix
// (e.g. "1st", "40+", "58%") by extracting the number and re-wrapping it.
export default function CountUp({ value, className = "" }: { value: string; className?: string }) {
  const match = value.match(/^(\D*)(\d+(?:\.\d+)?)(\D*)$/);
  const prefix = match?.[1] ?? "";
  const target = match ? parseFloat(match[2]) : 0;
  const suffix = match?.[3] ?? "";
  const decimals = match?.[2].includes(".") ? 1 : 0;

  const [display, setDisplay] = useState(match ? 0 : null);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!match) return;
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(target);
      return;
    }
    let done = false;
    const finish = () => {
      done = true;
      setDisplay(target);
    };
    const animate = () => {
      const dur = 1400;
      const start = performance.now();
      const tick = (now: number) => {
        if (done) return;
        const t = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setDisplay(eased * target);
        if (t < 1) requestAnimationFrame(tick);
        else done = true;
      };
      requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        animate();
      },
      { threshold: 0.25 }
    );
    io.observe(el);

    // Bulletproof: whatever happens with scroll/observer/rAF, show the real
    // value within 2.2s so stats never appear stuck or "not loading".
    const guard = setTimeout(finish, 2200);
    return () => {
      io.disconnect();
      clearTimeout(guard);
    };
  }, [match, target]);

  if (!match) return <span className={className}>{value}</span>;

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {prefix}
      {display !== null ? display.toFixed(decimals) : "0"}
      {suffix}
    </span>
  );
}
