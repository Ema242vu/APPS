import { createHash, timingSafeEqual } from "crypto";

/**
 * Acceso VIP — solo para servidor.
 *
 * El código por defecto NO se guarda en texto plano en el repositorio:
 * solo se conserva su huella SHA-256. Para cambiarlo sin tocar el código,
 * define VIP_CODE en las variables de entorno de Vercel.
 *
 * Si quieres generar una huella nueva:
 * node -e "console.log(require('crypto').createHash('sha256').update('TU_CODIGO'.toUpperCase()).digest('hex'))"
 */
const DEFAULT_CODE_HASH =
  "a1ef12a643d3b692875c23bd2a35d39ffbe8d08410c7d99c5da91947d81e3af9";

export const VIP_COOKIE = "persons_vip_access";
export const VIP_ACCESS_DAYS = 30;

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function getVipCodeHash(): string {
  const code = process.env.VIP_CODE?.trim().toUpperCase();
  return code ? sha256(code) : DEFAULT_CODE_HASH;
}

export function isValidVipCode(input: string): boolean {
  const normalized = input.trim().toUpperCase();
  if (!normalized) return false;

  const expected = Buffer.from(getVipCodeHash(), "hex");
  const actual = Buffer.from(sha256(normalized), "hex");
  if (expected.length !== actual.length) return false;

  return timingSafeEqual(expected, actual);
}

/** Valor opaco de la cookie: no contiene el código ni su huella directamente. */
export function getVipCookieValue(): string {
  const secret = process.env.VIP_COOKIE_SECRET?.trim() || "persons-vip-cookie-v1";
  return sha256(`${secret}:${getVipCodeHash()}`);
}
