"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSpeech } from "@/components/agent/useSpeech";
import { executeToolCalls } from "@/lib/agent-actions";
import { profile } from "@/data/profile";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Give me a 20-second intro",
  "Walk me through your best project",
  "Are you open to opportunities?",
  "Book a quick call",
];

export default function AgentWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);
  const [greeted, setGreeted] = useState(false);

  const { listening, speaking, interim, sttSupported, startListening, stopListening, speak, stopSpeaking } =
    useSpeech();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollDown = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    });
  }, []);

  const send = useCallback(
    async (text: string) => {
      const clean = text.trim();
      if (!clean || thinking) return;
      stopSpeaking();
      const next: Msg[] = [...messages, { role: "user", content: clean }];
      setMessages(next);
      setInput("");
      setThinking(true);
      scrollDown();
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: next }),
        });
        const data = await res.json();
        const reply: string = data.text || "Sorry, I didn't catch that.";
        setMessages((m) => [...m, { role: "assistant", content: reply }]);
        if (Array.isArray(data.toolCalls) && data.toolCalls.length) executeToolCalls(data.toolCalls);
        if (voiceOn) speak(reply);
      } catch {
        setMessages((m) => [
          ...m,
          { role: "assistant", content: "I hit a network snag — try again in a moment." },
        ]);
      } finally {
        setThinking(false);
        scrollDown();
      }
    },
    [messages, thinking, voiceOn, speak, stopSpeaking, scrollDown]
  );

  // Open on global event + greet once.
  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("agent:open", onOpen);
    return () => window.removeEventListener("agent:open", onOpen);
  }, []);

  useEffect(() => {
    if (open && !greeted) {
      setGreeted(true);
      const greeting = `Hey, I'm ${profile.name}'s AI twin. Ask me anything about his work, or say "give me a tour" and I'll walk you through it.`;
      setMessages([{ role: "assistant", content: greeting }]);
      if (voiceOn) speak(greeting);
    }
  }, [open, greeted, voiceOn, speak]);

  useEffect(() => {
    if (open) scrollDown();
  }, [messages, thinking, open, scrollDown]);

  const toggleMic = () => {
    if (listening) {
      stopListening();
    } else {
      startListening((finalText) => send(finalText));
    }
  };

  const toggleVoice = () => {
    if (voiceOn) stopSpeaking();
    setVoiceOn((v) => !v);
  };

  return (
    <>
      {/* Launcher */}
      <button
        onClick={() => setOpen((o) => !o)}
        data-hover
        aria-label="Talk to Tanush's AI twin"
        className="fixed bottom-5 right-5 z-[70] flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--accent-contrast)] accent-glow transition-transform hover:scale-110"
      >
        {(speaking || listening) && (
          <span className="orb-pulse absolute inset-0 rounded-full bg-[var(--accent)]" />
        )}
        <span className="relative">{open ? <CloseIcon /> : <MicIcon />}</span>
      </button>

      {/* Panel */}
      <div
        className={`fixed bottom-24 right-5 z-[70] flex w-[calc(100vw-2.5rem)] max-w-[380px] flex-col overflow-hidden rounded-3xl border border-line transition-all duration-300 sm:w-[380px] ${
          open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
        style={{ height: "min(560px, 70svh)", background: "color-mix(in srgb, var(--bg-elev) 88%, transparent)", backdropFilter: "blur(18px)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent)]/15 font-display text-sm font-bold text-[var(--accent)]">
              {profile.initials}
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[var(--bg-elev)] bg-[var(--accent-2)]" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight">{profile.name}&apos;s AI twin</p>
              <p className="text-[11px] text-muted">
                {listening ? "Listening…" : speaking ? "Speaking…" : thinking ? "Thinking…" : "Online"}
              </p>
            </div>
          </div>
          <button
            onClick={toggleVoice}
            data-hover
            aria-label={voiceOn ? "Mute voice" : "Unmute voice"}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-muted hover:text-fg"
          >
            {voiceOn ? <SpeakerIcon /> : <MuteIcon />}
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-[var(--accent)] text-[var(--accent-contrast)]"
                    : "border border-line bg-bg/40 text-fg/90"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {listening && interim && (
            <div className="flex justify-end">
              <div className="max-w-[85%] rounded-2xl bg-[var(--accent)]/40 px-3.5 py-2.5 text-sm italic text-[var(--accent-contrast)]">
                {interim}…
              </div>
            </div>
          )}
          {thinking && (
            <div className="flex justify-start">
              <div className="flex gap-1 rounded-2xl border border-line bg-bg/40 px-4 py-3">
                {[0, 1, 2].map((d) => (
                  <span
                    key={d}
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted"
                    style={{ animationDelay: `${d * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          )}

          {messages.length <= 1 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  data-hover
                  className="rounded-full border border-line px-3 py-1.5 text-xs text-muted transition-colors hover:border-[var(--accent)] hover:text-fg"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Composer */}
        <div className="border-t border-line p-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2"
          >
            {sttSupported && (
              <button
                type="button"
                onClick={toggleMic}
                data-hover
                aria-label={listening ? "Stop listening" : "Start talking"}
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors ${
                  listening ? "bg-[var(--accent-warm)] text-[var(--accent-contrast)]" : "border border-line text-muted hover:text-fg"
                }`}
              >
                <MicIcon />
              </button>
            )}
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={sttSupported ? "Type or tap the mic…" : "Type a message…"}
              className="min-w-0 flex-1 rounded-full border border-line bg-bg/40 px-4 py-2.5 text-sm outline-none placeholder:text-muted focus:border-[var(--accent)]"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              data-hover
              aria-label="Send"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--accent-contrast)] transition-opacity disabled:opacity-40"
            >
              <SendIcon />
            </button>
          </form>
          <p className="mt-2 text-center text-[10px] text-muted">
            AI twin · may be imperfect · verify key details with Tanush
          </p>
        </div>
      </div>
    </>
  );
}

function MicIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10a7 7 0 0 1-14 0M12 17v4" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}
function SpeakerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 5 6 9H2v6h4l5 4V5Z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a9 9 0 0 1 0 14" />
    </svg>
  );
}
function MuteIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 5 6 9H2v6h4l5 4V5Z" />
      <path d="m23 9-6 6M17 9l6 6" />
    </svg>
  );
}
