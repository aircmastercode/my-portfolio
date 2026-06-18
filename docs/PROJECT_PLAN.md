# The Talking Portfolio

> An immersive, AI-powered personal portfolio where visitors don't just *read* about me —
> they **talk** to an AI version of me that speaks back, scrolls and navigates the site for
> them, answers anything about my work, and books an interview on the spot.

This document is the master plan: architecture, design, features, costs, guardrails, and the
full build roadmap. It is the source of truth for the project.

---

## 1. Vision & Goals

Build a portfolio that makes **anyone** — founder, CTO, CEO, HR/recruiter, or fellow engineer —
stop, explore, and remember. The signature feature: a **speech-to-speech AI agent** that talks
with visitors (with proper guardrails), knows everything about me, can physically scroll/navigate
the site, and can schedule an interview when asked.

**Non-negotiables**
- Runs **24/7**.
- **Near-free** to operate (target: a few dollars/month max, with hard cost caps).
- **Amazes everyone, alienates no one** — immersive *and* fast, clear, accessible.
- A visitor should find **no reason to leave**.

**Locked-in decisions** (from planning)
- **Design:** Full immersive 3D scroll-driven world (Awwwards 2026 style).
- **Voice:** Premium, human-like voice (ElevenLabs / Cartesia), not robotic browser voice.
- **Stack:** Next.js + React.
- **Hosting:** Cloudflare (Pages + Workers).
- **AI brain:** Anthropic Claude (only API key currently available).

---

## 2. The Core Reality: Voice = a Pipeline

Anthropic provides the **brain** (Claude) but **no ears or mouth**. A voice agent is always:

```
🎤 Listen (STT) ───▶ 🧠 Think (Claude) ───▶ 🔊 Speak (TTS)
```

| Role | Choice (this project) | Notes |
|------|----------------------|-------|
| STT (ears) | **Deepgram / AssemblyAI** (WebSocket, cross-browser) | Premium path works in all browsers, not just Chrome |
| Brain | **Claude Haiku 4.5** (fast) + Sonnet 4.6 fallback for hard questions | Cached system prompt = cheap |
| TTS (mouth) | **ElevenLabs Flash v2.5 (~75ms)** or **Cartesia Sonic (~40ms)** | Human, expressive, low latency |

We build on the **CompositeVoice** 5-role pipeline SDK so providers are swappable with a
one-line change (e.g., drop in a cheaper TTS later).

**Graceful degradation:** if the mic is denied or a browser misbehaves, the agent silently falls
back to a beautiful **text chat** — same brain, same personality, same abilities. No dead ends.

---

## 3. System Architecture

```
┌─────────────────────── VISITOR'S BROWSER (Next.js) ──────────────────────┐
│  Immersive 3D world (Three.js / R3F + GSAP + Lenis)                        │
│  Voice UI: press-to-talk · live transcript · interruptible playback       │
│  STT (Deepgram WS) → → → → → → → → → → → → → → → → ▲ TTS (ElevenLabs WS)    │
│  Agent "hands" (Claude tool-use executed client-side):                    │
│     scrollToSection() · openProject() · highlightSkill() · bookMeeting()  │
└───────────────────────────────────┬──────────────────────────────────────┘
                                    │ HTTPS / WSS  (NO API keys in browser)
                                    ▼
┌──────────────────── CLOUDFLARE WORKER (proxy + gateway) ──────────────────┐
│  • Holds ALL API keys (Anthropic, Deepgram, ElevenLabs)                    │
│  • Rate limiting + per-session token budget (Workers KV)                   │
│  • Global daily spend cap + kill-switch to text-only                       │
│  • Prompt-injection screening + topic fence                                │
│  • Builds Claude request: cached "knowledge pack" + tool defs              │
└───────────────────────────────────┬──────────────────────────────────────┘
                                    ▼
                Anthropic Claude  ·  Deepgram  ·  ElevenLabs
```

