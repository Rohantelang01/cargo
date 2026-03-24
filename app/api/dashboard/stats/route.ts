import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import connectToDB from "@/lib/db";
import { User } from "@/models/User";
import { Booking } from "@/models/Booking";
import { Wallet } from "@/models/Wallet";
import { BookingRequest } from "@/models/BookingRequest";
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

    let stats = {};

    if (role === 'passenger') {
      const totalTrips = await Booking.countDocuments({ passenger: user._id, status: 'COMPLETED' });
      const activeBookings = await Booking.countDocuments({ passenger: user._id, status: { $in: ['ACCEPTED', 'ENROUTE', 'STARTED'] } });
      const upcomingTrips = await Booking.countDocuments({ passenger: user._id, bookingType: 'SCHEDULED', status: 'ACCEPTED' });
      
      const wallet = await Wallet.findOne({ user: user._id });
      const totalSpent = wallet?.transactions
        ?.filter((t: any) => t.type === 'DEBIT' && t.status === 'COMPLETED')
        .reduce((sum: number, t: any) => sum + t.amount, 0) || 0;

      stats = {
        totalTrips,
        totalSpent,
        activeBookings,
        upcomingTrips
      };
    } else if (role === 'driver') {
      const totalTrips = await Booking.countDocuments({ driver: user._id, status: 'COMPLETED' });
      
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayBookings = await Booking.find({ 
        driver: user._id, 
        status: 'COMPLETED',
        'tripData.endTime': { $gte: todayStart }
      }).lean();
      const todayEarnings = todayBookings.reduce((sum: number, b: any) => sum + (b.fare?.driverPayout || 0), 0);

      const wallet = await Wallet.findOne({ user: user._id });
      const totalEarnings = wallet?.generatedBalance || 0;

      const incomingRequests = await BookingRequest.countDocuments({
        'pair.driver': user._id,
        driverResponse: 'PENDING',
        status: 'PENDING'
      });

      stats = {
        totalTrips,
        todayEarnings,
        totalEarnings,
        incomingRequests,
        rating: user.driverInfo?.rating || 0,
        status: user.driverInfo?.status || 'OFFLINE'
      };
    } else if (role === 'owner') {
      const vehicles = await Vehicle.find({ owner: user._id }).select('_id').lean();
      const vehicleIds = vehicles.map((v: any) => v._id);

      const totalTrips = await Booking.countDocuments({ vehicle: { $in: vehicleIds }, status: 'COMPLETED' });
      const activeBookings = await Booking.countDocuments({ vehicle: { $in: vehicleIds }, status: { $in: ['ACCEPTED', 'ENROUTE', 'STARTED'] } });

      const wallet = await Wallet.findOne({ user: user._id });
      const totalEarnings = wallet?.generatedBalance || 0;

      const incomingRequests = await BookingRequest.countDocuments({
        'pair.owner': user._id,
        ownerResponse: 'PENDING',
        status: 'PENDING'
      });

      stats = {
        totalTrips,
        totalEarnings,
        activeBookings,
        incomingRequests,
        vehicleCount: vehicles.length,
        rating: user.ownerInfo?.rating || 0
      };
    } else if (role === 'self-driver' || role === 'self-driver-owner') {
      const vehicles = await Vehicle.find({ owner: user._id }).select('_id').lean();
      const vehicleIds = vehicles.map((v: any) => v._id);

      const totalTrips = await Booking.countDocuments({ 
        $or: [
          { driver: user._id }, 
          { vehicle: { $in: vehicleIds } }
        ], 
        status: 'COMPLETED' 
      });
      const activeBookings = await Booking.countDocuments({ 
        $or: [
          { driver: user._id }, 
          { vehicle: { $in: vehicleIds } }
        ], 
        status: { $in: ['ACCEPTED', 'ENROUTE', 'STARTED'] } 
      });
      
      const wallet = await Wallet.findOne({ user: user._id });
      const totalEarnings = wallet?.generatedBalance || 0;

      const incomingRequests = await BookingRequest.countDocuments({
        $or: [
          { 'pair.driver': user._id },
          { 'pair.owner': user._id }
        ],
        status: 'PENDING'
      });

      stats = {
        totalTrips,
        totalEarnings,
        activeBookings,
        incomingRequests,
        rating: Math.max(user.driverInfo?.rating || 0, user.ownerInfo?.rating || 0),
        status: user.driverInfo?.status || 'OFFLINE'
      };
    }

    return NextResponse.json({ stats, role }, { status: 200 });

  } catch (error: any) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}
