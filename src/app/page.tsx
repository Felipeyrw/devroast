import { Suspense } from "react";
import { CodeEditorSection } from "@/components/code-editor-section";
import { GlobalMetrics } from "@/components/global-metrics";
import { LeaderboardPreview } from "@/components/leaderboard-preview";
import { LeaderboardSkeleton } from "@/components/leaderboard-skeleton";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

export default function HomePage() {
  void Promise.all([
    prefetch(trpc.stats.global.queryOptions()),
    prefetch(trpc.roast.leaderboard.queryOptions({ limit: 3 })),
  ]);

  return (
    <HydrateClient>
      <main className="flex flex-1 flex-col items-center">
        <div className="flex w-full max-w-4xl flex-col gap-12 px-10 py-20">
          {/* Hero Title */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-3">
              <span className="font-mono text-4xl font-bold text-accent-green">
                {"$"}
              </span>
              <h1 className="font-mono text-4xl font-bold text-text-primary">
                paste your code. get roasted.
              </h1>
            </div>
            <p className="font-mono text-sm text-text-secondary">
              {"//"} drop your code below and we&apos;ll rate it — brutally
              honest or full roast mode
            </p>
          </div>

          {/* Code Editor + Actions (client component) */}
          <CodeEditorSection />

          {/* Footer Stats — real data via tRPC */}
          <GlobalMetrics />

          {/* Spacer */}
          <div className="h-8" />

          {/* Leaderboard Preview — Suspense with skeleton */}
          <Suspense fallback={<LeaderboardSkeleton />}>
            <LeaderboardPreview />
          </Suspense>

          {/* Bottom Spacer */}
          <div className="h-16" />
        </div>
      </main>
    </HydrateClient>
  );
}
