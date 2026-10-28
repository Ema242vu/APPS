"use client";

import { useState, useEffect, useRef } from "react";

const WAIT_SECONDS = 10;

/* ============================================================
   TÉCNICAS DE DETECCIÓN — múltiples métodos para que funcione
   en Brave, uBlock, AdGuard y otros bloqueadores modernos
   ============================================================ */

/**
 * Técnica 1: Elemento clásico con clases de anuncio
 * Brave/AdGuard ocultan elementos con selectores cosméticos
 * como `.adsbox`, `.ad-banner`, `[id^="ad-"]`, etc.
 */
function detectByElement(): Promise<boolean> {
  return new Promise((resolve) => {
    const testEl = document.createElement("div");
    testEl.className = "adsbox ad-banner ad-banner-slot pub_300x250 adsbygoogle";
    testEl.setAttribute("data-ad-client", "ca-pub-5959908767381687");
    testEl.setAttribute("id", "ad-container-test");
    testEl.style.position = "absolute";
    testEl.style.left = "-9999px";
    testEl.style.top = "-9999px";
    testEl.style.width = "300px";
    testEl.style.height = "250px";
    testEl.innerHTML = "&nbsp;";
    document.body.appendChild(testEl);

    // Usar MutationObserver para detectar si el bloqueador
    // elimina u oculta el elemento inmediatamente
    let detected = false;
    const observer = new MutationObserver(() => {
      const style = getComputedStyle(testEl);
      if (
        style.display === "none" ||
        style.visibility === "hidden" ||
        style.opacity === "0" ||
        testEl.offsetParent === null ||
        testEl.offsetHeight === 0 ||
        !document.body.contains(testEl)
      ) {
        detected = true;
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
        detected ||
        testEl.offsetHeight === 0 ||
        testEl.clientHeight === 0 ||
        testEl.offsetParent === null ||
        style.display === "none" ||
        style.visibility === "hidden" ||
        parseFloat(style.opacity) < 0.1 ||
        !document.body.contains(testEl);
      testEl.remove();
      resolve(isBlocked);
    }, 300);
  });
}

/**
 * Técnica 2: Fetch a un recurso típicamente bloqueado
 * Si el bloqueador intercepta la petición de red → detectado
 */
function detectByFetch(): Promise<boolean> {
  return new Promise((resolve) => {
    // URL que está en casi todas las listas de bloqueadores
    const testUrls = [
      "/ad/banner.js",
      "/ads.js",
      "/pagead/js/adsbygoogle.js",
    ];

    let detected = false;
    let completed = 0;

    const check = (blocked: boolean) => {
      completed++;
      if (blocked) {
        detected = true;
        resolve(true);
      } else if (completed >= testUrls.length) {
        resolve(detected);
      }
    };

    testUrls.forEach((url) => {
      fetch(url, { method: "HEAD" })
        .then((res) => {
          // Si la respuesta es 404 normal, no es bloqueo
          // Si falla con error de red o 0, probablemente es bloqueo
          check(res.status === 0 || res.type === "opaque");
        })
        .catch(() => {
          // Una petición rechazada puede ser bloqueo
          check(true);
        });
    });

    // Timeout de seguridad
    setTimeout(() => resolve(detected), 1500);
  });
}

/**
 * Técnica 3: Inyectar script con identificadores de anuncio
 * Algunos bloqueadores eliminan scripts con ciertos patrones
 */
function detectByScript(): Promise<boolean> {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.setAttribute("data-ad-client", "ca-pub-5959908767381687");
    script.setAttribute("data-ad-slot", "test");
    script.setAttribute("class", "adsbygoogle");
    script.innerHTML = "window.__adblockTest = true;";

    const parent = document.createElement("div");
    parent.className = "adsbygoogle ad-slot ad-unit";
    parent.appendChild(script);
    parent.style.position = "absolute";
    parent.style.left = "-9999px";
    document.body.appendChild(parent);

    setTimeout(() => {
      // Si el script fue bloqueado, __adblockTest no existirá
      const scriptBlocked =
        !document.body.contains(script) ||
        typeof (window as any).__adblockTest === "undefined";

      delete (window as any).__adblockTest;
      parent.remove();

      resolve(scriptBlocked);
    }, 300);
  });
}

/**
 * Técnica 4: Verificar si hay hooks de Brave Shields
 * Brave expone ciertas señales cuando Shields está activo
 */
