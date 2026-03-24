import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, type JWTPayload } from "jose";
import connectToDB from "@/lib/db";
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

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    await connectToDB();

    const token = getToken(req);
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const payload = await verifyJwt(token);
    if (!payload?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = await ctx.params;

    const { bookingRequestId } = await req.json();
    if (!bookingRequestId) {
      return NextResponse.json({ message: "bookingRequestId is required" }, { status: 400 });
    }

    const booking = await Booking.findById(id);
    if (!booking) return NextResponse.json({ message: "Booking not found" }, { status: 404 });

    if (String((booking as any).passenger) !== String(payload.id)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const br = await BookingRequest.findById(bookingRequestId);
    if (!br) return NextResponse.json({ message: "BookingRequest not found" }, { status: 404 });

    if (String((br as any).booking) !== String((booking as any)._id)) {
      return NextResponse.json({ message: "BookingRequest does not belong to booking" }, { status: 400 });
    }

    if (String((br as any).status) !== "BOTH_ACCEPTED") {
      return NextResponse.json({ message: "BookingRequest is not ready to confirm" }, { status: 400 });
    }

    (br as any).status = "CONFIRMED";
    (br as any).confirmedAt = new Date();
    await br.save();

    (booking as any).confirmedRequest = (br as any)._id;
    (booking as any).driver = (br as any).pair.driver;
    (booking as any).owner = (br as any).pair.owner;
    (booking as any).vehicle = (br as any).pair.vehicle;
    (booking as any).status = "ACCEPTED";

    await booking.save();

    await BookingRequest.updateMany(
      { booking: (booking as any)._id, _id: { $ne: (br as any)._id } },
      { $set: { status: "RELEASED" } }
    );

    return NextResponse.json({ booking }, { status: 200 });
  } catch (error: any) {
    console.error("Confirm pair error:", error);
    return NextResponse.json({ message: error?.message || "Internal Server Error" }, { status: 500 });
  }
}
