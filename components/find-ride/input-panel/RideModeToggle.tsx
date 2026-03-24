"use client";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFindRide } from "@/context/FindRideContext";

export default function RideModeToggle() {
  const { state, setMode, isMounted } = useFindRide();

  if (!isMounted) return null;

  return (
    <div className="flex items-center justify-between gap-3">
      <Tabs value={state.mode} onValueChange={(v) => setMode(v as any)}>
        <TabsList className="w-full">
          <TabsTrigger value="instant" className="flex-1">
            Instant Ride
          </TabsTrigger>
          <TabsTrigger value="prebooking" className="flex-1">
            Pre-booking
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <Badge className={state.mode === "instant" ? "bg-emerald-600" : "bg-blue-600"}>
        {state.mode === "instant" ? "Instant" : "Pre-booking"}
      </Badge>
    </div>
  );
}
