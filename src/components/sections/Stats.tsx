import { profile } from "@/data/profile";
import Reveal from "@/components/ui/Reveal";

export default function Stats() {
  return (
    <section className="border-y border-line">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px md:grid-cols-4">
        {profile.stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 80}>
            <div className="flex flex-col px-6 py-12">
              <span className="font-display text-5xl font-light leading-none tracking-tight text-gradient sm:text-6xl">
                {s.value}
              </span>
              <span className="mt-3 text-sm font-medium text-fg/90">{s.label}</span>
              <span className="mt-1 eyebrow !tracking-[0.18em]">{s.sub}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
