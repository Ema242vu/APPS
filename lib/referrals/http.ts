import { NextResponse } from "next/server";
import { ReferralError } from "./server";

type SupabaseError = {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
};

function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;

  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as { message?: unknown }).message;
    return typeof message === "string" ? message : "";
  }

  return "";
}

function supabaseSetupError(error: unknown): string | null {
  const message = errorMessage(error);
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as SupabaseError).code ?? "")
      : "";

  if (
    code === "42P01" ||
    code === "PGRST205" ||
    /relation .* does not exist|Could not find the table .* in the schema cache/i.test(
      message
    )
  ) {
    return "No se encontraron las tablas de referidos. Ejecuta supabase/referrals.sql en el SQL Editor del proyecto correcto y luego recarga el esquema.";
  }

  if (
    code === "42703" ||
    code === "PGRST204" ||
    /column .* does not exist|Could not find the '.*' column/i.test(message)
  ) {
    return "Falta una columna en las tablas de referidos. Vuelve a ejecutar supabase/referrals.sql y luego recarga el esquema.";
  }

  if (code === "42501" || /permission denied/i.test(message)) {
    return "Supabase rechazó la clave de servicio. Revisa que SUPABASE_SERVICE_ROLE_KEY sea la service_role key y no la publishable key.";
  }

  if (code === "PGRST301" || /JWT|invalid api key/i.test(message)) {
    return "La clave de Supabase no es válida. Revisa NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY y SUPABASE_SERVICE_ROLE_KEY.";
  }

  if (
    code === "08006" ||
    code === "57P01" ||
    code === "53300" ||
    /fetch failed|ENOTFOUND|ECONNREFUSED|ETIMEDOUT|Invalid URL|network/i.test(
      message
    )
  ) {
    return "No se pudo conectar con Supabase. Revisa NEXT_PUBLIC_SUPABASE_URL, que el proyecto esté activo y que no esté pausado.";
  }

  if (code === "23502") {
    return "Falta un dato obligatorio en el registro. Revisa que hayas ejecutado la versión más reciente de supabase/referrals.sql.";
  }

  if (code === "23514") {
    return "Algún dato no cumple las reglas de la base de datos. Revisa el SQL y los límites configurados.";
  }

  return null;
}

export function referralErrorResponse(error: unknown) {
  if (error instanceof ReferralError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  console.error("[referrals]", error);

  const message = errorMessage(error);

  if (/Faltan NEXT_PUBLIC_SUPABASE_URL|SUPABASE_SERVICE_ROLE_KEY/.test(message)) {
    return NextResponse.json(
      {
        error:
          "El sistema de referidos todavía no está conectado. Falta configurar Supabase en las variables de entorno.",
      },
      { status: 503 }
    );
  }

  const setupError = supabaseSetupError(error);
  if (setupError) {
    return NextResponse.json({ error: setupError }, { status: 503 });
  }

  return NextResponse.json(
    { error: "Ocurrió un error. Intenta de nuevo en unos minutos." },
    { status: 500 }
  );
}
