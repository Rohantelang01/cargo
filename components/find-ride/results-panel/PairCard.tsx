"use client";

import { useMemo } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import type { DriverResult } from "@/types/driver";

interface PairCardProps {
  pair: {
    pairId: string;
    driver: DriverResult;
    owner: DriverResult;
    vehicle: {
      make: string;
      model: string;
      plateNumber: string;
      vehicleType: string;
      seatingCapacity: number;
      perKmRate: number;
    };
    driverRate: number;
    ownerRate: number;
    totalFare: number;
    combinedDistance: number;
  };
  selected: boolean;
  onSelect: (pairId: string) => void;
  disabled: boolean;
}

function initials(name: string) {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
  return (parts[0]?.[0] ?? "U") + (parts[1]?.[0] ?? "");
}

export default function PairCard({ pair, selected, onSelect, disabled }: PairCardProps) {
  const driverLicense = useMemo(() => {
    const lic = pair.driver.driverInfo?.licenses?.[0];
    if (!lic) return null;
    return lic;
  }, [pair.driver.driverInfo?.licenses]);

  const handleToggle = () => {
    if (disabled && !selected) {
      toast.error("Max 3 pairs selected");
      return;
    }
    onSelect(pair.pairId);
  };

  const disabledStyles = disabled && !selected ? "opacity-50 cursor-not-allowed" : "cursor-pointer";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleToggle}
      onKeyDown={(e) => e.key === "Enter" && handleToggle()}
      className={
        "rounded-lg border p-3 transition-colors " +
        (selected ? "border-primary bg-primary/5 " : "border-border hover:bg-muted/40 ") +
        disabledStyles
      }
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-semibold text-muted-foreground">PAIR</div>
        </div>
        <div
          className={
            "h-4 w-4 rounded-sm border flex items-center justify-center shrink-0 mt-0.5 " +
            (selected ? "bg-primary border-primary" : "border-border bg-background")
          }
        >
          {selected && <div className="h-2 w-2 rounded-[2px] bg-primary-foreground" />}
        </div>
      </div>

      <div className="mt-2 space-y-3">
        <div className="flex items-start gap-2">
          <div className="h-8 w-8 rounded-full border bg-muted flex items-center justify-center text-xs font-medium">
            {initials(pair.driver.name)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="text-sm font-medium truncate">{pair.driver.name}</div>
              <Badge variant="secondary" className="text-xs py-0">Driver</Badge>
            </div>
            <div className="text-xs text-muted-foreground">
              {driverLicense ? `${driverLicense.licenseType} License` : "License"} · {pair.driver.distanceAway} km away
            </div>
            <div className="text-xs text-muted-foreground">
              ★ {(pair.driver.driverInfo?.rating ?? 0).toFixed(1)} · {pair.driver.driverInfo?.totalTrips ?? 0} trips
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <div className="h-8 w-8 rounded-full border bg-muted flex items-center justify-center text-xs font-medium">
            {initials(pair.owner.name)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="text-sm font-medium truncate">{pair.owner.name}</div>
              <Badge variant="secondary" className="text-xs py-0">Owner</Badge>
            </div>
            <div className="text-xs text-muted-foreground">
              {pair.vehicle.make} {pair.vehicle.model} {pair.vehicle.plateNumber}
            </div>
            <div className="text-xs text-muted-foreground">
              {pair.owner.distanceAway} km away · {pair.vehicle.seatingCapacity} seats
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">₹{pair.totalFare} total</div>
            <div className="text-xs text-muted-foreground">~{Math.max(1, Math.round((pair.combinedDistance / 35) * 60))} min</div>
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            Driver: ₹{pair.driverRate} + Vehicle: ₹{Math.round(pair.ownerRate)} + ₹2
          </div>
        </div>
      </div>
    </div>
  );
}

export type { PairCardProps };

