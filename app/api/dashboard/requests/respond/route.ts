import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import connectToDB from "@/lib/db";
import { User } from "@/models/User";
import { BookingRequest } from "@/models/BookingRequest";

export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const { requestId, response } = body;

    if (!requestId || !response) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const request = await BookingRequest.findById(requestId);
    if (!request) {
      return NextResponse.json({ message: "Request not found" }, { status: 404 });
    }

    const isDriver = request.pair.driver.toString() === user._id.toString();
    const isOwner = request.pair.owner && request.pair.owner.toString() === user._id.toString();

    if (!isDriver && !isOwner) {
      return NextResponse.json({ message: "Not authorized for this request" }, { status: 403 });
    }

    if (isDriver) {
      request.driverResponse = response;
      if (response === 'REJECTED') {
        request.status = 'REJECTED';
      } else if (response === 'ACCEPTED') {
        if (request.pair.isCombo || request.ownerResponse === 'ACCEPTED') {
          request.status = 'BOTH_ACCEPTED';
        }
      }
    }

    if (isOwner) {
      request.ownerResponse = response;
      if (response === 'REJECTED') {
        request.status = 'REJECTED';
      } else if (response === 'ACCEPTED' && request.driverResponse === 'ACCEPTED') {
        request.status = 'BOTH_ACCEPTED';
      }
    }

    request.respondedAt = new Date();
    await request.save();

    return NextResponse.json({ 
      message: `Request ${response.toLowerCase()}`, 
      request 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Respond to request error:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}
