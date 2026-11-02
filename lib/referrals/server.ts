import {
  createHash,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  MAX_AD_CLICKS_PER_DAY,
  MAX_EVENTS_PER_IP_PER_DAY,
  MAX_REGISTRATIONS_PER_IP_PER_DAY,
  MAX_VISITS_PER_IP_PER_DAY,
  MIN_PAYOUT_CENTS,
  REFERRAL_RATES,
  centsToUsd,
} from "./config";

export type Referrer = {
  id: string;
  code: string;
  name: string | null;
  contact: string | null;
  payout_method: string | null;
  created_at: string;
};

type ReferrerWithPin = Referrer & {
  pin_hash: string | null;
  failed_attempts: number;
  locked_until: string | null;
};

export type Payout = {
  id: number;
  amount_cents: number;
  method: string | null;
  contact: string | null;
  status: "pending" | "paid" | "rejected";
  requested_at: string;
  paid_at: string | null;
};

export type ReferralStats = {
  visits: number;
  adClicks: number;
  downloads: number;
  earningsCents: number;
  paidCents: number;
  pendingCents: number;
  availableCents: number;
};

export class ReferralError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "ReferralError";
    this.status = status;
  }
}

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function normalizeCode(value: string): string {
  return value.trim().toUpperCase();
}

export function isValidCode(value: string): boolean {
  return /^[A-Z0-9]{6,12}$/.test(value);
}

export function generateReferralCode(): string {
  const bytes = randomBytes(8);
  let code = "";
  for (let i = 0; i < 8; i += 1) {
    code += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
  }
  return code;
}

export function hashIp(ip: string): string {
  return createHash("sha256")
    .update(`${ip}:${process.env.REFERRAL_IP_SALT || "persons-referrals"}`)
    .digest("hex")
    .slice(0, 32);
}

export function hashPin(pin: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(pin, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPinHash(pin: string, stored: string | null): boolean {
  if (!stored) return false;
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;

  try {
    const expected = Buffer.from(hash, "hex");
    const actual = scryptSync(pin, salt, 64);
    return (
      expected.length === actual.length && timingSafeEqual(expected, actual)
    );
  } catch {
    return false;
  }
}

export async function getReferrer(code: string): Promise<Referrer | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("referrers")
    .select("id, code, name, contact, payout_method, created_at")
    .eq("code", code)
    .maybeSingle();

  if (error) throw error;
  return (data as Referrer | null) ?? null;
}

async function getReferrerWithPin(
  code: string
): Promise<ReferrerWithPin | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("referrers")
    .select(
      "id, code, name, contact, payout_method, created_at, pin_hash, failed_attempts, locked_until"
    )
    .eq("code", code)
    .maybeSingle();

  if (error) throw error;
  return (data as ReferrerWithPin | null) ?? null;
}

export async function verifyReferrerPin(
  code: string,
  pin: string
): Promise<Referrer> {
  const supabase = createAdminClient();
  const referrer = await getReferrerWithPin(code);

  if (!referrer) {
    throw new ReferralError("Código de referido no encontrado.", 404);
  }

  if (
    referrer.locked_until &&
    new Date(referrer.locked_until).getTime() > Date.now()
  ) {
    throw new ReferralError(
      "Demasiados intentos fallidos. Espera 15 minutos e intenta de nuevo.",
      429
    );
  }

  if (!verifyPinHash(pin, referrer.pin_hash)) {
    const failedAttempts = (referrer.failed_attempts || 0) + 1;
    const lockedUntil =
      failedAttempts >= 5
        ? new Date(Date.now() + 15 * 60 * 1000).toISOString()
        : null;

    await supabase
      .from("referrers")
      .update({ failed_attempts: failedAttempts, locked_until: lockedUntil })
      .eq("code", code);

    throw new ReferralError("PIN incorrecto.", 401);
  }

  if (referrer.failed_attempts !== 0 || referrer.locked_until) {
    await supabase
      .from("referrers")
      .update({ failed_attempts: 0, locked_until: null })
      .eq("code", code);
  }

  return {
    id: referrer.id,
    code: referrer.code,
    name: referrer.name,
    contact: referrer.contact,
    payout_method: referrer.payout_method,
    created_at: referrer.created_at,
  };
}

