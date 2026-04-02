"use client";

import { useState } from "react";

type FilterPeriod = "all-time" | "this-month";

export function LeaderboardFilters() {
  const [activeFilter, setActiveFilter] = useState<FilterPeriod>("all-time");

  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={() => setActiveFilter("all-time")}
        className={`cursor-pointer font-mono text-sm transition-colors ${
          activeFilter === "all-time"
            ? "text-accent-green"
            : "text-text-tertiary hover:text-text-secondary"
        }`}
      >
        All Time
      </button>
      <button
        type="button"
        onClick={() => setActiveFilter("this-month")}
        className={`cursor-pointer font-mono text-sm transition-colors ${
          activeFilter === "this-month"
            ? "text-accent-green"
            : "text-text-tertiary hover:text-text-secondary"
        }`}
      >
        This Month
      </button>
    </div>
  );
}
