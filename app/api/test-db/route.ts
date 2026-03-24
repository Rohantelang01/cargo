import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/db";
import { User } from "@/models/User";
import { Vehicle } from "@/models/Vehicle";

export async function GET() {
  try {
    await connectToDB();
    
    // Count users by role
    const totalUsers = await User.countDocuments();
    const drivers = await User.countDocuments({ roles: "driver" });
    const owners = await User.countDocuments({ roles: "owner" });
    const driverOwners = await User.countDocuments({ roles: { $all: ["driver", "owner"] } });
    const availableDrivers = await User.countDocuments({ 
      roles: { $all: ["driver", "owner"] },
      "driverInfo.status": "AVAILABLE"
    });
    
    // Count vehicles
    const totalVehicles = await Vehicle.countDocuments();
    const availableVehicles = await Vehicle.countDocuments({ 
      status: "AVAILABLE",
      selfDriven: true 
    });
    
    // Get sample data
    const sampleUsers = await User.find()
      .select("name roles driverInfo.status")
      .limit(3)
      .lean();
    
    const sampleVehicles = await Vehicle.find()
      .select("make model vehicleType selfDriven status")
      .limit(3)
      .lean();
    
    return NextResponse.json({
      database: "connected",
      counts: {
        totalUsers,
        drivers,
        owners,
        driverOwners,
        availableDrivers,
        totalVehicles,
        availableVehicles
      },
      sample: {
        users: sampleUsers,
        vehicles: sampleVehicles
      }
    });
    
  } catch (error: any) {
    console.error("Database test error:", error);
    return NextResponse.json({ 
      error: error.message,
      database: "not connected"
    }, { status: 500 });
  }
}
