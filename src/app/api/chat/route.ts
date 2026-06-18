import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt, screenInput } from "@/lib/knowledge";
import { AGENT_TOOLS, type ToolCall } from "@/lib/tools";

export const runtime = "nodejs";

// ── Guardrails: lightweight in-memory limits ──────────────────────────────
// NOTE: in-memory state resets on cold start. For production on Cloudflare,
// back these with Workers KV / Durable Objects. The daily cap is the hard
// wallet-protection kill-switch.
const MODEL = "claude-haiku-4-5";
const MAX_TOKENS = 400;
const RATE_LIMIT_PER_MIN = Number(process.env.RATE_LIMIT_PER_MIN || 12);
const DAILY_REQUEST_CAP = Number(process.env.DAILY_REQUEST_CAP || 1500);
const MAX_HISTORY = 16;

const ipHits = new Map<string, number[]>();
let dayKey = new Date().toISOString().slice(0, 10);
let dayCount = 0;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - 60_000;
  const hits = (ipHits.get(ip) || []).filter((t) => t > windowStart);
  hits.push(now);
  ipHits.set(ip, hits);
  return hits.length > RATE_LIMIT_PER_MIN;
}

function overDailyCap(): boolean {
  const today = new Date().toISOString().slice(0, 10);
  if (today !== dayKey) {
    dayKey = today;
    dayCount = 0;
  }
  dayCount += 1;
  return dayCount > DAILY_REQUEST_CAP;
}

type ClientMessage = { role: "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        text: "The AI agent isn't configured yet — add an ANTHROPIC_API_KEY to enable me. In the meantime, explore the site or reach out via the contact section!",
        toolCalls: [],
        configured: false,
      },
      { status: 200 }
    );
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "anon";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { text: "You're sending messages a little fast — give me a second to catch up!", toolCalls: [] },
      { status: 429 }
    );
  }

  if (overDailyCap()) {
    return NextResponse.json(
      {
        text: "I'm taking a quick break to keep things running smoothly. Please use the contact section to reach Tanush directly!",
        toolCalls: [],
      },
      { status: 200 }
    );
  }

  let body: { messages?: ClientMessage[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const history = (body.messages || []).slice(-MAX_HISTORY);
  const last = history[history.length - 1];
  if (!last || last.role !== "user" || !last.content?.trim()) {
    return NextResponse.json({ error: "no_user_message" }, { status: 400 });
  }

  const screen = screenInput(last.content);
  if (!screen.ok) {
    return NextResponse.json(
      {
        text: "I'm here to tell you about Tanush's work — happy to dig into any of his projects or set up a chat with him. What would you like to know?",
        toolCalls: [],
      },
      { status: 200 }
    );
  }

  const anthropic = new Anthropic({ apiKey });

  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: [
        {
          type: "text",
          text: buildSystemPrompt(),
          cache_control: { type: "ephemeral" },
        },
      ],
      tools: AGENT_TOOLS,
      messages: history.map((m) => ({ role: m.role, content: m.content })),
    });

    let text = "";
    const toolCalls: ToolCall[] = [];
    for (const block of response.content) {
      if (block.type === "text") text += block.text;
      else if (block.type === "tool_use")
        toolCalls.push({ name: block.name, input: (block.input as Record<string, unknown>) || {} });
    }

    if (!text.trim() && toolCalls.length > 0) {
      text = "Sure — let me show you.";
    }

    return NextResponse.json({ text: text.trim(), toolCalls });
  } catch (err) {
    console.error("Anthropic error:", err);
    return NextResponse.json(
      {
        text: "I hit a snag reaching my brain just now. Try again in a moment, or explore the site directly!",
        toolCalls: [],
      },
      { status: 200 }
    );
  }
}
