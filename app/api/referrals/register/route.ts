import { NextResponse } from "next/server";
import { referralErrorResponse } from "@/lib/referrals/http";
import { hashIp, registerReferrer } from "@/lib/referrals/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as
      | {
          name?: unknown;
          contact?: unknown;
          payoutMethod?: unknown;
          pin?: unknown;
        }
      | null;

    if (!body) {
      return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
    }

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const contact = typeof body.contact === "string" ? body.contact.trim() : "";
    const payoutMethod =
      typeof body.payoutMethod === "string" ? body.payoutMethod.trim() : "";
    const pin = typeof body.pin === "string" ? body.pin.trim() : "";

    if (name.length < 2 || name.length > 80) {
      return NextResponse.json(
        { error: "Escribe un nombre de entre 2 y 80 caracteres." },
        { status: 400 }
      );
    }

    if (contact.length < 3 || contact.length > 120) {
      return NextResponse.json(
        { error: "Escribe un contacto válido (correo, Telegram, PayPal, etc.)." },
        { status: 400 }
      );
    }

    if (payoutMethod.length < 2 || payoutMethod.length > 40) {
      return NextResponse.json(
        { error: "Indica cómo quieres recibir tu pago." },
        { status: 400 }
      );
    }

    if (!/^\d{6}$/.test(pin)) {
      return NextResponse.json(
        { error: "El PIN debe tener exactamente 6 dígitos." },
        { status: 400 }
      );
    }

    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip =
      forwardedFor?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const referrer = await registerReferrer({
      name,
      contact,
      payoutMethod,
      pin,
      ipHash: hashIp(ip),
    });

    return NextResponse.json({
      code: referrer.code,
      name: referrer.name,
    });
  } catch (error) {
    return referralErrorResponse(error);
  }
}
