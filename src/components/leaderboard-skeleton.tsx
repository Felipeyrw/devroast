import { Skeleton } from "@/components/ui/skeleton";

export function LeaderboardSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {/* Title Row */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-7 w-52" />
        <Skeleton className="h-8 w-24" />
      </div>

      {/* Subtitle */}
      <Skeleton className="h-4 w-80" />

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

        {/* Skeleton Rows */}
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
            key={i}
            className="flex items-center gap-0 border-b border-border-primary px-5 py-4"
          >
            <div className="w-[50px]">
              <Skeleton className="h-4 w-6" />
            </div>
            <div className="w-[70px]">
              <Skeleton className="h-4 w-10" />
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="flex w-[100px] justify-end">
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex justify-center py-4">
        <Skeleton className="h-4 w-56" />
      </div>
    </div>
  );
}
