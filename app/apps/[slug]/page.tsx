import { notFound } from "next/navigation";
import { apps } from "@/lib/apps";
import AppDetail from "@/components/AppDetail";

/**
 * Página Server Component (patrón del blog):
 * - generateStaticParams → todas las apps se prerenderizan
 * - generateMetadata     → cada app tiene SU título, descripción,
 *   imagen OG, canonical y JSON-LD (antes compartían el del layout,
 *   lo que mataba el SEO de descargas)
 * - dynamicParams: false → un slug desconocido cae al 404 estilizado
 */

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return apps.map((app) => ({ slug: app.slug }));
}

export const dynamicParams = false;

const SCHEMA_CATEGORY: Record<string, string> = {
  Juegos: "GameApplication",
  Video: "MultimediaApplication",
  Música: "MultimediaApplication",
  Social: "SocialNetworkingApplication",
  Educación: "EducationalApplication",
  Herramientas: "UtilitiesApplication",
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const app = apps.find((a) => a.slug === slug);
  if (!app) {
    return { title: "App no encontrada" };
  }

  const image =
    app.iconUrl && app.iconUrl.startsWith("http") && app.iconUrl !== "AQUI_VA_EL_LINK_DE_LA_IMAGEN"
      ? app.iconUrl
      : undefined;
  const desc = (app.longDescription || app.description || "").trim();
  const title = `${app.name} v${app.version} MOD APK — Descargar Gratis`;

  return {
    title,
    description: desc.slice(0, 155),
    keywords: [
      app.name,
      `${app.name} premium`,
      `${app.name} mod apk`,
      `descargar ${app.name}`,
      app.category,
    ],
    alternates: {
      canonical: `/apps/${app.slug}`,
    },
    openGraph: {
      title,
      description: desc.slice(0, 160),
      images: image ? [{ url: image, alt: app.name }] : undefined,
    },
    twitter: {
      card: image ? ("summary_large_image" as const) : ("summary" as const),
      title,
      description: desc.slice(0, 160),
      images: image ? [image] : undefined,
    },
  };
}

export default async function AppPage({ params }: PageProps) {
  const { slug } = await params;
  const app = apps.find((a) => a.slug === slug);
  if (!app) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: app.name,
    operatingSystem: "ANDROID",
    applicationCategory: SCHEMA_CATEGORY[app.category] ?? "MobileApplication",
    softwareVersion: app.version,
    fileSize: app.size,
    description: app.longDescription || app.description,
    ...(app.iconUrl.startsWith("http") ? { image: app.iconUrl } : {}),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AppDetail app={app} />
    </>
  );
}
