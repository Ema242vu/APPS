"use client";

import type { JSX } from "react";
import { useState, useEffect } from "react";
import { loadAccount, spinRuleta } from "@/lib/accounts";

const SEGMENTS = [
  { label: "30 min", color: "#22c55e", prize: true },
  { label: "Sigue intentando", color: "#e5e7eb", prize: false },
  { label: "Sigue intentando", color: "#e5e7eb", prize: false },
  { label: "Sigue intentando", color: "#e5e7eb", prize: false },
  { label: "Sigue intentando", color: "#e5e7eb", prize: false },
  { label: "Sigue intentando", color: "#e5e7eb", prize: false },
  { label: "Sigue intentando", color: "#e5e7eb", prize: false },
  { label: "Sigue intentando", color: "#e5e7eb", prize: false },
  { label: "15 min", color: "#3b82f6", prize: true },
  { label: "Sigue intentando", color: "#e5e7eb", prize: false },
];

export default function StepRuleta(): JSX.Element {
  const [acc, setAcc] = useState<ReturnType<typeof loadAccount> | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<{ label: string; minutes: number; won: boolean } | null>(null);

  useEffect(() => {
    setAcc(loadAccount());
  }, []);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);

    // Determinar resultado por probabilidad (20% de premio)
    const r = Math.random();
    let prize: { label: string; minutes: number };
    if (r < 0.10) prize = { label: "30 min", minutes: 30 };
    else if (r < 0.20) prize = { label: "15 min", minutes: 15 };
    else prize = { label: "Sigue intentando", minutes: 0 };

    // Girar la ruleta: varios giros completos + posición final del segmento ganador
    const prizeIndex = SEGMENTS.findIndex((s) => s.label === prize.label && s.prize === prize.minutes > 0);
    const segmentDeg = 360 / SEGMENTS.length;
    // El puntero está arriba (0°). Queremos que el segmento ganador quede arriba.
    const targetDeg = (prizeIndex * segmentDeg + segmentDeg / 2) % 360;
    const rotateTo = (360 - targetDeg) + 360 * 5; // 5 vueltas completas

    const style = document.documentElement.style;
    style.setProperty("--ruleta-rotate", `${rotateTo}deg`);

    setTimeout(() => {
      const next = spinRuleta(acc!);
      setAcc(next.account);
      setResult({ label: next.label, minutes: next.minutes, won: next.won });
      setSpinning(false);
    }, 4200);
  };

  if (!acc) return <div>Cargando cuenta...</div>;

  const active = acc?.skipUntil && Date.now() < acc.skipUntil;
  const mins = active ? Math.ceil((acc!.skipUntil! - Date.now()) / 60000) : 0;

  return (
    <div
      style={{
        padding: "16px",
        borderRadius: "16px",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        textAlign: "center",
      }}
    >
      <h3 style={{ margin: "0 0 10px", fontSize: 16, fontWeight: 700 }}>🎰 Ruleta de recompensas</h3>
      <p style={{ margin: "0 0 14px", fontSize: 13, color: "#9ca3af" }}>
        Gira la ruleta. Probabilidad de premio: <b>20 %</b> (30 min o 15 min sin pasos).
      </p>

      <div style={{ position: "relative", width: 260, height: 260, margin: "0 auto 14px" }}>
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            background: "conic-gradient(from 0deg, " +
              SEGMENTS.map((s, i) => `${s.color} ${i * 36}deg ${(i + 1) * 36}deg`).join(",") +
              ")",
            transition: "transform 4s cubic-bezier(0.25, 1, 0.5, 1)",
            transform: `rotate(var(--ruleta-rotate, 0deg))`,
          }}
        />
        {/* Puntero */}
        <div
          style={{
            position: "absolute",
            top: -14,
            left: "50%",
            transform: "translateX(-50%)",
            width: 0,
            height: 0,
            borderLeft: "14px solid transparent",
            borderRight: "14px solid transparent",
            borderBottom: "22px solid #facc15",
            zIndex: 10,
          }}
        />
        {/* Centro */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 46,
            height: 46,
            borderRadius: "50%",
            background: "#0b0c10",
            border: "3px solid #facc15",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: 13,
            color: "#000",
            zIndex: 5,
          }}
        >
          ✨
        </div>
      </div>

      {active && (
        <div style={{ marginBottom: 10, color: "#34d399", fontWeight: 700 }}>
          ⚡ Tienes {mins} min sin pasos (de la ruleta)
        </div>
      )}

      {result && (
        <div style={{ marginBottom: 12, padding: "10px", borderRadius: 10, background: result.won ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)", color: result.won ? "#34d399" : "#f87171", fontWeight: 700 }}>
          {result.label}
        </div>
      )}

      <button
        onClick={spin}
        disabled={spinning}
        className="bounce-click"
        style={{
          padding: "12px 22px",
          borderRadius: 10,
          border: "none",
          background: spinning ? "#9ca3af" : "#facc15",
          color: "#000",
          fontWeight: 700,
          cursor: spinning ? "not-allowed" : "pointer",
          fontSize: 15,
          opacity: spinning ? 0.6 : 1,
        }}
      >
        {spinning ? "Girando..." : "Girar ruleta"}
      </button>
      <p style={{ marginTop: 8, fontSize: 12, color: "#6b7280" }}>
        Un giro por sesión. Los premios se suman a tu tiempo sin pasos.
      </p>
    </div>
  );
}
