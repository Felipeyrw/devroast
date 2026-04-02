import { Skeleton } from "@/components/ui/skeleton";

export function LeaderboardFullSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-10 py-10">
      {/* Header skeleton */}
      <div className="mb-10 flex items-start justify-between">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-8 w-48" />
          </div>
          <Skeleton className="h-5 w-80" />
          <Skeleton className="h-9 w-40" />
        </div>
      </div>

      {/* Stats skeleton */}
      <div className="mb-10 flex gap-16">
        <div>
          <Skeleton className="h-4 w-20" />
          <Skeleton className="mt-1 h-9 w-16" />
        </div>
        <div>
          <Skeleton className="h-4 w-16" />
          <Skeleton className="mt-1 h-9 w-12" />
        </div>
        <div>
          <Skeleton className="h-4 w-20" />
          <Skeleton className="mt-1 h-9 w-12" />
        </div>
      </div>

      {/* Table skeleton */}
      <div className="overflow-hidden rounded-lg border border-border-primary">
        <div className="flex items-center border-b border-border-primary bg-bg-elevated px-5 py-3">
          <span className="w-16 font-mono text-xs text-text-tertiary">
            Rank
          </span>
          <span className="flex-1 font-mono text-xs text-text-tertiary">
            Roast
          </span>
          <span className="w-32 text-right font-mono text-xs text-text-tertiary">
            Created At
          </span>
        </div>

        {Array.from({ length: 3 }).map((_, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
            key={i}
            className="flex border-b border-border-primary px-5 py-4 last:border-b-0"
          >
            <div className="flex w-16 flex-col items-start gap-2">
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 w-10" />
            </div>
            <div className="flex flex-1 flex-col gap-3">
              <div className="rounded border border-border-primary bg-bg-input">
                <div className="flex">
                  <div className="flex w-10 shrink-0 flex-col gap-0.5 border-r border-border-primary bg-bg-surface px-2 py-3">
                    <Skeleton className="h-3 w-4" />
                    <Skeleton className="h-3 w-4" />
                    <Skeleton className="h-3 w-4" />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 px-3 py-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex w-32 items-start justify-end">
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
