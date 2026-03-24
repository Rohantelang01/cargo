import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    const token = cookies().get("token")?.value;
    
    if (!token) {
      return NextResponse.json({ message: "No token found" }, { status: 401 });
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      return NextResponse.json({ message: "JWT secret not configured" }, { status: 500 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    return NextResponse.json({
      user: {
        id: decoded.userId,
        name: decoded.name,
        email: decoded.email,
      }
    });

  } catch (error) {
    console.error("Token verification failed:", error);
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}