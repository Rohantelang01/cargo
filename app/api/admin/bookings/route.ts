import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/db";
import { requireAdmin } from "@/lib/admin/auth";
import { Booking } from "@/models/Booking";
import mongoose from "mongoose";
import { checkRateLimit } from "@/lib/admin/rateLimit";

function toInt(value: string | null, fallback: number) {
  const n = value ? Number.parseInt(value, 10) : Number.NaN;
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export async function GET(req: NextRequest) {
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

    const { searchParams } = new URL(req.url);
    const page = toInt(searchParams.get("page"), 1);
    const limit = toInt(searchParams.get("limit"), 10);
    const q = (searchParams.get("q") || "").trim();
    const status = (searchParams.get("status") || "").trim();
    const from = (searchParams.get("from") || "").trim();
    const to = (searchParams.get("to") || "").trim();
    const sortBy = (searchParams.get("sortBy") || "createdAt").trim();
    const sortDir = (searchParams.get("sortDir") || "desc").trim().toLowerCase();

    const filter: Record<string, unknown> = {};

    if (status) {
      // accept both uppercase/lowercase filtering while DB is inconsistent
      filter.status = { $in: [status, status.toUpperCase(), status.toLowerCase()] };
    }

    if (from || to) {
      const createdAt: Record<string, Date> = {};
      if (from) createdAt.$gte = new Date(from);
      if (to) createdAt.$lte = new Date(to);
      filter.createdAt = createdAt;
    }

    if (q) {
      if (mongoose.isValidObjectId(q)) {
        filter._id = q;
      } else {
        // Search by passenger email/name by join-like filter: populate and post-filter.
        // We'll do a best-effort regex match on pickup/dropoff address as well.
        filter.$or = [
          { "pickup.address": { $regex: q, $options: "i" } },
          { "dropoff.address": { $regex: q, $options: "i" } },
        ];
      }
    }

    const skip = (page - 1) * limit;

    const sort: Record<string, 1 | -1> = (() => {
      const dir: 1 | -1 = sortDir === "asc" ? 1 : -1;
      if (sortBy === "createdAt") return { createdAt: dir };
      if (sortBy === "status") return { status: dir, createdAt: -1 };
      return { createdAt: -1 };
    })();

    const [total, bookings] = await Promise.all([
      Booking.countDocuments(filter),
      Booking.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate("passenger", "name email phone")
        .populate("driver", "name email")
        .select("status bookingType passenger driver scheduledDateTime createdAt fare"),
    ]);

    // If q is not objectId and not status, also match passenger email/name
    const filteredBookings = q && !mongoose.isValidObjectId(q)
      ? bookings.filter((b: any) => {
          const p = b.passenger;
          const pName = typeof p?.name === "string" ? p.name : "";
          const pEmail = typeof p?.email === "string" ? p.email : "";
          return (
            pName.toLowerCase().includes(q.toLowerCase()) ||
            pEmail.toLowerCase().includes(q.toLowerCase())
          );
        })
      : bookings;

    return NextResponse.json(
      {
        success: true,
        data: filteredBookings.map((b: any) => ({
          id: String(b._id),
          status: b.status,
          bookingType: b.bookingType,
          passenger: b.passenger
            ? {
                id: String(b.passenger._id),
                name: b.passenger.name,
                email: b.passenger.email,
                phone: b.passenger.phone,
              }
            : undefined,
          driver: b.driver
            ? {
                id: String(b.driver._id),
                name: b.driver.name,
                email: b.driver.email,
              }
            : undefined,
          scheduledDateTime: b.scheduledDateTime
            ? new Date(b.scheduledDateTime).toISOString()
            : undefined,
          createdAt: b.createdAt ? new Date(b.createdAt).toISOString() : undefined,
          fare: b.fare
            ? {
                estimatedFare: b.fare.estimatedFare,
                finalFare: b.fare.finalFare,
                platformFee: b.fare.platformFee,
              }
            : undefined,
        })),
        meta: {
          page,
          limit,
          total,
          totalPages: Math.max(1, Math.ceil(total / limit)),
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
