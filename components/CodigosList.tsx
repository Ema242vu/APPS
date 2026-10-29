"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const MONETAG_URL = "https://omg10.com/4/11940275";

const codigos: {
  servicio: string;
  codigo: string;
  color: string;
  tipo: "downloader" | "activacion";
}[] = [
  { servicio: "Xuper TV NF Premium", codigo: "3435719", color: "#38bdf8", tipo: "downloader" },
  { servicio: "Xuper TV Premium", codigo: "5661797", color: "#22c55e", tipo: "downloader" },
  { servicio: "EasyPlay TV", codigo: "5464526", color: "#2dd4bf", tipo: "downloader" },
  { servicio: "Play TV", codigo: "3970698", color: "#60a5fa", tipo: "downloader" },
];

/* Banner Monetag obligatorio — aparece CADA vez que entras a /codigos */
function MonetagGateCodigos({ children }: { children: React.ReactNode }) {
  const [passed, setPassed] = useState(false);

  useEffect(() => {
    // NO usamos sessionStorage persistente — queremos que aparezca en CADA visita
    // Solo marcamos como passed si ya hizo click en ESTA sesión de página
  }, []);

  const handleClick = () => {
    setPassed(true);
    window.open(MONETAG_URL, "_blank");
  };

  if (passed) return <>{children}</>;

  return (
    <div style={{ backgroundColor: "#fffbeb", borderRadius: "16px", border: "2px solid #fde68a", padding: "22px", marginBottom: "18px", textAlign: "center" }}>
      <p style={{ fontSize: "14px", color: "#92400e", fontWeight: 700, margin: "0 0 6px 0" }}>📢 Para ver los códigos debes tocar:</p>
      <p style={{ fontSize: "12px", color: "#a16207", margin: "0 0 14px 0" }}>Es un paso rápido y necesario para continuar</p>
      <button
        onClick={handleClick}
        className="bounce-click"
        style={{
          width: "100%", padding: "14px 24px", borderRadius: "10px",
          backgroundColor: "#22c55e", color: "#ffffff", fontWeight: 700,
          fontSize: "16px", border: "none", cursor: "pointer",
          letterSpacing: "0.5px", textTransform: "uppercase",
          boxShadow: "0 4px 15px rgba(34, 197, 94, 0.35)",
        }}
      >
        👆 Click Aquí
      </button>
      <p style={{ fontSize: "11px", color: "#94a3b8", margin: "12px 0 0 0", lineHeight: 1.5 }}>Toca el botón, vuelve a esta pestaña y verás los códigos</p>
    </div>
  );
}

export default function CodigosList() {
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

        <MonetagGateCodigos>
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <div style={{ fontSize: "60px", marginBottom: "15px" }}>🔑</div>
            <h1 style={{ fontSize: "32px", fontWeight: 900, marginBottom: "10px" }}>Códigos Premium</h1>
            <p style={{ color: "var(--text-muted)", fontSize: "15px", lineHeight: 1.6 }}>
              Códigos exclusivos para activar servicios premium. Toca cualquier código para copiarlo.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "30px" }}>
            {codigos.map((item, i) => (
              <button
                key={i}
                onClick={() => copiar(item.codigo)}
                className="bounce-click"
                style={{
                  padding: "18px 20px",
                  borderRadius: "16px",
                  backgroundColor: copiado === item.codigo ? "rgba(34, 197, 94, 0.15)" : "var(--bg-card)",
                  border: copiado === item.codigo ? "1px solid #22c55e" : `1px solid ${item.color}55`,
                  color: "var(--text-primary)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "10px",
                  transition: "all 0.3s ease",
                }}
              >
                <div style={{ textAlign: "left", flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "11px", color: item.color, fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px", margin: 0, marginBottom: "4px" }}>
                    {item.servicio}
                  </p>
                  <p style={{ fontSize: "22px", fontWeight: "bold", letterSpacing: "3px", fontFamily: "monospace", margin: 0, color: copiado === item.codigo ? "#86efac" : "var(--text-primary)" }}>
                    {item.codigo}
                  </p>
                </div>
                <span style={{ fontSize: "14px", fontWeight: "normal", opacity: 0.8, whiteSpace: "nowrap" }}>
                  {copiado === item.codigo ? "✓ Copiado" : "📋"}
                </span>
              </button>
            ))}
          </div>

          {codigos.some((c) => c.tipo === "downloader") && (
            <div style={{ padding: "20px", borderRadius: "16px", backgroundColor: "rgba(56, 189, 248, 0.08)", border: "1px solid rgba(56, 189, 248, 0.3)", marginBottom: "15px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: "bold", color: "#38bdf8", margin: "0 0 10px 0" }}>📥 Códigos de Downloader (TV)</h3>
              <ol style={{ color: "var(--text-muted)", fontSize: "13px", lineHeight: 1.8, margin: 0, paddingLeft: "20px" }}>
                <li>Instala la app <b>Downloader</b> (AFTV) en tu TV, Firestick o teléfono.</li>
                <li>Abre Downloader y en el cuadro de dirección escribe solo el número (ej. <b>3435719</b>).</li>
                <li>Se cargará al instante el contenido del servicio vinculado al código.</li>
                <li>Si un código falla o está lleno, prueba el otro. ¡Se agotan rápido!</li>
              </ol>
            </div>
          )}

          {codigos.some((c) => c.tipo === "activacion") && (
            <div style={{ padding: "20px", borderRadius: "16px", backgroundColor: "rgba(250, 204, 21, 0.08)", border: "1px solid rgba(250, 204, 21, 0.25)", marginBottom: "25px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: "bold", color: "#facc15", margin: "0 0 10px 0" }}>🔑 Códigos de activación</h3>
              <ol style={{ color: "var(--text-muted)", fontSize: "13px", lineHeight: 1.8, margin: 0, paddingLeft: "20px" }}>
                <li>Descarga e instala la app correspondiente desde nuestra tienda.</li>
                <li>Abre la app y busca la opción <b>"Activar Premium"</b> o <b>"Canjear código"</b>.</li>
                <li>Pega el código y activa.</li>
              </ol>
            </div>
          )}

          <Link
            href="/"
            className="bounce-click"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", width: "100%", padding: "18px", borderRadius: "14px", backgroundColor: "#facc15", color: "#0d0d12", fontWeight: "bold", fontSize: "15px", textDecoration: "none", textTransform: "uppercase", letterSpacing: "1px" }}
          >
            ⬇ Ir a la tienda
          </Link>

          <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "12px", marginTop: "30px", fontFamily: "monospace" }}>
            SISTEMA_TERMINADO // HECHO CON 💛 DESDE TERMUX
          </p>
        </MonetagGateCodigos>
      </div>
    </div>
  );
}