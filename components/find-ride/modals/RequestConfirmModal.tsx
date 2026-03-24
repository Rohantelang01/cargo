"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { DriverResult } from "@/types/driver";
import type { PairCardProps } from "@/components/find-ride/results-panel/PairCard";
import { useFindRide } from "@/context/FindRideContext";

interface RequestConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  mode: "instant" | "prebooking";
  driver?: DriverResult;
  selectedPairs?: PairCardProps["pair"][];
  tripInfo: {
    pickup: string;
    destination: string;
    distanceKm: number;
    durationMin: number;
    passengers: number;
    vehicleType: string;
    purpose: string;
    date?: string;
    time?: string;
  };
}

export default function RequestConfirmModal({
  open,
  onClose,
  onConfirm,
  mode,
  driver,
  selectedPairs,
  tripInfo,
}: RequestConfirmModalProps) {
  const [loading, setLoading] = useState(false);
  const { paymentMethod, setPaymentMethod } = useFindRide();

  const fareBreakdown = useMemo(() => {
    const km = Number.isFinite(tripInfo.distanceKm) ? tripInfo.distanceKm : 0;
    const perKm = driver?.vehicle?.perKmRate ?? 0;
    const vehicleCost = Math.round(km * perKm);
    const platformFee = 2;
    return { vehicleCost, platformFee, total: vehicleCost + platformFee, perKm };
  }, [driver?.vehicle?.perKmRate, tripInfo.distanceKm]);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => (!v ? onClose() : null)}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "instant" ? "Confirm Request" : `Send Requests (${selectedPairs?.length ?? 0} pairs)`}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {mode === "instant" && driver && (
            <div className="space-y-1.5">
              <div className="text-sm">
                <span className="text-muted-foreground">Driver: </span>
                <span className="font-medium">{driver.name}</span>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Vehicle: </span>
                <span className="font-medium">{driver.vehicle?.make} {driver.vehicle?.model}</span>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Plate: </span>
                <span className="font-medium">{driver.vehicle?.plateNumber}</span>
              </div>
            </div>
          )}

          <div className="rounded-md border border-border p-3 space-y-2">
            {mode === "prebooking" && tripInfo.date && tripInfo.time && (
              <div className="text-sm">
                <span className="text-muted-foreground">Date: </span>
                <span className="font-medium">{tripInfo.date} | {tripInfo.time}</span>
              </div>
            )}
            <div className="text-sm">
              <span className="text-muted-foreground">From: </span>
              <span className="font-medium">{tripInfo.pickup.split(",")[0]}</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">To: </span>
              <span className="font-medium">{tripInfo.destination.split(",")[0]}</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Distance: </span>
              <span className="font-medium">{tripInfo.distanceKm.toFixed(1)} km</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Est. time: </span>
              <span className="font-medium">~{tripInfo.durationMin} min</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Passengers: {tripInfo.passengers}</Badge>
            <Badge variant="outline" className="capitalize">{tripInfo.vehicleType || "vehicle"}</Badge>
            {tripInfo.purpose && <Badge variant="secondary">{tripInfo.purpose}</Badge>}
          </div>

          {mode === "instant" && driver && (
            <div className="rounded-md border border-border p-3 space-y-2">
              <div className="text-sm font-medium">Fare breakdown</div>
              <div className="text-sm text-muted-foreground">
                Vehicle: ₹{fareBreakdown.perKm}/km × {tripInfo.distanceKm.toFixed(1)} = ₹{fareBreakdown.vehicleCost}
              </div>
              <div className="text-sm text-muted-foreground">Platform fee: ₹{fareBreakdown.platformFee}</div>
              <div className="text-sm font-semibold">Total: ₹{fareBreakdown.total}</div>
            </div>
          )}

          {mode === "prebooking" && selectedPairs && selectedPairs.length > 0 && (
            <div className="rounded-md border border-border p-3 space-y-2">
              <div className="text-sm font-medium">Selected pairs</div>
              <div className="space-y-1">
                {selectedPairs.map((p, idx) => (
                  <div key={p.pairId} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Pair {idx + 1}: {p.driver.name.split(" ")[0]} + {p.owner.name.split(" ")[0]}
                    </span>
                    <span className="font-medium">₹{p.totalFare}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">Payment:</div>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant={paymentMethod === "WALLET" ? "default" : "outline"}
                onClick={() => setPaymentMethod("WALLET")}
              >
                Wallet
              </Button>
              <Button
                type="button"
                size="sm"
                variant={paymentMethod === "CASH" ? "default" : "outline"}
                onClick={() => setPaymentMethod("CASH")}
              >
                Cash
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="button" onClick={handleConfirm} disabled={loading}>
            {loading ? "Sending..." : mode === "instant" ? "Confirm & Send" : "Send Requests"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export type { RequestConfirmModalProps };
