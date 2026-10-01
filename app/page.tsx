"use client";

import { useState, useEffect, useRef } from "react";

// =============================================
// DATOS DE LAS APPS
// =============================================
const apps = [
  { name: "CapCut Premium", description: "Editor de video con todas las funciones desbloqueadas.", link: "https://cloud.androforever.com/Apps/CapCut/CapCut%2019.7.0%20Ultra%20Pro%20-%20androforever.com.apk", iconUrl: "https://i.postimg.cc/xd5CgB88/82bd819ca10ca7fa4f51e0cd7dba232f.jpg", emoji: "🎬", category: "Video", isTop: true, isNew: false, glow: "rgba(250, 204, 21, 0.4)", border: "rgba(250, 204, 21, 0.6)", text: "#facc15" },
  { name: "YouTube Premium", description: "Videos sin anuncios y reproducción en segundo plano.", link: "https://cloud.androforever.com/Apps/YouTube/YouTube%20Premium%20v21.39.520%20-%20androforever.com.apk", iconUrl: "https://i.postimg.cc/BvSZ8Ngg/eca9ac47a486c83541fa5f81159b8349.jpg", emoji: "▶️", category: "Video", isTop: true, isNew: false, glow: "rgba(251, 191, 36, 0.4)", border: "rgba(251, 191, 36, 0.6)", text: "#fbbf24" },
  { name: "Netflix Premium", description: "Todo el catálogo en máxima calidad 4K.", link: "https://cloud.androforever.com/Apps/Netflix/Netflix%20Premium%20v9.84.0%20-%20androforever.com.apk", iconUrl: "https://i.postimg.cc/RhkVNBsg/393747d57d29232eaa98b9ecba7c4dca.jpg", emoji: "🍿", category: "Video", isTop: true, isNew: false, glow: "rgba(220, 38, 38, 0.4)", border: "rgba(220, 38, 38, 0.6)", text: "#fca5a5" },
  { name: "Novastrim VIP", description: "Streaming y entretenimiento sin límites.", link: "https://cloud.androforever.com/Apps/Novastrim/Novastrim%20Mod%20v1.52%20-%20androforever.com.apk", iconUrl: "AQUI_VA_EL_LINK_DE_LA_IMAGEN", emoji: "📺", category: "Video", isTop: false, isNew: false, glow: "rgba(168, 85, 247, 0.4)", border: "rgba(168, 85, 247, 0.6)", text: "#d8b4fe" },
  { name: "Spotify Premium", description: "Música sin anuncios y descargas offline.", link: "https://www.mediafire.com/file/3s0cz5sezxhp11k/SpotiWeb_v4.0.0_mundoperfecto.net.apk/file", iconUrl: "https://i.postimg.cc/52M2JfQs/99a0500dc420189ec2fdc984c8493fda.jpg", emoji: "🎧", category: "Música", isTop: true, isNew: false, glow: "rgba(34, 197, 94, 0.4)", border: "rgba(34, 197, 94, 0.6)", text: "#86efac" },
  { name: "YouTube Music Premium", description: "Tu música favorita sin interrupciones.", link: "https://cloud.androforever.com/Apps/YouTube/YouTube%20Premium%20v21.39.520%20-%20androforever.com.apk", iconUrl: "https://i.postimg.cc/vZLHHCWQ/03b22a2d5bba9d8fa2ac503b30d3b216.jpg", emoji: "🎵", category: "Música", isTop: false, isNew: false, glow: "rgba(244, 63, 94, 0.4)", border: "rgba(244, 63, 94, 0.6)", text: "#fda4af" },
  { name: "Telegram Premium", description: "Mensajería rápida, segura y sin límites.", link: "https://cloud.androforever.com/Apps/Telegram/Telegram%20Premium%20v12.10.5%20-%20androforever.com.apk", iconUrl: "https://i.postimg.cc/9XKfxdmy/2952b7f67446895f8f11c3afacc89edc.jpg", emoji: "✈️", category: "Social", isTop: true, isNew: false, glow: "rgba(14, 165, 233, 0.4)", border: "rgba(14, 165, 233, 0.6)", text: "#7dd3fc" },
  { name: "Xuper Premium", description: "La app definitiva con todas las ventajas.", link: "https://www.mediafire.com/file/gnj9hcs7tiivp1x/XH2.apk/file", iconUrl: "AQUI_VA_EL_LINK_DE_LA_IMAGEN", emoji: "⚡", category: "Herramientas", isTop: false, isNew: true, glow: "rgba(249, 115, 22, 0.4)", border: "rgba(249, 115, 22, 0.6)", text: "#fdba74" },
  { name: "MicroG", description: "Servicios de Google optimizados y ligeros.", link: "https://cloud.androforever.com/Apps/MicroG/microg-7.1.1.apk", iconUrl: "AQUI_VA_EL_LINK_DE_LA_IMAGEN", emoji: "🤖", category: "Herramientas", isTop: false, isNew: true, glow: "rgba(20, 184, 166, 0.4)", border: "rgba(20, 184, 166, 0.6)", text: "#5eead4" },
  { name: "Echo Music", description: "Descubre nuevos sonidos y artistas sin límites.", link: "https://github.com/EchoMusicApp/Echo-Music/releases/download/v1.2.6/EchoMusic.apk", iconUrl: "AQUI_VA_EL_LINK_DE_LA_IMAGEN", emoji: "🔊", category: "Música", isTop: false, isNew: true, glow: "rgba(236, 72, 153, 0.4)", border: "rgba(236, 72, 153, 0.6)", text: "#f9a8d4" },
];

