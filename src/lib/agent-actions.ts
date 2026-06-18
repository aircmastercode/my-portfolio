// Client-side execution of the AI agent's tool calls — the agent's "hands".
// Decoupled via window events so any component can react.
import type { ToolCall } from "@/lib/tools";
import { applyTheme } from "@/lib/themes";

export function scrollToSection(section: string) {
  const target = `#${section}`;
  const el = document.querySelector(target);
  if (!el) return;
  if (window.__lenis) {
    window.__lenis.scrollTo(el as HTMLElement, { offset: 0, duration: 1.3 });
  } else {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export function setTheme(theme: "dark" | "light") {
  // Route through the preset system so inline CSS vars stay consistent.
  if (theme === "light") {
    applyTheme("light-clean");
  } else {
    applyTheme(localStorage.getItem("last-dark-preset") || "aurora");
  }
}

export function downloadResume(url = "/resume.pdf") {
  const a = document.createElement("a");
  a.href = url;
  a.download = "Tanush-Singhal-Resume.pdf";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function executeToolCall(call: ToolCall) {
  switch (call.name) {
    case "navigate_to_section": {
      const section = String(call.input.section || "");
      if (section) scrollToSection(section);
      break;
    }
    case "highlight_project": {
      const id = String(call.input.project_id || "");
      scrollToSection("projects");
      window.dispatchEvent(new CustomEvent("agent:highlight-project", { detail: id }));
      break;
    }
    case "book_meeting": {
      window.dispatchEvent(new CustomEvent("agent:book"));
      break;
    }
    case "download_resume": {
      downloadResume();
      break;
    }
    case "set_theme": {
      const theme = call.input.theme === "light" ? "light" : "dark";
      setTheme(theme);
      break;
    }
    default:
      break;
  }
}

export function executeToolCalls(calls: ToolCall[]) {
  // Stagger slightly so multiple UI actions feel intentional, not jarring.
  calls.forEach((call, i) => {
    setTimeout(() => executeToolCall(call), i * 600);
  });
}
