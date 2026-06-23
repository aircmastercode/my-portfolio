"use client";

import { useEffect, useState } from "react";
import { profile } from "@/data/profile";
import { scrollToSection } from "@/lib/agent-actions";
import { toggleMode } from "@/lib/themes";

const LINKS: { id: string; label: string }[] = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "timeline", label: "Timeline" },
  { id: "projects", label: "Work" },
  { id: "skills", label: "Skills" },
  { id: "activity", label: "Activity" },
  { id: "writing", label: "Writing" },
  { id: "contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Sync icon with current mode (including on initial load from ThemeInit).
    const stored = localStorage.getItem("theme");
    setIsDark(stored !== "light");
    const onTheme = (e: Event) =>
      setIsDark((e as CustomEvent<"dark" | "light">).detail === "dark");
    window.addEventListener("agent:theme", onTheme);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("agent:theme", onTheme);
    };
  }, []);

  // Track which section is in view so its nav link keeps the active underline.
  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (sections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const go = (id: string) => {
    scrollToSection(id);
    setOpen(false);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <nav
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-full px-4 py-2 transition-all duration-500 ${
          scrolled ? "glass mx-4 sm:mx-auto" : "bg-transparent"
        }`}
      >
        <button
          onClick={() => scrollToSection("hero")}
          data-hover
          className="font-display flex h-9 w-9 items-center justify-center rounded-full border border-line text-sm font-bold text-gradient"
          aria-label="Home"
        >
          {profile.initials}
        </button>

        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <li key={l.id}>
              <button
                onClick={() => go(l.id)}
                data-hover
                className={`nav-link rounded-full px-3 py-1.5 text-sm text-muted hover:text-fg ${
                  activeId === l.id ? "is-active" : ""
                }`}
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            onClick={() => { toggleMode(); setIsDark((d) => !d); }}
            data-hover
            aria-label="Toggle theme"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition-colors hover:text-fg"
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("agent:open"))}
            data-hover
            className="hidden rounded-full border border-[rgba(205,191,166,0.6)] bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-contrast)] transition-all hover:scale-105 hover:shadow-[0_0_16px_rgba(205,191,166,0.3)] sm:inline-flex"
          >
            Talk to me
          </button>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line md:hidden"
          >
            <span className="text-lg">{open ? "✕" : "☰"}</span>
          </button>
        </div>
      </nav>

      {open && (
        <div className="glass mx-4 mt-2 rounded-2xl p-2 md:hidden">
          {LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => go(l.id)}
              className="block w-full rounded-xl px-4 py-3 text-left text-sm text-muted hover:bg-white/5 hover:text-fg"
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </svg>
  );
}
