"use client";

type RomAddonCardProps = {
  slug: string;
  name: string;
  iconUrl: string;
  emoji: string;
  description: string;
  category: string;
  isNew?: boolean;
  isTop?: boolean;
  glow?: string;
  border?: string;
  text?: string;
  onOpenDetail: () => void;
};

export default function RomAddonCard({
  slug,
  name,
  iconUrl,
  emoji,
  description,
  category,
  isNew,
  isTop,
  glow = "rgba(56, 189, 248, 0.4)",
  border = "rgba(56, 189, 248, 0.6)",
  text = "#38bdf8",
  onOpenDetail,
}: RomAddonCardProps) {
  const hasIcon = iconUrl && iconUrl.startsWith("http");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        padding: "14px",
        borderRadius: "20px",
        background: "var(--bg-card)",
        border: `1px solid ${border}`,
        position: "relative",
        overflow: "hidden",
        transition: "all 0.3s ease",
      }}
    >
      {isTop && (
        <span
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "rgba(250, 204, 21, 0.2)",
            color: "#facc15",
            padding: "2px 8px",
            borderRadius: "999px",
            fontSize: "9px",
            fontWeight: 800,
            zIndex: 2,
          }}
        >
          🔥 TOP
        </span>
      )}
      {isNew && !isTop && (
        <span
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "rgba(34, 197, 94, 0.2)",
            color: "#22c55e",
            padding: "2px 8px",
            borderRadius: "999px",
            fontSize: "9px",
            fontWeight: 800,
            zIndex: 2,
          }}
        >
          ✨ NUEVO
        </span>
      )}

      {/* Imagen + Info */}
      <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
        <div
          style={{
            width: "80px",
            height: "80px",
            minWidth: "80px",
            borderRadius: "16px",
            overflow: "hidden",
            background: "rgba(0,0,0,0.3)",
            border: `1px solid ${border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 6px 18px ${glow}`,
            position: "relative",
          }}
        >
          <span style={{ fontSize: "36px" }}>{emoji}</span>
          {hasIcon && (
            <img
              src={iconUrl}
              alt={name}
              loading="lazy"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              fontSize: "15px",
              fontWeight: 800,
              margin: 0,
              marginBottom: "4px",
              color: "var(--text-primary)",
              lineHeight: 1.2,
            }}
          >
            {name}
          </h3>
          <span
            style={{
              display: "inline-block",
              fontSize: "9px",
              fontWeight: 700,
              color: text,
              background: glow,
              padding: "2px 8px",
              borderRadius: "999px",
              marginBottom: "6px",
              textTransform: "uppercase",
              letterSpacing: "0.3px",
            }}
          >
            {category}
          </span>
          <p
            style={{
              fontSize: "12px",
              color: "var(--text-muted)",
              margin: 0,
              lineHeight: 1.4,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {description}
          </p>
        </div>
      </div>

      {/* Botón Ver Detalles */}
      <button
        onClick={onOpenDetail}
        className="bounce-click"
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "12px",
          background: `linear-gradient(135deg, ${glow}, ${border})`,
          border: `1px solid ${border}`,
          color: text,
          fontWeight: 800,
          fontSize: "12px",
          cursor: "pointer",
          letterSpacing: "0.5px",
          textTransform: "uppercase",
          fontFamily: "inherit",
        }}
      >
        👁️ Ver más detalles
      </button>
    </div>
  );
}
