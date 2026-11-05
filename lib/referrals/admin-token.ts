/**
 * Helpers de sesión de admin, compatibles con Edge (middleware) y Node.
 * El token va firmado con HMAC-SHA256 para que nadie pueda falsificarlo.
 */

export const ADMIN_TOKEN_COOKIE = "__admin_token";
export const ADMIN_SESSION_COOKIE = "__admin_valid";
export const ADMIN_TOKEN_TTL_MS = 10 * 60 * 1000;

export type AdminTokenPayload = {
  exp: number;
  sid: string;
};

export function getAdminSecret(): string {
  // Acceso dinámico para que el valor no quede incrustado en el bundle.
  const env = process.env as Record<string, string | undefined>;
  const secret = env.ADMIN_SECRET_KEY || env.NEXT_PUBLIC_ADMIN_SECRET_KEY;

  if (!secret) {
    throw new Error(
      "Faltan ADMIN_SECRET_KEY o NEXT_PUBLIC_ADMIN_SECRET_KEY en las variables de entorno."
    );
  }

  return secret;
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function fromBase64Url(value: string): string {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

async function hmac(secret: string, data: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return toBase64Url(new Uint8Array(signature));
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;

  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return diff === 0;
}

export async function signAdminToken(
  payload: AdminTokenPayload,
  secret: string
): Promise<string> {
  const body = toBase64Url(
    new TextEncoder().encode(JSON.stringify(payload))
  );
  const signature = await hmac(secret, body);
  return `${body}.${signature}`;
}

export async function verifyAdminToken(
  token: string | undefined | null,
  secret: string
): Promise<AdminTokenPayload | null> {
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [body, signature] = parts;

  const expected = await hmac(secret, body);
  if (!constantTimeEqual(signature, expected)) return null;

  try {
    const payload = JSON.parse(fromBase64Url(body)) as AdminTokenPayload;

    if (typeof payload.exp !== "number" || payload.exp <= Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
