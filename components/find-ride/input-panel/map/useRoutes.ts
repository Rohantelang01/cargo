import { useEffect, useRef } from "react";
import type { AnyResult } from "@/types/driver";

export type LatLng = {
  lat: number;
  lng: number;
};

export function useRoutes(
  mapRef: React.RefObject<any | null>,
  ready: boolean,
  pickupCoords: LatLng | null,
  destCoords: LatLng | null,
  onRouteSelect?: (distanceKm: number, durationMin: number) => void,
  selectedDriver?: AnyResult | null // ⭐ NEW PARAMETER
): void {
  const routePolylinesRef = useRef<any[]>([]);
  const selectedIndexRef = useRef<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleRouteClick = (clickedIndex: number, route: any) => {
    selectedIndexRef.current = clickedIndex;
    
    // Update polyline styles imperatively without re-render
    routePolylinesRef.current.forEach((polyline, index) => {
      const isSelected = index === clickedIndex;
      polyline.setStyle({
        color: isSelected ? '#2563eb' : '#9ca3af',
        weight: isSelected ? 4 : 2.5,
        opacity: isSelected ? 0.9 : 0.45,
      });
    });

    // Call onRouteSelect with clicked route
    if (onRouteSelect) {
      const distanceKm = Math.round(route.distance / 100) / 10;
      const durationMin = Math.round(route.duration / 60);
      onRouteSelect(distanceKm, durationMin);
    }
  };

  // ⭐ NEW FUNCTION: Build waypoints based on driver type - SIMPLIFIED VERSION
  const buildWaypoints = (
    pickup: LatLng,
    dest: LatLng,
    driver?: AnyResult | null
  ): LatLng[] => {
    
    if (!driver) {
      // No driver selected - just show pickup to destination
      return [pickup, dest];
    }

    // ────────────────────────────────────────────────────────
    // SELF DRIVER: Driver Location → Pickup → Destination (NO RETURN)
    // ────────────────────────────────────────────────────────
    if (driver.type === 'selfdriver') {
      let driverLoc: LatLng | null = null;

      // Try currentLocation first (instant booking)
      if (driver.currentLocation) {
        driverLoc = {
          lat: driver.currentLocation.lat,
          lng: driver.currentLocation.lng
        };
      }
      // Fallback to permanentAddress (prebooking)
      else if (driver.permanentAddress?.coordinates) {
        driverLoc = {
          lat: driver.permanentAddress.coordinates.lat,
          lng: driver.permanentAddress.coordinates.lng
        };
      }

      if (driverLoc) {
        return [
          driverLoc,    // Segment 1: Driver → Pickup (ORANGE)
          pickup,       // Connection point
          dest,         // Segment 2: Pickup → Destination (BLUE)
          // STOP! No return route
        ];
      }
    }

    // ────────────────────────────────────────────────────────
    // PAIR (Driver + Owner): Driver → Owner → Pickup → Destination (NO RETURN)
    // ────────────────────────────────────────────────────────
    if (driver.type === 'pair') {
      let driverLoc: LatLng | null = null;
      let ownerLoc: LatLng | null = null;

      // Get driver permanent address
      if (driver.driver?.permanentAddress?.coordinates) {
        driverLoc = {
          lat: driver.driver.permanentAddress.coordinates.lat,
          lng: driver.driver.permanentAddress.coordinates.lng
        };
      }

      // Get owner permanent address
      if (driver.owner?.permanentAddress?.coordinates) {
        ownerLoc = {
          lat: driver.owner.permanentAddress.coordinates.lat,
          lng: driver.owner.permanentAddress.coordinates.lng
        };
      }

      if (driverLoc && ownerLoc) {
        return [
          driverLoc,    // Segment 1: Driver → Owner → Pickup (ORANGE - combined)
          ownerLoc,     // Vehicle pickup location
          pickup,       // Passenger pickup
          dest,         // Segment 2: Pickup → Destination (BLUE)
          // STOP! No return routes
        ];
      }
    }

    // Fallback: simple route
    return [pickup, dest];
  };

  useEffect(() => {
    if (!ready || !mapRef.current || !pickupCoords || !destCoords) {
      // Clear routes if no valid coordinates
      routePolylinesRef.current.forEach(polyline => polyline.remove());
      routePolylinesRef.current = [];
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const L = require("leaflet");
    const map = mapRef.current;

    // Abort previous fetch
    abortControllerRef.current?.abort();
    
    // Clear existing polylines
    routePolylinesRef.current.forEach(polyline => polyline.remove());
    routePolylinesRef.current = [];
    selectedIndexRef.current = 0;

    // ⭐ BUILD WAYPOINTS BASED ON DRIVER TYPE
    const waypoints = buildWaypoints(pickupCoords, destCoords, selectedDriver);

    // ⭐ SIMPLE ROUTE (2 waypoints) - Use alternatives
    if (waypoints.length === 2) {
      const fetchRoutes = async () => {
        abortControllerRef.current = new AbortController();
        
        try {
          const url = `https://router.project-osrm.org/route/v1/driving/${pickupCoords.lng},${pickupCoords.lat};${destCoords.lng},${destCoords.lat}?overview=full&geometries=geojson&alternatives=true`;
          
          const response = await fetch(url, { 
            signal: abortControllerRef.current.signal 
          });
          
          const data = await response.json();
          
          if (data.routes && data.routes.length > 0) {
            data.routes.forEach((route: any, index: number) => {
              const coordinates = route.geometry.coordinates.map(([lng, lat]: [number, number]) => [lat, lng] as [number, number]);
              
              const isSelected = index === selectedIndexRef.current;
              const polyline = L.polyline(coordinates, {
                color: isSelected ? '#2563eb' : '#9ca3af',
                weight: isSelected ? 4 : 2.5,
                opacity: isSelected ? 0.9 : 0.45,
                dashArray: index === 0 ? undefined : '6 4',
              }).addTo(map);
              
              polyline.on('click', () => handleRouteClick(index, route));
              routePolylinesRef.current.push(polyline);
            });
            
            // Fit bounds to primary route
            if (data.routes[0]?.geometry?.coordinates?.length > 0) {
              const primaryCoords = data.routes[0].geometry.coordinates.map(([lng, lat]: [number, number]) => [lat, lng] as [number, number]);
              map.fitBounds(L.latLngBounds(primaryCoords), { padding: [40, 40] });
            }
            
            // Call onRouteSelect for primary route
            if (onRouteSelect && data.routes[0]) {
              const distanceKm = Math.round(data.routes[0].distance / 100) / 10;
              const durationMin = Math.round(data.routes[0].duration / 60);
              onRouteSelect(distanceKm, durationMin);
            }
          }
        } catch (error: any) {
          if (error.name !== 'AbortError') {
            console.warn("OSRM fetch failed, falling back to straight line:", error);
            
            const positions: [number, number][] = [
              [pickupCoords.lat, pickupCoords.lng],
              [destCoords.lat, destCoords.lng],
            ];
            
            const polyline = L.polyline(positions, {
              color: '#2563eb',
              weight: 3,
              dashArray: '6 6',
              opacity: 0.8,
            }).addTo(map);
            
            routePolylinesRef.current.push(polyline);
            map.fitBounds(L.latLngBounds(positions), { padding: [40, 40] });
          }
        }
      };

      fetchRoutes();
    }
    // ⭐ MULTI-LEG ROUTE (3+ waypoints) - Draw segments with 2 colors only
    else {
      const fetchMultiSegmentRoute = async () => {
        abortControllerRef.current = new AbortController();
        
        try {
          // SIMPLIFIED: Only 2 colors
          // ORANGE (#f59e0b): All segments before final (driver → pickup)
          // BLUE (#2563eb): Final segment (pickup → destination)
          const segmentColors = [
            '#f59e0b', // ORANGE: Driver → Owner/Pickup segments
            '#2563eb', // BLUE: Pickup → Destination (main trip)
          ];

          let totalDistance = 0;
          let totalDuration = 0;
          const allCoordinates: [number, number][] = [];

          // Fetch each segment
          for (let i = 0; i < waypoints.length - 1; i++) {
            const start = waypoints[i];
            const end = waypoints[i + 1];
            
            const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`;
            
            const response = await fetch(url, { 
              signal: abortControllerRef.current.signal 
            });
            
            const data = await response.json();
            
            if (data.routes && data.routes[0]) {
              const route = data.routes[0];
              const coordinates = route.geometry.coordinates.map(
                ([lng, lat]: [number, number]) => [lat, lng] as [number, number]
              );
              
              // Determine color: ORANGE for all segments except last, BLUE for last segment
              const isLastSegment = (i === waypoints.length - 2);
              const segmentColor = isLastSegment ? '#2563eb' : '#f59e0b';
              
              // Draw this segment with specific color
              const polyline = L.polyline(coordinates, {
                color: segmentColor,
                weight: 4,
                opacity: 0.8,
              }).addTo(map);
              
              routePolylinesRef.current.push(polyline);
              allCoordinates.push(...coordinates);
              
              totalDistance += route.distance;
              totalDuration += route.duration;
            }
          }

          // Fit bounds to all coordinates
          if (allCoordinates.length > 0) {
            map.fitBounds(L.latLngBounds(allCoordinates), { padding: [50, 50] });
          }

          // Call onRouteSelect with total distance/duration
          if (onRouteSelect && totalDistance > 0) {
            const distanceKm = Math.round(totalDistance / 100) / 10;
            const durationMin = Math.round(totalDuration / 60);
            onRouteSelect(distanceKm, durationMin);
          }
          
        } catch (error: any) {
          if (error.name !== 'AbortError') {
            console.warn("Multi-segment route failed, drawing straight lines:", error);
            
            // Fallback: draw straight dashed lines
            const allPositions = waypoints.map(w => [w.lat, w.lng] as [number, number]);
            const polyline = L.polyline(allPositions, {
              color: '#2563eb',
              weight: 3,
              dashArray: '6 6',
              opacity: 0.6,
            }).addTo(map);
            
            routePolylinesRef.current.push(polyline);
            map.fitBounds(L.latLngBounds(allPositions), { padding: [40, 40] });
          }
        }
      };

      fetchMultiSegmentRoute();
    }

    return () => {
      abortControllerRef.current?.abort();
      routePolylinesRef.current.forEach(polyline => polyline.remove());
      routePolylinesRef.current = [];
    };
  }, [ready, pickupCoords, destCoords, onRouteSelect, selectedDriver]); // ⭐ Added selectedDriver dependency
}