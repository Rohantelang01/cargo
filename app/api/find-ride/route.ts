import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, type JWTPayload } from "jose";
import connectToDB from "@/lib/db";
import { User } from "@/models/User";
import { Vehicle } from "@/models/Vehicle";

type ModeParam = "instant" | "prebooking";
type VehicleTypeParam = "bike" | "auto" | "car" | "bus" | "truck" | "all";

type SortParam = "nearby" | "cheapest" | "rated" | "rating" | "price";
type StatusFilterParam = "all" | "online" | "available" | "scheduled";
type TypeFilterParam = "all" | "selfdriver" | "driver" | "owner" | "pair";

// Haversine function to calculate distance between two coordinates
function haversine(a: {lat:number,lng:number}, b: {lat:number,lng:number}): number {
  const R = 6371
  const dLat = (b.lat - a.lat) * Math.PI / 180
  const dLng = (b.lng - a.lng) * Math.PI / 180
  const x = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(a.lat * Math.PI/180) * Math.cos(b.lat * Math.PI/180) *
    Math.sin(dLng/2) * Math.sin(dLng/2)
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1-x))
}

function normalizeVehicleType(v: unknown): VehicleTypeParam {
  if (typeof v !== "string") return "all";
  const s = v.trim();
  if (!s) return "all";
  if (s === "all") return "all";
  if (s === "bike" || s === "auto" || s === "car" || s === "bus" || s === "truck") return s;
  return "all";
}

function normalizeStatusFilter(v: unknown): StatusFilterParam {
  if (typeof v !== "string") return "all";
  const s = v.trim().toLowerCase();
  if (s === "online") return "online";
  if (s === "available") return "available";
  if (s === "scheduled") return "scheduled";
  return "all";
}

function normalizeTypeFilter(v: unknown): TypeFilterParam {
  if (typeof v !== "string") return "all";
  const s = v.trim().toLowerCase();
  if (s === "selfdriver" || s === "self-driver" || s === "selfdriven" || s === "self-driven") return "selfdriver";
  if (s === "driver") return "driver";
  if (s === "owner") return "owner";
  if (s === "pair") return "pair";
  return "all";
}

function normalizeSort(v: unknown): SortParam {
  if (typeof v !== "string") return "nearby";
  const s = v.trim().toLowerCase();
  if (s === "nearby") return "nearby";
  if (s === "cheapest" || s === "price") return s as SortParam;
  if (s === "rated" || s === "rating") return s as SortParam;
  return "nearby";
}

function getGeoJsonLatLng(p: any): { lat: number; lng: number } | null {
  // GeoJSON is [lng, lat]
  const coords = p?.coordinates;
  if (!Array.isArray(coords) || coords.length < 2) return null;
  const lng = Number(coords[0]);
  const lat = Number(coords[1]);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { lat, lng };
}

