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
        <img
          key={p.id}
          src="https://i.postimg.cc/ZK5PMs9t/c9ffe8d5229986251e05870abbabb612.jpg"
          alt=""
          className="particle"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            opacity: 0.15,
          }}
        />
      ))}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div style={{ padding: '30px', borderRadius: '20px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
      <div className="skeleton-shimmer" style={{ width: '80px', height: '80px', borderRadius: '16px' }}></div>
      <div className="skeleton-shimmer" style={{ width: '60%', height: '20px', borderRadius: '8px' }}></div>
      <div className="skeleton-shimmer" style={{ width: '80%', height: '14px', borderRadius: '8px' }}></div>
      <div className="skeleton-shimmer" style={{ width: '100%', height: '50px', borderRadius: '12px' }}></div>
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
  const [tiltStyle, setTiltStyle] = useState<Record<string, React.CSSProperties>>({});
  const [showAd, setShowAd] = useState(false);
  const [pendingUrl, setPendingUrl] = useState("");
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

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-in-on-scroll').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [loading, hasEntered]);

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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, appName: string) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -5;
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 5;
    setTiltStyle(prev => ({ ...prev, [appName]: { transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`, transition: 'transform 0.1s ease' } }));
  };

  const handleMouseLeave = (appName: string) => {
    setTiltStyle(prev => ({ ...prev, [appName]: { transform: 'perspective(1000px) rotateX(0) rotateY(0)', transition: 'transform 0.5s ease' } }));
  };

  const filteredApps = apps.filter((app) => {
    const matchesCategory = selectedCategory === 0 || app.category === categorias[selectedCategory];
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) || app.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  const topApps = apps.filter(a => a.isTop);
  const newApps = apps.filter(a => a.isNew);

  const themeColors: Record<string, { bg: string, text: string, muted: string }> = {
    dark: { bg: '#0d0d12', text: '#ffffff', muted: '#9ca3af' },
    light: { bg: '#f5f5f7', text: '#0d0d12', muted: '#6b7280' },
    cyberpunk: { bg: '#0a0014', text: '#e0d4ff', muted: '#a78bfa' },
    sunset: { bg: '#1a0a0a', text: '#ffe4c4', muted: '#fdba74' },
    ice: { bg: '#0a0f1a', text: '#e2e8f0', muted: '#94a3b8' },
  };
  const c = themeColors[theme] || themeColors.dark;

  if (!hasEntered) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0d0d12', color: '#ffffff', fontFamily: 'system-ui, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '400px', padding: '40px 30px', borderRadius: '24px', backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(12px)', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
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
      <div style={{ position: 'absolute', top: '-150px', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '600px', background: `radial-gradient(circle, ${theme === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(250, 204, 21, 0.2)'} 0%, rgba(0,0,0,0) 70%)`, filter: 'blur(60px)', zIndex: 1, pointerEvents: 'none' }}></div>

      <nav style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '500px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px', borderBottom: `1px solid ${c.muted}22`, marginBottom: '40px', flexWrap: 'wrap', gap: '8px' }}>
        <span className="animated-gradient" style={{ fontSize: '18px', fontWeight: 900, letterSpacing: '2px', background: `linear-gradient(to right, ${c.text}, #facc15, ${c.text})`, backgroundSize: '200% 200%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textTransform: 'uppercase' }}>Mi Store 🐾</span>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Link href="/escaner" style={{ fontSize: '12px', fontWeight: 'bold', color: '#facc15', textDecoration: 'none' }}>🔍 Escáner</Link>
          <Link href="/blog" style={{ fontSize: '12px', fontWeight: 'bold', color: '#22c55e', textDecoration: 'none' }}>📚 Blog</Link>
          <Link href="/tutorial" style={{ fontSize: '12px', fontWeight: 'bold', color: c.muted, textDecoration: 'none' }}>Tutorial</Link>
          <Link href="/faq" style={{ fontSize: '12px', fontWeight: 'bold', color: c.muted, textDecoration: 'none' }}>FAQ</Link>
          <Link href="/privacidad" style={{ fontSize: '12px', fontWeight: 'bold', color: c.muted, textDecoration: 'none' }}>Privacidad</Link>
          <Link href="/terminos" style={{ fontSize: '12px', fontWeight: 'bold', color: c.muted, textDecoration: 'none' }}>Términos</Link>
          <select value={theme} onChange={(e) => toggleTheme(e.target.value)} style={{ background: 'rgba(128,128,128,0.1)', border: `1px solid ${c.muted}33`, borderRadius: '8px', padding: '4px 8px', color: c.text, fontSize: '11px', cursor: 'pointer', outline: 'none' }}>
            <option value="dark">🌙 Dark</option>
            <option value="light">☀️ Light</option>
            <option value="cyberpunk">🟣 Cyberpunk</option>
            <option value="sunset">🌅 Sunset</option>
            <option value="ice">❄️ Ice</option>
          </select>
        </div>
      </nav>

      <section style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: '500px', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 900, lineHeight: 1.1, marginBottom: '20px', letterSpacing: '-1px', color: c.text }}>
          EL PODER DE LAS <br />
          <span className="animated-gradient" style={{ background: 'linear-gradient(90deg, #facc15, #f59e0b, #fbbf24, #facc15)', backgroundSize: '200% 200%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'gradient-shift 4s ease infinite' }}>APPS PREMIUM</span>
        </h1>
        <p style={{ color: c.muted, fontSize: '16px', lineHeight: 1.6, maxWidth: '400px', margin: '0 auto', marginBottom: '30px' }}>Descarga las versiones premium de tus apps favoritas. Todo en un solo lugar, rápido y fácil.</p>
        <div style={{ width: '140px', height: '140px', margin: '0 auto', borderRadius: '50%', overflow: 'hidden', border: `3px solid ${c.muted}33`, boxShadow: '0 0 40px rgba(250, 204, 21, 0.2)', backgroundColor: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pulse 3s ease-in-out infinite' }}>
          <img src="https://i.postimg.cc/QdBk2k5q/13.jpg" alt="Gato" className="zoom-hover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = '<span style="font-size: 80px;">🐱</span>'; }} />
        </div>
      </section>

      <section className="fade-in-on-scroll" style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '500px', marginBottom: '25px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', color: '#facc15' }}>🔥 Top Descargas</h2>
        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '10px' }}>
          {topApps.map((app, i) => (
            <Link key={i} href={`/apps/${app.slug}`} className="zoom-hover" style={{ flex: '0 0 auto', width: '110px', padding: '12px', borderRadius: '16px', backgroundColor: 'var(--bg-card)', border: `1px solid var(--border-color)`, textDecoration: 'none', color: c.text, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '45px', height: '45px', borderRadius: '10px', overflow: 'hidden', backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {app.iconUrl && app.iconUrl !== "AQUI_VA_EL_LINK_DE_LA_IMAGEN" ? <img src={app.iconUrl} alt={app.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '22px' }}>{app.emoji}</span>}
              </div>
              <span style={{ fontSize: '11px', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>{app.name.replace(" Premium", "").replace(" VIP", "")}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="fade-in-on-scroll" style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '500px', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', color: '#22c55e' }}>✨ Recién Agregadas</h2>
        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '10px' }}>
          {newApps.map((app, i) => (
            <Link key={i} href={`/apps/${app.slug}`} className="zoom-hover" style={{ flex: '0 0 auto', width: '110px', padding: '12px', borderRadius: '16px', backgroundColor: 'var(--bg-card)', border: `1px solid var(--border-color)`, textDecoration: 'none', color: c.text, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '45px', height: '45px', borderRadius: '10px', overflow: 'hidden', backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {app.iconUrl && app.iconUrl !== "AQUI_VA_EL_LINK_DE_LA_IMAGEN" ? <img src={app.iconUrl} alt={app.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '22px' }}>{app.emoji}</span>}
              </div>
              <span style={{ fontSize: '11px', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>{app.name.replace(" Premium", "").replace(" VIP", "")}</span>
            </Link>
          ))}
        </div>
      </section>

      <div className="fade-in-on-scroll" style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '500px', marginBottom: '20px', display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '5px' }}>
        {categorias.map((cat, i) => (
          <button key={i} onClick={() => setSelectedCategory(i)} className="bounce-click" style={{ padding: '10px 18px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', whiteSpace: 'nowrap', backgroundColor: selectedCategory === i ? '#facc15' : 'var(--bg-card)', color: selectedCategory === i ? '#0d0d12' : c.muted, transition: 'all 0.3s ease' }}>{cat}</button>
        ))}
      </div>

      <div className="fade-in-on-scroll" style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '500px', marginBottom: '30px' }}>
        <input type="text" placeholder="Buscar app premium..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '16px 20px', borderRadius: '16px', backgroundColor: 'var(--bg-card)', border: `1px solid var(--border-color)`, color: c.text, fontSize: '16px', outline: 'none', boxSizing: 'border-box' }} />
      </div>

      <section id="apps" style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {loading ? (<><SkeletonCard /><SkeletonCard /><SkeletonCard /></>) : filteredApps.length > 0 ? (
          filteredApps.map((app, index) => (
            <div key={index} className="fade-in-on-scroll" onMouseEnter={() => setHoveredApp(app.name)} onMouseLeave={() => { setHoveredApp(null); handleMouseLeave(app.name); }} onMouseMove={(e) => handleMouseMove(e, app.name)} style={{ ...tiltStyle[app.name], willChange: 'transform' }}>
              <Link href={`/apps/${app.slug}`} className="bounce-click" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '30px', borderRadius: '20px', backgroundColor: 'var(--bg-card)', border: `1px solid ${hoveredApp === app.name ? app.border : 'var(--border-color)'}`, textDecoration: 'none', color: c.text, transition: 'box-shadow 0.4s ease, border 0.4s ease', boxShadow: hoveredApp === app.name ? `0 15px 45px ${app.glow}` : '0 8px 32px rgba(0, 0, 0, 0.3)', position: 'relative', overflow: 'hidden' }}>
                {app.isTop && (<span className="glow-border" style={{ position: 'absolute', top: '15px', right: '15px', backgroundColor: 'rgba(250, 204, 21, 0.2)', color: '#facc15', padding: '4px 10px', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold' }}>🔥 TOP</span>)}
                {app.isNew && !app.isTop && (<span style={{ position: 'absolute', top: '15px', right: '15px', backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', padding: '4px 10px', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold' }}>✨ NUEVO</span>)}
                <button onClick={(e) => toggleFavorite(app.name, e)} style={{ position: 'absolute', top: '15px', left: '15px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: favorites.includes(app.name) ? '#facc15' : c.muted }}>{favorites.includes(app.name) ? '★' : '☆'}</button>
                <div className="zoom-hover" style={{ width: '80px', height: '80px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', backgroundColor: 'rgba(0,0,0,0.4)', border: `1px solid var(--border-color)`, marginBottom: '20px', overflow: 'hidden' }}>
                  {app.iconUrl && app.iconUrl !== "AQUI_VA_EL_LINK_DE_LA_IMAGEN" ? (<img src={app.iconUrl} alt={app.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = `<span style="font-size: 40px;">${app.emoji}</span>`; }} />) : (<span>{app.emoji}</span>)}
                </div>
                <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '8px', color: c.text }}>{app.name}</h2>
                <p style={{ color: c.muted, fontSize: '14px', marginBottom: '10px' }}>{app.description}</p>
                <p style={{ color: c.muted, fontSize: '11px', marginBottom: '15px' }}>{app.version} • {app.size} • {app.updated}</p>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '20px' }} onClick={(e) => e.preventDefault()}>
                  {[1, 2, 3, 4, 5].map((star) => (<span key={star} onClick={(e) => setRating(app.name, star, e)} style={{ fontSize: '22px', cursor: 'pointer', color: (ratings[app.name] || 0) >= star ? '#facc15' : c.muted }}>★</span>))}
                </div>
                <span className="bounce-click" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '16px', borderRadius: '12px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '14px', backgroundColor: app.glow, border: `1px solid ${app.border}`, color: app.text, boxShadow: `0 0 20px ${app.glow}` }}>Ver detalles</span>
              </Link>
            </div>
          ))
        ) : (<p style={{ textAlign: 'center', color: c.muted, fontStyle: 'italic' }}>No se encontraron apps con ese nombre. 🐱</p>)}
      </section>

      <section className="fade-in-on-scroll" style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '500px', marginTop: '50px', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center', color: c.text }}>Próximamente 🚀</h2>
        <div style={{ padding: '40px 20px', borderRadius: '20px', border: `2px dashed var(--border-color)`, backgroundColor: 'var(--bg-card)', textAlign: 'center', color: c.muted }}><p style={{ fontSize: '14px' }}>Estamos trabajando en nuevas apps premium. ¡Vuelve pronto!</p></div>
      </section>

      <a href="https://chat.whatsapp.com/HoM5JTuNl16BBhFSp1YBkm" target="_blank" rel="noopener noreferrer" className="bounce-click" style={{ position: 'fixed', bottom: '30px', right: '20px', backgroundColor: '#25D366', color: '#ffffff', padding: '16px 24px', borderRadius: '50px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 30px rgba(37, 211, 102, 0.4)', textDecoration: 'none', zIndex: 50, fontSize: '14px' }}>
        <span style={{ fontSize: '20px' }}>💬</span> Únete al Grupo
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

      <footer style={{ position: 'relative', zIndex: 10, marginTop: 'auto', paddingTop: '20px', paddingBottom: '80px', textAlign: 'center' }}>
        <p style={{ color: c.muted, fontSize: '12px', fontFamily: 'monospace', letterSpacing: '1px' }}>SISTEMA_TERMINADO // HECHO CON 💛 DESDE TERMUX</p>
      </footer>
    </div>
  );
}
