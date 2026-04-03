import { Suspense } from "react";
import { LeaderboardFilters } from "@/components/leaderboard-filters";
import { LeaderboardFull } from "@/components/leaderboard-full";
import { LeaderboardFullSkeleton } from "@/components/leaderboard-full-skeleton";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage(props: {
  searchParams: Promise<{ period?: string }>;
}) {
  const { period = "all-time" } = await props.searchParams;
  const validPeriod =
    period === "this-month" ? "this-month" : "all-time";

  void Promise.all([
    prefetch(
      trpc.roast.leaderboard.queryOptions({ limit: 20, period: validPeriod }),
    ),
    prefetch(trpc.stats.global.queryOptions()),
  ]);

  return (
    <HydrateClient>
      <main className="flex-1 px-10 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex items-start justify-between">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <svg
                  className="h-5 w-5 text-accent-amber"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12 2L1 21h22L12 2zm0 4l7.53 13H4.47L12 6zm-1 5v4h2v-4h-2zm0 6v2h2v-2h-2z" />
                </svg>
                <h1 className="font-mono text-2xl font-bold text-text-primary">
                  Shame Leaderboard
                </h1>
              </div>
              <p className="font-mono text-sm text-text-secondary">
                The worst code submissions that got roasted the hardest
              </p>
            </div>
            <LeaderboardFilters />
          </div>
          <Suspense fallback={<LeaderboardFullSkeleton />}>
            <LeaderboardFull />
          </Suspense>
        </div>
      </main>
    </HydrateClient>
  );
}
