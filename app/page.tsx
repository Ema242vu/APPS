"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { apps, categorias } from "@/lib/apps";
import AdModal from "@/components/AdModal";

function FloatingParticles() {
  const [particles, setParticles] = useState<any[]>([]);
  useEffect(() => {
    const newParticles = Array.from({ length: 6 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 15 + 10,
      duration: Math.random() * 25 + 20,
      delay: Math.random() * 20,
    }));
    setParticles(newParticles);
  }, []);
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {particles.map(p => (
        <img key={p.id} src="https://i.postimg.cc/ZK5PMs9t/c9ffe8d5229986251e05870abbabb612.jpg" alt="" className="particle" style={{ left: `${p.left}%`, width: `${p.size}px`, height: `${p.size}px`, animationDuration: `${p.duration}s`, animationDelay: `${p.delay}s`, opacity: 0.15 }} />
      ))}
    </div>
  );
}

export default function Home() {
  const [hasEntered, setHasEntered] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [theme, setTheme] = useState("dark");
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [favorites, setFavorites] = useState<string[]>([]);
  const [hoveredApp, setHoveredApp] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCookies, setShowCookies] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const [pendingAppName, setPendingAppName] = useState("");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
    const savedRatings = localStorage.getItem("ratings");
    if (savedRatings) setRatings(JSON.parse(savedRatings));
    const savedFavs = localStorage.getItem("favorites");
    if (savedFavs) setFavorites(JSON.parse(savedFavs));
    if (!localStorage.getItem("cookiesAccepted")) setShowCookies(true);
    setTimeout(() => setLoading(false), 1200);
  }, []);

  const toggleTheme = (newTheme: string) => {
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const toggleFavorite = (appName: string, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    const newFavs = favorites.includes(appName) ? favorites.filter(f => f !== appName) : [...favorites, appName];
    setFavorites(newFavs);
    localStorage.setItem("favorites", JSON.stringify(newFavs));
  };

  const setRating = (appName: string, value: number, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    const newRatings = { ...ratings, [appName]: value };
    setRatings(newRatings);
    localStorage.setItem("ratings", JSON.stringify(newRatings));
  };

  const filteredApps = apps.filter((app) => {
    const matchesCategory = selectedCategory === 0 || app.category === categorias[selectedCategory];
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) || app.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  const topApps = apps.filter(a => a.isTop);
  const newApps = apps.filter(a => a.isNew);
  const gameApps = apps.filter(a => a.category === "Juegos");

  const themeColors: Record<string, { bg: string, text: string, muted: string, card: string }> = {
    dark: { bg: '#0d0d12', text: '#ffffff', muted: '#9ca3af', card: 'rgba(255,255,255,0.03)' },
    light: { bg: '#f5f5f7', text: '#0d0d12', muted: '#6b7280', card: 'rgba(255,255,255,0.9)' },
    cyberpunk: { bg: '#0a0014', text: '#e0d4ff', muted: '#a78bfa', card: 'rgba(139,92,246,0.08)' },
    sunset: { bg: '#1a0a0a', text: '#ffe4c4', muted: '#fdba74', card: 'rgba(251,146,60,0.08)' },
    ice: { bg: '#0a0f1a', text: '#e2e8f0', muted: '#94a3b8', card: 'rgba(148,163,184,0.08)' },
  };
  const c = themeColors[theme] || themeColors.dark;

  if (!hasEntered) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0d0d12', color: '#ffffff', fontFamily: 'system-ui, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '400px', padding: '40px 30px', borderRadius: '24px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>🛡️</div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px' }}>Zona de Descargas</h1>
          <p style={{ color: '#9ca3af', fontSize: '16px', lineHeight: 1.6, marginBottom: '30px' }}>Entrarás a la zona de descargas. Son <b>apps modificadas de terceros</b>: descárgalas bajo tu propia responsabilidad. Gracias al grupo DC se encuentran estas apps. ¡Bienvenid@!</p>
          <button onClick={() => setHasEntered(true)} className="bounce-click" style={{ width: '100%', padding: '18px', borderRadius: '14px', backgroundColor: '#facc15', color: '#0d0d12', fontWeight: 'bold', fontSize: '16px', border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px', boxShadow: '0 4px 20px rgba(250, 204, 21, 0.4)' }}>Entrar a la tienda</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: c.bg, color: c.text, fontFamily: 'system-ui, sans-serif', position: 'relative', overflow: 'hidden', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'background-color 0.5s ease' }}>
      <FloatingParticles />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'} 1px, transparent 1px), linear-gradient(90deg, ${theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'} 1px, transparent 1px)`, backgroundSize: '40px 40px', zIndex: 1, pointerEvents: 'none' }}></div>

      <div style={{ width: '100%', maxWidth: '700px', position: 'relative', zIndex: 10 }}>

        {/* HEADER */}
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px', borderBottom: `1px solid ${c.muted}22`, marginBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src="https://i.postimg.cc/QdBk2k5q/13.jpg" alt="Logo" style={{ width: '45px', height: '45px', borderRadius: '12px', objectFit: 'cover', border: '2px solid #facc15' }} />
            <div>
              <p className="animated-gradient" style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '1px', background: `linear-gradient(to right, ${c.text}, #facc15, ${c.text})`, backgroundSize: '200% 200%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textTransform: 'uppercase', margin: 0, lineHeight: 1 }}>Mi Store</p>
              <p style={{ fontSize: '11px', color: c.muted, margin: 0 }}>Apps premium gratis</p>
            </div>
          </div>
          <select value={theme} onChange={(e) => toggleTheme(e.target.value)} style={{ background: 'rgba(128,128,128,0.1)', border: `1px solid ${c.muted}33`, borderRadius: '10px', padding: '6px 10px', color: c.text, fontSize: '12px', cursor: 'pointer', outline: 'none' }}>
            <option value="dark">🌙 Dark</option>
            <option value="light">☀️ Light</option>
            <option value="cyberpunk">🟣 Cyberpunk</option>
            <option value="sunset">🌅 Sunset</option>
            <option value="ice">❄️ Ice</option>
          </select>
        </nav>

        {/* HERO */}
        <section style={{ textAlign: 'center', marginBottom: '35px' }}>
          <h1 style={{ fontSize: '42px', fontWeight: 900, lineHeight: 1.1, marginBottom: '15px', letterSpacing: '-1px', color: c.text }}>
            🔥 Apps Premium y <br />
            <span className="animated-gradient" style={{ background: 'linear-gradient(90deg, #facc15, #f59e0b, #fbbf24, #facc15)', backgroundSize: '200% 200%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'gradient-shift 4s ease infinite' }}>Juegos Hackeados Gratis</span>
          </h1>
          <p style={{ color: c.muted, fontSize: '14px', lineHeight: 1.6, maxWidth: '500px', margin: '0 auto 25px' }}>
            Encuentra lo mejor en aplicaciones premium y juegos hackeados para Android.
          </p>

          {/* Redes Sociales */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}>
            <a href="https://chat.whatsapp.com/HoM5JTuNl16BBhFSp1YBkm" target="_blank" rel="noopener noreferrer" style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: 'rgba(37, 211, 102, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', fontSize: '20px', border: '1px solid rgba(37, 211, 102, 0.3)' }}>
              💬
            </a>
            <a href="https://t.me" target="_blank" rel="noopener noreferrer" style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: 'rgba(14, 165, 233, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', fontSize: '20px', border: '1px solid rgba(14, 165, 233, 0.3)' }}>
              ✈️
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: 'rgba(236, 72, 153, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', fontSize: '20px', border: '1px solid rgba(236, 72, 153, 0.3)' }}>
              🎵
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: 'rgba(220, 38, 38, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', fontSize: '20px', border: '1px solid rgba(220, 38, 38, 0.3)' }}>
              ▶️
            </a>
          </div>
        </section>

        {/* BUSCADOR GRANDE */}
        <div style={{ position: 'relative', marginBottom: '30px' }}>
          <input
            type="text"
            placeholder="Busca una aplicación o juego..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '18px 60px 18px 20px',
              borderRadius: '16px',
              backgroundColor: c.card,
              border: `1px solid ${c.muted}33`,
              color: c.text,
              fontSize: '15px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          <div style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#facc15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', color: '#0d0d12', fontWeight: 'bold' }}>
            🔍
          </div>
        </div>

        {/* NAVEGACIÓN GRANDE */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '35px' }}>
          <Link href="/" className="bounce-click" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '18px 10px', borderRadius: '16px', backgroundColor: 'rgba(250, 204, 21, 0.15)', border: '1px solid rgba(250, 204, 21, 0.3)', textDecoration: 'none', color: c.text, textAlign: 'center' }}>
            <span style={{ fontSize: '28px' }}>🏠</span>
            <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Inicio</span>
          </Link>
          <Link href="/exclusivas" className="bounce-click" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '18px 10px', borderRadius: '16px', backgroundColor: 'rgba(236, 72, 153, 0.15)', border: '1px solid rgba(236, 72, 153, 0.3)', textDecoration: 'none', color: c.text, textAlign: 'center' }}>
            <span style={{ fontSize: '28px' }}>⭐</span>
            <span style={{ fontSize: '12px', fontWeight: 'bold' }}>VIP</span>
          </Link>
          <Link href="/escaner" className="bounce-click" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '18px 10px', borderRadius: '16px', backgroundColor: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)', textDecoration: 'none', color: c.text, textAlign: 'center' }}>
            <span style={{ fontSize: '28px' }}>🔍</span>
            <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Escáner</span>
          </Link>
          <Link href="/blog" className="bounce-click" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '18px 10px', borderRadius: '16px', backgroundColor: 'rgba(14, 165, 233, 0.15)', border: '1px solid rgba(14, 165, 233, 0.3)', textDecoration: 'none', color: c.text, textAlign: 'center' }}>
            <span style={{ fontSize: '28px' }}>📚</span>
            <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Blog</span>
          </Link>
          <Link href="/tutorial" className="bounce-click" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '18px 10px', borderRadius: '16px', backgroundColor: 'rgba(168, 85, 247, 0.15)', border: '1px solid rgba(168, 85, 247, 0.3)', textDecoration: 'none', color: c.text, textAlign: 'center' }}>
            <span style={{ fontSize: '28px' }}>📖</span>
            <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Tutorial</span>
          </Link>
          <Link href="/faq" className="bounce-click" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '18px 10px', borderRadius: '16px', backgroundColor: 'rgba(249, 115, 22, 0.15)', border: '1px solid rgba(249, 115, 22, 0.3)', textDecoration: 'none', color: c.text, textAlign: 'center' }}>
            <span style={{ fontSize: '28px' }}>❓</span>
            <span style={{ fontSize: '12px', fontWeight: 'bold' }}>FAQ</span>
          </Link>
        </div>

        {/* BANNER VIP GRANDE */}
        <Link href="/exclusivas" className="bounce-click" style={{ display: 'block', textDecoration: 'none', marginBottom: '30px' }}>
          <div style={{
            padding: '25px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)',
            border: '2px solid rgba(236, 72, 153, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
          }}>
            <div style={{ fontSize: '50px' }}>⭐</div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '20px', fontWeight: 900, color: c.text, margin: 0, marginBottom: '5px' }}>Sección VIP</h2>
              <p style={{ fontSize: '13px', color: c.muted, margin: 0, lineHeight: 1.5 }}>Apps exclusivas sin anuncios internos. Mira 3 anuncios y desbloquea 24h de acceso.</p>
            </div>
            <span style={{ fontSize: '24px', color: '#f9a8d4' }}>→</span>
          </div>
        </Link>

        {/* TOP DESCARGAS */}
        {topApps.length > 0 && (
          <section style={{ marginBottom: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#facc15', margin: 0 }}>🔥 Apps Populares</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
              {topApps.slice(0, 6).map((app, i) => (
                <Link key={i} href={`/apps/${app.slug}`} className="zoom-hover" style={{ padding: '15px', borderRadius: '16px', backgroundColor: c.card, border: `1px solid ${c.muted}22`, textDecoration: 'none', color: c.text, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '14px', overflow: 'hidden', backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {app.iconUrl && app.iconUrl !== "AQUI_VA_EL_LINK_DE_LA_IMAGEN" ? <img src={app.iconUrl} alt={app.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '30px' }}>{app.emoji}</span>}
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>{app.name.replace(" Premium", "").replace(" VIP", "")}</span>
                  <span style={{ fontSize: '10px', color: c.muted }}>{app.version}</span>
                  <div style={{ display: 'flex', gap: '2px', fontSize: '11px', color: '#facc15' }}>★★★★★</div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CATEGORÍAS */}
        <div style={{ marginBottom: '25px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 900, color: c.text, margin: 0, marginBottom: '15px' }}>📂 Categorías</h2>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '5px' }}>
            {categorias.map((cat, i) => (
              <button key={i} onClick={() => setSelectedCategory(i)} className="bounce-click" style={{ padding: '12px 20px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', whiteSpace: 'nowrap', backgroundColor: selectedCategory === i ? '#facc15' : c.card, color: selectedCategory === i ? '#0d0d12' : c.muted, border: selectedCategory === i ? 'none' : `1px solid ${c.muted}22`, transition: 'all 0.3s ease' }}>{cat}</button>
            ))}
          </div>
        </div>

        {/* LISTA DE APPS */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 900, color: c.text, margin: 0, marginBottom: '15px' }}>
            {selectedCategory === 0 ? "📱 Todas las apps" : `📱 ${categorias[selectedCategory]}`}
            <span style={{ fontSize: '13px', color: c.muted, fontWeight: 'normal', marginLeft: '8px' }}>({filteredApps.length})</span>
          </h2>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '15px' }}>
              {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton-shimmer" style={{ height: '220px', borderRadius: '16px' }} />)}
            </div>
          ) : filteredApps.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '15px' }}>
              {filteredApps.map((app, index) => (
                <Link key={index} href={`/apps/${app.slug}`} className="bounce-click"
                  onMouseEnter={() => setHoveredApp(app.name)}
                  onMouseLeave={() => setHoveredApp(null)}
                  style={{
                    padding: '15px',
                    borderRadius: '18px',
                    backgroundColor: c.card,
                    border: `1px solid ${hoveredApp === app.name ? app.border : c.muted + '22'}`,
                    textDecoration: 'none',
                    color: c.text,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px',
                    textAlign: 'center',
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    boxShadow: hoveredApp === app.name ? `0 10px 30px ${app.glow}` : 'none',
                  }}>
                  {app.isTop && (<span style={{ position: 'absolute', top: '8px', right: '8px', backgroundColor: 'rgba(250, 204, 21, 0.2)', color: '#facc15', padding: '3px 8px', borderRadius: '10px', fontSize: '9px', fontWeight: 'bold' }}>🔥</span>)}
                  {app.isNew && !app.isTop && (<span style={{ position: 'absolute', top: '8px', right: '8px', backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', padding: '3px 8px', borderRadius: '10px', fontSize: '9px', fontWeight: 'bold' }}>✨</span>)}

                  <button onClick={(e) => toggleFavorite(app.name, e)} style={{ position: 'absolute', top: '8px', left: '8px', background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer', color: favorites.includes(app.name) ? '#facc15' : c.muted }}>{favorites.includes(app.name) ? '★' : '☆'}</button>

                  <div style={{ width: '70px', height: '70px', borderRadius: '16px', overflow: 'hidden', backgroundColor: 'rgba(0,0,0,0.4)', border: `1px solid ${app.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '10px' }}>
                    {app.iconUrl && app.iconUrl !== "AQUI_VA_EL_LINK_DE_LA_IMAGEN" ? (<img src={app.iconUrl} alt={app.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = `<span style="font-size: 35px;">${app.emoji}</span>`; }} />) : (<span style={{ fontSize: '35px' }}>{app.emoji}</span>)}
                  </div>

                  <h3 style={{ fontSize: '14px', fontWeight: 'bold', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
                    {app.name.replace(" Premium", "").replace(" VIP", "")}
                  </h3>

                  <p style={{ fontSize: '11px', color: c.muted, margin: 0 }}>{app.version} • {app.size}</p>

                  <div style={{ display: 'flex', gap: '3px', fontSize: '12px' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} onClick={(e) => setRating(app.name, star, e)} style={{ cursor: 'pointer', color: (ratings[app.name] || 0) >= star ? '#facc15' : c.muted }}>★</span>
                    ))}
                  </div>

                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '10px', borderRadius: '10px', fontWeight: 'bold', fontSize: '11px', backgroundColor: app.glow, border: `1px solid ${app.border}`, color: app.text, marginTop: '5px' }}>
                    VER APP
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: c.muted, fontStyle: 'italic', padding: '40px 0' }}>No se encontraron apps con ese nombre. 🐱</p>
          )}
        </section>

        {/* PRÓXIMAMENTE */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 900, color: c.text, margin: 0, marginBottom: '15px' }}>🚀 Próximamente</h2>
          <div style={{ padding: '30px 20px', borderRadius: '18px', border: `2px dashed ${c.muted}33`, backgroundColor: c.card, textAlign: 'center', color: c.muted }}>
            <p style={{ fontSize: '14px', margin: 0 }}>Estamos trabajando en nuevas apps premium. ¡Vuelve pronto!</p>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ borderTop: `1px solid ${c.muted}22`, paddingTop: '25px', paddingBottom: '100px', textAlign: 'center' }}>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '15px' }}>
            <Link href="/privacidad" style={{ color: c.muted, fontSize: '12px', textDecoration: 'none' }}>Privacidad</Link>
            <Link href="/terminos" style={{ color: c.muted, fontSize: '12px', textDecoration: 'none' }}>Términos</Link>
            <Link href="/faq" style={{ color: c.muted, fontSize: '12px', textDecoration: 'none' }}>FAQ</Link>
            <Link href="/tutorial" style={{ color: c.muted, fontSize: '12px', textDecoration: 'none' }}>Tutorial</Link>
          </div>
          <p style={{ color: c.muted, fontSize: '11px', fontFamily: 'monospace' }}>© 2026 Mi Store · Hecho con 💛 desde Termux</p>
        </footer>
      </div>

      <a href="https://chat.whatsapp.com/HoM5JTuNl16BBhFSp1YBkm" target="_blank" rel="noopener noreferrer" className="bounce-click" style={{ position: 'fixed', bottom: '20px', right: '20px', backgroundColor: '#25D366', color: '#ffffff', padding: '14px 20px', borderRadius: '50px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 10px 30px rgba(37, 211, 102, 0.4)', textDecoration: 'none', zIndex: 50, fontSize: '13px' }}>
        <span>💬</span> Únete
      </a>

      <AdModal isOpen={showAd} onClose={() => setShowAd(false)} appName={pendingAppName} />

      {showCookies && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(13,13,18,0.98)', borderTop: `1px solid ${c.muted}22`, padding: '20px', zIndex: 200, backdropFilter: 'blur(12px)' }}>
          <div style={{ maxWidth: '500px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <p style={{ color: c.muted, fontSize: '13px', lineHeight: 1.5, margin: 0 }}>🍪 Usamos cookies para mejorar tu experiencia. Al continuar, aceptas su uso.</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => { setShowCookies(false); localStorage.setItem('cookiesAccepted', 'yes'); }} className="bounce-click" style={{ flex: 1, padding: '12px', borderRadius: '10px', backgroundColor: '#facc15', color: '#0d0d12', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '13px' }}>Aceptar</button>
              <button onClick={() => { setShowCookies(false); localStorage.setItem('cookiesAccepted', 'no'); }} className="bounce-click" style={{ flex: 1, padding: '12px', borderRadius: '10px', backgroundColor: 'transparent', color: c.muted, border: `1px solid ${c.muted}33`, cursor: 'pointer', fontSize: '13px' }}>Rechazar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
