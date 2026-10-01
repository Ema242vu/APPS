"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { apps } from "@/lib/apps";

export default function AppPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const app = apps.find(a => a.slug === slug);

  const [downloads, setDownloads] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
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
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px', fontFamily: 'system-ui' }}>
        <h1 style={{ fontSize: '32px' }}>App no encontrada 🐱</h1>
        <button onClick={() => router.push('/')} style={{ padding: '14px 28px', borderRadius: '12px', backgroundColor: '#facc15', color: '#0d0d12', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
          Volver a la tienda
        </button>
      </div>
    );
  }

  const isFav = favorites.includes(app.name);
  const rating = ratings[app.name] || 0;

  const toggleFav = () => {
    const newFavs = isFav ? favorites.filter(f => f !== app.name) : [...favorites, app.name];
    setFavorites(newFavs);
    localStorage.setItem("favorites", JSON.stringify(newFavs));
  };

  const setRating = (v: number) => {
    const newRatings = { ...ratings, [app.name]: v };
    setRatings(newRatings);
    localStorage.setItem("ratings", JSON.stringify(newRatings));
  };

  const handleDownload = () => {
    const newCount = downloads + 1;
    setDownloads(newCount);
    localStorage.setItem(`downloads-${app.name}`, newCount.toString());
    window.open(app.link, "_blank");
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: 'system-ui, sans-serif', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '600px' }}>

        <button onClick={() => router.push('/')} className="bounce-click" style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '30px', padding: 0 }}>
          ← Volver a la tienda
        </button>

        {/* Cabecera de la app */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '40px 20px', borderRadius: '24px', backgroundColor: 'var(--bg-card)', border: `1px solid ${app.border}`, boxShadow: `0 15px 45px ${app.glow}` }}>
          
          <div style={{ width: '120px', height: '120px', borderRadius: '24px', overflow: 'hidden', backgroundColor: 'rgba(0,0,0,0.4)', border: `2px solid ${app.border}`, marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {app.iconUrl && app.iconUrl !== "AQUI_VA_EL_LINK_DE_LA_IMAGEN" ? (
              <img src={app.iconUrl} alt={app.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ fontSize: '60px' }}>{app.emoji}</span>
            )}
          </div>

          <h1 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '10px' }}>{app.name}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '20px' }}>{app.description}</p>

          {/* Rating */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
            {[1, 2, 3, 4, 5].map(s => (
              <span key={s} onClick={() => setRating(s)} style={{ fontSize: '28px', cursor: 'pointer', color: rating >= s ? '#facc15' : 'var(--text-muted)' }}>★</span>
            ))}
          </div>

          {/* Info: versión, tamaño, fecha */}
          <div style={{ display: 'flex', gap: '20px', marginBottom: '25px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Versión</div>
              <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{app.version}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Tamaño</div>
              <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{app.size}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Actualizado</div>
              <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{app.updated}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Descargas</div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#facc15' }}>{downloads.toLocaleString()}</div>
            </div>
          </div>

          {/* Botones */}
          <div style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: '400px' }}>
            <button onClick={handleDownload} className="bounce-click" style={{ flex: 2, padding: '18px', borderRadius: '14px', backgroundColor: app.glow, border: `1px solid ${app.border}`, color: app.text, fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px', boxShadow: `0 0 25px ${app.glow}` }}>
              ⬇ Descargar
            </button>
            <button onClick={toggleFav} className="bounce-click" style={{ flex: 1, padding: '18px', borderRadius: '14px', backgroundColor: 'transparent', border: `1px solid ${isFav ? '#facc15' : 'var(--border-color)'}`, color: isFav ? '#facc15' : 'var(--text-muted)', fontSize: '22px', cursor: 'pointer' }}>
              {isFav ? '★' : '☆'}
            </button>
          </div>
        </div>

        {/* Descripción larga */}
        <div style={{ marginTop: '30px', padding: '30px', borderRadius: '20px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px' }}>📝 Descripción</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.8 }}>{app.longDescription}</p>
        </div>

        {/* Info adicional */}
        <div style={{ marginTop: '20px', padding: '25px', borderRadius: '20px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' }}>ℹ️ Información</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Categoría:</span><b style={{ color: 'var(--text-primary)' }}>{app.category}</b></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Versión:</span><b style={{ color: 'var(--text-primary)' }}>{app.version}</b></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Tamaño:</span><b style={{ color: 'var(--text-primary)' }}>{app.size}</b></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Actualizado:</span><b style={{ color: 'var(--text-primary)' }}>{app.updated}</b></div>
          </div>
        </div>

        {/* CTA final */}
        <button onClick={handleDownload} className="bounce-click" style={{ width: '100%', marginTop: '30px', padding: '20px', borderRadius: '16px', backgroundColor: '#facc15', color: '#0d0d12', fontWeight: 'bold', fontSize: '16px', border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Descargar {app.name.replace(" Premium", "").replace(" VIP", "")} gratis
        </button>

        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px', marginTop: '30px', fontFamily: 'monospace' }}>
          SISTEMA_TERMINADO // HECHO CON 💛 DESDE TERMUX
        </p>
      </div>
    </div>
  );
}
