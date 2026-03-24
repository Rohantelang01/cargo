"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function RefreshButton({
  onClick,
  isLoading,
  className,
  label = "Refresh",
}: {
  onClick: () => void;
  isLoading: boolean;
  className?: string;
  label?: string;
}) {
  return (
    <Button
      variant="outline"
      size="sm"
      className={className}
      onClick={onClick}
      disabled={isLoading}
      aria-label={label}
    >
      <RefreshCw className={cn("mr-2 h-4 w-4", isLoading ? "animate-spin" : "")} />
      {label}
    </Button>
  );
}
