"use client";

import { useState, useEffect, useRef } from "react";

const WAIT_SECONDS = 10;

/* ============================================================
   TÉCNICAS DE DETECCIÓN — conservadoras para evitar
   falsos positivos en Chrome/Firefox sin bloqueador
   ============================================================ */

/**
 * Técnica 1 (PRINCIPAL): Elemento con clases de anuncio + MutationObserver
 * Detecta si el bloqueador oculta o elimina el elemento.
 * Funciona en Brave Shields, uBlock, AdGuard.
 * NO da falsos positivos: sin bloqueador, el elemento permanece visible.
 */
function detectByElement(): Promise<boolean> {
  return new Promise((resolve) => {
    const testEl = document.createElement("div");
    testEl.className = "adsbox ad-banner pub_300x250 adsbygoogle";
    testEl.setAttribute("data-ad-client", "ca-pub-5959908767381687");
    testEl.style.position = "absolute";
    testEl.style.left = "-9999px";
    testEl.style.top = "-9999px";
    testEl.style.width = "300px";
    testEl.style.height = "250px";
    testEl.innerHTML = "&nbsp;";
    document.body.appendChild(testEl);

    let removedOrHidden = false;

    const observer = new MutationObserver(() => {
      const style = getComputedStyle(testEl);
      if (
        !document.body.contains(testEl) ||
        style.display === "none" ||
        style.visibility === "hidden" ||
        parseFloat(style.opacity) < 0.1
      ) {
        removedOrHidden = true;
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    setTimeout(() => {
      observer.disconnect();
      const style = getComputedStyle(testEl);
      const isBlocked =
        removedOrHidden ||
        testEl.offsetHeight === 0 ||
        testEl.offsetParent === null ||
        !document.body.contains(testEl) ||
        style.display === "none" ||
        style.visibility === "hidden" ||
        parseFloat(style.opacity) < 0.1;
      testEl.remove();
      resolve(isBlocked);
    }, 400);
  });
}

/**
 * Técnica 2: Segundo elemento con clases diferentes
 * Algunos bloqueadores solo filtran ciertas clases.
 */
function detectByElement2(): Promise<boolean> {
  return new Promise((resolve) => {
    const el = document.createElement("ins");
    el.className = "adsbygoogle";
    el.setAttribute("data-ad-client", "ca-pub-test");
    el.setAttribute("data-ad-slot", "123456");
    el.style.display = "inline-block";
    el.style.width = "300px";
    el.style.height = "250px";
    el.style.position = "absolute";
    el.style.left = "-9999px";
    document.body.appendChild(el);

    setTimeout(() => {
      const style = getComputedStyle(el);
      const isBlocked =
        el.offsetHeight === 0 ||
        el.offsetParent === null ||
        !document.body.contains(el) ||
        style.display === "none" ||
        style.visibility === "hidden";
      el.remove();
      resolve(isBlocked);
    }, 400);
  });
}

/**
 * Técnica 3: Solo se ejecuta si Brave está detectado.
 * Verifica si Brave Shields bloquea contenido.
 */
function detectByBrave(): Promise<boolean> {
  return new Promise((resolve) => {
    const isBrave =
      typeof (navigator as any).brave !== "undefined" ||
      typeof (window as any).chrome !== "undefined" &&
        typeof (navigator as any).brave !== "undefined";

    if (!isBrave) {
      resolve(false);
      return;
    }

    // Brave detectado: probar con elemento adicional
    const el = document.createElement("div");
    el.className = "adsbygoogle ad-banner";
    el.setAttribute("data-ad-client", "ca-pub-test");
    el.style.width = "300px";
    el.style.height = "250px";
    el.style.position = "absolute";
    el.style.left = "-9999px";
    document.body.appendChild(el);

    setTimeout(() => {
      const style = getComputedStyle(el);
      const blocked =
        el.offsetHeight === 0 ||
        el.offsetParent === null ||
        !document.body.contains(el) ||
        style.display === "none" ||
        parseFloat(style.opacity) < 0.1;
      el.remove();
      resolve(blocked);
    }, 400);
  });
}

/**
 * Detección principal: combina técnicas.
 * SOLO reporta bloqueo si al menos 2 técnicas coinciden
 * O si la técnica principal (detectByElement) detecta bloqueo.
 */
async function detectAdBlock(): Promise<boolean> {
  const [r1, r2, r3] = await Promise.all([
    detectByElement(),
    detectByElement2(),
    detectByBrave(),
  ]);

  // Si la técnica principal detecta → bloqueo confirmado
  if (r1) return true;

  // Si al menos 2 de 3 coinciden → bloqueo probable
  const count = [r1, r2, r3].filter(Boolean).length;
  return count >= 2;
}

/* ============================================================
   COMPONENTE
   ============================================================ */

export default function AdBlockBlocker() {
  const [showBlocker, setShowBlocker] = useState(false);
  const [countdown, setCountdown] = useState(WAIT_SECONDS);
  const [canContinue, setCanContinue] = useState(false);
  const [adblockActive, setAdblockActive] = useState(true);
  const intervalRef = useRef<any>(null);
  const countdownRef = useRef<any>(null);

  useEffect(() => {
    const alreadyPassed = sessionStorage.getItem("adblockBlockerPassed");
    if (alreadyPassed === "yes") return;

    const initialTimer = setTimeout(async () => {
      const detected = await detectAdBlock();
      if (detected) {
        setAdblockActive(true);
        setShowBlocker(true);
      }
    }, 2000);

    return () => {
      clearTimeout(initialTimer);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  useEffect(() => {
    if (!showBlocker) return;

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

    // Re-verificar si el usuario desactivó el bloqueador
    intervalRef.current = setInterval(async () => {
      const detected = await detectAdBlock();
      if (!detected) {
        setAdblockActive(false);
        setCanContinue(true);
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (countdownRef.current) clearInterval(countdownRef.current);
      }
    }, 1500);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [showBlocker]);

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
            Desactiva tu bloqueador (Brave Shield 🛡️, uBlock, etc.) o espera el contador.
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
