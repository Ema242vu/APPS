/**
 * Tarifas del programa de referidos.
 * Los valores están en centavos de dólar para evitar decimales.
 *
 * CAMBIA ESTOS VALORES según tu presupuesto. Son solo una propuesta.
 */
export const REFERRAL_RATES = {
  visitCents: 1, // $0.01 por visita única
  adClickCents: 5, // $0.05 por clic en anuncio
  downloadCents: 10, // $0.10 por descarga verificada
} as const;

/** Pago mínimo para solicitar retiro: 500 = $5.00 */
export const MIN_PAYOUT_CENTS = 500;

/** Límite de clics en anuncios que se pagan por visitante/día. */
export const MAX_AD_CLICKS_PER_DAY = 3;

/** Límites anti-abuso por IP por día (UTC). */
export const MAX_VISITS_PER_IP_PER_DAY = 100;
export const MAX_EVENTS_PER_IP_PER_DAY = 300;

/** Límite de registros por IP por día (UTC), anti-spam. */
export const MAX_REGISTRATIONS_PER_IP_PER_DAY = 3;

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://apps-peach-two.vercel.app";

export function centsToUsd(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
