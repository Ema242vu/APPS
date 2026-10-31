"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const MONETAG_URL = "https://omg10.com/4/11940275";

const C = {
  bg: "#ffffff",
  card: "#f8fafc",
  border: "#e2e8f0",
  text: "#1e293b",
  muted: "#64748b",
  accent: "#facc15",
  green: "#22c55e",
  greenDark: "#16a34a",
  blue: "#3b82f6",
  purple: "#8b5cf6",
};

const NATIVE_BANNER_SCRIPT_SRC = "https://bellnewyork.org/21/885a3a3a0173836d790936818ab5a034";
const NATIVE_BANNER_CONTAINER_ID = "container-885a3a3a0173836d790936818ab5a034";

type Props = {
  slug: string;
  appName: string;
  appIcon: string;
  appEmoji: string;
  appVersion: string;
  appSize: string;
  appCategory: string;
  appDescription: string;
  appLongDescription: string;
  downloadUrl: string;
  romInfo?: {
    console?: string;
    emulator?: string;
    format?: string;
    instructions?: string;
  };
  hasPremiumSection?: boolean;
  premiumFeatures?: string[];
};

/* ============================================================
   MONETAG GATE — SIEMPRE muestra el banner "Click Aquí"
   Cada paso es una URL independiente (?step=N) con recarga
   completa de página, así el script del native banner se
   ejecuta de nuevo en cada paso y el banner aparece en TODOS.
   ============================================================ */
