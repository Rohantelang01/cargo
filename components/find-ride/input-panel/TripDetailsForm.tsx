"use client";

import { useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFindRide } from "@/context/FindRideContext";

const PURPOSES = [
  "Daily commute",
  "Hospital visit",
  "Market trip",
  "Outstation",
  "Goods transport",
  "Other",
] as const;

const VEHICLES = ["bike", "auto", "car", "bus", "truck"] as const;

type Vehicle = (typeof VEHICLES)[number];

function suggestedVehicle(passengers: number): Vehicle {
  if (passengers <= 1) return "bike";
  if (passengers <= 3) return "auto";
  if (passengers <= 7) return "car";
  return "bus";
}

export default function TripDetailsForm() {
  const { state, setPassengers, setPurpose, setVehicleType, setFilter, fetchDrivers, isMounted } = useFindRide();

  const suggested = useMemo(() => suggestedVehicle(state.passengers), [state.passengers]);

  if (!isMounted) return null;

  return (
    <div className="flex flex-col sm:flex-row gap-3">

      {/* Passengers */}
      <div className="flex flex-col gap-1.5 shrink-0">
        <Label className="text-xs">Passengers</Label>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setPassengers(Math.max(1, state.passengers - 1))}
            className="w-8 h-8 flex items-center justify-center rounded-md border border-input bg-background hover:bg-muted text-sm font-medium transition-colors"
          >
            −
          </button>
          <span className="w-6 text-center text-sm font-medium tabular-nums">
            {state.passengers}
          </span>
          <button
            type="button"
            onClick={() => setPassengers(Math.min(20, state.passengers + 1))}
            className="w-8 h-8 flex items-center justify-center rounded-md border border-input bg-background hover:bg-muted text-sm font-medium transition-colors"
          >
            +
          </button>
        </div>
        <span className="text-[10px] text-muted-foreground">
          Suggested: <span className="font-medium capitalize">{suggested}</span>
        </span>
      </div>

      {/* Purpose */}
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <Label className="text-xs">Purpose</Label>
        <Select value={state.purpose} onValueChange={(v) => setPurpose(v)}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Select purpose" />
          </SelectTrigger>
          <SelectContent>
            {PURPOSES.map((p) => (
              <SelectItem key={p} value={p} className="text-xs">
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Vehicle type */}
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <Label className="text-xs">Vehicle type</Label>
        <div className="flex flex-wrap gap-1">
          {VEHICLES.map((v) => {
            const active = state.vehicleType === v;
            const isSuggested = suggested === v && !active;
            return (
              <button
                key={v}
                type="button"
                onClick={async () => {
                  setVehicleType(v);
                  setFilter("vehicle", v);
                  await fetchDrivers();
                }}
                className={`px-2 py-1 rounded-md text-xs border capitalize transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground border-primary font-medium"
                    : isSuggested
                    ? "border-emerald-500 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300"
                    : "border-input bg-background hover:bg-muted text-foreground"
                }`}
              >
                {v}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}