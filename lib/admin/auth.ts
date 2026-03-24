import { NextRequest } from "next/server";
import { jwtVerify } from "jose";

type DecodedToken = {
  id: string;
  roles: string[];
};

export const decodeTokenFromRequest = async (
  req: NextRequest
): Promise<DecodedToken | null> => {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;

  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) return null;

  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const id = (payload as { id?: unknown })?.id;
    const roles = (payload as { roles?: unknown })?.roles;

    if (typeof id !== "string") return null;
    const roleList = Array.isArray(roles) ? roles : [];

    return { id, roles: roleList };
  } catch {
    return null;
  }
};

export const isAdminRoles = (roles: string[] | undefined | null) => {
  return Array.isArray(roles) && roles.includes("admin");
};

export const requireAdmin = async (req: NextRequest) => {
  const decoded = await decodeTokenFromRequest(req);
  if (!decoded) {
    return { ok: false as const, reason: "unauthorized" as const };
  }

  if (!isAdminRoles(decoded.roles)) {
    return { ok: false as const, reason: "forbidden" as const };
  }

  return { ok: true as const, decoded };
};
