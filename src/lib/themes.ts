// Single fixed theme: Refined · Dark. CSS tokens also live in globals.css.

export type ThemeVars = {
  "--bg": string;
  "--bg-elev": string;
  "--fg": string;
  "--muted": string;
  "--line": string;
  "--accent": string;
  "--accent-2": string;
  "--accent-warm": string;
  "--accent-contrast": string;
  "--glow": string;
};

export const REFINED_DARK: ThemeVars = {
  "--bg": "#000000",
  "--bg-elev": "#0c0b0a",
  "--fg": "#ece6db",
  "--muted": "#968d7e",
  "--line": "rgba(236,230,219,0.1)",
  "--accent": "#e9e2d4",
  "--accent-2": "#cdbfa6",
  "--accent-warm": "#ddd0b8",
  "--accent-contrast": "#0b0a09",
  "--glow": "rgba(233,226,212,0.16)",
};

export const REFINED_LIGHT: ThemeVars = {
  "--bg": "#f4f3f0",
  "--bg-elev": "#ffffff",
  "--fg": "#0e0d0c",
  "--muted": "#4a4740",
  "--line": "rgba(14,13,12,0.14)",
  "--accent": "#0e0d0c",
  "--accent-2": "#3a3730",
  "--accent-warm": "#28251f",
  "--accent-contrast": "#f4f3f0",
  "--glow": "rgba(14,13,12,0.1)",
};

function applyVars(vars: ThemeVars, mode: "dark" | "light") {
  const root = document.documentElement;
  for (const [k, v] of Object.entries(vars)) {
    root.style.setProperty(k, v);
  }
  root.setAttribute("data-theme", mode);
  try { localStorage.setItem("theme", mode); } catch {}
  window.dispatchEvent(
    new CustomEvent("theme:accent", {
      detail: { accent: vars["--accent"], accent2: vars["--accent-2"] },
    })
  );
  window.dispatchEvent(new CustomEvent("agent:theme", { detail: mode }));
}

export function applyTheme() {
  const stored = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
  if (stored === "light") {
    applyVars(REFINED_LIGHT, "light");
  } else {
    applyVars(REFINED_DARK, "dark");
  }
}

export function toggleMode() {
  const current = document.documentElement.getAttribute("data-theme");
  if (current === "light") {
    applyVars(REFINED_DARK, "dark");
  } else {
    applyVars(REFINED_LIGHT, "light");
  }
}