export async function registerReferrer(input: {
  name: string;
  contact: string;
  payoutMethod: string;
  pin: string;
  ipHash: string;
}): Promise<Referrer> {
  const supabase = createAdminClient();
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { count, error: countError } = await supabase
    .from("referrers")
    .select("id", { count: "exact", head: true })
    .eq("created_ip", input.ipHash)
    .gte("created_at", since);

  if (countError) throw countError;
  if ((count ?? 0) >= MAX_REGISTRATIONS_PER_IP_PER_DAY) {
    throw new ReferralError(
      "Se crearon demasiados códigos desde esta conexión. Intenta de nuevo mañana.",
      429
    );
  }

  for (let attempt = 0; attempt < 6; attempt += 1) {
    const code = generateReferralCode();
    const { data, error } = await supabase
      .from("referrers")
      .insert({
        code,
        name: input.name,
        contact: input.contact,
        payout_method: input.payoutMethod,
        pin_hash: hashPin(input.pin),
        created_ip: input.ipHash,
      })
      .select("id, code, name, contact, payout_method, created_at")
      .single();

    if (!error) return data as Referrer;
    if (error.code === "23505") continue;
    throw error;
  }

  throw new ReferralError("No se pudo generar un código único. Intenta de nuevo.", 500);
}

export async function getReferralStats(code: string): Promise<ReferralStats> {
  const supabase = createAdminClient();

  const [visitsResult, adClicksResult, downloadsResult, payoutsResult] = await Promise.all([
    supabase
      .from("referral_visits")
      .select("id", { count: "exact", head: true })
      .eq("referrer_code", code),
    supabase
      .from("referral_events")
      .select("id", { count: "exact", head: true })
      .eq("referrer_code", code)
      .eq("event_type", "ad_click"),
    supabase
      .from("referral_events")
      .select("id", { count: "exact", head: true })
      .eq("referrer_code", code)
      .eq("event_type", "download"),
    supabase
      .from("referral_payouts")
      .select("amount_cents, status")
      .eq("referrer_code", code),
  ]);

  if (visitsResult.error) throw visitsResult.error;
  if (adClicksResult.error) throw adClicksResult.error;
  if (downloadsResult.error) throw downloadsResult.error;
  if (payoutsResult.error) throw payoutsResult.error;

  const visits = visitsResult.count ?? 0;
  const adClicks = adClicksResult.count ?? 0;
  const downloads = downloadsResult.count ?? 0;
  const payouts = (payoutsResult.data ?? []) as Array<{
    amount_cents: number;
    status: string;
  }>;

  const earningsCents =
    visits * REFERRAL_RATES.visitCents +
    adClicks * REFERRAL_RATES.adClickCents +
    downloads * REFERRAL_RATES.downloadCents;

  const paidCents = payouts
    .filter((payout) => payout.status === "paid")
    .reduce((total, payout) => total + payout.amount_cents, 0);
  const pendingCents = payouts
    .filter((payout) => payout.status === "pending")
    .reduce((total, payout) => total + payout.amount_cents, 0);

  return {
    visits,
    adClicks,
    downloads,
    earningsCents,
    paidCents,
    pendingCents,
    availableCents: Math.max(0, earningsCents - paidCents - pendingCents),
  };
}

export async function recordVisit(
  code: string,
  visitorId: string,
  ipHash: string,
  path: string | null
): Promise<boolean> {
  const referrer = await getReferrer(code);
  if (!referrer) return false;

  const supabase = createAdminClient();
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count, error: countError } = await supabase
    .from("referral_visits")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", since);

  if (countError) throw countError;
  if ((count ?? 0) >= MAX_VISITS_PER_IP_PER_DAY) return false;

  const { error } = await supabase.from("referral_visits").upsert(
    {
      referrer_code: code,
      visitor_id: visitorId,
      ip_hash: ipHash,
      path: path ? path.slice(0, 200) : null,
    },
    {
      onConflict: "referrer_code,visitor_id",
      ignoreDuplicates: true,
    }
  );

  if (error) throw error;
  return true;
}

