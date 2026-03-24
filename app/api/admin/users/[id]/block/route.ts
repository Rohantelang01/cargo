import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/db";
import { User } from "@/models/User";
import { requireAdmin } from "@/lib/admin/auth";
import { checkRateLimit } from "@/lib/admin/rateLimit";

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

    const body = await req.json().catch(() => ({}));
    const desired = body?.isActive;

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json(
        { success: false, code: "NOT_FOUND", message: "User not found" },
        { status: 404 }
      );
    }

    const nextIsActive =
      typeof desired === "boolean" ? desired : !(user as any).isActive;

    (user as any).isActive = nextIsActive;
    await user.save();

    return NextResponse.json(
      {
        success: true,
        data: {
          id: String((user as any)._id),
          isActive: (user as any).isActive !== false,
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
