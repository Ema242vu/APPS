"use client";

import { useState, useEffect } from "react";

const apps = [
  { name: "CapCut Premium", description: "Editor de video con todas las funciones desbloqueadas.", link: "https://cloud.androforever.com/Apps/CapCut/CapCut%2019.7.0%20Ultra%20Pro%20-%20androforever.com.apk", iconUrl: "https://i.postimg.cc/xd5CgB88/82bd819ca10ca7fa4f51e0cd7dba232f.jpg", emoji: "🎬", category: "Video", isTop: true, glow: "rgba(250, 204, 21, 0.4)", border: "rgba(250, 204, 21, 0.6)", text: "#facc15" },
  { name: "YouTube Premium", description: "Videos sin anuncios y reproducción en segundo plano.", link: "https://cloud.androforever.com/Apps/YouTube/YouTube%20Premium%20v21.39.520%20-%20androforever.com.apk", iconUrl: "https://i.postimg.cc/BvSZ8Ngg/eca9ac47a486c83541fa5f81159b8349.jpg", emoji: "▶️", category: "Video", isTop: true, glow: "rgba(251, 191, 36, 0.4)", border: "rgba(251, 191, 36, 0.6)", text: "#fbbf24" },
  { name: "Netflix Premium", description: "Todo el catálogo en máxima calidad 4K.", link: "https://cloud.androforever.com/Apps/Netflix/Netflix%20Premium%20v9.84.0%20-%20androforever.com.apk", iconUrl: "https://i.postimg.cc/RhkVNBsg/393747d57d29232eaa98b9ecba7c4dca.jpg", emoji: "🍿", category: "Video", isTop: true, glow: "rgba(220, 38, 38, 0.4)", border: "rgba(220, 38, 38, 0.6)", text: "#fca5a5" },
  { name: "Novastrim VIP", description: "Streaming y entretenimiento sin límites.", link: "https://cloud.androforever.com/Apps/Novastrim/Novastrim%20Mod%20v1.52%20-%20androforever.com.apk", iconUrl: "AQUI_VA_EL_LINK_DE_LA_IMAGEN", emoji: "📺", category: "Video", isTop: false, glow: "rgba(168, 85, 247, 0.4)", border: "rgba(168, 85, 247, 0.6)", text: "#d8b4fe" },
  { name: "Spotify Premium", description: "Música sin anuncios y descargas offline.", link: "https://www.mediafire.com/file/3s0cz5sezxhp11k/SpotiWeb_v4.0.0_mundoperfecto.net.apk/file", iconUrl: "https://i.postimg.cc/52M2JfQs/99a0500dc420189ec2fdc984c8493fda.jpg", emoji: "🎧", category: "Música", isTop: true, glow: "rgba(34, 197, 94, 0.4)", border: "rgba(34, 197, 94, 0.6)", text: "#86efac" },
  { name: "YouTube Music Premium", description: "Tu música favorita sin interrupciones.", link: "https://cloud.androforever.com/Apps/YouTube/YouTube%20Premium%20v21.39.520%20-%20androforever.com.apk", iconUrl: "https://i.postimg.cc/vZLHHCWQ/03b22a2d5bba9d8fa2ac503b30d3b216.jpg", emoji: "🎵", category: "Música", isTop: false, glow: "rgba(244, 63, 94, 0.4)", border: "rgba(244, 63, 94, 0.6)", text: "#fda4af" },
  { name: "Xuper Premium", description: "La app definitiva con todas las ventajas.", link: "https://www.mediafire.com/file/gnj9hcs7tiivp1x/XH2.apk/file", iconUrl: "AQUI_VA_EL_LINK_DE_LA_IMAGEN", emoji: "⚡", category: "Herramientas", isTop: false, glow: "rgba(249, 115, 22, 0.4)", border: "rgba(249, 115, 22, 0.6)", text: "#fdba74" },
  { name: "Telegram Premium", description: "Mensajería rápida, segura y sin límites.", link: "https://cloud.androforever.com/Apps/Telegram/Telegram%20Premium%20v12.10.5%20-%20androforever.com.apk", iconUrl: "https://i.postimg.cc/9XKfxdmy/2952b7f67446895f8f11c3afacc89edc.jpg", emoji: "✈️", category: "Social", isTop: true, glow: "rgba(14, 165, 233, 0.4)", border: "rgba(14, 165, 233, 0.6)", text: "#7dd3fc" },
  { name: "MicroG", description: "Servicios de Google optimizados y ligeros.", link: "https://cloud.androforever.com/Apps/MicroG/microg-7.1.1.apk", iconUrl: "AQUI_VA_EL_LINK_DE_LA_IMAGEN", emoji: "🤖", category: "Herramientas", isTop: false, glow: "rgba(20, 184, 166, 0.4)", border: "rgba(20, 184, 166, 0.6)", text: "#5eead4" },
  { name: "Echo Music", description: "Descubre nuevos sonidos y artistas sin límites.", link: "https://github.com/EchoMusicApp/Echo-Music/releases/download/v1.2.6/EchoMusic.apk", iconUrl: "AQUI_VA_EL_LINK_DE_LA_IMAGEN", emoji: "🔊", category: "Música", isTop: false, glow: "rgba(236, 72, 153, 0.4)", border: "rgba(236, 72, 153, 0.6)", text: "#f9a8d4" },
];

