"use client";

import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import InputPanel from "@/components/find-ride/input-panel/InputPanel";
import ResultsPanel from "@/components/find-ride/results-panel/ResultsPanel";
import TripTopBar from "@/components/find-ride/TripTopBar";
import { FindRideProvider, useFindRide } from "@/context/FindRideContext";

function FindRideContent() {
  const { state, fetchDrivers, isMounted } = useFindRide();

  useEffect(() => {
    if (!isMounted) return;
    
    // ✅ FIX: Only fetch drivers when BOTH pickup AND destination are provided
    if (!state.pickupCoords || !state.destCoords) return;
    
    fetchDrivers({ resetTopBar: false });
  }, [fetchDrivers, isMounted, state.pickupCoords, state.destCoords]);

  return (
    <div className="flex flex-col w-full lg:h-[calc(100vh-64px)]">
      <TripTopBar />
      
      {/* Desktop — 2 column fixed height */}
      <div className="hidden lg:flex flex-1 overflow-hidden px-[5%] py-4 gap-4 bg-muted/30" style={{ height: "calc(100vh - 64px - 44px)" }}>
        <div className="w-[70%] overflow-hidden rounded-lg border border-border bg-background">
          <InputPanel />
        </div>
        <div className="w-[30%] overflow-hidden rounded-lg border border-border bg-background">
          <ResultsPanel />
        </div>
      </div>

      {/* Mobile — single column scroll */}
      <div className="lg:hidden flex flex-col px-3 py-3 gap-4 bg-muted/30">
        <div className="rounded-lg border border-border bg-background">
          <InputPanel />
        </div>
        <div className="rounded-lg border border-border bg-background">
          <ResultsPanel />
        </div>
      </div>
    </div>
  );
}

export default function FindRideLayout() {
  return (
    <FindRideProvider>
      <FindRideContent />
    </FindRideProvider>
  );
}