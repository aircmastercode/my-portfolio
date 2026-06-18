import { profile } from "@/data/profile";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-28">
      <SectionHeading index="01" title={profile.about.headline} />

      <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          {profile.about.paragraphs.map((para, i) => (
            <Reveal key={i} delay={i * 80}>
              <p className="text-lg leading-relaxed text-fg/85">{para}</p>
            </Reveal>
          ))}

          <Reveal delay={200}>
            <div className="mt-8 flex flex-wrap gap-3">
              {profile.education.map((e) => (
                <div key={e.school} className="rounded-2xl border border-line bg-bg-elev/40 p-4">
                  <p className="font-display text-sm font-semibold">{e.school}</p>
                  <p className="text-sm text-muted">{e.degree}</p>
                  <p className="mt-1 font-mono text-xs text-[var(--accent)]">{e.period}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={120}>
          <div className="rounded-3xl border border-line bg-bg-elev/40 p-6">
            <p className="font-mono text-xs uppercase tracking-widest text-[var(--accent-2)]">
              Things known for
            </p>
            <ul className="mt-5 space-y-5">
              {profile.about.funFacts.map((f, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-fg/85">
                  <span className="font-mono text-[var(--accent)]">0{i + 1}</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