const categorias = ["Todas", "Video", "Música", "Social", "Herramientas"];

const novedades = [
  { fecha: "Hoy", texto: "🎉 ¡Lanzamiento de Mi Store con 10 apps premium!" },
  { fecha: "Hoy", texto: "⭐ Nuevo sistema de reseñas y modo claro/oscuro." },
  { fecha: "Hoy", texto: "📖 Agregado tutorial de instalación paso a paso." },
];

export default function Home() {
  const [hasEntered, setHasEntered] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [hoveredApp, setHoveredApp] = useState<string | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "dark" | "light" | null;
    if (savedTheme) setTheme(savedTheme);
    const savedRatings: Record<string, number> = {};
    apps.forEach(app => {
      const r = localStorage.getItem(`rating-${app.name}`);
      if (r) savedRatings[app.name] = parseInt(r);
    });
    setRatings(savedRatings);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const setRating = (appName: string, value: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setRatings({ ...ratings, [appName]: value });
    localStorage.setItem(`rating-${appName}`, value.toString());
  };

  const c = theme === "dark" ? {
    bg: '#0d0d12', text: '#ffffff', textMuted: '#9ca3af',
    cardBg: 'rgba(255, 255, 255, 0.02)', cardBorder: 'rgba(255, 255, 255, 0.08)',
    inputBg: 'rgba(255, 255, 255, 0.03)', inputBorder: 'rgba(255, 255, 255, 0.15)',
    gridColor: 'rgba(255,255,255,0.03)', aura: 'rgba(255, 255, 255, 0.12)',
    chipBg: 'rgba(255,255,255,0.05)', chipText: '#9ca3af'
  } : {
    bg: '#f5f5f7', text: '#0d0d12', textMuted: '#6b7280',
    cardBg: 'rgba(255, 255, 255, 0.8)', cardBorder: 'rgba(0, 0, 0, 0.08)',
    inputBg: 'rgba(255, 255, 255, 0.9)', inputBorder: 'rgba(0, 0, 0, 0.15)',
    gridColor: 'rgba(0,0,0,0.03)', aura: 'rgba(250, 204, 21, 0.2)',
    chipBg: 'rgba(0,0,0,0.05)', chipText: '#6b7280'
  };

  const filteredApps = apps.filter((app) => {
    const matchesCategory = selectedCategory === "Todas" || app.category === selectedCategory;
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) || app.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  const topApps = apps.filter(a => a.isTop);

  if (!hasEntered) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0d0d12', color: '#ffffff', fontFamily: 'system-ui, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '400px', padding: '40px 30px', borderRadius: '24px', backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(12px)', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>🛡️</div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px', color: '#ffffff' }}>Zona de Descargas</h1>
          <p style={{ color: '#9ca3af', fontSize: '16px', lineHeight: 1.6, marginBottom: '30px' }}>
            Entrarás a la zona de descargas, son apps premium <b>100% legales y seguras</b>, gracias al grupo DC se logran estas cosas. ¡Bienvenid@!
          </p>
          <button onClick={() => setHasEntered(true)} style={{ width: '100%', padding: '18px', borderRadius: '14px', backgroundColor: '#facc15', color: '#0d0d12', fontWeight: 'bold', fontSize: '16px', border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px', boxShadow: '0 4px 20px rgba(250, 204, 21, 0.4)' }}>
            Entrar a la tienda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: c.bg, color: c.text, fontFamily: 'system-ui, sans-serif', position: 'relative', overflow: 'hidden', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'background-color 0.4s ease' }}>
      
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${c.gridColor} 1px, transparent 1px), linear-gradient(90deg, ${c.gridColor} 1px, transparent 1px)`, backgroundSize: '40px 40px', zIndex: 0, pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', top: '-150px', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '600px', background: `radial-gradient(circle, ${c.aura} 0%, rgba(0,0,0,0) 70%)`, filter: 'blur(60px)', zIndex: 0, pointerEvents: 'none', transition: 'all 0.4s ease' }}></div>

      <nav style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '500px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px', borderBottom: `1px solid ${c.cardBorder}`, marginBottom: '40px' }}>
        <span style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '2px', color: c.text, textTransform: 'uppercase' }}>Mi Store 🐾</span>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <a href="/tutorial" style={{ fontSize: '13px', fontWeight: 'bold', color: c.textMuted, textDecoration: 'none' }}>Tutorial</a>
          <a href="/privacidad" style={{ fontSize: '13px', fontWeight: 'bold', color: c.textMuted, textDecoration: 'none' }}>Privacidad</a>
          <button onClick={toggleTheme} style={{ background: c.chipBg, border: 'none', borderRadius: '50%', width: '35px', height: '35px', cursor: 'pointer', fontSize: '16px', color: c.text }}>
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>
      </nav>

      <section style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: '500px', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 900, lineHeight: 1.1, marginBottom: '20px', letterSpacing: '-1px', color: c.text }}>
          EL PODER DE LAS <br />
          <span style={{ background: 'linear-gradient(to right, #facc15, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>APPS PREMIUM</span>
        </h1>
        <p style={{ color: c.textMuted, fontSize: '16px', lineHeight: 1.6, maxWidth: '400px', margin: '0 auto', marginBottom: '30px' }}>
          Descarga las versiones premium de tus apps favoritas. Todo en un solo lugar, rápido y seguro.
        </p>
        <div style={{ width: '140px', height: '140px', margin: '0 auto', borderRadius: '50%', overflow: 'hidden', border: `3px solid ${c.cardBorder}`, boxShadow: '0 0 40px rgba(250, 204, 21, 0.2)', backgroundColor: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pulse 3s ease-in-out infinite' }}>
          <img src="https://i.postimg.cc/QdBk2k5q/13.jpg" alt="Gato" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = '<span style="font-size: 80px;">🐱</span>'; }} />
        </div>
      </section>

      {/* Novedades */}
      <section style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '500px', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: c.text, display: 'flex', alignItems: 'center', gap: '8px' }}>📰 Novedades</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {novedades.map((n, i) => (
            <div key={i} style={{ padding: '12px 16px', borderRadius: '12px', backgroundColor: c.cardBg, border: `1px solid ${c.cardBorder}`, fontSize: '13px', color: c.textMuted, display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#facc15', whiteSpace: 'nowrap' }}>{n.fecha}</span>
              <span>{n.texto}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Top Descargas */}
      <section style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '500px', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', color: '#facc15' }}>🔥 Top Descargas</h2>
        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '10px' }}>
          {topApps.map((app, index) => (
            <a key={index} href={app.link} target="_blank" rel="noopener noreferrer" style={{ flex: '0 0 auto', width: '110px', padding: '12px', borderRadius: '16px', backgroundColor: c.cardBg, border: `1px solid ${c.cardBorder}`, textDecoration: 'none', color: c.text, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', transition: 'transform 0.3s ease' }}>
              <div style={{ width: '45px', height: '45px', borderRadius: '10px', overflow: 'hidden', backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {app.iconUrl && app.iconUrl !== "AQUI_VA_EL_LINK_DE_LA_IMAGEN" ? <img src={app.iconUrl} alt={app.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '22px' }}>{app.emoji}</span>}
              </div>
              <span style={{ fontSize: '11px', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>{app.name.replace(" Premium", "").replace(" VIP", "")}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Categorías */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '500px', marginBottom: '20px', display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '5px' }}>
        {categorias.map((cat, index) => (
          <button key={index} onClick={() => setSelectedCategory(cat)} style={{ padding: '10px 18px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', whiteSpace: 'nowrap', backgroundColor: selectedCategory === cat ? '#facc15' : c.chipBg, color: selectedCategory === cat ? '#0d0d12' : c.chipText, transition: 'all 0.3s ease' }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Buscador */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '500px', marginBottom: '30px' }}>
        <input type="text" placeholder="Buscar app premium..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '16px 20px', borderRadius: '16px', backgroundColor: c.inputBg, border: `1px solid ${c.inputBorder}`, color: c.text, fontSize: '16px', outline: 'none', backdropFilter: 'blur(10px)', boxSizing: 'border-box' }} />
      </div>

      {/* Apps */}
      <section id="apps" style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {filteredApps.length > 0 ? (
          filteredApps.map((app, index) => (
            <a key={index} href={app.link} target="_blank" rel="noopener noreferrer"
              onMouseEnter={() => setHoveredApp(app.name)}
              onMouseLeave={() => setHoveredApp(null)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                padding: '30px', borderRadius: '20px', backgroundColor: c.cardBg, backdropFilter: 'blur(12px)',
                border: `1px solid ${c.cardBorder}`, textDecoration: 'none', color: c.text,
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: hoveredApp === app.name ? `0 15px 45px ${app.glow}` : '0 8px 32px rgba(0, 0, 0, 0.3)',
                transform: hoveredApp === app.name ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
                position: 'relative', overflow: 'hidden'
              }}
            >
              {app.isTop && (<span style={{ position: 'absolute', top: '15px', right: '15px', backgroundColor: 'rgba(250, 204, 21, 0.2)', color: '#facc15', padding: '4px 10px', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold' }}>🔥 TOP</span>)}

              <div style={{ width: '80px', height: '80px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', backgroundColor: 'rgba(0,0,0,0.4)', border: `1px solid ${c.cardBorder}`, marginBottom: '20px', overflow: 'hidden', transition: 'transform 0.4s ease', transform: hoveredApp === app.name ? 'scale(1.1) rotate(3deg)' : 'scale(1) rotate(0deg)' }}>
                {app.iconUrl && app.iconUrl !== "AQUI_VA_EL_LINK_DE_LA_IMAGEN" ? (<img src={app.iconUrl} alt={app.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = `<span style="font-size: 40px;">${app.emoji}</span>`; }} />) : (<span>{app.emoji}</span>)}
              </div>

              <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '8px', color: c.text }}>{app.name}</h2>
              <p style={{ color: c.textMuted, fontSize: '14px', marginBottom: '15px' }}>{app.description}</p>

              {/* Estrellas de reseña */}
              <div style={{ display: 'flex', gap: '4px', marginBottom: '20px' }} onClick={(e) => e.preventDefault()}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} onClick={(e) => setRating(app.name, star, e)} style={{ fontSize: '22px', cursor: 'pointer', color: (ratings[app.name] || 0) >= star ? '#facc15' : c.textMuted, transition: 'transform 0.2s ease' }}>
                    ★
                  </span>
                ))}
              </div>

              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '16px', borderRadius: '12px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '14px', backgroundColor: app.glow, border: `1px solid ${app.border}`, color: app.text, boxShadow: `0 0 20px ${app.glow}`, transition: 'all 0.3s ease' }}>
                Descargar
              </span>
            </a>
          ))
        ) : (<p style={{ textAlign: 'center', color: c.textMuted, fontStyle: 'italic' }}>No se encontraron apps con ese nombre. 🐱</p>)}
      </section>

      {/* Próximamente */}
      <section style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '500px', marginTop: '50px', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center', color: c.text }}>Próximamente 🚀</h2>
        <div style={{ padding: '40px 20px', borderRadius: '20px', border: `2px dashed ${c.cardBorder}`, backgroundColor: c.cardBg, textAlign: 'center', color: c.textMuted }}>
          <p style={{ fontSize: '14px' }}>Estamos trabajando en nuevas apps premium. ¡Vuelve pronto!</p>
        </div>
      </section>

      {/* WhatsApp */}
      <a href="https://chat.whatsapp.com/HoM5JTuNl16BBhFSp1YBkm" target="_blank" rel="noopener noreferrer" style={{ position: 'fixed', bottom: '30px', right: '20px', backgroundColor: '#25D366', color: '#ffffff', padding: '16px 24px', borderRadius: '50px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 30px rgba(37, 211, 102, 0.4)', textDecoration: 'none', zIndex: 50, border: '2px solid rgba(255,255,255,0.2)', fontSize: '14px' }}>
        <span style={{ fontSize: '20px' }}>💬</span> Únete al Grupo
      </a>

      <footer style={{ position: 'relative', zIndex: 10, marginTop: 'auto', paddingTop: '20px', paddingBottom: '80px', textAlign: 'center' }}>
        <p style={{ color: c.textMuted, fontSize: '12px', fontFamily: 'monospace', letterSpacing: '1px' }}>SISTEMA_TERMINADO // HECHO CON 💛 DESDE TERMUX</p>
      </footer>

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 40px rgba(250, 204, 21, 0.2); }
          50% { box-shadow: 0 0 60px rgba(250, 204, 21, 0.5); }
        }
      `}</style>
    </div>
  );
}
