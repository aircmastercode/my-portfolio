"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { ActivityGridClient } from "@/components/ui/ActivityGrid";
import { profile } from "@/data/profile";

export default function Activity() {
  const { github, leetcode, codeforces } = profile.codingPlatforms;

  return (
    <section id="activity" className="mx-auto max-w-6xl px-6 py-28">
      <SectionHeading
        index="07"
        title="Coding activity"
        subtitle="A year of building on GitHub, grinding LeetCode, and competing on Codeforces — one grid, color-coded by platform."
      />

      <Reveal>
        <div className="glass-card p-6 sm:p-8">
          <div className="mb-6 flex flex-wrap gap-4 text-sm text-muted">
            <PlatformLink
              label="GitHub"
              handle={github}
              href={`https://github.com/${github}`}
            />
            <PlatformLink
              label="LeetCode"
              handle={leetcode}
              href={`https://leetcode.com/u/${leetcode}`}
            />
            <PlatformLink
              label="Codeforces"
              handle={codeforces}
              href={`https://codeforces.com/profile/${codeforces}`}
            />
          </div>
          <ActivityGridClient />
        </div>
      </Reveal>
    </section>
  );
}

function PlatformLink({
  label,
  handle,
  href,
}: {
  label: string;
  handle: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-hover
      className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 transition-colors hover:border-[var(--accent)]"
    >
      <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--accent)]">
        {label}
      </span>
      <span className="text-fg/90">@{handle}</span>
    </a>
  );
}
