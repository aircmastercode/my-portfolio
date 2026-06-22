# Tanush Singhal — The Talking Portfolio

An immersive, AI-powered personal portfolio. Visitors don't just read about me —
they **talk** to an AI twin that speaks back, gives a guided tour by scrolling/navigating
the site, answers anything about my work, and books an interview on the spot.

Built with **Next.js 16 · React 19 · Three.js (R3F) · GSAP · Lenis · Claude · ElevenLabs**.

> Full architecture, design rationale, cost model, and research live in
> [`docs/PROJECT_PLAN.md`](docs/PROJECT_PLAN.md).

---

## Quick start

```bash
npm install
cp .env.example .env.local   # then add your keys (see below)
npm run dev                  # http://localhost:3000
```

The site **works with zero keys** — the AI agent shows a friendly "not configured yet"
message and everything else is fully interactive. Add keys to unlock the AI twin.

### Enable the AI twin (one key)

Add to `.env.local`:

```
ANTHROPIC_API_KEY=sk-ant-...
```

That's it — the agent can now chat, give guided tours (scrolling the page), open projects,
and trigger booking. Voice uses the **free browser voice** by default.

### Enable premium human voice (optional)

```
ELEVENLABS_API_KEY=...
ELEVENLABS_VOICE_ID=...      # optional, defaults to a warm voice
```

If unset, speech gracefully falls back to the browser's built-in voice. Speech-to-text uses
the browser's Web Speech API (best in Chrome/Edge); elsewhere the agent stays text-only.

### Scheduling (Cal.com)

Create a free event at [cal.com](https://cal.com) and set:

```
NEXT_PUBLIC_CAL_LINK=yourname/30min
```

### Profile viewer counter (optional)

Shows a live count of unique portfolio visitors in the hero and footer. Requires a
free **Vercel KV** or **Upstash Redis** database (persists across serverless cold starts).

**Vercel (recommended):** Project → Storage → Create Database → KV → Connect to project.
Vercel auto-injects `KV_REST_API_URL` and `KV_REST_API_TOKEN`.

**Upstash:** Create a Redis database at [upstash.com](https://upstash.com) and set
`UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` in `.env.local` / Vercel env vars.

Without these keys the counter stays hidden — everything else works normally.

---

## How it works

```
Browser  ──►  /api/chat (Next route, holds keys)  ──►  Claude (Haiku 4.5)
   ▲              │  guardrails: rate limit · daily cap · input screening · topic fence
   │              └─ returns { text, toolCalls }
   └── agent "hands" execute toolCalls: scroll, open project, book, theme, resume
```

- **Knowledge & persona:** `src/lib/knowledge.ts` (honest "allowed vs forbidden claims").
- **Single source of truth for all content:** `src/data/profile.ts`.
- **Tools the agent can call:** `src/lib/tools.ts` + `src/lib/agent-actions.ts`.
- **Voice pipeline:** `src/components/agent/useSpeech.ts` (premium TTS → browser fallback).
- **Premium TTS proxy:** `src/app/api/tts/route.ts`.

To update any content (projects, experience, links, bio), edit **`src/data/profile.ts`** —
the visible site and the AI twin both update automatically.

---

## Project structure

```
src/
├─ app/
│  ├─ layout.tsx            # fonts, SEO metadata
│  ├─ page.tsx              # assembles all sections
│  ├─ globals.css           # design tokens, motion, theme
│  └─ api/
│     ├─ chat/route.ts      # Claude proxy + guardrails + tool-use
│     ├─ tts/route.ts       # premium voice (ElevenLabs) w/ fallback
│     └─ visitors/route.ts  # unique visitor + page-view counter (KV/Redis)
├─ components/
│  ├─ layout/               # SmoothScroll, Navbar, Footer, CustomCursor
│  ├─ three/HeroScene.tsx   # R3F immersive 3D hero
│  ├─ sections/             # Hero, About, Experience, Projects, Skills, Writing, Contact
│  ├─ agent/                # AgentWidget + useSpeech (chat + voice)
│  └─ ui/                   # Reveal, SectionHeading
├─ data/profile.ts          # ← single source of truth
└─ lib/                     # knowledge (system prompt), tools, agent-actions
```

---

## Deploy (free, 24/7)

Recommended: **Vercel** (one click) or **Cloudflare** (Pages + Workers). Set the same env
vars in the dashboard. See `docs/PROJECT_PLAN.md` for the full Cloudflare 24/7 setup and
why the proxy keeps your API key safe.

```bash
npm run build && npm start   # production build locally
```

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |

---

Built with care. Content is back-checkable and honest by design.