export async function recordEvent(input: {
  code: string;
  visitorId: string;
  ipHash: string;
  eventType: "ad_click" | "download";
  appSlug: string | null;
}): Promise<{ counted: boolean; reason?: string }> {
  const referrer = await getReferrer(input.code);
  if (!referrer) return { counted: false, reason: "invalid_code" };

  if (input.eventType === "download" && !input.appSlug) {
    return { counted: false, reason: "missing_app" };
  }

  const supabase = createAdminClient();
  const { data: visit, error: visitError } = await supabase
    .from("referral_visits")
    .select("id")
    .eq("referrer_code", input.code)
    .eq("visitor_id", input.visitorId)
    .maybeSingle();

  if (visitError) throw visitError;
  if (!visit) return { counted: false, reason: "not_referred" };

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count: ipCount, error: ipError } = await supabase
    .from("referral_events")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", input.ipHash)
    .gte("created_at", since);

  if (ipError) throw ipError;
  if ((ipCount ?? 0) >= MAX_EVENTS_PER_IP_PER_DAY) {
    return { counted: false, reason: "ip_limit" };
  }

  if (input.eventType === "ad_click") {
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);

    const { count, error: countError } = await supabase
      .from("referral_events")
      .select("id", { count: "exact", head: true })
      .eq("referrer_code", input.code)
      .eq("visitor_id", input.visitorId)
      .eq("event_type", "ad_click")
      .gte("created_at", startOfDay.toISOString());

    if (countError) throw countError;
    if ((count ?? 0) >= MAX_AD_CLICKS_PER_DAY) {
      return { counted: false, reason: "daily_limit" };
    }
  }

  const { error } = await supabase.from("referral_events").insert({
    referrer_code: input.code,
    visitor_id: input.visitorId,
    ip_hash: input.ipHash,
    event_type: input.eventType,
    app_slug: input.appSlug,
  });

  if (error) {
    if (error.code === "23505") return { counted: false, reason: "duplicate" };
    throw error;
  }

  return { counted: true };
}

export async function getPayouts(code: string): Promise<Payout[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("referral_payouts")
    .select("id, amount_cents, method, contact, status, requested_at, paid_at")
    .eq("referrer_code", code)
    .order("requested_at", { ascending: false })
    .limit(20);

  if (error) throw error;
  return (data ?? []) as Payout[];
}

export async function createPayout(input: {
  code: string;
  pin: string;
  method: string;
  contact: string;
}): Promise<Payout> {
  await verifyReferrerPin(input.code, input.pin);

  const supabase = createAdminClient();
  const { data: pending, error: pendingError } = await supabase
    .from("referral_payouts")
    .select("id")
    .eq("referrer_code", input.code)
    .eq("status", "pending")
    .maybeSingle();

  if (pendingError) throw pendingError;
  if (pending) {
    throw new ReferralError("Ya tienes una solicitud de pago pendiente.", 409);
  }

  const stats = await getReferralStats(input.code);
  if (stats.availableCents < MIN_PAYOUT_CENTS) {
    throw new ReferralError(
      `El mínimo para retirar es ${centsToUsd(MIN_PAYOUT_CENTS)}. Te faltan ${centsToUsd(
        MIN_PAYOUT_CENTS - stats.availableCents
      )}.`,
      400
    );
  }

  const { data, error } = await supabase
    .from("referral_payouts")
    .insert({
      referrer_code: input.code,
      amount_cents: stats.availableCents,
      method: input.method,
      contact: input.contact,
      status: "pending",
    })
    .select("id, amount_cents, method, contact, status, requested_at, paid_at")
    .single();

  if (error) throw error;
  return data as Payout;
}
