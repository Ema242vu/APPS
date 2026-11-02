import {
  createHash,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "crypto";
import {
  cert,
  getApps,
  initializeApp,
  type App,
} from "firebase-admin/app";
import {
  FieldValue,
  getFirestore,
  type DocumentData,
  type DocumentReference,
  type Firestore,
} from "firebase-admin/firestore";
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

export type Payout = {
  id: string;
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

class CodeCollisionError extends Error {
  constructor() {
    super("Código ocupado");
    this.name = "CodeCollisionError";
  }
}

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

let cachedApp: App | null = null;
let cachedDb: Firestore | null = null;

function getFirebaseApp(): App {
  if (cachedApp) return cachedApp;

  const existingApps = getApps();
  if (existingApps.length > 0) {
    cachedApp = existingApps[0];
    return cachedApp;
  }

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (serviceAccountJson) {
    let serviceAccount: {
      project_id?: string;
      client_email?: string;
      private_key?: string;
    };

    try {
      serviceAccount = JSON.parse(serviceAccountJson) as typeof serviceAccount;
    } catch {
      throw new Error("FIREBASE_SERVICE_ACCOUNT no es un JSON válido.");
    }

    if (
      !serviceAccount.project_id ||
      !serviceAccount.client_email ||
      !serviceAccount.private_key
    ) {
      throw new Error(
        "Faltan campos en FIREBASE_SERVICE_ACCOUNT (project_id, client_email o private_key)."
      );
    }

    try {
      cachedApp = initializeApp({
        credential: cert({
          projectId: serviceAccount.project_id,
          clientEmail: serviceAccount.client_email,
          privateKey: serviceAccount.private_key.replace(/\\n/g, "\n"),
        }),
      });
    } catch {
      throw new Error(
        "No se pudo inicializar Firebase. Revisa la clave de servicio."
      );
    }

    return cachedApp;
  }

  const projectId =
    process.env.FIREBASE_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Faltan FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL o FIREBASE_PRIVATE_KEY en las variables de entorno."
    );
  }

  try {
    cachedApp = initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
    });
  } catch {
    throw new Error(
      "No se pudo inicializar Firebase. Revisa FIREBASE_CLIENT_EMAIL y FIREBASE_PRIVATE_KEY."
    );
  }

  return cachedApp;
}

function getDb(): Firestore {
  if (!cachedDb) cachedDb = getFirestore(getFirebaseApp());
  return cachedDb;
}

function referrerRef(code: string): DocumentReference {
  return getDb().collection("referrers").doc(code);
}

function visitsRef(code: string): ReturnType<DocumentReference["collection"]> {
  return referrerRef(code).collection("visits");
}

function eventsRef(code: string): ReturnType<DocumentReference["collection"]> {
  return referrerRef(code).collection("events");
}

function payoutsRef(code: string): ReturnType<DocumentReference["collection"]> {
  return referrerRef(code).collection("payouts");
}

function ipDailyRef(ipHash: string, date: string): DocumentReference {
  return getDb().collection("referralIpDaily").doc(`${ipHash}_${date}`);
}

function adDailyRef(
  code: string,
  visitorId: string,
  date: string
): DocumentReference {
  return getDb()
    .collection("referralAdDaily")
    .doc(`${code}_${visitorId}_${date}`);
}

function dayKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

function toDate(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;

  if (typeof value === "object" && value !== null && "toDate" in value) {
    const maybeTimestamp = value as { toDate?: () => Date };
    if (typeof maybeTimestamp.toDate === "function") {
      try {
        return maybeTimestamp.toDate();
      } catch {
        return null;
      }
    }
  }

  return null;
}

function mapReferrer(code: string, data: DocumentData): Referrer {
  return {
    id: code,
    code,
    name: typeof data.name === "string" ? data.name : null,
    contact: typeof data.contact === "string" ? data.contact : null,
    payout_method:
      typeof data.payoutMethod === "string" ? data.payoutMethod : null,
    created_at: (toDate(data.createdAt) ?? new Date()).toISOString(),
  };
}

function mapPayout(id: string, data: DocumentData): Payout {
  return {
    id,
    amount_cents: Number(data.amountCents ?? 0),
    method: typeof data.method === "string" ? data.method : null,
    contact: typeof data.contact === "string" ? data.contact : null,
    status:
      data.status === "paid" || data.status === "rejected"
        ? data.status
        : "pending",
    requested_at: (toDate(data.requestedAt) ?? new Date()).toISOString(),
    paid_at: toDate(data.paidAt)?.toISOString() ?? null,
  };
}

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
  const snapshot = await referrerRef(code).get();
  if (!snapshot.exists) return null;
  return mapReferrer(code, snapshot.data() ?? {});
}

