"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import AdsterraSocialBar from "@/components/AdsterraSocialBar";

const MONETAG_URL = "https://omg10.com/4/11940275";

/* Paleta clara (fondo blanco) */
const C = {
  bg: "#ffffff",
  card: "#f8fafc",
  border: "#e2e8f0",
  text: "#1e293b",
  muted: "#64748b",
  light: "#94a3b8",
  accent: "#facc15",
  green: "#22c55e",
  greenDark: "#16a34a",
  blue: "#3b82f6",
  orange: "#f97316",
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
};

/* ============================================================
   CONTENIDO IRRELEVANTE
   ============================================================ */
const FILLER_FACTS = [
  "El primer teléfono móvil pesaba más de 1 kg y solo podía hacer llamadas durante 30 minutos. Hoy los smartphones pesan menos de 200 gramos y duran todo el día con una sola carga.",
  "Android fue creado originalmente como un sistema operativo para cámaras digitales, no para teléfonos. La idea cambió cuando Google compró la empresa en 2005.",
  "La primera app que se lanzó para Android fue una demo de un reloj. Se llamaba Analog Clock y era extremadamente sencilla comparada con las apps actuales.",
  "El código QR fue inventado en 1994 por Denso Wave, una subsidiaria de Toyota, para rastrear piezas de automóviles en fábricas.",
  "Los cables USB estándar actuales pueden transferir datos a una velocidad de hasta 40 Gbps con USB4, cien mil veces más rápido que los primeros cables USB.",
  "El primer mensaje de texto se envió en 1992 y decía simplemente 'Merry Christmas'. Costó el equivalente a 0.10 dólares por mensaje.",
  "La batería de tu teléfono se recarga típicamente entre 300 y 500 ciclos antes de perder el 20% de su capacidad original. Eso equivale a unos 2-3 años de uso.",
  "Un solo smartphone moderno tiene más potencia de cómputo que toda la NASA usó para enviar al hombre a la luna en 1969.",
  "El porcentaje de personas que duermen con el teléfono cerca de la cama supera el 70% a nivel mundial según estudios recientes de tecnología.",
  "El primer sitio web de Internet se publicó el 6 de agosto de 1991 y todavía está en línea. Se trata de una página muy básica con texto simple.",
  "Los emoji fueron creados en 1999 por Shigetaka Kurita para una plataforma de mensajería japonesa. Originalmente solo había 176 símbolos.",
  "El término 'bug' (error) en programación viene de un insecto real que fue encontrado dentro de una computadora Harvard Mark II en 1947.",
  "La resolución promedio de pantalla de los teléfonos en 2010 era de 480p. Hoy en día los flagships superan los 1440p con frecuencias de 120 Hz.",
  "El WiFi no significa 'Wireless Fidelity' como mucha gente cree. En realidad es solo un nombre comercial inventado por la marca Interbrand.",
  "El primer video subido a YouTube se llamó 'Me at the zoo' y duraba apenas 18 segundos. Fue publicado el 23 de abril de 2005.",
];

const FILLER_TIPS = [
  "Limpia la caché de tus apps al menos una vez al mes para mejorar el rendimiento de tu dispositivo Android.",
  "Activa el modo ahorro de batería cuando el nivel baje del 30% para extender la vida útil de tu pantalla.",
  "Usa fondos de pantalla oscuros en pantallas AMOLED para ahorrar hasta un 30% de batería.",
  "Actualiza tu sistema operativo regularmente para recibir parches de seguridad y mejoras de rendimiento.",
  "Desinstala las apps que no usas: cada app ocupa espacio y puede consumir recursos en segundo plano.",
  "Haz copias de seguridad en la nube al menos una vez por semana para proteger tus fotos y archivos importantes.",
  "Activa la verificación en dos pasos en todas tus cuentas para mayor seguridad.",
  "Si tu teléfono se calienta mucho, cierra las apps en segundo plano y quítale la funda por unos minutos.",
  "Los gestos de navegación consumen menos recursos que los botones físicos de navegación en Android.",
  "Usa cables de carga certificados para evitar dañar la batería de tu dispositivo a largo plazo.",
  "El modo avión durante la carga acelera significativamente el proceso de carga de tu teléfono.",
  "Activa 'Encontrar mi dispositivo' desde los ajustes de Google para localizar tu teléfono en caso de robo o pérdida.",
];

const FILLER_STEPS = [
  { icon: "📥", title: "Descarga el archivo", desc: "Una vez completado el proceso, verás el botón de descarga que te llevará al archivo APK listo para instalar." },
  { icon: "⚙️", title: "Permisos de instalación", desc: "Ve a Ajustes > Seguridad y activa 'Fuentes desconocidas' para permitir la instalación de apps fuera de Play Store." },
  { icon: "📱", title: "Instala la APK", desc: "Abre el archivo APK descargado y toca 'Instalar'. El proceso tomará solo unos segundos dependiendo de tu dispositivo." },
  { icon: "✅", title: "Abre y disfruta", desc: "Una vez instalada, abre la app desde tu cajón de aplicaciones y disfruta de todas las funciones premium desbloqueadas." },
];

/* ============================================================
   COMPONENTES AUXILIARES (definidos ANTES para que TS los vea)
   ============================================================ */
function FactCard({ index }: { index: number }) {
  return (
    <div style={{ backgroundColor: C.card, borderRadius: "14px", border: `1px solid ${C.border}`, padding: "16px", marginBottom: "14px" }}>
      <p style={{ fontSize: "11px", fontWeight: 700, color: C.blue, margin: "0 0 6px 0", textTransform: "uppercase", letterSpacing: "0.5px" }}>💡 ¿Sabías que…?</p>
      <p style={{ fontSize: "13px", color: C.muted, margin: 0, lineHeight: 1.6 }}>{FILLER_FACTS[index % FILLER_FACTS.length]}</p>
    </div>
  );
}

