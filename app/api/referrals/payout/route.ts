import { NextResponse } from "next/server";
import { referralErrorResponse } from "@/lib/referrals/http";
import {
  createPayout,
  isValidCode,
  normalizeCode,
} from "@/lib/referrals/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as
      | { code?: unknown; pin?: unknown; method?: unknown; contact?: unknown }
      | null;

    if (!body) {
      return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
    }

    const code = typeof body.code === "string" ? normalizeCode(body.code) : "";
    const pin = typeof body.pin === "string" ? body.pin.trim() : "";
    const method = typeof body.method === "string" ? body.method.trim() : "";
    const contact = typeof body.contact === "string" ? body.contact.trim() : "";

    if (!isValidCode(code)) {
      return NextResponse.json({ error: "Código inválido." }, { status: 400 });
    }

    if (!/^\d{6}$/.test(pin)) {
      return NextResponse.json(
        { error: "Escribe tu PIN de 6 dígitos." },
        { status: 400 }
      );
    }

    if (method.length < 2 || method.length > 40) {
      return NextResponse.json(
        { error: "Indica un método de pago válido." },
        { status: 400 }
      );
    }

    if (contact.length < 3 || contact.length > 120) {
      return NextResponse.json(
        { error: "Escribe un contacto válido para enviarte el pago." },
        { status: 400 }
      );
    }

    const payout = await createPayout({ code, pin, method, contact });

    return NextResponse.json({
      ok: true,
      payout,
      message: "Solicitud enviada. Revisaremos tu pago y te contactaremos.",
    });
  } catch (error) {
    return referralErrorResponse(error);
  }
}
