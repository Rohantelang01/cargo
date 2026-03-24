import { useEffect, useRef } from "react";
import type { LatLng } from "./useRoutes";

export function useDistanceCircle(
  mapRef: React.RefObject<any | null>,
  ready: boolean,
  pickupCoords: LatLng | null,
  distanceFilterKm: number
): void {
  // DISABLED: This hook is disabled to keep the map simple
  // No distance circle will be shown
  return;
  const circleRef = useRef<any | null>(null);

  useEffect(() => {
    if (!ready || !mapRef.current) return;

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const L = require("leaflet");
    const map = mapRef.current;

    // Remove existing circle if it exists
    if (circleRef.current) {
      circleRef.current.remove();
      circleRef.current = null;
    }

    // Create new circle if pickup coordinates exist
    if (pickupCoords) {
      circleRef.current = L.circle([pickupCoords.lat, pickupCoords.lng], {
        radius: distanceFilterKm * 1000, // Convert km to meters
        color: '#2563eb',
        fillColor: '#2563eb',
        fillOpacity: 0.04,
        weight: 1,
        dashArray: '4 4',
      }).addTo(map);
    }

    return () => {
      if (circleRef.current) {
        circleRef.current.remove();
        circleRef.current = null;
      }
    };
  }, [ready, pickupCoords, distanceFilterKm]);
}
