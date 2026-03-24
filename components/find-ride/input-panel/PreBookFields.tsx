"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFindRide } from "@/context/FindRideContext";

export default function PreBookFields() {
  const { state, setDate, setTime } = useFindRide();

  if (state.mode !== "prebooking") return null;

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-1">
        <Label htmlFor="prebook-date">Date</Label>
        <Input id="prebook-date" type="date" value={state.date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <div className="space-y-1">
        <Label htmlFor="prebook-time">Time</Label>
        <Input id="prebook-time" type="time" value={state.time} onChange={(e) => setTime(e.target.value)} />
      </div>
    </div>
  );
}
