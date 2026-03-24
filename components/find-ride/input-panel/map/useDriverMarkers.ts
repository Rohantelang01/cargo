import { useEffect, useRef } from "react";
import type { AnyResult, SelfDriverResult, DriverOnlyResult, OwnerOnlyResult, PairResult } from "@/types/driver";
import {
  makeDriverSvgIcon,
  makePopupHtml,
  getDriverRouteType,
  fetchOsrmRoute,
  straightLine,
} from "./mapHelpers";
import type { LatLng } from "./useRoutes";

const getDriverCoords = (driver: AnyResult): { lat: number; lng: number } | null => {
  // Handle different driver types
  if (driver.type === "selfdriver") {
    const d = driver as SelfDriverResult;
    if (d.currentLocation?.lat && d.currentLocation?.lng) {
      return { lat: d.currentLocation.lat, lng: d.currentLocation.lng };
    }
    if (d.permanentAddress?.coordinates?.lat && d.permanentAddress?.coordinates?.lng) {
      return d.permanentAddress.coordinates as { lat: number; lng: number };
    }
  } else if (driver.type === "driver" || driver.type === "owner") {
    const d = driver as DriverOnlyResult | OwnerOnlyResult;
    if (d.permanentAddress?.coordinates?.lat && d.permanentAddress?.coordinates?.lng) {
      return d.permanentAddress.coordinates as { lat: number; lng: number };
    }
  } else if (driver.type === "pair") {
    const p = driver as PairResult;
    if (p.driver?.permanentAddress?.coordinates?.lat && p.driver?.permanentAddress?.coordinates?.lng) {
      return p.driver.permanentAddress.coordinates as { lat: number; lng: number };
    }
  }
  return null;
};

