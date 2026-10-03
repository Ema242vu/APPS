"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { apps } from "@/lib/apps";
import AdModal from "@/components/AdModal";
import Comments from "@/components/Comments";
import NativeBanner from "@/components/NativeBanner";
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
  const [pendingUrl, setPendingUrl] = useState("");
  const [shareText, setShareText] = useState("Compartir");
  const [showWait, setShowWait] = useState(false);
  const [finalUrl, setFinalUrl] = useState("");

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
    setPendingUrl("");
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

  const bigButtonStyle = {
    padding: "18px",
    borderRadius: "14px",
    backgroundColor: app.glow,
    border: `1px solid ${app.border}`,
    color: app.text,
    fontWeight: "bold" as const,
    fontSize: "15px",
    cursor: "pointer",
    textTransform: "uppercase" as const,
    letterSpacing: "1px",
    boxShadow: `0 0 25px ${app.glow}`,
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-primary)", color: "var(--text-primary)", fontFamily: "system-ui, sans-serif", padding: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width: "100%", maxWidth: "600px" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <button onClick={() => router.push("/")} className="bounce-click" style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "14px", fontWeight: "bold", cursor: "pointer", padding: 0 }}>
            ← Volver a la tienda
          </button>
          <button onClick={handleShare} className="bounce-click" style={{ background: "rgba(250, 204, 21, 0.1)", border: "1px solid rgba(250, 204, 21, 0.3)", borderRadius: "20px", padding: "8px 16px", color: "#facc15", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>
            📤 {shareText}
          </button>
        </div>

        {/* Cabecera */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "40px 20px", borderRadius: "24px", backgroundColor: "var(--bg-card)", border: `1px solid ${app.border}`, boxShadow: `0 15px 45px ${app.glow}` }}>

          <div style={{ width: "120px", height: "120px", borderRadius: "24px", overflow: "hidden", backgroundColor: "rgba(0,0,0,0.4)", border: `2px solid ${app.border}`, marginBottom: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {hasIcon ? (
              <img src={app.iconUrl} alt={app.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <span style={{ fontSize: "60px" }}>{app.emoji}</span>
            )}
          </div>

          <h1 style={{ fontSize: "32px", fontWeight: 900, marginBottom: "10px" }}>{app.name}</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "15px", marginBottom: "20px" }}>{app.description}</p>

          <div style={{ display: "flex", gap: "6px", marginBottom: "20px" }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <span key={s} onClick={() => setRating(s)} style={{ fontSize: "28px", cursor: "pointer", color: rating >= s ? "#facc15" : "var(--text-muted)" }}>★</span>
            ))}
          </div>

          <div style={{ display: "flex", gap: "20px", marginBottom: "25px", flexWrap: "wrap", justifyContent: "center" }}>
            <div style={{ textAlign: "center" }}>
              <div style={labelStyle}>Versión</div>
              <div style={{ fontSize: "14px", fontWeight: "bold" }}>{app.version}</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={labelStyle}>Tamaño</div>
              <div style={{ fontSize: "14px", fontWeight: "bold" }}>{app.size}</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={labelStyle}>Actualizado</div>
              <div style={{ fontSize: "14px", fontWeight: "bold" }}>{app.updated}</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={labelStyle}>Descargas</div>
              <div style={{ fontSize: "14px", fontWeight: "bold", color: "#facc15" }}>{downloads.toLocaleString()}</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", width: "100%", maxWidth: "400px" }}>
            <button onClick={() => handleDownload(app.link)} className="bounce-click" style={{ ...bigButtonStyle, flex: 2 }}>
              ⬇ {hasAlt ? "Descargar · Opción 1" : "Descargar"}
            </button>
            <button onClick={toggleFav} className="bounce-click" style={{ flex: 1, padding: "18px", borderRadius: "14px", backgroundColor: "transparent", border: `1px solid ${isFav ? "#facc15" : "var(--border-color)"}`, color: isFav ? "#facc15" : "var(--text-muted)", fontSize: "22px", cursor: "pointer" }}>
              {isFav ? "★" : "☆"}
            </button>
          </div>
        </div>

        {/* Descripción */}
        <div style={{ marginTop: "30px", padding: "30px", borderRadius: "20px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "15px" }}>📝 Descripción</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "15px", lineHeight: 1.8 }}>{app.longDescription}</p>
        </div>

        {/* Información */}
        <div style={{ marginTop: "20px", padding: "25px", borderRadius: "20px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "15px" }}>ℹ️ Información</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px", color: "var(--text-muted)" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>Categoría:</span><b style={{ color: "var(--text-primary)" }}>{app.category}</b></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>Versión:</span><b style={{ color: "var(--text-primary)" }}>{app.version}</b></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>Tamaño:</span><b style={{ color: "var(--text-primary)" }}>{app.size}</b></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>Actualizado:</span><b style={{ color: "var(--text-primary)" }}>{app.updated}</b></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>Opciones de descarga:</span><b style={{ color: "var(--text-primary)" }}>{1 + app.altLinks.length}</b></div>
          </div>
        </div>

        {/* Opciones alternativas */}
        {hasAlt && (
          <div style={{ marginTop: "30px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "30px 20px", borderRadius: "24px", backgroundColor: "var(--bg-card)", border: `1px solid ${app.border}`, boxShadow: `0 15px 45px ${app.glow}` }}>
            <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "8px" }}>¿No funciona o está desactualizada?</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "20px" }}>Es la misma app, pero de otro creador.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%", maxWidth: "400px" }}>
              {app.altLinks.map((alt, i) => (
                <button key={i} onClick={() => handleDownload(alt.url)} className="bounce-click" style={{ ...bigButtonStyle, width: "100%" }}>
                  ⬇ Descargar · {alt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Adsterra Native Banner */}
        <NativeBanner />

        {/* Comentarios */}
        <Comments appName={app.name} />

        {/* Botón Adsterra Enlace Directo */}
        <a
          href="https://ardance.org/4/289d35b8457d3ebf55bb94697b169d11"
          target="_blank"
          rel="noopener noreferrer"
          className="bounce-click"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
            width: "100%", marginTop: "30px", padding: "18px", borderRadius: "16px",
            backgroundColor: "transparent", border: "2px dashed #22c55e", color: "#86efac",
            fontWeight: "bold", fontSize: "15px", textDecoration: "none",
            letterSpacing: "1px", textTransform: "uppercase",
          }}
        >
          💚 Apóyanos con un clic
        </a>

        {/* Apoya al creador (Monetag) */}
        <a
          href="https://omg10.com/4/11940275"
          target="_blank"
          rel="noopener noreferrer"
          className="bounce-click"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
            width: "100%", marginTop: "15px", padding: "18px", borderRadius: "16px",
            backgroundColor: "transparent", border: "2px dashed #ec4899", color: "#f9a8d4",
            fontWeight: "bold", fontSize: "15px", textDecoration: "none",
            letterSpacing: "1px", textTransform: "uppercase",
          }}
        >
          ❤️ Apoya al creador
        </a>
        <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "12px", marginTop: "10px", fontStyle: "italic" }}>
          Muestra un anuncio voluntario y ayúdanos a seguir subiendo apps premium gratis 🐱
        </p>

        <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "12px", marginTop: "30px", fontFamily: "monospace" }}>
          SISTEMA_TERMINADO // HECHO CON 💛 DESDE TERMUX
        </p>
      </div>

      {/* Modal de anuncio */}
      <AdModal isOpen={showAd} onClose={handleAdClose} appName={app.name} />

      {/* Página de espera de 5 segundos */}
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
