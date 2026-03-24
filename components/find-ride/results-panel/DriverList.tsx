"use client";

import DriverCard from "@/components/find-ride/results-panel/DriverCard";
import PairList from "@/components/find-ride/results-panel/PairList";
import { useFindRide } from "@/context/FindRideContext";

export default function DriverList() {
  const { state, availablePairs, selectedPairs, addPair, removePair, clearPairs } = useFindRide();

  if (state.mode === "prebooking" && state.filters.type === "pairs") {
    const selectedPairIds = selectedPairs.map((p) => p.pairId);
    return (
      <PairList
        pairs={availablePairs}
        selectedPairIds={selectedPairIds}
        onPairSelect={(pairId) => {
          const exists = selectedPairs.some((p) => p.pairId === pairId);
          if (exists) {
            removePair(pairId);
            return;
          }
          const pair = availablePairs.find((p) => p.pairId === pairId);
          if (!pair) return;
          addPair(pair);
        }}
        loading={state.loading}
      />
    );
  }

  if (state.loading) {
    return <div className="rounded-md border bg-muted p-3 text-sm">Loading...</div>;
  }

  if (!state.drivers.length) {
    return <div className="rounded-md border bg-muted p-3 text-sm">No matches. Try adjusting filters.</div>;
  }

  return (
    <div className="space-y-3">
      {state.drivers.map((d) => (
        <DriverCard key={d.userId} driver={d} selected={state.selectedDriver?.userId === d.userId} />
      ))}
    </div>
  );
}
