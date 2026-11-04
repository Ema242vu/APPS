import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PATHS = ["/admin/referidos", "/admin/referidos/"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Excluir login de la protección
  if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) {
    return NextResponse.next();
  }

  // Verificar rutas protegidas
  if (!PROTECTED_PATHS.some((path) => pathname === path || pathname.startsWith(path + "/"))) {
    return NextResponse.next();
  }

  const token = request.headers.get("x-admin-token");
  const cookieToken = request.cookies.get("__admin_valid")?.value;

  if (isTokenValid(token, cookieToken)) {
    return NextResponse.next();
  }

  // Redirigir al login
  return NextResponse.rewrite(new URL("/admin/login", request.url));
}

function isTokenValid(token: string | null, cookieToken?: string): boolean {
  if (!token || !cookieToken) return false;
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return false;
    const payload = JSON.parse(Buffer.from(parts[1], "base64").toString());
    return payload.exp > Date.now() && payload.sessionid === cookieToken;
  } catch {
    return false;
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};