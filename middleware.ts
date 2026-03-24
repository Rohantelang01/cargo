import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/profile") || pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      const JWT_SECRET = process.env.JWT_SECRET;
      if (!JWT_SECRET) {
        return NextResponse.redirect(new URL("/login", req.url));
      }

      const secret = new TextEncoder().encode(JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);

      if (pathname.startsWith("/dashboard/admin")) {
        const roles = (payload as { roles?: unknown })?.roles;
        const roleList = Array.isArray(roles) ? roles : [];
        if (!roleList.includes("admin")) {
          return NextResponse.redirect(new URL("/dashboard/passenger", req.url));
        }
      }
      
      return NextResponse.next();
    } catch (error) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  if (pathname.startsWith("/admin-panel")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      const JWT_SECRET = process.env.JWT_SECRET;
      if (!JWT_SECRET) {
        return NextResponse.redirect(new URL("/login", req.url));
      }

      const secret = new TextEncoder().encode(JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);

      const roles = (payload as { roles?: unknown })?.roles;
      const roleList = Array.isArray(roles) ? roles : [];
      if (!roleList.includes("admin")) {
        return NextResponse.redirect(new URL("/dashboard/passenger", req.url));
      }
      
      return NextResponse.next();
    } catch (error) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile", "/profile/:path*", "/dashboard", "/dashboard/:path*", "/admin-panel", "/admin-panel/:path*"],
};