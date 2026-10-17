"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apps, categorias } from "@/lib/apps";
import AdModal from "@/components/AdModal";
import AppCardCompact from "@/components/AppCardCompact";
import CategoryGrid from "@/components/CategoryGrid";
import RomAddonCard from "@/components/RomAddonCard";

/* ============================================
   TOKENS — design system
   ============================================ */
const R = { sm: 2, md: 8, lg: 16, pill: 50 };
const S = { x4: 4, x8: 8, x12: 12, x16: 16, x20: 20, x24: 24, x32: 32, x40: 40, x48: 48, x56: 56, x64: 64, x80: 80 };
const W = { light: 400, reg: 500, med: 600, semi: 700 };

const APPS_POR_PAGINA = 12;

const RECENT_SLUGS = [
  "buena-pizza-gran-pizza",
  "mini-soccer-star",
  "rayman-mini",
  "resident-evil-4-mobile-edition",
  "repo",
  "shotgun-king",
  "dead-cells", "the-legend-of-zelda-ocarina-of-time-rom",
  "super-meat-boy-forever",
  "flightradar24",
  "shadow-fight-2",
  "addon-ai-players",
  "addon-backpack-stuff",
  "addon-immersive-physics",
  "addon-ocean-biomes",
  "addon-portal-gun",
  "addon-smooth-moves",
  "addon-villager-news",
  "flipaclip-premium",
  "lark-player-premium",
  "proton-mail-premium",
  "forager",
  "addon-health-bar",
  "addon-night-vision-universal",
  "addon-spider-man-project",
  "addon-lilium-dynamic-light",
  "addon-3d-totem-player",
  "addon-view-model",
  "addon-item-physics",
  "addon-reforge-armor",
  "addon-prizma-visual",
  "addon-jennys-mod",
  "addon-actions-and-stuff",
  "gouge-descent",
  "addon-infinite-durability",
  "mario-kart-64-rom",
  "super-mario-64-rom",
  "novel-stars",
  "kissmycamera",
  "y2k-editor-de-fotos-2000s",
  "magic-rampage",
  "hbo-max-premium",
  "pou",
  "annelids",
  "angry-birds-go",
  "danganronpa-v3",
  "terabox-premium",
  "zedge",
  "caja-arena",
  "slime-rancher",
  "terraria",
  "mango-sin-anuncios",
  "streamflix",
  "gearup-booster",
  "sally-face",
  "hitcue",
  "plantas-vs-zombies-fusion",
  "bowmasters",
  "worm-hunt",
  "twitter-x-mod",
  "proton-vpn-premium",
  "photoroom-pro",
  "photo-lab-pro",
  "pixelcut-premium",
  "video-compressor-premium",
  "twitch-premium",
  "strava-premium",
  "standby-pro",
  "pgt-pro",
  "onii-sama-after-dark",
  "katana-zero",
  "psycho-love",
  "deltarune",
  "lovemaniac",
  "minecraft",
  "deezer-premium",
  "king-hydra",
  "vn-video-editor",
  "ejercicios-en-casa",
  "hiper-calc-pro",
  "ilovepdf-premium",
  "imprint-premium",
  "lifesum-premium",
  "lightroom-premium",
  "lockmypix-premium",
];

type ViewMode = "inicio" | "apps" | "juegos" | "popular";

/* ============================================
   BOTTOM NAV — radius pill, spacing scale
   ============================================ */
function BottomNav({
  theme,
  current,
  onNavigate,
}: {
  theme: string;
  current: ViewMode;
  onNavigate: (tab: ViewMode) => void;
}) {
  const isLight = theme === "light";
  const bg = isLight ? "#ffffff" : "#0a0a0f";
  const border = isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)";
  const inactive = isLight ? "#595959" : "#6b7280";
  const active = "#facc15";

  const items: {
    key: ViewMode;
    label: string;
    external?: boolean;
    url?: string;
    svg: React.ReactNode;
  }[] = [
    {
      key: "inicio",
      label: "Inicio",
      svg: <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9.5z" />,
    },
    {
      key: "apps",
      label: "Apps",
      svg: (
        <>
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </>
      ),
    },
    {
      key: "juegos",
      label: "Juegos",
      svg: (
        <>
          <path d="M6 12h4M8 10v4M15 11h.01M18 13h.01" />
          <path d="M17.32 5H6.68a4 4 0 0 0-3.98 3.6c-.1.86-.36 2.5-.66 3.6a2.94 2.94 0 0 0 2.84 3.8c1.02 0 1.98-.5 2.55-1.35l.32-.48a2 2 0 0 1 1.66-.89h4.18a2 2 0 0 1 1.66.89l.32.48A3.05 3.05 0 0 0 18.12 16a2.94 2.94 0 0 0 2.84-3.8c-.3-1.1-.56-2.74-.66-3.6A4 4 0 0 0 17.32 5Z" />
        </>
      ),
    },
    {
      key: "popular",
      label: "Popular",
      svg: <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
    },
    {
      key: "inicio",
      label: "Telegram",
      external: true,
      url: "https://t.me/personsapks",
      svg: <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />,
    },
  ];

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: bg,
        borderTop: `1px solid ${border}`,
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        zIndex: 100,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        padding: `${S.x8}px 0 ${S.x12}px`,
      }}
    >
      {items.map((item, i) => {
        if (item.external) {
          return (
            <a
              key={i}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bounce-click"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                padding: `${S.x4}px 0`,
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: inactive }}
              >
                {item.svg}
              </svg>
              <span style={{ fontSize: "11px", fontWeight: W.reg, color: inactive, marginTop: S.x4 }}>
                {item.label}
              </span>
            </a>
          );
        }

        const isActive = current === item.key;
        const color = isActive ? active : inactive;

        return (
          <button
            key={i}
            onClick={() => onNavigate(item.key)}
            className="bounce-click"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: `${S.x4}px 0`,
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill={item.label === "Inicio" || item.label === "Popular" ? color : "none"}
              stroke={color}
              strokeWidth={item.label === "Inicio" || item.label === "Popular" ? "0" : "1.8"}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {item.svg}
            </svg>
            <span style={{ fontSize: "11px", fontWeight: W.reg, color, marginTop: S.x4 }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

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
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {particles.map((p) => (
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
            opacity: 0.1,
          }}
        />
      ))}
    </div>
  );
}

