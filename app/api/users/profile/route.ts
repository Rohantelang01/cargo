
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { User } from "@/models/User";
import connectToDB from "@/lib/db";

export async function PUT(req: NextRequest) {
  try {
    await connectToDB();
    const token = cookies().get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = decoded.id;
    const body = await req.json();

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Update user fields
    if (body.name) {
      user.name = body.name;
    }
    if (body.phone) {
      user.phone = body.phone;
    }
    if (body.roles) {
      // Add new roles, don't overwrite existing ones
      body.roles.forEach((role: string) => {
        if (!user.roles.includes(role)) {
          user.roles.push(role);
        }
      });
    }
    if (body.driverInfo) {
      user.driverInfo = { ...user.driverInfo, ...body.driverInfo };
    }

    const updatedUser = await user.save();

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        roles: updatedUser.roles,
        driverInfo: updatedUser.driverInfo,
      },
    });
  } catch (error) {
    console.error("Profile Update Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
