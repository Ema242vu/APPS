import { Suspense } from "react";
import { notFound } from "next/navigation";
import { apps } from "@/lib/apps";
import DownloadFlow from "@/components/DownloadFlow";
import MonetagVignette from "@/components/MonetagVignette";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ link?: string }>;
};

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

export default async function DownloadPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const { link: linkParam } = await searchParams;
  const app = apps.find((a) => a.slug === slug);
  if (!app) notFound();

  // Si se pide el link 1 de una app con directLink, usamos esa URL.
  // En cualquier otro caso (directOnly, normal, o link 2) usamos app.link.
  const downloadUrl =
    linkParam === "1" && app.directLink ? app.directLink.url : app.link;

  return (
    <>
      <Suspense
        fallback={
          <div
            style={{
              minHeight: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#ffffff",
              color: "#1e293b",
              fontFamily: "system-ui, sans-serif",
              fontSize: "14px",
            }}
          >
            Cargando descarga...
          </div>
        }
      >
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
          downloadUrl={downloadUrl}
          romInfo={app.romInfo}
          hasPremiumSection={app.hasPremiumSection}
          premiumFeatures={app.premiumFeatures}
        />
      </Suspense>
      <MonetagVignette />
    </>
  );
}
