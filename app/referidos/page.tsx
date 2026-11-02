import type { Metadata } from "next";
import Link from "next/link";
import ReferralSystem from "@/components/ReferralSystem";

export const metadata: Metadata = {
  title: "Programa de Referidos",
  description:
    "Comparte tu link, invita amigos y gana dinero por visitas, clics en anuncios y descargas de APKs.",
  alternates: {
    canonical: "/referidos",
  },
};

export default function ReferidosPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
        padding: "20px 16px 80px",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            color: "var(--text-muted)",
            textDecoration: "none",
            fontSize: 14,
            marginBottom: 20,
          }}
        >
          ← Volver al inicio
        </Link>

        <ReferralSystem />

        <p
          style={{
            color: "var(--text-muted)",
            fontSize: 12,
            lineHeight: 1.6,
            textAlign: "center",
            marginTop: 24,
          }}
        >
          Los pagos se procesan manualmente. Revisamos las estadísticas antes de
          pagar para evitar fraude.
        </p>
      </div>
    </main>
  );
}