function MonetagGate({
  step,
  title,
  description,
  slug,
  downloadUrl,
}: {
  step: number;
  title: string;
  description?: string;
  slug: string;
  downloadUrl?: string;
}) {
  const [passed, setPassed] = useState(false);
  const [justClicked, setJustClicked] = useState(false);
  const [timer, setTimer] = useState(15);

  // Al volver a la pestaña tras el click: iniciar cuenta regresiva
  useEffect(() => {
    if (!justClicked) return;

    const check = () => {
      if (!document.hidden) {
        setPassed(true); // habilitar temporizador
      }
    };
    check();
    document.addEventListener("visibilitychange", check);
    window.addEventListener("focus", check);
    return () => {
      document.removeEventListener("visibilitychange", check);
      window.removeEventListener("focus", check);
    };
  }, [justClicked]);

  // Cuenta regresiva de 15s (se detiene sola al llegar a 0)
  useEffect(() => {
    if (!passed || timer <= 0) return;

    const timeout = setTimeout(() => setTimer((t) => t - 1), 1000);
    return () => clearTimeout(timeout);
  }, [passed, timer]);

  // Pasos 1-5: al terminar la cuenta, recargar en el siguiente paso.
  // Paso 6: no navegar; el render muestra el botón de descarga.
  useEffect(() => {
    if (!passed || timer > 0 || downloadUrl) return;
    window.location.href = `/dl/${slug}?step=${step + 1}`;
  }, [passed, timer, downloadUrl, step, slug]);

  // Inyectar script del native banner DESPUÉS de que el <div> exista.
  // Como cada paso recarga la página completa, esto se ejecuta en cada paso.
  useEffect(() => {
    if (!passed) return;

    // Crear el div contenedor si no existe
    if (!document.getElementById(NATIVE_BANNER_CONTAINER_ID)) {
      const div = document.createElement("div");
      div.id = NATIVE_BANNER_CONTAINER_ID;
      document.body.appendChild(div);
    }

    // Remover script previo para forzar recarga
    const existing = document.querySelector(`script[src*="${NATIVE_BANNER_SCRIPT_SRC}"]`);
    if (existing) {
      existing.remove();
    }

    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src = `${NATIVE_BANNER_SCRIPT_SRC}?t=${Date.now()}`;
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [passed]);

  const handleClick = () => {
    setJustClicked(true);
    window.open(MONETAG_URL, "_blank");
  };

  const handleDownload = () => {
    try {
      const key = `downloads-${downloadUrl}`;
      const count = parseInt(localStorage.getItem(key) || "0");
      localStorage.setItem(key, (count + 1).toString());
    } catch {}
  };

  /* ============================================================
     YA PASÓ LA CUENTA → mostrar Continuar / Descargar
     ============================================================ */
  if (passed && timer <= 0) {
    return (
      <div style={{ padding: "16px", textAlign: "center" }}>
        {downloadUrl ? (
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleDownload}
            className="bounce-click"
            style={{
              display: "block",
              width: "100%",
              padding: "20px 24px",
              borderRadius: "16px",
              backgroundColor: C.green,
              color: "#ffffff",
              fontWeight: 700,
              fontSize: "18px",
              border: "none",
              cursor: "pointer",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              textDecoration: "none",
              textAlign: "center",
              boxShadow: "0 8px 30px rgba(34, 197, 94, 0.45)",
            }}
          >
            ⬇ Descargar
          </a>
        ) : (
          <button
            onClick={() => {
              const nextStep = step + 1;
              window.location.href = `/dl/${slug}?step=${nextStep}`;
            }}
            className="bounce-click"
            style={{
              width: "100%",
              padding: "16px 24px",
              borderRadius: "12px",
              backgroundColor: C.green,
              color: "#ffffff",
              fontWeight: 700,
              fontSize: "16px",
              border: "none",
              cursor: "pointer",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              boxShadow: "0 6px 20px rgba(34, 197, 94, 0.4)",
            }}
          >
            ✓ Continuar
          </button>
        )}
      </div>
    );
  }

  /* ============================================================
     ESPERANDO CUENTA REGRESIVA → mostrar native banner + temporizador
     ============================================================ */
  if (passed && timer > 0) {
    return (
      <div style={{ padding: "16px", textAlign: "center" }}>
        <h2 style={{ fontSize: "17px", fontWeight: 700, margin: "0 0 12px 0", color: C.text }}>
          {title}
        </h2>
        <div id={NATIVE_BANNER_CONTAINER_ID}></div>
        <div style={{ backgroundColor: "#fffbeb", borderRadius: "16px", border: "2px solid #fde68a", padding: "22px", marginBottom: "18px", textAlign: "center" }}>
          <p style={{ fontSize: "14px", color: "#92400e", fontWeight: 700, margin: "0 0 8px 0" }}>⏳ Espera para continuar</p>
          <p style={{ fontSize: "20px", fontWeight: 800, color: "#1e293b", margin: "0 0 12px 0" }}>{timer}s</p>
          <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>Vuelve a esta pestaña y pulsa Continuar cuando termine</p>
        </div>
      </div>
    );
  }

  /* ============================================================
     PANTALLA INICIAL → banner "Click Aquí"
     ============================================================ */
  return (
    <div style={{ padding: "16px", textAlign: "center" }}>
      {/* Icono del paso */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px", justifyContent: "center", marginBottom: "18px" }}>
        <div style={{ width: "60px", height: "60px", borderRadius: "16px", backgroundColor: "#f1f5f9", border: "2px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ fontSize: "30px" }}>🎮</span>
        </div>
        <h2 style={{ fontSize: "17px", fontWeight: 700, margin: 0, color: C.text }}>{title}</h2>
      </div>

      {description && (
        <p style={{ fontSize: "13px", color: C.muted, margin: "0 0 16px 0", lineHeight: 1.6 }}>{description}</p>
      )}

      {/* Banner de monetag — APARECE SIEMPRE EN CADA PASO */}
      <div style={{ backgroundColor: "#fffbeb", borderRadius: "16px", border: "2px solid #fde68a", padding: "22px", marginBottom: "18px", textAlign: "center" }}>
        <p style={{ fontSize: "14px", color: "#92400e", fontWeight: 700, margin: "0 0 6px 0" }}>📢 Para seguir debes tocar:</p>
        <p style={{ fontSize: "12px", color: "#a16207", margin: "0 0 14px 0" }}>Es un paso rápido y necesario para continuar</p>
        <button
          onClick={handleClick}
          className="bounce-click"
          style={{
            width: "100%", padding: "14px 24px", borderRadius: "10px",
            backgroundColor: C.green, color: "#ffffff", fontWeight: 700,
            fontSize: "16px", border: "none", cursor: "pointer",
            letterSpacing: "0.5px", textTransform: "uppercase",
            boxShadow: "0 4px 15px rgba(34, 197, 94, 0.35)",
          }}
        >
          👆 Click Aquí
        </button>
        <p style={{ fontSize: "11px", color: "#64748b", margin: "12px 0 0 0", lineHeight: 1.5 }}>Toca el botón, vuelve a esta pestaña y podrás continuar</p>
      </div>

      {/* Indicador scroll */}
      <div style={{ textAlign: "center", padding: "20px 0 8px" }}>
        <span style={{ color: "#64748b", fontSize: "11px", fontWeight: 600 }}>👇 Desliza hacia abajo</span>
      </div>
    </div>
  );
}

/* ============================================================
   PAGE SHELL — fondo blanco
   ============================================================ */
function PageShell({ children, step, appName, slug }: { children: React.ReactNode; step: number; appName: string; slug: string }) {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: C.bg, color: C.text, fontFamily: "Inter, system-ui, sans-serif" }}>
      <div style={{ maxWidth: "520px", margin: "0 auto", padding: "16px 14px 140px" }}>
        <div style={{ textAlign: "center", paddingTop: "8px", marginBottom: "18px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: C.accent, color: "#000", fontSize: "11px", fontWeight: 700, padding: "4px 14px", borderRadius: "20px", marginBottom: "10px" }}>
            PASO {step} DE 6
          </div>
          <h1 style={{ fontSize: "20px", fontWeight: 800, margin: 0, color: C.text }}>{appName}</h1>
          <p style={{ fontSize: "12px", color: "#64748b", margin: "4px 0 0 0" }}>PERSONS-COMUNITY — Descarga verificada y segura</p>
        </div>

        {/* Barra de progreso 6 pasos */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "20px" }}>
          {[1, 2, 3, 4, 5, 6].map((s) => (
            <div key={s} style={{ flex: 1, height: "5px", borderRadius: "3px", backgroundColor: s <= step ? C.green : "#e2e8f0" }} />
          ))}
        </div>

        {/* Contenido del paso */}
        {children}

        {/* Volver */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Link href={`/apps/${slug}`} style={{ fontSize: "13px", color: "#64748b", textDecoration: "none", fontWeight: 600 }}>
            ← Volver a la tienda
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   COMPONENTE PRINCIPAL — cada paso es una URL independiente
   ============================================================ */
export default function DownloadFlow(props: Props) {
  const searchParams = useSearchParams();
  const stepFromUrl = parseInt(searchParams.get("step") || "1", 10);
  const step = stepFromUrl >= 1 && stepFromUrl <= 6 ? stepFromUrl : 1;

  const stepDescriptions: Record<number, string> = {
    1: "Verificando información de la aplicación...",
    2: "Verificación de seguridad en curso...",
    3: "Preparando tu archivo de descarga...",
    4: "Verificando compatibilidad del archivo...",
    5: "Generando enlace de descarga...",
    6: "¡Casi listo! Verificando enlace de descarga...",
  };

  return (
    <PageShell step={step} appName={props.appName} slug={props.slug}>
      {step <= 5 ? (
        <MonetagGate
          step={step}
          title={`Paso ${step}`}
          description={stepDescriptions[step]}
          slug={props.slug}
        />
      ) : (
        <>
          {!props.downloadUrl ? (
            <div style={{ padding: "16px", textAlign: "center" }}>
              <div style={{ backgroundColor: C.card, borderRadius: "16px", border: `1px solid ${C.border}`, padding: "24px", marginBottom: "18px" }}>
                <p style={{ fontSize: "15px", color: C.text, fontWeight: 700, margin: 0 }}>Sin enlace de descarga disponible</p>
              </div>
            </div>
          ) : (
            <>
              {/* Info de seguridad */}
              <div style={{ backgroundColor: "#f0fdf4", borderRadius: "14px", border: "1px solid #bbf7d0", padding: "16px", textAlign: "center", marginBottom: "16px" }}>
                <p style={{ fontSize: "13px", color: "#15803d", fontWeight: 700, margin: "0 0 6px 0" }}>🛡️ Archivo Verificado</p>
                <p style={{ fontSize: "12px", color: C.muted, margin: 0, lineHeight: 1.5 }}>Escaneado con 68 motores antivirus — 0 amenazas detectadas</p>
              </div>

              {/* Paso 6: banner de "Click Aquí" → Descargar (con native banner y 15s) */}
              <MonetagGate
                step={6}
                title="Paso 6"
                description={stepDescriptions[6]}
                slug={props.slug}
                downloadUrl={props.downloadUrl}
              />
            </>
          )}
        </>
      )}
    </PageShell>
  );
}
