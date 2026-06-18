"use client";

import { useEffect, useCallback } from "react";
import { getCalApi } from "@calcom/embed-react";
import { profile } from "@/data/profile";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { downloadResume } from "@/lib/agent-actions";

export default function Contact() {
  const openBooking = useCallback(async () => {
    try {
      const cal = await getCalApi();
      cal("modal", { calLink: profile.calLink });
    } catch {
      window.open(`https://cal.com/${profile.calLink}`, "_blank");
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const cal = await getCalApi();
        cal("ui", { theme: "dark", hideEventTypeDetails: false });
      } catch {}
    })();
    const onBook = () => openBooking();
    window.addEventListener("agent:book", onBook);
    return () => window.removeEventListener("agent:book", onBook);
  }, [openBooking]);

  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 py-28">
      <SectionHeading index="07" title="Let's build something" />

      <Reveal>
        <div className="overflow-hidden rounded-[2rem] border border-line bg-bg-elev/40 p-8 sm:p-14">
          <p className="font-display text-3xl font-bold leading-tight sm:text-5xl">
            Hiring, collaborating, or just curious?
            <br />
            <span className="text-gradient">Let&apos;s talk.</span>
          </p>
          <p className="mt-5 max-w-xl text-muted">
            I&apos;m {profile.availability.toLowerCase()}. Book a slot and my calendar handles the
            rest — or ask my AI twin anything first.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <button
              onClick={openBooking}
              data-hover
              className="btn-accent inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-transform hover:scale-105"
            >
              <CalIcon /> Book a call
            </button>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("agent:open"))}
              data-hover
              className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-semibold transition-colors hover:border-[var(--accent)]"
            >
              Ask my AI twin
            </button>
            <button
              onClick={() => downloadResume()}
              data-hover
              className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-semibold transition-colors hover:border-[var(--accent)]"
            >
              Download résumé
            </button>
          </div>

          <div className="mt-12 grid gap-4 border-t border-line pt-8 sm:grid-cols-3">
            <ContactLink label="Email" value={profile.email} href={`mailto:${profile.email}`} />
            <ContactLink label="LinkedIn" value="/tanushsinghal" href={profile.socials.linkedin} />
            <ContactLink label="GitHub" value="/aircmastercode" href={profile.socials.github} />
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function ContactLink({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-hover
      className="group rounded-2xl border border-line p-4 transition-colors hover:border-[var(--accent)]"
    >
      <p className="font-mono text-[11px] uppercase tracking-widest text-muted">{label}</p>
      <p className="mt-1 text-sm font-medium transition-colors group-hover:text-[var(--accent)]">
        {value}
      </p>
    </a>
  );
}

function CalIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M3 10h18M8 2v4M16 2v4" />
    </svg>
  );
}
