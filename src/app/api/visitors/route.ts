import { NextRequest, NextResponse } from "next/server";
import {
  getVisitorCounts,
  isValidVisitorId,
  recordVisit,
} from "@/lib/visitors";

export const runtime = "edge";

const ipHits = new Map<string, number[]>();
const RATE_LIMIT_PER_MIN = 30;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - 60_000;
  const hits = (ipHits.get(ip) || []).filter((t) => t > windowStart);
  hits.push(now);
  ipHits.set(ip, hits);
  return hits.length > RATE_LIMIT_PER_MIN;
}

function clientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "anon"
  );
}

export async function GET() {
  try {
    const counts = await getVisitorCounts();
    return NextResponse.json(counts, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json(
      { unique: 0, total: 0, configured: false, error: "unavailable" },
      { status: 503 }
    );
  }
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: { visitorId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const visitorId = body.visitorId?.trim();
  if (!visitorId || !isValidVisitorId(visitorId)) {
    return NextResponse.json({ error: "invalid_visitor_id" }, { status: 400 });
  }

  try {
    const counts = await recordVisit(visitorId);
    return NextResponse.json(counts, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json(
      { unique: 0, total: 0, configured: false, error: "unavailable" },
      { status: 503 }
    );
  }
}
