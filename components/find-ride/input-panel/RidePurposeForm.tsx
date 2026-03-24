"use client";

import { Label } from "@/components/ui/label";
import { useFindRide } from "@/context/FindRideContext";

export default function RidePurposeForm() {
  const { state, setNotes, isMounted } = useFindRide();

  if (!isMounted) return null;

  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs">Additional notes</Label>
      <textarea
        value={state.notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Special requirements, landmark, luggage, etc..."
        rows={2}
        className="w-full px-3 py-2 text-xs border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
      />
    </div>
  );
}