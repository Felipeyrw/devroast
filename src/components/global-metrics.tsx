"use client";

import NumberFlow from "@number-flow/react";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export function GlobalMetrics() {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.stats.global.queryOptions());

  const total = Number(data?.total ?? 0);
  const avgScore = Number(data?.avgScore ?? 0);

  return (
    <div className="flex items-center justify-center gap-6">
      <span className="font-mono text-xs text-text-tertiary">
        <NumberFlow value={total} format={{ useGrouping: true }} /> codes
        roasted
      </span>
      <span className="font-mono text-xs text-text-tertiary">{"·"}</span>
      <span className="font-mono text-xs text-text-tertiary">
        avg score:{" "}
        <NumberFlow value={avgScore} format={{ maximumFractionDigits: 1 }} />
        /10
      </span>
    </div>
  );
}
