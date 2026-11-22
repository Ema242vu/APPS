"use client";

import type { JSX } from "react";
import { useState } from "react";
import { loadAccount, createAccount, ensureAccount, saveAccount } from "@/lib/accounts";

export default function AuthForm({ onReady }: { onReady?: () => void }): JSX.Element {
  const [username, setUsername] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setMsg("");
    const existing = loadAccount();
    if (existing) {
      setMsg(`Sesión activa: ${existing.username}`);
      onReady?.();
      return;
    }
    if (!username.trim()) return setErr("Escribe un nombre de usuario.");
    createAccount(username.trim());
    setMsg("Cuenta creada. Ya estás dentro.");
    onReady?.();
  };

  const acc = loadAccount();
  if (acc) {
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
        <div style={{ fontSize: 28, marginBottom: 10 }}>👤</div>
        <p style={{ margin: "0 0 10px", fontWeight: 600 }}>Sesión iniciada</p>
        <p style={{ margin: "0 0 12px", fontSize: 13, color: "#9ca3af" }}>
          {acc.username} • Creada {new Date(acc.createdAt).toLocaleDateString("es-ES")}
        </p>
        <button
          onClick={() => {
            localStorage.removeItem("persons_account_v1");
            window.location.reload();
          }}
          className="bounce-click"
          style={{
            padding: "10px 16px",
            borderRadius: 10,
            border: "none",
            background: "#ef4444",
            color: "#fff",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Cerrar sesión
        </button>
      </div>
    );
  }

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
      <div style={{ fontSize: 28, marginBottom: 10 }}>🔐</div>
      <p style={{ margin: "0 0 12px", fontWeight: 600 }}>Iniciar o crear cuenta</p>
      <form onSubmit={handle}>
        <input
          autoFocus
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Tu nombre de usuario"
          style={{
            width: "100%",
            padding: "10px 14px",
            marginBottom: 10,
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "#0b0c10",
            color: "#fff",
            fontSize: 14,
          }}
        />
        {err && (
          <p style={{ color: "#f87171", fontSize: 12, margin: "0 0 10px" }}>{err}</p>
        )}
        {msg && <p style={{ color: "#34d399", fontSize: 12, margin: "0 0 10px" }}>{msg}</p>}
        <button
          className="bounce-click"
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: 10,
            border: "none",
            background: "#facc15",
            color: "#000",
            fontWeight: 700,
            cursor: "pointer",
            fontSize: 15,
          }}
        >
          Entrar / Crear cuenta
        </button>
      </form>
      <p style={{ marginTop: 10, fontSize: 12, color: "#6b7280" }}>
        La cuenta se guarda en este navegador (localStorage).
      </p>
    </div>
  );
}
