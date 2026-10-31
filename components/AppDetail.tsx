"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import type { App } from "@/lib/apps";
import { relatedApps } from "@/lib/apps";
import AppCardCompact from "@/components/AppCardCompact";
import Comments from "@/components/Comments";

/* Design tokens (Figma discipline) */
const R = { sm: 2, md: 8, lg: 16, pill: 50 };
const S = { x4: 4, x8: 8, x12: 12, x16: 16, x20: 20, x24: 24, x32: 32, x40: 40, x48: 48 };
const W = { light: 400, reg: 500, med: 600, semi: 700 };

/**
 * Devuelve las funciones premium a mostrar.
 * Prioridad:
 * 1) app.premiumFeatures (custom)
 * 2) app.hasPremiumSection === false → se oculta
 * 3) Fallback por categoría (para apps viejas)
 */
function getPremiumFeatures(app: any): string[] {
  if (app.premiumFeatures && app.premiumFeatures.length > 0) {
    return app.premiumFeatures;
  }
  if (app.hasPremiumSection === false) {
    return [];
  }
  const category = app.category;
  if (category === "Juegos") {
    return [
      "Todos los niveles y personajes desbloqueados",
      "Dinero, monedas y gemas ilimitadas",
      "Sin anuncios ni interrupciones",
      "Vidas y recursos infinitos",
      "Versión completa sin bloqueos",
    ];
  }
  if (category === "Video") {
    return [
      "Sin marca de agua en tus creaciones",
      "Sin anuncios entre sesiones",
      "Efectos y filtros premium desbloqueados",
      "Exportación en máxima calidad (hasta 4K)",
      "Plantillas y música exclusiva",
      "Todas las herramientas Pro",
    ];
  }
  if (category === "Música") {
    return [
      "Música sin anuncios",
      "Saltos ilimitados de canciones",
      "Descargas offline para escuchar sin conexión",
      "Calidad de audio extrema (320kbps)",
      "Reproducción en segundo plano",
    ];
  }
  if (category === "Social") {
    return [
      "Sin anuncios ni publicidad invasiva",
      "Descarga de fotos, videos e historias",
      "Sin restricciones de región",
      "Funciones premium desbloqueadas",
      "Sin marca de agua",
      "Personalización total",
    ];
  }
  if (category === "Educación") {
    return [
      "Sin anuncios entre lecciones",
      "Vidas ilimitadas",
      "Todas las lecciones desbloqueadas",
      "Contenido completo sin restricciones",
      "Práctica ilimitada",
    ];
  }
  if (category === "+18") {
    return [
      "Contenido completo desbloqueado",
      "Sin anuncios",
      "Todas las funciones activadas",
      "Sin restricciones de nivel",
    ];
  }
  if (category === "ROMS" || category === "Add-ons Minecraft") {
    return [];
  }
  return [
    "Sin anuncios ni publicidad",
    "Todas las funciones Pro desbloqueadas",
    "Sin marca de agua",
    "Herramientas premium activadas",
    "Exportación en alta calidad",
    "Sin límites de uso",
  ];
}

