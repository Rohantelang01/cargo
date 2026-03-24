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
      driverId,
      vehicleId,
      pickup,
      destination,
      passengers,
      vehicleType,
      purpose,
      notes,
      distanceKm,
      estimatedFare,
      paymentMethod,
    } = body ?? {};

    if (!driverId || !vehicleId || !pickup || !destination) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    if (!passengers || passengers <= 0) {
      return NextResponse.json({ message: "passengers is required" }, { status: 400 });
    }

    if (!vehicleType) {
      return NextResponse.json({ message: "vehicleType is required" }, { status: 400 });
    }

    if (!distanceKm || !Number.isFinite(Number(distanceKm))) {
      return NextResponse.json({ message: "distanceKm is required" }, { status: 400 });
    }

    if (!estimatedFare || !Number.isFinite(Number(estimatedFare))) {
      return NextResponse.json({ message: "estimatedFare is required" }, { status: 400 });
    }

    if (paymentMethod !== "WALLET" && paymentMethod !== "CASH") {
      return NextResponse.json({ message: "paymentMethod must be WALLET or CASH" }, { status: 400 });
    }

    const driver = await User.findById(driverId).session(session);
    if (!driver) return NextResponse.json({ message: "Driver not found" }, { status: 404 });

    const roles: string[] = Array.isArray((driver as any).roles) ? (driver as any).roles : [];
    if (!(roles.includes("driver") && roles.includes("owner"))) {
      return NextResponse.json({ message: "Instant booking requires Driver+Owner combo" }, { status: 400 });
    }

    if (String((driver as any).driverInfo?.status ?? "").toUpperCase() !== "AVAILABLE") {
      return NextResponse.json({ message: "Driver is not available" }, { status: 400 });
    }

    const vehicle = await Vehicle.findById(vehicleId).session(session);
    if (!vehicle) return NextResponse.json({ message: "Vehicle not found" }, { status: 404 });

    if ((vehicle as any).isAvailable !== true) {
      return NextResponse.json({ message: "Vehicle is not available" }, { status: 400 });
    }

    const requiredLicense = String((vehicle as any).requiredLicense ?? "");
    const licenses: any[] = Array.isArray((driver as any).driverInfo?.licenses) ? (driver as any).driverInfo.licenses : [];
    const matchingLicense = licenses.find((l) => String(l?.licenseType) === requiredLicense && l?.isActive);

    if (!matchingLicense) {
      return NextResponse.json({ message: "Driver does not have a valid license for this vehicle" }, { status: 400 });
    }

    const estimatedDistance = Number(distanceKm);
    const estimatedDuration = Math.max(0.1, Math.round((estimatedDistance / 40) * 10) / 10);

    const booking = new Booking({
      passenger: payload.id,
      driver: driverId,
      owner: driverId,
      vehicle: vehicleId,
      bookingType: "INSTANT",
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
      estimatedDistance,
      estimatedDuration,
      fare: {
        driverHourlyRate: Number(matchingLicense.hourlyRate ?? 0),
        vehiclePerKmRate: Number((vehicle as any).perKmRate ?? 0),
        licenseUsed: String(matchingLicense.licenseType),
        estimatedDuration,
        estimatedDistance,
        estimatedFare: Number(estimatedFare),
        platformFee: 2,
        isComboTrip: true,
      },
      payment: {
        method: paymentMethod,
        status: "PENDING",
        amount: Number(estimatedFare),
      },
    });

    await booking.save({ session });

    const bookingRequest = new BookingRequest({
      booking: booking._id,
      passenger: payload.id,
      pair: {
        driver: driverId,
        owner: driverId,
        vehicle: vehicleId,
        isCombo: true,
      },
      driverResponse: "PENDING",
      ownerResponse: "NA",
      status: "PENDING",
      estimatedFare: Number(estimatedFare),
      distanceKm: Number(distanceKm),
      requestedAt: new Date(),
      expiresAt: new Date(Date.now() + 60 * 1000),
    });

    await bookingRequest.save({ session });

    await session.commitTransaction();

    return NextResponse.json({ booking, bookingRequest }, { status: 201 });
  } catch (error: any) {
    await session.abortTransaction();
    console.error("Instant booking error:", error);
    return NextResponse.json({ message: error?.message || "Internal Server Error" }, { status: 500 });
  } finally {
    session.endSession();
  }
}
