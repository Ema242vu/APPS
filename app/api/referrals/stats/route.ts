import { NextResponse } from "next/server";
import { MIN_PAYOUT_CENTS, REFERRAL_RATES } from "@/lib/referrals/config";
import { referralErrorResponse } from "@/lib/referrals/http";
import {
  getPayouts,
  getReferralStats,
  isValidCode,
  normalizeCode,
  verifyReferrerPin,
} from "@/lib/referrals/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as
      | { code?: unknown; pin?: unknown }
      | null;

    if (!body) {
      return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
    }

    const code = typeof body.code === "string" ? normalizeCode(body.code) : "";
    const pin = typeof body.pin === "string" ? body.pin.trim() : "";

    if (!isValidCode(code)) {
      return NextResponse.json({ error: "Código inválido." }, { status: 400 });
    }

    if (!/^\d{6}$/.test(pin)) {
      return NextResponse.json(
        { error: "Escribe tu PIN de 6 dígitos para ver el panel." },
        { status: 400 }
      );
    }

    const referrer = await verifyReferrerPin(code, pin);

    const [stats, payouts] = await Promise.all([
      getReferralStats(code),
      getPayouts(code),
    ]);

    return NextResponse.json(
      {
        referrer: {
          code: referrer.code,
          name: referrer.name,
          contact: referrer.contact,
          payout_method: referrer.payout_method,
          created_at: referrer.created_at,
        },
        stats,
        payouts,
        rates: REFERRAL_RATES,
        minPayoutCents: MIN_PAYOUT_CENTS,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    return referralErrorResponse(error);
  }
}
