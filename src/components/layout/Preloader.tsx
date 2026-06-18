"use client";

import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/profile";

export default function Preloader() {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const [hidden, setHidden] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Only show once per browser session.
    if (sessionStorage.getItem("intro-seen")) {
      setHidden(true);
      return;
    }
    document.body.style.overflow = "hidden";

    const duration = reduce ? 400 : 1900;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(eased * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else {
        setDone(true);
        sessionStorage.setItem("intro-seen", "1");
        document.body.style.overflow = "";
        window.dispatchEvent(new CustomEvent("intro:done"));
        setTimeout(() => setHidden(true), 1050);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!hidden) return;
    // Signal listeners (hero) that intro is over even on the skip path.
    window.dispatchEvent(new CustomEvent("intro:done"));
  }, [hidden]);

  if (hidden) return null;

  return (
    <div ref={ref} className={`preloader ${done ? "is-done" : ""}`} aria-hidden>
      <div className="relative flex h-full w-full max-w-6xl flex-col justify-between px-6 py-10">
        <div className="eyebrow mt-6">Portfolio · {new Date().getFullYear()}</div>

        <div className="flex flex-1 items-center">
          <h1 className="font-display text-5xl font-light leading-none tracking-tight sm:text-7xl">
            {profile.name.split(" ").map((w, i) => (
              <span key={i} className="block overflow-hidden">
                <span
                  className="block"
                  style={{
                    transform: done ? "translateY(110%)" : "translateY(0)",
                    transition: "transform 0.8s cubic-bezier(0.76,0,0.24,1)",
                    transitionDelay: `${i * 0.06}s`,
                  }}
                >
                  {i === 1 ? <em className="font-italic-accent">{w}</em> : w}
                </span>
              </span>
            ))}
          </h1>
        </div>

        <div className="flex items-end justify-between border-t border-line pt-5">
          <span className="text-sm text-muted">{profile.roleLine}</span>
          <span className="font-mono text-4xl tabular-nums text-fg sm:text-6xl">
            {String(count).padStart(3, "0")}
          </span>
        </div>
      </div>
    </div>
  );
}