function detectByBrave(): Promise<boolean> {
  return new Promise((resolve) => {
    // Brave detectable fingerprints
    const braveSignals = [
      typeof (navigator as any).brave !== "undefined",
      typeof (window as any).chrome !== "undefined" &&
        typeof (navigator as any).brave !== "undefined",
    ];

    if (braveSignals.some(Boolean)) {
      // Brave detectado, verificar si Shields bloquea ads
      // Crear iframe con contenido de anuncio
      const iframe = document.createElement("iframe");
      iframe.style.position = "absolute";
      iframe.style.left = "-9999px";
      iframe.style.width = "300px";
      iframe.style.height = "250px";
      iframe.srcdoc = `
        <div class="adsbygoogle ad-banner" data-ad-client="ca-pub-test" style="width:300px;height:250px;background:red;">AD</div>
        <script>try{document.querySelector('.adsbygoogle').style.display='block'}catch(e){}</script>
      `;
      document.body.appendChild(iframe);

      setTimeout(() => {
        try {
          const adEl = iframe.contentDocument?.querySelector(".adsbygoogle");
          const style = adEl
            ? getComputedStyle(adEl as Element)
            : null;
          const blocked =
            !adEl ||
            !style ||
            style.display === "none" ||
            style.visibility === "hidden" ||
            parseFloat(style.opacity) < 0.1;
          iframe.remove();
          resolve(blocked);
        } catch {
          // Si no podemos acceder al iframe, es sospechoso
          iframe.remove();
          resolve(true);
        }
      }, 500);
    } else {
      resolve(false);
    }
  });
}

/**
 * Técnica 5: Verificar bloqueo de recursos de AdSense
 * Usa un canvas o imagen para detectar si recursos externos se bloquean
 */
function detectByResource(): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    let blocked = false;

    img.onload = () => resolve(false);
    img.onerror = () => {
      blocked = true;
      resolve(true);
    };

    // URL de AdSense que está en listas de bloqueo
    img.src =
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5959908767381687&_=" +
      Date.now();

    setTimeout(() => {
      if (!blocked) {
        // Si no hubo error ni carga en 1.5s, puede ser bloqueado
        resolve(img.complete === false && img.naturalWidth === 0);
      }
    }, 1500);
  });
}

/**
 * Ejecuta todas las técnicas y devuelve true si ALGUNA detecta bloqueo.
 * Usa Promise.any para la primera respuesta positiva.
 */
async function detectAdBlockMultiMethod(): Promise<boolean> {
  const methods = [
    detectByElement(),
    detectByFetch(),
    detectByScript(),
    detectByBrave(),
    detectByResource(),
  ];

  // Si alguna técnica detecta bloqueo → true
  const results = await Promise.allSettled(
    methods.map((p) =>
      p.catch(() => false)
    )
  );

  return results.some(
    (r) => r.status === "fulfilled" && r.value === true
  );
}

/* ============================================================
   COMPONENTE
   ============================================================ */

export default function AdBlockBlocker() {
  const [showBlocker, setShowBlocker] = useState(false);
  const [countdown, setCountdown] = useState(WAIT_SECONDS);
  const [canContinue, setCanContinue] = useState(false);
  const [adblockActive, setAdblockActive] = useState(true);
  const [checking, setChecking] = useState(true);
  const intervalRef = useRef<any>(null);
  const countdownRef = useRef<any>(null);

  useEffect(() => {
    // Si ya pasó el bloqueo en esta sesión, no molestar
    const alreadyPassed = sessionStorage.getItem("adblockBlockerPassed");
    if (alreadyPassed === "yes") return;

    // Esperar a que cargue la página
    const initialTimer = setTimeout(async () => {
      setChecking(true);
      const detected = await detectAdBlockMultiMethod();
      setChecking(false);

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

    // Countdown
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

    // Re-verificar cada segundo si el usuario desactivó el bloqueador
    intervalRef.current = setInterval(async () => {
      const detected = await detectAdBlockMultiMethod();
      if (!detected) {
        setAdblockActive(false);
        setCanContinue(true);
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (countdownRef.current) clearInterval(countdownRef.current);
      }
    }, 1000);

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
          Hemos detectado que tienes un bloqueador de anuncios activo
          (Brave Shields, uBlock, AdGuard, etc.).
          Los anuncios nos ayudan a mantener la web gratis y a seguir subiendo apps premium.
        </p>

        {checking && (
          <p style={{ color: "#facc15", fontSize: "13px", marginBottom: "20px", fontStyle: "italic" }}>
            🔍 Verificando bloqueador...
          </p>
        )}

        {adblockActive && !canContinue && !checking && (
          <p style={{ color: "#facc15", fontSize: "13px", lineHeight: 1.6, marginBottom: "20px", fontStyle: "italic" }}>
            Desactiva tu bloqueador (Brave Shield 🛡️, uBlock, etc.) o espera el contador para continuar.
          </p>
        )}

        {!adblockActive && !checking && (
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
