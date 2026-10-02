import Link from "next/link";
import { blogPosts } from "@/lib/blog";

export const metadata = {
  title: "Blog - Mi Store",
  description: "Tutoriales, recomendaciones y guías sobre apps premium para Android.",
};

export default function BlogPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-primary)", color: "var(--text-primary)", fontFamily: "system-ui, sans-serif", padding: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width: "100%", maxWidth: "700px" }}>
        <Link href="/" style={{ color: "#facc15", textDecoration: "none", fontWeight: "bold", display: "inline-block", marginBottom: "30px" }}>
          ← Volver a la tienda
        </Link>

        <h1 style={{ fontSize: "40px", fontWeight: 900, marginBottom: "10px" }}>📚 Blog</h1>
        <p style={{ color: "var(--text-muted)", marginBottom: "40px", fontSize: "15px" }}>
          Tutoriales, guías y recomendaciones sobre apps premium para Android.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="bounce-click"
              style={{
                display: "block",
                padding: "25px",
                borderRadius: "18px",
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                textDecoration: "none",
                color: "var(--text-primary)",
                transition: "all 0.3s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                <span style={{ fontSize: "32px" }}>{post.emoji}</span>
                <div>
                  <span style={{ fontSize: "11px", color: "#facc15", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px" }}>{post.category}</span>
                  <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: 0 }}>{post.date} · {post.readTime} de lectura</p>
                </div>
              </div>
              <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "10px", color: "var(--text-primary)" }}>{post.title}</h2>
              <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.6, margin: 0 }}>{post.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
