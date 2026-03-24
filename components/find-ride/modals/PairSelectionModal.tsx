"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PairSelectionModalProps {
  open: boolean;
  acceptedPairs: {
    requestId: string;
    driver: { name: string; rating: number };
    owner: { name: string };
    vehicle: { make: string; model: string; plateNumber: string };
    totalFare: number;
  }[];
  onConfirm: (requestId: string) => Promise<void>;
}

export default function PairSelectionModal({ open, acceptedPairs, onConfirm }: PairSelectionModalProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const effectiveSelectedId = useMemo(() => {
    if (selectedId) return selectedId;
    return acceptedPairs[0]?.requestId ?? null;
  }, [acceptedPairs, selectedId]);

  const handleConfirm = async () => {
    if (!effectiveSelectedId) return;
    setLoading(true);
    try {
      await onConfirm(effectiveSelectedId);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>🎉 {acceptedPairs.length} pairs accepted! Choose one to confirm</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {acceptedPairs.map((p) => {
            const selected = p.requestId === effectiveSelectedId;
            return (
              <button
                key={p.requestId}
                type="button"
                onClick={() => setSelectedId(p.requestId)}
                className={
                  "w-full text-left rounded-md border p-3 transition-colors " +
                  (selected ? "border-primary bg-primary/5" : "border-border hover:bg-muted/40")
                }
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-4 w-4 rounded-full border flex items-center justify-center">
                    {selected && <div className="h-2 w-2 rounded-full bg-primary" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">
                      {p.driver.name.split(" ")[0]} + {p.owner.name.split(" ")[0]}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {p.vehicle.make} {p.vehicle.model} • {p.vehicle.plateNumber}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ★ {p.driver.rating.toFixed(1)} | ₹{p.totalFare}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}

          <div className="text-xs text-muted-foreground">
            Others will be released (free for other bookings)
          </div>
        </div>

        <DialogFooter>
          <Button type="button" onClick={handleConfirm} disabled={loading || !effectiveSelectedId}>
            {loading ? "Confirming..." : "Confirm Selected Pair"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export type { PairSelectionModalProps };
