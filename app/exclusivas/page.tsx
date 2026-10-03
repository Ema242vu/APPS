"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// =============================================
// CONFIGURACIÓN
// =============================================
const ADS_TO_WATCH = 3;
const UNLOCK_HOURS = 24;
const AD_LINK = "https://omg10.com/4/11940275";

// =============================================
// APPS EXCLUSIVAS
// =============================================
const exclusiveApps: {
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  link: string;
  iconUrl: string;
  emoji: string;
  version: string;
  size: string;
  updated: string;
  glow: string;
  border: string;
  text: string;
}[] = [
  {
    slug: "imgbb-pro",
    name: "ImgBB Pro",
    description: "Sube imágenes y obtén enlaces directos sin anuncios ni límites.",
    longDescription: "ImgBB Pro es la versión premium de la popular app para subir imágenes. Sin anuncios, sin marca de agua, con enlaces directos permanentes, subidas ilimitadas y la posibilidad de organizar tus imágenes en álbumes. Perfecta para compartir capturas, memes o fotos en foros, redes sociales y WhatsApp sin perder calidad.",
    link: "https://www.mediafire.com/file/t0usis47hregns6/imgBB+PRO.apk/file",
    iconUrl: "https://i.postimg.cc/hPLXTYT3/435862631f578a3e97774dfe03716b69.jpg",
    emoji: "🖼️",
    version: "4.5.0",
    size: "25 MB",
    updated: "Oct 2026",
    glow: "rgba(20, 184, 166, 0.4)",
    border: "rgba(20, 184, 166, 0.6)",
    text: "#5eead4",
  },
  {
    slug: "mi-store-app",
    name: "Mi Store App Oficial",
    description: "La app oficial de Mi Store con notificaciones de nuevas apps.",
    longDescription: "Próximamente: la app oficial de Mi Store. Recibe notificaciones cuando subamos nuevas apps premium, guarda tus favoritas y accede a contenido exclusivo. Sin anuncios dentro de la app.",
    link: "#",
    iconUrl: "https://i.postimg.cc/QdBk2k5q/13.jpg",
    emoji: "🐱",
    version: "1.0.0",
    size: "15 MB",
    updated: "Próximamente",
    glow: "rgba(250, 204, 21, 0.4)",
    border: "rgba(250, 204, 21, 0.6)",
    text: "#facc15",
  },
  {
    slug: "proxima-app",
    name: "Próxima App Exclusiva",
    description: "Muy pronto subiremos aquí una app hecha por nosotros.",
    longDescription: "Estamos trabajando en una app exclusiva para los usuarios que apoyen viendo anuncios. Muy pronto estará disponible. ¡Gracias por tu apoyo!",
    link: "#",
    iconUrl: "https://i.postimg.cc/QdBk2k5q/13.jpg",
    emoji: "✨",
    version: "1.0.0",
    size: "Por confirmar",
    updated: "Próximamente",
    glow: "rgba(168, 85, 247, 0.4)",
    border: "rgba(168, 85, 247, 0.6)",
    text: "#d8b4fe",
  },
];

