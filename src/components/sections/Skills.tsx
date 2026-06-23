import { profile } from "@/data/profile";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

export default function Skills() {
  const marquee = [...profile.skills.flatMap((s) => s.items)];
  return (
    <section id="skills" className="py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading index="06" title="The toolkit" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {profile.skills.map((group, i) => (
            <Reveal key={group.group} delay={i * 70}>
              <div className="hover-lift h-full rounded-3xl border border-line bg-bg-elev/40 p-6">
                <p className="font-mono text-xs uppercase tracking-widest text-[var(--accent)]">
                  {group.group}
                </p>
                <ul className="mt-4 space-y-2">
                  {group.items.map((it) => (
                    <li key={it} className="text-sm text-fg/80">
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="mt-16 overflow-hidden border-y border-line py-5">
        <div className="marquee-track">
          {[...marquee, ...marquee].map((s, i) => (
            <span key={i} className="font-display mx-6 text-xl font-medium text-muted/60">
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
