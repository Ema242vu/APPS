"use client";

import { useState, useEffect } from "react";

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

const t = {
  es: {
    nav: { tutorial: "Tutorial", privacy: "Privacidad", faq: "Preguntas", terms: "Términos" },
    hero: { l1: "EL PODER DE LAS", l2: "APPS PREMIUM", sub: "Descarga las versiones premium de tus apps favoritas. Todo en un solo lugar, rápido y seguro." },
    sec: { news: "📰 Novedades", top: "🔥 Top Descargas", recent: "✨ Recién Agregadas", soon: "Próximamente 🚀", soonText: "Estamos trabajando en nuevas apps premium. ¡Vuelve pronto!" },
    search: "Buscar app premium...",
    cats: ["Todas", "Video", "Música", "Social", "Herramientas"],
    dl: "Descargar",
    noRes: "No se encontraron apps con ese nombre. 🐱",
    join: "Únete al Grupo",
    comm: { title: "Comentarios", placeholder: "Escribe tu comentario...", send: "Enviar", empty: "Sé el primero en comentar 👀", name: "Tu nombre", open: "Comentarios" },
    cook: { text: "🍪 Usamos cookies para mejorar tu experiencia. Al continuar, aceptas su uso.", accept: "Aceptar", reject: "Rechazar" },
    foot: "SISTEMA_TERMINADO // HECHO CON 💛 DESDE TERMUX"
  },
  en: {
    nav: { tutorial: "Tutorial", privacy: "Privacy", faq: "FAQ", terms: "Terms" },
    hero: { l1: "THE POWER OF", l2: "PREMIUM APPS", sub: "Download premium versions of your favorite apps. All in one place, fast and secure." },
    sec: { news: "📰 News", top: "🔥 Top Downloads", recent: "✨ Recently Added", soon: "Coming Soon 🚀", soonText: "We are working on new premium apps. Come back soon!" },
    search: "Search premium app...",
    cats: ["All", "Video", "Music", "Social", "Tools"],
    dl: "Download",
    noRes: "No apps found with that name. 🐱",
    join: "Join the Group",
    comm: { title: "Comments", placeholder: "Write your comment...", send: "Send", empty: "Be the first to comment 👀", name: "Your name", open: "Comments" },
    cook: { text: "🍪 We use cookies to improve your experience. By continuing, you accept their use.", accept: "Accept", reject: "Reject" },
    foot: "SYSTEM_FINISHED // MADE WITH 💛 FROM TERMUX"
  }
};

