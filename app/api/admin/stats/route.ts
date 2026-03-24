import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/db";
import { requireAdmin } from "@/lib/admin/auth";
import { User } from "@/models/User";
import { Booking } from "@/models/Booking";
import { checkRateLimit } from "@/lib/admin/rateLimit";

export async function GET(req: NextRequest) {
  try {
    const rl = checkRateLimit(req, { limit: 240, windowMs: 60_000 });
    if (!rl.ok) {
      return NextResponse.json(
        { success: false, code: "RATE_LIMITED", message: "Too many requests" },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)),
          },
        }
      );
    }

    const guard = await requireAdmin(req);
    if (!guard.ok) {
      return NextResponse.json(
        {
          success: false,
          code: guard.reason === "forbidden" ? "FORBIDDEN" : "UNAUTHORIZED",
          message: guard.reason === "forbidden" ? "Forbidden" : "Unauthorized",
        },
        { status: guard.reason === "forbidden" ? 403 : 401 }
      );
    }

    await connectToDB();

    const [usersCount, bookingsCount, activeDriversCount] = await Promise.all([
      User.countDocuments({}),
      Booking.countDocuments({}),
      User.countDocuments({ roles: "driver", "driverInfo.status": "AVAILABLE" }),
    ]);

    // Revenue definition not finalized yet.
    const revenue = 0;

    return NextResponse.json(
      {
        success: true,
        data: {
          usersCount,
          bookingsCount,
          activeDriversCount,
          revenue,
        },
      },
      {
        headers: {
          "Cache-Control": "private, max-age=10, stale-while-revalidate=30",
        },
      }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, code: "INTERNAL_ERROR", message }, { status: 500 });
  }
}
