"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { apps } from "@/lib/apps";
import AdModal from "@/components/AdModal";
import Comments from "@/components/Comments";
import WaitModal from "@/components/WaitModal";

export default function AppPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const app = apps.find((a) => a.slug === slug);

  const [downloads, setDownloads] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [showAd, setShowAd] = useState(false);
  const [shareText, setShareText] = useState("Compartir");
  const [showWait, setShowWait] = useState(false);
  const [finalUrl, setFinalUrl] = useState("");
  const [showAllOptions, setShowAllOptions] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
    const savedFavs = localStorage.getItem("favorites");
    if (savedFavs) setFavorites(JSON.parse(savedFavs));
    const savedRatings = localStorage.getItem("ratings");
    if (savedRatings) setRatings(JSON.parse(savedRatings));
    if (app) {
      const count = parseInt(localStorage.getItem(`downloads-${app.name}`) || "0");
      setDownloads(count);
    }
  }, [app]);

  if (!app) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-primary)", color: "var(--text-primary)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "20px", fontFamily: "system-ui" }}>
        <h1 style={{ fontSize: "32px" }}>App no encontrada 🐱</h1>
        <button onClick={() => router.push("/")} style={{ padding: "14px 28px", borderRadius: "12px", backgroundColor: "#facc15", color: "#0d0d12", fontWeight: "bold", border: "none", cursor: "pointer" }}>
          Volver a la tienda
        </button>
      </div>
    );
  }

  const isFav = favorites.includes(app.name);
  const rating = ratings[app.name] || 0;
  const hasIcon = app.iconUrl && app.iconUrl !== "AQUI_VA_EL_LINK_DE_LA_IMAGEN";
  const hasAlt = app.altLinks.length > 0;

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

  const handleDownload = (url: string) => {
    const newCount = downloads + 1;
    setDownloads(newCount);
    localStorage.setItem(`downloads-${app.name}`, newCount.toString());
    setFinalUrl(url);
    setShowAd(true);
  };

  const handleAdClose = () => {
    setShowAd(false);
    setShowWait(true);
  };

  const handleWaitContinue = () => {
    setShowWait(false);
    window.open(finalUrl, "_blank");
  };

  const handleShare = async () => {
    const shareData = {
      title: `${app.name} - Mi Store`,
      text: `Descarga ${app.name} premium gratis desde Mi Store 🐾`,
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
    } catch (err) {
      // El usuario canceló
    }
  };

  const labelStyle = { fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" as const, letterSpacing: "1px" };
  const statsStyle = { fontSize: "13px", fontWeight: "bold" as const, color: "var(--text-primary)" };

  const downloadButtonStyle = {
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: "8px",
    width: "100%",
    padding: "16px",
    borderRadius: "12px",
    fontWeight: "bold" as const,
    fontSize: "14px",
    cursor: "pointer",
    border: "none",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
    transition: "all 0.3s ease",
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-primary)", color: "var(--text-primary)", fontFamily: "system-ui, sans-serif", padding: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width: "100%", maxWidth: "600px" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
          <button onClick={() => router.push("/")} className="bounce-click" style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "14px", fontWeight: "bold", cursor: "pointer", padding: 0 }}>
            ← Volver
          </button>
          <button onClick={handleShare} className="bounce-click" style={{ background: "rgba(250, 204, 21, 0.1)", border: "1px solid rgba(250, 204, 21, 0.3)", borderRadius: "20px", padding: "8px 16px", color: "#facc15", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>
            📤 {shareText}
          </button>
        </div>

        {/* Breadcrumb */}
        <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "15px" }}>
          Inicio / {app.category} / {app.name}
        </p>

        {/* Icono + Nombre */}
        <div style={{ display: "flex", alignItems: "center", gap: "18px", marginBottom: "25px" }}>
          <div style={{ width: "90px", height: "90px", borderRadius: "20px", overflow: "hidden", backgroundColor: "rgba(0,0,0,0.4)", border: `2px solid ${app.border}`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 8px 25px ${app.glow}` }}>
            {hasIcon ? (
              <img src={app.iconUrl} alt={app.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <span style={{ fontSize: "45px" }}>{app.emoji}</span>
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ fontSize: "24px", fontWeight: 900, margin: 0, marginBottom: "5px", lineHeight: 1.2 }}>{app.name}</h1>
            <p style={{ color: "#22c55e", fontSize: "13px", fontWeight: "bold", margin: 0 }}>{app.version} (Mod)</p>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
              <span style={{ fontSize: "14px", color: "#facc15" }}>★★★★★</span>
              <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>({rating > 0 ? rating : "4.4"}/5)</span>
            </div>
          </div>
        </div>

        {/* Info rápida */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "20px", padding: "15px", borderRadius: "14px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={labelStyle}>Tamaño</div>
            <div style={statsStyle}>{app.size}</div>
          </div>
          <div style={{ width: "1px", backgroundColor: "var(--border-color)" }}></div>
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={labelStyle}>Descargas</div>
            <div style={statsStyle}>{downloads.toLocaleString()}</div>
          </div>
          <div style={{ width: "1px", backgroundColor: "var(--border-color)" }}></div>
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={labelStyle}>Actualizado</div>
            <div style={statsStyle}>{app.updated.split(" ")[0]} {app.updated.split(" ")[1]?.slice(0,3)}</div>
          </div>
        </div>

        {/* Mod Features */}
        <div style={{ padding: "18px", borderRadius: "14px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", marginBottom: "20px" }}>
          <h3 style={{ fontSize: "14px", fontWeight: 900, color: "#22c55e", margin: 0, marginBottom: "12px", letterSpacing: "1px" }}>MOD</h3>
          <div style={{ width: "100%", height: "3px", backgroundColor: "#22c55e", borderRadius: "2px", marginBottom: "15px", maxWidth: "80px" }}></div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ width: "20px", height: "20px", borderRadius: "4px", backgroundColor: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "#fff", fontWeight: "bold" }}>✓</span>
              <span style={{ fontSize: "13px" }}>Funciones Premium desbloqueadas.</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ width: "20px", height: "20px", borderRadius: "4px", backgroundColor: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "#fff", fontWeight: "bold" }}>✓</span>
              <span style={{ fontSize: "13px" }}>Libre de anuncios.</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ width: "20px", height: "20px", borderRadius: "4px", backgroundColor: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "#fff", fontWeight: "bold" }}>✓</span>
              <span style={{ fontSize: "13px" }}>Optimización mejorada.</span>
            </div>
          </div>
        </div>

        {/* DOWNLOAD LINKS - Aquí está el cambio principal */}
        <div style={{ padding: "20px", borderRadius: "16px", backgroundColor: "var(--bg-card)", border: `1px solid ${app.border}`, marginBottom: "20px", boxShadow: `0 10px 30px ${app.glow}` }}>
          <h3 style={{ fontSize: "16px", fontWeight: 900, color: "var(--text-primary)", margin: 0, marginBottom: "15px" }}>Download links</h3>

          {/* Botón principal */}
          <button
            onClick={() => handleDownload(app.link)}
            className="bounce-click"
            style={{ ...downloadButtonStyle, backgroundColor: "#22c55e", color: "#ffffff", marginBottom: "10px", boxShadow: "0 6px 20px rgba(34, 197, 94, 0.4)" }}
          >
            <span style={{ fontSize: "18px" }}>⬇</span> Última Versión
          </button>

          {/* Botón para mostrar más opciones */}
          {hasAlt && (
            <>
              <button
                onClick={() => setShowAllOptions(!showAllOptions)}
                className="bounce-click"
                style={{ ...downloadButtonStyle, backgroundColor: "#16a34a", color: "#ffffff", boxShadow: "0 6px 20px rgba(22, 163, 74, 0.3)" }}
              >
                <span style={{ fontSize: "18px" }}>⬇</span> {showAllOptions ? "Ocultar opciones" : `Más opciones (${app.altLinks.length})`}
              </button>

              {/* Opciones alternativas desplegables */}
              {showAllOptions && (
                <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
                  {app.altLinks.map((alt, i) => (
                    <button
                      key={i}
                      onClick={() => handleDownload(alt.url)}
                      className="bounce-click"
                      style={{ ...downloadButtonStyle, backgroundColor: "rgba(34, 197, 94, 0.15)", color: "#86efac", border: "1px solid rgba(34, 197, 94, 0.4)" }}
                    >
                      <span style={{ fontSize: "16px" }}>⬇</span> {alt.label}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Verificado */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "15px" }}>
            <span style={{ fontSize: "16px" }}>🛡️</span>
            <span style={{ fontSize: "12px", color: "#22c55e", fontWeight: "bold" }}>Archivo Verificado</span>
          </div>
        </div>

        {/* Botón unirse */}
        <a
          href="https://chat.whatsapp.com/HoM5JTuNl16BBhFSp1YBkm"
          target="_blank"
          rel="noopener noreferrer"
          className="bounce-click"
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", width: "100%", padding: "14px", borderRadius: "14px", backgroundColor: "#0ea5e9", color: "#ffffff", fontWeight: "bold", fontSize: "14px", textDecoration: "none", marginBottom: "25px" }}
        >
          🔥 ¡Únete para recibir actualizaciones!
        </a>

        {/* Favorito */}
        <button
          onClick={toggleFav}
          className="bounce-click"
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", width: "100%", padding: "14px", borderRadius: "12px", backgroundColor: "transparent", border: `1px solid ${isFav ? "#facc15" : "var(--border-color)"}`, color: isFav ? "#facc15" : "var(--text-muted)", fontWeight: "bold", fontSize: "13px", cursor: "pointer", marginBottom: "25px" }}
        >
          {isFav ? "★ Guardado en favoritos" : "☆ Guardar en favoritos"}
        </button>

        {/* Descripción */}
        <div style={{ padding: "25px", borderRadius: "16px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", marginBottom: "20px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 900, color: "var(--text-primary)", margin: 0, marginBottom: "12px" }}>📝 ¿Cómo descargar e instalar {app.name} APK?</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: 1.7, margin: 0, marginBottom: "10px" }}>
            1. Toca el archivo APK de {app.name} descargado.
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: 1.7, margin: 0 }}>
            2. Permite la instalación desde fuentes desconocidas si te lo pide.
          </p>
        </div>

        {/* Descripción larga */}
        <div style={{ padding: "25px", borderRadius: "16px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", marginBottom: "20px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 900, color: "var(--text-primary)", margin: 0, marginBottom: "12px" }}>📄 Descripción</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: 1.8, margin: 0 }}>{app.longDescription}</p>
        </div>

        {/* Comentarios */}
        <Comments appName={app.name} />

        {/* Botones de apoyo */}
        <a
          href="https://omg10.com/4/11940275"
          target="_blank"
          rel="noopener noreferrer"
          className="bounce-click"
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", width: "100%", marginTop: "20px", padding: "16px", borderRadius: "14px", backgroundColor: "transparent", border: "2px dashed #ec4899", color: "#f9a8d4", fontWeight: "bold", fontSize: "14px", textDecoration: "none", letterSpacing: "1px", textTransform: "uppercase" }}
        >
          ❤️ Apoya al creador
        </a>

        <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "12px", marginTop: "30px", fontFamily: "monospace" }}>
          SISTEMA_TERMINADO // HECHO CON 💛 DESDE TERMUX
        </p>
      </div>

      <AdModal isOpen={showAd} onClose={handleAdClose} appName={app.name} />

      <WaitModal
        isOpen={showWait}
        onClose={() => setShowWait(false)}
        onContinue={handleWaitContinue}
        appName={app.name}
        appIcon={app.iconUrl}
        appEmoji={app.emoji}
        appSize={app.size}
        appVersion={app.version}
        appCategory={app.category}
      />
    </div>
  );
}
