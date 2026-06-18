import { profile } from "@/data/profile";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

export default function Approach() {
  return (
    <section id="approach" className="mx-auto max-w-6xl px-6 py-32">
      <SectionHeading index="02" title="How I think" />

      <Reveal>
        <p className="max-w-4xl text-balance font-display text-3xl font-light leading-[1.25] tracking-tight sm:text-[2.6rem]">
          I treat engineering as a series of{" "}
          <span className="font-italic-accent text-gradient">decisions</span>, not a pile of
          features. I build the smallest honest version, measure whether it actually worked, and let
          the <span className="font-italic-accent text-fg">number</span> — not the aesthetics —
          make the call.
        </p>
      </Reveal>

      <div className="mt-20 grid gap-px border border-line sm:grid-cols-2">
        {profile.approach.principles.map((p, i) => (
          <Reveal key={i} delay={(i % 2) * 80}>
            <figure className="flex h-full flex-col justify-between gap-6 p-8 sm:p-10">
              <span className="font-mono text-xs text-[var(--accent)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <blockquote className="pull-quote text-2xl text-fg sm:text-[1.7rem]">
                “{p.quote}”
              </blockquote>
              <figcaption className="text-sm text-muted">{p.context}</figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
