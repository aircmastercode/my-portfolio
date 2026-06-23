import { NextResponse } from "next/server";
import { fetchActivityData } from "@/lib/activity";

export const runtime = "nodejs";
export const revalidate = 3600;

export async function GET() {
  try {
    const data = await fetchActivityData();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    });
  } catch {
    return NextResponse.json({ error: "activity_unavailable" }, { status: 503 });
  }
}
