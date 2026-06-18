"use client";

import { useEffect, useRef, useState } from "react";

// Animates a numeric value when scrolled into view. Preserves any prefix/suffix
// (e.g. "1st", "40+", "58%") by extracting the number and re-wrapping it.
export default function CountUp({ value, className = "" }: { value: string; className?: string }) {
  const match = value.match(/^(\D*)(\d+(?:\.\d+)?)(\D*)$/);
  const hasNumber = match !== null;
  const prefix = match?.[1] ?? "";
  const numStr = match?.[2] ?? "";
  const target = hasNumber ? parseFloat(numStr) : 0;
  const suffix = match?.[3] ?? "";
  const decimals = numStr.includes(".") ? 1 : 0;

  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  // Depend only on stable primitives (`hasNumber`, `target`) — NOT the `match`
  // array, which is a fresh reference every render and would otherwise make this
  // effect tear down + recreate the observer/rAF/guard on every animation frame,
  // leaving the counter stuck at a tiny value.
  useEffect(() => {
    if (!hasNumber) return;
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(target);
      return;
    }

    let raf = 0;
    let started = false;

    const run = () => {
      if (started) return;
      started = true;
      const dur = 1400;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        if (t < 1) {
          setDisplay(eased * target);
          raf = requestAnimationFrame(tick);
        } else {
          setDisplay(target);
        }
      };
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        run();
      },
      { threshold: 0.25 }
    );
    io.observe(el);

    // Bulletproof: whatever happens with scroll/observer/rAF, show the real
    // value within 2.2s so stats never appear stuck or "not loading".
    const guard = setTimeout(() => {
      io.disconnect();
      cancelAnimationFrame(raf);
      setDisplay(target);
    }, 2200);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      clearTimeout(guard);
    };
  }, [hasNumber, target]);

  if (!hasNumber) return <span className={className}>{value}</span>;

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}