export function useDriverMarkers(
  mapRef: React.RefObject<any | null>,
  ready: boolean,
  pickupCoords: LatLng | null,
  drivers: AnyResult[],
  distanceFilterKm: number,
  onDriverSelect?: (driver: AnyResult) => void,
  onDriverRouteDistance?: (extraKm: number) => void
): void {
  // DISABLED: This hook is disabled to keep the map simple
  // No driver markers will be shown automatically
  return;
  const driverMarkersRef = useRef<Map<string, any>>(new Map());
  const driverRoutesRef = useRef<any[]>([]);
  const activeAbortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!ready || !mapRef.current || !pickupCoords) return;
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const L = require("leaflet");
    const map = mapRef.current;

    driverMarkersRef.current.forEach(m => m.remove());
    driverMarkersRef.current.clear();
    driverRoutesRef.current.forEach(p => p.remove());
    driverRoutesRef.current = [];

    const filteredDrivers = drivers.filter(driver => {
      // ✅ Safety check: Skip if driver or roles is missing
      if (!driver) return false;
      
      // For pairs, check if they have required structure
      if (driver.type === "pair") {
        const p = driver as PairResult;
        return p.driver?.distanceAway !== undefined && p.driver?.distanceAway <= distanceFilterKm;
      }
      
      // For other types, check roles and distance
      if (!driver.roles || !Array.isArray(driver.roles)) {
        console.warn('⚠️ Driver missing roles:', driver);
        return false;
      }
      
      return (driver as any).distanceAway <= distanceFilterKm;
    });

    const drawDriverRoute = async (driver: AnyResult) => {
      activeAbortRef.current?.abort();
      activeAbortRef.current = new AbortController();
      const signal = activeAbortRef.current.signal;

      driverRoutesRef.current.forEach(p => p.remove());
      driverRoutesRef.current = [];

      const routeType = getDriverRouteType(driver);
      const driverCoords = getDriverCoords(driver);
      if (!driverCoords) return;

      let totalExtraKm = 0;

      if (routeType === 'self' || routeType === 'driver-only' || routeType === 'owner-only') {
        // Direct: driver/owner → pickup
        const result = await fetchOsrmRoute(driverCoords, pickupCoords!, signal);
        const coords = result?.coords ?? straightLine(driverCoords, pickupCoords!);
        totalExtraKm = result?.distanceKm ?? 0;
        const color = routeType === 'owner-only' ? '#7c3aed' : '#2563eb';
        const poly = L.polyline(coords, { color, weight: 3, opacity: 0.85, dashArray: '5 5' }).addTo(map);
        driverRoutesRef.current.push(poly);
      } else {
        // Combo: Driver → Owner → Pickup
        const ownerCoords = getDriverCoords(driver); // same person for now
        if (!ownerCoords) return;

        // Segment 1: Driver → Owner (amber)
        const seg1 = await fetchOsrmRoute(driverCoords, ownerCoords, signal);
        const coords1 = seg1?.coords ?? straightLine(driverCoords, ownerCoords);
        totalExtraKm += seg1?.distanceKm ?? 0;
        const poly1 = L.polyline(coords1, { color: '#f59e0b', weight: 3, opacity: 0.85, dashArray: '5 5' }).addTo(map);
        driverRoutesRef.current.push(poly1);

        // Segment 2: Owner → Pickup (purple)
        const seg2 = await fetchOsrmRoute(ownerCoords, pickupCoords!, signal);
        const coords2 = seg2?.coords ?? straightLine(ownerCoords, pickupCoords!);
        totalExtraKm += seg2?.distanceKm ?? 0;
        const poly2 = L.polyline(coords2, { color: '#7c3aed', weight: 3, opacity: 0.85, dashArray: '5 5' }).addTo(map);
        driverRoutesRef.current.push(poly2);
      }

      if (onDriverRouteDistance && totalExtraKm > 0) {
        onDriverRouteDistance(Math.round(totalExtraKm * 10) / 10);
      }
    };

    filteredDrivers.forEach(driver => {
      const coords = getDriverCoords(driver);
      if (!coords) return;
      const pos: [number, number] = [coords.lat, coords.lng];
      
      // Get roles for icon - handle different driver types
      let roles: string[] = [];
      if (driver.type === "pair") {
        const p = driver as PairResult;
        roles = p.driver?.driverInfo?.licenses?.length > 0 ? ['driver'] : [];
      } else {
        const d = driver as SelfDriverResult | DriverOnlyResult | OwnerOnlyResult;
        roles = d.roles || [];
      }
      
      const icon = makeDriverSvgIcon(L, roles);
      const marker = L.marker(pos, { icon }).addTo(map);
      marker.bindPopup(makePopupHtml(driver), { maxWidth: 240 });
      
      // Get appropriate ID for marker
      let markerId: string;
      if (driver.type === "pair") {
        markerId = (driver as PairResult).pairId;
      } else {
        markerId = (driver as SelfDriverResult | DriverOnlyResult | OwnerOnlyResult).userId;
      }
      
      driverMarkersRef.current.set(markerId, marker);
      marker.on('click', () => drawDriverRoute(driver));
    });

    const handlePopupOpen = () => {
      document.querySelectorAll('button[data-userid]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const userId = (e.target as HTMLElement).getAttribute('data-userid');
          const driver = drivers.find(d => {
            if (d.type === "pair") {
              return (d as PairResult).pairId === userId;
            }
            return (d as SelfDriverResult | DriverOnlyResult | OwnerOnlyResult).userId === userId;
          });
          if (driver) {
            onDriverSelect?.(driver);
            drawDriverRoute(driver);
          }
        });
      });
    };

    map.on('popupopen', handlePopupOpen);

    return () => {
      activeAbortRef.current?.abort();
      map.off('popupopen', handlePopupOpen);
      driverMarkersRef.current.forEach(m => m.remove());
      driverMarkersRef.current.clear();
      driverRoutesRef.current.forEach(p => p.remove());
      driverRoutesRef.current = [];
    };
  }, [ready, drivers, pickupCoords, distanceFilterKm, onDriverSelect, onDriverRouteDistance]);
}