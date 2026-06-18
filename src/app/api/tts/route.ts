import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// Premium voice via ElevenLabs when configured. If no key is present we return
// 204 so the client gracefully falls back to the free browser SpeechSynthesis.
// Swap ELEVENLABS for Cartesia/Deepgram by changing this one route.
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || "EXAVITQu4vr4xnSDxMaL"; // default warm voice
const MODEL = process.env.ELEVENLABS_MODEL || "eleven_flash_v2_5"; // ~75ms, low latency

export async function POST(req: NextRequest) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) return new NextResponse(null, { status: 204 });

  let text = "";
  try {
    ({ text } = await req.json());
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  if (!text || text.length > 1200) return new NextResponse(null, { status: 204 });

  try {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/stream?optimize_streaming_latency=3`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: MODEL,
          voice_settings: { stability: 0.4, similarity_boost: 0.75, style: 0.3 },
        }),
      }
    );
    if (!res.ok || !res.body) return new NextResponse(null, { status: 204 });
    return new NextResponse(res.body, {
      status: 200,
      headers: { "Content-Type": "audio/mpeg", "Cache-Control": "no-store" },
    });
  } catch {
    return new NextResponse(null, { status: 204 });
  }
}
