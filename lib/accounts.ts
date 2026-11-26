export type Account = {
  id: string;
  username: string;
  createdAt: string;
  profilePhoto?: string; // data URL o URL externa
  description?: string;
  redeemedCodes: string[]; // códigos ya canjeados por esta cuenta
  skipUntil: number | null; // timestamp de expiración del skip de pasos
  downloads: number; // total de descargas realizadas con esta cuenta
};

const STORAGE_KEY = "persons_account_v1";
const REGISTERED_KEY = "persons_registered_accounts_v1";

function loadRegistered(): Record<string, { username: string; profilePhoto?: string; downloads: number; createdAt: string; updatedAt: string }> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(REGISTERED_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveRegistered(map: Record<string, { username: string; profilePhoto?: string; downloads: number; createdAt: string; updatedAt: string }>): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(REGISTERED_KEY, JSON.stringify(map));
}

export function registerAccountInGlobal(account: Account): void {
  const map = loadRegistered();
  const now = new Date().toISOString();
  if (!map[account.username]) {
    map[account.username] = {
      username: account.username,
      profilePhoto: account.profilePhoto,
      downloads: account.downloads || 0,
      createdAt: account.createdAt,
      updatedAt: now,
    };
  } else {
    map[account.username].profilePhoto = account.profilePhoto ?? map[account.username].profilePhoto;
    map[account.username].downloads = account.downloads || 0;
    map[account.username].updatedAt = now;
  }
  saveRegistered(map);
}

export function getAllRegisteredAccounts(): Array<{ username: string; profilePhoto?: string; downloads: number; createdAt: string; updatedAt: string }> {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(REGISTERED_KEY);
    if (!raw) return [];
    const map: Record<string, { username: string; profilePhoto?: string; downloads: number; createdAt: string; updatedAt: string }> = JSON.parse(raw);
    return Object.values(map).sort((a, b) => b.downloads - a.downloads);
  } catch {
    return [];
  }
}

export function loadAccount(): Account | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveAccount(account: Account): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(account));
  window.dispatchEvent(new CustomEvent("persons-account-change"));
}

export function createAccount(username: string): Account {
  const acc: Account = {
    id: (crypto.randomUUID && crypto.randomUUID()) || Math.random().toString(36).slice(2),
    username: username.trim() || "Usuario",
    createdAt: new Date().toISOString(),
    profilePhoto: undefined,
    description: undefined,
    redeemedCodes: [],
    skipUntil: null,
    downloads: 0,
  };
  saveAccount(acc);
  registerAccountInGlobal(acc);
  return acc;
}

export function ensureAccount(username?: string): Account {
  const existing = loadAccount();
  if (existing) return existing;
  return createAccount(username || "Usuario");
}

export function updateProfile(
  account: Account,
  patch: { profilePhoto?: string; description?: string }
): Account {
  const next: Account = { ...account, ...patch };
  saveAccount(next);
  registerAccountInGlobal(next);
  return next;
}

export function redeemCode(
  account: Account,
  code: string,
  validCodes: string[]
): { ok: boolean; msg: string; account: Account } {
  const c = code.trim().toUpperCase();
  if (!c) return { ok: false, msg: "Escribe un código.", account };
  if (!validCodes.includes(c)) {
    return { ok: false, msg: "Código inválido o expirado.", account };
  }
  if (account.redeemedCodes.includes(c)) {
    return { ok: false, msg: "Ya canjeaste este código en tu cuenta.", account };
  }
  const next: Account = {
    ...account,
    redeemedCodes: [...account.redeemedCodes, c],
    skipUntil: Date.now() + 30 * 60 * 1000,
  };
  saveAccount(next);
  return {
    ok: true,
    msg: "Código canjeado. Tienes 30 minutos sin pasos en las descargas.",
    account: next,
  };
}

export function grantSkip(account: Account, minutes: number): Account {
  const next: Account = {
    ...account,
    skipUntil: Date.now() + minutes * 60 * 1000,
  };
  saveAccount(next);
  return next;
}

export function isSkipActive(account: Account | null): boolean {
  if (!account || !account.skipUntil) return false;
  return Date.now() < account.skipUntil;
}

export function remainingSkipMinutes(account: Account): number {
  const ms = account.skipUntil! - Date.now();
  return Math.max(0, Math.ceil(ms / (60 * 1000)));
}

export type RouletteResult = {
  won: boolean;
  minutes: number;
  label: string;
  account: Account;
};

export function spinRuleta(account: Account): RouletteResult {
  // 10 segmentos: 1×30 min, 1×15 min, 8×sin premio (~20% de ganar)
  const r = Math.random();
  let prize: { label: string; minutes: number };
  if (r < 0.10) prize = { label: "30 min", minutes: 30 };
  else if (r < 0.20) prize = { label: "15 min", minutes: 15 };
  else prize = { label: "Sigue intentando", minutes: 0 };

  let next = account;
  if (prize.minutes > 0) {
    next = grantSkip(account, prize.minutes);
  }

  return { won: prize.minutes > 0, minutes: prize.minutes, label: prize.label, account: next };
}

export function incrementDownloads(account: Account): Account {
  const next: Account = { ...account, downloads: (account.downloads || 0) + 1 };
  saveAccount(next);
  registerAccountInGlobal(next);
  return next;
}
