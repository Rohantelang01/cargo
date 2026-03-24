import type { AnyResult, SelfDriverResult, DriverOnlyResult, OwnerOnlyResult, PairResult } from "@/types/driver";

export function getMarkerColor(roles: string[]): string {
  const hasDriver = roles.includes('driver');
  const hasOwner = roles.includes('owner');
  if (hasDriver && hasOwner) return '#d97706';
  if (hasDriver) return '#2563eb';
  if (hasOwner) return '#7c3aed';
  return '#6b7280';
}

export function getMarkerLetter(roles: string[]): string {
  const hasDriver = roles.includes('driver');
  const hasOwner = roles.includes('owner');
  if (hasDriver && hasOwner) return 'C';
  if (hasDriver) return 'D';
  if (hasOwner) return 'O';
  return '?';
}

export function makeDriverSvgIcon(L: any, roles: string[]): any {
  const color = getMarkerColor(roles);
  const letter = getMarkerLetter(roles);
  return L.divIcon({
    className: "",
    html: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
      <path d="M14 0C6.27 0 0 6.27 0 14c0 10.5 14 22 14 22S28 24.5 28 14C28 6.27 21.73 0 14 0z"
        fill="${color}" stroke="white" stroke-width="1.5"/>
      <text x="14" y="19" text-anchor="middle" font-size="11" font-weight="bold"
        fill="white" font-family="sans-serif">${letter}</text>
    </svg>`,
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -36],
  });
}

export function makePopupHtml(driver: AnyResult): string {
  // Handle different driver types safely
  let hasDriver = false;
  let hasOwner = false;
  let name = '';
  let rating = 0;
  let totalTrips = 0;
  let vehicle = null;
  let distanceAway = 0;
  let estimatedFare = 0;
  let userId = '';

  if (driver.type === "pair") {
    const p = driver as PairResult;
    hasDriver = true; // Pairs always have driver
    hasOwner = true;  // Pairs always have owner
    name = p.driver?.name || '';
    rating = p.driver?.driverInfo?.rating || 0;
    totalTrips = p.driver?.driverInfo?.totalTrips || 0;
    vehicle = p.owner?.vehicle || null;
    distanceAway = p.driver?.distanceAway || 0;
    estimatedFare = p.estimatedFare || 0;
    userId = p.pairId || '';
  } else if (driver.type === "owner") {
    const o = driver as OwnerOnlyResult;
    hasDriver = false;
    hasOwner = true;
    name = o.name || '';
    rating = o.ownerInfo?.rating || 0;
    totalTrips = o.ownerInfo?.totalTrips || 0;
    vehicle = o.vehicle || null;
    distanceAway = o.distanceAway || 0;
    estimatedFare = o.estimatedFare || 0;
    userId = o.userId || '';
  } else {
    // SelfDriver or Driver
    const d = driver as SelfDriverResult | DriverOnlyResult;
    hasDriver = d.roles?.includes('driver') || false;
    hasOwner = d.roles?.includes('owner') || false;
    name = d.name || '';
    rating = d.driverInfo?.rating || 0;
    totalTrips = d.driverInfo?.totalTrips || 0;
    vehicle = (d as any).vehicle || null;
    distanceAway = (d as any).distanceAway || 0;
    estimatedFare = (d as any).estimatedFare || 0;
    userId = d.userId || '';
  }

  const roleBadge = hasDriver && hasOwner ? 'Driver+Owner' : hasDriver ? 'Driver' : 'Owner';
  return `
    <div style="min-width:200px;font-size:12px;">
      <div style="font-weight:bold;margin-bottom:4px;">${name}</div>
      <div style="background:#f3f4f6;padding:2px 6px;border-radius:4px;display:inline-block;margin-bottom:4px;">${roleBadge}</div>
      <div style="margin-bottom:2px;">⭐ ${rating} • ${totalTrips} trips</div>
      ${vehicle ? `
        <div style="margin-bottom:2px;">🚗 ${vehicle.make} ${vehicle.model} ${vehicle.plateNumber}</div>
        <div style="margin-bottom:2px;">💰 ₹${vehicle.perKmRate}/km</div>
      ` : ''}
      <div style="margin-bottom:8px;">📍 ${distanceAway} km away • ₹${estimatedFare} est.</div>
      <button data-userid="${userId}"
        style="background:#2563eb;color:white;border:none;padding:4px 10px;border-radius:4px;cursor:pointer;font-size:11px;">
        Select
      </button>
    </div>
  `;
}

export function makeDotIcon(L: any, color: string): any {
  return L.divIcon({
    className: "",
    html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2.5px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.35)"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

export type DriverRouteType = 'self' | 'driver-only' | 'owner-only' | 'combo';

export function getDriverRouteType(driver: AnyResult): DriverRouteType {
  if (driver.type === "pair") {
    return 'combo'; // Pairs are always combo
  }
  
  // For other types, check roles
  let hasDriver = false;
  let hasOwner = false;
  
  if (driver.type === "selfdriver" || driver.type === "driver" || driver.type === "owner") {
    const d = driver as SelfDriverResult | DriverOnlyResult | OwnerOnlyResult;
    hasDriver = d.roles?.includes('driver') || false;
    hasOwner = d.roles?.includes('owner') || false;
  }
  
  if (hasDriver && hasOwner) return 'self';
  if (hasDriver) return 'driver-only';
  if (hasOwner) return 'owner-only';
  return 'self';
}

export async function fetchOsrmRoute(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
  signal?: AbortSignal
): Promise<{ coords: [number, number][]; distanceKm: number } | null> {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`;
    const res = await fetch(url, { signal });
    const data = await res.json();
    if (!data.routes?.[0]) return null;
    const coords = data.routes[0].geometry.coordinates.map(
      ([lng, lat]: [number, number]) => [lat, lng] as [number, number]
    );
    const distanceKm = Math.round(data.routes[0].distance / 100) / 10;
    return { coords, distanceKm };
  } catch {
    return null;
  }
}

export function straightLine(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number }
): [number, number][] {
  return [[from.lat, from.lng], [to.lat, to.lng]];
}