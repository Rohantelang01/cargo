"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import RideModeToggle from "@/components/find-ride/input-panel/RideModeToggle";
import LocationInputs from "@/components/find-ride/input-panel/LocationInputs";
import PreBookFields from "@/components/find-ride/input-panel/PreBookFields";
import TripDetailsForm from "@/components/find-ride/input-panel/TripDetailsForm";
import RidePurposeForm from "@/components/find-ride/input-panel/RidePurposeForm";
import RideMap from "@/components/find-ride/input-panel/RideMap";
import RideFormActions from "@/components/find-ride/input-panel/RideFormActions";
import { useFindRide } from "@/context/FindRideContext";

function SectionHeader({
  title,
  open,
  onToggle,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center justify-between px-4 py-2.5 bg-muted/40 hover:bg-muted/70 transition-colors border-b border-border"
    >
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </span>
      {open
        ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
        : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
      }
    </button>
  );
}

export default function InputPanel() {
  const { infoSaved } = useFindRide();
  const [infoOpen, setInfoOpen] = useState(true);
  const [mapOpen, setMapOpen] = useState(true);

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-background">

      {/* Mode toggle */}
      <div className="px-4 py-3 border-b border-border shrink-0">
        <RideModeToggle />
      </div>

      {/* Trip Information Section */}
      <SectionHeader
        title="Trip information"
        open={infoOpen}
        onToggle={() => setInfoOpen((v) => !v)}
      />

      {infoOpen && (
        <div className="px-4 py-4 space-y-4 border-b border-border">
          {infoSaved ? (
            // SAVED — only show print card
            <RideFormActions />
          ) : (
            // NOT SAVED — show full form
            <>
              <LocationInputs />
              <PreBookFields />
              <TripDetailsForm />
              <RidePurposeForm />
              <RideFormActions />
            </>
          )}
        </div>
      )}

      {/* Map Section — only after save */}
      {infoSaved && (
        <>
          <SectionHeader
            title="Route & nearby drivers"
            open={mapOpen}
            onToggle={() => setMapOpen((v) => !v)}
          />
          {mapOpen && (
            <div className="px-4 py-4">
              <RideMap />
            </div>
          )}
        </>
      )}

      {/* Hint — before save */}
      {!infoSaved && (
        <div className="px-4 py-6 flex flex-col items-center gap-2 text-center">
          <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground max-w-[200px]">
            Fill in trip details and save to see route & nearby drivers on map
          </p>
        </div>
      )}

    </div>
  );
}