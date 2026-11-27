"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadAccount } from "@/lib/accounts";
import { getRanking } from "@/lib/ranking";

export default function RankingPage() {
  const [acc, setAcc] = useState<ReturnType<typeof loadAccount> | null>(null);
  const [ranking, setRanking] = useState<Array<{ username: string; profilePhoto?: string; downloads: number; updatedAt: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setAcc(loadAccount());
    const load = async () => {
      setLoading(true);
      setRanking(await getRanking());
      setLoading(false);
    };
    load();
    const handle = () => {
      setAcc(loadAccount());
      load();
    };
    window.addEventListener("persons-account-change", handle);
    return () => window.removeEventListener("persons-account-change", handle);
  }, []);

  const myPos = acc ? ranking.findIndex((r) => r.username === acc.username) + 1 : null;

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "20px 16px 120px" }}>
      <Link
        href="/"
        className="bounce-click"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 18,
          padding: "8px 14px",
          borderRadius: 10,
          border: `1px solid rgba(255,255,255,0.12)`,
          color: "#facc15",
          textDecoration: "none",
          fontWeight: 600,
          fontSize: 14,
        }}
      >
        ← Volver a la tienda
      </Link>

      <h2 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 800 }}>🏆 Top descargas</h2>
      <p style={{ margin: "0 0 18px", fontSize: 13, color: "#9ca3af" }}>
        Ranking de quien más apps ha descargado (se guarda en este dispositivo).
      </p>

      {!acc ? (
        <div
          style={{
            padding: "18px",
            borderRadius: 16,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            textAlign: "center",
          }}
        >
          <p style={{ margin: "0 0 10px", fontSize: 14, color: "#9ca3af" }}>
            Inicia sesión en <strong>Cuenta</strong> para que tus descargas cuenten en el ranking.
          </p>
          <Link
            href="/cuenta"
            className="bounce-click"
            style={{
              display: "inline-block",
              marginTop: 10,
              padding: "10px 18px",
              borderRadius: 10,
              border: "none",
              background: "#facc15",
              color: "#000",
              fontWeight: 700,
              textDecoration: "none",
              fontSize: 15,
            }}
          >
            Ir a Cuenta
          </Link>
        </div>
      ) : (
        <>
          <div
            style={{
              marginBottom: 16,
              padding: 14,
              borderRadius: 14,
              background: "rgba(250,204,21,0.1)",
              border: `1px solid ${myPos === 1 ? "#facc15" : "rgba(250,204,21,0.3)"}`,
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                overflow: "hidden",
                border: `2px solid ${myPos === 1 ? "#facc15" : "rgba(255,255,255,0.12)"}`,
                background: "#0b0c10",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {acc.profilePhoto ? (
                <img src={acc.profilePhoto} alt="perfil" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <span style={{ fontSize: 28 }}>👤</span>
              )}
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 16 }}>{acc.username}</p>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "#9ca3af" }}>
                #{myPos} del ranking • {acc.downloads || 0} descarga{acc.downloads !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <h3 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 700, color: "#facc15" }}>
            📊 Top general
          </h3>
          {ranking.length === 0 ? (
            <p style={{ color: "#9ca3af", fontSize: 13 }}>Aún no hay descargas registradas.</p>
          ) : (
            <div style={{ borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
              {ranking.map((entry, i) => {
                const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`;
                const isMe = acc && entry.username === acc.username;
                return (
                  <div
                    key={entry.username}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "10px 14px",
                      borderBottom:
                        i < ranking.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                      background: isMe ? "rgba(250,204,21,0.08)" : "transparent",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 16,
                        fontWeight: 800,
                        minWidth: 26,
                        color:
                          i === 0 ? "#fbbf24" : i === 1 ? "#94a3b8" : i === 2 ? "#cd7466" : "#9ca3af",
                      }}
                    >
                      {medal}
                    </span>
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: "50%",
                        overflow: "hidden",
                        border: `2px solid ${isMe ? "#facc15" : "rgba(255,255,255,0.12)"}`,
                        background: "#0b0c10",
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {entry.profilePhoto ? (
                        <img
                          src={entry.profilePhoto}
                          alt="perfil"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        <span style={{ fontSize: 18 }}>👤</span>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          margin: 0,
                          fontWeight: 600,
                          fontSize: 14,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {entry.username}
                      </p>
                    </div>
                    <span
                      style={{
                        fontSize: 14,
                        color: "#9ca3af",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {`${entry.downloads} descarga${entry.downloads !== 1 ? "s" : ""}`}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