/* ============================================
   MAIN
   ============================================ */
export default function Home() {
  const router = useRouter();
  const [hasEntered, setHasEntered] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>("inicio");
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
  const [detailApp, setDetailApp] = useState<any | null>(null);

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
  }, [selectedCategory, searchTerm, viewMode]);

  const toggleTheme = (newTheme: string) => {
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const toggleFavorite = (appName: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newFavs = favorites.includes(appName)
      ? favorites.filter((f) => f !== appName)
      : [...favorites, appName];
    setFavorites(newFavs);
    localStorage.setItem("favorites", JSON.stringify(newFavs));
  };

  const setRating = (appName: string, value: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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

  const handleCategorySelect = (name: string) => {
    const idx = categorias.indexOf(name);
    if (idx !== -1) {
      setSelectedCategory(idx);
      setViewMode("inicio");
      setTimeout(() => {
        const section = document.getElementById("apps-list");
        if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    }
  };

  const handleTabChange = (tab: ViewMode) => {
    setViewMode(tab);
    setSelectedCategory(0);
    setSearchTerm("");
    setTimeout(() => {
      const section = document.getElementById("apps-list");
      if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const filteredApps = apps.filter((app) => {
    let matchesView = true;

    if (viewMode === "juegos") {
      matchesView = app.category === "Juegos";
    } else if (viewMode === "apps") {
      matchesView = app.category !== "Juegos" && app.category !== "+18";
    } else if (viewMode === "popular") {
      matchesView = app.isTop === true;
    } else {
      matchesView =
        selectedCategory === 0 || app.category === categorias[selectedCategory];
    }

    const matchesSearch =
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesView && matchesSearch;
  });

  const topApps = apps.filter((a) => a.isTop);

  const newApps = RECENT_SLUGS
    .map((slug) => apps.find((a) => a.slug === slug))
    .filter((a): a is NonNullable<typeof a> => Boolean(a))
    .slice(0, 9);

  const appCounts: Record<string, number> = {};
  apps.forEach((a) => {
    appCounts[a.category] = (appCounts[a.category] || 0) + 1;
  });

  const totalPages = Math.ceil(filteredApps.length / APPS_POR_PAGINA);
  const startIndex = (currentPage - 1) * APPS_POR_PAGINA;
  const paginatedApps = filteredApps.slice(startIndex, startIndex + APPS_POR_PAGINA);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 600, behavior: "smooth" });
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1, 2, 3);
      if (currentPage > 5) pages.push("...");
      if (currentPage > 4 && currentPage < totalPages - 2) pages.push(currentPage);
      if (currentPage < totalPages - 3) pages.push("...");
      pages.push(totalPages - 1, totalPages);
    }
    return pages;
  };

  const currentCategoryName = categorias[selectedCategory];

  const isSpecialCategory =
    selectedCategory > 0 &&
    (currentCategoryName === "ROMS" || currentCategoryName === "Add-ons Minecraft");

  const sectionTitle = (() => {
    if (viewMode === "juegos") return "Juegos";
    if (viewMode === "apps") return "Apps";
    if (viewMode === "popular") return "Popular";
    if (selectedCategory === 0) return "Todas las apps";
    return currentCategoryName;
  })();

  const sectionEmoji = (() => {
    if (viewMode === "juegos") return "🎮";
    if (viewMode === "apps") return "📱";
    if (viewMode === "popular") return "⭐";
    if (selectedCategory === 0) return "🎮";
    if (currentCategoryName === "Add-ons Minecraft") return "🧱";
    if (currentCategoryName === "ROMS") return "🕹️";
    return "📂";
  })();

  /* ---- theme colors (Figma discipline: 1 accent max) ---- */
  const c = {
    bg:
      theme === "light"
        ? "#ffffff"
        : theme === "cyberpunk"
        ? "#08001a"
        : theme === "sunset"
        ? "#150808"
        : theme === "ice"
        ? "#080d18"
        : "#0a0a0f",
    text:
      theme === "light"
        ? "#000000"
        : theme === "cyberpunk"
        ? "#e0d4ff"
        : theme === "sunset"
        ? "#ffe4c4"
        : theme === "ice"
        ? "#e2e8f0"
        : "#ffffff",
    muted:
      theme === "light"
        ? "#595959"
        : theme === "cyberpunk"
        ? "#a78bfa"
        : theme === "sunset"
        ? "#fdba74"
        : theme === "ice"
        ? "#94a3b8"
        : "#8b8b9a",
    card: theme === "light" ? "#ffffff" : "rgba(255,255,255,0.025)",
    cardSoft: theme === "light" ? "#f7f7f8" : "rgba(255,255,255,0.04)",
    border: theme === "light" ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)",
    accent:
      theme === "cyberpunk"
        ? "#22d3ee"
        : theme === "sunset"
        ? "#f472b6"
        : theme === "ice"
        ? "#38bdf8"
        : "#facc15",
  };

  /* ---- ENTRY GATE ---- */
  if (!hasEntered) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "radial-gradient(ellipse at top, #1a1a2e 0%, #0a0a0f 50%)",
          color: "#fff",
          fontFamily: "Inter, system-ui, sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: S.x20,
          textAlign: "center",
        }}
      >
        <div
          className="slide-up"
          style={{
            maxWidth: 400,
            padding: S.x40,
            borderRadius: R.lg,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 24px 70px rgba(0,0,0,0.4)",
          }}
        >
          <div style={{ fontSize: "60px", marginBottom: S.x20 }}>🛡️</div>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: W.semi,
              marginBottom: S.x16,
              letterSpacing: "-0.5px",
              lineHeight: 1.15,
            }}
          >
            PERSONS-COMUNITY
          </h1>
          <p style={{ color: "#8b8b9a", fontSize: "16px", lineHeight: 1.5, marginBottom: S.x32 }}>
            Entrarás a la zona de descargas. Son{" "}
            <b style={{ color: "#facc15" }}>apps modificadas de terceros</b>: descárgalas bajo tu
            propia responsabilidad.
          </p>
          <button
            onClick={() => setHasEntered(true)}
            className="bounce-click"
            style={{
              width: "100%",
              padding: `${S.x16}px ${S.x24}px`,
              borderRadius: R.pill,
              background: "linear-gradient(135deg, #facc15, #f59e0b)",
              color: "#0a0a0f",
              fontWeight: W.semi,
              fontSize: "15px",
              border: "none",
              cursor: "pointer",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Entrar a la tienda
          </button>
        </div>
      </div>
    );
  }

  /* ---- MAIN ---- */
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: c.bg,
        color: c.text,
        fontFamily: "Inter, system-ui, sans-serif",
        position: "relative",
        overflow: "hidden",
        transition: "background-color 0.4s ease",
      }}
    >
      <FloatingParticles />

      <div
        style={{
          position: "absolute",
          top: "-200px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "800px",
          height: "800px",
          background: `radial-gradient(circle, ${c.accent}18 0%, transparent 60%)`,
          filter: "blur(80px)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      ></div>

      <div
        style={{
          width: "100%",
          maxWidth: 640,
          margin: "0 auto",
          position: "relative",
          zIndex: 10,
          padding: `${S.x20}px ${S.x16}px 120px`,
        }}
      >
        {/* ============ HEADER ============ */}
        <nav
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: S.x20,
            borderBottom: `1px solid ${c.border}`,
            marginBottom: S.x32,
          }}
        >
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: S.x12,
              textDecoration: "none",
              color: c.text,
            }}
          >
            <img
              src="https://i.postimg.cc/QdBk2k5q/13.jpg"
              alt="PERSONS-COMUNITY"
              style={{
                width: 40,
                height: 40,
                borderRadius: R.md,
                objectFit: "cover",
                border: `1px solid ${c.accent}`,
              }}
            />
            <div>
              <p
                style={{
                  fontSize: "16px",
                  fontWeight: W.semi,
                  letterSpacing: "0.5px",
                  margin: 0,
                  lineHeight: 1,
                  color: c.text,
                }}
              >
                PERSONS
              </p>
              <p
                style={{
                  fontSize: "10px",
                  color: c.muted,
                  margin: `${S.x4}px 0 0 0`,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                }}
              >
                community
              </p>
            </div>
          </Link>
          <select
            value={theme}
            onChange={(e) => toggleTheme(e.target.value)}
            style={{
              background: c.card,
              border: `1px solid ${c.border}`,
              borderRadius: R.md,
              padding: `${S.x8}px ${S.x12}px`,
              color: c.text,
              fontSize: "12px",
              cursor: "pointer",
              outline: "none",
            }}
          >
            <option value="dark">🌙</option>
            <option value="light">☀️</option>
            <option value="cyberpunk">🟣</option>
            <option value="sunset">🌅</option>
            <option value="ice">❄️</option>
          </select>
        </nav>

        {/* ============ HERO ============ */}
        <section style={{ marginBottom: S.x32 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: S.x8,
              padding: `${S.x8}px ${S.x12}px`,
              borderRadius: R.pill,
              background: `${c.accent}15`,
              border: `1px solid ${c.accent}30`,
              fontSize: "12px",
              color: c.accent,
              marginBottom: S.x16,
              fontWeight: W.reg,
            }}
          >
            <span
              style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }}
            ></span>
            {apps.length}+ apps disponibles
          </div>

          <h1
            style={{
              fontSize: "36px",
              fontWeight: W.med,
              lineHeight: 1.1,
              marginBottom: S.x16,
              letterSpacing: "-1px",
              color: c.text,
            }}
          >
            Lo mejor en
            <br />
            <span
              style={{
                background: `linear-gradient(90deg, ${c.accent}, #f59e0b)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Apps y Juegos Android
            </span>
          </h1>

          <p
            style={{
              color: c.muted,
              fontSize: "15px",
              lineHeight: 1.5,
              maxWidth: 460,
              marginBottom: S.x24,
            }}
          >
            Descubre las mejores aplicaciones y juegos para Android. Última versión, premium y sin
            anuncios.
          </p>

          {/* Redes sociales */}
          <div
            style={{
              display: "flex",
              gap: S.x8,
              marginBottom: S.x24,
              flexWrap: "wrap",
            }}
          >
            {[
              {
                img: "https://i.supaimg.com/edbe52e7-a9fc-4e09-b7ee-0dc65fe103d3/a65cde85-132a-4209-a867-68fe6054722f.jpg",
                href: "https://chat.whatsapp.com/LCGW1WtQbYACZKKeBPzsXI",
                name: "WhatsApp",
              },
              {
                img: "https://i.supaimg.com/edbe52e7-a9fc-4e09-b7ee-0dc65fe103d3/4724e75f-6363-4c1b-b929-627a6a582e4f.jpg",
                href: "https://t.me/personsapks",
                name: "Telegram",
              },
              {
                img: "https://i.supaimg.com/edbe52e7-a9fc-4e09-b7ee-0dc65fe103d3/38cb9e6a-b3d2-41dd-bde6-c249217ddf29.jpg",
                href: "https://www.instagram.com/persons.177",
                name: "Instagram",
              },
              {
                img: "https://i.supaimg.com/edbe52e7-a9fc-4e09-b7ee-0dc65fe103d3/daeecf20-0396-4b3e-a595-3852f29a0b95.jpg",
                href: "https://discord.gg/A2vWQKj9w",
                name: "Discord",
              },
            ].map((s, i) => (
              <a
                key={i}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="bounce-click"
                title={s.name}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: R.md,
                  background: c.card,
                  border: `1px solid ${c.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                  overflow: "hidden",
                }}
              >
                <img
                  src={s.img}
                  alt={s.name}
                  style={{ width: "60%", height: "60%", objectFit: "contain" }}
                />
              </a>
            ))}
          </div>
        </section>

        {/* ============ BUSCADOR ============ */}
        <div style={{ marginBottom: S.x24 }}>
          <input
            type="text"
            placeholder="Busca tu juego favorito..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: `${S.x16}px ${S.x20}px`,
              borderRadius: R.lg,
              backgroundColor: c.card,
              border: `1px solid ${c.border}`,
              color: c.text,
              fontSize: "15px",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* ============ NAV SECUNDARIA ============ */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: S.x8,
            marginBottom: S.x32,
          }}
        >
          {[
            { href: "/", emoji: "🏠", label: "Inicio" },
            { href: "/codigos", emoji: "🔑", label: "Códigos" },
            { href: "/escaner", emoji: "🔍", label: "Escáner" },
            { href: "/blog", emoji: "📚", label: "Blog" },
            { href: "/tutorial", emoji: "📖", label: "Tutorial" },
            { href: "/faq", emoji: "❓", label: "FAQ" },
          ].map((item, i) => (
            <Link
              key={i}
              href={item.href}
              className="bounce-click"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: S.x4,
                padding: `${S.x16}px ${S.x8}px`,
                borderRadius: R.lg,
                background: c.card,
                border: `1px solid ${c.border}`,
                textDecoration: "none",
                color: c.text,
                textAlign: "center",
              }}
            >
              <span style={{ fontSize: "22px" }}>{item.emoji}</span>
              <span style={{ fontSize: "11px", fontWeight: W.reg }}>{item.label}</span>
            </Link>
          ))}
        </div>

        {/* ============ BANNER CÓDIGOS ============ */}
        <Link
          href="/codigos"
          className="bounce-click"
          style={{ display: "block", textDecoration: "none", marginBottom: S.x32 }}
        >
          <div
            style={{
              padding: S.x24,
              borderRadius: R.lg,
              background: `${c.accent}10`,
              border: `1px solid ${c.accent}30`,
              display: "flex",
              alignItems: "center",
              gap: S.x16,
            }}
          >
            <div style={{ fontSize: "36px" }}>🔑</div>
            <div style={{ flex: 1 }}>
              <h2
                style={{
                  fontSize: "16px",
                  fontWeight: W.semi,
                  color: c.text,
                  margin: 0,
                  marginBottom: S.x4,
                }}
              >
                Códigos Premium Gratis
              </h2>
              <p style={{ fontSize: "12px", color: c.muted, margin: 0 }}>
                Netflix, Anime WF, Xuper Hydra y más.
              </p>
            </div>
            <span style={{ fontSize: "18px", color: c.accent }}>→</span>
          </div>
        </Link>

        {/* ============ TENDENCIA ============ */}
        {topApps.length > 0 && viewMode === "inicio" && (
          <section style={{ marginBottom: S.x40 }}>
            <h2
              style={{
                fontSize: "18px",
                fontWeight: W.semi,
                color: c.text,
                margin: 0,
                marginBottom: S.x16,
                letterSpacing: "-0.3px",
              }}
            >
              🔥 Tendencia hoy
            </h2>
            <div
              className="hide-scrollbar"
              style={{
                display: "flex",
                gap: S.x12,
                overflowX: "auto",
                paddingBottom: S.x4,
              }}
            >
              {topApps.map((app, i) => (
                <Link
                  key={i}
                  href={`/apps/${app.slug}`}
                  onClick={(e) => handleAppClick(e, app)}
                  className="bounce-click"
                  style={{
                    flex: "0 0 auto",
                    width: 140,
                    padding: S.x16,
                    borderRadius: R.lg,
                    background: c.card,
                    border: `1px solid ${c.border}`,
                    textDecoration: "none",
                    color: c.text,
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: S.x8,
                  }}
                >
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: R.md,
                      overflow: "hidden",
                      background: "rgba(0,0,0,0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: `1px solid ${c.border}`,
                    }}
                  >
                    {app.iconUrl && app.iconUrl !== "AQUI_VA_EL_LINK_DE_LA_IMAGEN" ? (
                      <img
                        src={app.iconUrl}
                        alt={app.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <span style={{ fontSize: "28px" }}>{app.emoji}</span>
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: W.reg,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      width: "100%",
                    }}
                  >
                    {app.name.replace(" Premium", "").replace(" VIP", "")}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ============ ÚLTIMAS ACTUALIZACIONES ============ */}
        {newApps.length > 0 && viewMode === "inicio" && selectedCategory === 0 && (
          <section style={{ marginBottom: S.x40 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: S.x16,
              }}
            >
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: W.semi,
                  color: c.text,
                  margin: 0,
                  letterSpacing: "-0.3px",
                }}
              >
                🆕 Últimas actualizaciones
              </h2>
              <span style={{ fontSize: "11px", color: c.muted, fontWeight: W.reg }}>
                {newApps.length} nuevas
              </span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: S.x8,
              }}
            >
              {newApps.map((app, i) => (
                <AppCardCompact
                  key={i}
                  slug={app.slug}
                  name={app.name.replace(" Premium", "").replace(" VIP", "")}
                  iconUrl={app.iconUrl}
                  emoji={app.emoji}
                  version={app.version}
                  developer={app.developer}
                  updated={app.updated}
                  rating={app.rating}
                  category={app.category}
                />
              ))}
            </div>
          </section>
        )}

        {/* ============ CATEGORÍAS ============ */}
        {viewMode === "inicio" && (
          <section style={{ marginBottom: S.x32 }}>
            <h2
              style={{
                fontSize: "18px",
                fontWeight: W.semi,
                color: c.text,
                margin: 0,
                marginBottom: S.x12,
                letterSpacing: "-0.3px",
              }}
            >
              📂 Categorías
            </h2>
            <CategoryGrid
              appCounts={appCounts}
              selected={selectedCategory > 0 ? categorias[selectedCategory] : ""}
              onSelect={handleCategorySelect}
            />
          </section>
        )}

        {/* ============ CONTENIDO ESPECIAL ============ */}
        {viewMode === "inicio" && selectedCategory === 0 && (
          <section style={{ marginBottom: S.x32 }}>
            <h2
              style={{
                fontSize: "18px",
                fontWeight: W.semi,
                color: c.text,
                margin: 0,
                marginBottom: S.x12,
                letterSpacing: "-0.3px",
              }}
            >
              ✨ Contenido Especial
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: S.x8,
              }}
            >
              <button
                onClick={() => handleCategorySelect("Add-ons Minecraft")}
                className="bounce-click"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: S.x4,
                  padding: S.x16,
                  borderRadius: R.lg,
                  background: c.card,
                  border: `1px solid rgba(34,197,94,0.3)`,
                  color: c.text,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  textAlign: "center",
                }}
              >
                <span style={{ fontSize: "32px", lineHeight: 1 }}>🧱</span>
                <span style={{ fontSize: "13px", fontWeight: W.semi, lineHeight: 1.2 }}>
                  Add-ons Minecraft
                </span>
                <span style={{ fontSize: "10px", color: c.muted }}>
                  {appCounts["Add-ons Minecraft"] ?? 0} items
                </span>
              </button>

              <button
                onClick={() => handleCategorySelect("ROMS")}
                className="bounce-click"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: S.x4,
                  padding: S.x16,
                  borderRadius: R.lg,
                  background: c.card,
                  border: `1px solid rgba(239,68,68,0.3)`,
                  color: c.text,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  textAlign: "center",
                }}
              >
                <span style={{ fontSize: "32px", lineHeight: 1 }}>🎮</span>
                <span style={{ fontSize: "13px", fontWeight: W.semi, lineHeight: 1.2 }}>
                  ROMs Retro
                </span>
                <span style={{ fontSize: "10px", color: c.muted }}>
                  {appCounts["ROMS"] ?? 0} juegos
                </span>
              </button>
            </div>
          </section>
        )}

        {/* ============ LISTA ============ */}
        <section id="apps-list" style={{ marginBottom: S.x24, scrollMarginTop: S.x20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: S.x8,
              marginBottom: S.x20,
            }}
          >
            <h2
              style={{
                fontSize: "18px",
                fontWeight: W.semi,
                color: c.text,
                margin: 0,
                letterSpacing: "-0.3px",
                flex: 1,
              }}
            >
              {sectionTitle}
              <span
                style={{
                  fontSize: "12px",
                  color: c.muted,
                  fontWeight: W.light,
                  marginLeft: S.x8,
                }}
              >
                ({filteredApps.length})
              </span>
            </h2>
            {(selectedCategory !== 0 || viewMode !== "inicio") && (
              <button
                onClick={() => {
                  setSelectedCategory(0);
                  setViewMode("inicio");
                }}
                className="bounce-click"
                style={{
                  padding: `${S.x4}px ${S.x12}px`,
                  borderRadius: R.pill,
                  background: c.card,
                  border: `1px solid ${c.border}`,
                  color: c.muted,
                  fontSize: "11px",
                  fontWeight: W.reg,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                ✕ Limpiar
              </button>
            )}
          </div>

          {loading ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: S.x12,
              }}
            >
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="skeleton-shimmer"
                  style={{ height: 220, borderRadius: R.lg }}
                />
              ))}
            </div>
          ) : filteredApps.length > 0 ? (
            <>
              {isSpecialCategory ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(1, 1fr)",
                    gap: S.x12,
                    marginBottom: S.x24,
                  }}
                >
                  {paginatedApps.map((app, index) => (
                    <RomAddonCard
                      key={index}
                      slug={app.slug}
                      name={app.name}
                      iconUrl={app.iconUrl}
                      emoji={app.emoji}
                      description={app.description}
                      category={app.category}
                      isNew={app.isNew}
                      isTop={app.isTop}
                      glow={app.glow}
                      border={app.border}
                      text={app.text}
                      onOpenDetail={() => setDetailApp(app)}
                    />
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: S.x12,
                    marginBottom: S.x24,
                  }}
                >
                  {paginatedApps.map((app, index) => (
                    <Link
                      key={index}
                      href={`/apps/${app.slug}`}
                      className="bounce-click"
                      onClick={(e) => handleAppClick(e, app)}
                      style={{
                        padding: S.x12,
                        borderRadius: R.lg,
                        background: c.card,
                        border: `1px solid ${c.border}`,
                        textDecoration: "none",
                        color: c.text,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: S.x8,
                        textAlign: "center",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      {app.isTop && (
                        <span
                          style={{
                            position: "absolute",
                            top: S.x8,
                            right: S.x8,
                            background: `${c.accent}20`,
                            color: c.accent,
                            padding: `2px ${S.x8}px`,
                            borderRadius: R.md,
                            fontSize: "8px",
                            fontWeight: W.semi,
                          }}
                        >
                          TOP
                        </span>
                      )}

                      <button
                        onClick={(e) => toggleFavorite(app.name, e)}
                        style={{
                          position: "absolute",
                          top: S.x8,
                          left: S.x8,
                          background: "none",
                          border: "none",
                          fontSize: "14px",
                          cursor: "pointer",
                          color: favorites.includes(app.name) ? c.accent : c.muted,
                          padding: 0,
                          lineHeight: 1,
                        }}
                      >
                        {favorites.includes(app.name) ? "★" : "☆"}
                      </button>

                      <div
                        style={{
                          width: 64,
                          height: 64,
                          borderRadius: R.md,
                          overflow: "hidden",
                          background: "rgba(0,0,0,0.3)",
                          border: `1px solid ${c.border}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginTop: S.x12,
                        }}
                      >
                        {app.iconUrl && app.iconUrl !== "AQUI_VA_EL_LINK_DE_LA_IMAGEN" ? (
                          <img
                            src={app.iconUrl}
                            alt={`Descargar ${app.name}`}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                              e.currentTarget.parentElement!.innerHTML = `<span style="font-size: 28px;">${app.emoji}</span>`;
                            }}
                          />
                        ) : (
                          <span style={{ fontSize: "28px" }}>{app.emoji}</span>
                        )}
                      </div>

                      <h3
                        style={{
                          fontSize: "12px",
                          fontWeight: W.semi,
                          margin: 0,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          width: "100%",
                          lineHeight: 1.3,
                        }}
                      >
                        {app.name.replace(" Premium", "").replace(" VIP", "")}
                      </h3>

                      <p style={{ fontSize: "10px", color: c.muted, margin: 0, fontWeight: W.light }}>
                        {app.version}
                      </p>

                      <div
                        style={{
                          display: "flex",
                          gap: "1px",
                          fontSize: "10px",
                          marginTop: S.x4,
                        }}
                      >
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            onClick={(e) => setRating(app.name, star, e)}
                            style={{
                              cursor: "pointer",
                              color: (ratings[app.name] || 0) >= star ? c.accent : c.muted,
                            }}
                          >
                            ★
                          </span>
                        ))}
                      </div>

                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "100%",
                          padding: `${S.x8}px`,
                          borderRadius: R.md,
                          fontWeight: W.semi,
                          fontSize: "10px",
                          background: `${c.accent}15`,
                          border: `1px solid ${c.accent}30`,
                          color: c.accent,
                          marginTop: S.x4,
                          letterSpacing: "0.3px",
                          textTransform: "uppercase",
                        }}
                      >
                        Descargar
                      </span>
                    </Link>
                  ))}
                </div>
              )}

              {/* Paginación */}
              {totalPages > 1 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: S.x4,
                    flexWrap: "wrap",
                    marginTop: S.x24,
                  }}
                >
                  {getPageNumbers().map((page, i) =>
                    typeof page === "number" ? (
                      <button
                        key={i}
                        onClick={() => goToPage(page)}
                        className="bounce-click"
                        style={{
                          minWidth: 36,
                          height: 36,
                          borderRadius: R.md,
                          cursor: "pointer",
                          fontSize: "13px",
                          fontWeight: W.reg,
                          background: currentPage === page ? c.accent : c.card,
                          color: currentPage === page ? c.bg : c.muted,
                          border: currentPage === page ? "none" : `1px solid ${c.border}`,
                          fontFamily: "inherit",
                        }}
                      >
                        {page}
                      </button>
                    ) : (
                      <span key={i} style={{ color: c.muted, fontSize: "12px", padding: `0 ${S.x4}px` }}>
                        ...
                      </span>
                    )
                  )}
                </div>
              )}
            </>
          ) : (
            <div
              style={{
                padding: S.x48,
                textAlign: "center",
                borderRadius: R.lg,
                background: c.card,
                border: `1px dashed ${c.border}`,
              }}
            >
              <div style={{ fontSize: "40px", marginBottom: S.x12 }}>😿</div>
              <p style={{ color: c.muted, fontSize: "13px", margin: 0 }}>
                No se encontraron apps
              </p>
            </div>
          )}
        </section>

        {/* ============ FOOTER ============ */}
        <footer
          style={{
            borderTop: `1px solid ${c.border}`,
            paddingTop: S.x24,
            paddingBottom: S.x32,
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: S.x16,
              justifyContent: "center",
              flexWrap: "wrap",
              marginBottom: S.x16,
            }}
          >
            {[
              { href: "/privacidad", label: "Privacidad" },
              { href: "/terminos", label: "Términos" },
              { href: "/faq", label: "FAQ" },
              { href: "/tutorial", label: "Tutorial" },
              { href: "/blog", label: "Blog" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  color: c.muted,
                  fontSize: "11px",
                  textDecoration: "none",
                  fontWeight: W.light,
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <p
            style={{
              color: c.muted,
              fontSize: "10px",
              fontFamily: "monospace",
              marginBottom: S.x4,
            }}
          >
            © 2026 PERSONS-COMUNITY
          </p>
          <p style={{ color: c.muted, fontSize: "10px", margin: 0, opacity: 0.7 }}>
            Hecho con 💛 desde Termux
          </p>
        </footer>
      </div>

      <AdModal isOpen={showAd} onClose={() => setShowAd(false)} appName={pendingAppName} />

      {/* ============ MODAL +18 ============ */}
      {show18Modal && (
        <div
          onClick={close18}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: S.x20,
            backdropFilter: "blur(10px)",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="slide-up"
            style={{
              maxWidth: 380,
              width: "100%",
              padding: S.x32,
              borderRadius: R.lg,
              background: "#12121a",
              border: "1px solid rgba(220, 38, 38, 0.4)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: S.x16 }}>🔞</div>
            <h2
              style={{
                fontSize: "18px",
                fontWeight: W.semi,
                color: "#fff",
                marginBottom: S.x12,
              }}
            >
              Contenido +18
            </h2>
            <p
              style={{
                color: "#8b8b9a",
                fontSize: "13px",
                lineHeight: 1.5,
                marginBottom: S.x24,
              }}
            >
              Este contenido es solo para <b style={{ color: "#fca5a5" }}>mayores de 18 años</b>.
            </p>
            <button
              onClick={confirm18}
              className="bounce-click"
              style={{
                width: "100%",
                padding: S.x16,
                borderRadius: R.pill,
                background: "linear-gradient(135deg, #22c55e, #16a34a)",
                color: "#fff",
                fontWeight: W.semi,
                fontSize: "13px",
                border: "none",
                cursor: "pointer",
                marginBottom: S.x8,
              }}
            >
              Confirmar
            </button>
            <button
              onClick={close18}
              style={{
                width: "100%",
                padding: S.x12,
                borderRadius: R.md,
                background: "transparent",
                color: "#8b8b9a",
                border: "1px solid rgba(255,255,255,0.1)",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: W.light,
                fontFamily: "inherit",
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* ============ MODAL ROM/ADDON ============ */}
      {detailApp && (
        <div
          onClick={() => setDetailApp(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: S.x20,
            backdropFilter: "blur(10px)",
            overflowY: "auto",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="slide-up"
            style={{
              maxWidth: 440,
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: S.x24,
              borderRadius: R.lg,
              background: "#12121a",
              border: "1px solid rgba(255,255,255,0.1)",
              margin: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: S.x12,
                alignItems: "flex-start",
                marginBottom: S.x20,
              }}
            >
              <div
                style={{
                  width: 80,
                  height: 80,
                  minWidth: 80,
                  borderRadius: R.md,
                  overflow: "hidden",
                  background: "rgba(0,0,0,0.4)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {detailApp.iconUrl && detailApp.iconUrl.startsWith("http") ? (
                  <img
                    src={detailApp.iconUrl}
                    alt={detailApp.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <span style={{ fontSize: "36px" }}>{detailApp.emoji}</span>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <h2
                  style={{
                    fontSize: "18px",
                    fontWeight: W.semi,
                    color: "#ffffff",
                    margin: 0,
                    marginBottom: S.x4,
                    lineHeight: 1.2,
                  }}
                >
                  {detailApp.name}
                </h2>
                <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>
                  v{detailApp.version} · {detailApp.size}
                </p>
              </div>
            </div>

            <p
              style={{
                fontSize: "13px",
                color: "#d1d5db",
                lineHeight: 1.6,
                margin: 0,
                marginBottom: S.x20,
              }}
            >
              {detailApp.longDescription}
            </p>

            {detailApp.romInfo && (
              <div
                style={{
                  padding: S.x16,
                  borderRadius: R.md,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  marginBottom: S.x20,
                }}
              >
                <h3
                  style={{
                    fontSize: "11px",
                    fontWeight: W.semi,
                    color: "#ffffff",
                    margin: 0,
                    marginBottom: S.x12,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  📋 Info de la ROM
                </h3>
                {detailApp.romInfo.console && (
                  <p style={{ fontSize: "12px", color: "#9ca3af", margin: `0 0 ${S.x8}px 0` }}>
                    <b style={{ color: "#ffffff" }}>Consola:</b> {detailApp.romInfo.console}
                  </p>
                )}
                {detailApp.romInfo.emulator && (
                  <p style={{ fontSize: "12px", color: "#9ca3af", margin: `0 0 ${S.x8}px 0` }}>
                    <b style={{ color: "#ffffff" }}>Emulador:</b> {detailApp.romInfo.emulator}
                  </p>
                )}
                {detailApp.romInfo.format && (
                  <p style={{ fontSize: "12px", color: "#9ca3af", margin: `0 0 ${S.x8}px 0` }}>
                    <b style={{ color: "#ffffff" }}>Formato:</b> {detailApp.romInfo.format}
                  </p>
                )}
                {detailApp.romInfo.instructions && (
                  <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0, lineHeight: 1.5 }}>
                    <b style={{ color: "#ffffff" }}>Instrucciones:</b> {detailApp.romInfo.instructions}
                  </p>
                )}
              </div>
            )}

            <a
              href={detailApp.link}
              target="_blank"
              rel="noopener noreferrer"
              className="bounce-click"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                padding: S.x16,
                borderRadius: R.pill,
                background: "linear-gradient(135deg, #facc15, #f59e0b)",
                color: "#0a0a0f",
                fontWeight: W.semi,
                fontSize: "13px",
                textDecoration: "none",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: S.x8,
              }}
            >
              ⬇ Descargar
            </a>

            <button
              onClick={() => setDetailApp(null)}
              style={{
                width: "100%",
                padding: S.x12,
                borderRadius: R.md,
                background: "transparent",
                color: "#8b8b9a",
                border: "1px solid rgba(255,255,255,0.1)",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: W.light,
                fontFamily: "inherit",
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* ============ COOKIES ============ */}
      {showCookies && (
        <div
          style={{
            position: "fixed",
            bottom: 80,
            left: S.x12,
            right: S.x12,
            maxWidth: 480,
            margin: "0 auto",
            background: "rgba(10,10,15,0.98)",
            border: `1px solid ${c.border}`,
            borderRadius: R.lg,
            padding: S.x20,
            zIndex: 200,
            backdropFilter: "blur(15px)",
          }}
        >
          <p
            style={{
              color: c.muted,
              fontSize: "12px",
              lineHeight: 1.5,
              margin: 0,
              marginBottom: S.x12,
            }}
          >
            🍪 Usamos cookies para mejorar tu experiencia.
          </p>
          <div style={{ display: "flex", gap: S.x8 }}>
            <button
              onClick={() => {
                setShowCookies(false);
                localStorage.setItem("cookiesAccepted", "yes");
              }}
              className="bounce-click"
              style={{
                flex: 1,
                padding: S.x12,
                borderRadius: R.pill,
                background: "linear-gradient(135deg, #facc15, #f59e0b)",
                color: "#0a0a0f",
                fontWeight: W.semi,
                border: "none",
                cursor: "pointer",
                fontSize: "12px",
                fontFamily: "inherit",
              }}
            >
              Aceptar
            </button>
            <button
              onClick={() => {
                setShowCookies(false);
                localStorage.setItem("cookiesAccepted", "no");
              }}
              className="bounce-click"
              style={{
                flex: 1,
                padding: S.x12,
                borderRadius: R.pill,
                background: "transparent",
                color: c.muted,
                border: `1px solid ${c.border}`,
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: W.light,
                fontFamily: "inherit",
              }}
            >
              Rechazar
            </button>
          </div>
        </div>
      )}

      <BottomNav theme={theme} current={viewMode} onNavigate={handleTabChange} />
    </div>
  );
}
