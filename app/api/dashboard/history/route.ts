import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import connectToDB from "@/lib/db";
import { User } from "@/models/User";
import { Booking } from "@/models/Booking";

export async function GET(req: NextRequest) {
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

    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role") || user.roles[0];
    const limit = parseInt(searchParams.get("limit") || "10");

    let query: any = { status: 'COMPLETED' };
    if (role === 'passenger') query.passenger = user._id;
    else if (role === 'driver') query.driver = user._id;
    else if (role === 'owner') query.owner = user._id;
    else if (role === 'self-driver') {
      query.$or = [{ driver: user._id }, { owner: user._id }];
    }

    const history = await Booking.find(query)
      .populate('passenger', 'name profileImage')
      .populate('driver', 'name profileImage')
      .populate('vehicle', 'make model plateNumber vehicleType')
      .sort({ 'tripData.endTime': -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ history, role }, { status: 200 });

  } catch (error: any) {
    console.error("Dashboard history error:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}
