"use client";

import { useState } from "react";

const apps = [
  {
    name: "CapCut Premium",
    description: "Editor de video con todas las funciones desbloqueadas.",
    link: "TU_ENLACE_AQUI",
    iconUrl: "https://i.postimg.cc/xd5CgB88/82bd819ca10ca7fa4f51e0cd7dba232f.jpg",
    emoji: "🎬",
    category: "Video",
    isTop: true,
    glow: "rgba(250, 204, 21, 0.4)",
    border: "rgba(250, 204, 21, 0.6)",
    text: "#facc15"
  },
  {
    name: "YouTube Premium",
    description: "Videos sin anuncios y reproducción en segundo plano.",
    link: "TU_ENLACE_AQUI",
    iconUrl: "https://i.postimg.cc/BvSZ8Ngg/eca9ac47a486c83541fa5f81159b8349.jpg",
    emoji: "▶️",
    category: "Video",
    isTop: true,
    glow: "rgba(251, 191, 36, 0.4)",
    border: "rgba(251, 191, 36, 0.6)",
    text: "#fbbf24"
  },
  {
    name: "Netflix Premium",
    description: "Todo el catálogo en máxima calidad 4K.",
    link: "TU_ENLACE_AQUI",
    iconUrl: "https://i.postimg.cc/RhkVNBsg/393747d57d29232eaa98b9ecba7c4dca.jpg",
    emoji: "🍿",
    category: "Video",
    isTop: true,
    glow: "rgba(220, 38, 38, 0.4)",
    border: "rgba(220, 38, 38, 0.6)",
    text: "#fca5a5"
  },
  {
    name: "Novastrim VIP",
    description: "Streaming y entretenimiento sin límites.",
    link: "TU_ENLACE_AQUI",
    iconUrl: "AQUI_VA_EL_LINK_DE_LA_IMAGEN",
    emoji: "📺",
    category: "Video",
    isTop: false,
    glow: "rgba(168, 85, 247, 0.4)",
    border: "rgba(168, 85, 247, 0.6)",
    text: "#d8b4fe"
  },
  {
    name: "Spotify Premium",
    description: "Música sin anuncios y descargas offline.",
    link: "TU_ENLACE_AQUI",
    iconUrl: "https://i.postimg.cc/52M2JfQs/99a0500dc420189ec2fdc984c8493fda.jpg",
    emoji: "🎧",
    category: "Música",
    isTop: true,
    glow: "rgba(34, 197, 94, 0.4)",
    border: "rgba(34, 197, 94, 0.6)",
    text: "#86efac"
  },
  {
    name: "YouTube Music Premium",
    description: "Tu música favorita sin interrupciones.",
    link: "TU_ENLACE_AQUI",
    iconUrl: "https://i.postimg.cc/vZLHHCWQ/03b22a2d5bba9d8fa2ac503b30d3b216.jpg",
    emoji: "🎵",
    category: "Música",
    isTop: false,
    glow: "rgba(244, 63, 94, 0.4)",
    border: "rgba(244, 63, 94, 0.6)",
    text: "#fda4af"
  },
  {
    name: "Xuper Premium",
    description: "La app definitiva con todas las ventajas.",
    link: "TU_ENLACE_AQUI",
    iconUrl: "AQUI_VA_EL_LINK_DE_LA_IMAGEN",
    emoji: "⚡",
    category: "Herramientas",
    isTop: false,
    glow: "rgba(249, 115, 22, 0.4)",
    border: "rgba(249, 115, 22, 0.6)",
    text: "#fdba74"
  },
  {
    name: "Telegram Premium",
    description: "Mensajería rápida, segura y sin límites.",
    link: "TU_ENLACE_AQUI",
    iconUrl: "https://i.postimg.cc/9XKfxdmy/2952b7f67446895f8f11c3afacc89edc.jpg",
    emoji: "✈️",
    category: "Social",
    isTop: true,
    glow: "rgba(14, 165, 233, 0.4)",
    border: "rgba(14, 165, 233, 0.6)",
    text: "#7dd3fc"
  },
  {
    name: "MicroG",
    description: "Servicios de Google optimizados y ligeros.",
    link: "TU_ENLACE_AQUI",
    iconUrl: "AQUI_VA_EL_LINK_DE_LA_IMAGEN",
    emoji: "🤖",
    category: "Herramientas",
    isTop: false,
    glow: "rgba(20, 184, 166, 0.4)",
    border: "rgba(20, 184, 166, 0.6)",
    text: "#5eead4"
  },
  {
    name: "Echo Music",
    description: "Descubre nuevos sonidos y artistas sin límites.",
    link: "TU_ENLACE_AQUI",
    iconUrl: "AQUI_VA_EL_LINK_DE_LA_IMAGEN",
    emoji: "🔊",
    category: "Música",
    isTop: false,
    glow: "rgba(236, 72, 153, 0.4)",
    border: "rgba(236, 72, 153, 0.6)",
    text: "#f9a8d4"
  },
];

