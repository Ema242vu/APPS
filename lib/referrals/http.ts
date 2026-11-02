import { NextResponse } from "next/server";
import { ReferralError } from "./server";

export function referralErrorResponse(error: unknown) {
  if (error instanceof ReferralError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  if (
    error instanceof Error &&
    /Faltan FIREBASE_|FIREBASE_SERVICE_ACCOUNT|No se pudo inicializar Firebase/.test(
      error.message
    )
  ) {
    return NextResponse.json(
      {
        error:
          "El sistema de referidos todavía no está conectado. Falta configurar Firebase en las variables de entorno.",
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
