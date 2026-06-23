import type Anthropic from "@anthropic-ai/sdk";
import { SECTION_IDS, profile } from "@/data/profile";

// Tool definitions sent to Claude. These are executed CLIENT-SIDE (the agent's
// "hands" that drive the website). They are fire-and-forget UI actions.
export const AGENT_TOOLS: Anthropic.Tool[] = [
  {
    name: "navigate_to_section",
    description:
      "Smoothly scroll the website to a section to give the visitor a guided tour. Call this whenever you reference a part of the site.",
    input_schema: {
      type: "object",
      properties: {
        section: {
          type: "string",
          enum: [...SECTION_IDS],
          description: "The section to scroll to.",
        },
      },
      required: ["section"],
    },
  },
  {
    name: "highlight_project",
    description: "Open and spotlight a specific project so the visitor can see the details.",
    input_schema: {
      type: "object",
      properties: {
        project_id: {
          type: "string",
          enum: profile.projects.map((p) => p.id),
          description: "The project to highlight.",
        },
      },
      required: ["project_id"],
    },
  },
  {
    name: "book_meeting",
    description:
      "Open the scheduling widget so the visitor can book a call or interview with the real Tanush. Use when they want to talk, hire, or schedule.",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "download_resume",
    description: "Trigger a download of Tanush's resume PDF.",
    input_schema: { type: "object", properties: {} },
  },
];

export type ToolCall = {
  name: string;
  input: Record<string, unknown>;
};
