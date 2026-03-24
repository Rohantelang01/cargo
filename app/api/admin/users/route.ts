import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/db";
import { User } from "@/models/User";
import { requireAdmin } from "@/lib/admin/auth";
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
    const role = (searchParams.get("role") || "").trim();
    const status = (searchParams.get("status") || "").trim();
    const sortBy = (searchParams.get("sortBy") || "createdAt").trim();
    const sortDir = (searchParams.get("sortDir") || "desc").trim().toLowerCase();

    const filter: Record<string, unknown> = {};

    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { phone: { $regex: q, $options: "i" } },
      ];
    }

    if (role) {
      filter.roles = role;
    }

    if (status === "active") {
      filter.isActive = true;
    }
    if (status === "blocked") {
      filter.isActive = false;
    }

    const skip = (page - 1) * limit;

    const sort: Record<string, 1 | -1> = (() => {
      const dir: 1 | -1 = sortDir === "asc" ? 1 : -1;
      if (sortBy === "name") return { name: dir };
      if (sortBy === "email") return { email: dir };
      if (sortBy === "createdAt") return { createdAt: dir };
      return { createdAt: -1 };
    })();

    const [total, users] = await Promise.all([
      User.countDocuments(filter),
      User.find(filter)
        .select("name email phone roles isActive createdAt")
        .sort(sort)
        .skip(skip)
        .limit(limit),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: users.map((u: any) => ({
          id: String(u._id),
          name: u.name,
          email: u.email,
          phone: u.phone,
          roles: u.roles,
          isActive: u.isActive !== false,
          createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : undefined,
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