**Why this is 24/7 and (almost) free**
- **Cloudflare Pages** (frontend): free, *unlimited bandwidth*, global CDN, ~0ms cold start.
- **Cloudflare Workers** (backend proxy): **100k requests/day free**, **always-on, ~0ms cold
  start, no sleep**. (Render's free tier sleeps 15 min → 30–60s cold start — rejected for that.)
- A proxy is mandatory: it's the only place keys live, so they can't be stolen from the browser.

---

## 4. Cost Model

- **Claude Haiku 4.5:** $1/M input, $5/M output; **prompt caching → cached input $0.10/M (90% off)**.
  The knowledge pack is a stable, cached system prompt → near-free per call.
- **Hosting (Cloudflare):** $0.
- **STT/TTS (premium):** the only real variable cost.
  - Cartesia: free tier, then ~$4/mo Pro. ElevenLabs: from ~$5/mo.
- **Estimate:** one full conversation ≈ <$0.01 brain + a few cents voice.
  Light traffic (≈100–200 chats/mo) ≈ **a few dollars/month total**, hard-capped by §6.

A **free launch mode** is kept available (native browser STT/TTS) as a fallback if premium voice
budget is ever exceeded.

---

## 5. Design — Immersive 3D Scroll World

2026 Awwwards winners are overwhelmingly **scroll-driven 3D environments** (61% of Sites of the Day).
We build a persistent 3D world where **scroll = camera movement** through chapters of my story.

**Stack:** Three.js (via React Three Fiber + drei) · GSAP (ScrollTrigger, Observer, SplitText) ·
Lenis (smooth scroll) · custom GLSL shaders · postprocessing (bloom, vignette, grain).

**Experience chapters (each = a 3D scene the camera flies through):**
1. **Hero** — a striking shader/3D world + name + one-line identity; the AI agent invites you to talk.
2. **About** — my story, revealed as the camera drifts.
3. **Projects** — featured work as interactive 3D objects/cards.
4. **Skills & Stack** — animated, spatial.
5. **Experience / Timeline.**
6. **Contact / Book a call** — the closing scene.

**Performance & inclusivity (so it amazes without alienating):**
- Draco-compressed GLTF, KTX2/Basis textures, GPU instancing, lazy scenes → hold 60fps.
- Mobile: lower-res shaders / simplified scenes.
- **`prefers-reduced-motion`** → graceful static-elegant mode.
- Fast first paint; 3D streams in. A busy exec still gets the info in seconds.

The **voice agent is the ultimate wow**: no other portfolio talks back, drives itself, and books a
meeting by voice.

---

## 6. Guardrails (public AI bot safety + cost safety)

Layered, standard 2026 practice:
1. **Key isolation** — keys only in the Worker.
2. **Rate limiting** — per-IP/session request + token limits (Workers KV).
3. **Global daily budget cap** — hard ceiling; on hit, auto-switch to text-only "quick break" mode.
   The bill **cannot** run away.
4. **System-prompt hardening + topic fence** — only discusses me/my work; deflects off-topic and
   jailbreak attempts politely.
5. **Prompt-injection screening** on input; **max conversation length** per session.
6. **No secrets** in the knowledge pack — public-safe facts only.

---

## 7. Feature Set

**Voice agent**
- Press-to-talk (+ optional wake word), live transcript, interruptible playback.
- Speaks in first person as my "AI twin," with my real personality and facts.

**Agent "hands" (Claude tool-use → client executes)**
- `scrollToSection(id)` — navigates/scrolls the 3D world while talking.
- `openProject(id)`, `highlightSkill(name)`, `switchTheme(mode)`, `downloadResume()`.
- `bookMeeting()` — opens the scheduler.

**Scheduling**
- **Cal.com** free embed (modal/inline); agent triggers it; visitor books; I get the invite. No backend.

**Trust & conversion**
- Smart suggested prompts ("Ask about his React work", "Is he open to roles?").
- Audience-adaptive intro (recruiter vs founder vs engineer).
- Optional lead capture / "email me this conversation."

---

## 8. Tech Stack Summary

| Layer | Choice |
|-------|--------|
| Framework | **Next.js + React** |
| 3D / motion | React Three Fiber + drei, GSAP, Lenis, GLSL, postprocessing |
| Voice pipeline | CompositeVoice (Deepgram STT + Anthropic + ElevenLabs/Cartesia TTS) |
| Brain | Claude Haiku 4.5 (+ Sonnet 4.6 fallback), prompt caching |
| Backend | Cloudflare Worker (Hono) + Workers KV |
| Scheduling | Cal.com free embed |
| Hosting | Cloudflare Pages + Workers ($0/mo) |

---

## 9. Build Roadmap

- [ ] **Phase 0 — Content & identity.** Collect resume, links (LinkedIn/GitHub/site), projects,
      personality, FAQ → build the **knowledge pack**. *(Structure built with placeholders first;
      real content dropped in as provided.)*
- [ ] **Phase 1 — Clean foundation.** Next.js app, responsive layout, all sections with placeholder
      content. Looks great with zero AI/3D yet.
- [ ] **Phase 2 — Worker proxy.** Claude integration, guardrails, rate limits, daily cap.
- [ ] **Phase 3 — Text chat agent.** The brain working in a chat box (works everywhere).
- [ ] **Phase 4 — Premium voice.** Deepgram STT + ElevenLabs/Cartesia TTS pipeline, press-to-talk,
      transcript, interruptible playback, text fallback.
- [ ] **Phase 5 — Agent hands.** Scroll/navigate tools + Cal.com booking via tool-use.
- [ ] **Phase 6 — Immersive 3D.** R3F world, scroll-driven camera, shaders, GSAP/Lenis, perf passes,
      reduced-motion mode.
- [ ] **Phase 7 — Deploy.** Cloudflare, custom domain, real device/browser testing, polish.

---

## 10. Environment Variables (server-side only, in the Worker)

```
ANTHROPIC_API_KEY=        # provided
DEEPGRAM_API_KEY=         # STT (premium voice)
ELEVENLABS_API_KEY=       # or CARTESIA_API_KEY for TTS
DAILY_BUDGET_USD=         # hard cost cap
RATE_LIMIT_PER_MIN=       # abuse protection
CAL_LINK=                 # Cal.com event link
```

> Keys never ship to the browser. The Next.js frontend talks only to the Worker.

---

## 11. Open Items / TODO from owner

- [ ] Provide resume / CV.
- [ ] Provide links: LinkedIn, GitHub, existing site, socials.
- [ ] List featured projects (name, 1-liner, role, stack, link, image).
- [ ] Personality/voice notes (tone, do's & don'ts, fun facts).
- [ ] Preferred domain name.
- [ ] Create Cal.com account + event type; share the link.
- [ ] Decide ElevenLabs vs Cartesia for TTS voice.

---

## 12. Research Sources

Architecture/design/cost decisions above are grounded in 20+ current sources, including:
CompositeVoice (voice pipeline SDK), Anthropic Claude pricing & tool-use / computer-use docs,
Cloudflare vs Render/Vercel free-tier comparisons (2026), Awwwards 2026 immersive-3D analysis &
Codrops scroll-driven 3D tutorials, ElevenLabs/Cartesia/Inworld/Deepgram TTS benchmarks (2026),
Cal.com embed docs, and LLM guardrail / gateway / rate-limiting best-practice guides.
