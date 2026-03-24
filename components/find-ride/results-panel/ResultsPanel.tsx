"use client";

import FilterBar from "@/components/find-ride/results-panel/FilterBar";
import { ResultsList } from "@/components/find-ride/results-panel/ResultsList";
import { useFindRide } from "@/context/FindRideContext";

export default function ResultsPanel() {
  const { state, isMounted } = useFindRide();

  return (
    <div className="flex flex-col h-full border-l border-border bg-background">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between shrink-0">
        <h2 className="text-sm font-medium">Drivers & owners</h2>
        {isMounted && (
          <span className="text-xs text-muted-foreground">
            {state.drivers.length} result{state.drivers.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      <div className="px-4 py-3 border-b border-border shrink-0 relative z-10 bg-background">
        <FilterBar />
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3">
       <ResultsList />
      </div>
    </div>
  );
}