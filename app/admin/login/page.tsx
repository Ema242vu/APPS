"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
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

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || "No se pudo iniciar sesión.");
      }

      // El servidor ya dejó la cookie de sesión httpOnly.
      router.push("/admin/referidos");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          borderRadius: 20,
          padding: 28,
        }}
      >
        <h1 style={{ fontSize: 24, margin: "0 0 6px" }}>Acceso admin</h1>
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: 14,
            margin: "0 0 20px",
            lineHeight: 1.5,
          }}
        >
          Introduce la contraseña de administrador para ver las estadísticas de
          referidos. La sesión dura 10 minutos.
        </p>

        <form onSubmit={handleSubmit}>
          <label
            htmlFor="admin-secret"
            style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 6 }}
          >
            Contraseña
          </label>
          <input
            id="admin-secret"
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            required
            autoComplete="current-password"
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid var(--border-color)",
              background: "var(--bg-secondary)",
              color: "var(--text-primary)",
              fontSize: 15,
              boxSizing: "border-box",
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              marginTop: 18,
              padding: "13px 16px",
              borderRadius: 12,
              border: "none",
              background: "var(--accent)",
              color: "#0b0b0b",
              fontWeight: 800,
              fontSize: 15,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {error && (
          <div
            style={{
              marginTop: 16,
              padding: "10px 12px",
              borderRadius: 10,
              background: "rgba(239, 68, 68, 0.12)",
              color: "#fca5a5",
              fontSize: 14,
            }}
          >
            {error}
          </div>
        )}
      </div>
    </main>
  );
}
