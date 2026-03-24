import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    // FIX: Next.js 15 me cookies() ke aage await lagana zaroori hai
    const cookieStore = await cookies();
    
    // Token ko khali ("") kar rahe hain aur maxAge 0 set kar rahe hain taaki cookie delete ho jaye
    cookieStore.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 0, 
      path: "/",
    });

    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}