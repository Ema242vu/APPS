import { SITE_URL } from "./config";

const VISITOR_KEY = "persons_visitor_id";
const REFERRER_KEY = "persons_referrer_code";
const OWN_CODE_KEY = "persons_my_referral_code";
const PIN_KEY = "persons_referral_pin";
const VISIT_SENT_PREFIX = "persons_visit_sent_";

function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // localStorage puede estar bloqueado en modo privado.
  }
}

function safeRemove(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignorar.
  }
}

function randomId(): string {
  const cryptoObj = globalThis.crypto;
  if (cryptoObj && typeof cryptoObj.randomUUID === "function") {
    return cryptoObj.randomUUID();
  }
  return `v_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 12)}`;
}

export function getVisitorId(): string {
  const stored = safeGet(VISITOR_KEY);
  if (stored) return stored;
  const id = randomId();
  safeSet(VISITOR_KEY, id);
  return id;
}

export function getStoredReferrer(): string | null {
  return safeGet(REFERRER_KEY);
}

export function getOwnCode(): string | null {
  return safeGet(OWN_CODE_KEY);
}

export function setOwnCode(code: string) {
  safeSet(OWN_CODE_KEY, code.trim().toUpperCase());
}

export function getStoredPin(): string | null {
  try {
    return sessionStorage.getItem(PIN_KEY);
  } catch {
    return null;
  }
}

export function setStoredPin(pin: string) {
  try {
    sessionStorage.setItem(PIN_KEY, pin);
  } catch {
    // sessionStorage puede estar bloqueado en modo privado.
  }
}

export function clearStoredPin() {
  try {
    sessionStorage.removeItem(PIN_KEY);
  } catch {
    // Ignorar.
  }
}

export function clearOwnCode() {
  safeRemove(OWN_CODE_KEY);
  clearStoredPin();
}

export function captureReferral(): string | null {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);
  const raw = params.get("ref");

  if (!raw) return getStoredReferrer();

  const code = raw.trim().toUpperCase();
  if (!/^[A-Z0-9]{6,12}$/.test(code)) return getStoredReferrer();

  const ownCode = getOwnCode();
  if (ownCode && ownCode === code) {
    // Evita que alguien se refiera a sí mismo.
    return getStoredReferrer();
  }

  safeSet(REFERRER_KEY, code);
  return code;
}

export function getReferralLink(code: string): string {
  const base =
    typeof window !== "undefined" ? window.location.origin : SITE_URL;
  return `${base}/?ref=${encodeURIComponent(code)}`;
}

async function postTrack(
  payload: Record<string, unknown>,
  useBeacon = false
): Promise<boolean> {
  const body = JSON.stringify(payload);

  if (useBeacon && typeof navigator !== "undefined" && navigator.sendBeacon) {
    try {
      return navigator.sendBeacon(
        "/api/referrals/track",
        new Blob([body], { type: "application/json" })
      );
    } catch {
      return false;
    }
  }

  try {
    const response = await fetch("/api/referrals/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    });
    return response.ok;
  } catch {
    return false;
  }
}

const visitPromises = new Map<string, Promise<string | null>>();

async function sendVisit(code: string): Promise<string | null> {
  const ownCode = getOwnCode();
  if (ownCode && ownCode === code) return null;

  const visitorId = getVisitorId();
  const sentKey = `${VISIT_SENT_PREFIX}${code}_${visitorId}`;

  try {
    if (sessionStorage.getItem(sentKey)) return code;
    sessionStorage.setItem(sentKey, "1");
  } catch {
    // Si sessionStorage falla, la visita única de Firestore evita duplicados.
  }

  const ok = await postTrack({
    code,
    visitorId,
    eventType: "visit",
    path: window.location.pathname,
  });

  if (!ok) {
    try {
      sessionStorage.removeItem(sentKey);
    } catch {
      // Ignorar.
    }
    return null;
  }

  return code;
}

export function trackVisit(): Promise<string | null> {
  if (typeof window === "undefined") return Promise.resolve(null);

  const code = captureReferral();
  if (!code) return Promise.resolve(null);

  const existing = visitPromises.get(code);
  if (existing) return existing;

  const promise = sendVisit(code).finally(() => {
    visitPromises.delete(code);
  });
  visitPromises.set(code, promise);
  return promise;
}

export async function trackReferralEvent(
  eventType: "ad_click" | "download",
  appSlug?: string
) {
  if (typeof window === "undefined") return;

  // Espera a que la visita quede registrada para que el evento sea válido.
  const code = await trackVisit();
  if (!code) return;

  const ownCode = getOwnCode();
  if (ownCode && ownCode === code) return;

  await postTrack(
    {
      code,
      visitorId: getVisitorId(),
      eventType,
      appSlug: appSlug ?? null,
      path: window.location.pathname,
    },
    eventType === "download"
  );
}
