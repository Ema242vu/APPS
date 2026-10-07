"use client";

const CATEGORIES = [
  { name: "Video", emoji: "🎬", color: "#f472b6" },
  { name: "Música", emoji: "🎵", color: "#a78bfa" },
  { name: "Social", emoji: "💬", color: "#60a5fa" },
  { name: "Herramientas", emoji: "🔧", color: "#34d399" },
  { name: "Educación", emoji: "📚", color: "#fbbf24" },
  { name: "Juegos", emoji: "🎮", color: "#f97316" },
  { name: "+18", emoji: "🔞", color: "#ef4444" },
];

type CategoryGridProps = {
  appCounts?: Record<string, number>;
  selected?: string;
  onSelect?: (name: string) => void;
};

export default function CategoryGrid({
  appCounts = {},
  selected = "",
  onSelect,
}: CategoryGridProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "8px",
        marginTop: "15px",
      }}
    >
      {CATEGORIES.map((cat) => {
        const count = appCounts[cat.name] ?? 0;
        const isActive = selected === cat.name;
        return (
          <button
            key={cat.name}
            onClick={() => onSelect?.(cat.name)}
            className="bounce-click"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
              padding: "12px 4px",
              borderRadius: "16px",
              background: isActive
                ? `linear-gradient(135deg, ${cat.color}33, ${cat.color}11)`
                : "rgba(255,255,255,0.03)",
              border: isActive
                ? `1.5px solid ${cat.color}`
                : "1px solid rgba(255,255,255,0.06)",
              color: isActive ? "#ffffff" : "#d1d5db",
              cursor: "pointer",
              transition: "all 0.25s ease",
              boxShadow: isActive ? `0 8px 22px ${cat.color}44` : "none",
              minHeight: "82px",
              fontFamily: "inherit",
            }}
          >
            <span style={{ fontSize: "26px", lineHeight: 1 }}>{cat.emoji}</span>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 700,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "100%",
                color: isActive ? "#ffffff" : "#e5e7eb",
              }}
            >
              {cat.name}
            </span>
            <span
              style={{
                fontSize: "9px",
                color: isActive ? cat.color : "#9ca3af",
                fontWeight: 600,
              }}
            >
              {count} {count === 1 ? "app" : "apps"}
            </span>
          </button>
        );
      })}
    </div>
  );
}
