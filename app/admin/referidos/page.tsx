"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Referidor = {
  code: string;
  name: string | null;
  contact: string | null;
  method: string | null;
  createdAt: string;
  stats: {
    visits: number;
    adClicks: number;
    downloads: number;
    earnings: number;
    pagados: number;
    pendientes: number;
    disponible: number;
  };
};

type StatsResponse = {
  totales: {
    visitas: number;
    clics: number;
    descargas: number;
    ganancia: number;
    pagado: number;
    pendiente: number;
  };
  listado: Referidor[];
};

const usd = (cents: number) => `$${(cents / 100).toFixed(2)}`;

export default function AdminReferidosPage() {
  const router = useRouter();
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/referrals/admin/list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data) {
        throw new Error(data?.error || "No se pudieron cargar las estadísticas.");
      }

      setStats(data as StatsResponse);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error inesperado";

      if (message.includes("sesión") || message.includes("Sesión")) {
        router.push("/admin/login");
        return;
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchStats();
  }, [fetchStats]);

  const logout = async () => {
    await fetch("/api/referrals/admin/logout", { method: "POST" }).catch(
      () => null
    );
    router.push("/admin/login");
    router.refresh();
  };

  if (loading) {
    return (
      <main style={{ padding: 24, color: "var(--text-primary)" }}>
        Cargando estadísticas...
      </main>
    );
  }

  if (error) {
    return (
      <main style={{ padding: 24, color: "#fca5a5" }}>
        {error}
        <div style={{ marginTop: 12 }}>
          <button onClick={fetchStats}>Reintentar</button>
        </div>
      </main>
    );
  }

  if (!stats) return null;

  const { totales, listado } = stats;

  const celda = {
    padding: "8px 10px",
    borderBottom: "1px solid var(--border-color)",
    fontSize: 13,
    textAlign: "left" as const,
  };

  const tarjeta = {
    background: "var(--bg-card)",
    border: "1px solid var(--border-color)",
    borderRadius: 16,
    padding: 16,
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
        padding: "20px 16px 60px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 20,
          }}
        >
          <h1 style={{ fontSize: 24, margin: 0 }}>Panel de referidos</h1>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={fetchStats} style={{ cursor: "pointer" }}>
              Actualizar
            </button>
            <button onClick={logout} style={{ cursor: "pointer" }}>
              Salir
            </button>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: 12,
            marginBottom: 20,
          }}
        >
          {[
            { label: "Códigos", value: listado.length },
            { label: "Visitas", value: totales.visitas },
            { label: "Clics", value: totales.clics },
            { label: "Descargas", value: totales.descargas },
            { label: "Ganado", value: usd(totales.ganancia) },
            { label: "Pagado", value: usd(totales.pagado) },
            { label: "Pendiente", value: usd(totales.pendiente) },
            {
              label: "Disponible",
              value: usd(
                Math.max(
                  0,
                  totales.ganancia - totales.pagado - totales.pendiente
                )
              ),
            },
          ].map((item) => (
            <div key={item.label} style={tarjeta}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                }}
              >
                {item.label}
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, marginTop: 6 }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>

        <div style={{ ...tarjeta, padding: 0, overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {[
                  "Código",
                  "Nombre",
                  "Contacto",
                  "Visitas",
                  "Clics",
                  "Descargas",
                  "Ganado",
                  "Pagado",
                  "Pendiente",
                  "Disponible",
                ].map((header) => (
                  <th
                    key={header}
                    style={{
                      ...celda,
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: 0.6,
                      color: "var(--text-muted)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {listado.map((r) => (
                <tr key={r.code}>
                  <td style={{ ...celda, fontWeight: 700 }}>{r.code}</td>
                  <td style={celda}>{r.name || "—"}</td>
                  <td style={celda}>{r.contact || "—"}</td>
                  <td style={celda}>{r.stats.visits}</td>
                  <td style={celda}>{r.stats.adClicks}</td>
                  <td style={celda}>{r.stats.downloads}</td>
                  <td style={celda}>{usd(r.stats.earnings)}</td>
                  <td style={celda}>{usd(r.stats.pagados)}</td>
                  <td style={celda}>{usd(r.stats.pendientes)}</td>
                  <td style={{ ...celda, fontWeight: 700 }}>
                    {usd(r.stats.disponible)}
                  </td>
                </tr>
              ))}
              {listado.length === 0 && (
                <tr>
                  <td style={{ ...celda, color: "var(--text-muted)" }} colSpan={10}>
                    Todavía no hay códigos de referido.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
