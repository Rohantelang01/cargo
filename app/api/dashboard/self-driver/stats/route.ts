import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import connectToDB from "@/lib/db";
import { User } from "@/models/User";
import { Booking } from "@/models/Booking";
import { Wallet } from "@/models/Wallet";
import { Vehicle } from "@/models/Vehicle";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    await connectToDB();

    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Get self-driven vehicles
    const vehicles = await Vehicle.find({ 
      owner: user._id, 
      selfDriven: true 
    });
    
    const vehicleIds = vehicles.map(v => v._id);

    // Get stats
    const totalTrips = await Booking.countDocuments({ 
      driver: user._id, 
      status: 'COMPLETED' 
    });
    
    const activeBookings = await Booking.countDocuments({ 
      driver: user._id, 
      status: { $in: ['ACCEPTED', 'ENROUTE', 'STARTED'] } 
    });

    // Today's earnings
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayBookings = await Booking.find({ 
      driver: user._id, 
      status: 'COMPLETED',
      'tripData.endTime': { $gte: todayStart }
    }).lean() as any[];
    
    const todayEarnings = todayBookings.reduce((sum, b) => {
      return sum + (b.fare?.driverPayout || 0) + (b.fare?.ownerPayout || 0);
    }, 0);

    // Total earnings
    const wallet = await Wallet.findOne({ user: user._id });
    const totalEarnings = wallet?.generatedBalance || 0;

    // Incoming requests
    const { BookingRequest } = await import("@/models/BookingRequest");
    const incomingRequests = await BookingRequest.countDocuments({
      'pair.driver': user._id,
      'pair.isCombo': true, // Self driver = combo trip
      driverResponse: 'PENDING',
      status: 'PENDING'
    });

    // Vehicle status
    const vehicleStatus = vehicles[0]?.status || 'OFFLINE';

    // Get active trip if any
    const activeTrip = await Booking.findOne({
      driver: user._id,
      status: { $in: ['ACCEPTED', 'ENROUTE', 'STARTED'] }
    })
    .populate('passenger', 'name phone publicInfo.rating profileImage')
    .populate('booking', 'pickup dropoff bookingType scheduledDateTime passengers')
    .lean();

    const stats = {
      totalTrips,
      todayEarnings,
      totalEarnings,
      activeBookings,
      incomingRequests,
      rating: user.driverInfo?.rating || 0,
      vehicleCount: vehicles.length,
      vehicleStatus,
      driverStatus: user.driverInfo?.status || 'OFFLINE',
      activeTrip,
      vehicles: vehicles.map(v => ({
        _id: v._id,
        make: v.make,
        model: v.model,
        year: v.year,
        vehicleType: v.vehicleType,
        plateNumber: v.plateNumber,
        status: v.status,
        lastMaintenance: v.lastMaintenance,
        nextMaintenance: v.nextMaintenance
      }))
    };

    return NextResponse.json({ stats }, { status: 200 });

  } catch (error: any) {
    console.error("Self driver stats error:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}
