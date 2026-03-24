
import { NextResponse } from "next/server";
import connectToDB from "@/lib/db";
import { User } from "@/models/User";

export async function GET() {
  try {
    await connectToDB();
    const users = await User.find({});
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error("[GET_USERS_FAILED]:", error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { 
        message: "FAILURE: Could not fetch users.",
        error: errorMessage
      }, 
      { status: 500 }
    );
  }
}
