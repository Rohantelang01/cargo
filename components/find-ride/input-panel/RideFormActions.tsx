"use client";

import { toast } from "sonner";
import { Pencil } from "lucide-react";
import { useFindRide } from "@/context/FindRideContext";

export default function RideFormActions() {
  const {
    state,
    infoSaved,
    setInfoSaved,
    recalcTopBar,
    saveDraftToLocalStorage,
    fetchDrivers,
    setRequestsEnabled,
    isMounted,
  } = useFindRide();

  if (!isMounted) return null;

  const validate = () => {
    if (!state.pickup) { toast.error("Enter pickup location"); return false; }
    if (!state.destination) { toast.error("Enter destination"); return false; }
    if (!state.pickupCoords) { toast.error("Please select pickup from suggestions"); return false; }
    if (!state.destCoords) { toast.error("Please select destination from suggestions"); return false; }
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;
    if (state.mode === "prebooking") {
      if (!state.date) { toast.error("Select date"); return; }
      if (!state.time) { toast.error("Select time"); return; }
    }
    if (!state.passengers || state.passengers <= 0) { toast.error("Select passengers"); return; }
    if (!state.vehicleType) { toast.error("Select vehicle type"); return; }

    saveDraftToLocalStorage();
    await fetchDrivers();
    setRequestsEnabled(true);
    setInfoSaved(true);
    toast.success("Saved — send requests to drivers");
  };

  const handleCalc = () => {
    if (!validate()) return;
    if (!state.selectedDriver) { toast.error("Select a driver first"); return; }
    recalcTopBar({ forceCost: true });
  };

  // ── Saved — show print card ──
  if (infoSaved) {
    return (
      <div className="rounded-md border border-border bg-muted/30 px-3 py-2.5 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Saved trip info
          </span>
          <button
            type="button"
            onClick={() => setInfoSaved(false)}
            className="flex items-center gap-1 text-[10px] text-primary hover:underline"
          >
            <Pencil className="h-2.5 w-2.5" /> Edit
          </button>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          <div>
            <span className="text-muted-foreground">From </span>
            <span className="font-medium text-foreground">{state.pickup.split(",")[0]}</span>
          </div>
          <div>
            <span className="text-muted-foreground">To </span>
            <span className="font-medium text-foreground">{state.destination.split(",")[0]}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Passengers </span>
            <span className="font-medium text-foreground">{state.passengers}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Vehicle </span>
            <span className="font-medium text-foreground capitalize">{state.vehicleType}</span>
          </div>
          {state.purpose && (
            <div>
              <span className="text-muted-foreground">Purpose </span>
              <span className="font-medium text-foreground">{state.purpose}</span>
            </div>
          )}
          {state.mode === "prebooking" && state.date && (
            <div>
              <span className="text-muted-foreground">When </span>
              <span className="font-medium text-foreground">{state.date} {state.time}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Default — two buttons ──
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={handleCalc}
        className="flex-1 h-8 px-3 text-xs border border-input rounded-md bg-background hover:bg-muted transition-colors text-foreground"
      >
        Calculate
      </button>
      <button
        type="button"
        onClick={handleSave}
        className="flex-1 h-8 px-3 text-xs rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
      >
        Save & find
      </button>
    </div>
  );
}