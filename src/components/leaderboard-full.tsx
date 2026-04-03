"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { CollapsibleCode } from "@/components/collapsible-code";
import { useTRPC } from "@/trpc/client";

function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);

  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  if (diffWeek < 5) return `${diffWeek}w ago`;
  return `${diffMonth}mo ago`;
}

export function LeaderboardFull() {
  const trpc = useTRPC();
  const searchParams = useSearchParams();
  const period =
    (searchParams.get("period") as "all-time" | "this-month") || "all-time";

  const { data } = useSuspenseQuery(
    trpc.roast.leaderboard.queryOptions({ limit: 20, period }),
  );

  if (!data || data.length === 0) {
    return (
      <p className="font-mono text-sm text-text-tertiary">
        {"//"} no roasts yet — be the first to submit terrible code
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border-primary">
      {/* Header */}
      <div className="flex items-center border-b border-border-primary bg-bg-elevated px-5 py-3">
        <span className="w-16 font-mono text-xs text-text-tertiary">Rank</span>
        <span className="flex-1 font-mono text-xs text-text-tertiary">
          Roast
        </span>
        <span className="w-32 text-right font-mono text-xs text-text-tertiary">
          Created At
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

          {/* Created At */}
          <div className="flex w-32 items-start justify-end">
            <span className="font-mono text-xs text-text-secondary">
              {formatRelativeDate(new Date(entry.createdAt))}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
