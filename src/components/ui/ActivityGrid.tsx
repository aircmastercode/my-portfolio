"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ActivityDay, ActivityPayload } from "@/lib/activity";
import {
  activityMask,
  describeDay,
  formatDayLabel,
  intensityLevel,
} from "@/lib/activity";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

type Props = {
  data: ActivityPayload;
};

type TooltipState = {
  day: ActivityDay;
  x: number;
  y: number;
} | null;

function maskClass(mask: number, level: number): string {
  if (mask === 0 || level === 0) return "activity-cell--empty";
  return `activity-cell--m${mask} activity-cell--l${level}`;
}

function buildWeeks(days: ActivityDay[]): ActivityDay[][] {
  if (days.length === 0) return [];
  const weeks: ActivityDay[][] = [];
  let week: ActivityDay[] = [];

  const firstDow = new Date(`${days[0].date}T12:00:00`).getDay();
  for (let i = 0; i < firstDow; i++) {
    week.push({ date: "", github: 0, leetcode: 0, codeforces: 0 });
  }

  for (const day of days) {
    week.push(day);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length > 0) {
    while (week.length < 7) {
      week.push({ date: "", github: 0, leetcode: 0, codeforces: 0 });
    }
    weeks.push(week);
  }
  return weeks;
}

function monthTicks(days: ActivityDay[]): { label: string; weekIndex: number }[] {
  const ticks: { label: string; weekIndex: number }[] = [];
  let lastMonth = -1;
  const weeks = buildWeeks(days);
  weeks.forEach((week, weekIndex) => {
    const firstReal = week.find((d) => d.date);
    if (!firstReal?.date) return;
    const month = new Date(`${firstReal.date}T12:00:00`).getMonth();
    if (month !== lastMonth) {
      ticks.push({ label: MONTH_LABELS[month], weekIndex });
      lastMonth = month;
    }
  });
  return ticks;
}

export default function ActivityGrid({ data }: Props) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipState>(null);

  const weeks = useMemo(() => buildWeeks(data.days), [data.days]);
  const ticks = useMemo(() => monthTicks(data.days), [data.days]);

  const showTooltip = (day: ActivityDay, el: HTMLElement) => {
    if (!day.date) return;
    const grid = gridRef.current;
    if (!grid) return;
    const gridRect = grid.getBoundingClientRect();
    const cellRect = el.getBoundingClientRect();
    setTooltip({
      day,
      x: cellRect.left - gridRect.left + cellRect.width / 2,
      y: cellRect.top - gridRect.top - 8,
    });
  };

  return (
    <div className="relative">
      <div className="mb-3 flex flex-wrap items-center gap-4 text-xs text-muted">
        <LegendSwatch mask={1} label="GitHub" />
        <LegendSwatch mask={2} label="LeetCode" />
        <LegendSwatch mask={4} label="Codeforces" />
        <LegendSwatch mask={3} label="GitHub + LeetCode" />
        <LegendSwatch mask={7} label="All three" />
        <span className="ml-auto font-mono text-[10px] tracking-widest uppercase">
          {data.totals.activeDays} active days · last 12 months
        </span>
      </div>

      <div ref={gridRef} className="activity-grid-wrap relative overflow-x-auto pb-2">
        <div className="inline-flex min-w-full flex-col gap-1">
          <div className="flex gap-1 pl-8">
            {ticks.map((t) => (
              <span
                key={`${t.label}-${t.weekIndex}`}
                className="font-mono text-[10px] text-muted"
                style={{
                  position: "relative",
                  left: `${t.weekIndex * 14}px`,
                  marginRight: t.weekIndex === 0 ? 0 : undefined,
                }}
              >
                {t.label}
              </span>
            ))}
          </div>

          <div className="flex gap-1">
            <div className="flex w-7 shrink-0 flex-col justify-between py-[2px] text-[9px] text-muted">
              {WEEKDAY_LABELS.map((d, i) => (
                <span key={d} className={i % 2 === 0 ? "opacity-0" : ""}>
                  {d}
                </span>
              ))}
            </div>

            <div className="flex gap-[3px]">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[3px]">
                  {week.map((day, di) => {
                    if (!day.date) {
                      return <span key={`${wi}-${di}`} className="activity-cell activity-cell--pad" />;
                    }
                    const mask = activityMask(day);
                    const level = intensityLevel(day);
                    return (
                      <button
                        key={day.date}
                        type="button"
                        aria-label={`${formatDayLabel(day.date)}: ${describeDay(day).join(", ")}`}
                        className={`activity-cell ${maskClass(mask, level)}`}
                        onMouseEnter={(e) => showTooltip(day, e.currentTarget)}
                        onFocus={(e) => showTooltip(day, e.currentTarget)}
                        onMouseLeave={() => setTooltip(null)}
                        onBlur={() => setTooltip(null)}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {tooltip && (
          <div
            className="activity-tooltip pointer-events-none absolute z-20"
            style={{
              left: tooltip.x,
              top: tooltip.y,
              transform: "translate(-50%, -100%)",
            }}
          >
            <p className="font-mono text-[11px] text-[var(--accent)]">
              {formatDayLabel(tooltip.day.date)}
            </p>
            <ul className="mt-1.5 space-y-1">
              {describeDay(tooltip.day).map((line) => (
                <li key={line} className="text-xs text-fg/90">
                  {line}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function LegendSwatch({ mask, label }: { mask: number; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`activity-cell activity-cell--legend ${maskClass(mask, 3)}`} />
      {label}
    </span>
  );
}

function ActivityGridLoader() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="h-3 w-48 rounded bg-line" />
      <div className="h-[112px] w-full max-w-3xl rounded-2xl bg-line/60" />
    </div>
  );
}

export function ActivityGridClient() {
  const [data, setData] = useState<ActivityPayload | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/activity")
      .then((r) => {
        if (!r.ok) throw new Error("fetch failed");
        return r.json();
      })
      .then(setData)
      .catch(() => setError(true));
  }, []);

  if (error) {
    return (
      <p className="text-sm text-muted">
        Activity data is temporarily unavailable. Check back soon.
      </p>
    );
  }

  if (!data) return <ActivityGridLoader />;
  return <ActivityGrid data={data} />;
}