function getAddressLatLng(u: any): { lat: number; lng: number } | null {
  const c = u?.permanentAddress?.coordinates;
  if (!c) return null;
  const lat = Number(c.lat);
  const lng = Number(c.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { lat, lng };
}

function getUserCoordsForMode(u: any, mode: ModeParam): { lat: number; lng: number } | null {
  if (mode === "instant") {
    const geo = getGeoJsonLatLng(u?.currentLocation);
    if (geo) return geo;
  }
  return getAddressLatLng(u);
}

function getDistanceAwayForResult(item: any): number {
  if (item?.type === "pair") return Number(item?.driver?.distanceAway ?? Infinity);
  return Number(item?.distanceAway ?? Infinity);
}

function getRatingForResult(item: any): number {
  if (item?.type === "pair") return Number(item?.driver?.driverInfo?.rating ?? 0);
  if (item?.type === "owner") return Number(item?.ownerInfo?.rating ?? 0);
  return Number(item?.driverInfo?.rating ?? 0);
}

function getFareForResult(item: any): number {
  return Number(item?.estimatedFare ?? Infinity);
}

function getToken(req: NextRequest) {
  const cookieToken = req.cookies.get("token")?.value;
  if (cookieToken) return cookieToken;

  const auth = req.headers.get("authorization");
  if (!auth) return null;
  const m = auth.match(/^Bearer\s+(.+)$/i);
  return m?.[1] ?? null;
}

async function verifyJwt(token: string) {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined");
  const secret = new TextEncoder().encode(JWT_SECRET);
  const { payload } = await jwtVerify(token, secret);
  return payload as JWTPayload & { id?: string };
}

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const token = getToken(req);
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const payload = await verifyJwt(token);
    if (!payload?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    // Step 1 — Parse request
    const body = await req.json();
    const pickup = body?.pickup;
    const destination = body?.destination;
    const mode: ModeParam = body?.mode === "prebooking" ? "prebooking" : "instant";
    const passengers = body?.passengers;
    const date = body?.date;
    const time = body?.time;

    // Optional filters (non-breaking; UI can still filter on frontend)
    const typeFilter = normalizeTypeFilter(body?.filters?.type ?? body?.type);
    const statusFilter = normalizeStatusFilter(body?.filters?.status ?? body?.status);
    const sort = normalizeSort(body?.filters?.sort ?? body?.sort);

    const vehicleTypeNorm = normalizeVehicleType(body?.vehicleType);

    console.log("Find ride request:", {
      pickup,
      destination,
      vehicleType: body?.vehicleType,
      vehicleTypeNorm,
      mode,
      passengers,
      date,
      time,
      typeFilter,
      statusFilter,
      sort,
    });

    if (!pickup || !Number.isFinite(pickup.lat) || !Number.isFinite(pickup.lng) || !destination || !Number.isFinite(destination.lat) || !Number.isFinite(destination.lng)) {
      console.error("Missing coordinates:", { pickup, destination });
      return NextResponse.json({ message: "pickup and destination coordinates are required" }, { status: 400 });
    }

    const pickupCoords = { lat: Number(pickup.lat), lng: Number(pickup.lng) };
    const destinationCoords = { lat: Number(destination.lat), lng: Number(destination.lng) };

    // Calculate trip distance and time
    const tripKm = haversine(pickupCoords, destinationCoords);
    const tripMinutes = Math.round((tripKm / 40) * 60); // assume 40km/h avg
    const tripHours = tripMinutes / 60;

    const results: any[] = [];

    const allowedVehicleTypes = vehicleTypeNorm === "all"
      ? ["bike", "auto", "car", "bus", "truck"]
      : [vehicleTypeNorm];

    const userStatusAllowed = (() => {
      if (statusFilter === "online") return ["ONLINE"]; // top-level
      if (statusFilter === "all") return ["ONLINE", "OFFLINE", "ON_TRIP"];
      // available/scheduled are driverInfo-based filters; still require ONLINE by default
      return ["ONLINE"]; 
    })();

    const driverInfoStatusAllowed = (() => {
      if (statusFilter === "available") return ["AVAILABLE"];
      if (statusFilter === "scheduled") return ["SCHEDULED"];
      // online/all => allow all driver statuses, but still need licenses
      return ["AVAILABLE", "SCHEDULED", "UNAVAILABLE", "OFFLINE", "ON_TRIP"]; 
    })();

    const vehicleStatusAllowed = (() => {
      if (statusFilter === "all") return ["AVAILABLE", "OFFLINE", "ON_TRIP"];
      // For online/available/scheduled: show available vehicles
      return ["AVAILABLE"]; 
    })();

    const baseModeFilterType: TypeFilterParam = mode === "instant" ? "selfdriver" : "all";
    const effectiveTypeFilter: TypeFilterParam = baseModeFilterType === "selfdriver" ? "selfdriver" : typeFilter;

    // Step 2 — Fetch Self Drivers
    if (mode === "instant" || mode === "prebooking") {
      const selfDriverUsers = await User.find({
        roles: { $all: ["driver", "owner"] },
        status: { $in: userStatusAllowed },
        "driverInfo.status": { $in: driverInfoStatusAllowed },
        "driverInfo.licenses": {
          $elemMatch: {
            vehicleCategory: { $in: allowedVehicleTypes },
            isActive: true,
          },
        },
      })
        .populate({
          path: "ownerInfo.vehicles",
          match: {
            selfDriven: true,
            vehicleType: { $in: allowedVehicleTypes },
            status: { $in: vehicleStatusAllowed },
          },
        })
        .select("name profileImage roles permanentAddress currentLocation driverInfo ownerInfo status")
        .lean();

      console.log("✅ Selfdriver users fetched:", selfDriverUsers.length);

      for (const user of selfDriverUsers as any[]) {
        const vehicles: any[] = Array.isArray(user.ownerInfo?.vehicles) ? user.ownerInfo.vehicles : [];
        if (!vehicles.length) continue;

        for (const vehicle of vehicles) {
          // Self-driver linkage validation when available
          const linkedVehicleId = user?.driverInfo?.linkedVehicleId ? String(user.driverInfo.linkedVehicleId) : null;
          if (linkedVehicleId && String(vehicle._id) !== linkedVehicleId) continue;

          const userCoords = getUserCoordsForMode(user, mode);
          if (!userCoords) continue;

          const distanceAway = haversine(userCoords, pickupCoords);
          const arrivalMinutes = Math.round((distanceAway / 40) * 60);

          const matchedLicense = (user.driverInfo?.licenses as any[])?.find(
            (l: any) => l?.vehicleCategory === vehicle.vehicleType && l?.isActive
          );
          if (!matchedLicense) continue;

          const driverRate = Number(matchedLicense.hourlyRate ?? 0) * tripHours;
          const ownerRate = Number(vehicle.perKmRate ?? 0) * tripKm;
          const platformFee = 1 * tripKm;
          const pickupReturnCharge = distanceAway * 1 * 2;
          const estimatedFare = driverRate + ownerRate + platformFee + pickupReturnCharge;

          results.push({
            type: "selfdriver",
            status: user.status,
            userId: user._id,
            name: user.name,
            profileImage: user.profileImage,
            roles: user.roles,
            isCombo: true,
            currentLocation: mode === "instant" ? (getGeoJsonLatLng(user.currentLocation) ?? undefined) : undefined,
            permanentAddress: user.permanentAddress,
            driverInfo: {
              licenses: user.driverInfo?.licenses || [],
              status: user.driverInfo?.status,
              rating: user.driverInfo?.rating || 0,
              totalTrips: user.driverInfo?.totalTrips || 0,
            },
            vehicle: {
              _id: vehicle._id,
              make: vehicle.make,
              model: vehicle.model,
              year: vehicle.year,
              plateNumber: vehicle.plateNumber,
              vehicleType: vehicle.vehicleType,
              seatingCapacity: vehicle.seatingCapacity,
              perKmRate: vehicle.perKmRate,
              rcDocument: vehicle.rcDocument,
              insurance: vehicle.insurance,
              selfDriven: true,
            },
            distanceAway: Math.round(distanceAway * 10) / 10,
            arrivalMinutes,
            estimatedFare: Math.round(estimatedFare),
          });
        }
      }
    }

    // Step 3 — Fetch Pure Drivers (Prebooking only)
    if (mode === "prebooking") {
      const pureDrivers = await User.find({
        $and: [
          { roles: "driver" },
          { roles: { $ne: "owner" } },
        ],
        status: { $in: userStatusAllowed },
        "driverInfo.status": { $in: driverInfoStatusAllowed },
        "driverInfo.licenses": {
          $elemMatch: {
            vehicleCategory: { $in: allowedVehicleTypes },
            isActive: true,
          },
        },
        "permanentAddress.coordinates": { $exists: true },
      })
        .select("name profileImage roles permanentAddress driverInfo status")
        .lean();

      console.log("✅ Pure drivers fetched:", pureDrivers.length);

      for (const user of pureDrivers as any[]) {
        if (!user.permanentAddress?.coordinates) continue;

        const distanceAway = haversine(
          { lat: user.permanentAddress.coordinates.lat, lng: user.permanentAddress.coordinates.lng },
          pickupCoords
        );
        const arrivalMinutes = Math.round(distanceAway / 40 * 60);
        
        const matchedLicense = (user.driverInfo?.licenses as any[])?.find(
          (l: any) => allowedVehicleTypes.includes(l?.vehicleCategory) && l?.isActive
        );
        
        if (!matchedLicense) continue;

        const estimatedFare = matchedLicense.hourlyRate * tripHours;

        results.push({
          type: "driver",
          status: user.status,
          userId: user._id,
          name: user.name,
          profileImage: user.profileImage,
          roles: user.roles,
          permanentAddress: user.permanentAddress,
          driverInfo: {
            licenses: user.driverInfo?.licenses || [],
            status: user.driverInfo?.status,
            rating: user.driverInfo?.rating || 0,
            totalTrips: user.driverInfo?.totalTrips || 0
          },
          distanceAway: Math.round(distanceAway * 10) / 10,
          arrivalMinutes,
          estimatedFare: Math.round(estimatedFare)
        });
      }
    }

    // Step 4 — Fetch Pure Owners + Vehicles (Prebooking only)
    if (mode === "prebooking") {
      const vehicles = await Vehicle.find({
        vehicleType: { $in: allowedVehicleTypes },
        selfDriven: false,
        status: { $in: vehicleStatusAllowed },
      })
        .populate("owner", "name profileImage roles permanentAddress ownerInfo status")
        .lean();

      console.log("✅ Pure owner vehicles fetched:", vehicles.length);

      for (const vehicle of vehicles as any[]) {
        const owner = vehicle.owner;
        if (!owner || !userStatusAllowed.includes(owner.status)) continue;
        
        if (!owner.permanentAddress?.coordinates) continue;

        const distanceAway = haversine(
          { lat: owner.permanentAddress.coordinates.lat, lng: owner.permanentAddress.coordinates.lng },
          pickupCoords
        );
        const arrivalMinutes = Math.round(distanceAway / 40 * 60);
        const estimatedFare = vehicle.perKmRate * tripKm;

        results.push({
          type: "owner",
          status: owner.status,
          userId: owner._id,
          name: owner.name,
          profileImage: owner.profileImage,
          roles: owner.roles,
          permanentAddress: owner.permanentAddress,
          vehicle: {
            _id: vehicle._id,
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
            plateNumber: vehicle.plateNumber,
            vehicleType: vehicle.vehicleType,
            seatingCapacity: vehicle.seatingCapacity,
            perKmRate: vehicle.perKmRate,
            rcDocument: vehicle.rcDocument,
            insurance: vehicle.insurance
          },
          ownerInfo: {
            rating: owner.ownerInfo?.rating || 0,
            totalTrips: owner.ownerInfo?.totalTrips || 0,
            status: owner.status || "ONLINE"
          },
          distanceAway: Math.round(distanceAway * 10) / 10,
          arrivalMinutes,
          estimatedFare: Math.round(estimatedFare)
        });
      }
    }

    // Step 5 — Generate Pairs (Prebooking only)
    if (mode === "prebooking") {
      const drivers = await User.find({
        $and: [
          { roles: "driver" },
          { roles: { $ne: "owner" } },
        ],
        status: { $in: userStatusAllowed },
        "driverInfo.status": { $in: driverInfoStatusAllowed },
        "driverInfo.licenses": {
          $elemMatch: {
            vehicleCategory: { $in: allowedVehicleTypes },
            isActive: true,
          },
        },
        "permanentAddress.coordinates": { $exists: true },
      })
        .select("name profileImage permanentAddress driverInfo status")
        .lean();

      const ownerVehicles = await Vehicle.find({
        vehicleType: { $in: allowedVehicleTypes },
        selfDriven: false,
        status: { $in: vehicleStatusAllowed },
      })
        .populate("owner", "name profileImage permanentAddress ownerInfo status")
        .lean();

      console.log("✅ Pair generation candidates:", { drivers: drivers.length, ownerVehicles: ownerVehicles.length });

      const driverPairCount: Record<string, number> = {};
      const ownerPairCount: Record<string, number> = {};

      for (const driver of drivers as any[]) {
        for (const vehicleDoc of ownerVehicles as any[]) {
          const owner = vehicleDoc.owner;
          if (!owner || !userStatusAllowed.includes(owner.status)) continue;
          
          if (!driver.permanentAddress?.coordinates || !owner.permanentAddress?.coordinates) continue;

          const driverId = String(driver._id);
          const ownerId = String(owner._id);
          
          if ((driverPairCount[driverId] || 0) >= 3 || (ownerPairCount[ownerId] || 0) >= 3) continue;

          const matchedLicense = (driver.driverInfo?.licenses as any[])?.find(
            (l: any) => l.vehicleCategory === vehicleDoc.vehicleType && l.isActive
          );
          
          if (!matchedLicense) continue;

          const pairId = `${driverId}:${ownerId}:${vehicleDoc._id}`;

          // Calculate 5 legs
          const driverCoords = { lat: driver.permanentAddress.coordinates.lat, lng: driver.permanentAddress.coordinates.lng };
          const ownerCoords = { lat: owner.permanentAddress.coordinates.lat, lng: owner.permanentAddress.coordinates.lng };
          
          const leg1 = haversine(driverCoords, ownerCoords); // driver to owner
          const leg2 = haversine(ownerCoords, pickupCoords); // owner to pickup
          const leg3 = tripKm; // pickup to destination
          const leg4 = haversine(destinationCoords, ownerCoords); // destination to owner
          const leg5 = haversine(ownerCoords, driverCoords); // owner to driver
          const total = leg1 + leg2 + leg3 + leg4 + leg5;

          // Fare breakdown
          const driverRate = matchedLicense.hourlyRate * tripHours;
          const ownerRate = vehicleDoc.perKmRate * tripKm;
          const platformFee = 1 * tripKm;
          const pickupReturnCharge = ((haversine(driverCoords, pickupCoords)) + (haversine(ownerCoords, pickupCoords))) * 1 * 2;
          const totalFare = driverRate + ownerRate + platformFee + pickupReturnCharge;

          results.push({
            type: "pair",
            status: "ONLINE",
            pairId,
            driver: {
              userId: driver._id,
              name: driver.name,
              profileImage: driver.profileImage,
              permanentAddress: driver.permanentAddress,
              driverInfo: {
                licenses: driver.driverInfo?.licenses || [],
                status: driver.driverInfo?.status,
                rating: driver.driverInfo?.rating || 0,
                totalTrips: driver.driverInfo?.totalTrips || 0
              },
              distanceAway: Math.round(haversine(driverCoords, pickupCoords) * 10) / 10
            },
            owner: {
              userId: owner._id,
              name: owner.name,
              profileImage: owner.profileImage,
              permanentAddress: owner.permanentAddress,
              vehicle: {
                _id: vehicleDoc._id,
                make: vehicleDoc.make,
                model: vehicleDoc.model,
                year: vehicleDoc.year,
                plateNumber: vehicleDoc.plateNumber,
                vehicleType: vehicleDoc.vehicleType,
                seatingCapacity: vehicleDoc.seatingCapacity,
                perKmRate: vehicleDoc.perKmRate,
                rcDocument: vehicleDoc.rcDocument,
                insurance: vehicleDoc.insurance
              },
              ownerInfo: {
                rating: owner.ownerInfo?.rating || 0,
                totalTrips: owner.ownerInfo?.totalTrips || 0,
                status: owner.status || "ONLINE"
              },
              distanceAway: Math.round(haversine(ownerCoords, pickupCoords) * 10) / 10
            },
            matchedLicense,
            fareBreakdown: {
              driverRate: Math.round(driverRate),
              ownerRate: Math.round(ownerRate),
              platformFee: Math.round(platformFee),
              pickupReturnCharge: Math.round(pickupReturnCharge),
              totalFare: Math.round(totalFare)
            },
            legs: {
              driverToOwner: Math.round(leg1 * 10) / 10,
              ownerToPickup: Math.round(leg2 * 10) / 10,
              tripKm: Math.round(leg3 * 10) / 10,
              destinationToOwner: Math.round(leg4 * 10) / 10,
              ownerToDriver: Math.round(leg5 * 10) / 10,
              total: Math.round(total * 10) / 10
            },
            arrivalMinutes: Math.round((leg1 + leg2) / 40 * 60), // driver to owner to pickup time
            estimatedFare: Math.round(totalFare)
          });

          driverPairCount[driverId] = (driverPairCount[driverId] || 0) + 1;
          ownerPairCount[ownerId] = (ownerPairCount[ownerId] || 0) + 1;
        }
      }
    }

    // Optional: type filter applied server-side (instant mode is always locked to selfdriver)
    const typedResults = effectiveTypeFilter === "all"
      ? results
      : results.filter((r) => r?.type === effectiveTypeFilter);

    // Step 6 — Sort all results
    const sortMode = sort;
    typedResults.sort((a, b) => {
      if (sortMode === "cheapest" || sortMode === "price") {
        return getFareForResult(a) - getFareForResult(b);
      }
      if (sortMode === "rated" || sortMode === "rating") {
        return getRatingForResult(b) - getRatingForResult(a);
      }
      // nearby default
      const byDist = getDistanceAwayForResult(a) - getDistanceAwayForResult(b);
      if (byDist !== 0) return byDist;
      return getFareForResult(a) - getFareForResult(b);
    });

    console.log("✅ Find-ride results built:", {
      total: typedResults.length,
      mode,
      vehicleTypeNorm,
      typeFilter: effectiveTypeFilter,
      statusFilter,
      sort: sortMode,
      counts: {
        selfdriver: typedResults.filter((r) => r.type === "selfdriver").length,
        driver: typedResults.filter((r) => r.type === "driver").length,
        owner: typedResults.filter((r) => r.type === "owner").length,
        pair: typedResults.filter((r) => r.type === "pair").length,
      },
    });

    // Add tripInfo to each result for frontend components
    const enhancedResults = typedResults.map(r => ({
      ...r,
      tripInfo: {
        distanceKm: Math.round(tripKm * 10) / 10,
        durationMinutes: tripMinutes,
        pickupCoords,
        destinationCoords
      }
    }));

    // Step 7 — Return response
    return NextResponse.json({
      results: enhancedResults,
      total: enhancedResults.length,
      tripKm: Math.round(tripKm * 10) / 10,
      tripMinutes
    });

  } catch (error: any) {
    console.error("Find ride error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
