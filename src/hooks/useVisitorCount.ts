"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "portfolio-visitor-id";

export type VisitorCounts = {
  unique: number;
  total: number;
  configured: boolean;
};

function getOrCreateVisitorId(): string {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (existing) return existing;
  const id = crypto.randomUUID();
  localStorage.setItem(STORAGE_KEY, id);
  return id;
}

export function useVisitorCount() {
  const [counts, setCounts] = useState<VisitorCounts | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const track = async () => {
      try {
        const visitorId = getOrCreateVisitorId();
        const res = await fetch("/api/visitors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ visitorId }),
        });

        if (!res.ok) {
          const fallback = await fetch("/api/visitors", { cache: "no-store" });
          if (fallback.ok && !cancelled) {
            setCounts(await fallback.json());
          }
          return;
        }

        if (!cancelled) {
          setCounts(await res.json());
        }
      } catch {
        try {
          const res = await fetch("/api/visitors", { cache: "no-store" });
          if (res.ok && !cancelled) {
            setCounts(await res.json());
          }
        } catch {
          // Counter stays hidden when storage isn't configured.
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    track();
    return () => {
      cancelled = true;
    };
  }, []);

  return { counts, loading };
}
