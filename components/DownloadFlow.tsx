"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

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
   NATIVE BANNER (pasos 2 y 4)
   ============================================================ */
const NATIVE_BANNER = {
  scriptSrc: "https://bellnewyork.org/21/885a3a3a0173836d790936818ab5a034",
  containerId: "container-885a3a3a0173836d790936818ab5a034",
} as const;

/* ============================================================
   MONETAG GATE — SIEMPRE muestra el banner "Click Aquí"
   (key único por paso → instancia nueva → banner siempre)
   ============================================================ */
function MonetagGate({
  step,
  title,
  description,
  onContinue,
  downloadUrl,
  waitBeforeContinue,
  nativeBanner,
}: {
  step: number;
  title: string;
  description?: string;
  onContinue?: () => void;
  downloadUrl?: string;
  waitBeforeContinue?: number; // segundos a esperar tras el click
  nativeBanner?: { scriptSrc: string; containerId: string };
}) {
  const [passed, setPassed] = useState(false);
  const [justClicked, setJustClicked] = useState(false);
  const [timer, setTimer] = useState(0);

  // Al volver a la pestaña tras el click: iniciar espera o pasar directo
  useEffect(() => {
    const check = () => {
      if (justClicked && !document.hidden) {
        if (waitBeforeContinue && waitBeforeContinue > 0) {
          setTimer(waitBeforeContinue);
        } else {
          setPassed(true);
        }
      }
    };
    check();
    document.addEventListener("visibilitychange", check);
    window.addEventListener("focus", check);
    return () => {
      document.removeEventListener("visibilitychange", check);
      window.removeEventListener("focus", check);
    };
  }, [justClicked, waitBeforeContinue]);

  // Cuenta regresiva → habilitar continuar
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((t) => {
          if (t <= 1) {
            setPassed(true);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Inyectar script del native banner una sola vez
  useEffect(() => {
    if (nativeBanner && !document.getElementById(nativeBanner.containerId)) {
      const script = document.createElement("script");
      script.async = true;
      script.setAttribute("data-cfasync", "false");
      script.src = nativeBanner.scriptSrc;
      document.head.appendChild(script);
    }
  }, [nativeBanner]);

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
     YA PASÓ → mostrar Continuar / Descargar
     ============================================================ */
  if (passed) {
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
            onClick={onContinue}
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
     ESPERANDO TEMPORIZADOR → mostrar native banner + cuenta atrás
     ============================================================ */
  if (timer > 0) {
    return (
      <div style={{ padding: "16px", textAlign: "center" }}>
        <h2 style={{ fontSize: "17px", fontWeight: 700, margin: "0 0 12px 0", color: C.text }}>
          {title}
        </h2>
        {nativeBanner && <div id={nativeBanner.containerId}></div>}
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
   COMPONENTE PRINCIPAL — banner de monetag en los 6 pasos
   ============================================================ */
export default function DownloadFlow(props: Props) {
  const [step, setStep] = useState(1);

  const stepDescriptions: Record<number, string> = {
    1: "Verificando información de la aplicación...",
    2: "Verificación de seguridad en curso...",
    3: "Preparando tu archivo de descarga...",
    4: "Verificando compatibilidad del archivo...",
    5: "Generando enlace de descarga...",
    6: "¡Casi listo! Verificando enlace de descarga...",
  };

  // Pasos 2 y 4: espera de 15 segundos + native banner tras el click
  const waitSteps: Record<number, number> = {
    2: 15,
    4: 15,
  };

  // Pasos 1-6: cada paso muestra el banner de "Click Aquí"
  // El `key` único fuerza a React a montar una instancia nueva
  // por paso, así el banner siempre aparece en todos los pasos.
  return (
    <PageShell step={step} appName={props.appName} slug={props.slug}>
      {step <= 5 ? (
        <MonetagGate
          key={`gate-paso-${step}`}
          step={step}
          title={`Paso ${step}`}
          description={stepDescriptions[step]}
          onContinue={() => setStep(step + 1)}
          waitBeforeContinue={waitSteps[step]}
          nativeBanner={waitSteps[step] ? NATIVE_BANNER : undefined}
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

              {/* Banner de monetag en el paso 6 → Descargar */}
              <MonetagGate
                key="gate-paso-6"
                step={6}
                title="Paso 6"
                description={stepDescriptions[6]}
                downloadUrl={props.downloadUrl}
              />
            </>
          )}
        </>
      )}
    </PageShell>
  );
}
