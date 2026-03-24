"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import PairCard, { type PairCardProps } from "@/components/find-ride/results-panel/PairCard";
import RequestConfirmModal from "@/components/find-ride/modals/RequestConfirmModal";
import { useFindRide } from "@/context/FindRideContext";
import { Toast } from "@/components/ui/toast";

interface PairListProps {
  pairs: PairCardProps["pair"][];
  selectedPairIds: string[];
  onPairSelect: (pairId: string) => void;
  loading: boolean;
}

function SkeletonCard() {
  return (
    <div className="rounded-lg border border-border p-3 bg-muted/30 animate-pulse">
      <div className="h-3 w-24 bg-muted rounded" />
      <div className="mt-3 space-y-2">
        <div className="h-4 w-2/3 bg-muted rounded" />
        <div className="h-3 w-1/2 bg-muted rounded" />
        <div className="h-3 w-3/4 bg-muted rounded" />
      </div>
    </div>
  );
}

export default function PairList({ pairs, selectedPairIds, onPairSelect, loading }: PairListProps) {
  const { state, infoSaved, requestsEnabled, paymentMethod, setBookingStatus, setCurrentBookingId } = useFindRide();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const selectedPairs = useMemo(() => {
    const m = new Map(pairs.map((p) => [p.pairId, p] as const));
    return selectedPairIds.map((id) => m.get(id)).filter(Boolean) as PairCardProps["pair"][];
  }, [pairs, selectedPairIds]);

  const canSend = infoSaved && requestsEnabled && selectedPairs.length > 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">Available pairs ({pairs.length})</div>
        <div className="text-xs text-muted-foreground">Select up to 3</div>
      </div>

      {loading ? (
        <div className="space-y-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : pairs.length === 0 ? (
        <div className="rounded-md border bg-muted p-3 text-sm">No compatible pairs found for this route</div>
      ) : (
        <div className="space-y-3">
          {pairs.map((p) => (
            <PairCard
              key={p.pairId}
              pair={p}
              selected={selectedPairIds.includes(p.pairId)}
              onSelect={onPairSelect}
              disabled={selectedPairIds.length >= 3 && !selectedPairIds.includes(p.pairId)}
            />
          ))}
        </div>
      )}

      {selectedPairIds.length > 0 && (
        <div className="sticky bottom-0 left-0 right-0 border border-border bg-background/95 backdrop-blur rounded-md p-3 flex items-center justify-between gap-3">
          <div className="text-sm font-medium">{selectedPairIds.length} pair{selectedPairIds.length === 1 ? "" : "s"} selected</div>

          {!infoSaved ? null : !requestsEnabled ? (
            <Button type="button" size="sm" disabled>
              Save trip info first
            </Button>
          ) : (
            <Button type="button" size="sm" onClick={() => setConfirmOpen(true)} disabled={!canSend}>
              Send Requests
            </Button>
          )}
        </div>
      )}

      <RequestConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={async () => {
          const payloadPairs = selectedPairs.map((p) => ({
            vehicleId: String(p.pairId.split(":")[2] ?? ""),
            driverId: p.driver.userId,
            ownerId: p.owner.userId,
            estimatedFare: p.totalFare,
          }));

          const res = await fetch("/api/bookings/prebooking", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
              selectedPairs: payloadPairs,
              pickup: {
                address: state.pickup,
                coordinates: state.pickupCoords,
              },
              destination: {
                address: state.destination,
                coordinates: state.destCoords,
              },
              passengers: state.passengers,
              vehicleType: state.vehicleType,
              purpose: state.purpose,
              notes: state.notes,
              date: state.date,
              time: state.time,
              distanceKm: state.topBar.km,
              paymentMethod,
            }),
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data?.message || "Failed to create prebooking");

          // Set booking state and show success toast
          setBookingStatus("confirmed");
          setCurrentBookingId(data.booking._id);
          setConfirmOpen(false);
          setToastMessage(`Successfully sent requests to ${selectedPairs.length} pair${selectedPairs.length === 1 ? "" : "s"}!`);
          setShowToast(true);

          // Hide toast after 4 seconds
          setTimeout(() => setShowToast(false), 4000);
        }}
        mode="prebooking"
        selectedPairs={selectedPairs}
        tripInfo={{
          pickup: state.pickup,
          destination: state.destination,
          distanceKm: state.topBar.km ?? 0,
          durationMin: state.topBar.minutes ?? 0,
          passengers: state.passengers,
          vehicleType: state.vehicleType,
          purpose: state.purpose,
          date: state.date || undefined,
          time: state.time || undefined,
        }}
      />

      {/* Success Toast */}
      {showToast && (
        <div className="fixed bottom-4 right-4 z-50">
          <Toast
            variant="success"
            onClose={() => setShowToast(false)}
          >
            <div className="text-sm font-medium">Success!</div>
            <div className="text-xs">{toastMessage}</div>
          </Toast>
        </div>
      )}
    </div>
  );
}
