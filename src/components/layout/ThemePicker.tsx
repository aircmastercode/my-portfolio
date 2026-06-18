"use client";

import { useEffect, useState } from "react";
import { THEMES, DEFAULT_THEME_ID, applyTheme, getInitialThemeId } from "@/lib/themes";

export default function ThemePicker() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(DEFAULT_THEME_ID);

  useEffect(() => {
    const id = getInitialThemeId();
    applyTheme(id);
    setActive(id);
    const onPreset = (e: Event) => setActive((e as CustomEvent).detail);
    window.addEventListener("theme:preset", onPreset);
    return () => window.removeEventListener("theme:preset", onPreset);
  }, []);

  const pick = (id: string) => {
    applyTheme(id);
    setActive(id);
  };

  return (
    <div className="fixed bottom-5 left-5 z-[80]">
      {open && (
        <div className="glass absolute bottom-14 left-0 w-60 rounded-2xl border border-line p-3 shadow-2xl">
          <p className="px-1 pb-2 eyebrow">Theme — pick one</p>
          <div className="grid grid-cols-1 gap-1">
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => pick(t.id)}
                data-hover
                className={`flex items-center gap-3 rounded-xl px-2.5 py-2 text-left text-sm transition-colors hover:bg-white/5 ${
                  active === t.id ? "bg-white/5" : ""
                }`}
              >
                <span
                  className="h-5 w-5 shrink-0 rounded-full border border-white/20"
                  style={{ background: t.swatch }}
                />
                <span className="flex-1 text-fg/90">{t.label}</span>
                {active === t.id && <span className="text-[var(--accent)]">●</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        data-hover
        aria-label="Change theme"
        className="glass flex h-11 w-11 items-center justify-center rounded-full border border-line text-muted transition-colors hover:text-fg"
      >
        {open ? <span className="text-lg">✕</span> : <PaletteIcon />}
      </button>
    </div>
  );
}

function PaletteIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.563C22 6.012 17.5 2 12 2Z" />
    </svg>
  );
}
