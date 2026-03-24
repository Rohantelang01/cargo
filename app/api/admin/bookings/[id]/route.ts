import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/db";
import { requireAdmin } from "@/lib/admin/auth";
import { Booking } from "@/models/Booking";
import { checkRateLimit } from "@/lib/admin/rateLimit";

export async function GET(
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

    const booking = await Booking.findById(id)
      .populate("passenger", "name email phone")
      .populate("driver", "name email")
      .populate("owner", "name email")
      .populate("vehicle")
      .select("-__v");

    if (!booking) {
      return NextResponse.json(
        { success: false, code: "NOT_FOUND", message: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: booking },
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

export async function PUT(
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
    const body = await req.json();

    const update: Record<string, unknown> = {};

    if (typeof body?.status === "string") update.status = body.status;
    if (typeof body?.notes === "string") update.notes = body.notes;

    const booking = await Booking.findByIdAndUpdate(id, { $set: update }, { new: true })
      .populate("passenger", "name email phone")
      .populate("driver", "name email")
      .select("status bookingType passenger driver scheduledDateTime createdAt fare notes");

    if (!booking) {
      return NextResponse.json(
        { success: false, code: "NOT_FOUND", message: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: booking },
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
