import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { User } from "@/models/User";
import connectToDB from "@/lib/db"; // Yahan DB connection import kiya hai

export async function GET(req: NextRequest) {
  try {
    // FIX 1: Next.js 15 me cookies() ke aage await lagana zaroori hai
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // FIX 2: Database query karne se pehle DB connect karna zaroori hai (Mongoose Timeout roke ga)
    await connectToDB();

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Me Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}