import { NextResponse } from "next/server";

const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY || "cambia-esto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const providedSecret = typeof body?.secret === "string" ? body.secret : "";

    if (providedSecret !== ADMIN_SECRET) {
      return NextResponse.json({ error: "Secreto incorrecto" }, { status: 401 });
    }

    const sessionId = Math.random().toString(36).substring(7);
    const payload = {
      exp: Date.now() + 10 * 60 * 1000,
      sessionid: sessionId,
      iat: Date.now(),
    };
    const header = Buffer.from(
      JSON.stringify({ alg: "HS256", typ: "JWT" })
    ).toString("base64url");
    const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
    const payloadB64Safe = payloadB64.replace(/=/g, "");
    const token = `${header}.${payloadB64Safe}`;

    const response = NextResponse.json({ token });
    response.cookies.set("__admin_valid", sessionId, {
      maxAge: 600,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}