export async function verifyReferrerPin(
  code: string,
  pin: string
): Promise<Referrer> {
  const ref = referrerRef(code);
  const snapshot = await ref.get();

  if (!snapshot.exists) {
    throw new ReferralError("Código de referido no encontrado.", 404);
  }

  const data = snapshot.data() ?? {};
  const lockedUntil = toDate(data.lockedUntil);

  if (lockedUntil && lockedUntil.getTime() > Date.now()) {
    throw new ReferralError(
      "Demasiados intentos fallidos. Espera 15 minutos e intenta de nuevo.",
      429
    );
  }

  if (!verifyPinHash(pin, typeof data.pinHash === "string" ? data.pinHash : null)) {
    const failedAttempts = Number(data.failedAttempts ?? 0) + 1;
    const lockedUntilDate =
      failedAttempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null;

    try {
      await ref.update({ failedAttempts, lockedUntil: lockedUntilDate });
    } catch {
      // Si falla el contador, no revelamos el error real.
    }

    throw new ReferralError("PIN incorrecto.", 401);
  }

  if (Number(data.failedAttempts ?? 0) !== 0 || data.lockedUntil) {
    try {
      await ref.update({ failedAttempts: 0, lockedUntil: null });
    } catch {
      // No es crítico; se reintenta en el próximo acceso.
    }
  }

  return mapReferrer(code, data);
}

