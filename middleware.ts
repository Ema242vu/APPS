import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_TOKEN_COOKIE,
  getAdminSecret,
  verifyAdminToken,
} from "@/lib/referrals/admin-token";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // El login siempre es accesible.
  if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) {
    return NextResponse.next();
  }

  if (!pathname.startsWith("/admin/referidos")) {
    return NextResponse.next();
  }

  const token =
    request.cookies.get(ADMIN_TOKEN_COOKIE)?.value ??
    request.headers.get("x-admin-token");
  const sessionId = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

  if (token && sessionId) {
    try {
      const secret = getAdminSecret();
      const payload = await verifyAdminToken(token, secret);

      if (payload && payload.sid === sessionId) {
        return NextResponse.next();
      }
    } catch {
      // Si falta la clave, cae al login.
    }
  }

  const loginUrl = new URL("/admin/login", request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*"],
};
