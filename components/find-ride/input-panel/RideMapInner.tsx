"use client";

import { useRef, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import type { AnyResult } from "@/types/driver";
import { useMapInit } from "./map/useMapInit";
import { useRoutes } from "./map/useRoutes";
import { makeDotIcon } from "./map/mapHelpers";

type Props = {
  pickupCoords: { lat: number; lng: number } | null;
  destCoords: { lat: number; lng: number } | null;
  scrollWheelZoom?: boolean;
  onDriverSelect?: (driver: AnyResult) => void;
  onRouteSelect?: (distanceKm: number, durationMin: number) => void;
  driverRouteCoords?: { lat: number; lng: number } | null;
  selectedDriver?: AnyResult | null;
};

const defaultCenter: [number, number] = [21.1458, 79.0882];

export default function RideMapInner({
  pickupCoords,
  destCoords,
  scrollWheelZoom = true,
  onDriverSelect,
  onRouteSelect,
  driverRouteCoords,
  selectedDriver,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pickupMarkerRef = useRef<any>(null);
  const destMarkerRef = useRef<any>(null);
  const routeRef = useRef<any>(null);
  const driverMarkerRef = useRef<any>(null);
  const ownerMarkerRef = useRef<any>(null);

  const center = pickupCoords
    ? ([pickupCoords.lat, pickupCoords.lng] as [number, number])
    : defaultCenter;

  const { mapRef, ready } = useMapInit(containerRef, center, scrollWheelZoom);
  
  // ⭐ UPDATED: Pass selectedDriver to useRoutes
  useRoutes(mapRef, ready, pickupCoords, destCoords, onRouteSelect, selectedDriver);
  
  // Disabled: useDriverMarkers and useDistanceCircle to keep map simple
  // useDriverMarkers(mapRef, ready, pickupCoords, drivers, distanceFilterKm, onDriverSelect, onDriverRouteDistance);
  // useDistanceCircle(mapRef, ready, pickupCoords, distanceFilterKm);

  useEffect(() => {
    if (!ready || !mapRef.current) return;
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const L = require("leaflet");
    const map = mapRef.current;
    const greenDot = makeDotIcon(L, "#22c55e");
    const redDot = makeDotIcon(L, "#ef4444");

    if (pickupCoords) {
      const pos: [number, number] = [pickupCoords.lat, pickupCoords.lng];
      if (pickupMarkerRef.current) { pickupMarkerRef.current.setLatLng(pos); }
      else { pickupMarkerRef.current = L.marker(pos, { icon: greenDot }).addTo(map); }
    } else if (pickupMarkerRef.current) {
      pickupMarkerRef.current.remove(); pickupMarkerRef.current = null;
    }

    if (destCoords) {
      const pos: [number, number] = [destCoords.lat, destCoords.lng];
      if (destMarkerRef.current) { destMarkerRef.current.setLatLng(pos); }
      else { destMarkerRef.current = L.marker(pos, { icon: redDot }).addTo(map); }
    } else if (destMarkerRef.current) {
      destMarkerRef.current.remove(); destMarkerRef.current = null;
    }

    // Draw driver route when available (backward compatibility)
    if (driverRouteCoords && pickupCoords && destCoords) {
      const routeCoords = [
        [driverRouteCoords.lat, driverRouteCoords.lng],
        [pickupCoords.lat, pickupCoords.lng],
        [destCoords.lat, destCoords.lng]
      ];
      
      if (routeRef.current) {
        routeRef.current.setLatLngs(routeCoords);
      } else {
        routeRef.current = L.polyline(routeCoords, { 
          color: '#3b82f6', 
          weight: 4,
          opacity: 0.7,
          dashArray: '10, 5'
        }).addTo(map);
      }
    } else if (routeRef.current) {
      map.removeLayer(routeRef.current);
      routeRef.current = null;
    }

    // 🚗🏠 ADD DRIVER/OWNER MARKERS when driver is selected
    if (selectedDriver) {
      const purpleDot = makeDotIcon(L, "#9333ea"); // Purple for driver
      const cyanDot = makeDotIcon(L, "#06b6d4");   // Cyan for owner

      if (selectedDriver.type === 'selfdriver') {
        // Self Driver: Show purple marker at driver location
        const driverLoc = selectedDriver.currentLocation || 
                          selectedDriver.permanentAddress?.coordinates;
        if (driverLoc) {
          const pos: [number, number] = [driverLoc.lat, driverLoc.lng];
          if (driverMarkerRef.current) {
            driverMarkerRef.current.setLatLng(pos);
          } else {
            driverMarkerRef.current = L.marker(pos, { icon: purpleDot }).addTo(map);
            driverMarkerRef.current.bindPopup(`Driver: ${selectedDriver.name}`);
          }
        }
      } else if (selectedDriver.type === 'pair') {
        // Pair: Show purple marker for driver home, cyan marker for owner location
        const driverLoc = selectedDriver.driver?.permanentAddress?.coordinates;
        if (driverLoc) {
          const pos: [number, number] = [driverLoc.lat, driverLoc.lng];
          if (driverMarkerRef.current) {
            driverMarkerRef.current.setLatLng(pos);
          } else {
            driverMarkerRef.current = L.marker(pos, { icon: purpleDot }).addTo(map);
            driverMarkerRef.current.bindPopup(`Driver Home: ${selectedDriver.driver?.name || 'Driver'}`);
          }
        }

        const ownerLoc = selectedDriver.owner?.permanentAddress?.coordinates;
        if (ownerLoc) {
          const pos: [number, number] = [ownerLoc.lat, ownerLoc.lng];
          if (ownerMarkerRef.current) {
            ownerMarkerRef.current.setLatLng(pos);
          } else {
            ownerMarkerRef.current = L.marker(pos, { icon: cyanDot }).addTo(map);
            ownerMarkerRef.current.bindPopup(`Owner Location: ${selectedDriver.owner?.name || 'Owner'}`);
          }
        }
      }
    } else {
      // Remove driver/owner markers if driver deselected
      if (driverMarkerRef.current) {
        map.removeLayer(driverMarkerRef.current);
        driverMarkerRef.current = null;
      }
      if (ownerMarkerRef.current) {
        map.removeLayer(ownerMarkerRef.current);
        ownerMarkerRef.current = null;
      }
    }

    if (pickupCoords && destCoords) {
      let hasRoutes = false;
      map.eachLayer((layer: any) => { if (layer instanceof L.Polyline && !(layer instanceof L.Polygon)) hasRoutes = true; });
      if (!hasRoutes) map.fitBounds(L.latLngBounds([[pickupCoords.lat, pickupCoords.lng],[destCoords.lat, destCoords.lng]]), { padding: [40, 40] });
    } else if (pickupCoords) {
      map.setView([pickupCoords.lat, pickupCoords.lng], 13);
    } else if (destCoords) {
      map.setView([destCoords.lat, destCoords.lng], 13);
    }
  }, [ready, pickupCoords, destCoords, driverRouteCoords, selectedDriver, mapRef]);

  return <div ref={containerRef} style={{ height: "100%", width: "100%" }} />;
}