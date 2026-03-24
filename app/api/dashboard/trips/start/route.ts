import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import connectToDB from "@/lib/db";
import { User } from "@/models/User";
import { Booking } from "@/models/Booking";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || typeof decoded === 'string') {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    await connectToDB();

    const { bookingId } = await req.json();
    if (!bookingId) {
      return NextResponse.json({ message: "Booking ID is required" }, { status: 400 });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return NextResponse.json({ message: "Booking not found" }, { status: 404 });
    }

    if (booking.driver.toString() !== decoded.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    if (booking.status !== 'ENROUTE') {
      return NextResponse.json({ message: "Booking must be in ENROUTE status to start trip" }, { status: 400 });
    }

    booking.status = 'STARTED';
    if (!booking.tripData) booking.tripData = {};
    booking.tripData.startTime = new Date();
    
    await booking.save();

    return NextResponse.json({ message: "Trip started", booking }, { status: 200 });

  } catch (error: any) {
    console.error("Start trip error:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}
