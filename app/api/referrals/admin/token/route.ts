import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_TOKEN_COOKIE,
  ADMIN_TOKEN_TTL_MS,
  getAdminSecret,
  signAdminToken,
} from "@/lib/referrals/admin-token";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const providedSecret = typeof body?.secret === "string" ? body.secret : "";

    let secret: string;
    try {
      secret = getAdminSecret();
    } catch {
      return NextResponse.json(
        { error: "Falta configurar ADMIN_SECRET_KEY en las variables de entorno." },
        { status: 503 }
      );
    }

    if (!providedSecret || providedSecret !== secret) {
      return NextResponse.json({ error: "Contraseña incorrecta." }, { status: 401 });
    }

    const sessionId = crypto.randomUUID();
    const token = await signAdminToken(
      { exp: Date.now() + ADMIN_TOKEN_TTL_MS, sid: sessionId },
      secret
    );

    const response = NextResponse.json({ ok: true, token });

    const cookieOptions = {
      httpOnly: true,
      secure: request.url.startsWith("https://"),
      sameSite: "lax" as const,
      path: "/",
      maxAge: Math.floor(ADMIN_TOKEN_TTL_MS / 1000),
    };

    response.cookies.set(ADMIN_TOKEN_COOKIE, token, cookieOptions);
    response.cookies.set(ADMIN_SESSION_COOKIE, sessionId, cookieOptions);

    return response;
  } catch {
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  }
}
