import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts } from "@/lib/blog";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return { title: "Artículo no encontrado" };
  return {
    title: `${post.title} - Mi Store Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
    },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) notFound();

  const otherPosts = blogPosts.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-primary)", color: "var(--text-primary)", fontFamily: "system-ui, sans-serif", padding: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width: "100%", maxWidth: "700px" }}>
        <Link href="/blog" style={{ color: "#facc15", textDecoration: "none", fontWeight: "bold", display: "inline-block", marginBottom: "30px" }}>
          ← Volver al blog
        </Link>

        <div style={{ marginBottom: "30px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "15px" }}>
            <span style={{ fontSize: "40px" }}>{post.emoji}</span>
            <div>
              <span style={{ fontSize: "11px", color: "#facc15", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px" }}>{post.category}</span>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>{post.date} · {post.readTime} de lectura</p>
            </div>
          </div>
          <h1 style={{ fontSize: "32px", fontWeight: 900, marginBottom: "15px", lineHeight: 1.2 }}>{post.title}</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "16px", lineHeight: 1.6 }}>{post.description}</p>
        </div>

        <article style={{ color: "var(--text-primary)", fontSize: "15px", lineHeight: 1.9 }}>
          {post.content.split("\n").map((line, i) => {
            if (line.startsWith("## ")) return <h2 key={i} style={{ fontSize: "22px", fontWeight: "bold", marginTop: "30px", marginBottom: "15px", color: "#facc15" }}>{line.replace("## ", "")}</h2>;
            if (line.startsWith("### ")) return <h3 key={i} style={{ fontSize: "18px", fontWeight: "bold", marginTop: "20px", marginBottom: "10px" }}>{line.replace("### ", "")}</h3>;
            if (line.startsWith("- ")) return <li key={i} style={{ marginLeft: "20px", marginBottom: "5px", color: "var(--text-muted)" }}>{line.replace("- ", "")}</li>;
            if (line.startsWith("**") && line.endsWith("**")) return <p key={i} style={{ fontWeight: "bold", marginTop: "15px", marginBottom: "10px" }}>{line.replace(/\*\*/g, "")}</p>;
            if (line.trim() === "") return <br key={i} />;
            return <p key={i} style={{ marginBottom: "12px", color: "var(--text-muted)" }} dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.+?)\*\*/g, "<b style='color: var(--text-primary)'>$1</b>") }} />;
          })}
        </article>

        <div style={{ marginTop: "50px", paddingTop: "30px", borderTop: "1px solid var(--border-color)" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "20px" }}>Lee también</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {otherPosts.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} style={{ padding: "15px", borderRadius: "12px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", textDecoration: "none", color: "var(--text-primary)", fontSize: "14px", fontWeight: "bold" }}>
                {p.emoji} {p.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
