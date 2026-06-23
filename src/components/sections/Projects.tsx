"use client";

import { useEffect, useState, useCallback } from "react";
import { profile, type Project } from "@/data/profile";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

export default function Projects() {
  const [active, setActive] = useState<Project | null>(null);

  const openById = useCallback((id: string) => {
    const p = profile.projects.find((x) => x.id === id);
    if (p) setActive(p);
  }, []);

  useEffect(() => {
    const onHighlight = (e: Event) => openById((e as CustomEvent).detail);
    window.addEventListener("agent:highlight-project", onHighlight);
    return () => window.removeEventListener("agent:highlight-project", onHighlight);
  }, [openById]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section id="projects" className="mx-auto max-w-6xl px-6 py-28">
      <SectionHeading
        index="05"
        title="Selected work"
        subtitle="Each one ends with a decision principle — because the decision is what matters most."
      />

      <div className="grid gap-5 sm:grid-cols-2">
        {profile.projects.map((p, i) => (
          <Reveal key={p.id} delay={i * 80}>
            <button
              onClick={() => setActive(p)}
              data-hover
              className="glass-card work-card group flex h-full w-full flex-col p-6 text-left"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-3 py-1 font-mono text-[11px] text-[var(--accent)]">
                  {p.badge}
                </span>
                <span className="font-mono text-xs text-muted">{p.period}</span>
              </div>

              <h3 className="font-display mt-5 text-2xl font-semibold leading-tight transition-colors group-hover:text-[var(--accent)]">
                {p.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{p.summary}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                {p.stack.slice(0, 4).map((s) => (
                  <span key={s} className="font-mono text-[11px] text-muted/80">
                    {s}
                  </span>
                ))}
              </div>

              <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-[var(--accent)]">
                Explore
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </button>
          </Reveal>
        ))}
      </div>

      {active && <ProjectModal project={active} onClose={() => setActive(null)} />}
    </section>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        className="glass relative max-h-[88svh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-line p-7 sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted hover:text-fg"
        >
          ✕
        </button>

        <span className="rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-3 py-1 font-mono text-[11px] text-[var(--accent)]">
          {project.badge}
        </span>
        <h3 className="font-display mt-4 text-3xl font-bold">{project.title}</h3>
        <p className="mt-3 text-muted">{project.summary}</p>

        <ul className="mt-6 space-y-3">
          {project.bullets.map((b, i) => (
            <li key={i} className="flex gap-3 text-sm leading-relaxed text-fg/85">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--accent-2)]" />
              <span>{b}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 rounded-2xl border border-[var(--accent)]/20 bg-[var(--accent)]/5 p-4">
          <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--accent-2)]">
            Decision principle
          </p>
          <p className="font-display mt-2 text-lg italic">“{project.principle}”</p>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {project.stack.map((s) => (
            <span
              key={s}
              className="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-muted"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
