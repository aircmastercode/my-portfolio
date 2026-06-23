import Image from "next/image";
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

        <div className="space-y-6">
          <Reveal delay={100}>
            <figure className="group relative overflow-hidden rounded-3xl border border-line bg-bg-elev/40">
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src="/tanush.jpg"
                  alt={`${profile.name} — ${profile.roleLine}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                  priority={false}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-[var(--line)]" />
              </div>
              <figcaption className="absolute bottom-4 left-4 right-4 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="orb-pulse absolute inline-flex h-full w-full rounded-full bg-[var(--accent-2)]" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent-2)]" />
                </span>
                <span className="font-mono text-[11px] uppercase tracking-widest text-white/90">
                  Off-duty · Himalayas
                </span>
              </figcaption>
            </figure>
          </Reveal>

          <Reveal delay={160}>
            <div className="rounded-3xl border border-line bg-bg-elev/40 p-6">
              <p className="font-mono text-xs uppercase tracking-widest text-[var(--accent-2)]">
                Things I&apos;m known for
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
      </div>
    </section>
  );
}
