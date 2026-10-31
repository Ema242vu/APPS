import { Suspense } from "react";
import { notFound } from "next/navigation";
import Script from "next/script";
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
    <>
      <Script
        src="https://5gvci.com/act/files/tag.min.js?z=12160212"
        data-cfasync="false"
        strategy="beforeInteractive"
      />
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
          downloadUrl={app.link}
          romInfo={app.romInfo}
          hasPremiumSection={app.hasPremiumSection}
          premiumFeatures={app.premiumFeatures}
        />
      </Suspense>
    </>
  );
}