export default function Home() {
  const [hasEntered, setHasEntered] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [favorites, setFavorites] = useState<string[]>([]);
  const [hoveredApp, setHoveredApp] = useState<string | null>(null);
  const [lang, setLang] = useState<"es" | "en">("es");
  const [showCookies, setShowCookies] = useState(false);
  const [comments, setComments] = useState<Record<string, { name: string; text: string; date: string }[]>>({});
  const [openComments, setOpenComments] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [newText, setNewText] = useState("");

  const tr = t[lang];

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "dark" | "light" | null;
    if (savedTheme) setTheme(savedTheme);
    const savedLang = localStorage.getItem("lang") as "es" | "en" | null;
    if (savedLang) setLang(savedLang);
    const savedCookies = localStorage.getItem("cookiesAccepted");
    if (!savedCookies) setShowCookies(true);
    const savedRatings: Record<string, number> = {};
    apps.forEach(app => {
      const r = localStorage.getItem(`rating-${app.name}`);
      if (r) savedRatings[app.name] = parseInt(r);
    });
    setRatings(savedRatings);
    const savedFavs = localStorage.getItem("favorites");
    if (savedFavs) setFavorites(JSON.parse(savedFavs));
    const savedComments = localStorage.getItem("comments");
    if (savedComments) setComments(JSON.parse(savedComments));
  }, []);

  const toggleTheme = () => {
    const n = theme === "dark" ? "light" : "dark";
    setTheme(n); localStorage.setItem("theme", n);
  };
  const toggleLang = (l: "es" | "en") => { setLang(l); localStorage.setItem("lang", l); };
  const acceptCookies = (v: boolean) => { setShowCookies(false); localStorage.setItem("cookiesAccepted", v ? "yes" : "no"); };

  const toggleFavorite = (n: string, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    const nf = favorites.includes(n) ? favorites.filter(f => f !== n) : [...favorites, n];
    setFavorites(nf); localStorage.setItem("favorites", JSON.stringify(nf));
  };

  const setRating = (n: string, v: number, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setRatings({ ...ratings, [n]: v }); localStorage.setItem(`rating-${n}`, v.toString());
  };

  const addComment = (appName: string) => {
    if (!newName.trim() || !newText.trim()) return;
    const c = { ...comments };
    if (!c[appName]) c[appName] = [];
    c[appName].unshift({ name: newName, text: newText, date: new Date().toLocaleDateString() });
    setComments(c);
    localStorage.setItem("comments", JSON.stringify(c));
    setNewName(""); setNewText("");
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
    const matchCat = selectedCategory === 0 || app.category === tr.cats[selectedCategory];
    const matchSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) || app.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });
  const topApps = apps.filter(a => a.isTop);
  const newApps = apps.filter(a => a.isNew);

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

      <nav style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '500px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px', borderBottom: `1px solid ${c.cardBorder}`, marginBottom: '40px', flexWrap: 'wrap', gap: '8px' }}>
        <span style={{ fontSize: '18px', fontWeight: 900, letterSpacing: '2px', color: c.text, textTransform: 'uppercase' }}>Mi Store 🐾</span>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <a href="/tutorial" style={{ fontSize: '12px', fontWeight: 'bold', color: c.textMuted, textDecoration: 'none' }}>{tr.nav.tutorial}</a>
          <a href="/faq" style={{ fontSize: '12px', fontWeight: 'bold', color: c.textMuted, textDecoration: 'none' }}>{tr.nav.faq}</a>
          <a href="/privacidad" style={{ fontSize: '12px', fontWeight: 'bold', color: c.textMuted, textDecoration: 'none' }}>{tr.nav.privacy}</a>
          <a href="/terminos" style={{ fontSize: '12px', fontWeight: 'bold', color: c.textMuted, textDecoration: 'none' }}>{tr.nav.terms}</a>
          <button onClick={() => toggleLang(lang === "es" ? "en" : "es")} style={{ background: c.chipBg, border: 'none', borderRadius: '20px', padding: '5px 10px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold', color: c.text }}>
            {lang === "es" ? "🇪🇸 ES" : "🇺🇸 EN"}
          </button>
          <button onClick={toggleTheme} style={{ background: c.chipBg, border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontSize: '14px', color: c.text }}>
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>
      </nav>

      <section style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: '500px', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 900, lineHeight: 1.1, marginBottom: '20px', letterSpacing: '-1px', color: c.text }}>
          {tr.hero.l1} <br />
          <span style={{ background: 'linear-gradient(to right, #facc15, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{tr.hero.l2}</span>
        </h1>
        <p style={{ color: c.textMuted, fontSize: '16px', lineHeight: 1.6, maxWidth: '400px', margin: '0 auto', marginBottom: '30px' }}>{tr.hero.sub}</p>
        <div style={{ width: '140px', height: '140px', margin: '0 auto', borderRadius: '50%', overflow: 'hidden', border: `3px solid ${c.cardBorder}`, boxShadow: '0 0 40px rgba(250, 204, 21, 0.2)', backgroundColor: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pulse 3s ease-in-out infinite' }}>
          <img src="https://i.postimg.cc/QdBk2k5q/13.jpg" alt="Gato" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = '<span style="font-size: 80px;">🐱</span>'; }} />
        </div>
      </section>

      <section style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '500px', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: c.text }}>{tr.sec.news}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ padding: '12px 16px', borderRadius: '12px', backgroundColor: c.cardBg, border: `1px solid ${c.cardBorder}`, fontSize: '13px', color: c.textMuted, display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#facc15', whiteSpace: 'nowrap' }}>{lang === "es" ? "Hoy" : "Today"}</span>
            <span>🎉 {lang === "es" ? "Nuevas secciones: FAQ, Términos, comentarios y más." : "New sections: FAQ, Terms, comments and more."}</span>
          </div>
        </div>
      </section>

      <section style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '500px', marginBottom: '25px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', color: '#facc15' }}>{tr.sec.top}</h2>
        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '10px' }}>
          {topApps.map((app, i) => (
            <a key={i} href={app.link} target="_blank" rel="noopener noreferrer" style={{ flex: '0 0 auto', width: '110px', padding: '12px', borderRadius: '16px', backgroundColor: c.cardBg, border: `1px solid ${c.cardBorder}`, textDecoration: 'none', color: c.text, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '45px', height: '45px', borderRadius: '10px', overflow: 'hidden', backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {app.iconUrl && app.iconUrl !== "AQUI_VA_EL_LINK_DE_LA_IMAGEN" ? <img src={app.iconUrl} alt={app.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '22px' }}>{app.emoji}</span>}
              </div>
              <span style={{ fontSize: '11px', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>{app.name.replace(" Premium", "").replace(" VIP", "")}</span>
            </a>
          ))}
        </div>
      </section>

      <section style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '500px', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', color: '#22c55e' }}>{tr.sec.recent}</h2>
        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '10px' }}>
          {newApps.map((app, i) => (
            <a key={i} href={app.link} target="_blank" rel="noopener noreferrer" style={{ flex: '0 0 auto', width: '110px', padding: '12px', borderRadius: '16px', backgroundColor: c.cardBg, border: `1px solid ${c.cardBorder}`, textDecoration: 'none', color: c.text, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '45px', height: '45px', borderRadius: '10px', overflow: 'hidden', backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {app.iconUrl && app.iconUrl !== "AQUI_VA_EL_LINK_DE_LA_IMAGEN" ? <img src={app.iconUrl} alt={app.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '22px' }}>{app.emoji}</span>}
              </div>
              <span style={{ fontSize: '11px', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>{app.name.replace(" Premium", "").replace(" VIP", "")}</span>
            </a>
          ))}
        </div>
      </section>

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '500px', marginBottom: '20px', display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '5px' }}>
        {tr.cats.map((cat, i) => (
          <button key={i} onClick={() => setSelectedCategory(i)} style={{ padding: '10px 18px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', whiteSpace: 'nowrap', backgroundColor: selectedCategory === i ? '#facc15' : c.chipBg, color: selectedCategory === i ? '#0d0d12' : c.chipText }}>
            {cat}
          </button>
        ))}
      </div>

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '500px', marginBottom: '30px' }}>
        <input type="text" placeholder={tr.search} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '16px 20px', borderRadius: '16px', backgroundColor: c.inputBg, border: `1px solid ${c.inputBorder}`, color: c.text, fontSize: '16px', outline: 'none', boxSizing: 'border-box' }} />
      </div>

      <section id="apps" style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {filteredApps.length > 0 ? (
          filteredApps.map((app, index) => (
            <a key={index} href={app.link} target="_blank" rel="noopener noreferrer"
              onMouseEnter={() => setHoveredApp(app.name)}
              onMouseLeave={() => setHoveredApp(null)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                padding: '30px', borderRadius: '20px', backgroundColor: c.cardBg,
                border: `1px solid ${c.cardBorder}`, textDecoration: 'none', color: c.text,
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: hoveredApp === app.name ? `0 15px 45px ${app.glow}` : '0 8px 32px rgba(0, 0, 0, 0.3)',
                transform: hoveredApp === app.name ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
                position: 'relative', overflow: 'hidden'
              }}
            >
              {app.isTop && (<span style={{ position: 'absolute', top: '15px', right: '15px', backgroundColor: 'rgba(250, 204, 21, 0.2)', color: '#facc15', padding: '4px 10px', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold' }}>🔥 TOP</span>)}
              {app.isNew && !app.isTop && (<span style={{ position: 'absolute', top: '15px', right: '15px', backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', padding: '4px 10px', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold' }}>✨ {lang === "es" ? "NUEVO" : "NEW"}</span>)}

              <button onClick={(e) => toggleFavorite(app.name, e)} style={{ position: 'absolute', top: '15px', left: '15px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: favorites.includes(app.name) ? '#facc15' : c.textMuted }}>
                {favorites.includes(app.name) ? '★' : '☆'}
              </button>

              <div style={{ width: '80px', height: '80px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', backgroundColor: 'rgba(0,0,0,0.4)', border: `1px solid ${c.cardBorder}`, marginBottom: '20px', overflow: 'hidden', transform: hoveredApp === app.name ? 'scale(1.1) rotate(3deg)' : 'scale(1)' }}>
                {app.iconUrl && app.iconUrl !== "AQUI_VA_EL_LINK_DE_LA_IMAGEN" ? (<img src={app.iconUrl} alt={app.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = `<span style="font-size: 40px;">${app.emoji}</span>`; }} />) : (<span>{app.emoji}</span>)}
              </div>

              <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '8px', color: c.text }}>{app.name}</h2>
              <p style={{ color: c.textMuted, fontSize: '14px', marginBottom: '15px' }}>{app.description}</p>

              <div style={{ display: 'flex', gap: '4px', marginBottom: '15px' }} onClick={(e) => e.preventDefault()}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} onClick={(e) => setRating(app.name, star, e)} style={{ fontSize: '22px', cursor: 'pointer', color: (ratings[app.name] || 0) >= star ? '#facc15' : c.textMuted }}>★</span>
                ))}
              </div>

              <button onClick={(e) => { e.preventDefault(); setOpenComments(app.name); }} style={{ background: 'none', border: `1px solid ${c.cardBorder}`, borderRadius: '12px', padding: '8px 14px', color: c.textMuted, fontSize: '12px', cursor: 'pointer', marginBottom: '15px' }}>
                💬 {tr.comm.open} ({comments[app.name]?.length || 0})
              </button>

              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '16px', borderRadius: '12px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '14px', backgroundColor: app.glow, border: `1px solid ${app.border}`, color: app.text, boxShadow: `0 0 20px ${app.glow}` }}>
                {tr.dl}
              </span>
            </a>
          ))
        ) : (<p style={{ textAlign: 'center', color: c.textMuted, fontStyle: 'italic' }}>{tr.noRes}</p>)}
      </section>

      <section style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '500px', marginTop: '50px', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center', color: c.text }}>{tr.sec.soon}</h2>
        <div style={{ padding: '40px 20px', borderRadius: '20px', border: `2px dashed ${c.cardBorder}`, backgroundColor: c.cardBg, textAlign: 'center', color: c.textMuted }}>
          <p style={{ fontSize: '14px' }}>{tr.sec.soonText}</p>
        </div>
      </section>

      <a href="https://chat.whatsapp.com/HoM5JTuNl16BBhFSp1YBkm" target="_blank" rel="noopener noreferrer" style={{ position: 'fixed', bottom: '30px', right: '20px', backgroundColor: '#25D366', color: '#ffffff', padding: '16px 24px', borderRadius: '50px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 30px rgba(37, 211, 102, 0.4)', textDecoration: 'none', zIndex: 50, fontSize: '14px' }}>
        <span style={{ fontSize: '20px' }}>💬</span> {tr.join}
      </a>

      <footer style={{ position: 'relative', zIndex: 10, marginTop: 'auto', paddingTop: '20px', paddingBottom: '80px', textAlign: 'center' }}>
        <p style={{ color: c.textMuted, fontSize: '12px', fontFamily: 'monospace' }}>{tr.foot}</p>
      </footer>

      {/* Modal de Comentarios */}
      {openComments && (
        <div onClick={() => setOpenComments(null)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: '450px', width: '100%', maxHeight: '80vh', overflowY: 'auto', padding: '30px', borderRadius: '20px', backgroundColor: '#1a1a1f', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#fff' }}>{tr.comm.title}: {openComments}</h2>
            
            <input type="text" placeholder={tr.comm.name} value={newName} onChange={(e) => setNewName(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', marginBottom: '10px', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }} />
            <textarea placeholder={tr.comm.placeholder} value={newText} onChange={(e) => setNewText(e.target.value)} rows={3} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', marginBottom: '10px', fontSize: '14px', resize: 'none', boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit' }} />
            <button onClick={() => addComment(openComments)} style={{ width: '100%', padding: '12px', borderRadius: '10px', backgroundColor: '#facc15', color: '#0d0d12', fontWeight: 'bold', border: 'none', cursor: 'pointer', marginBottom: '20px' }}>{tr.comm.send}</button>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {comments[openComments]?.length > 0 ? comments[openComments].map((cm, i) => (
                <div key={i} style={{ padding: '14px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#facc15' }}>{cm.name}</span>
                    <span style={{ fontSize: '11px', color: '#6b7280' }}>{cm.date}</span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#d1d5db', margin: 0 }}>{cm.text}</p>
                </div>
              )) : (<p style={{ textAlign: 'center', color: '#6b7280', fontSize: '13px', fontStyle: 'italic' }}>{tr.comm.empty}</p>)}
            </div>

            <button onClick={() => setOpenComments(null)} style={{ width: '100%', marginTop: '20px', padding: '10px', borderRadius: '10px', backgroundColor: 'transparent', color: '#9ca3af', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', fontSize: '13px' }}>
              {lang === "es" ? "Cerrar" : "Close"}
            </button>
          </div>
        </div>
      )}

      {/* Banner de Cookies */}
      {showCookies && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(13,13,18,0.98)', borderTop: '1px solid rgba(255,255,255,0.1)', padding: '20px', zIndex: 200, backdropFilter: 'blur(12px)' }}>
          <div style={{ maxWidth: '500px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <p style={{ color: '#d1d5db', fontSize: '13px', lineHeight: 1.5, margin: 0 }}>{tr.cook.text}</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => acceptCookies(true)} style={{ flex: 1, padding: '12px', borderRadius: '10px', backgroundColor: '#facc15', color: '#0d0d12', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '13px' }}>{tr.cook.accept}</button>
              <button onClick={() => acceptCookies(false)} style={{ flex: 1, padding: '12px', borderRadius: '10px', backgroundColor: 'transparent', color: '#9ca3af', border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer', fontSize: '13px' }}>{tr.cook.reject}</button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 40px rgba(250, 204, 21, 0.2); }
          50% { box-shadow: 0 0 60px rgba(250, 204, 21, 0.5); }
        }
      `}</style>
    </div>
  );
}
