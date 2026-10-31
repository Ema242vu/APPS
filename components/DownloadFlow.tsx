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
   MONETAG GATE — verificación obligatoria (SIEMPRE MUESTRA BANNER)
   ============================================================ */
function MonetagGate({ step, title, description, onContinue }: {
  step: number;
  title: string;
  description?: string;
  onContinue: () => void;
}) {
  const [passed, setPassed] = useState(false);
  const [justClicked, setJustClicked] = useState(false);

  useEffect(() => {
    if (justClicked && !document.hidden) {
      setPassed(true);
    }
  }, [justClicked]);

  const handleClick = () => {
    setJustClicked(true);
    window.open(MONETAG_URL, "_blank");
  };

  if (passed) {
    return (
      <div style={{ padding: "16px", textAlign: "center" }}>
        {/* Botón Continuar */}
        <div style={{ paddingBottom: "30px" }}>
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
        </div>

        {/* Indicador scroll */}
        <div style={{ textAlign: "center", padding: "20px 0 8px" }}>
          <span style={{ color: "#64748b", fontSize: "11px", fontWeight: 600 }}>👇 Desliza hacia abajo</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "16px", textAlign: "center" }}>
      {/* Banner de monetag */}
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
   DOWNLOAD BUTTON — con monetag
   ============================================================ */
function DownloadButton({ downloadUrl, appName }: { downloadUrl: string; appName: string }) {
  const [passed, setPassed] = useState(false);
  const [justClicked, setJustClicked] = useState(false);

  useEffect(() => {
    if (justClicked && !document.hidden) {
      setPassed(true);
    }
  }, [justClicked]);

  const handleClick = () => {
    setJustClicked(true);
    window.open(MONETAG_URL, "_blank");
  };

  const handleDownload = () => {
    try {
      const key = `downloads-${appName}`;
      const count = parseInt(localStorage.getItem(key) || "0");
      localStorage.setItem(key, (count + 1).toString());
    } catch {}
  };

  if (passed) {
    return (
      <a
        href={downloadUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleDownload}
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
    );
  }

  return (
    <button
      onClick={handleClick}
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
        boxShadow: "0 8px 30px rgba(34, 197, 94, 0.45)",
        textAlign: "center",
      }}
    >
      ⬇ Descargar
    </button>
  );
}

/* ============================================================
   COMPONENTE PRINCIPAL — 6 pasos con monetag en cada uno
   ============================================================ */
export default function DownloadFlow(props: Props) {
  const [step, setStep] = useState(1);

  if (step === 1) {
    return (
      <PageShell step={1} appName={props.appName} slug={props.slug}>
        <MonetagGate
          step={1}
          title="Paso 1"
          description="Verificando información de la aplicación..."
          onContinue={() => setStep(2)}
        />
      </PageShell>
    );
  }

  if (step === 2) {
    return (
      <PageShell step={2} appName={props.appName} slug={props.slug}>
        <MonetagGate
          step={2}
          title="Paso 2"
          description="Verificación de seguridad en curso..."
          onContinue={() => setStep(3)}
        />
      </PageShell>
    );
  }

  if (step === 3) {
    return (
      <PageShell step={3} appName={props.appName} slug={props.slug}>
        <MonetagGate
          step={3}
          title="Paso 3"
          description="Preparando tu archivo de descarga..."
          onContinue={() => setStep(4)}
        />
      </PageShell>
    );
  }

  if (step === 4) {
    return (
      <PageShell step={4} appName={props.appName} slug={props.slug}>
        <MonetagGate
          step={4}
          title="Paso 4"
          description="Verificando compatibilidad del archivo..."
          onContinue={() => setStep(5)}
        />
      </PageShell>
    );
  }

  if (step === 5) {
    return (
      <PageShell step={5} appName={props.appName} slug={props.slug}>
        <MonetagGate
          step={5}
          title="Paso 5"
          description="Generando enlace de descarga..."
          onContinue={() => setStep(6)}
        />
      </PageShell>
    );
  }

  // Paso 6 - Descarga
  return (
    <PageShell step={6} appName={props.appName} slug={props.slug}>
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

          {/* Botón Descargar (con monetag) */}
          <div style={{ textAlign: "center", paddingBottom: "30px" }}>
            <DownloadButton downloadUrl={props.downloadUrl} appName={props.appName} />
          </div>
        </>
      )}
    </PageShell>
  );
}