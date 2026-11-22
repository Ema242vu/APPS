"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { App } from "@/lib/apps";
import { categorias, recentOrder } from "@/lib/apps";

export default function VipCatalog({ apps }: { apps: App[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todas");
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const orderedApps = useMemo(() => {
    const order = new Map(recentOrder.map((slug, index) => [slug, index]));
    return [...apps].sort((a, b) => {
      const aIndex = order.get(a.slug);
      const bIndex = order.get(b.slug);
      if (aIndex !== undefined && bIndex !== undefined) return aIndex - bIndex;
      if (aIndex !== undefined) return -1;
      if (bIndex !== undefined) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [apps]);

  const visibleCategories = useMemo(
    () =>
      categorias.filter(
        (cat) => cat === "Todas" || orderedApps.some((app) => app.category === cat)
      ),
    [orderedApps]
  );

  const filteredApps = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orderedApps.filter((app) => {
      const matchesCategory = category === "Todas" || app.category === category;
      const matchesQuery =
        !q ||
        `${app.name} ${app.description} ${app.category}`.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [orderedApps, category, query]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/vip", { method: "DELETE" });
      window.location.reload();
    } catch {
      setLoggingOut(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-primary)",
      }}
    >
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          backgroundColor: "var(--bg-primary)",
          borderBottom: "1px solid var(--border-color)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
        }}
      >
        <div
          style={{
            maxWidth: "1180px",
            margin: "0 auto",
            padding: "14px 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "10px",
          }}
        >
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              textDecoration: "none",
              color: "var(--text-primary)",
              minWidth: 0,
            }}
          >
            <span style={{ fontSize: "22px" }}>🐱</span>
            <span
              style={{
                fontSize: "13px",
                fontWeight: 800,
                letterSpacing: "-0.2px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              PERSONS<span style={{ color: "#facc15" }}>-COMUNITY</span>
            </span>
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
            <span
              style={{
                backgroundColor: "rgba(250,204,21,0.12)",
                border: "1px solid rgba(250,204,21,0.3)",
                color: "#facc15",
                fontSize: "9px",
                fontWeight: 800,
                padding: "4px 8px",
                borderRadius: "999px",
                letterSpacing: "0.5px",
                whiteSpace: "nowrap",
              }}
            >
              ZONA VIP
            </span>
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              style={{
                border: "1px solid var(--border-color)",
                backgroundColor: "transparent",
                color: "var(--text-muted)",
                padding: "7px 10px",
                borderRadius: "9px",
                fontSize: "10px",
                fontWeight: 700,
                cursor: loggingOut ? "wait" : "pointer",
              }}
            >
              {loggingOut ? "Saliendo..." : "Salir"}
            </button>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: "1180px", margin: "0 auto", padding: "28px 18px 80px" }}>
        <section
          style={{
            position: "relative",
            overflow: "hidden",
            background:
              "linear-gradient(135deg, rgba(250,204,21,0.10), rgba(168,85,247,0.08))",
            border: "1px solid var(--border-color)",
            borderRadius: "24px",
            padding: "28px",
            marginBottom: "26px",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: "280px",
              height: "280px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(250,204,21,0.18), transparent 65%)",
              top: "-120px",
              right: "-80px",
              pointerEvents: "none",
            }}
          />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                backgroundColor: "rgba(34,197,94,0.12)",
                border: "1px solid rgba(34,197,94,0.3)",
                color: "#4ade80",
                padding: "5px 12px",
                borderRadius: "999px",
                fontSize: "10px",
                fontWeight: 800,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                marginBottom: "14px",
              }}
            >
              ⚡ Acceso VIP activo
            </div>
            <h1
              style={{
                fontSize: "clamp(26px, 5vw, 40px)",
                fontWeight: 900,
                letterSpacing: "-1px",
                lineHeight: 1.1,
                margin: "0 0 10px",
              }}
            >
              Descargas <span style={{ color: "#facc15" }}>directas</span> para VIP
            </h1>
            <p
              style={{
                fontSize: "14px",
                color: "var(--text-muted)",
                margin: 0,
                lineHeight: 1.6,
                maxWidth: "620px",
              }}
            >
              Todo el catálogo sin pasar por los 5 pasos de verificación. Elige tu app, toca
              “Descargar” y el enlace se abre directamente.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "18px" }}>
              {[
                `${apps.length} apps disponibles`,
                "🔗 Enlaces directos",
                "🚫 Sin verificaciones",
              ].map((item) => (
                <span
                  key={item}
                  style={{
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "999px",
                    padding: "6px 12px",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--text-muted)",
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <div style={{ position: "relative", marginBottom: "14px" }}>
          <span
            style={{
              position: "absolute",
              left: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "15px",
              opacity: 0.6,
              pointerEvents: "none",
            }}
          >
            🔍
          </span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar app, juego o categoría..."
            style={{
              width: "100%",
              padding: "14px 16px 14px 42px",
              borderRadius: "14px",
              border: "1px solid var(--border-color)",
              backgroundColor: "var(--bg-secondary)",
              color: "var(--text-primary)",
              fontSize: "14px",
              outline: "none",
            }}
          />
        </div>

        <div
          className="hide-scrollbar"
          style={{
            display: "flex",
            gap: "8px",
            overflowX: "auto",
            paddingBottom: "4px",
            marginBottom: "22px",
          }}
        >
          {visibleCategories.map((cat) => {
            const active = category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                style={{
                  flexShrink: 0,
                  padding: "8px 14px",
                  borderRadius: "999px",
                  border: active ? "1px solid #facc15" : "1px solid var(--border-color)",
                  backgroundColor: active ? "#facc15" : "var(--bg-secondary)",
                  color: active ? "#0a0a0f" : "var(--text-muted)",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: "10px",
            marginBottom: "14px",
          }}
        >
          <h2 style={{ fontSize: "18px", fontWeight: 800, margin: 0 }}>
            {category === "Todas" ? "Todo el catálogo" : category}
          </h2>
          <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600 }}>
            {filteredApps.length} resultados
          </span>
        </div>

        {filteredApps.length === 0 ? (
          <div
            style={{
              padding: "40px 20px",
              textAlign: "center",
              border: "1px dashed var(--border-color)",
              borderRadius: "18px",
              backgroundColor: "var(--bg-card)",
            }}
          >
            <p style={{ fontSize: "28px", margin: "0 0 8px" }}>🔎</p>
            <p style={{ fontSize: "14px", fontWeight: 700, margin: 0 }}>
              No encontramos esa app
            </p>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "4px 0 0" }}>
              Prueba con otro nombre o cambia de categoría.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
              gap: "14px",
            }}
          >
            {filteredApps.map((app) => {
              const directUrl = app.directLink?.url || app.link;
              return (
                <article
                  key={app.slug}
                  style={{
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "18px",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      aspectRatio: "1 / 1",
                      backgroundColor: "rgba(255,255,255,0.04)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                    }}
                  >
                    <span style={{ fontSize: "42px" }}>{app.emoji}</span>
                    {app.iconUrl && app.iconUrl.startsWith("http") && (
                      <img
                        src={app.iconUrl}
                        alt={app.name}
                        loading="lazy"
                        style={{
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    )}
                    <span
                      style={{
                        position: "absolute",
                        top: "8px",
                        left: "8px",
                        backgroundColor: "rgba(10,10,15,0.78)",
                        color: "#facc15",
                        border: "1px solid rgba(250,204,21,0.3)",
                        borderRadius: "999px",
                        padding: "3px 8px",
                        fontSize: "9px",
                        fontWeight: 800,
                        letterSpacing: "0.4px",
                        textTransform: "uppercase",
                        backdropFilter: "blur(6px)",
                      }}
                    >
                      {app.category}
                    </span>
                    <span
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        backgroundColor: "rgba(34,197,94,0.92)",
                        color: "#052e16",
                        borderRadius: "999px",
                        padding: "3px 8px",
                        fontSize: "9px",
                        fontWeight: 900,
                        letterSpacing: "0.4px",
                        textTransform: "uppercase",
                      }}
                    >
                      Directo
                    </span>
                  </div>

                  <div
                    style={{
                      padding: "12px",
                      display: "flex",
                      flexDirection: "column",
                      flex: 1,
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "13px",
                        fontWeight: 800,
                        margin: 0,
                        lineHeight: 1.35,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {app.name}
                    </h3>
                    <p
                      style={{
                        fontSize: "11px",
                        color: "var(--text-muted)",
                        margin: "5px 0 10px",
                      }}
                    >
                      {app.version} · {app.size}
                    </p>
                    <a
                      href={directUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bounce-click"
                      style={{
                        marginTop: "auto",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: "10px",
                        background: "linear-gradient(135deg, #22c55e, #16a34a)",
                        color: "#ffffff",
                        fontSize: "11px",
                        fontWeight: 800,
                        letterSpacing: "0.5px",
                        textTransform: "uppercase",
                        textDecoration: "none",
                        boxShadow: "0 6px 18px rgba(34,197,94,0.22)",
                      }}
                    >
                      ⬇ Descargar
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div
          style={{
            marginTop: "32px",
            padding: "18px",
            borderRadius: "16px",
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <p style={{ fontSize: "13px", fontWeight: 700, margin: 0 }}>
              🔗 Enlaces directos, sin verificaciones
            </p>
            <p
              style={{
                fontSize: "11px",
                color: "var(--text-muted)",
                margin: "4px 0 0",
                lineHeight: 1.5,
              }}
            >
              Si un enlace falla, avísanos por WhatsApp.
            </p>
          </div>
          <a
            href="https://whatsapp.com/channel/0029Vb8X5TvKLaHqSbsYcP0j"
            target="_blank"
            rel="noopener noreferrer"
            className="bounce-click"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "9px 14px",
              borderRadius: "10px",
              backgroundColor: "#25D366",
              color: "#052e16",
              fontSize: "11px",
              fontWeight: 800,
              textDecoration: "none",
            }}
          >
            💬 WhatsApp
          </a>
        </div>

        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <Link
            href="/"
            style={{
              fontSize: "12px",
              color: "var(--text-muted)",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            ← Volver a la tienda
          </Link>
        </div>
      </div>
    </main>
  );
}