const categorias = ["Todas", "Video", "Música", "Social", "Herramientas"];

// =============================================
// COMPONENTE DE PARTÍCULAS FLOTANTES (GATO)
// =============================================
function FloatingParticles() {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    const catImage = "https://i.postimg.cc/ZK5PMs9t/c9ffe8d5229986251e05870abbabb612.jpg";
    const newParticles = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 30 + 15,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 15,
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
          }}
        />
      ))}
    </div>
  );
}

// =============================================
// COMPONENTE SKELETON LOADER
// =============================================
function SkeletonCard() {
  return (
    <div style={{
      padding: '30px', borderRadius: '20px', backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column',
      alignItems: 'center', gap: '15px'
    }}>
      <div className="skeleton-shimmer" style={{ width: '80px', height: '80px', borderRadius: '16px' }}></div>
      <div className="skeleton-shimmer" style={{ width: '60%', height: '20px', borderRadius: '8px' }}></div>
      <div className="skeleton-shimmer" style={{ width: '80%', height: '14px', borderRadius: '8px' }}></div>
      <div className="skeleton-shimmer" style={{ width: '100%', height: '50px', borderRadius: '12px' }}></div>
    </div>
  );
}

// =============================================
// COMPONENTE PRINCIPAL
// =============================================
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

  // Estados para el tilt 3D
  const [tiltStyle, setTiltStyle] = useState<Record<string, React.CSSProperties>>({});

  useEffect(() => {
    // Cargar datos guardados
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);

    const savedRatings: Record<string, number> = {};
    apps.forEach(app => {
      const r = localStorage.getItem(`rating-${app.name}`);
      if (r) savedRatings[app.name] = parseInt(r);
    });
    setRatings(savedRatings);

    const savedFavs = localStorage.getItem("favorites");
    if (savedFavs) setFavorites(JSON.parse(savedFavs));

    const savedCookies = localStorage.getItem("cookiesAccepted");
    if (!savedCookies) setShowCookies(true);

    // Simular carga para el skeleton (1.5 segundos)
    setTimeout(() => setLoading(false), 1500);
  }, []);

  // Aparición al hacer scroll (Intersection Observer)
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in-on-scroll').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [loading]);

  const toggleTheme = (newTheme: string) => {
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const toggleFavorite = (appName: string, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    const newFavs = favorites.includes(appName)
      ? favorites.filter(f => f !== appName)
      : [...favorites, appName];
    setFavorites(newFavs);
    localStorage.setItem("favorites", JSON.stringify(newFavs));
  };

  const setRating = (appName: string, value: number, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setRatings({ ...ratings, [appName]: value });
    localStorage.setItem(`rating-${appName}`, value.toString());
  };

  // Efecto Tilt 3D al mover el mouse sobre una tarjeta
  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>, appName: string) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    setTiltStyle(prev => ({
      ...prev,
      [appName]: {
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`,
        transition: 'transform 0.1s ease',
      }
    }));
  };

  const handleMouseLeave = (appName: string) => {
    setTiltStyle(prev => ({
      ...prev,
      [appName]: {
        transform: 'perspective(1000px) rotateX(0) rotateY(0) scale(1)',
        transition: 'transform 0.5s ease',
      }
    }));
  };

  const filteredApps = apps.filter((app) => {
    const matchesCategory = selectedCategory === 0 || app.category === categorias[selectedCategory];
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.description.toLowerCase().includes(searchTerm.toLowerCase());
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

  // =============================================
  // PANTALLA DE BIENVENIDA (PUERTA)
  // =============================================
  if (!hasEntered) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0d0d12', color: '#ffffff', fontFamily: 'system-ui, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '400px', padding: '40px 30px', borderRadius: '24px', backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(12px)', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>🛡️</div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px', color: '#ffffff' }}>Zona de Descargas</h1>
          <p style={{ color: '#9ca3af', fontSize: '16px', lineHeight: 1.6, marginBottom: '30px' }}>
            Entrarás a la zona de descargas, son apps premium <b>100% legales y seguras</b>, gracias al grupo DC se logran estas cosas. ¡Bienvenid@!
          </p>
          <button onClick={() => setHasEntered(true)} className="bounce-click" style={{ width: '100%', padding: '18px', borderRadius: '14px', backgroundColor: '#facc15', color: '#0d0d12', fontWeight: 'bold', fontSize: '16px', border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px', boxShadow: '0 4px 20px rgba(250, 204, 21, 0.4)' }}>
            Entrar a la tienda
          </button>
        </div>
      </div>
    );
  }

  // =============================================
  // PANTALLA PRINCIPAL
  // =============================================
  return (
    <div style={{ minHeight: '100vh', backgroundColor: c.bg, color: c.text, fontFamily: 'system-ui, sans-serif', position: 'relative', overflow: 'hidden', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'background-color 0.5s ease' }}>

      {/* Partículas flotantes con el gato */}
      <FloatingParticles />

      {/* Cuadrícula de fondo */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'} 1px, transparent 1px), linear-gradient(90deg, ${theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'} 1px, transparent 1px)`, backgroundSize: '40px 40px', zIndex: 1, pointerEvents: 'none' }}></div>

      {/* Aura superior */}
      <div style={{ position: 'absolute', top: '-150px', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '600px', background: `radial-gradient(circle, ${theme === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(250, 204, 21, 0.2)'} 0%, rgba(0,0,0,0) 70%)`, filter: 'blur(60px)', zIndex: 1, pointerEvents: 'none' }}></div>

      {/* BARRA DE NAVEGACIÓN */}
      <nav style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '500px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px', borderBottom: `1px solid ${c.muted}22`, marginBottom: '40px', flexWrap: 'wrap', gap: '8px' }}>
        <span className="animated-gradient" style={{ fontSize: '18px', fontWeight: 900, letterSpacing: '2px', background: `linear-gradient(to right, ${c.text}, #facc15, ${c.text})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textTransform: 'uppercase' }}>Mi Store 🐾</span>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <a href="/tutorial" style={{ fontSize: '12px', fontWeight: 'bold', color: c.muted, textDecoration: 'none' }}>Tutorial</a>
          <a href="/faq" style={{ fontSize: '12px', fontWeight: 'bold', color: c.muted, textDecoration: 'none' }}>FAQ</a>
          <a href="/privacidad" style={{ fontSize: '12px', fontWeight: 'bold', color: c.muted, textDecoration: 'none' }}>Privacidad</a>
          <a href="/terminos" style={{ fontSize: '12px', fontWeight: 'bold', color: c.muted, textDecoration: 'none' }}>Términos</a>
          {/* Selector de temas */}
          <select value={theme} onChange={(e) => toggleTheme(e.target.value)} style={{ background: 'rgba(128,128,128,0.1)', border: `1px solid ${c.muted}33`, borderRadius: '8px', padding: '4px 8px', color: c.text, fontSize: '11px', cursor: 'pointer', outline: 'none' }}>
            <option value="dark">🌙 Dark</option>
            <option value="light">☀️ Light</option>
            <option value="cyberpunk">🟣 Cyberpunk</option>
            <option value="sunset">🌅 Sunset</option>
            <option value="ice">❄️ Ice</option>
          </select>
        </div>
      </nav>

      {/* SECCIÓN HERO */}
      <section style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: '500px', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 900, lineHeight: 1.1, marginBottom: '20px', letterSpacing: '-1px', color: c.text }}>
          EL PODER DE LAS <br />
          <span className="animated-gradient" style={{ background: 'linear-gradient(90deg, #facc15, #f59e0b, #fbbf24, #facc15)', backgroundSize: '200% 200%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'gradient-shift 4s ease infinite' }}>APPS PREMIUM</span>
        </h1>
        <p style={{ color: c.muted, fontSize: '16px', lineHeight: 1.6, maxWidth: '400px', margin: '0 auto', marginBottom: '30px' }}>Descarga las versiones premium de tus apps favoritas. Todo en un solo lugar, rápido y seguro.</p>

        <div style={{ width: '140px', height: '140px', margin: '0 auto', borderRadius: '50%', overflow: 'hidden', border: `3px solid ${c.muted}33`, boxShadow: `0 0 40px ${theme === 'dark' ? 'rgba(250, 204, 21, 0.2)' : 'rgba(250, 204, 21, 0.4)'}`, backgroundColor: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pulse 3s ease-in-out infinite' }}>
          <img src="https://i.postimg.cc/QdBk2k5q/13.jpg" alt="Gato" className="zoom-hover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = '<span style="font-size: 80px;">🐱</span>'; }} />
        </div>
      </section>

      {/* TOP DESCARGAS */}
      <section className="fade-in-on-scroll" style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '500px', marginBottom: '25px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', color: '#facc15' }}>🔥 Top Descargas</h2>
        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '10px' }}>
          {topApps.map((app, i) => (
            <a key={i} href={app.link} target="_blank" rel="noopener noreferrer" className="zoom-hover" style={{ flex: '0 0 auto', width: '110px', padding: '12px', borderRadius: '16px', backgroundColor: 'var(--bg-card)', border: `1px solid var(--border-color)`, textDecoration: 'none', color: c.text, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '45px', height: '45px', borderRadius: '10px', overflow: 'hidden', backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {app.iconUrl && app.iconUrl !== "AQUI_VA_EL_LINK_DE_LA_IMAGEN" ? <img src={app.iconUrl} alt={app.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '22px' }}>{app.emoji}</span>}
              </div>
              <span style={{ fontSize: '11px', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>{app.name.replace(" Premium", "").replace(" VIP", "")}</span>
            </a>
          ))}
        </div>
      </section>

      {/* RECIÉN AGREGADAS */}
      <section className="fade-in-on-scroll" style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '500px', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', color: '#22c55e' }}>✨ Recién Agregadas</h2>
        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '10px' }}>
          {newApps.map((app, i) => (
            <a key={i} href={app.link} target="_blank" rel="noopener noreferrer" className="zoom-hover" style={{ flex: '0 0 auto', width: '110px', padding: '12px', borderRadius: '16px', backgroundColor: 'var(--bg-card)', border: `1px solid var(--border-color)`, textDecoration: 'none', color: c.text, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '45px', height: '45px', borderRadius: '10px', overflow: 'hidden', backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {app.iconUrl && app.iconUrl !== "AQUI_VA_EL_LINK_DE_LA_IMAGEN" ? <img src={app.iconUrl} alt={app.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '22px' }}>{app.emoji}</span>}
              </div>
              <span style={{ fontSize: '11px', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>{app.name.replace(" Premium", "").replace(" VIP", "")}</span>
            </a>
          ))}
        </div>
      </section>

      {/* CATEGORÍAS */}
      <div className="fade-in-on-scroll" style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '500px', marginBottom: '20px', display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '5px' }}>
        {categorias.map((cat, i) => (
          <button key={i} onClick={() => setSelectedCategory(i)} className="bounce-click" style={{ padding: '10px 18px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', whiteSpace: 'nowrap', backgroundColor: selectedCategory === i ? '#facc15' : 'var(--bg-card)', color: selectedCategory === i ? '#0d0d12' : c.muted, transition: 'all 0.3s ease' }}>
            {cat}
          </button>
        ))}
      </div>

      {/* BUSCADOR */}
      <div className="fade-in-on-scroll" style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '500px', marginBottom: '30px' }}>
        <input type="text" placeholder="Buscar app premium..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '16px 20px', borderRadius: '16px', backgroundColor: 'var(--bg-card)', border: `1px solid var(--border-color)`, color: c.text, fontSize: '16px', outline: 'none', boxSizing: 'border-box' }} />
      </div>

      {/* LISTA DE APPS */}
      <section id="apps" style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : filteredApps.length > 0 ? (
          filteredApps.map((app, index) => (
            <a
              key={index}
              href={app.link}
              target="_blank"
              rel="noopener noreferrer"
              className="fade-in-on-scroll bounce-click"
              onMouseEnter={() => setHoveredApp(app.name)}
              onMouseLeave={() => { setHoveredApp(null); handleMouseLeave(app.name); }}
              onMouseMove={(e) => handleMouseMove(e, app.name)}
              style={{
                ...tiltStyle[app.name],
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                padding: '30px', borderRadius: '20px', backgroundColor: 'var(--bg-card)',
                border: `1px solid ${hoveredApp === app.name ? app.border : 'var(--border-color)'}`,
                textDecoration: 'none', color: c.text,
                transition: 'box-shadow 0.4s ease, border 0.4s ease',
                boxShadow: hoveredApp === app.name ? `0 15px 45px ${app.glow}` : '0 8px 32px rgba(0, 0, 0, 0.3)',
                position: 'relative', overflow: 'hidden',
                willChange: 'transform',
              }}
            >
              {app.isTop && (<span className="glow-border" style={{ position: 'absolute', top: '15px', right: '15px', backgroundColor: 'rgba(250, 204, 21, 0.2)', color: '#facc15', padding: '4px 10px', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold' }}>🔥 TOP</span>)}
              {app.isNew && !app.isTop && (<span style={{ position: 'absolute', top: '15px', right: '15px', backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', padding: '4px 10px', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold' }}>✨ NUEVO</span>)}

              <button onClick={(e) => toggleFavorite(app.name, e)} style={{ position: 'absolute', top: '15px', left: '15px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: favorites.includes(app.name) ? '#facc15' : c.muted }}>
                {favorites.includes(app.name) ? '★' : '☆'}
              </button>

              <div className="zoom-hover" style={{ width: '80px', height: '80px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', backgroundColor: 'rgba(0,0,0,0.4)', border: `1px solid var(--border-color)`, marginBottom: '20px', overflow: 'hidden' }}>
                {app.iconUrl && app.iconUrl !== "AQUI_VA_EL_LINK_DE_LA_IMAGEN" ? (<img src={app.iconUrl} alt={app.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = `<span style="font-size: 40px;">${app.emoji}</span>`; }} />) : (<span>{app.emoji}</span>)}
              </div>

              <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '8px', color: c.text }}>{app.name}</h2>
              <p style={{ color: c.muted, fontSize: '14px', marginBottom: '15px' }}>{app.description}</p>

              <div style={{ display: 'flex', gap: '4px', marginBottom: '20px' }} onClick={(e) => e.preventDefault()}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} onClick={(e) => setRating(app.name, star, e)} style={{ fontSize: '22px', cursor: 'pointer', color: (ratings[app.name] || 0) >= star ? '#facc15' : c.muted, transition: 'transform 0.2s ease' }}>★</span>
                ))}
              </div>

              <span className="bounce-click" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '16px', borderRadius: '12px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '14px', backgroundColor: app.glow, border: `1px solid ${app.border}`, color: app.text, boxShadow: `0 0 20px ${app.glow}`, transition: 'all 0.3s ease', cursor: 'pointer' }}>
                Descargar
              </span>
            </a>
          ))
        ) : (<p style={{ textAlign: 'center', color: c.muted, fontStyle: 'italic' }}>No se encontraron apps con ese nombre. 🐱</p>)}
      </section>

      {/* SECCIÓN PRÓXIMAMENTE */}
      <section className="fade-in-on-scroll" style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '500px', marginTop: '50px', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center', color: c.text }}>Próximamente 🚀</h2>
        <div style={{ padding: '40px 20px', borderRadius: '20px', border: `2px dashed var(--border-color)`, backgroundColor: 'var(--bg-card)', textAlign: 'center', color: c.muted }}>
          <p style={{ fontSize: '14px' }}>Estamos trabajando en nuevas apps premium. ¡Vuelve pronto!</p>
        </div>
      </section>

      {/* BOTÓN DE WHATSAPP */}
      <a href="https://chat.whatsapp.com/HoM5JTuNl16BBhFSp1YBkm" target="_blank" rel="noopener noreferrer" className="bounce-click" style={{ position: 'fixed', bottom: '30px', right: '20px', backgroundColor: '#25D366', color: '#ffffff', padding: '16px 24px', borderRadius: '50px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 30px rgba(37, 211, 102, 0.4)', textDecoration: 'none', zIndex: 50, fontSize: '14px' }}>
        <span style={{ fontSize: '20px' }}>💬</span> Únete al Grupo
      </a>

      {/* BANNER DE COOKIES */}
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
