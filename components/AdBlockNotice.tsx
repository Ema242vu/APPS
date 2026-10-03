"use client";

import { useState, useEffect } from "react";

export default function AdBlockNotice() {
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    // Si el usuario ya decidió continuar antes, no volver a mostrarlo por 7 días
    const skipped = localStorage.getItem("adblockSkipped");
    if (skipped) {
      const skipTime = parseInt(skipped);
      const now = Date.now();
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      if (now - skipTime < sevenDays) return;
    }

    // Detectar bloqueador de anuncios
    const detectAdBlock = () => {
      // Creamos un elemento con clase típica de anuncios
      const testAd = document.createElement("div");
      testAd.className = "adsbox ad-banner pub_300x250";
      testAd.style.position = "absolute";
      testAd.style.left = "-9999px";
      testAd.style.height = "10px";
      testAd.style.width = "10px";
      testAd.innerHTML = "&nbsp;";
      document.body.appendChild(testAd);

      setTimeout(() => {
        const isBlocked =
          testAd.offsetHeight === 0 ||
          testAd.offsetParent === null ||
          testAd.clientHeight === 0 ||
          getComputedStyle(testAd).display === "none" ||
          getComputedStyle(testAd).visibility === "hidden";

        testAd.remove();

        if (isBlocked) {
          setShowNotice(true);
        }
      }, 150);
    };

    // Esperar a que cargue la página
    setTimeout(detectAdBlock, 1500);
  }, []);

  const handleContinue = () => {
    localStorage.setItem("adblockSkipped", Date.now().toString());
    setShowNotice(false);
  };

  if (!showNotice) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        left: "20px",
        right: "20px",
        maxWidth: "420px",
        margin: "0 auto",
        padding: "20px",
        borderRadius: "18px",
        backgroundColor: "rgba(20, 20, 25, 0.98)",
        border: "1px solid rgba(250, 204, 21, 0.4)",
        boxShadow: "0 15px 45px rgba(0, 0, 0, 0.6)",
        zIndex: 9999,
        fontFamily: "system-ui, sans-serif",
        backdropFilter: "blur(12px)",
        animation: "slideUp 0.4s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "15px" }}>
        <span style={{ fontSize: "32px" }}>🐱</span>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: "15px", fontWeight: "bold", color: "#ffffff", marginBottom: "6px" }}>
            Oye, vemos que tienes un bloqueador activo
          </h3>
          <p style={{ fontSize: "12px", color: "#9ca3af", lineHeight: 1.5, margin: 0 }}>
            Los anuncios nos ayudan a mantener la web gratis y a seguir subiendo apps premium. 
            ¿Nos apoyas desactivándolo? Solo toma 5 segundos. 💛
          </p>
        </div>
        <button
          onClick={handleContinue}
          style={{
            background: "transparent",
            border: "none",
            color: "#6b7280",
            fontSize: "16px",
            cursor: "pointer",
            padding: "0 4px",
            lineHeight: 1,
          }}
          aria-label="Cerrar"
        >
          ✕
        </button>
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={handleContinue}
          className="bounce-click"
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "12px",
            backgroundColor: "transparent",
            color: "#9ca3af",
            border: "1px solid rgba(255,255,255,0.15)",
            fontSize: "12px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Continuar así
        </button>
        <button
          onClick={() => setShowNotice(false)}
          className="bounce-click"
          style={{
            flex: 1.2,
            padding: "12px",
            borderRadius: "12px",
            backgroundColor: "#facc15",
            color: "#0d0d12",
            border: "none",
            fontSize: "12px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          💛 Apoyar al creador
        </button>
      </div>
    </div>
  );
}
