"use client";

import { useState, useEffect, useRef } from "react";

const WAIT_SECONDS = 20;

export default function AdBlockBlocker() {
  const [showBlocker, setShowBlocker] = useState(false);
  const [countdown, setCountdown] = useState(WAIT_SECONDS);
  const [canContinue, setCanContinue] = useState(false);
  const [adblockActive, setAdblockActive] = useState(true);
  const intervalRef = useRef<any>(null);
  const countdownRef = useRef<any>(null);

  useEffect(() => {
    // Si ya pasó el bloqueo en esta sesión, no molestar
    const alreadyPassed = sessionStorage.getItem("adblockBlockerPassed");
    if (alreadyPassed === "yes") return;

    // Dar 2 segundos para que cargue bien la página
    const initialTimer = setTimeout(() => {
      detectAdBlock();
    }, 2000);

    return () => {
      clearTimeout(initialTimer);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  useEffect(() => {
    if (!showBlocker) return;

    // Countdown de 20 segundos
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanContinue(true);
          if (countdownRef.current) clearInterval(countdownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Verificar cada 1s si el usuario desactivó el adblock
    intervalRef.current = setInterval(() => {
      checkAdBlockStatus();
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [showBlocker]);

  const detectAdBlock = () => {
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
        setAdblockActive(true);
        setShowBlocker(true);
      }
    }, 200);
  };

  const checkAdBlockStatus = () => {
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

      if (!isBlocked) {
        setAdblockActive(false);
        setCanContinue(true);
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (countdownRef.current) clearInterval(countdownRef.current);
      }
    }, 100);
  };

  const handleContinue = () => {
    if (!canContinue) return;
    sessionStorage.setItem("adblockBlockerPassed", "yes");
    setShowBlocker(false);
  };

  if (!showBlocker) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.95)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 99999,
        padding: "20px",
        backdropFilter: "blur(15px)",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "440px",
          width: "100%",
          padding: "35px 25px",
          borderRadius: "24px",
          backgroundColor: "#1a1a1f",
          border: "2px solid rgba(250, 204, 21, 0.4)",
          boxShadow: "0 20px 60px rgba(250, 204, 21, 0.2)",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "60px", marginBottom: "15px" }}>🚫</div>
        <h2 style={{ fontSize: "22px", fontWeight: "bold", color: "#ffffff", marginBottom: "12px" }}>
          Bloqueador detectado
        </h2>
        <p style={{ color: "#9ca3af", fontSize: "14px", lineHeight: 1.7, marginBottom: "20px" }}>
          Hemos detectado que tienes un bloqueador de anuncios activo.
          Los anuncios nos ayudan a mantener la web gratis y a seguir subiendo apps premium.
        </p>

        {adblockActive && !canContinue && (
          <p style={{ color: "#facc15", fontSize: "13px", lineHeight: 1.6, marginBottom: "20px", fontStyle: "italic" }}>
            Desactiva tu bloqueador o espera el contador para continuar.
          </p>
        )}

        {!adblockActive && (
          <p style={{ color: "#22c55e", fontSize: "14px", fontWeight: "bold", marginBottom: "20px" }}>
            ✅ ¡Gracias por apoyarnos!
          </p>
        )}

        <div
          style={{
            width: "90px",
            height: "90px",
            borderRadius: "50%",
            margin: "0 auto 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: canContinue ? "rgba(34, 197, 94, 0.15)" : "rgba(250, 204, 21, 0.1)",
            border: `3px solid ${canContinue ? "#22c55e" : "#facc15"}`,
            transition: "all 0.3s ease",
          }}
        >
          <span
            style={{
              fontSize: canContinue ? "40px" : "28px",
              fontWeight: "bold",
              color: canContinue ? "#22c55e" : "#facc15",
            }}
          >
            {canContinue ? "✓" : countdown}
          </span>
        </div>

        <button
          onClick={handleContinue}
          disabled={!canContinue}
          className={canContinue ? "bounce-click" : ""}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: "14px",
            backgroundColor: canContinue ? "#22c55e" : "rgba(107, 114, 128, 0.3)",
            color: canContinue ? "#ffffff" : "#6b7280",
            fontWeight: "bold",
            fontSize: "15px",
            border: "none",
            cursor: canContinue ? "pointer" : "not-allowed",
            textTransform: "uppercase",
            letterSpacing: "1px",
            transition: "all 0.3s ease",
            boxShadow: canContinue ? "0 6px 25px rgba(34, 197, 94, 0.4)" : "none",
          }}
        >
          {canContinue ? "✓ Continuar" : `Espera ${countdown}s...`}
        </button>

        <p style={{ color: "#4b5563", fontSize: "11px", marginTop: "15px", lineHeight: 1.5 }}>
          💛 Los anuncios son nuestra única fuente de ingresos. Gracias por entender.
        </p>
      </div>
    </div>
  );
}
