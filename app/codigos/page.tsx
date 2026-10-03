"use client";

import Link from "next/link";
import { useState } from "react";

const codigos = [
  "3905611",
  "3435719",
  "2628629",
  "4952975",
];

export default function Codigos() {
  const [copiado, setCopiado] = useState<string | null>(null);

  const copiar = (codigo: string) => {
    navigator.clipboard.writeText(codigo);
    setCopiado(codigo);
    setTimeout(() => setCopiado(null), 2000);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-primary)", color: "var(--text-primary)", fontFamily: "system-ui, sans-serif", padding: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width: "100%", maxWidth: "600px" }}>
        <Link href="/" style={{ color: "#facc15", textDecoration: "none", fontWeight: "bold", display: "inline-block", marginBottom: "30px" }}>
          ← Volver a la tienda
        </Link>

        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div style={{ fontSize: "60px", marginBottom: "15px" }}>🔑</div>
          <h1 style={{ fontSize: "32px", fontWeight: 900, marginBottom: "10px" }}>Códigos Xuper TV</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "15px", lineHeight: 1.6 }}>
            Códigos exclusivos para activar Xuper TV Premium. Toca cualquier código para copiarlo.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "30px" }}>
          {codigos.map((codigo, i) => (
            <button
              key={i}
              onClick={() => copiar(codigo)}
              className="bounce-click"
              style={{
                padding: "20px",
                borderRadius: "16px",
                backgroundColor: copiado === codigo ? "rgba(34, 197, 94, 0.15)" : "var(--bg-card)",
                border: copiado === codigo ? "1px solid #22c55e" : "1px solid rgba(250, 204, 21, 0.3)",
                color: copiado === codigo ? "#86efac" : "var(--text-primary)",
                fontSize: "20px",
                fontWeight: "bold",
                letterSpacing: "3px",
                cursor: "pointer",
                fontFamily: "monospace",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                transition: "all 0.3s ease",
              }}
            >
              <span>{codigo}</span>
              <span style={{ fontSize: "14px", letterSpacing: 0, fontWeight: "normal", opacity: 0.8 }}>
                {copiado === codigo ? "✓ Copiado" : "📋 Copiar"}
              </span>
            </button>
          ))}
        </div>

        <div style={{ padding: "20px", borderRadius: "16px", backgroundColor: "rgba(250, 204, 21, 0.08)", border: "1px solid rgba(250, 204, 21, 0.25)", marginBottom: "25px" }}>
          <h3 style={{ fontSize: "15px", fontWeight: "bold", color: "#facc15", margin: 0, marginBottom: "10px" }}>📌 Cómo usar los códigos</h3>
          <ol style={{ color: "var(--text-muted)", fontSize: "13px", lineHeight: 1.8, margin: 0, paddingLeft: "20px" }}>
            <li>Descarga e instala <b>Xuper TV Premium</b> desde nuestra tienda.</li>
            <li>Abre la app y busca la opción <b>"Activar Premium"</b> o <b>"Canjear código"</b>.</li>
            <li>Pega uno de los códigos de arriba y activa.</li>
            <li>Si un código no funciona, prueba con otro. ¡Se agotan rápido!</li>
          </ol>
        </div>

        <a
          href="/apps/xuper"
          className="bounce-click"
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", width: "100%", padding: "18px", borderRadius: "14px", backgroundColor: "#facc15", color: "#0d0d12", fontWeight: "bold", fontSize: "15px", textDecoration: "none", textTransform: "uppercase", letterSpacing: "1px" }}
        >
          ⬇ Descargar Xuper TV
        </a>

        <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "12px", marginTop: "30px", fontFamily: "monospace" }}>
          SISTEMA_TERMINADO // HECHO CON 💛 DESDE TERMUX
        </p>
      </div>
    </div>
  );
}
