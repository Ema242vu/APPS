"use client";

import { useState, useEffect } from "react";

type WaitModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  appName: string;
  appIcon: string;
  appEmoji: string;
  appSize: string;
  appVersion: string;
  appCategory: string;
};

export default function WaitModal({
  isOpen,
  onClose,
  onContinue,
  appName,
  appIcon,
  appEmoji,
  appSize,
  appVersion,
  appCategory,
}: WaitModalProps) {
  const [countdown, setCountdown] = useState(5);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(5);
      setReady(false);
      return;
    }
    setCountdown(5);
    setReady(false);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setReady(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const hasIcon = appIcon && appIcon !== "AQUI_VA_EL_LINK_DE_LA_IMAGEN";

  return (
    <div
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="waitmodal-title"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.9)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
        padding: "20px",
        backdropFilter: "blur(10px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "420px",
          width: "100%",
          padding: "35px 25px",
          borderRadius: "24px",
          backgroundColor: "#1a1a1f",
          border: "1px solid rgba(250, 204, 21, 0.3)",
          boxShadow: "0 20px 60px rgba(250, 204, 21, 0.15)",
          textAlign: "center",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "20px",
            overflow: "hidden",
            backgroundColor: "rgba(0,0,0,0.5)",
            border: "2px solid rgba(250, 204, 21, 0.3)",
            margin: "0 auto 15px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {hasIcon ? (
            <img src={appIcon} alt={appName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <span style={{ fontSize: "40px" }}>{appEmoji}</span>
          )}
        </div>

        <h2 id="waitmodal-title" style={{ fontSize: "20px", fontWeight: "bold", color: "#ffffff", marginBottom: "8px" }}>
          {appName}
        </h2>

        <p style={{ color: "#9ca3af", fontSize: "13px", marginBottom: "20px" }}>
          {appCategory} · v{appVersion} · {appSize}
        </p>

        <p style={{ color: "#facc15", fontSize: "14px", fontWeight: "bold", marginBottom: "20px" }}>
          {ready ? "¡Listo! Tu descarga está preparada." : `Espera ${countdown} segundo${countdown !== 1 ? "s" : ""}...`}
        </p>

        <div
          style={{
            width: "100%",
            height: "6px",
            borderRadius: "3px",
            backgroundColor: "rgba(255,255,255,0.1)",
            marginBottom: "25px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${((5 - countdown) / 5) * 100}%`,
              height: "100%",
              backgroundColor: "#facc15",
              borderRadius: "3px",
              transition: "width 1s linear",
            }}
          />
        </div>

        <button
          onClick={onContinue}
          disabled={!ready}
          className="bounce-click"
          style={{
            width: "100%",
            padding: "18px",
            borderRadius: "14px",
            backgroundColor: ready ? "#facc15" : "rgba(250, 204, 21, 0.2)",
            color: ready ? "#0d0d12" : "#6b7280",
            fontWeight: "bold",
            fontSize: "15px",
            border: "none",
            cursor: ready ? "pointer" : "not-allowed",
            textTransform: "uppercase",
            letterSpacing: "1px",
            marginBottom: "12px",
            transition: "all 0.3s ease",
          }}
        >
          {ready ? "⬇ Descargar ahora" : `Espera ${countdown}s...`}
        </button>

        <button
          onClick={onClose}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "12px",
            backgroundColor: "transparent",
            color: "#6b7280",
            border: "1px solid rgba(255,255,255,0.1)",
            cursor: "pointer",
            fontSize: "13px",
          }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
