// Curated theme presets the visitor can switch between live.
// The DEFAULT is an unbiased, near-monochrome "ink & paper" look that adapts to
// the visitor's own system light/dark preference — so it imposes no color bias.
// The picker lets any visitor choose a colored accent if they prefer.

export type ThemeVars = {
  "--bg": string;
  "--bg-elev": string;
  "--fg": string;
  "--muted": string;
  "--line": string;
  "--accent": string;
  "--accent-2": string;
  "--accent-warm": string;
  "--accent-contrast": string; // text/icon color that sits ON the accent
  "--glow": string;
};

export type ThemePreset = {
  id: string;
  label: string;
  mode: "dark" | "light";
  swatch: string;
  vars: ThemeVars;
};

export const THEMES: ThemePreset[] = [
  {
    id: "aurora",
    label: "Refined · Dark",
    mode: "dark",
    swatch: "#e9e2d4",
    vars: {
      "--bg": "#0b0a09",
      "--bg-elev": "#16140f",
      "--fg": "#ece6db",
      "--muted": "#968d7e",
      "--line": "rgba(236,230,219,0.1)",
      "--accent": "#e9e2d4",
      "--accent-2": "#cdbfa6",
      "--accent-warm": "#ddd0b8",
      "--accent-contrast": "#0b0a09",
      "--glow": "rgba(233,226,212,0.16)",
    },
  },
  {
    id: "mono-dark",
    label: "Monochrome · Dark",
    mode: "dark",
    swatch: "#fafafa",
    vars: {
      "--bg": "#0a0a0b",
      "--bg-elev": "#161618",
      "--fg": "#f4f4f5",
      "--muted": "#8a8a90",
      "--line": "rgba(255,255,255,0.1)",
      "--accent": "#fafafa",
      "--accent-2": "#d4d4d8",
      "--accent-warm": "#e4e4e7",
      "--accent-contrast": "#0a0a0b",
      "--glow": "rgba(255,255,255,0.22)",
    },
  },
  {
    id: "mono-light",
    label: "Monochrome · Light",
    mode: "light",
    swatch: "#111113",
    vars: {
      "--bg": "#f7f7f5",
      "--bg-elev": "#ffffff",
      "--fg": "#111113",
      "--muted": "#6b6b72",
      "--line": "rgba(17,17,19,0.12)",
      "--accent": "#18181b",
      "--accent-2": "#3f3f46",
      "--accent-warm": "#27272a",
      "--accent-contrast": "#fafafa",
      "--glow": "rgba(17,17,19,0.12)",
    },
  },
  {
    id: "slate-blue",
    label: "Slate · Blue",
    mode: "dark",
    swatch: "#3b82f6",
    vars: {
      "--bg": "#0c0f16",
      "--bg-elev": "#151a23",
      "--fg": "#e6edf5",
      "--muted": "#8b96a8",
      "--line": "rgba(230,237,245,0.09)",
      "--accent": "#3b82f6",
      "--accent-2": "#38bdf8",
      "--accent-warm": "#60a5fa",
      "--accent-contrast": "#ffffff",
      "--glow": "rgba(59,130,246,0.42)",
    },
  },
  {
    id: "emerald",
    label: "Forest · Emerald",
    mode: "dark",
    swatch: "#10b981",
    vars: {
      "--bg": "#08100d",
      "--bg-elev": "#11201a",
      "--fg": "#e7f0ea",
      "--muted": "#86988e",
      "--line": "rgba(231,240,234,0.09)",
      "--accent": "#10b981",
      "--accent-2": "#34d399",
      "--accent-warm": "#5eead4",
      "--accent-contrast": "#04130d",
      "--glow": "rgba(16,185,129,0.4)",
    },
  },
  {
    id: "violet",
    label: "Ink · Violet",
    mode: "dark",
    swatch: "#8b5cf6",
    vars: {
      "--bg": "#0c0a14",
      "--bg-elev": "#16121f",
      "--fg": "#ebe7f3",
      "--muted": "#948da6",
      "--line": "rgba(235,231,243,0.09)",
      "--accent": "#8b5cf6",
      "--accent-2": "#c084fc",
      "--accent-warm": "#a78bfa",
      "--accent-contrast": "#ffffff",
      "--glow": "rgba(139,92,246,0.42)",
    },
  },
  {
    id: "amber",
    label: "Warm · Amber",
    mode: "dark",
    swatch: "#e0a063",
    vars: {
      "--bg": "#14110d",
      "--bg-elev": "#1d1813",
      "--fg": "#ece3d4",
      "--muted": "#9c9081",
      "--line": "rgba(236,227,212,0.1)",
      "--accent": "#e0a063",
      "--accent-2": "#f1ca91",
      "--accent-warm": "#d4825a",
      "--accent-contrast": "#1a1206",
      "--glow": "rgba(224,160,99,0.4)",
    },
  },
  {
    id: "light-clean",
    label: "Clean · Light",
    mode: "light",
    swatch: "#2563eb",
    vars: {
      "--bg": "#f7f9fc",
      "--bg-elev": "#ffffff",
      "--fg": "#0c1018",
      "--muted": "#59647a",
      "--line": "rgba(12,16,24,0.1)",
      "--accent": "#2563eb",
      "--accent-2": "#0ea5e9",
      "--accent-warm": "#3b82f6",
      "--accent-contrast": "#ffffff",
      "--glow": "rgba(37,99,235,0.18)",
    },
  },
];

export const DEFAULT_THEME_ID = "aurora";

export function getInitialThemeId(): string {
  if (typeof window === "undefined") return DEFAULT_THEME_ID;
  const stored = localStorage.getItem("theme-preset");
  if (stored && THEMES.some((t) => t.id === stored)) return stored;
  // Follow the visitor's OS light/dark preference for the default.
  const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  return prefersLight ? "light-clean" : "aurora";
}

export function applyTheme(id: string) {
  const preset = THEMES.find((t) => t.id === id) || THEMES[0];
  const root = document.documentElement;
  for (const [k, v] of Object.entries(preset.vars)) {
    root.style.setProperty(k, v);
  }
  root.setAttribute("data-theme", preset.mode);
  try {
    localStorage.setItem("theme-preset", id);
    localStorage.setItem("theme", preset.mode);
    if (preset.mode === "dark") localStorage.setItem("last-dark-preset", id);
  } catch {}
  window.dispatchEvent(
    new CustomEvent("theme:accent", {
      detail: { accent: preset.vars["--accent"], accent2: preset.vars["--accent-2"] },
    })
  );
  window.dispatchEvent(new CustomEvent("agent:theme", { detail: preset.mode }));
  window.dispatchEvent(new CustomEvent("theme:preset", { detail: id }));
  return preset;
}

export function toggleMode() {
  const current = localStorage.getItem("theme-preset") || DEFAULT_THEME_ID;
  const preset = THEMES.find((t) => t.id === current) || THEMES[0];
  if (preset.mode === "dark") {
    applyTheme("light-clean");
  } else {
    applyTheme(localStorage.getItem("last-dark-preset") || "aurora");
  }
}
