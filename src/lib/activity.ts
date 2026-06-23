import { profile } from "@/data/profile";

export type ActivitySource = "github" | "leetcode" | "codeforces";

export type ActivityDay = {
  date: string;
  github: number;
  leetcode: number;
  codeforces: number;
};

export type ActivityPayload = {
  days: ActivityDay[];
  totals: {
    github: number;
    leetcode: number;
    codeforces: number;
    activeDays: number;
  };
  handles: typeof profile.codingPlatforms;
  fetchedAt: string;
};

const CACHE_SECONDS = 60 * 60; // 1 hour

function dateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function lastYearRange(): { start: string; end: string } {
  const end = new Date();
  const start = new Date(end);
  start.setFullYear(start.getFullYear() - 1);
  start.setDate(start.getDate() + 1);
  return { start: dateKey(start), end: dateKey(end) };
}

function emptyDayMap(): Map<string, ActivityDay> {
  const map = new Map<string, ActivityDay>();
  const { start, end } = lastYearRange();
  const cursor = new Date(`${start}T00:00:00Z`);
  const endDate = new Date(`${end}T00:00:00Z`);

  while (cursor <= endDate) {
    const key = dateKey(cursor);
    map.set(key, { date: key, github: 0, leetcode: 0, codeforces: 0 });
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return map;
}

async function fetchGitHub(handle: string): Promise<Map<string, number>> {
  const counts = new Map<string, number>();
  try {
    const res = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(handle)}?y=last`,
      { next: { revalidate: CACHE_SECONDS } }
    );
    if (!res.ok) return counts;
    const data = (await res.json()) as {
      contributions?: { date: string; count: number }[];
    };
    for (const c of data.contributions ?? []) {
      counts.set(c.date, c.count);
    }
  } catch {
    // Graceful degradation — other platforms still render.
  }
  return counts;
}

async function fetchLeetCode(handle: string): Promise<Map<string, number>> {
  const counts = new Map<string, number>();
  const years = [new Date().getFullYear() - 1, new Date().getFullYear()];

  for (const year of years) {
    try {
      const res = await fetch("https://leetcode.com/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `query ($username: String!, $year: Int!) {
            matchedUser(username: $username) {
              userCalendar(year: $year) { submissionCalendar }
            }
          }`,
          variables: { username: handle, year },
        }),
        next: { revalidate: CACHE_SECONDS },
      });
      if (!res.ok) continue;
      const data = (await res.json()) as {
        data?: {
          matchedUser?: { userCalendar?: { submissionCalendar?: string } };
        };
      };
      const raw = data.data?.matchedUser?.userCalendar?.submissionCalendar;
      if (!raw) continue;
      const parsed = JSON.parse(raw) as Record<string, number>;
      for (const [ts, count] of Object.entries(parsed)) {
        const key = dateKey(new Date(Number(ts) * 1000));
        counts.set(key, (counts.get(key) ?? 0) + count);
      }
    } catch {
      // Continue with other years / platforms.
    }
  }
  return counts;
}

async function fetchCodeforces(handle: string): Promise<Map<string, number>> {
  const counts = new Map<string, number>();
  if (!handle) return counts;

  try {
    const res = await fetch(
      `https://codeforces.com/api/user.status?handle=${encodeURIComponent(handle)}&from=1&count=5000`,
      { next: { revalidate: CACHE_SECONDS } }
    );
    if (!res.ok) return counts;
    const data = (await res.json()) as {
      status: string;
      result?: { creationTimeSeconds: number }[];
    };
    if (data.status !== "OK" || !data.result) return counts;

    const { start } = lastYearRange();
    for (const sub of data.result) {
      const key = dateKey(new Date(sub.creationTimeSeconds * 1000));
      if (key < start) continue;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  } catch {
    // User may not have a Codeforces account — that's fine.
  }
  return counts;
}

export async function fetchActivityData(): Promise<ActivityPayload> {
  const { github, leetcode, codeforces } = profile.codingPlatforms;
  const [gh, lc, cf] = await Promise.all([
    fetchGitHub(github),
    fetchLeetCode(leetcode),
    fetchCodeforces(codeforces),
  ]);

  const daysMap = emptyDayMap();
  for (const [date, day] of daysMap) {
    day.github = gh.get(date) ?? 0;
    day.leetcode = lc.get(date) ?? 0;
    day.codeforces = cf.get(date) ?? 0;
  }

  const days = Array.from(daysMap.values());
  let githubTotal = 0;
  let leetcodeTotal = 0;
  let codeforcesTotal = 0;
  let activeDays = 0;

  for (const d of days) {
    githubTotal += d.github;
    leetcodeTotal += d.leetcode;
    codeforcesTotal += d.codeforces;
    if (d.github + d.leetcode + d.codeforces > 0) activeDays += 1;
  }

  return {
    days,
    totals: {
      github: githubTotal,
      leetcode: leetcodeTotal,
      codeforces: codeforcesTotal,
      activeDays,
    },
    handles: profile.codingPlatforms,
    fetchedAt: new Date().toISOString(),
  };
}

export type ActivityMask = number;

export function activityMask(day: ActivityDay): ActivityMask {
  let mask = 0;
  if (day.github > 0) mask |= 1;
  if (day.leetcode > 0) mask |= 2;
  if (day.codeforces > 0) mask |= 4;
  return mask;
}

export function intensityLevel(day: ActivityDay): number {
  const total = day.github + day.leetcode + day.codeforces;
  if (total === 0) return 0;
  if (total <= 2) return 1;
  if (total <= 5) return 2;
  if (total <= 10) return 3;
  return 4;
}

export function describeDay(day: ActivityDay): string[] {
  const lines: string[] = [];
  if (day.github > 0) {
    lines.push(
      `${day.github} GitHub contribution${day.github === 1 ? "" : "s"}`
    );
  }
  if (day.leetcode > 0) {
    lines.push(
      `${day.leetcode} LeetCode submission${day.leetcode === 1 ? "" : "s"}`
    );
  }
  if (day.codeforces > 0) {
    lines.push(
      `${day.codeforces} Codeforces submission${day.codeforces === 1 ? "" : "s"}`
    );
  }
  if (lines.length === 0) lines.push("No coding activity");
  return lines;
}

export function formatDayLabel(date: string): string {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
