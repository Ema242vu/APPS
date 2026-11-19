import { NextResponse } from "next/server";
import {
  VIP_ACCESS_DAYS,
  VIP_COOKIE,
  getVipCookieValue,
  isValidVipCode,
} from "@/lib/vip";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  };
}

export async function POST(request: Request) {
  let code = "";

  try {
    const body = await request.json();
    code = typeof body?.code === "string" ? body.code : "";
  } catch {
    return NextResponse.json(
      { ok: false, error: "Solicitud inválida." },
      { status: 400 }
    );
  }

  if (!isValidVipCode(code)) {
    return NextResponse.json(
      { ok: false, error: "Código incorrecto. Verifica e intenta de nuevo." },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(VIP_COOKIE, getVipCookieValue(), {
    ...cookieOptions(),
    maxAge: VIP_ACCESS_DAYS * 24 * 60 * 60,
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(VIP_COOKIE, "", {
    ...cookieOptions(),
    maxAge: 0,
  });

  return response;
}
