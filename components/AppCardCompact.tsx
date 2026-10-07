"use client";

import Link from "next/link";

type AppCardCompactProps = {
  slug: string;
  name: string;
  iconUrl: string;
  emoji: string;
  version: string;
  developer?: string;
  updated: string;
  rating?: number;
  category: string;
};

function StarRating({ rating = 4.5 }: { rating?: number }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div style={{ display: "flex", gap: "1px", alignItems: "center" }}>
      {stars.map((s) => {
        const filled = (rating ?? 0) >= s;
        const half = !filled && (rating ?? 0) >= s - 0.5;
        return (
          <span
            key={s}
            style={{
              fontSize: "11px",
              color: filled || half ? "#facc15" : "rgba(255,255,255,0.2)",
              lineHeight: 1,
            }}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}

export default function AppCardCompact({
  slug,
  name,
  iconUrl,
  emoji,
  version,
  developer = "PERSONS",
  updated,
  rating = 4.5,
  category,
}: AppCardCompactProps) {
  const hasIcon = iconUrl && iconUrl.startsWith("http");

  return (
    <Link
      href={`/apps/${slug}`}
      title={`${name} - ${category}`}
      style={{
        textDecoration: "none",
        color: "inherit",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        padding: "6px",
        borderRadius: "16px",
        transition: "background 0.2s ease, transform 0.2s ease",
        minWidth: 0,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = "rgba(255,255,255,0.04)";
        el.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = "transparent";
        el.style.transform = "translateY(0)";
      }}
    >
      <div
        style={{
          width: "100%",
          aspectRatio: "1 / 1",
          borderRadius: "20px",
          overflow: "hidden",
          backgroundColor: "rgba(255,255,255,0.05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 14px rgba(0,0,0,0.35)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {hasIcon ? (
          <img
            src={iconUrl}
            alt={name}
            loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <span style={{ fontSize: "42px" }}>{emoji}</span>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "2px", minWidth: 0 }}>
        <div
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "#ffffff",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {name}
        </div>

        <div
          style={{
            fontSize: "11px",
            color: "#9ca3af",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {version} (Mod)
        </div>

        <div
          style={{
            fontSize: "11px",
            color: "#9ca3af",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {developer}
        </div>

        <div
          style={{
            fontSize: "11px",
            color: "#9ca3af",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {updated}
        </div>

        <StarRating rating={rating} />
      </div>
    </Link>
  );
}