function TipCard({ index }: { index: number }) {
  return (
    <div style={{ backgroundColor: C.card, borderRadius: "14px", border: `1px solid ${C.border}`, padding: "16px", marginBottom: "14px" }}>
      <p style={{ fontSize: "11px", fontWeight: 700, color: C.orange, margin: "0 0 6px 0", textTransform: "uppercase", letterSpacing: "0.5px" }}>📌 Consejo útil</p>
      <p style={{ fontSize: "13px", color: C.muted, margin: 0, lineHeight: 1.6 }}>{FILLER_TIPS[index % FILLER_TIPS.length]}</p>
    </div>
  );
}

function FillerSection({ title, items }: { title: string; items: { icon: string; title: string; desc: string }[] }) {
  return (
    <div style={{ backgroundColor: C.card, borderRadius: "14px", border: `1px solid ${C.border}`, padding: "18px", marginBottom: "16px" }}>
      <h3 style={{ fontSize: "14px", fontWeight: 700, margin: "0 0 12px 0", color: C.text }}>{title}</h3>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", gap: "10px", marginBottom: i < items.length - 1 ? "14px" : 0 }}>
          <span style={{ fontSize: "20px", flexShrink: 0 }}>{item.icon}</span>
          <div>
            <p style={{ fontSize: "13px", fontWeight: 600, margin: "0 0 3px 0", color: C.text }}>{item.title}</p>
            <p style={{ fontSize: "12px", color: C.muted, margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function InfoBlock({ appName, appCategory, appVersion, appSize, appDescription, appLongDescription }: {
  appName: string; appCategory: string; appVersion: string; appSize: string; appDescription: string; appLongDescription: string;
}) {
  return (
    <>
      <div style={{ backgroundColor: C.card, borderRadius: "14px", border: `1px solid ${C.border}`, padding: "18px", marginBottom: "16px" }}>
        <h3 style={{ fontSize: "14px", fontWeight: 700, margin: "0 0 10px 0", color: C.text }}>📋 Información general</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          {[
            { label: "Nombre", value: appName },
            { label: "Categoría", value: appCategory },
            { label: "Versión", value: appVersion },
            { label: "Tamaño", value: appSize },
            { label: "Plataforma", value: "Android 7.0+" },
            { label: "Idioma", value: "Español" },
            { label: "Estado", value: "Verificado ✓" },
            { label: "Actualizado", value: "Octubre 2026" },
            { label: "Desarrollador", value: "PERSONS-COMUNITY" },
            { label: "Licencia", value: "Gratuita" },
          ].map((row) => (
            <div key={row.label} style={{ backgroundColor: "#ffffff", borderRadius: "8px", padding: "8px 10px", border: `1px solid ${C.border}` }}>
              <p style={{ fontSize: "10px", color: C.light, margin: "0 0 2px 0", textTransform: "uppercase" }}>{row.label}</p>
              <p style={{ fontSize: "12px", color: C.text, margin: 0, fontWeight: 600 }}>{row.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ backgroundColor: C.card, borderRadius: "14px", border: `1px solid ${C.border}`, padding: "18px", marginBottom: "16px" }}>
        <h3 style={{ fontSize: "14px", fontWeight: 700, margin: "0 0 10px 0", color: C.text }}>📖 Descripción</h3>
        <p style={{ fontSize: "13px", color: C.muted, margin: "0 0 10px 0", lineHeight: 1.7 }}>{appLongDescription}</p>
        <p style={{ fontSize: "13px", color: C.muted, margin: 0, lineHeight: 1.7 }}>{appDescription} Esta versión ha sido modificada para ofrecerte la mejor experiencia posible, eliminando restricciones y desbloqueando todo el contenido premium que normalmente requiere un pago por suscripción.</p>
      </div>
    </>
  );
}

function WaitCountdown({ onReady, label }: { onReady: () => void; label: string }) {
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
    <div style={{ backgroundColor: C.card, borderRadius: "16px", border: `1px solid ${C.border}`, padding: "28px 20px", marginBottom: "18px", textAlign: "center" }}>
      <div style={{
        width: "80px", height: "80px", borderRadius: "50%", margin: "0 auto 14px",
        display: "flex", alignItems: "center", justifyContent: "center",
        backgroundColor: ready ? "rgba(34, 197, 94, 0.12)" : "rgba(250, 204, 21, 0.12)",
        border: `3px solid ${ready ? C.green : C.accent}`, transition: "all 0.3s ease",
      }}>
        <span style={{ fontSize: ready ? "34px" : "26px", fontWeight: 800, color: ready ? C.green : "#000" }}>
          {ready ? "✓" : countdown}
        </span>
      </div>

      {!ready ? (
        <>
          <p style={{ fontSize: "14px", color: C.text, fontWeight: 600, margin: "0 0 4px 0" }}>Espera {countdown} segundo{countdown !== 1 ? "s" : ""}…</p>
          <p style={{ fontSize: "12px", color: C.light, margin: 0 }}>{label}</p>
          <div style={{ width: "100%", height: "6px", borderRadius: "3px", backgroundColor: C.border, marginTop: "16px", overflow: "hidden" }}>
            <div style={{ width: `${((5 - countdown) / 5) * 100}%`, height: "100%", backgroundColor: C.accent, borderRadius: "3px", transition: "width 1s linear" }} />
          </div>
        </>
      ) : (
        <button
          onClick={onReady}
          className="bounce-click"
          style={{
            width: "100%", padding: "16px 24px", borderRadius: "12px",
            backgroundColor: C.green, color: "#ffffff", fontWeight: 700,
            fontSize: "16px", border: "none", cursor: "pointer",
            letterSpacing: "0.5px", textTransform: "uppercase",
            boxShadow: "0 6px 20px rgba(34, 197, 94, 0.4)",
          }}
        >
          ⬇ Descargar
        </button>
      )}
    </div>
  );
}

/* ============================================================
   MONETAG GATE — banner obligatorio en CADA paso de CADA app
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
      <p style={{ fontSize: "11px", color: C.light, margin: "12px 0 0 0", lineHeight: 1.5 }}>Toca el botón, vuelve a esta pestaña y podrás continuar</p>
    </div>
  );
}

/* ============================================================
   PAGE SHELL — fondo blanco + social bar + native banner + vignette
   ============================================================ */
function PageShell({ children, step, appName, slug }: { children: React.ReactNode; step: number; appName: string; slug: string }) {
  // Native banner bellnewyork.org — carga EN CADA PASO (nuevo script tag cada vez)
  useEffect(() => {
    const s = document.createElement("script");
    s.async = true;
    s.setAttribute("data-cfasync", "false");
    s.src = "https://bellnewyork.org/21/885a3a3a0173836d790936818ab5a034";
    document.body.appendChild(s);
    // No removemos el script al desmontar — dejamos que se acumulen
  }, [step]);

  // Vignette n6wxm.com — en TODAS las sub-páginas
  useEffect(() => {
    const existing = document.querySelector('script[src*="n6wxm.com/vignette"]');
    if (!existing) {
      const s = document.createElement("script");
      s.dataset.zone = "12144612";
      s.src = "https://n6wxm.com/vignette.min.js";
      document.body.appendChild(s);
    }
  }, []);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: C.bg, color: C.text, fontFamily: "Inter, system-ui, sans-serif" }}>
      <AdsterraSocialBar />

      <div style={{ maxWidth: "520px", margin: "0 auto", padding: "16px 14px 140px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", paddingTop: "8px", marginBottom: "18px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: C.accent, color: "#000", fontSize: "11px", fontWeight: 700, padding: "4px 14px", borderRadius: "20px", marginBottom: "10px" }}>
            PASO {step} DE 4
          </div>
          <h1 style={{ fontSize: "20px", fontWeight: 800, margin: 0, color: C.text }}>{appName}</h1>
          <p style={{ fontSize: "12px", color: C.muted, margin: "4px 0 0 0" }}>PERSONS-COMUNITY — Descarga verificada y segura</p>
        </div>

        {/* Barra de progreso 4 pasos */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "20px" }}>
          {[1, 2, 3, 4].map((s) => (
            <div key={s} style={{ flex: 1, height: "5px", borderRadius: "3px", backgroundColor: s <= step ? C.green : C.border }} />
          ))}
        </div>

        {/* Contenido del paso (envuelto en MonetagGate por el padre) */}
        {children}

        {/* Native banner blanco (contenedor limpio) — key fuerza re-mount en cada paso */}
        <div key={`native-banner-${step}`} style={{ backgroundColor: "#ffffff", borderRadius: "14px", border: `1px solid ${C.border}`, padding: "16px", marginTop: "24px", display: "flex", justifyContent: "center", minHeight: "120px", alignItems: "center" }}>
          <div id="container-885a3a3a0173836d790936818ab5a034"></div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <Link href={`/apps/${slug}`} style={{ fontSize: "12px", color: C.light, textDecoration: "none" }}>
            ← Volver a la tienda
          </Link>
          <p style={{ fontSize: "10px", color: C.light, marginTop: "8px" }}>PERSONS-COMUNITY © 2026 — Hecho con 💛 desde Termux</p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SCROLL-TO-CONTINUE — botón fijo al final con indicador
   ============================================================ */
function ScrollToContinue({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <>
      {/* Indicador de scroll */}
      <div style={{ textAlign: "center", padding: "20px 0 8px" }}>
        <div style={{
          display: "inline-flex", flexDirection: "column", alignItems: "center",
          gap: "4px", color: C.light, fontSize: "11px", fontWeight: 600,
          animation: "pulse 2s infinite"
        }}>
          <span>👇 Desliza hacia abajo para continuar</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "bounce 1.5s infinite" }}>
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
          <style jsx>{`
            @keyframes pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
            @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(6px); } }
          `}</style>
        </div>
      </div>

      {/* Botón de acción al final */}
      <div style={{ textAlign: "center", paddingBottom: "30px" }}>
        {children}
      </div>
    </>
  );
}

/* ============================================================
   PASO 1 — Info + "I'm not a robot" (botón al final)
   ============================================================ */
function Step1({ appName, appIcon, appEmoji, appVersion, appSize, appCategory, appDescription, appLongDescription, onContinue, slug }: {
  appName: string; appIcon: string; appEmoji: string; appVersion: string; appSize: string;
  appCategory: string; appDescription: string; appLongDescription: string; onContinue: () => void; slug: string;
}) {
  const [robotChecked, setRobotChecked] = useState(false);

  return (
    <PageShell step={1} appName={appName} slug={slug}>
      <MonetagGate slug={slug} step={1}>
        {/* Icono de la app */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "18px" }}>
          <div style={{ width: "60px", height: "60px", borderRadius: "16px", overflow: "hidden", backgroundColor: "#f1f5f9", border: `2px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {appIcon && appIcon.startsWith("http") ? (
              <img src={appIcon} alt={appName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <span style={{ fontSize: "30px" }}>{appEmoji}</span>
            )}
          </div>
          <div>
            <h2 style={{ fontSize: "17px", fontWeight: 700, margin: 0, color: C.text }}>{appName}</h2>
            <p style={{ fontSize: "12px", color: C.muted, margin: "4px 0 0 0" }}>{appCategory} · v{appVersion} · {appSize}</p>
            <div style={{ display: "flex", gap: "6px", marginTop: "6px" }}>
              <span style={{ fontSize: "10px", backgroundColor: C.green, color: "#fff", padding: "2px 8px", borderRadius: "10px", fontWeight: 600 }}>✓ Verificado</span>
              <span style={{ fontSize: "10px", backgroundColor: C.blue, color: "#fff", padding: "2px 8px", borderRadius: "10px", fontWeight: 600 }}>MOD</span>
              <span style={{ fontSize: "10px", backgroundColor: C.purple, color: "#fff", padding: "2px 8px", borderRadius: "10px", fontWeight: 600 }}>Premium</span>
            </div>
          </div>
        </div>

        <InfoBlock appName={appName} appCategory={appCategory} appVersion={appVersion} appSize={appSize} appDescription={appDescription} appLongDescription={appLongDescription} />

        <FactCard index={0} />

        {/* Instrucciones */}
        <div style={{ backgroundColor: "#fffbeb", borderRadius: "14px", border: "1px solid #fde68a", padding: "16px", marginBottom: "16px" }}>
          <p style={{ fontSize: "13px", color: "#92400e", fontWeight: 700, margin: "0 0 8px 0" }}>⚠️ Antes de continuar</p>
          <p style={{ fontSize: "12px", color: "#a16207", lineHeight: 1.6, margin: 0 }}>Para descargar {appName} necesitas completar la verificación rápida. Desliza hacia abajo y toca el botón verde al final. El proceso es gratuito y toma menos de un minuto.</p>
        </div>

        <TipCard index={0} />
        <FactCard index={1} />
        <TipCard index={1} />

        <div style={{ backgroundColor: C.card, borderRadius: "14px", border: `1px solid ${C.border}`, padding: "18px", marginBottom: "16px" }}>
          <h3 style={{ fontSize: "14px", fontWeight: 700, margin: "0 0 10px 0", color: C.text }}>📱 Consejos para tu dispositivo Android</h3>
          {FILLER_TIPS.slice(1, 5).map((tip, i) => (
            <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
              <span style={{ color: C.green, fontWeight: 700, fontSize: "13px" }}>•</span>
              <p style={{ fontSize: "12px", color: C.muted, margin: 0, lineHeight: 1.6 }}>{tip}</p>
            </div>
          ))}
        </div>

        <FactCard index={3} />
        <TipCard index={2} />

        <div style={{ backgroundColor: C.card, borderRadius: "14px", border: `1px solid ${C.border}`, padding: "18px", marginBottom: "16px" }}>
          <h3 style={{ fontSize: "14px", fontWeight: 700, margin: "0 0 10px 0", color: C.text }}>📊 Estadísticas del sitio</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
            {[
              { num: "190+", label: "Apps disponibles" }, { num: "50K+", label: "Descargas/mes" }, { num: "4.8★", label: "Calificación" },
              { num: "24/7", label: "Soporte activo" }, { num: "100%", label: "Verificados" }, { num: "0$", label: "Costo para ti" },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: "center", backgroundColor: "#ffffff", borderRadius: "10px", padding: "10px 6px", border: `1px solid ${C.border}` }}>
                <p style={{ fontSize: "16px", fontWeight: 800, color: C.green, margin: 0 }}>{s.num}</p>
                <p style={{ fontSize: "9px", color: C.light, margin: "2px 0 0 0" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <FactCard index={5} />
        <TipCard index={3} />

        <div style={{ backgroundColor: C.card, borderRadius: "14px", border: `1px solid ${C.border}`, padding: "18px", marginBottom: "16px" }}>
          <h3 style={{ fontSize: "14px", fontWeight: 700, margin: "0 0 10px 0", color: C.text }}>🌐 Historia de las aplicaciones móviles</h3>
          <p style={{ fontSize: "12px", color: C.muted, margin: "0 0 10px 0", lineHeight: 1.7 }}>Las primeras aplicaciones móviles aparecieron en 1997 con el Nokia 6110, que incluía el juego Snake. Desde entonces, el ecosistema de apps ha crecido hasta alcanzar más de 3.5 millones de aplicaciones disponibles en Google Play Store.</p>
          <p style={{ fontSize: "12px", color: C.muted, margin: 0, lineHeight: 1.7 }}>Actualmente, un usuario promedio pasa alrededor de 4.5 horas al día usando aplicaciones en su teléfono. Las categorías más populares son las redes sociales, los juegos, los mensajes de texto y las aplicaciones de productividad.</p>
        </div>

        <FactCard index={7} />
        <TipCard index={4} />

        {/* Botón al final con indicador de scroll */}
        <ScrollToContinue label="continuar">
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
        </ScrollToContinue>
      </MonetagGate>
    </PageShell>
  );
}

/* ============================================================
   PASO 2 — Comenzar → 5s → Descargar (botón al final)
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

            <FactCard index={4} />
            <TipCard index={2} />
            <FillerSection title="📖 Guía rápida de instalación APK" items={FILLER_STEPS} />
            <FactCard index={6} />
            <TipCard index={5} />

            <div style={{ backgroundColor: C.card, borderRadius: "14px", border: `1px solid ${C.border}`, padding: "18px", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: 700, margin: "0 0 10px 0", color: C.text }}>🧠 ¿Por qué esta app es popular?</h3>
              <p style={{ fontSize: "12px", color: C.muted, margin: "0 0 10px 0", lineHeight: 1.7 }}>{appName} se ha convertido en una de las aplicaciones más descargadas en su categoría debido a su interfaz intuitiva, sus actualizaciones constantes y la comunidad activa de usuarios que comparten consejos y trucos.</p>
              <p style={{ fontSize: "12px", color: C.muted, margin: 0, lineHeight: 1.7 }}>La versión MOD incluye todas las características de la versión premium sin las limitaciones impuestas por el modelo de suscripción. Disfruta de contenido exclusivo y herramientas avanzadas.</p>
            </div>

            <FactCard index={8} />
            <TipCard index={6} />

            <div style={{ backgroundColor: C.card, borderRadius: "14px", border: `1px solid ${C.border}`, padding: "18px", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: 700, margin: "0 0 10px 0", color: C.text }}>⚙️ Requisitos del sistema</h3>
              {[
                { label: "Sistema operativo", value: "Android 7.0 o superior" },
                { label: "RAM mínima", value: "3 GB de memoria RAM" },
                { label: "Almacenamiento", value: "Espacio libre según tamaño" },
                { label: "Procesador", value: "ARM64 o superior" },
                { label: "Conexión", value: "Internet estable" },
                { label: "Permisos", value: "Almacenamiento, Internet" },
              ].map((req) => (
                <div key={req.label} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: "12px", color: C.muted }}>{req.label}</span>
                  <span style={{ fontSize: "12px", color: C.text, fontWeight: 600, textAlign: "right" }}>{req.value}</span>
                </div>
              ))}
            </div>

            <FactCard index={10} />
            <TipCard index={7} />

            {/* Botón Comenzar al final */}
            <ScrollToContinue label="comenzar">
              <button
                onClick={() => setShowWait(true)}
                className="bounce-click"
                style={{
                  width: "100%", padding: "16px 24px", borderRadius: "12px",
                  backgroundColor: C.accent, color: "#000000", fontWeight: 700,
                  fontSize: "16px", border: "none", cursor: "pointer",
                  letterSpacing: "0.5px", textTransform: "uppercase",
                  boxShadow: "0 6px 20px rgba(250, 204, 21, 0.4)",
                }}
              >
                ▶ Comenzar
              </button>
            </ScrollToContinue>
          </>
        ) : (
          <>
            <WaitCountdown onReady={onContinue} label="Preparando tu descarga" />

            <FactCard index={4} />
            <TipCard index={2} />
            <FillerSection title="📖 Guía rápida de instalación APK" items={FILLER_STEPS} />
            <FactCard index={6} />
            <TipCard index={5} />

            <div style={{ backgroundColor: C.card, borderRadius: "14px", border: `1px solid ${C.border}`, padding: "18px", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: 700, margin: "0 0 10px 0", color: C.text }}>🧠 ¿Por qué esta app es popular?</h3>
              <p style={{ fontSize: "12px", color: C.muted, margin: "0 0 10px 0", lineHeight: 1.7 }}>{appName} se ha convertido en una de las aplicaciones más descargadas en su categoría debido a su interfaz intuitiva, sus actualizaciones constantes y la comunidad activa de usuarios que comparten consejos y trucos.</p>
              <p style={{ fontSize: "12px", color: C.muted, margin: 0, lineHeight: 1.7 }}>La versión MOD incluye todas las características de la versión premium sin las limitaciones impuestas por el modelo de suscripción. Disfruta de contenido exclusivo y herramientas avanzadas.</p>
            </div>

            <FactCard index={8} />
            <TipCard index={6} />

            <div style={{ backgroundColor: C.card, borderRadius: "14px", border: `1px solid ${C.border}`, padding: "18px", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: 700, margin: "0 0 10px 0", color: C.text }}>⚙️ Requisitos del sistema</h3>
              {[
                { label: "Sistema operativo", value: "Android 7.0 o superior" },
                { label: "RAM mínima", value: "3 GB de memoria RAM" },
                { label: "Almacenamiento", value: "Espacio libre según tamaño" },
                { label: "Procesador", value: "ARM64 o superior" },
                { label: "Conexión", value: "Internet estable" },
                { label: "Permisos", value: "Almacenamiento, Internet" },
              ].map((req) => (
                <div key={req.label} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: "12px", color: C.muted }}>{req.label}</span>
                  <span style={{ fontSize: "12px", color: C.text, fontWeight: 600, textAlign: "right" }}>{req.value}</span>
                </div>
              ))}
            </div>

            <FactCard index={10} />
            <TipCard index={7} />
          </>
        )}
      </MonetagGate>
    </PageShell>
  );
}

/* ============================================================
   PASO 3 — 5s → Descargar (botón al final)
   ============================================================ */
function Step3({ appName, onContinue, slug }: { appName: string; onContinue: () => void; slug: string }) {
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
              <p style={{ fontSize: "14px", color: C.text, fontWeight: 600, margin: "0 0 4px 0" }}>Espera {countdown} segundo{countdown !== 1 ? "s" : ""}…</p>
              <p style={{ fontSize: "12px", color: C.light, margin: 0 }}>Preparando tu descarga</p>
              <div style={{ width: "100%", height: "6px", borderRadius: "3px", backgroundColor: C.border, marginTop: "16px", overflow: "hidden" }}>
                <div style={{ width: `${((5 - countdown) / 5) * 100}%`, height: "100%", backgroundColor: C.accent, borderRadius: "3px", transition: "width 1s linear" }} />
              </div>
            </div>

            <FactCard index={9} />
            <TipCard index={4} />

            <FillerSection title="🛡️ Seguridad y verificación" items={[
              { icon: "🔐", title: "Cifrado de extremo a extremo", desc: "Todos los archivos se suben con cifrado AES-256 para garantizar la seguridad durante la transferencia." },
              { icon: "🧪", title: "Escaneo multi-motor", desc: "Cada APK se verifica con más de 68 motores antivirus antes de ser publicado." },
              { icon: "🔄", title: "Actualizaciones automáticas", desc: "Te notificamos cuando hay una nueva versión disponible." },
              { icon: "📋", title: "Registro de cambios", desc: "Historial completo de todas las modificaciones en cada versión." },
            ]} />

            <FactCard index={11} />
            <TipCard index={8} />

            <div style={{ backgroundColor: C.card, borderRadius: "14px", border: `1px solid ${C.border}`, padding: "18px", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: 700, margin: "0 0 10px 0", color: C.text }}>📰 Noticias del mundo tech</h3>
              {FILLER_FACTS.slice(6, 11).map((fact, i) => (
                <div key={i} style={{ marginBottom: "12px", paddingBottom: "12px", borderBottom: i < 4 ? `1px solid ${C.border}` : "none" }}>
                  <p style={{ fontSize: "12px", color: C.muted, margin: 0, lineHeight: 1.6 }}>{fact}</p>
                </div>
              ))}
            </div>

            <FactCard index={13} />
            <TipCard index={9} />

            <div style={{ backgroundColor: C.card, borderRadius: "14px", border: `1px solid ${C.border}`, padding: "18px", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: 700, margin: "0 0 10px 0", color: C.text }}>💬 Lo que dicen los usuarios</h3>
              {[
                { user: "Carlos M.", text: "¡Increíble! Funciona perfectamente en mi Samsung Galaxy S23.", stars: 5 },
                { user: "Ana L.", text: "La descarga fue rapidísima y el archivo estaba completamente limpio.", stars: 5 },
                { user: "Roberto G.", text: "Llevo 3 meses usando esta app y sigue funcionando de maravilla.", stars: 4 },
                { user: "María P.", text: "Muy fácil de instalar. En menos de 5 minutos tenía todo funcionando.", stars: 5 },
              ].map((review, i) => (
                <div key={i} style={{ marginBottom: i < 3 ? "14px" : 0, paddingBottom: i < 3 ? "14px" : 0, borderBottom: i < 3 ? `1px solid ${C.border}` : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: C.text }}>{review.user}</span>
                    <span style={{ fontSize: "12px", color: C.accent }}>{"★".repeat(review.stars)}{"☆".repeat(5 - review.stars)}</span>
                  </div>
                  <p style={{ fontSize: "12px", color: C.muted, margin: 0, lineHeight: 1.5 }}>{review.text}</p>
                </div>
              ))}
            </div>

            <FactCard index={2} />
            <TipCard index={10} />

            <div style={{ backgroundColor: C.card, borderRadius: "14px", border: `1px solid ${C.border}`, padding: "18px", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: 700, margin: "0 0 10px 0", color: C.text }}>🏆 Apps populares en nuestra tienda</h3>
              {["Spotify Premium", "CapCut Pro", "YouTube Premium", "Netflix Mod", "Minecraft PE", "Free Fire Hack", "Instagram Plus", "WhatsApp Gold"].map((app, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 0", borderBottom: i < 7 ? `1px solid ${C.border}` : "none" }}>
                  <span style={{ fontSize: "14px", fontWeight: 800, color: C.accent, width: "24px" }}>{i + 1}</span>
                  <span style={{ fontSize: "13px", color: C.text, fontWeight: 500 }}>{app}</span>
                  <span style={{ marginLeft: "auto", fontSize: "11px", color: C.green, fontWeight: 600 }}>↓ {((i + 1) * 1379).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <FactCard index={5} />
            <TipCard index={11} />

            {/* Indicador scroll mientras cuenta regresiva */}
            <div style={{ textAlign: "center", padding: "20px 0 8px" }}>
              <div style={{
                display: "inline-flex", flexDirection: "column", alignItems: "center",
                gap: "4px", color: C.light, fontSize: "11px", fontWeight: 600,
                animation: "pulse 2s infinite"
              }}>
                <span>👇 Desliza hacia abajo cuando termine la cuenta</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "bounce 1.5s infinite" }}>
                  <path d="M12 5v14M19 12l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </>
        ) : (
          <>
            <FactCard index={9} />
            <TipCard index={4} />

            <FillerSection title="🛡️ Seguridad y verificación" items={[
              { icon: "🔐", title: "Cifrado de extremo a extremo", desc: "Todos los archivos se suben con cifrado AES-256 para garantizar la seguridad durante la transferencia." },
              { icon: "🧪", title: "Escaneo multi-motor", desc: "Cada APK se verifica con más de 68 motores antivirus antes de ser publicado." },
              { icon: "🔄", title: "Actualizaciones automáticas", desc: "Te notificamos cuando hay una nueva versión disponible." },
              { icon: "📋", title: "Registro de cambios", desc: "Historial completo de todas las modificaciones en cada versión." },
            ]} />

            <FactCard index={11} />
            <TipCard index={8} />

            <div style={{ backgroundColor: C.card, borderRadius: "14px", border: `1px solid ${C.border}`, padding: "18px", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: 700, margin: "0 0 10px 0", color: C.text }}>📰 Noticias del mundo tech</h3>
              {FILLER_FACTS.slice(6, 11).map((fact, i) => (
                <div key={i} style={{ marginBottom: "12px", paddingBottom: "12px", borderBottom: i < 4 ? `1px solid ${C.border}` : "none" }}>
                  <p style={{ fontSize: "12px", color: C.muted, margin: 0, lineHeight: 1.6 }}>{fact}</p>
                </div>
              ))}
            </div>

            <FactCard index={13} />
            <TipCard index={9} />

            <div style={{ backgroundColor: C.card, borderRadius: "14px", border: `1px solid ${C.border}`, padding: "18px", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: 700, margin: "0 0 10px 0", color: C.text }}>💬 Lo que dicen los usuarios</h3>
              {[
                { user: "Carlos M.", text: "¡Increíble! Funciona perfectamente en mi Samsung Galaxy S23.", stars: 5 },
                { user: "Ana L.", text: "La descarga fue rapidísima y el archivo estaba completamente limpio.", stars: 5 },
                { user: "Roberto G.", text: "Llevo 3 meses usando esta app y sigue funcionando de maravilla.", stars: 4 },
                { user: "María P.", text: "Muy fácil de instalar. En menos de 5 minutos tenía todo funcionando.", stars: 5 },
              ].map((review, i) => (
                <div key={i} style={{ marginBottom: i < 3 ? "14px" : 0, paddingBottom: i < 3 ? "14px" : 0, borderBottom: i < 3 ? `1px solid ${C.border}` : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: C.text }}>{review.user}</span>
                    <span style={{ fontSize: "12px", color: C.accent }}>{"★".repeat(review.stars)}{"☆".repeat(5 - review.stars)}</span>
                  </div>
                  <p style={{ fontSize: "12px", color: C.muted, margin: 0, lineHeight: 1.5 }}>{review.text}</p>
                </div>
              ))}
            </div>

            <FactCard index={2} />
            <TipCard index={10} />

            <div style={{ backgroundColor: C.card, borderRadius: "14px", border: `1px solid ${C.border}`, padding: "18px", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: 700, margin: "0 0 10px 0", color: C.text }}>🏆 Apps populares en nuestra tienda</h3>
              {["Spotify Premium", "CapCut Pro", "YouTube Premium", "Netflix Mod", "Minecraft PE", "Free Fire Hack", "Instagram Plus", "WhatsApp Gold"].map((app, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 0", borderBottom: i < 7 ? `1px solid ${C.border}` : "none" }}>
                  <span style={{ fontSize: "14px", fontWeight: 800, color: C.accent, width: "24px" }}>{i + 1}</span>
                  <span style={{ fontSize: "13px", color: C.text, fontWeight: 500 }}>{app}</span>
                  <span style={{ marginLeft: "auto", fontSize: "11px", color: C.green, fontWeight: 600 }}>↓ {((i + 1) * 1379).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <FactCard index={5} />
            <TipCard index={11} />

            {/* Botón Descargar al final */}
            <ScrollToContinue label="descargar">
              <button
                onClick={onContinue}
                className="bounce-click"
                style={{
                  width: "100%", padding: "18px 24px", borderRadius: "14px",
                  backgroundColor: C.green, color: "#ffffff", fontWeight: 700,
                  fontSize: "17px", border: "none", cursor: "pointer",
                  letterSpacing: "0.5px", textTransform: "uppercase",
                  boxShadow: "0 6px 25px rgba(34, 197, 94, 0.4)",
                }}
              >
                ⬇ Descargar
              </button>
            </ScrollToContinue>
          </>
        )}
      </MonetagGate>
    </PageShell>
  );
}

/* ============================================================
   PASO 4 — 5s → link APK final (botón al final)
   ============================================================ */
function Step4({ appName, downloadUrl, onDownload, slug }: {
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
    <PageShell step={4} appName={appName} slug={slug}>
      <MonetagGate slug={slug} step={4}>
        {!ready ? (
          <>
            <div style={{ backgroundColor: C.card, borderRadius: "16px", border: `1px solid ${C.border}`, padding: "30px 20px", marginBottom: "18px", textAlign: "center" }}>
              <div style={{ fontSize: "40px", marginBottom: "10px" }}>🎉</div>
              <div style={{
                width: "90px", height: "90px", borderRadius: "50%", margin: "0 auto 16px",
                display: "flex", alignItems: "center", justifyContent: "center",
                backgroundColor: "rgba(250, 204, 21, 0.12)",
                border: `3px solid ${C.accent}`,
              }}>
                <span style={{ fontSize: "28px", fontWeight: 800, color: "#000" }}>
                  {countdown}
                </span>
              </div>
              <p style={{ fontSize: "15px", color: C.text, fontWeight: 700, margin: "0 0 6px 0" }}>Espera {countdown} segundo{countdown !== 1 ? "s" : ""} para descargar</p>
              <p style={{ fontSize: "12px", color: C.muted, margin: 0, lineHeight: 1.5 }}>Estamos preparando tu archivo APK</p>
              <div style={{ width: "100%", height: "6px", borderRadius: "3px", backgroundColor: C.border, marginTop: "18px", overflow: "hidden" }}>
                <div style={{ width: `${((5 - countdown) / 5) * 100}%`, height: "100%", backgroundColor: C.accent, borderRadius: "3px", transition: "width 1s linear" }} />
              </div>
            </div>

            {/* Info de seguridad */}
            <div style={{ backgroundColor: "#f0fdf4", borderRadius: "14px", border: "1px solid #bbf7d0", padding: "16px", textAlign: "center", marginBottom: "16px" }}>
              <p style={{ fontSize: "13px", color: "#15803d", fontWeight: 700, margin: "0 0 6px 0" }}>🛡️ Archivo Verificado</p>
              <p style={{ fontSize: "12px", color: C.muted, margin: 0, lineHeight: 1.5 }}>Escaneado con 68 motores antivirus — 0 amenazas detectadas</p>
            </div>

            <FactCard index={14} />
            <TipCard index={3} />

            <FillerSection title="🚀 Después de instalar" items={[
              { icon: "🔄", title: "Reinicia tu dispositivo", desc: "Reinicia tu teléfono para que todos los cambios se apliquen correctamente." },
              { icon: "📂", title: "Otorga permisos", desc: "Concede los permisos necesarios para una experiencia completa." },
              { icon: "☁️", title: "Inicia sesión", desc: "Inicia sesión con tu cuenta para sincronizar tus datos en la nube." },
              { icon: "⚙️", title: "Configura a tu gusto", desc: "Personaliza la app: tema, notificaciones, idioma, etc." },
            ]} />

            <FactCard index={7} />
            <TipCard index={1} />

            <div style={{ backgroundColor: C.card, borderRadius: "14px", border: `1px solid ${C.border}`, padding: "18px", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: 700, margin: "0 0 10px 0", color: C.text }}>❓ Preguntas frecuentes</h3>
              {[
                { q: "¿Es seguro descargar esta app?", a: "Sí, todos los archivos son verificados y escaneados antes de publicarse." },
                { q: "¿Necesito root?", a: "No, la app funciona perfectamente en dispositivos sin root." },
                { q: "¿Funciona en todos los Android?", a: "Compatible con Android 7.0 en adelante." },
                { q: "¿Tiene virus?", a: "No, cada archivo pasa por múltiples escaneos antivirus." },
                { q: "¿Es gratis?", a: "Sí, la descarga es completamente gratuita." },
              ].map((faq, i) => (
                <div key={i} style={{ marginBottom: i < 4 ? "12px" : 0, paddingBottom: i < 4 ? "12px" : 0, borderBottom: i < 4 ? `1px solid ${C.border}` : "none" }}>
                  <p style={{ fontSize: "12px", fontWeight: 700, color: C.text, margin: "0 0 4px 0" }}>Q: {faq.q}</p>
                  <p style={{ fontSize: "12px", color: C.muted, margin: 0, lineHeight: 1.5 }}>A: {faq.a}</p>
                </div>
              ))}
            </div>

            <FactCard index={9} />
            <TipCard index={6} />

            <div style={{ backgroundColor: C.card, borderRadius: "14px", border: `1px solid ${C.border}`, padding: "18px", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: 700, margin: "0 0 10px 0", color: C.text }}>🌐 El futuro de las aplicaciones móviles</h3>
              <p style={{ fontSize: "12px", color: C.muted, margin: "0 0 10px 0", lineHeight: 1.7 }}>El mundo de las aplicaciones móviles está en constante evolución. Con la llegada de la inteligencia artificial, el 5G y la computación en la nube, las apps se están volviendo más inteligentes, rápidas y personalizadas que nunca.</p>
              <p style={{ fontSize: "12px", color: C.muted, margin: 0, lineHeight: 1.7 }}>Las aplicaciones progresivas (PWA) están ganando popularidad ya que ofrecen experiencias nativas sin necesidad de instalación. Además, el desarrollo para wearables está abriendo nuevas fronteras.</p>
            </div>

            <FactCard index={12} />
            <TipCard index={9} />

            {/* Indicador scroll mientras cuenta regresiva */}
            <div style={{ textAlign: "center", padding: "20px 0 8px" }}>
              <div style={{
                display: "inline-flex", flexDirection: "column", alignItems: "center",
                gap: "4px", color: C.light, fontSize: "11px", fontWeight: 600,
                animation: "pulse 2s infinite"
              }}>
                <span>👇 Desliza hacia abajo cuando termine la cuenta</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "bounce 1.5s infinite" }}>
                  <path d="M12 5v14M19 12l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Info de seguridad */}
            <div style={{ backgroundColor: "#f0fdf4", borderRadius: "14px", border: "1px solid #bbf7d0", padding: "16px", textAlign: "center", marginBottom: "16px" }}>
              <p style={{ fontSize: "13px", color: "#15803d", fontWeight: 700, margin: "0 0 6px 0" }}>🛡️ Archivo Verificado</p>
              <p style={{ fontSize: "12px", color: C.muted, margin: 0, lineHeight: 1.5 }}>Escaneado con 68 motores antivirus — 0 amenazas detectadas</p>
            </div>

            <FactCard index={14} />
            <TipCard index={3} />

            <FillerSection title="🚀 Después de instalar" items={[
              { icon: "🔄", title: "Reinicia tu dispositivo", desc: "Reinicia tu teléfono para que todos los cambios se apliquen correctamente." },
              { icon: "📂", title: "Otorga permisos", desc: "Concede los permisos necesarios para una experiencia completa." },
              { icon: "☁️", title: "Inicia sesión", desc: "Inicia sesión con tu cuenta para sincronizar tus datos en la nube." },
              { icon: "⚙️", title: "Configura a tu gusto", desc: "Personaliza la app: tema, notificaciones, idioma, etc." },
            ]} />

            <FactCard index={7} />
            <TipCard index={1} />

            <div style={{ backgroundColor: C.card, borderRadius: "14px", border: `1px solid ${C.border}`, padding: "18px", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: 700, margin: "0 0 10px 0", color: C.text }}>❓ Preguntas frecuentes</h3>
              {[
                { q: "¿Es seguro descargar esta app?", a: "Sí, todos los archivos son verificados y escaneados antes de publicarse." },
                { q: "¿Necesito root?", a: "No, la app funciona perfectamente en dispositivos sin root." },
                { q: "¿Funciona en todos los Android?", a: "Compatible con Android 7.0 en adelante." },
                { q: "¿Tiene virus?", a: "No, cada archivo pasa por múltiples escaneos antivirus." },
                { q: "¿Es gratis?", a: "Sí, la descarga es completamente gratuita." },
              ].map((faq, i) => (
                <div key={i} style={{ marginBottom: i < 4 ? "12px" : 0, paddingBottom: i < 4 ? "12px" : 0, borderBottom: i < 4 ? `1px solid ${C.border}` : "none" }}>
                  <p style={{ fontSize: "12px", fontWeight: 700, color: C.text, margin: "0 0 4px 0" }}>Q: {faq.q}</p>
                  <p style={{ fontSize: "12px", color: C.muted, margin: 0, lineHeight: 1.5 }}>A: {faq.a}</p>
                </div>
              ))}
            </div>

            <FactCard index={9} />
            <TipCard index={6} />

            <div style={{ backgroundColor: C.card, borderRadius: "14px", border: `1px solid ${C.border}`, padding: "18px", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: 700, margin: "0 0 10px 0", color: C.text }}>🌐 El futuro de las aplicaciones móviles</h3>
              <p style={{ fontSize: "12px", color: C.muted, margin: "0 0 10px 0", lineHeight: 1.7 }}>El mundo de las aplicaciones móviles está en constante evolución. Con la llegada de la inteligencia artificial, el 5G y la computación en la nube, las apps se están volviendo más inteligentes, rápidas y personalizadas que nunca.</p>
              <p style={{ fontSize: "12px", color: C.muted, margin: 0, lineHeight: 1.7 }}>Las aplicaciones progresivas (PWA) están ganando popularidad ya que ofrecen experiencias nativas sin necesidad de instalación. Además, el desarrollo para wearables está abriendo nuevas fronteras.</p>
            </div>

            <FactCard index={12} />
            <TipCard index={9} />

            {/* Link APK final al final */}
            <ScrollToContinue label="descargar apk">
              <a
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onDownload}
                className="bounce-click"
                style={{
                  display: "block", width: "100%", padding: "20px 24px",
                  borderRadius: "16px", backgroundColor: C.green, color: "#ffffff",
                  fontWeight: 700, fontSize: "18px", border: "none", cursor: "pointer",
                  letterSpacing: "0.5px", textTransform: "uppercase", textDecoration: "none",
                  textAlign: "center", boxShadow: "0 8px 30px rgba(34, 197, 94, 0.45)",
                }}
              >
                ⬇ Descargar APK
              </a>
            </ScrollToContinue>

            {/* Volver */}
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <Link href={`/apps/${slug}`} style={{ fontSize: "13px", color: C.blue, textDecoration: "none", fontWeight: 600 }}>
                ← Volver a la página de {appName}
              </Link>
            </div>
          </>
        )}
      </MonetagGate>
    </PageShell>
  );
}

/* ============================================================
   COMPONENTE PRINCIPAL — gestiona los 4 pasos
   ============================================================ */
export default function DownloadFlow(props: Props) {
  const [step, setStep] = useState(1);

  const goStep2 = useCallback(() => setStep(2), []);
  const goStep3 = useCallback(() => setStep(3), []);
  const goStep4 = useCallback(() => setStep(4), []);

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
      />
    );
  }

  if (step === 2) return <Step2 appName={props.appName} onContinue={goStep3} slug={props.slug} />;
  if (step === 3) return <Step3 appName={props.appName} onContinue={goStep4} slug={props.slug} />;

  return (
    <Step4
      appName={props.appName} downloadUrl={props.downloadUrl}
      onDownload={handleDownload} slug={props.slug}
    />
  );
}
