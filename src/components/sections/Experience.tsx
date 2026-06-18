import { profile } from "@/data/profile";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

export default function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-6xl px-6 py-28">
      <SectionHeading
        index="03"
        title="Where I've shipped"
        subtitle="Two internships building real, tested software — in the USA and for Indian Railways."
      />

      <div className="relative border-l border-line pl-6 sm:pl-10">
        {profile.experience.map((exp, i) => (
          <Reveal key={exp.company} delay={i * 100} className="relative mb-14 last:mb-0">
            <span className="absolute -left-[31px] top-1.5 flex h-3 w-3 sm:-left-[47px]">
              <span className="orb-pulse absolute inline-flex h-full w-full rounded-full bg-[var(--accent)]" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-[var(--accent)]" />
            </span>

            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-display text-xl font-semibold">{exp.role}</h3>
              <span className="font-mono text-xs text-[var(--accent)]">{exp.period}</span>
            </div>
            <p className="mt-1 text-sm text-muted">
              {exp.company} · {exp.location}
            </p>

            <ul className="mt-4 space-y-3">
              {exp.highlights.map((h, j) => (
                <li key={j} className="flex gap-3 text-sm leading-relaxed text-fg/80">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--accent-2)]" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex flex-wrap gap-2">
              {exp.stack.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-muted"
                >
                  {s}
                </span>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
