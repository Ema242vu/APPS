import { apps } from "@/lib/apps";
import { blogPosts } from "@/lib/blog";

const BASE_URL = "https://apps-peach-two.vercel.app";

/**
 * Convierte cualquier valor a un Date válido.
 * Si la fecha es inválida, devuelve `fallback`.
 */
function safeDate(value: unknown, fallback: Date): Date {
  if (!value) return fallback;

  try {
    // Si ya es un Date
    if (value instanceof Date) {
      return isNaN(value.getTime()) ? fallback : value;
    }

    // Si es string o número
    const parsed = new Date(value as string | number);
    return isNaN(parsed.getTime()) ? fallback : parsed;
  } catch {
    return fallback;
  }
}

export default function sitemap() {
  const now = new Date();

  const staticPages = [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: "daily" as const, priority: 1.0 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${BASE_URL}/escaner`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/codigos`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${BASE_URL}/exclusivas`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${BASE_URL}/tutorial`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE_URL}/faq`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE_URL}/privacidad`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${BASE_URL}/terminos`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.3 },
  ];

  const appPages = (apps || []).map((app) => ({
    url: `${BASE_URL}/apps/${app.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const blogPages = (blogPosts || []).map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: safeDate((post as any).date, now),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...appPages, ...blogPages];
}
