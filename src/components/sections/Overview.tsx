"use client";

import { profile } from "@/data/profile";
import Reveal from "@/components/ui/Reveal";
import CountUp from "@/components/ui/CountUp";

export default function Overview() {
  return (
    <section id="overview" className="mx-auto max-w-6xl px-6 py-20">
      <Reveal className="mb-8 flex items-end justify-between gap-4">
        <div>
          <span className="eyebrow">At a glance</span>
          <h2 className="font-display mt-2 text-2xl font-light tracking-tight sm:text-3xl">
            The proof, up front.
          </h2>
        </div>
      </Reveal>

      <div className="grid auto-rows-[minmax(120px,auto)] grid-cols-2 gap-4 md:grid-cols-4">
        {/* Highlight card */}
        <Reveal className="col-span-2 row-span-2">
          <div className="glass-card flex h-full flex-col justify-between p-7">
            <div>
              <span className="inline-flex items-center gap-2 eyebrow">
                <span className="relative flex h-2 w-2">
                  <span className="orb-pulse absolute inline-flex h-full w-full rounded-full bg-[var(--accent-2)]" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent-2)]" />
                </span>
                Currently
              </span>
              <p className="font-display mt-5 text-2xl font-light leading-snug sm:text-3xl">
                Software Engineering Intern at{" "}
                <span className="font-italic-accent text-gradient">Software Tree</span>, building a
                24/7 inventory-monitoring agent — remote from India to the USA.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("agent:open"))}
                data-hover
                className="btn-accent inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-transform hover:scale-[1.03]"
              >
                Ask my AI twin
              </button>
              <span className="text-sm text-muted">{profile.availability}</span>
            </div>
          </div>
        </Reveal>

        {/* Metric cards */}
        {profile.stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 70}>
            <div className="glass-card flex h-full flex-col justify-center p-6">
              <CountUp
                value={s.value}
                className="font-display text-4xl font-light leading-none text-gradient sm:text-5xl"
              />
              <span className="mt-3 text-sm font-medium text-fg/90">{s.label}</span>
              <span className="mt-0.5 eyebrow !tracking-[0.16em]">{s.sub}</span>
            </div>
          </Reveal>
        ))}

        {/* Education card */}
        <Reveal className="col-span-2">
          <div className="glass-card flex h-full flex-col justify-center gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
            {profile.education.map((e) => (
              <div key={e.school}>
                <p className="font-display text-base font-semibold">{e.school}</p>
                <p className="text-sm text-muted">{e.degree}</p>
                <p className="mt-1 eyebrow !tracking-[0.16em] text-[var(--accent)]">{e.period}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
