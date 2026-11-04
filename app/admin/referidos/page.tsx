"use client";

import { useEffect, useState } from "react";

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

export default function AdminReferidosPage() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/referrals/admin/list", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { "x-admin-token": token } : {}),
          },
          body: JSON.stringify({}),
        });
        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div style={{ padding: 24 }}>Cargando estadísticas...</div>;
  if (error) return <div style={{ padding: 24, color: "red" }}>{error}</div>;
  if (!stats) return null;

  const { totales, listado } = stats;

  return (
    <div style={{ padding: 24, maxWidth: 1200 }}>
      <h1>Panel de Referidos - Estadísticas</h1>

      <section style={{ background: "#f5f5f5", padding: 24, borderRadius: 8, marginBottom: 24 }}>
        <h3>Totales</h3>
        <pre>{JSON.stringify(totales, null, 2)}</pre>
      </section>

      <section>
        <h3>Listado de Referidores</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Visitas</th>
              <th>Clics</th>
              <th>Descargas</th>
              <th>Ganancia</th>
              <th>Disponible</th>
            </tr>
          </thead>
          <tbody>
            {listado.map((r) => (
              <tr key={r.code}>
                <td>{r.code}</td>
                <td>{r.name}</td>
                <td>{r.stats.visits}</td>
                <td>{r.stats.adClicks}</td>
                <td>{r.stats.downloads}</td>
                <td>${(r.stats.earnings / 100).toFixed(2)}</td>
                <td>${(r.stats.disponible / 100).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}