import { profile } from "@/data/profile";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

export default function Writing() {
  return (
    <section id="writing" className="mx-auto max-w-6xl px-6 py-28">
      <SectionHeading
        index="08"
        title="I write about the trade-offs"
        subtitle="Long-form engineering essays, with companion video and podcast walkthroughs."
      />
      <div className="grid gap-5 sm:grid-cols-2">
        {profile.writing.map((w, i) => (
          <Reveal key={w.title} delay={i * 80}>
            <a
              href={w.href}
              target="_blank"
              rel="noopener noreferrer"
              data-hover
              className="hover-lift group block h-full rounded-3xl border border-line bg-bg-elev/40 p-6"
            >
              <span className="font-mono text-[11px] text-[var(--accent-2)]">{w.tag}</span>
              <h3 className="font-display mt-3 text-xl font-semibold transition-colors group-hover:text-[var(--accent)]">
                {w.title}
              </h3>
              <p className="mt-3 text-sm text-muted">{w.blurb}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm text-[var(--accent)]">
                Read on Medium
                <span className="transition-transform group-hover:translate-x-1">↗</span>
              </span>
            </a>
          </Reveal>
        ))}
      </div>

      <Reveal delay={120} className="mt-12">
        <div className="flex flex-wrap items-center gap-4 rounded-3xl border border-line bg-bg-elev/40 p-6">
          <p className="font-display text-lg font-semibold">Achievements</p>
          <ul className="flex flex-1 flex-wrap gap-x-6 gap-y-2">
            {profile.achievements.map((a) => (
              <li key={a} className="text-sm text-muted">
                · {a}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
