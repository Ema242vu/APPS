import Link from "next/link";

export const metadata = {
  title: "Página no encontrada",
};

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-primary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        fontFamily: "system-ui, sans-serif",
        textAlign: "center",
      }}
    >
      <div
        className="slide-up"
        style={{
          maxWidth: 400,
          width: "100%",
          padding: "40px 25px",
          borderRadius: 24,
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border-color)",
        }}
      >
        <div style={{ fontSize: 64, marginBottom: 16 }}>🐾</div>
        <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0, marginBottom: 10 }}>
          Esta página no existe
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.6, margin: 0, marginBottom: 25 }}>
          El enlace que seguiste se rompió o la página se movió. Pero tranqui, las apps siguen ahí. 🐱
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Link
            href="/"
            className="bounce-click"
            style={{
              display: "block",
              padding: 16,
              borderRadius: 50,
              background: "linear-gradient(135deg, #facc15, #f59e0b)",
              color: "#0a0a0f",
              fontWeight: 700,
              fontSize: 14,
              textDecoration: "none",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            ← Volver a la tienda
          </Link>
          <Link
            href="/blog"
            style={{
              display: "block",
              padding: 14,
              borderRadius: 12,
              backgroundColor: "transparent",
              border: "1px solid var(--border-color)",
              color: "var(--text-muted)",
              fontSize: 13,
              textDecoration: "none",
            }}
          >
            Ir al blog
          </Link>
        </div>
      </div>
    </div>
  );
}
