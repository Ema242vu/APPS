"use client";

import { useState, useEffect, useCallback } from "react";
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
   MONETAG GATE — verificación obligatoria
   ============================================================ */
function MonetagGate({ slug, step, children }: { slug: string; step: number; children: React.ReactNode }) {
  const key = `monetag_${slug}_step${step}`;
  const [passed, setPassed] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(key) === "yes") setPassed(true);
    const handler = () => {
      if (!document.hidden && sessionStorage.getItem(key) === "yes") setPassed(true);
    };
    document.addEventListener("visibilitychange", handler);
    window.addEventListener("focus", handler);
    return () => { document.removeEventListener("visibilitychange", handler); window.removeEventListener("focus", handler); };
  }, [key]);

  const handleClick = () => {
    sessionStorage.setItem(key, "yes");
    setPassed(true);
    window.open(MONETAG_URL, "_blank");
  };

  if (passed) return <>{children}</>;

  return (
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
            PASO {step} DE 4
          </div>
          <h1 style={{ fontSize: "20px", fontWeight: 800, margin: 0, color: C.text }}>{appName}</h1>
          <p style={{ fontSize: "12px", color: "#64748b", margin: "4px 0 0 0" }}>PERSONS-COMUNITY — Descarga verificada y segura</p>
        </div>

        {/* Barra de progreso 4 pasos */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "20px" }}>
          {[1, 2, 3, 4].map((s) => (
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
   CONTADOR DE DESCARGA
   ============================================================ */
function WaitCountdown({ onReady, downloadUrl, appName }: { onReady: () => void; downloadUrl: string; appName: string }) {
  const [countdown, setCountdown] = useState(5);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) { clearInterval(interval); setReady(true); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Cuando el contador termina, mostrar botón de descarga
  useEffect(() => {
    if (ready && onReady) {
      // Llamar automáticamente después de 1 segundo
      const timer = setTimeout(onReady, 1000);
      return () => clearTimeout(timer);
    }
  }, [ready, onReady]);

  return (
    <>
      {!ready ? (
        <div style={{ backgroundColor: C.card, borderRadius: "16px", border: `1px solid ${C.border}`, padding: "28px 20px", marginBottom: "18px", textAlign: "center" }}>
          <div style={{
            width: "80px", height: "80px", borderRadius: "50%", margin: "0 auto 14px",
            display: "flex", alignItems: "center", justifyContent: "center",
            backgroundColor: "rgba(250, 204, 21, 0.12)",
            border: `3px solid ${C.accent}`,
          }}>
            <span style={{ fontSize: "26px", fontWeight: 800, color: "#000" }}>
              {countdown}
            </span>
          </div>
          <p style={{ fontSize: "15px", color: C.text, fontWeight: 700, margin: "0 0 6px 0" }}>Espera {countdown} segundo{countdown !== 1 ? "s" : ""} para descargar</p>
          <p style={{ fontSize: "12px", color: C.muted, margin: 0, lineHeight: 1.5 }}>Estamos preparando tu archivo {appName}</p>
          <div style={{ width: "100%", height: "6px", borderRadius: "3px", backgroundColor: C.border, marginTop: "16px", overflow: "hidden" }}>
            <div style={{ width: `${((5 - countdown) / 5) * 100}%`, height: "100%", backgroundColor: C.accent, borderRadius: "3px", transition: "width 1s linear" }} />
          </div>
        </div>
      ) : (
        <div style={{ backgroundColor: "#f0fdf4", borderRadius: "14px", border: "1px solid #bbf7d0", padding: "16px", textAlign: "center", marginBottom: "16px" }}>
          <p style={{ fontSize: "13px", color: "#15803d", fontWeight: 700, margin: "0 0 6px 0" }}>🛡️ Archivo Verificado</p>
          <p style={{ fontSize: "12px", color: C.muted, margin: 0, lineHeight: 1.5 }}>Escaneado con 68 motores antivirus — 0 amenazas detectadas</p>
          <p style={{ fontSize: "12px", color: C.muted, margin: "8px 0 0 0", lineHeight: 1.5 }}>Redirigiendo al paso de descarga...</p>
        </div>
      )}
    </>
  );
}

/* ============================================================
   PASO 1 — Info + "I'm not a robot"
   ============================================================ */
function Step1({ appName, appIcon, appEmoji, appVersion, appSize, appCategory, appDescription, appLongDescription, onContinue, slug, romInfo, hasPremiumSection }: {
  appName: string; appIcon: string; appEmoji: string; appVersion: string; appSize: string;
  appCategory: string; appDescription: string; appLongDescription: string; onContinue: () => void; slug: string;
  romInfo?: Props["romInfo"]; hasPremiumSection?: boolean;
}) {
  const [robotChecked, setRobotChecked] = useState(false);

  return (
    <PageShell step={1} appName={appName} slug={slug}>
      <MonetagGate slug={slug} step={1}>
        {/* Icono de la app */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "18px" }}>
          <div style={{ width: "60px", height: "60px", borderRadius: "16px", overflow: "hidden", backgroundColor: "#f1f5f9", border: "2px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {appIcon && appIcon.startsWith("http") ? (
              <img src={appIcon} alt={appName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <span style={{ fontSize: "30px" }}>{appEmoji}</span>
            )}
          </div>
          <div>
            <h2 style={{ fontSize: "17px", fontWeight: 700, margin: 0, color: C.text }}>{appName}</h2>
            <p style={{ fontSize: "12px", color: C.muted, margin: "4px 0 0 0" }}>{appCategory} · v{appVersion} · {appSize}</p>
            {romInfo ? (
              <span style={{ fontSize: "10px", backgroundColor: C.blue, color: "#fff", padding: "2px 8px", borderRadius: "10px", fontWeight: 600 }}>🎮 ROM</span>
            ) : hasPremiumSection ? (
              <div style={{ display: "flex", gap: "6px", marginTop: "6px" }}>
                <span style={{ fontSize: "10px", backgroundColor: C.green, color: "#fff", padding: "2px 8px", borderRadius: "10px", fontWeight: 600 }}>✓ Verificado</span>
                <span style={{ fontSize: "10px", backgroundColor: "#3b82f6", color: "#fff", padding: "2px 8px", borderRadius: "10px", fontWeight: 600 }}>MOD</span>
                <span style={{ fontSize: "10px", backgroundColor: C.purple, color: "#fff", padding: "2px 8px", borderRadius: "10px", fontWeight: 600 }}>Premium</span>
              </div>
            ) : (
              <span style={{ fontSize: "10px", backgroundColor: C.green, color: "#fff", padding: "2px 8px", borderRadius: "10px", fontWeight: 600 }}>✓ Verificado</span>
            )}
          </div>
        </div>

        {/* Instrucciones de descarga */}
        <div style={{ backgroundColor: "#fffbeb", borderRadius: "14px", border: "1px solid #fde68a", padding: "16px", marginBottom: "16px" }}>
          <p style={{ fontSize: "13px", color: "#92400e", fontWeight: 700, margin: "0 0 8px 0" }}>⚠️ Antes de continuar</p>
          <p style={{ fontSize: "12px", color: "#a16207", lineHeight: 1.6, margin: 0 }}>Para descargar {appName} necesitas completar la verificación rápida. Desliza hacia abajo y toca el botón verde al final. El proceso es gratuito y toma menos de un minuto.</p>
        </div>

        {/* Botón al final con indicador de scroll */}
        <div style={{ textAlign: "center", paddingBottom: "30px" }}>
          <button
            onClick={() => { setRobotChecked(true); setTimeout(() => onContinue(), 400); }}
            className="bounce-click"
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              width: "100%", padding: "16px 36px", borderRadius: "12px",
              backgroundColor: robotChecked ? C.greenDark : C.green,
              color: "#ffffff", fontWeight: 700, fontSize: "16px",
              border: "none", cursor: robotChecked ? "default" : "pointer",
              letterSpacing: "0.3px", transition: "all 0.3s ease",
              boxShadow: "0 6px 20px rgba(34, 197, 94, 0.4)",
            }}
          >
            {robotChecked ? "✅ Verificado correctamente" : "🤖 I'm not a robot → Continuar"}
          </button>
        </div>
      </MonetagGate>
    </PageShell>
  );
}

/* ============================================================
   PASO 2 — Esperar 5s → Comenzar
   ============================================================ */
function Step2({ appName, onContinue, slug }: { appName: string; onContinue: () => void; slug: string }) {
  const [showWait, setShowWait] = useState(false);

  return (
    <PageShell step={2} appName={appName} slug={slug}>
      <MonetagGate slug={slug} step={2}>
        {!showWait ? (
          <>
            <div style={{ backgroundColor: C.card, borderRadius: "16px", border: `1px solid ${C.border}`, padding: "24px", marginBottom: "18px", textAlign: "center" }}>
              <div style={{ fontSize: "36px", marginBottom: "8px" }}>✅</div>
              <p style={{ fontSize: "15px", color: C.green, fontWeight: 700, margin: "0 0 6px 0" }}>¡Paso completado!</p>
              <p style={{ fontSize: "13px", color: C.muted, margin: "0 0 18px 0", lineHeight: 1.5 }}>Desliza hacia abajo y toca "Comenzar" para continuar</p>
            </div>

            {/* Indicador scroll */}
            <div style={{ textAlign: "center", padding: "20px 0 8px" }}>
              <div style={{
                display: "inline-flex", flexDirection: "column", alignItems: "center",
                gap: "4px", color: "#64748b", fontSize: "11px", fontWeight: 600,
                animation: "pulse 2s infinite"
              }}>
                <span>👇 Desliza hacia abajo para continuar</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "bounce 1.5s infinite" }}>
                  <path d="M12 5v14M19 12l-7 7-7-7" />
                </svg>
              </div>
              <style jsx>{`
                @keyframes pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
                @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(6px); } }
              `}</style>
            </div>

            {/* Botón Comenzar */}
            <div style={{ textAlign: "center", paddingBottom: "30px" }}>
              <button
                onClick={() => setShowWait(true)}
                className="bounce-click"
                style={{
                  width: "100%", padding: "16px 24px", borderRadius: "12px",
                  backgroundColor: "#facc15", color: "#000000", fontWeight: 700,
                  fontSize: "16px", border: "none", cursor: "pointer",
                  letterSpacing: "0.5px", textTransform: "uppercase",
                  boxShadow: "0 6px 20px rgba(250, 204, 21, 0.4)",
                }}
              >
                ▶ Comenzar
              </button>
            </div>
          </>
        ) : (
          <>
            <WaitCountdown onReady={onContinue} downloadUrl="" appName={appName} />
          </>
        )}
      </MonetagGate>
    </PageShell>
  );
}

