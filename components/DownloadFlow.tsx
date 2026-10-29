"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import AdsterraSocialBar from "@/components/AdsterraSocialBar";

const MONETAG_URL = "https://omg10.com/4/11940275";

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
};

/* ============================================================
   PASO 1 — Página de información + botón "I'm not a robot"
   ============================================================ */
function Step1({ appName, appIcon, appEmoji, appVersion, appSize, appCategory, appLongDescription, onContinue }: {
  appName: string;
  appIcon: string;
  appEmoji: string;
  appVersion: string;
  appSize: string;
  appCategory: string;
  appLongDescription: string;
  onContinue: () => void;
}) {
  const [robotChecked, setRobotChecked] = useState(false);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0a0a0f", color: "#ffffff", fontFamily: "Inter, system-ui, sans-serif" }}>
      <AdsterraSocialBar />

      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "20px 16px 120px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px", paddingTop: "12px" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "14px", overflow: "hidden", backgroundColor: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {appIcon && appIcon.startsWith("http") ? (
              <img src={appIcon} alt={appName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <span style={{ fontSize: "28px" }}>{appEmoji}</span>
            )}
          </div>
          <div>
            <h1 style={{ fontSize: "18px", fontWeight: 700, margin: 0, lineHeight: 1.2 }}>{appName}</h1>
            <p style={{ fontSize: "12px", color: "#8b8b9a", margin: "4px 0 0 0" }}>
              {appCategory} · v{appVersion} · {appSize}
            </p>
          </div>
        </div>

        {/* Contenido de información (scrollable) */}
        <div style={{
          backgroundColor: "#12121a",
          borderRadius: "16px",
          border: "1px solid rgba(255,255,255,0.08)",
          padding: "20px",
          marginBottom: "24px",
          maxHeight: "50vh",
          overflowY: "auto",
        }}>
          <h2 style={{ fontSize: "15px", fontWeight: 600, margin: "0 0 12px 0", color: "#facc15" }}>
            📋 Información de la app
          </h2>
          <p style={{ fontSize: "13px", lineHeight: 1.7, color: "#9ca3af", margin: 0 }}>
            {appLongDescription}
          </p>
        </div>

        {/* Instrucciones */}
        <div style={{
          backgroundColor: "rgba(250, 204, 21, 0.06)",
          borderRadius: "14px",
          border: "1px solid rgba(250, 204, 21, 0.2)",
          padding: "16px",
          marginBottom: "24px",
        }}>
          <p style={{ fontSize: "13px", color: "#facc15", fontWeight: 600, margin: "0 0 8px 0" }}>
            ⚠️ Antes de continuar
          </p>
          <p style={{ fontSize: "12px", color: "#9ca3af", lineHeight: 1.6, margin: 0 }}>
            Para descargar {appName} necesitas completar la verificación. Toca el botón de abajo para continuar.
          </p>
        </div>

        {/* Botón I'm not a robot */}
        <div style={{ textAlign: "center" }}>
          <button
            onClick={() => {
              setRobotChecked(true);
              setTimeout(() => onContinue(), 300);
            }}
            className="bounce-click"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 32px",
              borderRadius: "10px",
              backgroundColor: robotChecked ? "#16a34a" : "#22c55e",
              color: "#ffffff",
              fontWeight: 700,
              fontSize: "14px",
              border: "none",
              cursor: robotChecked ? "default" : "pointer",
              letterSpacing: "0.5px",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 15px rgba(34, 197, 94, 0.3)",
            }}
          >
            {robotChecked ? "✅ Verificado" : "🤖 I'm not a robot"}
          </button>

          <p style={{ fontSize: "11px", color: "#4b5563", marginTop: "12px", margin: "12px 0 0 0" }}>
            Toca el botón para pasar la verificación
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   PASO 2 — Banner Monetag + espera 5s + botón Comenzar/Descargar
   ============================================================ */
