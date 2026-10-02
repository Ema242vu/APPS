"use client";

import { useState } from "react";

type AdModalProps = {
  isOpen: boolean;
  onClose: () => void;
  appName: string;
};

export default function AdModal({ isOpen, onClose, appName }: AdModalProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSupport = () => {
    setLoading(true);
    // Abre el enlace de Monetag en nueva pestaña
    window.open("https://omg10.com/4/11940275", "_blank");
    // Después de 8 segundos, cierra el modal
    setTimeout(() => {
      setLoading(false);
      onClose();
    }, 8000);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
        padding: "20px",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "400px",
          width: "100%",
          padding: "35px 25px",
          borderRadius: "24px",
          backgroundColor: "#1a1a1f",
          border: "1px solid rgba(236, 72, 153, 0.3)",
          boxShadow: "0 20px 60px rgba(236, 72, 153, 0.2)",
          textAlign: "center",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ fontSize: "50px", marginBottom: "15px" }}>❤️</div>
        <h2 style={{ fontSize: "22px", fontWeight: "bold", color: "#ffffff", marginBottom: "12px" }}>
          Apoya al creador
        </h2>
        <p style={{ color: "#9ca3af", fontSize: "14px", lineHeight: 1.6, marginBottom: "25px" }}>
          Para seguir subiendo apps premium gratis, mira un anuncio corto. 
          Solo toma unos segundos y nos ayudas un montón. 🐱
        </p>

        <button
          onClick={handleSupport}
          disabled={loading}
          className="bounce-click"
          style={{
            width: "100%",
            padding: "18px",
            borderRadius: "14px",
            backgroundColor: "#ec4899",
            color: "#ffffff",
            fontWeight: "bold",
            fontSize: "15px",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            textTransform: "uppercase",
            letterSpacing: "1px",
            marginBottom: "12px",
            opacity: loading ? 0.6 : 1,
            boxShadow: "0 0 25px rgba(236, 72, 153, 0.4)",
          }}
        >
          {loading ? "Espera unos segundos..." : "🎬 Ver anuncio y descargar"}
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

        <p style={{ color: "#4b5563", fontSize: "11px", marginTop: "15px", fontStyle: "italic" }}>
          ¿Ya viste el anuncio? Espera unos segundos y se abrirá la descarga de {appName}.
        </p>
      </div>
    </div>
  );
}
