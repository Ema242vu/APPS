"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  loadAccount,
  saveAccount,
  isSkipActive,
  remainingSkipMinutes,
  grantSkip,
} from "@/lib/accounts";
import AuthForm from "@/components/AuthForm";
import ProfileEditor from "@/components/ProfileEditor";
import CodeRedeem from "@/components/CodeRedeem";
import StepRuleta from "@/components/StepRuleta";
import SkipBanner from "@/components/SkipBanner";

export default function CuentaPage() {
  const [tab, setTab] = useState<"perfil" | "codigos" | "ruleta">("perfil");
  const [acc, setAcc] = useState<ReturnType<typeof loadAccount> | null>(
    () => loadAccount() || null
  );

  useEffect(() => {
    const handle = () => setAcc(loadAccount());
    window.addEventListener("persons-account-change", handle);
    return () => window.removeEventListener("persons-account-change", handle);
  }, []);

  const active = isSkipActive(acc);
  const mins = active ? remainingSkipMinutes(acc!) : 0;

  const handleShortlinks = () => {
    if (!acc) return;
    const next = grantSkip(acc, 30);
    setAcc(next);
  };

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "20px 16px 120px" }}>
      <SkipBanner />

      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {[
          { key: "perfil", label: "Perfil" },
          { key: "codigos", label: "Códigos" },
          { key: "ruleta", label: "Ruleta" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as "perfil" | "codigos" | "ruleta")}
            className="bounce-click"
            style={{
              padding: "8px 14px",
              borderRadius: 10,
              border: `1px solid ${tab === t.key ? "#facc15" : "rgba(255,255,255,0.12)"}`,
              background: tab === t.key ? "#facc15" : "transparent",
              color: tab === t.key ? "#000" : "#fff",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "perfil" && (
        <>
          <h2 style={{ margin: "0 0 14px", fontSize: 18, fontWeight: 700 }}>
            👤 Tu cuenta
          </h2>
          {!acc ? (
            <AuthForm onReady={() => setAcc(loadAccount())} />
          ) : (
            <>
              <p style={{ margin: "0 0 14px", fontSize: 13, color: "#9ca3af" }}>
                {acc.username} • Creada{" "}
                {new Date(acc.createdAt).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p style={{ margin: "0 0 14px", fontSize: 13, color: "#9ca3af" }}>
                📥 Descargas: <b>{acc.downloads || 0}</b>
              </p>
              <ProfileEditor />
              {active && (
                <div
                  style={{
                    marginTop: 14,
                    padding: 12,
                    borderRadius: 10,
                    background: "rgba(34,197,94,0.1)",
                    border: "1px solid rgba(34,197,94,0.3)",
                    color: "#34d399",
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  ⚡ Acceso directo activo: te quedan{" "}
                  <b>{mins} min</b> sin pasos en las descargas.
                </div>
              )}
            </>
          )}
        </>
      )}

      {tab === "codigos" && (
        <>
          <h2 style={{ margin: "0 0 14px", fontSize: 18, fontWeight: 700 }}>
            🎟️ Códigos diarios
          </h2>
          <CodeRedeem />
          <div
            style={{
              marginTop: 16,
              padding: 14,
              borderRadius: 10,
              background: "rgba(250,204,21,0.08)",
              border: "1px solid rgba(250,204,21,0.2)",
            }}
          >
            <h3 style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 700 }}>
              🔗 Completaste 2 enlaces de ShortLinks
            </h3>
            <p style={{ margin: "0 0 10px", fontSize: 13, color: "#9ca3af" }}>
              Si ya abriste y completaste los 2 pasos de acortamiento, actívalo
              aquí para obtener{" "}
              <b>30 minutos sin pasos</b> en todas las descargas.
            </p>
            <button
              onClick={handleShortlinks}
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
              Activar 30 min sin pasos
            </button>
          </div>
        </>
      )}

      {tab === "ruleta" && (
        <>
          <h2 style={{ margin: "0 0 14px", fontSize: 18, fontWeight: 700 }}>
            🎰 Ruleta
          </h2>
          <StepRuleta />
        </>
      )}

      <div style={{ marginTop: 24, textAlign: "center" }}>
        <Link
          href="/"
          className="bounce-click"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "10px 16px",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.12)",
            color: "#facc15",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          ← Volver a la tienda
        </Link>
      </div>
    </div>
  );
}
