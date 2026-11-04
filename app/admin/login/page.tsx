"use client";

import { useState } from "react";

export default function AdminLogin() {
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/referrals/admin/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al generar token");
      }

      localStorage.setItem("adminToken", data.token);
      window.location.href = "/admin/referidos";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 40, maxWidth: 400, margin: "0 auto" }}>
      <h1>Acceso Admin</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Contraseña/Secreto:
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            required
            style={{ width: "100%", marginTop: 8, padding: 8 }}
          />
        </label>
        <button type="submit" disabled={loading} style={{ marginTop: 16 }}>
          {loading ? "Generando token..." : "Obtener acceso"}
        </button>
      </form>
      {error && <div style={{ color: "red", marginTop: 16 }}>{error}</div>}
    </div>
  );
}