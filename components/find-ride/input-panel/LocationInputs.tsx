"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MapPin, Loader2, Navigation } from "lucide-react";
import { useFindRide } from "@/context/FindRideContext";

interface Suggestion {
  display_name: string;
  lat: string;
  lon: string;
}

function AddressInput({
  value,
  onChange,
  onSelect,
  placeholder,
  dotColor,
}: {
  value: string;
  onChange: (val: string) => void;
  onSelect: (display: string, lat: number, lng: number) => void;
  placeholder: string;
  dotColor: "green" | "red";
}) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Auto-geocode when user types and loses focus without selecting
  const handleBlur = useCallback(async () => {
    if (!value || suggestions.length > 0) return;
    
    // Try to geocode the typed address
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&limit=1&countrycodes=in`,
        { headers: { "Accept-Language": "en" } }
      );
      const data: Suggestion[] = await res.json();
      if (data[0]) {
        onSelect(data[0].display_name, parseFloat(data[0].lat), parseFloat(data[0].lon));
      }
    } catch {
      // Silently fail - validation will catch missing coords
    }
  }, [value, suggestions.length, onSelect]);

  const search = useCallback((query: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.length < 3) { setSuggestions([]); setOpen(false); return; }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=in`,
          { headers: { "Accept-Language": "en" } }
        );
        const data: Suggestion[] = await res.json();
        setSuggestions(data);
        setOpen(data.length > 0);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 400);
  }, []);

  return (
    <div ref={wrapRef} className="relative flex-1 min-w-0">
      <div className="relative">
        <span
          className={`absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full shrink-0 ${
            dotColor === "green" ? "bg-emerald-500" : "bg-red-500"
          }`}
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 animate-spin text-muted-foreground" />
        )}
        <input
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            search(e.target.value);
          }}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="w-full h-9 pl-8 pr-8 text-sm border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>

      {open && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-background border border-border rounded-md shadow-md overflow-hidden">
          {suggestions.map((s, i) => (
            <button
              key={i}
              type="button"
              className="w-full flex items-start gap-2 px-3 py-2 text-left text-xs hover:bg-muted transition-colors border-b border-border last:border-0"
              onMouseDown={(e) => {
                e.preventDefault();
                onSelect(s.display_name, parseFloat(s.lat), parseFloat(s.lon));
                setSuggestions([]);
                setOpen(false);
              }}
            >
              <MapPin className="h-3 w-3 text-muted-foreground mt-0.5 shrink-0" />
              <span className="text-foreground line-clamp-2">{s.display_name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function LocationInputs() {
  const {
    state,
    setPickup,
    setDestination,
    setPickupCoords,
    setDestCoords,
    isMounted,
  } = useFindRide();

  const [geoLoading, setGeoLoading] = useState(false);

  const useCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setPickupCoords({ lat, lng });
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
            { headers: { "Accept-Language": "en" } }
          );
          const data = await res.json();
          setPickup(data.display_name ?? `${lat.toFixed(5)}, ${lng.toFixed(5)}`);
        } catch {
          setPickup(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
        }
        setGeoLoading(false);
      },
      () => setGeoLoading(false),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, [setPickup, setPickupCoords]);

  if (!isMounted) return null;

  return (
    <div className="flex items-center gap-2">
      <AddressInput
        value={state.pickup}
        onChange={setPickup}
        onSelect={(display, lat, lng) => {
          setPickup(display);
          setPickupCoords({ lat, lng });
        }}
        placeholder="Pickup location"
        dotColor="green"
      />

      <AddressInput
        value={state.destination}
        onChange={setDestination}
        onSelect={(display, lat, lng) => {
          setDestination(display);
          setDestCoords({ lat, lng });
        }}
        placeholder="Destination"
        dotColor="red"
      />

      <button
        type="button"
        onClick={useCurrentLocation}
        disabled={geoLoading}
        title="Use current location"
        className="shrink-0 h-9 w-9 flex items-center justify-center rounded-md border border-input bg-background hover:bg-muted transition-colors disabled:opacity-50"
      >
        {geoLoading
          ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          : <Navigation className="h-4 w-4 text-emerald-600" />
        }
      </button>
    </div>
  );
}