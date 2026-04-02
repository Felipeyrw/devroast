"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { CollapsibleCode } from "@/components/collapsible-code";
import { SectionTitle } from "@/components/ui/section-title";
import { useTRPC } from "@/trpc/client";

export function LeaderboardPreview() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.roast.leaderboard.queryOptions({ limit: 3 }),
  );

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <SectionTitle>shame_leaderboard</SectionTitle>
        </div>
        <p className="font-mono text-xs text-text-tertiary">
          {"//"} no roasts yet — be the first to submit terrible code
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Title Row */}
      <div className="flex items-center justify-between">
        <SectionTitle>shame_leaderboard</SectionTitle>
        <a
          href="/leaderboard"
          className="cursor-pointer border border-border-primary px-3 py-1.5 font-mono text-xs text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary"
        >
          view_all {"<<"}
        </a>
      </div>

      {/* Subtitle */}
      <p className="font-mono text-xs text-text-tertiary">
        {"//"} the worst code on the internet, ranked by shame
      </p>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-border-primary">
        {/* Header */}
        <div className="flex items-center border-b border-border-primary bg-bg-elevated px-5 py-3">
          <span className="w-16 font-mono text-xs text-text-tertiary">
            Rank
          </span>
          <span className="flex-1 font-mono text-xs text-text-tertiary">
            Roast
          </span>
        </div>

        {/* Rows */}
        {data.map((entry, index) => (
          <div
            key={entry.slug}
            className="flex border-b border-border-primary px-5 py-4 last:border-b-0"
          >
            {/* Rank + Score */}
            <div className="flex w-16 flex-col items-start gap-1">
              <span
                className={`font-mono text-xs font-bold ${index === 0 ? "text-accent-amber" : "text-text-secondary"}`}
              >
                #{index + 1}
              </span>
              <span className="font-mono text-xs text-accent-red">
                {Number(entry.score)}
              </span>
            </div>

            {/* Code + Language */}
            <div className="flex flex-1 flex-col gap-3">
              <CollapsibleCode
                code={entry.sourceCode}
                language={entry.language}
              />
              <span className="font-mono text-xs text-accent-cyan">
                {entry.language}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex justify-center py-4">
        <a
          href="/leaderboard"
          className="font-mono text-xs text-text-tertiary transition-colors hover:text-text-secondary"
        >
          showing top {data.length} · view full leaderboard {"<<"}
        </a>
      </div>
    </div>
  );
}
