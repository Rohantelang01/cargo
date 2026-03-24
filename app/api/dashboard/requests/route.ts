import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import connectToDB from "@/lib/db";
import { User } from "@/models/User";
import { BookingRequest } from "@/models/BookingRequest";

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
    const status = searchParams.get("status");
    const role = searchParams.get("role") || user.roles[0];

    let requests = [];

    if (role === 'passenger') {
      const query: any = { passenger: user._id };
      if (status) query.status = status;

      requests = await BookingRequest.find(query)
        .populate('pair.driver', 'name phone driverInfo.rating profileImage')
        .populate('pair.owner', 'name phone ownerInfo.rating profileImage')
        .populate('pair.vehicle', 'make model year vehicleType')
        .populate('booking', 'pickup dropoff bookingType scheduledDateTime')
        .sort({ requestedAt: -1 })
        .limit(50)
        .lean() as any[];
    } else if (role === 'driver') {
      const query: any = { 
        'pair.driver': user._id,
        driverResponse: status || 'PENDING'
      };

      requests = await BookingRequest.find(query)
        .populate('passenger', 'name phone publicInfo.rating profileImage')
        .populate('pair.owner', 'name phone ownerInfo.rating profileImage')
        .populate('pair.vehicle', 'make model year vehicleType')
        .populate('booking', 'pickup dropoff bookingType scheduledDateTime passengers')
        .sort({ requestedAt: -1 })
        .limit(50)
        .lean() as any[];
    } else if (role === 'owner') {
      const query: any = { 
        'pair.owner': user._id,
        ownerResponse: status || 'PENDING'
      };

      requests = await BookingRequest.find(query)
        .populate('passenger', 'name phone publicInfo.rating profileImage')
        .populate('pair.driver', 'name phone driverInfo.rating profileImage')
        .populate('pair.vehicle', 'make model year vehicleType')
        .populate('booking', 'pickup dropoff bookingType scheduledDateTime passengers')
        .sort({ requestedAt: -1 })
        .limit(50)
        .lean() as any[];
    } else if (role === 'self-driver') {
      // Self drivers only see combo trip requests (isCombo: true)
      const query: any = { 
        'pair.driver': user._id,
        'pair.isCombo': true, // Self driver indicator
        driverResponse: status || 'PENDING'
      };

      requests = await BookingRequest.find(query)
        .populate('passenger', 'name phone publicInfo.rating profileImage')
        .populate('pair.vehicle', 'make model year vehicleType')
        .populate('booking', 'pickup dropoff bookingType scheduledDateTime passengers')
        .sort({ requestedAt: -1 })
        .limit(50)
        .lean() as any[];
    }

    return NextResponse.json({ requests, role }, { status: 200 });

  } catch (error: any) {
    console.error("Dashboard requests error:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}