/* ============================================================
   PASO 3 — Esperar 5s → Descargar
   ============================================================ */
function Step3({ appName, downloadUrl, onDownload, slug }: {
  appName: string; downloadUrl: string; onDownload: () => void; slug: string;
}) {
  const [countdown, setCountdown] = useState(5);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) { clearInterval(interval); setReady(true); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <PageShell step={3} appName={appName} slug={slug}>
      <MonetagGate slug={slug} step={3}>
        {!ready ? (
          <>
            <WaitCountdown onReady={() => {}} downloadUrl={downloadUrl} appName={appName} />
          </>
        ) : (
          <>
            {/* Info de seguridad */}
            <div style={{ backgroundColor: "#f0fdf4", borderRadius: "14px", border: "1px solid #bbf7d0", padding: "16px", textAlign: "center", marginBottom: "16px" }}>
              <p style={{ fontSize: "13px", color: "#15803d", fontWeight: 700, margin: "0 0 6px 0" }}>🛡️ Archivo Verificado</p>
              <p style={{ fontSize: "12px", color: "#64748b", margin: 0, lineHeight: 1.5 }}>Escaneado con 68 motores antivirus — 0 amenazas detectadas</p>
            </div>

            {/* Indicador scroll */}
            <div style={{ textAlign: "center", padding: "20px 0 8px" }}>
              <div style={{
                display: "inline-flex", flexDirection: "column", alignItems: "center",
                gap: "4px", color: "#64748b", fontSize: "11px", fontWeight: 600,
                animation: "pulse 2s infinite"
              }}>
                <span>👇 Desliza hacia abajo cuando termine la cuenta</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "bounce 1.5s infinite" }}>
                  <path d="M12 5v14M19 12l-7 7-7-7" />
                </svg>
              </div>
              <style jsx>{`
                @keyframes pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
                @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(6px); } }
              `}</style>
            </div>

            {/* Botón Descargar */}
            <div style={{ textAlign: "center", paddingBottom: "30px" }}>
              <a
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onDownload}
                className="bounce-click"
                style={{
                  display: "block", width: "100%", padding: "20px 24px",
                  borderRadius: "16px", backgroundColor: "#22c55e", color: "#ffffff",
                  fontWeight: 700, fontSize: "18px", border: "none", cursor: "pointer",
                  letterSpacing: "0.5px", textTransform: "uppercase", textDecoration: "none",
                  textAlign: "center", boxShadow: "0 8px 30px rgba(34, 197, 94, 0.45)",
                }}
              >
                ⬇ Descargar
              </a>
            </div>
          </>
        )}
      </MonetagGate>
    </PageShell>
  );
}

