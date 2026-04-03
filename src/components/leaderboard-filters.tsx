"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type FilterPeriod = "all-time" | "this-month";

export function LeaderboardFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeFilter =
    (searchParams.get("period") as FilterPeriod) || "all-time";

  function setFilter(period: FilterPeriod) {
    const params = new URLSearchParams(searchParams);
    params.set("period", period);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={() => setFilter("all-time")}
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
        onClick={() => setFilter("this-month")}
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
