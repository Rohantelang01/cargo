import { Skeleton } from "@/components/ui/skeleton";

export function LoadingCard() {
  return (
    <div className="bg-secondary/50 rounded-xl p-5 border border-border/50 space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  );
}
