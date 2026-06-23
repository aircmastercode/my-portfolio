import { profile } from "@/data/profile";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

const CATEGORY_LABELS: Record<string, string> = {
  education: "Education",
  work: "Work",
  project: "Project",
  milestone: "Milestone",
  writing: "Writing",
};

export default function Timeline() {
  const events = [...profile.timeline].sort((a, b) => a.sortKey.localeCompare(b.sortKey));

  return (
    <section id="timeline" className="mx-auto max-w-6xl px-6 py-28">
      <SectionHeading
        index="04"
        title="My timeline"
        subtitle="The arc so far — from BITS & IIT Madras to shipping production systems and publishing in public."
      />

      <div className="relative">
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-line sm:left-[11px]" aria-hidden />

        <div className="space-y-0">
          {events.map((event, i) => (
            <Reveal key={`${event.sortKey}-${event.title}`} delay={i * 60}>
              <article className="relative grid grid-cols-[20px_1fr] gap-4 pb-10 sm:grid-cols-[28px_1fr] sm:gap-6 last:pb-0">
                <div className="relative z-[1] flex justify-center pt-1.5">
                  <span
                    className={`timeline-dot timeline-dot--${event.category}`}
                    aria-hidden
                  />
                </div>

                <div className="glass-card p-5 sm:p-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="font-mono text-xs text-[var(--accent)]">{event.date}</span>
                    <span className="timeline-pill">{CATEGORY_LABELS[event.category] ?? event.category}</span>
                  </div>
                  <h3 className="font-display mt-2 text-lg font-semibold sm:text-xl">
                    {event.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{event.subtitle}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
