"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useFindRide } from "@/context/FindRideContext";
import { ChevronUp, ChevronDown } from "lucide-react";
import type { DriverResult } from "@/types/driver";

const RideMapInner = dynamic(
  () => import("@/components/find-ride/input-panel/RideMapInner"),
  { ssr: false, loading: () => <div className="w-full h-full bg-muted animate-pulse" /> }
);

export default function RideMap() {
  const { state, setSelectedDriver, isMounted } = useFindRide();
  const [minimized, setMinimized] = useState(false);

  const handleDriverSelect = (driver: DriverResult) => {
    setSelectedDriver(driver);
  };

  const handleRouteSelect = (distanceKm: number, durationMin: number) => {
    // Optional: update topbar with route information
    // Could be implemented later if needed
  };

  if (!isMounted) {
    return (
      <div
        className="w-full rounded-md border bg-muted animate-pulse"
        style={{ aspectRatio: "1 / 1" }}
      />
    );
  }

  return (
    <div className="rounded-md border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between bg-background border-b px-3 py-1.5">
        <span className="text-xs text-muted-foreground">Route & nearby drivers</span>
        <button
          type="button"
          onClick={() => setMinimized((v) => !v)}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {minimized ? (
            <>Show map <ChevronDown className="h-3 w-3" /></>
          ) : (
            <>Hide map <ChevronUp className="h-3 w-3" /></>
          )}
        </button>
      </div>

      {!minimized && (
        <>
          {/* Map — with explicit height and debugging */}
          <div className="overflow-y-auto max-h-[calc(100vh-200px)] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 bg-blue-50 border-2 border-blue-200" style={{ height: '500px', minHeight: '400px', position: 'relative', zIndex: 10 }}>
            <div className="text-xs text-gray-500 mb-2">Map Debug: Container visible</div>
            <RideMapInner
              pickupCoords={state.pickupCoords}
              destCoords={state.destCoords}
              scrollWheelZoom={true}
              onDriverSelect={handleDriverSelect}
              onRouteSelect={handleRouteSelect}
              selectedDriver={state.selectedDriver}
            />
          </div>
        </>
      )}
    </div>
  );
}