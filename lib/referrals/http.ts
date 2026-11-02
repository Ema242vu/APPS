import { NextResponse } from "next/server";
import { ReferralError } from "./server";

type FirebaseError = Error & { code?: number | string };

function firebaseSetupError(error: Error): string | null {
  const code = (error as FirebaseError).code;
  const message = error.message;

  if (
    code === 5 ||
    code === "NOT_FOUND" ||
    /database .* does not exist|The database \(default\) does not exist/i.test(
      message
    )
  ) {
    return "Firestore no está creado en el proyecto de Firebase. Entra a Firebase Console → Firestore Database y crea la base de datos en modo nativo.";
  }

  if (
    code === 7 ||
    code === "PERMISSION_DENIED" ||
    /Missing or insufficient permissions|PERMISSION_DENIED/i.test(message)
  ) {
    return "La cuenta de servicio no tiene permisos para usar Firestore. Verifica que sea del mismo proyecto y que Firestore esté habilitado.";
  }

  if (
    code === 16 ||
    code === "UNAUTHENTICATED" ||
    /invalid authentication credentials|UNAUTHENTICATED/i.test(message)
  ) {
    return "No se pudo autenticar con Firebase. Revisa FIREBASE_SERVICE_ACCOUNT o las variables FIREBASE_CLIENT_EMAIL y FIREBASE_PRIVATE_KEY.";
  }

  if (
    code === 9 ||
    code === "FAILED_PRECONDITION" ||
    /Cloud Firestore API has not been used|Firestore API is not available/i.test(
      message
    )
  ) {
    return "La API de Firestore no está habilitada. Actívala en Google Cloud Console para el proyecto de Firebase.";
  }

  if (
    code === 3 ||
    code === "INVALID_ARGUMENT" ||
    /project .* does not exist|Invalid project/i.test(message)
  ) {
    return "El proyecto de Firebase no existe o el ID es incorrecto. Revisa FIREBASE_PROJECT_ID y la cuenta de servicio.";
  }

  return null;
}

export function referralErrorResponse(error: unknown) {
  if (error instanceof ReferralError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  console.error("[referrals]", error);

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

  if (error instanceof Error) {
    const setupError = firebaseSetupError(error);
    if (setupError) {
      return NextResponse.json({ error: setupError }, { status: 503 });
    }
  }

  return NextResponse.json(
    { error: "Ocurrió un error. Intenta de nuevo en unos minutos." },
    { status: 500 }
  );
}