export default function Exclusivas() {
  const [unlocked, setUnlocked] = useState(false);
  const [adsWatched, setAdsWatched] = useState(0);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);

    const unlockData = localStorage.getItem("exclusiveUnlock");
    if (unlockData) {
      const { timestamp, ads } = JSON.parse(unlockData);
      const hoursPassed = (Date.now() - timestamp) / (1000 * 60 * 60);
      if (hoursPassed < UNLOCK_HOURS) {
        setUnlocked(true);
        setAdsWatched(ads);
      } else {
        localStorage.removeItem("exclusiveUnlock");
      }
    }

    const interval = setInterval(() => {
      const data = localStorage.getItem("exclusiveUnlock");
      if (data) {
        const { timestamp } = JSON.parse(data);
        const expiresAt = timestamp + UNLOCK_HOURS * 60 * 60 * 1000;
        const diff = expiresAt - Date.now();
        if (diff > 0) {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          setTimeLeft(`${hours}h ${minutes}m`);
        } else {
          setUnlocked(false);
          localStorage.removeItem("exclusiveUnlock");
        }
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleWatchAd = () => {
    window.open(AD_LINK, "_blank");
    const newCount = adsWatched + 1;
    setAdsWatched(newCount);

    if (newCount >= ADS_TO_WATCH) {
      localStorage.setItem(
        "exclusiveUnlock",
        JSON.stringify({ timestamp: Date.now(), ads: newCount })
      );
      setUnlocked(true);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-primary)", color: "var(--text-primary)", fontFamily: "system-ui, sans-serif", padding: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width: "100%", maxWidth: "600px" }}>
        <Link href="/" style={{ color: "#facc15", textDecoration: "none", fontWeight: "bold", display: "inline-block", marginBottom: "30px" }}>
          ← Volver a la tienda
        </Link>

        <h1 style={{ fontSize: "36px", fontWeight: 900, marginBottom: "10px" }}>⭐ Apps Exclusivas</h1>
        <p style={{ color: "var(--text-muted)", marginBottom: "30px", fontSize: "15px" }}>
          Sección VIP con apps creadas por nosotros, sin anuncios internos.
        </p>

        {!unlocked ? (
          <div style={{ padding: "40px 30px", borderRadius: "24px", backgroundColor: "var(--bg-card)", border: "2px solid rgba(250, 204, 21, 0.3)", boxShadow: "0 20px 60px rgba(250, 204, 21, 0.15)", textAlign: "center" }}>
            <div style={{ fontSize: "60px", marginBottom: "20px" }}>🔒</div>
            <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "15px" }}>Zona VIP Bloqueada</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "15px", lineHeight: 1.7, marginBottom: "30px", maxWidth: "400px", margin: "0 auto 30px" }}>
              Para acceder a las apps exclusivas, mira <b style={{ color: "#facc15" }}>{ADS_TO_WATCH} anuncios</b>. Los anuncios nos ayudan a mantener la web gratis y a seguir creando apps sin anuncios internos. 🐱
            </p>

            <div style={{ width: "100%", maxWidth: "300px", height: "8px", borderRadius: "4px", backgroundColor: "rgba(255,255,255,0.1)", margin: "0 auto 15px", overflow: "hidden" }}>
              <div style={{ width: `${(adsWatched / ADS_TO_WATCH) * 100}%`, height: "100%", backgroundColor: "#facc15", borderRadius: "4px", transition: "width 0.5s ease" }}></div>
            </div>
            <p style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "30px" }}>
              {adsWatched} de {ADS_TO_WATCH} anuncios vistos
            </p>

            <button onClick={handleWatchAd} className="bounce-click" style={{ width: "100%", maxWidth: "350px", padding: "18px", borderRadius: "14px", backgroundColor: "#facc15", color: "#0d0d12", fontWeight: "bold", fontSize: "15px", border: "none", cursor: "pointer", textTransform: "uppercase", letterSpacing: "1px", boxShadow: "0 10px 30px rgba(250, 204, 21, 0.4)" }}>
              🎬 Ver anuncio {adsWatched + 1} de {ADS_TO_WATCH}
            </button>

            <p style={{ color: "#6b7280", fontSize: "11px", marginTop: "20px", fontStyle: "italic" }}>
              Después de {ADS_TO_WATCH} anuncios, el acceso se desbloquea por {UNLOCK_HOURS} horas.
            </p>
          </div>
        ) : (
          <>
            <div style={{ padding: "20px", borderRadius: "16px", backgroundColor: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34, 197, 94, 0.3)", marginBottom: "30px", display: "flex", alignItems: "center", gap: "15px" }}>
              <span style={{ fontSize: "32px" }}>✅</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "14px", fontWeight: "bold", color: "#22c55e", margin: 0 }}>Acceso VIP Desbloqueado</p>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>Expira en {timeLeft}. ¡Gracias por apoyarnos! 💛</p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {exclusiveApps.map((app) => (
                <a key={app.slug} href={app.link} target="_blank" rel="noopener noreferrer" className="bounce-click"
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "30px", borderRadius: "20px", backgroundColor: "var(--bg-card)", border: `1px solid ${app.border}`, textDecoration: "none", color: "var(--text-primary)", boxShadow: `0 10px 35px ${app.glow}`, position: "relative" }}>
                  <span style={{ position: "absolute", top: "15px", right: "15px", backgroundColor: "rgba(250, 204, 21, 0.2)", color: "#facc15", padding: "4px 10px", borderRadius: "12px", fontSize: "10px", fontWeight: "bold" }}>⭐ VIP</span>

                  <div style={{ width: "80px", height: "80px", borderRadius: "16px", overflow: "hidden", backgroundColor: "rgba(0,0,0,0.4)", border: `1px solid ${app.border}`, marginBottom: "15px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <img src={app.iconUrl} alt={app.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>

                  <h3 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "8px" }}>{app.name}</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "15px" }}>{app.description}</p>
                  <p style={{ color: "var(--text-muted)", fontSize: "11px", marginBottom: "20px" }}>v{app.version} • {app.size} • {app.updated}</p>

                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", padding: "14px", borderRadius: "12px", fontWeight: "bold", letterSpacing: "1px", textTransform: "uppercase", fontSize: "13px", backgroundColor: app.glow, border: `1px solid ${app.border}`, color: app.text }}>
                    Descargar
                  </span>
                </a>
              ))}
            </div>
          </>
        )}

        <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "12px", marginTop: "40px", fontFamily: "monospace" }}>
          SISTEMA_TERMINADO // HECHO CON 💛 DESDE TERMUX
        </p>
      </div>
    </div>
  );
}