function Step2({ appName, onContinue }: { appName: string; onContinue: () => void }) {
  const [monetagClicked, setMonetagClicked] = useState(false);
  const [showWait, setShowWait] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [ready, setReady] = useState(false);

  // Detectar si el usuario regresó de la pestaña de Monetag
  useEffect(() => {
    const handler = () => {
      if (!document.hidden && sessionStorage.getItem("monetag_clicked") === "yes") {
        setMonetagClicked(true);
      }
    };
    document.addEventListener("visibilitychange", handler);
    window.addEventListener("focus", handler);
    return () => {
      document.removeEventListener("visibilitychange", handler);
      window.removeEventListener("focus", handler);
    };
  }, []);

  // Verificar si ya hizo click en esta sesión
  useEffect(() => {
    if (sessionStorage.getItem("monetag_clicked") === "yes") {
      setMonetagClicked(true);
    }
  }, []);

  const handleMonetagClick = () => {
    sessionStorage.setItem("monetag_clicked", "yes");
    setMonetagClicked(true);
    window.open(MONETAG_URL, "_blank");
  };

  const handleComenzar = () => {
    setShowWait(true);
  };

  // Countdown de 5 segundos
  useEffect(() => {
    if (!showWait || ready) return;
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
  }, [showWait, ready]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0a0a0f", color: "#ffffff", fontFamily: "Inter, system-ui, sans-serif" }}>
      <AdsterraSocialBar />

      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "20px 16px 120px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "24px", paddingTop: "12px" }}>
          <div style={{ fontSize: "48px", marginBottom: "8px" }}>📦</div>
          <h1 style={{ fontSize: "20px", fontWeight: 700, margin: 0 }}>{appName}</h1>
          <p style={{ fontSize: "12px", color: "#8b8b9a", margin: "6px 0 0 0" }}>
            Paso 2 de 3 — Verificación
          </p>
        </div>

        {/* BANNER: Para seguir debes tocar (solo si NO hizo click) */}
        {!monetagClicked && (
          <div style={{
            backgroundColor: "#12121a",
            borderRadius: "16px",
            border: "2px solid rgba(250, 204, 21, 0.4)",
            padding: "20px",
            marginBottom: "24px",
            textAlign: "center",
            animation: "slide-up 0.5s ease",
          }}>
            <p style={{ fontSize: "14px", color: "#facc15", fontWeight: 600, margin: "0 0 14px 0" }}>
              📢 Para seguir debes tocar:
            </p>
            <button
              onClick={handleMonetagClick}
              className="bounce-click"
              style={{
                width: "100%",
                padding: "14px 24px",
                borderRadius: "10px",
                backgroundColor: "#22c55e",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "15px",
                border: "none",
                cursor: "pointer",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                boxShadow: "0 4px 15px rgba(34, 197, 94, 0.3)",
              }}
            >
              👆 Click Aquí
            </button>
            <p style={{ fontSize: "11px", color: "#6b7280", margin: "12px 0 0 0", lineHeight: 1.5 }}>
              Toca el botón y vuelve a esta pestaña para continuar
            </p>
          </div>
        )}

        {/* CONTENIDO POSTERIOR: después de que el banner desaparece */}
        {monetagClicked && !showWait && (
          <div style={{
            backgroundColor: "#12121a",
            borderRadius: "16px",
            border: "1px solid rgba(255,255,255,0.08)",
            padding: "24px",
            marginBottom: "24px",
            textAlign: "center",
            animation: "slide-up 0.5s ease",
          }}>
            <div style={{ fontSize: "36px", marginBottom: "10px" }}>✅</div>
            <p style={{ fontSize: "14px", color: "#22c55e", fontWeight: 600, margin: "0 0 6px 0" }}>
              ¡Verificación completada!
            </p>
            <p style={{ fontSize: "13px", color: "#9ca3af", margin: "0 0 18px 0", lineHeight: 1.5 }}>
              Espera 5 segundos para seguir
            </p>
            <button
              onClick={handleComenzar}
              className="bounce-click"
              style={{
                width: "100%",
                padding: "14px 24px",
                borderRadius: "10px",
                backgroundColor: "#facc15",
                color: "#0a0a0f",
                fontWeight: 700,
                fontSize: "15px",
                border: "none",
                cursor: "pointer",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                boxShadow: "0 4px 15px rgba(250, 204, 21, 0.3)",
              }}
            >
              ▶ Comenzar
            </button>
          </div>
        )}

        {/* CONTADOR 5s + botón Descargar */}
        {showWait && (
          <div style={{
            backgroundColor: "#12121a",
            borderRadius: "16px",
            border: "1px solid rgba(255,255,255,0.08)",
            padding: "30px 24px",
            marginBottom: "24px",
            textAlign: "center",
          }}>
            {/* Círculo de progreso */}
            <div style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              margin: "0 auto 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: ready ? "rgba(34, 197, 94, 0.15)" : "rgba(250, 204, 21, 0.1)",
              border: `3px solid ${ready ? "#22c55e" : "#facc15"}`,
              transition: "all 0.3s ease",
            }}>
              <span style={{
                fontSize: ready ? "36px" : "28px",
                fontWeight: 700,
                color: ready ? "#22c55e" : "#facc15",
              }}>
                {ready ? "✓" : countdown}
              </span>
            </div>

            {!ready ? (
              <>
                <p style={{ fontSize: "14px", color: "#facc15", fontWeight: 600, margin: "0 0 4px 0" }}>
                  Espera {countdown} segundo{countdown !== 1 ? "s" : ""}...
                </p>
                <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>
                  Preparando tu descarga
                </p>
              </>
            ) : (
              <>
                <p style={{ fontSize: "14px", color: "#22c55e", fontWeight: 600, margin: "0 0 16px 0" }}>
                  ¡Listo! Tu descarga está preparada
                </p>
                <button
                  onClick={onContinue}
                  className="bounce-click"
                  style={{
                    width: "100%",
                    padding: "16px 24px",
                    borderRadius: "12px",
                    backgroundColor: "#22c55e",
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
                  ⬇ Descargar
                </button>
              </>
            )}
          </div>
        )}

        {/* Barra de progreso general */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "8px",
          marginTop: "24px",
        }}>
          {["1", "2", "3"].map((step) => (
            <div key={step} style={{
              width: "40px",
              height: "4px",
              borderRadius: "2px",
              backgroundColor: step === "2" ? "#facc15" : "rgba(255,255,255,0.1)",
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   PASO 3 — Espera 5s + link de descarga final
   ============================================================ */
function Step3({ appName, downloadUrl, onDownload, slug }: {
  appName: string;
  downloadUrl: string;
  onDownload: () => void;
  slug: string;
}) {
  const [countdown, setCountdown] = useState(5);
  const [ready, setReady] = useState(false);

  useEffect(() => {
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
  }, []);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0a0a0f", color: "#ffffff", fontFamily: "Inter, system-ui, sans-serif" }}>
      <AdsterraSocialBar />

      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "20px 16px 120px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "24px", paddingTop: "12px" }}>
          <div style={{ fontSize: "48px", marginBottom: "8px" }}>🎉</div>
          <h1 style={{ fontSize: "20px", fontWeight: 700, margin: 0 }}>{appName}</h1>
          <p style={{ fontSize: "12px", color: "#8b8b9a", margin: "6px 0 0 0" }}>
            Paso 3 de 3 — Último paso
          </p>
        </div>

        {/* Contenido de espera */}
        <div style={{
          backgroundColor: "#12121a",
          borderRadius: "16px",
          border: "1px solid rgba(255,255,255,0.08)",
          padding: "30px 24px",
          marginBottom: "24px",
          textAlign: "center",
        }}>
          {/* Círculo de progreso */}
          <div style={{
            width: "90px",
            height: "90px",
            borderRadius: "50%",
            margin: "0 auto 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: ready ? "rgba(34, 197, 94, 0.15)" : "rgba(250, 204, 21, 0.1)",
            border: `3px solid ${ready ? "#22c55e" : "#facc15"}`,
            transition: "all 0.3s ease",
          }}>
            <span style={{
              fontSize: ready ? "40px" : "30px",
              fontWeight: 700,
              color: ready ? "#22c55e" : "#facc15",
            }}>
              {ready ? "✓" : countdown}
            </span>
          </div>

          {!ready ? (
            <>
              <p style={{ fontSize: "15px", color: "#facc15", fontWeight: 600, margin: "0 0 6px 0" }}>
                Espera {countdown} segundo{countdown !== 1 ? "s" : ""} para descargar
              </p>
              <p style={{ fontSize: "12px", color: "#6b7280", margin: 0, lineHeight: 1.5 }}>
                Estamos preparando tu archivo APK
              </p>

              {/* Barra de progreso */}
              <div style={{
                width: "100%",
                height: "6px",
                borderRadius: "3px",
                backgroundColor: "rgba(255,255,255,0.1)",
                marginTop: "20px",
                overflow: "hidden",
              }}>
                <div style={{
                  width: `${((5 - countdown) / 5) * 100}%`,
                  height: "100%",
                  backgroundColor: "#facc15",
                  borderRadius: "3px",
                  transition: "width 1s linear",
                }} />
              </div>
            </>
          ) : (
            <>
              <p style={{ fontSize: "15px", color: "#22c55e", fontWeight: 600, margin: "0 0 6px 0" }}>
                ✅ ¡Tu descarga está lista!
              </p>
              <p style={{ fontSize: "13px", color: "#9ca3af", margin: "0 0 20px 0", lineHeight: 1.5 }}>
                Toca el botón para descargar {appName}
              </p>
              <a
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onDownload}
                className="bounce-click"
                style={{
                  display: "block",
                  width: "100%",
                  padding: "18px 24px",
                  borderRadius: "14px",
                  backgroundColor: "#22c55e",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: "17px",
                  border: "none",
                  cursor: "pointer",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  textAlign: "center",
                  boxShadow: "0 6px 25px rgba(34, 197, 94, 0.4)",
                }}
              >
                ⬇ Descargar APK
              </a>
            </>
          )}
        </div>

        {/* Info de seguridad */}
        <div style={{
          backgroundColor: "rgba(34, 197, 94, 0.06)",
          borderRadius: "14px",
          border: "1px solid rgba(34, 197, 94, 0.2)",
          padding: "16px",
          textAlign: "center",
        }}>
          <p style={{ fontSize: "12px", color: "#22c55e", fontWeight: 600, margin: "0 0 6px 0" }}>
            🛡️ Archivo Verificado
          </p>
          <p style={{ fontSize: "11px", color: "#6b7280", margin: 0, lineHeight: 1.5 }}>
            Escaneado y seguro para tu dispositivo Android
          </p>
        </div>

        {/* Barra de progreso general */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "8px",
          marginTop: "24px",
        }}>
          {["1", "2", "3"].map((step) => (
            <div key={step} style={{
              width: "40px",
              height: "4px",
              borderRadius: "2px",
              backgroundColor: "3" === step ? "#facc15" : "#22c55e",
            }} />
          ))}
        </div>

        {/* Link de vuelta */}
        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <Link href={`/apps/${slug}`} style={{
            fontSize: "12px",
            color: "#6b7280",
            textDecoration: "none",
          }}>
            ← Volver a la app
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   COMPONENTE PRINCIPAL — gestiona los 3 pasos
   ============================================================ */
export default function DownloadFlow(props: Props) {
  const [step, setStep] = useState(1);

  const goStep2 = useCallback(() => setStep(2), []);
  const goStep3 = useCallback(() => setStep(3), []);

  const handleDownload = () => {
    // Incrementar contador de descargas
    try {
      const key = `downloads-${props.appName}`;
      const count = parseInt(localStorage.getItem(key) || "0");
      localStorage.setItem(key, (count + 1).toString());
    } catch {}
  };

  if (step === 1) {
    return (
      <Step1
        appName={props.appName}
        appIcon={props.appIcon}
        appEmoji={props.appEmoji}
        appVersion={props.appVersion}
        appSize={props.appSize}
        appCategory={props.appCategory}
        appLongDescription={props.appLongDescription}
        onContinue={goStep2}
      />
    );
  }

  if (step === 2) {
    return (
      <Step2
        appName={props.appName}
        onContinue={goStep3}
      />
    );
  }

  return (
    <Step3
      appName={props.appName}
      downloadUrl={props.downloadUrl}
      onDownload={handleDownload}
      slug={props.slug}
    />
  );
}