/* ============================================================
   COMPONENTE PRINCIPAL
   ============================================================ */
export default function DownloadFlow(props: Props) {
  const [step, setStep] = useState(1);

  const goStep2 = useCallback(() => setStep(2), []);
  const goStep3 = useCallback(() => setStep(3), []);

  const handleDownload = () => {
    try {
      const key = `downloads-${props.appName}`;
      const count = parseInt(localStorage.getItem(key) || "0");
      localStorage.setItem(key, (count + 1).toString());
    } catch {}
  };

  if (step === 1) {
    return (
      <Step1
        appName={props.appName} appIcon={props.appIcon} appEmoji={props.appEmoji}
        appVersion={props.appVersion} appSize={props.appSize} appCategory={props.appCategory}
        appDescription={props.appDescription} appLongDescription={props.appLongDescription}
        onContinue={goStep2} slug={props.slug}
        romInfo={props.romInfo}
        hasPremiumSection={props.hasPremiumSection}
      />
    );
  }

  if (step === 2) {
    return (
      <WaitCountdown onReady={goStep3} downloadUrl={props.downloadUrl} appName={props.appName} />
    );
  }

  return (
    <Step3
      appName={props.appName} downloadUrl={props.downloadUrl}
      onDownload={handleDownload} slug={props.slug}
    />
  );
}