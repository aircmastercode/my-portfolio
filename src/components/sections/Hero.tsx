"use client";

import { useEffect, useState } from "react";
import { profile } from "@/data/profile";
import { scrollToSection } from "@/lib/agent-actions";
import Magnetic from "@/components/ui/Magnetic";
import CountUp from "@/components/ui/CountUp";

export default function Hero() {
  const [reveal, setReveal] = useState(false);

  useEffect(() => {
    const trigger = () => setReveal(true);
    if (sessionStorage.getItem("intro-seen")) {
      const t = setTimeout(trigger, 150);
      return () => clearTimeout(t);
    }
    window.addEventListener("intro:done", trigger, { once: true });
    const fallback = setTimeout(trigger, 2600);
    return () => {
      window.removeEventListener("intro:done", trigger);
      clearTimeout(fallback);
    };
  }, []);

  const openAgent = () => window.dispatchEvent(new CustomEvent("agent:open"));

  return (
    <section id="hero" className="relative min-h-[100svh] w-full overflow-hidden">
      <div className="relative z-[2] mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-6 pb-24 pt-28">
        <div className={`word-mask ${reveal ? "is-in" : ""}`}>
          <span>
            <span className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 eyebrow">
              <span className="relative flex h-2 w-2">
                <span className="orb-pulse absolute inline-flex h-full w-full rounded-full bg-[var(--accent-2)]" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent-2)]" />
              </span>
              {profile.availability}
            </span>
          </span>
        </div>

        <h1 className="font-display mt-7 max-w-4xl text-6xl font-light leading-[0.92] tracking-tight sm:text-8xl lg:text-[8.5rem]">
          <span className={`word-mask ${reveal ? "is-in" : ""}`} style={{ transitionDelay: "0.05s" }}>
            <span>Tanush</span>
          </span>
          <br />
          <span className={`word-mask ${reveal ? "is-in" : ""}`} style={{ transitionDelay: "0.12s" }}>
            <span className="font-italic-accent text-gradient">Singhal</span>
          </span>
        </h1>

        <div className={`word-mask mt-7 ${reveal ? "is-in" : ""}`} style={{ transitionDelay: "0.2s" }}>
          <span>
            <p className="max-w-xl text-lg leading-relaxed text-muted">
              {profile.tagline.replace(" — with real numbers.", "")}{" "}
              <span className="font-italic-accent text-fg">with real numbers.</span>
            </p>
          </span>
        </div>

        <div
          className={`word-mask mt-10 ${reveal ? "is-in" : ""}`}
          style={{ transitionDelay: "0.28s" }}
        >
          <span>
            <div className="flex flex-wrap items-center gap-3">
              <Magnetic strength={0.35}>
                <button
                  onClick={openAgent}
                  data-hover
                  className="btn-accent group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-transform hover:scale-[1.03]"
                >
                  <MicIcon />
                  Talk to my AI twin
                </button>
              </Magnetic>
              <Magnetic strength={0.25}>
                <button
                  onClick={() => scrollToSection("projects")}
                  data-hover
                  className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-semibold text-fg transition-colors hover:border-[var(--accent)]"
                >
                  View my work
                </button>
              </Magnetic>
            </div>
          </span>
        </div>

        <div
          className={`word-mask mt-14 ${reveal ? "is-in" : ""}`}
          style={{ transitionDelay: "0.36s" }}
        >
          <span>
            <div className="flex flex-wrap gap-x-8 gap-y-4 border-t border-line pt-6">
              {profile.stats.map((s) => (
                <div key={s.label} className="min-w-[78px]">
                  <CountUp
                    value={s.value}
                    className="font-display text-2xl font-light leading-none text-gradient sm:text-3xl"
                  />
                  <div className="mt-1 text-[11px] leading-tight text-muted">{s.label}</div>
                </div>
              ))}
            </div>
          </span>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 z-[2] -translate-x-1/2 text-muted">
        <div className="flex flex-col items-center gap-2">
          <span className="eyebrow !text-[10px]">Scroll</span>
          <span className="h-10 w-[1px] bg-gradient-to-b from-[var(--accent)] to-transparent" />
        </div>
      </div>
    </section>
  );
}

function MicIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10a7 7 0 0 1-14 0M12 17v4" />
    </svg>
  );
}
