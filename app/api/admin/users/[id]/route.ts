import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/db";
import { User } from "@/models/User";
import { requireAdmin } from "@/lib/admin/auth";
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

    const user = await User.findById(id).select("-password");
    if (!user) {
      return NextResponse.json(
        { success: false, code: "NOT_FOUND", message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          id: String((user as any)._id),
          name: (user as any).name,
          email: (user as any).email,
          phone: (user as any).phone,
          roles: (user as any).roles,
          isActive: (user as any).isActive !== false,
          profileImage: (user as any).profileImage,
          createdAt: (user as any).createdAt
            ? new Date((user as any).createdAt).toISOString()
            : undefined,
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

    if (typeof body?.name === "string") update.name = body.name;
    if (typeof body?.phone === "string") update.phone = body.phone;
    if (Array.isArray(body?.roles)) update.roles = body.roles;
    if (typeof body?.isActive === "boolean") update.isActive = body.isActive;

    const user = await User.findByIdAndUpdate(id, { $set: update }, { new: true }).select(
      "-password"
    );

    if (!user) {
      return NextResponse.json(
        { success: false, code: "NOT_FOUND", message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          id: String((user as any)._id),
          name: (user as any).name,
          email: (user as any).email,
          phone: (user as any).phone,
          roles: (user as any).roles,
          isActive: (user as any).isActive !== false,
          profileImage: (user as any).profileImage,
          createdAt: (user as any).createdAt
            ? new Date((user as any).createdAt).toISOString()
            : undefined,
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