export default function AppDetail({ app }: { app: App }) {
  const router = useRouter();

  const [localDownloads, setLocalDownloads] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [shareText, setShareText] = useState("Compartir");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
    const savedFavs = localStorage.getItem("favorites");
    if (savedFavs) setFavorites(JSON.parse(savedFavs));
    const savedRatings = localStorage.getItem("ratings");
    if (savedRatings) setRatings(JSON.parse(savedRatings));
    if (app) {
      const count = parseInt(localStorage.getItem(`downloads-${app.name}`) || "0");
      setLocalDownloads(count);
    }
  }, [app]);

  const isFav = favorites.includes(app.name);
  const rating = ratings[app.name] || 0;
  const hasIcon = app.iconUrl && app.iconUrl !== "AQUI_VA_EL_LINK_DE_LA_IMAGEN";
  const premiumFeatures = getPremiumFeatures(app);
  const showPremiumSection = premiumFeatures.length > 0;
  const totalDownloads = (app.downloads || 0) + localDownloads;

  const toggleFav = () => {
    const newFavs = isFav ? favorites.filter((f) => f !== app.name) : [...favorites, app.name];
    setFavorites(newFavs);
    localStorage.setItem("favorites", JSON.stringify(newFavs));
  };

  const setRating = (v: number) => {
    const newRatings = { ...ratings, [app.name]: v };
    setRatings(newRatings);
    localStorage.setItem("ratings", JSON.stringify(newRatings));
  };

  const handleDownload = () => {
    const newCount = localDownloads + 1;
    setLocalDownloads(newCount);
    localStorage.setItem(`downloads-${app.name}`, newCount.toString());
    router.push(`/dl/${app.slug}`);
  };

  const handleShare = async () => {
    const shareData = {
      title: `${app.name} - PERSONS-COMUNITY`,
      text: `Descarga ${app.name} premium gratis desde PERSONS-COMUNITY 🐾`,
      url: `https://apps-peach-two.vercel.app/apps/${app.slug}`,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        setShareText("¡Copiado!");
        setTimeout(() => setShareText("Compartir"), 2000);
      }
    } catch (err) {}
  };

  /* Reusable styles */
  const cardStyle: React.CSSProperties = {
    padding: S.x20,
    borderRadius: R.lg,
    backgroundColor: "var(--bg-card)",
    border: "1px solid var(--border-color)",
    marginBottom: S.x16,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "10px",
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    fontWeight: W.reg,
  };

  const statsStyle: React.CSSProperties = {
    fontSize: "13px",
    fontWeight: W.semi,
    color: "var(--text-primary)",
    marginTop: S.x4,
  };

  const downloadButtonStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: S.x8,
    width: "100%",
    padding: S.x16,
    borderRadius: R.pill,
    fontWeight: W.semi,
    fontSize: "13px",
    cursor: "pointer",
    border: "none",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    fontFamily: "inherit",
  };

  const checkStyle: React.CSSProperties = {
    width: 18,
    height: 18,
    borderRadius: R.sm,
    background: "linear-gradient(135deg, #facc15, #f59e0b)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "10px",
    color: "#0a0a0f",
    fontWeight: W.semi,
    flexShrink: 0,
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-primary)",
        fontFamily: "Inter, system-ui, sans-serif",
        padding: `${S.x16}px ${S.x16}px 120px`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: 560 }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: S.x20,
          }}
        >
          <button
            onClick={() => router.push("/")}
            className="bounce-click"
            style={{
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              fontSize: "13px",
              fontWeight: W.reg,
              cursor: "pointer",
              padding: 0,
              fontFamily: "inherit",
            }}
          >
            ← Volver
          </button>
          <button
            onClick={handleShare}
            className="bounce-click"
            style={{
              background: "rgba(250, 204, 21, 0.08)",
              border: "1px solid rgba(250, 204, 21, 0.25)",
              borderRadius: R.pill,
              padding: `${S.x8}px ${S.x16}px`,
              color: "#facc15",
              fontSize: "12px",
              fontWeight: W.reg,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {shareText}
          </button>
        </div>

        {/* Breadcrumb */}
        <p
          style={{
            fontSize: "11px",
            color: "var(--text-muted)",
            marginBottom: S.x16,
            fontWeight: W.light,
          }}
        >
          Inicio / {app.category} / {app.name}
        </p>

        {/* Icono + Nombre */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: S.x16,
            marginBottom: S.x24,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: R.lg,
              overflow: "hidden",
              backgroundColor: "rgba(0,0,0,0.4)",
              border: `1px solid ${app.border}`,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <span style={{ fontSize: "40px" }}>{app.emoji}</span>
            {hasIcon && (
              <img
                src={app.iconUrl}
                alt={app.name}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1
              style={{
                fontSize: "22px",
                fontWeight: W.semi,
                margin: 0,
                marginBottom: S.x4,
                lineHeight: 1.2,
                letterSpacing: "-0.3px",
              }}
            >
              {app.name}
            </h1>
            <p
              style={{
                color: "#22c55e",
                fontSize: "12px",
                fontWeight: W.reg,
                margin: 0,
              }}
            >
              {app.version} (Mod) · Última versión
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: S.x8,
                marginTop: S.x8,
              }}
            >
              <span style={{ fontSize: "13px", color: "#facc15" }}>★★★★★</span>
              <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                ({rating > 0 ? rating : "4.4"}/5)
              </span>
            </div>
          </div>
        </div>

        {/* Info rápida */}
        <div
          style={{
            display: "flex",
            padding: S.x16,
            borderRadius: R.lg,
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            marginBottom: S.x16,
          }}
        >
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={labelStyle}>Tamaño</div>
            <div style={statsStyle}>{app.size}</div>
          </div>
          <div style={{ width: 1, backgroundColor: "var(--border-color)" }} />
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={labelStyle}>Descargas</div>
            <div style={statsStyle}>{totalDownloads.toLocaleString()}</div>
          </div>
          <div style={{ width: 1, backgroundColor: "var(--border-color)" }} />
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={labelStyle}>Actualizado</div>
            <div style={statsStyle}>
              {app.updated.split(" ")[0]} {app.updated.split(" ")[1]?.slice(0, 3)}
            </div>
          </div>
        </div>

        {/* Info ROM (solo si aplica) */}
        {app.romInfo && (
          <div style={cardStyle}>
            <h3
              style={{
                fontSize: "13px",
                fontWeight: W.semi,
                color: "var(--text-primary)",
                margin: 0,
                marginBottom: S.x12,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              📋 Info de la ROM
            </h3>
            {app.romInfo.console && (
              <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: `0 0 ${S.x8}px 0` }}>
                <b style={{ color: "var(--text-primary)" }}>Consola:</b> {app.romInfo.console}
              </p>
            )}
            {app.romInfo.emulator && (
              <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: `0 0 ${S.x8}px 0` }}>
                <b style={{ color: "var(--text-primary)" }}>Emulador:</b> {app.romInfo.emulator}
              </p>
            )}
            {app.romInfo.format && (
              <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: `0 0 ${S.x8}px 0` }}>
                <b style={{ color: "var(--text-primary)" }}>Formato:</b> {app.romInfo.format}
              </p>
            )}
            {app.romInfo.instructions && (
              <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0, lineHeight: 1.5 }}>
                <b style={{ color: "var(--text-primary)" }}>Instrucciones:</b> {app.romInfo.instructions}
              </p>
            )}
          </div>
        )}

        {/* Funciones Premium (oculto si está desactivado o vacío) */}
        {showPremiumSection && (
          <div
            style={{
              padding: S.x20,
              borderRadius: R.lg,
              background:
                "linear-gradient(135deg, rgba(250, 204, 21, 0.08), rgba(249, 115, 22, 0.08))",
              border: "1px solid rgba(250, 204, 21, 0.25)",
              marginBottom: S.x16,
            }}
          >
            <h3
              style={{
                fontSize: "13px",
                fontWeight: W.semi,
                color: "#facc15",
                margin: 0,
                marginBottom: S.x16,
                letterSpacing: "0.3px",
                textTransform: "uppercase",
              }}
            >
              ✨ Funciones Premium que obtienes
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: S.x12 }}>
              {premiumFeatures.map((feat, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: S.x12 }}>
                  <span style={checkStyle}>✓</span>
                  <span
                    style={{
                      fontSize: "13px",
                      color: "var(--text-primary)",
                      lineHeight: 1.5,
                      fontWeight: W.light,
                    }}
                  >
                    {feat}
                  </span>
                </div>
              ))}
            </div>
            <div
              style={{
                marginTop: S.x16,
                paddingTop: S.x16,
                borderTop: "1px dashed rgba(250, 204, 21, 0.2)",
                display: "flex",
                alignItems: "center",
                gap: S.x8,
              }}
            >
              <span style={{ fontSize: "11px", color: "#22c55e", fontWeight: W.reg }}>
                🟢 Última versión disponible
              </span>
              <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>• {app.updated}</span>
            </div>
          </div>
        )}

        {/* Mod Features */}
        <div style={cardStyle}>
          <h3
            style={{
              fontSize: "13px",
              fontWeight: W.semi,
              color: "#22c55e",
              margin: 0,
              marginBottom: S.x12,
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            Mod
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: S.x12 }}>
            {[
              "Funciones Premium desbloqueadas.",
              "Libre de anuncios.",
              "Optimización mejorada.",
            ].map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: S.x12 }}>
                <span
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: R.sm,
                    backgroundColor: "#22c55e",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    color: "#fff",
                    fontWeight: W.semi,
                    flexShrink: 0,
                  }}
                >
                  ✓
                </span>
                <span style={{ fontSize: "13px", fontWeight: W.light }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Descarga */}
        <div
          style={{
            padding: S.x20,
            borderRadius: R.lg,
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            marginBottom: S.x16,
          }}
        >
          <h3
            style={{
              fontSize: "15px",
              fontWeight: W.semi,
              color: "var(--text-primary)",
              margin: 0,
              marginBottom: S.x16,
              letterSpacing: "-0.2px",
            }}
          >
            Download links
          </h3>

          <button
            onClick={handleDownload}
            className="bounce-click"
            style={{
              ...downloadButtonStyle,
              backgroundColor: "#22c55e",
              color: "#ffffff",
              marginBottom: S.x8,
            }}
          >
            <span style={{ fontSize: "16px" }}>⬇</span> Descargar Ahora
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: S.x8,
              marginTop: S.x16,
            }}
          >
            <span style={{ fontSize: "14px" }}>🛡️</span>
            <span style={{ fontSize: "11px", color: "#22c55e", fontWeight: W.reg }}>
              Archivo Verificado
            </span>
          </div>
        </div>

        <a
          href="https://chat.whatsapp.com/HoM5JTuNl16BBhFSp1YBkm"
          target="_blank"
          rel="noopener noreferrer"
          className="bounce-click"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: S.x8,
            width: "100%",
            padding: S.x16,
            borderRadius: R.pill,
            backgroundColor: "#0ea5e9",
            color: "#ffffff",
            fontWeight: W.semi,
            fontSize: "13px",
            textDecoration: "none",
            marginBottom: S.x16,
          }}
        >
          ¡Únete para recibir actualizaciones!
        </a>

        <button
          onClick={toggleFav}
          className="bounce-click"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: S.x8,
            width: "100%",
            padding: S.x16,
            borderRadius: R.pill,
            backgroundColor: "transparent",
            border: `1px solid ${isFav ? "#facc15" : "var(--border-color)"}`,
            color: isFav ? "#facc15" : "var(--text-muted)",
            fontWeight: W.semi,
            fontSize: "12px",
            cursor: "pointer",
            marginBottom: S.x16,
            fontFamily: "inherit",
          }}
        >
          {isFav ? "★ Guardado en favoritos" : "☆ Guardar en favoritos"}
        </button>

        {/* Cómo instalar */}
        <div style={cardStyle}>
          <h3
            style={{
              fontSize: "14px",
              fontWeight: W.semi,
              color: "var(--text-primary)",
              margin: 0,
              marginBottom: S.x12,
            }}
          >
            ¿Cómo descargar e instalar {app.name}?
          </h3>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "13px",
              lineHeight: 1.6,
              margin: `0 0 ${S.x8}px 0`,
              fontWeight: W.light,
            }}
          >
            1. Toca el archivo APK de {app.name} descargado.
          </p>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "13px",
              lineHeight: 1.6,
              margin: 0,
              fontWeight: W.light,
            }}
          >
            2. Permite la instalación desde fuentes desconocidas si te lo pide.
          </p>
        </div>

        {/* Descripción */}
        <div style={cardStyle}>
          <h3
            style={{
              fontSize: "14px",
              fontWeight: W.semi,
              color: "var(--text-primary)",
              margin: 0,
              marginBottom: S.x12,
            }}
          >
            Descripción
          </h3>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "13px",
              lineHeight: 1.7,
              margin: 0,
              fontWeight: W.light,
            }}
          >
            {app.longDescription}
          </p>
        </div>

        {/* Apps relacionadas (mismo rubro, empieza por TOP) */}
        {(() => {
          const rel = relatedApps(app);
          if (rel.length === 0) return null;
          return (
            <section style={{ marginTop: S.x32, marginBottom: S.x24 }}>
              <h3
                style={{
                  fontSize: "14px",
                  fontWeight: W.semi,
                  color: "var(--text-primary)",
                  margin: 0,
                  marginBottom: S.x12,
                  letterSpacing: "-0.2px",
                }}
              >
                🔥 Apps relacionadas
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: S.x8,
                }}
              >
                {rel.map((r) => (
                  <AppCardCompact
                    key={r.slug}
                    slug={r.slug}
                    name={r.name.replace(" Premium", "").replace(" VIP", "")}
                    iconUrl={r.iconUrl}
                    emoji={r.emoji}
                    version={r.version}
                    developer={r.developer}
                    updated={r.updated}
                    rating={r.rating}
                    category={r.category}
                  />
                ))}
              </div>
            </section>
          );
        })()}

        <Comments appName={app.name} />

        {/* Botones apoyo */}
        <a
          href="https://ardance.org/4/289d35b8457d3ebf55bb94697b169d11"
          target="_blank"
          rel="noopener noreferrer"
          className="bounce-click"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            marginTop: S.x20,
            padding: S.x16,
            borderRadius: R.pill,
            backgroundColor: "transparent",
            border: "1px dashed #22c55e",
            color: "#86efac",
            fontWeight: W.semi,
            fontSize: "12px",
            textDecoration: "none",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
          }}
        >
          💚 Apóyanos con un clic
        </a>

        <a
          href="https://omg10.com/4/11940275"
          target="_blank"
          rel="noopener noreferrer"
          className="bounce-click"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            marginTop: S.x12,
            padding: S.x16,
            borderRadius: R.pill,
            backgroundColor: "transparent",
            border: "1px dashed #ec4899",
            color: "#f9a8d4",
            fontWeight: W.semi,
            fontSize: "12px",
            textDecoration: "none",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
          }}
        >
          ❤️ Apoya al creador
        </a>
        <p
          style={{
            textAlign: "center",
            color: "var(--text-muted)",
            fontSize: "11px",
            marginTop: S.x12,
            fontStyle: "italic",
            fontWeight: W.light,
          }}
        >
          Muestra un anuncio voluntario y ayúdanos a seguir subiendo apps premium gratis
        </p>

        <p
          style={{
            textAlign: "center",
            color: "var(--text-muted)",
            fontSize: "11px",
            marginTop: S.x32,
            fontFamily: "monospace",
          }}
        >
          PERSONS-COMUNITY // HECHO CON 💛 DESDE TERMUX
        </p>
      </div>
    </div>
  );
}
