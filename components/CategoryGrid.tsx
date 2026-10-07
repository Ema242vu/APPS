"use client";

import Link from "next/link";

const CATEGORIES = [
  { name: "Video", emoji: "🎬", color: "#f472b6", glow: "rgba(244, 114, 182, 0.35)" },
  { name: "Música", emoji: "🎵", color: "#a78bfa", glow: "rgba(167, 139, 250, 0.35)" },
  { name: "Social", emoji: "💬", color: "#60a5fa", glow: "rgba(96, 165, 250, 0.35)" },
  { name: "Herramientas", emoji: "🔧", color: "#34d399", glow: "rgba(52, 211, 153, 0.35)" },
  { name: "Educación", emoji: "📚", color: "#fbbf24", glow: "rgba(251, 191, 36, 0.35)" },
  { name: "Juegos", emoji: "🎮", color: "#f97316", glow: "rgba(249, 115, 22, 0.35)" },
  { name: "+18", emoji: "🔞", color: "#ef4444", glow: "rgba(239, 68, 68, 0.35)" },
];

type CategoryGridProps = {
  appCounts?: Record<string, number>;
};

export default function CategoryGrid({ appCounts = {} }: CategoryGridProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
        gap: "12px",
        marginTop: "20px",
      }}
    >
      {CATEGORIES.map((cat) => {
        const count = appCounts[cat.name] ?? 0;
        const slug = cat.name.toLowerCase().replace("+", "").replace("ú", "u").replace("í", "i");
        return (
          <Link
            key={cat.name}
            href={`/categoria/${slug}`}
            style={{
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "14px 16px",
              borderRadius: "18px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "rgba(255,255,255,0.08)";
              el.style.transform = "translateY(-3px)";
              el.style.boxShadow = `0 10px 25px ${cat.glow}`;
              el.style.borderColor = cat.color + "66";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "rgba(255,255,255,0.04)";
              el.style.transform = "translateY(0)";
              el.style.boxShadow = "none";
              el.style.borderColor = "rgba(255,255,255,0.07)";
            }}
          >
            <div
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                background: cat.glow,
                border: `1px solid ${cat.color}55`,
                flexShrink: 0,
              }}
            >
              {cat.emoji}
            </div>

            <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "var(--text-primary, #ffffff)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {cat.name}
              </span>
              <span
                style={{
                  fontSize: "11px",
                  color: "var(--text-muted, #9ca3af)",
                  marginTop: "2px",
                }}
              >
                {count} {count === 1 ? "app" : "apps"}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