const categorias = ["Todas", "Video", "Música", "Social", "Herramientas"];

export default function Home() {
  const [hasEntered, setHasEntered] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");

  // Filtro combinado: Categoría + Búsqueda
  const filteredApps = apps.filter((app) => {
    const matchesCategory = selectedCategory === "Todas" || app.category === selectedCategory;
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          app.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const topApps = apps.filter(app => app.isTop);

  // 🚪 Pantalla de Bienvenida (Gate)
  if (!hasEntered) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0d0d12',
        color: '#ffffff',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '400px',
          padding: '40px 30px',
          borderRadius: '24px',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
        }}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>🛡️</div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px', color: '#ffffff' }}>
            Zona de Descargas
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '16px', lineHeight: 1.6, marginBottom: '30px' }}>
            Entrarás a la zona de descargas, son apps premium <b>100% legales y seguras</b>, gracias al grupo DC se logran estas cosas. ¡Bienvenid@!
          </p>
          <button 
            onClick={() => setHasEntered(true)}
            style={{
              width: '100%',
              padding: '18px',
              borderRadius: '14px',
              backgroundColor: '#facc15',
              color: '#0d0d12',
              fontWeight: 'bold',
              fontSize: '16px',
              border: 'none',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              boxShadow: '0 4px 20px rgba(250, 204, 21, 0.4)'
            }}
          >
            Entrar a la tienda
          </button>
        </div>
      </div>
    );
  }

  // 🏠 Pantalla Principal
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0d0d12',
      color: '#ffffff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      position: 'relative',
      overflow: 'hidden',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      
      {/* 🔮 Fondo de Cuadrícula y Aura BLANCA/GRIS 🔮 */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        zIndex: 0,
        pointerEvents: 'none'
      }}></div>
      
      <div style={{
        position: 'absolute',
        top: '-150px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(255, 255, 255, 0.12) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(60px)',
        zIndex: 0,
        pointerEvents: 'none'
      }}></div>

      {/* 🧭 Barra de Navegación 🧭 */}
      <nav style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        maxWidth: '500px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '20px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        marginBottom: '40px'
      }}>
        <span style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '2px', color: '#ffffff', textTransform: 'uppercase' }}>
          Mi Store 🐾
        </span>
        <a href="/privacidad" style={{ fontSize: '14px', fontWeight: 'bold', color: '#9ca3af', textDecoration: 'none' }}>
          Privacidad
        </a>
      </nav>

      {/* 🌟 Sección Hero (Bienvenida) 🌟 */}
      <section style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: '500px', marginBottom: '40px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '999px',
          backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
          fontSize: '12px', color: '#d1d5db', marginBottom: '20px', fontFamily: 'monospace'
        }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }}></span>
          Sistema en línea
        </div>
        
        <h1 style={{ fontSize: '48px', fontWeight: 900, lineHeight: 1.1, marginBottom: '20px', letterSpacing: '-1px' }}>
          EL PODER DE LAS <br />
          <span style={{ background: 'linear-gradient(to right, #facc15, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            APPS PREMIUM
          </span>
        </h1>
        
        <p style={{ color: '#9ca3af', fontSize: '16px', lineHeight: 1.6, maxWidth: '400px', margin: '0 auto', marginBottom: '30px' }}>
          Descarga las versiones premium de tus apps favoritas. Todo en un solo lugar, rápido y seguro.
        </p>

        {/* 🐱 Gato de Bienvenida 🐱 */}
        <div style={{
          width: '140px', height: '140px', margin: '0 auto', borderRadius: '50%', overflow: 'hidden',
          border: '3px solid rgba(255,255,255,0.2)', boxShadow: '0 0 40px rgba(255, 255, 255, 0.1)',
          backgroundColor: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <img 
            src="https://i.postimg.cc/QdBk2k5q/13.jpg" 
            alt="Gato" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.innerHTML = '<span style="font-size: 80px;">🐱</span>';
            }}
          />
        </div>
      </section>

      {/* 🔥 Sección Top Descargas 🔥 */}
      <section style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '500px', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px', color: '#facc15', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🔥</span> Top Descargas
        </h2>
        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '10px' }}>
          {topApps.map((app, index) => (
            <a 
              key={index} 
              href={app.link} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                flex: '0 0 auto', width: '120px', padding: '15px', borderRadius: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255,255,255,0.08)',
                textDecoration: 'none', color: '#ffffff', textAlign: 'center', display: 'flex',
                flexDirection: 'column', alignItems: 'center', gap: '8px'
              }}
            >
              <div style={{
                width: '50px', height: '50px', borderRadius: '12px', overflow: 'hidden',
                backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {app.iconUrl && app.iconUrl !== "AQUI_VA_EL_LINK_DE_LA_IMAGEN" ? (
                  <img src={app.iconUrl} alt={app.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '24px' }}>{app.emoji}</span>
                )}
              </div>
              <span style={{ fontSize: '12px', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
                {app.name.replace(" Premium", "").replace(" VIP", "")}
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* 🏷️ Filtro de Categorías 🏷️ */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '500px', marginBottom: '20px', display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '5px' }}>
        {categorias.map((cat, index) => (
          <button
            key={index}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '10px 18px', borderRadius: '20px', border: 'none', cursor: 'pointer',
              fontSize: '13px', fontWeight: 'bold', whiteSpace: 'nowrap',
              backgroundColor: selectedCategory === cat ? '#facc15' : 'rgba(255,255,255,0.05)',
              color: selectedCategory === cat ? '#0d0d12' : '#9ca3af',
              transition: 'all 0.3s ease'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 🔍 Barra de Búsqueda 🔍 */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '500px', marginBottom: '30px' }}>
        <input 
          type="text" placeholder="Buscar app premium..." value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%', padding: '16px 20px', borderRadius: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#ffffff', fontSize: '16px', outline: 'none', backdropFilter: 'blur(10px)', boxSizing: 'border-box'
          }}
        />
      </div>

      {/* 📱 Sección de Apps 📱 */}
      <section id="apps" style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {filteredApps.length > 0 ? (
          filteredApps.map((app, index) => (
            <a 
              key={index} href={app.link} target="_blank" rel="noopener noreferrer"
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                padding: '30px', borderRadius: '20px', backgroundColor: 'rgba(255, 255, 255, 0.02)',
                backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.08)',
                textDecoration: 'none', color: '#ffffff', transition: 'all 0.3s ease',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)', position: 'relative'
              }}
            >
              {app.isTop && (
                <span style={{
                  position: 'absolute', top: '15px', right: '15px', backgroundColor: 'rgba(250, 204, 21, 0.2)',
                  color: '#facc15', padding: '4px 10px', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold'
                }}>
                  🔥 TOP
                </span>
              )}

              <div style={{
                width: '80px', height: '80px', borderRadius: '16px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '40px', backgroundColor: 'rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.1)', marginBottom: '20px', overflow: 'hidden'
              }}>
                {app.iconUrl && app.iconUrl !== "AQUI_VA_EL_LINK_DE_LA_IMAGEN" ? (
                  <img src={app.iconUrl} alt={app.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = `<span style="font-size: 40px;">${app.emoji}</span>`; }}
                  />
                ) : (
                  <span>{app.emoji}</span>
                )}
              </div>
              
              <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '8px', color: '#ffffff' }}>{app.name}</h2>
              <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '24px' }}>{app.description}</p>
              
              <span style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',
                padding: '16px', borderRadius: '12px', fontWeight: 'bold', letterSpacing: '1px',
                textTransform: 'uppercase', fontSize: '14px', backgroundColor: app.glow,
                border: `1px solid ${app.border}`, color: app.text, boxShadow: `0 0 20px ${app.glow}`, transition: 'all 0.3s ease'
              }}>
                Descargar
              </span>
            </a>
          ))
        ) : (
          <p style={{ textAlign: 'center', color: '#9ca3af', fontStyle: 'italic' }}>
            No se encontraron apps con ese nombre. 🐱
          </p>
        )}
      </section>

      {/* 🚧 Sección Próximamente 🚧 */}
      <section style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '500px', marginTop: '50px', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center', color: '#ffffff' }}>
          Próximamente 🚀
        </h2>
        <div style={{
          padding: '40px 20px', borderRadius: '20px', border: '2px dashed rgba(255, 255, 255, 0.15)',
          backgroundColor: 'rgba(255, 255, 255, 0.02)', textAlign: 'center', color: '#9ca3af'
        }}>
          <p style={{ fontSize: '14px' }}>Estamos trabajando en nuevas apps premium. ¡Vuelve pronto!</p>
        </div>
      </section>

      {/* 💬 Botón Flotante de WhatsApp 💬 */}
      <a 
        href="https://chat.whatsapp.com/HoM5JTuNl16BBhFSp1YBkm" 
        target="_blank" rel="noopener noreferrer"
        style={{
          position: 'fixed', bottom: '30px', right: '20px', backgroundColor: '#25D366',
          color: '#ffffff', padding: '16px 24px', borderRadius: '50px', fontWeight: 'bold',
          display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 30px rgba(37, 211, 102, 0.4)',
          textDecoration: 'none', zIndex: 50, border: '2px solid rgba(255,255,255,0.2)', fontSize: '14px'
        }}
      >
        <span style={{ fontSize: '20px' }}>💬</span> Únete al Grupo
      </a>

      <footer style={{ position: 'relative', zIndex: 10, marginTop: 'auto', paddingTop: '20px', paddingBottom: '80px', textAlign: 'center' }}>
        <p style={{ color: '#6b7280', fontSize: '12px', fontFamily: 'monospace', letterSpacing: '1px' }}>
          SISTEMA_TERMINADO // HECHO CON 💛 DESDE TERMUX
        </p>
      </footer>
    </div>
  )
}
