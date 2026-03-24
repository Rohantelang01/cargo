import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import connectToDB from "@/lib/db";
import { User } from "@/models/User";

export async function PATCH(req: NextRequest) {
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

    const body = await req.json();
    const { status } = body; // 'ONLINE' | 'OFFLINE'

    if (!status || !['ONLINE', 'OFFLINE'].includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (!user.roles.includes('driver')) {
      return NextResponse.json({ message: "User is not a driver" }, { status: 403 });
    }

    // Update user status and driverInfo status
    user.status = status;
    if (user.driverInfo) {
      user.driverInfo.status = status === 'ONLINE' ? 'AVAILABLE' : 'OFFLINE';
    }
    
    await user.save();

    return NextResponse.json({ 
      message: `Status updated to ${status}`,
      status: user.status,
      driverStatus: user.driverInfo?.status
    }, { status: 200 });

  } catch (error: any) {
    console.error("Toggle status error:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}
