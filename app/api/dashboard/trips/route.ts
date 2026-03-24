import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import connectToDB from "@/lib/db";
import { User } from "@/models/User";
import { Booking } from "@/models/Booking";
import { Vehicle } from "@/models/Vehicle";

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
    const status = searchParams.get("status");

    let query: any = {};
    if (role === 'passenger') query.passenger = user._id;
    else if (role === 'driver') query.driver = user._id;
    else if (role === 'owner') {
      const vehicles = await Vehicle.find({ owner: user._id }).select('_id').lean();
      query.vehicle = { $in: vehicles.map((v: any) => v._id) };
    } else if (role === 'self-driver') {
      const vehicles = await Vehicle.find({ owner: user._id }).select('_id').lean();
      const vehicleIds = vehicles.map((v: any) => v._id);
      query = {
        $or: [
          { driver: user._id },
          { vehicle: { $in: vehicleIds } }
        ]
      };
    }

    if (status) {
      query.status = status;
    } else {
      query.status = { $in: ['ACCEPTED', 'ENROUTE', 'STARTED'] };
    }

    const trips = await Booking.find(query)
      .populate('passenger', 'name phone profileImage')
      .populate('driver', 'name phone profileImage driverInfo.rating')
      .populate('vehicle', 'make model year vehicleType plateNumber')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ trips, role }, { status: 200 });

  } catch (error: any) {
    console.error("Dashboard trips error:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}
