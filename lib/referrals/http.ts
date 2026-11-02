import { NextResponse } from "next/server";
import { ReferralError } from "./server";

export function referralErrorResponse(error: unknown) {
  if (error instanceof ReferralError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  if (error instanceof Error && /Faltan NEXT_PUBLIC_SUPABASE_URL|SUPABASE_SERVICE_ROLE_KEY/.test(error.message)) {
    return NextResponse.json(
      {
        error:
          "El sistema de referidos todavía no está conectado. Falta configurar Supabase en las variables de entorno.",
      },
      { status: 503 }
    );
  }

  console.error("[referrals]", error);
  return NextResponse.json(
    { error: "Ocurrió un error. Intenta de nuevo en unos minutos." },
    { status: 500 }
  );
}