export async function registerReferrer(input: {
  name: string;
  contact: string;
  payoutMethod: string;
  pin: string;
  ipHash: string;
}): Promise<Referrer> {
  const pinHash = hashPin(input.pin);
  const createdAt = new Date();

  for (let attempt = 0; attempt < 6; attempt += 1) {
    const code = generateReferralCode();

    try {
      await getDb().runTransaction(async (transaction) => {
        const ipRef = ipDailyRef(input.ipHash, dayKey());
        const ipSnapshot = await transaction.get(ipRef);
        const ipData = ipSnapshot.data() ?? {};

        if (
          Number(ipData.registrations ?? 0) >=
          MAX_REGISTRATIONS_PER_IP_PER_DAY
        ) {
          throw new ReferralError(
            "Se crearon demasiados códigos desde esta conexión. Intenta de nuevo mañana.",
            429
          );
        }

        const ref = referrerRef(code);
        const existing = await transaction.get(ref);
        if (existing.exists) {
          throw new CodeCollisionError();
        }

        transaction.set(ref, {
          code,
          name: input.name,
          contact: input.contact,
          payoutMethod: input.payoutMethod,
          pinHash,
          failedAttempts: 0,
          lockedUntil: null,
          createdIp: input.ipHash,
          createdAt,
          visits: 0,
          adClicks: 0,
          downloads: 0,
          earningsCents: 0,
        });

        transaction.set(
          ipRef,
          {
            registrations: FieldValue.increment(1),
            updatedAt: FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
      });

      return {
        id: code,
        code,
        name: input.name,
        contact: input.contact,
        payout_method: input.payoutMethod,
        created_at: createdAt.toISOString(),
      };
    } catch (error) {
      if (error instanceof CodeCollisionError) continue;
      throw error;
    }
  }

  throw new ReferralError(
    "No se pudo generar un código único. Intenta de nuevo.",
    500
  );
}

export async function getReferralStats(code: string): Promise<ReferralStats> {
  const snapshot = await referrerRef(code).get();
  if (!snapshot.exists) {
    throw new ReferralError("Código de referido no encontrado.", 404);
  }

  const data = snapshot.data() ?? {};
  const payoutsSnapshot = await payoutsRef(code).get();

  let paidCents = 0;
  let pendingCents = 0;

  payoutsSnapshot.forEach((payoutDoc) => {
    const payout = payoutDoc.data();
    const amount = Number(payout.amountCents ?? 0);

    if (payout.status === "paid") paidCents += amount;
    else if (payout.status === "pending") pendingCents += amount;
  });

  const earningsCents = Number(data.earningsCents ?? 0);

  return {
    visits: Number(data.visits ?? 0),
    adClicks: Number(data.adClicks ?? 0),
    downloads: Number(data.downloads ?? 0),
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
  return getDb().runTransaction(async (transaction) => {
    const ref = referrerRef(code);
    const referrerSnapshot = await transaction.get(ref);
    if (!referrerSnapshot.exists) return false;

    const visitRef = visitsRef(code).doc(visitorId);
    const visitSnapshot = await transaction.get(visitRef);
    if (visitSnapshot.exists) return true;

    const ipRef = ipDailyRef(ipHash, dayKey());
    const ipSnapshot = await transaction.get(ipRef);
    const ipData = ipSnapshot.data() ?? {};

    if (Number(ipData.visits ?? 0) >= MAX_VISITS_PER_IP_PER_DAY) {
      return false;
    }

    transaction.set(visitRef, {
      visitorId,
      ipHash,
      path: path ? path.slice(0, 200) : null,
      createdAt: new Date(),
    });

    transaction.set(
      ipRef,
      {
        visits: FieldValue.increment(1),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    transaction.update(ref, {
      visits: FieldValue.increment(1),
      earningsCents: FieldValue.increment(REFERRAL_RATES.visitCents),
    });

    return true;
  });
}

export async function recordEvent(input: {
  code: string;
  visitorId: string;
  ipHash: string;
  eventType: "ad_click" | "download";
  appSlug: string | null;
}): Promise<{ counted: boolean; reason?: string }> {
  return getDb().runTransaction(async (transaction) => {
    const ref = referrerRef(input.code);
    const referrerSnapshot = await transaction.get(ref);
    if (!referrerSnapshot.exists) {
      return { counted: false, reason: "invalid_code" };
    }

    if (input.eventType === "download" && !input.appSlug) {
      return { counted: false, reason: "missing_app" };
    }

    const visitRef = visitsRef(input.code).doc(input.visitorId);
    const visitSnapshot = await transaction.get(visitRef);
    if (!visitSnapshot.exists) {
      return { counted: false, reason: "not_referred" };
    }

    const ipRef = ipDailyRef(input.ipHash, dayKey());
    const ipSnapshot = await transaction.get(ipRef);
    const ipData = ipSnapshot.data() ?? {};

    if (Number(ipData.events ?? 0) >= MAX_EVENTS_PER_IP_PER_DAY) {
      return { counted: false, reason: "ip_limit" };
    }

    if (input.eventType === "download") {
      const eventRef = eventsRef(input.code).doc(
        `download_${input.visitorId}_${input.appSlug}`
      );
      const eventSnapshot = await transaction.get(eventRef);
      if (eventSnapshot.exists) {
        return { counted: false, reason: "duplicate" };
      }

      transaction.set(eventRef, {
        visitorId: input.visitorId,
        ipHash: input.ipHash,
        eventType: "download",
        appSlug: input.appSlug,
        createdAt: new Date(),
      });

      transaction.set(
        ipRef,
        {
          events: FieldValue.increment(1),
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

      transaction.update(ref, {
        downloads: FieldValue.increment(1),
        earningsCents: FieldValue.increment(REFERRAL_RATES.downloadCents),
      });

      return { counted: true };
    }

    const dailyRef = adDailyRef(input.code, input.visitorId, dayKey());
    const dailySnapshot = await transaction.get(dailyRef);
    const dailyData = dailySnapshot.data() ?? {};

    if (Number(dailyData.count ?? 0) >= MAX_AD_CLICKS_PER_DAY) {
      return { counted: false, reason: "daily_limit" };
    }

    const eventRef = eventsRef(input.code).doc();
    transaction.set(eventRef, {
      visitorId: input.visitorId,
      ipHash: input.ipHash,
      eventType: "ad_click",
      appSlug: input.appSlug,
      createdAt: new Date(),
    });

    transaction.set(
      dailyRef,
      {
        count: FieldValue.increment(1),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    transaction.set(
      ipRef,
      {
        events: FieldValue.increment(1),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    transaction.update(ref, {
      adClicks: FieldValue.increment(1),
      earningsCents: FieldValue.increment(REFERRAL_RATES.adClickCents),
    });

    return { counted: true };
  });
}

export async function getPayouts(code: string): Promise<Payout[]> {
  const snapshot = await payoutsRef(code)
    .orderBy("requestedAt", "desc")
    .limit(20)
    .get();

  return snapshot.docs.map((payoutDoc) =>
    mapPayout(payoutDoc.id, payoutDoc.data())
  );
}

export async function createPayout(input: {
  code: string;
  pin: string;
  method: string;
  contact: string;
}): Promise<Payout> {
  await verifyReferrerPin(input.code, input.pin);

  return getDb().runTransaction(async (transaction) => {
    const ref = referrerRef(input.code);
    const referrerSnapshot = await transaction.get(ref);
    if (!referrerSnapshot.exists) {
      throw new ReferralError("Código de referido no encontrado.", 404);
    }

    const data = referrerSnapshot.data() ?? {};
    const payoutsSnapshot = await transaction.get(payoutsRef(input.code));

    let paidCents = 0;
    let pendingCents = 0;

    payoutsSnapshot.forEach((payoutDoc) => {
      const payout = payoutDoc.data();
      const amount = Number(payout.amountCents ?? 0);

      if (payout.status === "paid") paidCents += amount;
      else if (payout.status === "pending") pendingCents += amount;
    });

    if (pendingCents > 0) {
      throw new ReferralError(
        "Ya tienes una solicitud de pago pendiente.",
        409
      );
    }

    const availableCents = Math.max(
      0,
      Number(data.earningsCents ?? 0) - paidCents - pendingCents
    );

    if (availableCents < MIN_PAYOUT_CENTS) {
      throw new ReferralError(
        `El mínimo para retirar es ${centsToUsd(MIN_PAYOUT_CENTS)}. Te faltan ${centsToUsd(
          MIN_PAYOUT_CENTS - availableCents
        )}.`,
        400
      );
    }

    const payoutRef = payoutsRef(input.code).doc();
    const requestedAt = new Date();

    transaction.set(payoutRef, {
      amountCents: availableCents,
      method: input.method,
      contact: input.contact,
      status: "pending",
      requestedAt,
      paidAt: null,
    });

    return {
      id: payoutRef.id,
      amount_cents: availableCents,
      method: input.method,
      contact: input.contact,
      status: "pending" as const,
      requested_at: requestedAt.toISOString(),
      paid_at: null,
    };
  });
}
