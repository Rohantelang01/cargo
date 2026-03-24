import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, type JWTPayload } from "jose";
import mongoose from "mongoose";
import connectToDB from "@/lib/db";
import { User } from "@/models/User";
import { Vehicle } from "@/models/Vehicle";
import { Booking } from "@/models/Booking";
import { BookingRequest } from "@/models/BookingRequest";

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

function parseScheduledDateTime(date: string, time: string) {
  const dt = new Date(`${date}T${time}:00`);
  if (!Number.isFinite(dt.getTime())) return null;
  return dt;
}

export async function POST(req: NextRequest) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await connectToDB();

    const token = getToken(req);
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const payload = await verifyJwt(token);
    if (!payload?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const {
      selectedPairs,
      pickup,
      destination,
      passengers,
      vehicleType,
      purpose,
      notes,
      date,
      time,
      distanceKm,
      paymentMethod,
    } = body ?? {};

    if (!Array.isArray(selectedPairs) || selectedPairs.length < 1 || selectedPairs.length > 3) {
      return NextResponse.json({ message: "selectedPairs must be 1 to 3" }, { status: 400 });
    }

    if (!pickup || !destination) {
      return NextResponse.json({ message: "pickup and destination are required" }, { status: 400 });
    }

    if (!passengers || passengers <= 0) {
      return NextResponse.json({ message: "passengers is required" }, { status: 400 });
    }

    if (!vehicleType) {
      return NextResponse.json({ message: "vehicleType is required" }, { status: 400 });
    }

    if (!date || !time) {
      return NextResponse.json({ message: "date and time are required" }, { status: 400 });
    }

    if (!distanceKm || !Number.isFinite(Number(distanceKm))) {
      return NextResponse.json({ message: "distanceKm is required" }, { status: 400 });
    }

    if (paymentMethod !== "WALLET" && paymentMethod !== "CASH") {
      return NextResponse.json({ message: "paymentMethod must be WALLET or CASH" }, { status: 400 });
    }

    const scheduledDateTime = parseScheduledDateTime(String(date), String(time));
    if (!scheduledDateTime) {
      return NextResponse.json({ message: "Invalid date/time" }, { status: 400 });
    }

    const expiresAt = new Date(scheduledDateTime.getTime() - 2 * 60 * 60 * 1000);

    const resolvedPairs = await Promise.all(
      selectedPairs.map(async (p: any) => {
        const driverId = String(p?.driverId ?? "");
        const ownerId = String(p?.ownerId ?? "");
        const vehicleId = String(p?.vehicleId ?? "");
        const estFare = Number(p?.estimatedFare ?? 0);

        if (!driverId || !ownerId || !vehicleId || !Number.isFinite(estFare) || estFare <= 0) {
          return { ok: false as const, message: "Invalid selectedPairs item" };
        }

        const [driver, owner, vehicle] = await Promise.all([
          User.findById(driverId).session(session),
          User.findById(ownerId).session(session),
          Vehicle.findById(vehicleId).session(session),
        ]);

        if (!driver) return { ok: false as const, message: "Driver not found" };
        if (!owner) return { ok: false as const, message: "Owner not found" };
        if (!vehicle) return { ok: false as const, message: "Vehicle not found" };

        const isCombo = driverId === ownerId;

        return {
          ok: true as const,
          driver,
          owner,
          vehicle,
          isCombo,
          estimatedFare: estFare,
        };
      })
    );

    const bad = resolvedPairs.find((r) => !r.ok);
    if (bad && !bad.ok) {
      return NextResponse.json({ message: bad.message }, { status: 400 });
    }

    const goodPairs = resolvedPairs as Extract<(typeof resolvedPairs)[number], { ok: true }> [];

    const minFare = Math.min(...goodPairs.map((p) => p.estimatedFare));

    const first = goodPairs[0];
    const requiredLicense = String((first.vehicle as any).requiredLicense ?? "");
    const licenses: any[] = Array.isArray((first.driver as any).driverInfo?.licenses) ? (first.driver as any).driverInfo.licenses : [];
    const matchingLicense = licenses.find((l) => String(l?.licenseType) === requiredLicense && l?.isActive);

    if (!matchingLicense) {
      return NextResponse.json({ message: "Driver license mismatch for selected vehicle" }, { status: 400 });
    }

    const estimatedDistance = Number(distanceKm);
    const estimatedDuration = Math.max(0.1, Math.round((estimatedDistance / 40) * 10) / 10);

    const booking = new Booking({
      passenger: payload.id,
      bookingType: "SCHEDULED",
      status: "REQUESTED",
      passengers,
      vehicleType,
      notes: notes ?? "",
      pickup: {
        address: String(pickup?.address ?? ""),
        coordinates: {
          lat: Number(pickup?.coordinates?.lat),
          lng: Number(pickup?.coordinates?.lng),
        },
      },
      dropoff: {
        address: String(destination?.address ?? ""),
        coordinates: {
          lat: Number(destination?.coordinates?.lat),
          lng: Number(destination?.coordinates?.lng),
        },
      },
      scheduledDateTime,
      estimatedDistance,
      estimatedDuration,
      fare: {
        driverHourlyRate: Number(matchingLicense.hourlyRate ?? 0),
        vehiclePerKmRate: Number((first.vehicle as any).perKmRate ?? 0),
        licenseUsed: String(matchingLicense.licenseType),
        estimatedDuration,
        estimatedDistance,
        estimatedFare: Number(minFare),
        platformFee: 2,
        isComboTrip: Boolean(first.isCombo),
      },
      payment: {
        method: paymentMethod,
        status: "PENDING",
        amount: Number(minFare),
      },
    });

    await booking.save({ session });

    const bookingRequests = [];

    for (const p of goodPairs) {
      const br = new BookingRequest({
        booking: booking._id,
        passenger: payload.id,
        pair: {
          driver: (p.driver as any)._id,
          owner: (p.owner as any)._id,
          vehicle: (p.vehicle as any)._id,
          isCombo: p.isCombo,
        },
        driverResponse: "PENDING",
        ownerResponse: p.isCombo ? "NA" : "PENDING",
        status: "PENDING",
        estimatedFare: Number(p.estimatedFare),
        distanceKm: Number(distanceKm),
        requestedAt: new Date(),
        expiresAt,
      });

      await br.save({ session });
      bookingRequests.push(br);
    }

    await session.commitTransaction();

    return NextResponse.json({ booking, bookingRequests }, { status: 201 });
  } catch (error: any) {
    await session.abortTransaction();
    console.error("Prebooking error:", error);
    return NextResponse.json({ message: error?.message || "Internal Server Error" }, { status: 500 });
  } finally {
    session.endSession();
  }
}
