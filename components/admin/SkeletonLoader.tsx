"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonLoader({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={i === 0 ? "h-5 w-2/3" : "mt-2 h-4 w-full"} />
      ))}
    </div>
  );
}
