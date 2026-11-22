"use client";

import type { JSX } from "react";
import { useState } from "react";
import { loadAccount, redeemCode } from "@/lib/accounts";
import { VALID_CODES } from "@/lib/valid-codes";

export default function CodeRedeem(): JSX.Element {
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const acc = loadAccount();
  if (!acc) return <div>Inicia sesión para canjear códigos.</div>;

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setMsg("");
    const r = redeemCode(acc, code, VALID_CODES);
    if (r.ok) {
      setMsg(r.msg);
    } else {
      setErr(r.msg);
    }
  };

  const already = acc.redeemedCodes.length > 0 ? acc.redeemedCodes.join(", ") : "—";

  return (
    <div
      style={{
        padding: "16px",
        borderRadius: "16px",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <h3 style={{ margin: "0 0 10px", fontSize: 16, fontWeight: 700 }}>🎟️ Canjear código diario</h3>
      <p style={{ margin: "0 0 14px", fontSize: 13, color: "#9ca3af" }}>
        Cada día el administrador entrega un código. Cánjelo aquí para obtener
        <b>30 minutos sin pasos</b> en las descargas.
      </p>
      <p style={{ margin: "0 0 14px", fontSize: 13, color: "#9ca3af" }}>
        Códigos usados en esta cuenta: <b>{already}</b>
      </p>
      <form onSubmit={handle} style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Código (ej. PERSONS-22-11)"
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "#0b0c10",
            color: "#fff",
            fontSize: 14,
            textTransform: "uppercase",
          }}
        />
        <button className="bounce-click" style={{ padding: "10px 18px", borderRadius: 10, border: "none", background: "#facc15", color: "#000", fontWeight: 700, cursor: "pointer" }}>
          Canjear
        </button>
      </form>
      {err && <p style={{ color: "#f87171", fontSize: 12, marginBottom: 8 }}>{err}</p>}
      {msg && <p style={{ color: "#34d399", fontSize: 12, marginBottom: 8 }}>{msg}</p>}
    </div>
  );
}
