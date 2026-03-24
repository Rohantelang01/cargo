"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const s = (status || "").toString();
  const normalized = s.toLowerCase();

  const variantClass = (() => {
    if (["active", "accepted", "completed", "available"].includes(normalized)) {
      return "bg-emerald-600 hover:bg-emerald-600";
    }
    if (["pending", "requested"].includes(normalized)) {
      return "bg-amber-600 hover:bg-amber-600";
    }
    if (["cancelled", "canceled", "rejected", "blocked", "inactive"].includes(normalized)) {
      return "bg-red-600 hover:bg-red-600";
    }
    return "bg-slate-600 hover:bg-slate-600";
  })();

  return (
    <Badge className={cn(variantClass, className)}>
      {s}
    </Badge>
  );
}
