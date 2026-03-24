import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/db";
import { requireAdmin } from "@/lib/admin/auth";
import { Booking } from "@/models/Booking";
import { checkRateLimit } from "@/lib/admin/rateLimit";

function normalizeStatus(status: unknown) {
  if (typeof status !== "string") return "";
  return status;
}

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const rl = checkRateLimit(req, { limit: 120, windowMs: 60_000 });
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
    const { id } = await ctx.params;

    const booking = await Booking.findById(id);
    if (!booking) {
      return NextResponse.json(
        { success: false, code: "NOT_FOUND", message: "Booking not found" },
        { status: 404 }
      );
    }

    const current = normalizeStatus((booking as any).status);
    if (!["REQUESTED", "requested"].includes(current)) {
      return NextResponse.json(
        {
          success: false,
          code: "INVALID_STATE",
          message: `Booking cannot be approved from status ${current}`,
        },
        { status: 400 }
      );
    }

    (booking as any).status = "ACCEPTED";
    await booking.save();

    return NextResponse.json(
      {
        success: true,
        data: {
          id: String((booking as any)._id),
          status: (booking as any).status,
        },
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, code: "INTERNAL_ERROR", message }, { status: 500 });
  }
}
