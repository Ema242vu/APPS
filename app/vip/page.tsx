import type { Metadata } from "next";
import { cookies } from "next/headers";
import { apps, hiddenCategories } from "@/lib/apps";
import { VIP_COOKIE, getVipCookieValue } from "@/lib/vip";
import VipGate from "@/components/VipGate";
import VipCatalog from "@/components/VipCatalog";

export const metadata: Metadata = {
  title: "Zona VIP — Descargas directas",
  description:
    "Acceso exclusivo para miembros VIP. Descarga APKs directamente, sin pasos de verificación.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function VipPage() {
  const cookieStore = await cookies();
  const unlocked = cookieStore.get(VIP_COOKIE)?.value === getVipCookieValue();

  if (!unlocked) {
    return <VipGate />;
  }

  const visibleApps = apps.filter((app) => !hiddenCategories.includes(app.category));

  return <VipCatalog apps={visibleApps} />;
}
