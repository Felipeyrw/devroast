"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { SectionTitle } from "@/components/ui/section-title";
import { TableRow, TableRowCell } from "@/components/ui/table-row";
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
      <div className="overflow-hidden rounded border border-border-primary">
        {/* Header */}
        <div className="flex h-10 items-center gap-0 bg-bg-surface px-5">
          <span className="w-[50px] font-mono text-xs font-medium text-text-tertiary">
            #
          </span>
          <span className="w-[70px] font-mono text-xs font-medium text-text-tertiary">
            score
          </span>
          <span className="flex-1 font-mono text-xs font-medium text-text-tertiary">
            code
          </span>
          <span className="w-[100px] text-right font-mono text-xs font-medium text-text-tertiary">
            lang
          </span>
        </div>

        {/* Rows */}
        {data.map((entry, index) => (
          <TableRow key={entry.slug}>
            <TableRowCell variant="rank">{index + 1}</TableRowCell>
            <TableRowCell variant="score">{Number(entry.score)}</TableRowCell>
            <TableRowCell variant="code">
              <div className="line-clamp-3 whitespace-pre-wrap font-mono">
                {entry.sourceCode}
              </div>
            </TableRowCell>
            <TableRowCell variant="lang">{entry.language}</TableRowCell>
          </TableRow>
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
