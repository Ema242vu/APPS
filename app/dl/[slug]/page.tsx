import { notFound } from "next/navigation";
import { apps } from "@/lib/apps";
import DownloadFlow from "@/components/DownloadFlow";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return apps.map((app) => ({ slug: app.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const app = apps.find((a) => a.slug === slug);
  if (!app) return { title: "Descarga no encontrada" };

  return {
    title: `Descargar ${app.name} v${app.version} MOD APK`,
    description: `Descarga ${app.name} gratis. Última versión MOD para Android.`,
    robots: { index: false, follow: false },
  };
}

export default async function DownloadPage({ params }: PageProps) {
  const { slug } = await params;
  const app = apps.find((a) => a.slug === slug);
  if (!app) notFound();

  return (
    <DownloadFlow
      slug={app.slug}
      appName={app.name}
      appIcon={app.iconUrl}
      appEmoji={app.emoji}
      appVersion={app.version}
      appSize={app.size}
      appCategory={app.category}
      appDescription={app.description}
      appLongDescription={app.longDescription}
      downloadUrl={app.link}
      romInfo={app.romInfo}
      hasPremiumSection={app.hasPremiumSection}
      premiumFeatures={app.premiumFeatures}
    />
  );
}
