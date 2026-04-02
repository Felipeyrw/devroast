import { Skeleton } from "@/components/ui/skeleton";

export function MetricsSkeleton() {
  return (
    <div className="flex items-center justify-center gap-6">
      <Skeleton className="h-4 w-36" />
      <span className="font-mono text-xs text-text-tertiary">{"·"}</span>
      <Skeleton className="h-4 w-28" />
    </div>
  );
}
