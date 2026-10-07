"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apps, categorias } from "@/lib/apps";
import AdModal from "@/components/AdModal";

const APPS_POR_PAGINA = 12;

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
        <img key={p.id} src="https://i.postimg.cc/ZK5PMs9t/c9ffe8d5229986251e05870abbabb612.jpg" alt="" className="particle" style={{ left: `${p.left}%`, width: `${p.size}px`, height: `${p.size}px`, animationDuration: `${p.duration}s`, animationDelay: `${p.delay}s`, opacity: 0.12 }} />
      ))}
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [hasEntered, setHasEntered] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [theme, setTheme] = useState("dark");
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCookies, setShowCookies] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const [pendingAppName, setPendingAppName] = useState("");
  const [show18Modal, setShow18Modal] = useState(false);
  const [pending18Slug, setPending18Slug] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
    const savedRatings = localStorage.getItem("ratings");
    if (savedRatings) setRatings(JSON.parse(savedRatings));
    const savedFavs = localStorage.getItem("favorites");
    if (savedFavs) setFavorites(JSON.parse(savedFavs));
    if (!localStorage.getItem("cookiesAccepted")) setShowCookies(true);
    setTimeout(() => setLoading(false), 1000);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm]);

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

  const handleAppClick = (e: React.MouseEvent, app: any) => {
    if (app.category === "+18") {
      e.preventDefault();
      setPending18Slug(app.slug);
      setShow18Modal(true);
    }
  };

  const confirm18 = () => {
    if (pending18Slug) router.push(`/apps/${pending18Slug}`);
    setShow18Modal(false);
    setPending18Slug(null);
  };

  const close18 = () => {
    setShow18Modal(false);
    setPending18Slug(null);
  };

  const filteredApps = apps.filter((app) => {
    const matchesCategory = selectedCategory === 0 || app.category === categorias[selectedCategory];
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) || app.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  const topApps = apps.filter(a => a.isTop);

  const totalPages = Math.ceil(filteredApps.length / APPS_POR_PAGINA);
  const startIndex = (currentPage - 1) * APPS_POR_PAGINA;
  const paginatedApps = filteredApps.slice(startIndex, startIndex + APPS_POR_PAGINA);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 600, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1, 2, 3);
      if (currentPage > 5) pages.push('...');
      if (currentPage > 4 && currentPage < totalPages - 2) pages.push(currentPage);
      if (currentPage < totalPages - 3) pages.push('...');
      pages.push(totalPages - 1, totalPages);
    }
    return pages;
  };

  const c = {
    bg: theme === 'light' ? '#f8f8fc' : theme === 'cyberpunk' ? '#08001a' : theme === 'sunset' ? '#150808' : theme === 'ice' ? '#080d18' : '#0a0a0f',
    text: theme === 'light' ? '#0a0a0f' : theme === 'cyberpunk' ? '#e0d4ff' : theme === 'sunset' ? '#ffe4c4' : theme === 'ice' ? '#e2e8f0' : '#ffffff',
    muted: theme === 'light' ? '#6b7280' : theme === 'cyberpunk' ? '#a78bfa' : theme === 'sunset' ? '#fdba74' : theme === 'ice' ? '#94a3b8' : '#8b8b9a',
    card: theme === 'light' ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.025)',
    border: theme === 'light' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)',
    accent: theme === 'cyberpunk' ? '#22d3ee' : theme === 'sunset' ? '#f472b6' : theme === 'ice' ? '#38bdf8' : '#facc15',
  };

  if (!hasEntered) {
    return (
      <div style={{ minHeight: '100vh', background: 'radial-gradient(ellipse at top, #1a1a2e 0%, #0a0a0f 50%)', color: '#fff', fontFamily: 'Inter, system-ui, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center' }}>
        <div className="slide-up" style={{ maxWidth: '420px', padding: '45px 35px', borderRadius: '28px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)', boxShadow: '0 30px 80px rgba(0,0,0,0.6)' }}>
          <div className="pulse-soft" style={{ fontSize: '70px', marginBottom: '20px' }}>🛡️</div>
          <h1 style={{ fontSize: '28px', fontWeight: 900, marginBottom: '15px', letterSpacing: '-0.5px' }}>PERSONS-COMUNITY</h1>
          <p style={{ color: '#8b8b9a', fontSize: '15px', lineHeight: 1.7, marginBottom: '32px' }}>
            Entrarás a la zona de descargas. Son <b style={{ color: '#facc15' }}>apps modificadas de terceros</b>: descárgalas bajo tu propia responsabilidad.
          </p>
          <button onClick={() => setHasEntered(true)} className="bounce-click" style={{ width: '100%', padding: '18px', borderRadius: '16px', background: 'linear-gradient(135deg, #facc15, #f59e0b)', color: '#0a0a0f', fontWeight: 800, fontSize: '15px', border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1.5px', boxShadow: '0 15px 40px rgba(250, 204, 21, 0.3)' }}>
            Entrar a la tienda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: c.bg, color: c.text, fontFamily: 'Inter, system-ui, sans-serif', position: 'relative', overflow: 'hidden', transition: 'background-color 0.5s ease' }}>
      <FloatingParticles />

      <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${theme === 'light' ? 'rgba(0,0,0,0.025)' : 'rgba(255,255,255,0.02)'} 1px, transparent 1px), linear-gradient(90deg, ${theme === 'light' ? 'rgba(0,0,0,0.025)' : 'rgba(255,255,255,0.02)'} 1px, transparent 1px)`, backgroundSize: '50px 50px', zIndex: 0, pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', top: '-200px', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '800px', background: `radial-gradient(circle, ${c.accent}22 0%, transparent 60%)`, filter: 'blur(80px)', zIndex: 0, pointerEvents: 'none' }}></div>

      <div style={{ width: '100%', maxWidth: '720px', margin: '0 auto', position: 'relative', zIndex: 10, padding: '20px' }}>

        {/* HEADER */}
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '22px', borderBottom: `1px solid ${c.border}`, marginBottom: '40px' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: c.text }}>
            <img src="https://i.postimg.cc/QdBk2k5q/13.jpg" alt="PERSONS-COMUNITY Logo" style={{ width: '48px', height: '48px', borderRadius: '14px', objectFit: 'cover', border: `2px solid ${c.accent}` }} />
            <div>
              <p className="animated-gradient" style={{ fontSize: '18px', fontWeight: 900, letterSpacing: '1px', background: `linear-gradient(90deg, ${c.text}, ${c.accent}, ${c.text})`, backgroundSize: '200% 200%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textTransform: 'uppercase', margin: 0, lineHeight: 1 }}>PERSONS</p>
              <p style={{ fontSize: '10px', color: c.muted, margin: '2px 0 0 0', letterSpacing: '2px', textTransform: 'uppercase' }}>community</p>
            </div>
          </Link>
          <select value={theme} onChange={(e) => toggleTheme(e.target.value)} style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: '12px', padding: '8px 12px', color: c.text, fontSize: '12px', cursor: 'pointer', outline: 'none' }}>
            <option value="dark">🌙</option>
            <option value="light">☀️</option>
            <option value="cyberpunk">🟣</option>
            <option value="sunset">🌅</option>
            <option value="ice">❄️</option>
          </select>
        </nav>

        {/* HERO */}
        <section style={{ textAlign: 'center', marginBottom: '45px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '999px', background: `${c.accent}15`, border: `1px solid ${c.accent}33`, fontSize: '12px', color: c.accent, marginBottom: '20px', fontWeight: 600 }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }}></span>
            {apps.length}+ apps disponibles
          </div>
          <h1 style={{ fontSize: '44px', fontWeight: 900, lineHeight: 1.05, marginBottom: '15px', letterSpacing: '-2px', color: c.text }}>
            Lo mejor en<br />
            <span className="animated-gradient" style={{ background: `linear-gradient(90deg, ${c.accent}, #f59e0b, #facc15)`, backgroundSize: '200% 200%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'gradient-shift 4s ease infinite' }}>Apps y Juegos Android</span>
          </h1>
          <p style={{ color: c.muted, fontSize: '15px', lineHeight: 1.6, maxWidth: '480px', margin: '0 auto 30px' }}>
            Descubre las mejores aplicaciones y los juegos más divertidos para Android. Última versión, premium y sin anuncios.
          </p>

          {/* REDES SOCIALES */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '35px', flexWrap: 'wrap' }}>
            {[
              { img: 'https://i.supaimg.com/edbe52e7-a9fc-4e09-b7ee-0dc65fe103d3/a65cde85-132a-4209-a867-68fe6054722f.jpg', href: 'https://chat.whatsapp.com/LCGW1WtQbYACZKKeBPzsXI', color: '#25D366', name: 'WhatsApp' },
              { img: 'https://i.supaimg.com/edbe52e7-a9fc-4e09-b7ee-0dc65fe103d3/4724e75f-6363-4c1b-b929-627a6a582e4f.jpg', href: 'https://t.me/personsapks', color: '#0EA5E9', name: 'Telegram' },
              { img: 'https://i.supaimg.com/edbe52e7-a9fc-4e09-b7ee-0dc65fe103d3/38cb9e6a-b3d2-41dd-bde6-c249217ddf29.jpg', href: 'https://www.instagram.com/persons.177', color: '#EC4899', name: 'Instagram' },
              { img: 'https://i.supaimg.com/edbe52e7-a9fc-4e09-b7ee-0dc65fe103d3/daeecf20-0396-4b3e-a595-3852f29a0b95.jpg', href: 'https://discord.gg/A2vWQKj9w', color: '#5865F2', name: 'Discord' },
            ].map((s, i) => (
              <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" className="bounce-click" title={s.name} style={{ width: '52px', height: '52px', borderRadius: '16px', background: c.card, border: `1px solid ${s.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', overflow: 'hidden', transition: 'all 0.3s ease', boxShadow: `0 8px 20px ${s.color}20` }}>
                <img src={s.img} alt={s.name} style={{ width: '60%', height: '60%', objectFit: 'contain' }} />
              </a>
            ))}
          </div>
        </section>

        {/* BUSCADOR */}
        <div style={{ position: 'relative', marginBottom: '35px' }}>
          <input
            type="text"
            placeholder="🔍  Busca tu juego favorito..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '20px 24px', borderRadius: '18px', backgroundColor: c.card, border: `1px solid ${c.border}`, color: c.text, fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        {/* NAVEGACIÓN */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '45px' }}>
          {[
            { href: '/', emoji: '🏠', label: 'Inicio', color: '#facc15' },
            { href: '/codigos', emoji: '🔑', label: 'Códigos', color: '#f97316' },
            { href: '/escaner', emoji: '🔍', label: 'Escáner', color: '#22c55e' },
            { href: '/blog', emoji: '📚', label: 'Blog', color: '#0ea5e9' },
            { href: '/tutorial', emoji: '📖', label: 'Tutorial', color: '#a855f7' },
            { href: '/faq', emoji: '❓', label: 'FAQ', color: '#ef4444' },
          ].map((item, i) => (
            <Link key={i} href={item.href} className="bounce-click glass-hover" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '20px 10px', borderRadius: '18px', background: `${item.color}10`, border: `1px solid ${item.color}30`, textDecoration: 'none', color: c.text, textAlign: 'center', transition: 'all 0.3s ease' }}>
              <span style={{ fontSize: '26px' }}>{item.emoji}</span>
              <span style={{ fontSize: '12px', fontWeight: 700 }}>{item.label}</span>
            </Link>
          ))}
        </div>

        {/* BANNER CÓDIGOS */}
        <Link href="/codigos" className="bounce-click" style={{ display: 'block', textDecoration: 'none', marginBottom: '40px' }}>
          <div className="pulse-soft" style={{ padding: '28px', borderRadius: '22px', background: 'linear-gradient(135deg, rgba(250, 204, 21, 0.15) 0%, rgba(249, 115, 22, 0.15) 100%)', border: '1px solid rgba(250, 204, 21, 0.35)', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ fontSize: '46px' }}>🔑</div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '19px', fontWeight: 900, color: c.text, margin: 0, marginBottom: '4px' }}>Códigos Premium Gratis</h2>
              <p style={{ fontSize: '13px', color: c.muted, margin: 0 }}>Netflix, Anime WF, Xuper Hydra y más.</p>
            </div>
            <span style={{ fontSize: '22px', color: '#facc15' }}>→</span>
          </div>
        </Link>

        {/* TOP DESCARGAS */}
        {topApps.length > 0 && (
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 900, color: c.text, margin: 0, marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🔥</span> Tendencia hoy
            </h2>
            <div className="hide-scrollbar" style={{ display: 'flex', gap: '14px', overflowX: 'auto', paddingBottom: '8px' }}>
              {topApps.map((app, i) => (
                <Link key={i} href={`/apps/${app.slug}`} onClick={(e) => handleAppClick(e, app)} className="bounce-click glass-hover" style={{ flex: '0 0 auto', width: '160px', padding: '18px', borderRadius: '18px', background: c.card, border: `1px solid ${c.border}`, textDecoration: 'none', color: c.text, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '70px', height: '70px', borderRadius: '16px', overflow: 'hidden', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${app.border}` }}>
                    {app.iconUrl && app.iconUrl !== "AQUI_VA_EL_LINK_DE_LA_IMAGEN" ? <img src={app.iconUrl} alt={app.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '35px' }}>{app.emoji}</span>}
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>{app.name.replace(" Premium", "").replace(" VIP", "")}</span>
                  <span style={{ fontSize: '10px', color: '#22c55e', fontWeight: 600 }}>Última versión</span>
                  <div style={{ display: 'flex', gap: '2px', fontSize: '12px', color: '#facc15' }}>★★★★★</div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CATEGORÍAS */}
        <div style={{ marginBottom: '25px' }}>
          <div className="hide-scrollbar" style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '8px' }}>
            {categorias.map((cat, i) => (
              <button
                key={i}
                onClick={() => setSelectedCategory(i)}
                className="bounce-click"
                style={{
                  padding: '12px 22px',
                  borderRadius: '999px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  background: selectedCategory === i ? `linear-gradient(135deg, ${c.accent}, #f59e0b)` : c.card,
                  color: selectedCategory === i ? '#0a0a0f' : c.muted,
                  border: selectedCategory === i ? 'none' : `1px solid ${c.border}`,
                  boxShadow: selectedCategory === i ? `0 10px 30px ${c.accent}40` : 'none',
                  transition: 'all 0.3s ease'
                }}
              >
                {cat === "+18" ? "🔞 +18" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* LISTA DE APPS CON PAGINACIÓN */}
        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 900, color: c.text, margin: 0, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>{selectedCategory === 0 ? "🎮" : "📂"}</span>
            {selectedCategory === 0 ? "Todas las apps" : categorias[selectedCategory]}
            <span style={{ fontSize: '13px', color: c.muted, fontWeight: 500, marginLeft: '4px' }}>({filteredApps.length})</span>
          </h2>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
              {[1,2,3,4].map(i => <div key={i} className="skeleton-shimmer" style={{ height: '230px', borderRadius: '20px' }} />)}
            </div>
          ) : filteredApps.length > 0 ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '30px' }}>
                {paginatedApps.map((app, index) => (
                  <Link key={index} href={`/apps/${app.slug}`} className="bounce-click"
                    onClick={(e) => handleAppClick(e, app)}
                    style={{
                      padding: '14px',
                      borderRadius: '20px',
                      background: c.card,
                      border: `1px solid ${app.category === "+18" ? "rgba(220, 38, 38, 0.4)" : c.border}`,
                      textDecoration: 'none',
                      color: c.text,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      textAlign: 'center',
                      position: 'relative',
                      transition: 'all 0.3s ease',
                      overflow: 'hidden',
                    }}>
                    {app.isTop && (<span style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(250, 204, 21, 0.2)', color: '#facc15', padding: '2px 7px', borderRadius: '999px', fontSize: '8px', fontWeight: 800 }}>🔥 TOP</span>)}
                    {app.isNew && !app.isTop && app.category !== "+18" && (<span style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', padding: '2px 7px', borderRadius: '999px', fontSize: '8px', fontWeight: 800 }}>✨ NUEVO</span>)}
                    {app.category === "+18" && (<span style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(220, 38, 38, 0.25)', color: '#fca5a5', padding: '2px 7px', borderRadius: '999px', fontSize: '8px', fontWeight: 800 }}>🔞</span>)}

                    <button onClick={(e) => toggleFavorite(app.name, e)} style={{ position: 'absolute', top: '8px', left: '8px', background: 'none', border: 'none', fontSize: '15px', cursor: 'pointer', color: favorites.includes(app.name) ? '#facc15' : c.muted, padding: 0, lineHeight: 1 }}>{favorites.includes(app.name) ? '★' : '☆'}</button>

                    <div style={{ width: '75px', height: '75px', borderRadius: '18px', overflow: 'hidden', background: 'rgba(0,0,0,0.3)', border: `1px solid ${app.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '12px', boxShadow: `0 8px 20px ${app.glow}` }}>
                      {app.iconUrl && app.iconUrl !== "AQUI_VA_EL_LINK_DE_LA_IMAGEN" ? (<img src={app.iconUrl} alt={`Descargar ${app.name}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = `<span style="font-size: 36px;">${app.emoji}</span>`; }} />) : (<span style={{ fontSize: '36px' }}>{app.emoji}</span>)}
                    </div>

                    <h3 style={{ fontSize: '13px', fontWeight: 800, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', lineHeight: 1.3 }}>
                      {app.name.replace(" Premium", "").replace(" VIP", "")}
                    </h3>

                    <p style={{ fontSize: '10px', color: c.muted, margin: 0, fontWeight: 500 }}>{app.version} (Mod)</p>
                    <p style={{ fontSize: '10px', color: '#22c55e', margin: 0, fontWeight: 700 }}>✨ Última versión</p>

                    <div style={{ display: 'flex', gap: '2px', fontSize: '11px', marginTop: '2px' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} onClick={(e) => setRating(app.name, star, e)} style={{ cursor: 'pointer', color: (ratings[app.name] || 0) >= star ? '#facc15' : c.muted }}>★</span>
                      ))}
                    </div>

                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '10px', borderRadius: '12px', fontWeight: 800, fontSize: '11px', background: `linear-gradient(135deg, ${app.glow}, ${app.border})`, border: `1px solid ${app.border}`, color: app.text, marginTop: '4px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                      Descargar
                    </span>
                  </Link>
                ))}
              </div>

              {/* PAGINACIÓN */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginTop: '30px' }}>
                  {getPageNumbers().map((page, i) => (
                    typeof page === 'number' ? (
                      <button
                        key={i}
                        onClick={() => goToPage(page)}
                        className="bounce-click"
                        style={{
                          minWidth: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: 800,
                          background: currentPage === page ? 'linear-gradient(135deg, #22c55e, #16a34a)' : c.card,
                          color: currentPage === page ? '#ffffff' : c.muted,
                          border: currentPage === page ? 'none' : `1px solid ${c.border}`,
                          transition: 'all 0.3s ease',
                          boxShadow: currentPage === page ? '0 8px 20px rgba(34, 197, 94, 0.4)' : 'none',
                        }}
                      >
                        {page}
                      </button>
                    ) : (
                      <span key={i} style={{ color: c.muted, fontSize: '14px', padding: '0 4px' }}>...</span>
                    )
                  ))}
                  {currentPage < totalPages && (
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      className="bounce-click"
                      style={{
                        padding: '0 16px',
                        height: '40px',
                        borderRadius: '20px',
                        border: `1px solid ${c.border}`,
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 700,
                        background: c.card,
                        color: c.text,
                        marginLeft: '4px',
                      }}
                    >
                      Siguiente »
                    </button>
                  )}
                </div>
              )}
            </>
          ) : (
            <div style={{ padding: '60px 20px', textAlign: 'center', borderRadius: '20px', background: c.card, border: `1px dashed ${c.border}` }}>
              <div style={{ fontSize: '50px', marginBottom: '15px' }}>😿</div>
              <p style={{ color: c.muted, fontSize: '14px', margin: 0 }}>No se encontraron apps con ese nombre</p>
            </div>
          )}
        </section>

        {/* PRÓXIMAMENTE */}
        <section style={{ marginBottom: '50px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 900, color: c.text, margin: 0, marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🚀</span> Próximamente
          </h2>
          <div style={{ padding: '35px 20px', borderRadius: '20px', border: `1px dashed ${c.border}`, background: c.card, textAlign: 'center', color: c.muted }}>
            <p style={{ fontSize: '14px', margin: 0 }}>Nuevas apps premium cada semana. ¡Vuelve pronto! 🐱</p>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ borderTop: `1px solid ${c.border}`, paddingTop: '30px', paddingBottom: '110px', textAlign: 'center' }}>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '18px' }}>
            <Link href="/privacidad" style={{ color: c.muted, fontSize: '12px', textDecoration: 'none', fontWeight: 500 }}>Privacidad</Link>
            <Link href="/terminos" style={{ color: c.muted, fontSize: '12px', textDecoration: 'none', fontWeight: 500 }}>Términos</Link>
            <Link href="/faq" style={{ color: c.muted, fontSize: '12px', textDecoration: 'none', fontWeight: 500 }}>FAQ</Link>
            <Link href="/tutorial" style={{ color: c.muted, fontSize: '12px', textDecoration: 'none', fontWeight: 500 }}>Tutorial</Link>
            <Link href="/blog" style={{ color: c.muted, fontSize: '12px', textDecoration: 'none', fontWeight: 500 }}>Blog</Link>
          </div>
          <p style={{ color: c.muted, fontSize: '11px', fontFamily: 'monospace', marginBottom: '5px' }}>© 2026 PERSONS-COMUNITY</p>
          <p style={{ color: c.muted, fontSize: '10px', margin: 0, opacity: 0.7 }}>Hecho con 💛 desde Termux</p>
        </footer>
      </div>

      {/* WHATSAPP FLOTANTE */}
      <a href="https://chat.whatsapp.com/LCGW1WtQbYACZKKeBPzsXI" target="_blank" rel="noopener noreferrer" className="bounce-click" style={{ position: 'fixed', bottom: '25px', right: '25px', background: 'linear-gradient(135deg, #25D366, #128C7E)', color: '#fff', padding: '14px 22px', borderRadius: '999px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 15px 40px rgba(37, 211, 102, 0.4)', textDecoration: 'none', zIndex: 50, fontSize: '13px' }}>
        <span style={{ fontSize: '18px' }}>💬</span> Únete
      </a>

      <AdModal isOpen={showAd} onClose={() => setShowAd(false)} appName={pendingAppName} />

      {/* MODAL +18 */}
      {show18Modal && (
        <div onClick={close18} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px', backdropFilter: 'blur(15px)' }}>
          <div onClick={(e) => e.stopPropagation()} className="slide-up" style={{ maxWidth: '400px', width: '100%', padding: '38px 28px', borderRadius: '26px', background: '#12121a', border: '1.5px solid rgba(220, 38, 38, 0.5)', boxShadow: '0 25px 70px rgba(220, 38, 38, 0.3)', textAlign: 'center' }}>
            <div style={{ fontSize: '64px', marginBottom: '15px' }}>🔞</div>
            <h2 style={{ fontSize: '23px', fontWeight: 900, color: '#fff', marginBottom: '12px' }}>Contenido +18</h2>
            <p style={{ color: '#8b8b9a', fontSize: '14px', lineHeight: 1.7, marginBottom: '28px' }}>
              Este contenido es solo para <b style={{ color: '#fca5a5' }}>mayores de 18 años</b>. ¿Confirmas que tienes 18 años o más?
            </p>
            <button onClick={confirm18} className="bounce-click" style={{ width: '100%', padding: '16px', borderRadius: '14px', background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: '#fff', fontWeight: 800, fontSize: '14px', border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '12px', boxShadow: '0 12px 35px rgba(34, 197, 94, 0.4)' }}>
              ✓ Confirmar
            </button>
            <button onClick={close18} style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'transparent', color: '#8b8b9a', border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* COOKIES */}
      {showCookies && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(10,10,15,0.98)', borderTop: `1px solid ${c.border}`, padding: '22px', zIndex: 200, backdropFilter: 'blur(15px)' }}>
          <div style={{ maxWidth: '520px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <p style={{ color: c.muted, fontSize: '13px', lineHeight: 1.6, margin: 0 }}>🍪 Usamos cookies para mejorar tu experiencia. Al continuar, aceptas su uso.</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => { setShowCookies(false); localStorage.setItem('cookiesAccepted', 'yes'); }} className="bounce-click" style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'linear-gradient(135deg, #facc15, #f59e0b)', color: '#0a0a0f', fontWeight: 800, border: 'none', cursor: 'pointer', fontSize: '13px' }}>Aceptar</button>
              <button onClick={() => { setShowCookies(false); localStorage.setItem('cookiesAccepted', 'no'); }} className="bounce-click" style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'transparent', color: c.muted, border: `1px solid ${c.border}`, cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>Rechazar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
