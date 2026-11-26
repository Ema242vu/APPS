export type RankingEntry = {
  username: string;
  profilePhoto?: string;
  downloads: number;
  updatedAt: string;
};

const STORAGE_KEY = "persons_download_ranking_v1";

/**
 * Registra una descarga para el usuario dado (solo cliente).
 * Se guarda un top de descargas por nombre de cuenta en localStorage,
 * así se conserva aunque se cambie de cuenta en el mismo dispositivo.
 */
export function recordDownload(username: string, profilePhoto?: string): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const map: Record<string, RankingEntry> = raw ? JSON.parse(raw) : {};
    const now = new Date().toISOString();
    const prev = map[username];
    map[username] = {
      username,
      profilePhoto,
      downloads: (prev?.downloads || 0) + 1,
      updatedAt: now,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {}
}

/**
 * Devuelve el ranking ordenado de más a menos descargas.
 */
export function getRanking(): RankingEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const map: Record<string, RankingEntry> = JSON.parse(raw);
    return Object.values(map).sort((a, b) => b.downloads - a.downloads);
  } catch {
    return [];
  }
}

export function resetRanking(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
