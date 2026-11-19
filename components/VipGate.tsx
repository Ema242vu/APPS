"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function VipGate() {
  const [code, setCode] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!code.trim() || loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/vip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      if (response.ok) {
        window.location.reload();
        return;
      }

      const data = await response.json().catch(() => null);
      setError(data?.error || "Código incorrecto. Verifica e intenta de nuevo.");
    } catch {
      setError("No se pudo verificar el código. Revisa tu conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-primary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: "420px",
          height: "420px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(250,204,21,0.18), transparent 65%)",
          top: "-160px",
          right: "-120px",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "360px",
          height: "360px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(168,85,247,0.16), transparent 65%)",
          bottom: "-140px",
          left: "-120px",
          pointerEvents: "none",
        }}
      />

      <div style={{ width: "100%", maxWidth: "460px", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: "22px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "rgba(250,204,21,0.12)",
              border: "1px solid rgba(250,204,21,0.3)",
              color: "#facc15",
              padding: "7px 16px",
              borderRadius: "999px",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            ⭐ Zona VIP
          </div>
          <h1
            style={{
              fontSize: "30px",
              fontWeight: 900,
              margin: "16px 0 8px",
              letterSpacing: "-0.8px",
            }}
          >
            Acceso exclusivo
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "var(--text-muted)",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            Introduce tu código VIP para entrar a las descargas directas, sin pasos de verificación.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            borderRadius: "24px",
            padding: "24px",
            boxShadow: "0 24px 80px rgba(0,0,0,0.45)",
          }}
        >
          <label
            htmlFor="vip-code"
            style={{
              display: "block",
              fontSize: "12px",
              fontWeight: 700,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.8px",
              marginBottom: "10px",
            }}
          >
            Código de acceso
          </label>

          <div style={{ position: "relative", marginBottom: "14px" }}>
            <input
              ref={inputRef}
              id="vip-code"
              type={showCode ? "text" : "password"}
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="Pega aquí tu código VIP"
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              style={{
                width: "100%",
                padding: "14px 92px 14px 14px",
                borderRadius: "14px",
                border: "1px solid var(--border-color)",
                backgroundColor: "var(--bg-primary)",
                color: "var(--text-primary)",
                fontSize: "13px",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                outline: "none",
              }}
            />
            <button
              type="button"
              onClick={() => setShowCode((value) => !value)}
              style={{
                position: "absolute",
                right: "8px",
                top: "50%",
                transform: "translateY(-50%)",
                border: "none",
                backgroundColor: "rgba(250,204,21,0.12)",
                color: "#facc15",
                borderRadius: "9px",
                padding: "7px 10px",
                fontSize: "11px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {showCode ? "Ocultar" : "Mostrar"}
            </button>
          </div>

          {error && (
            <p
              role="alert"
              style={{
                fontSize: "12px",
                color: "#f87171",
                backgroundColor: "rgba(248,113,113,0.1)",
                border: "1px solid rgba(248,113,113,0.25)",
                borderRadius: "10px",
                padding: "10px 12px",
                margin: "0 0 14px",
                lineHeight: 1.5,
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !code.trim()}
            className="bounce-click"
            style={{
              width: "100%",
              padding: "15px 18px",
              borderRadius: "14px",
              border: "none",
              background:
                loading || !code.trim()
                  ? "rgba(250,204,21,0.35)"
                  : "linear-gradient(135deg, #facc15, #f59e0b)",
              color: "#0a0a0f",
              fontSize: "14px",
              fontWeight: 800,
              letterSpacing: "0.4px",
              textTransform: "uppercase",
              cursor: loading || !code.trim() ? "not-allowed" : "pointer",
              boxShadow:
                loading || !code.trim()
                  ? "none"
                  : "0 10px 30px rgba(250,204,21,0.25)",
            }}
          >
            {loading ? "Verificando..." : "Entrar a la zona VIP"}
          </button>

          <p
            style={{
              fontSize: "11px",
              color: "var(--text-muted)",
              textAlign: "center",
              margin: "14px 0 0",
              lineHeight: 1.6,
            }}
          >
            El acceso dura 30 días en este dispositivo. El código no distingue mayúsculas de minúsculas.
          </p>
        </form>

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Link
            href="/"
            style={{
              fontSize: "13px",
              color: "var(--text-muted)",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            ← Volver a la tienda
          </Link>
        </div>
      </div>
    </main>
  );
}
