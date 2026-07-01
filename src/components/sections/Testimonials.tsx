import { profile } from "@/data/profile";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

export default function Testimonials() {
  const testimonials = [...profile.testimonials];
  const certificates = [...profile.certificates];

  if (testimonials.length === 0 && certificates.length === 0) return null;

  const single = testimonials.length === 1;

  return (
    <section id="testimonials" className="mx-auto max-w-6xl px-6 py-28">
      <SectionHeading
        index="09"
        title="What people say"
        subtitle="Reviews from the people I've shipped alongside — and the credentials to back the work."
      />

      {testimonials.length > 0 && (
        <div
          className={
            single
              ? "mx-auto max-w-2xl"
              : "grid gap-5 sm:grid-cols-2"
          }
        >
          {testimonials.map((t, i) => (
            <Reveal key={`${t.company}-${i}`} delay={i * 80}>
              <figure className="glass-card flex h-full flex-col p-6 sm:p-8">
                <QuoteMark />
                <blockquote className="mt-3 flex-1 font-display text-base font-light leading-relaxed text-fg/90 sm:text-lg">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-6 flex flex-wrap items-baseline gap-x-2 gap-y-1 border-t border-line pt-4">
                  <span className="font-display text-base font-semibold">{t.name}</span>
                  <span className="text-sm text-muted">· {t.role}</span>
                  <span className="mt-1 w-full font-mono text-[11px] uppercase tracking-widest text-[var(--accent-2)]">
                    {t.relationship}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      )}

      {certificates.length > 0 && (
        <Reveal delay={120} className="mt-12">
          <div className="rounded-3xl border border-line bg-bg-elev/40 p-6">
            <p className="font-mono text-xs uppercase tracking-widest text-[var(--accent-2)]">
              Certificates &amp; credentials
            </p>
            <div
              className={
                certificates.length === 1
                  ? "mt-5"
                  : "mt-5 grid gap-4 sm:grid-cols-2"
              }
            >
              {certificates.map((c) => (
                <a
                  key={c.title}
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-hover
                  className="group flex items-start justify-between gap-4 rounded-2xl border border-line p-4 transition-colors hover:border-[var(--accent)]"
                >
                  <div>
                    <p className="font-display text-sm font-semibold transition-colors group-hover:text-[var(--accent)]">
                      {c.title}
                    </p>
                    <p className="mt-1 text-sm text-muted">{c.issuer}</p>
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-[var(--accent-2)]">
                      {c.date}
                    </p>
                  </div>
                  <span className="mt-1 shrink-0 text-sm text-[var(--accent)] transition-transform group-hover:translate-x-0.5">
                    ↗
                  </span>
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      )}
    </section>
  );
}

function QuoteMark() {
  return (
    <span
      aria-hidden
      className="font-display text-5xl leading-none text-[var(--accent-2)]/50"
    >
      &ldquo;
    </span>
  );
}
