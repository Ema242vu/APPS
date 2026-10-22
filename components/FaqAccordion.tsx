"use client";

import { useState } from "react";

type Faq = { q: string; a: string };

export default function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-primary)", color: "var(--text-primary)", fontFamily: "system-ui, sans-serif", padding: "40px 20px" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <a href="/" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: "bold", display: "inline-block", marginBottom: "30px" }}>← Volver a la tienda</a>
        <h1 style={{ fontSize: "36px", fontWeight: "bold", marginBottom: "10px" }}>❓ Preguntas Frecuentes</h1>
        <p style={{ color: "var(--text-muted)", marginBottom: "40px" }}>Resolvemos tus dudas más comunes.</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {faqs.map((f, i) => (
            <div key={i} style={{ borderRadius: "14px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", overflow: "hidden" }}>
              <button onClick={() => setOpen(open === i ? null : i)} style={{ width: "100%", padding: "20px", backgroundColor: "transparent", border: "none", color: "var(--text-primary)", fontSize: "15px", fontWeight: "bold", textAlign: "left", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "15px" }}>
                <span>{f.q}</span>
                <span style={{ color: "var(--accent)", fontSize: "20px", transform: open === i ? "rotate(45deg)" : "rotate(0)", transition: "transform 0.3s" }}>+</span>
              </button>
              {open === i && (
                <div style={{ padding: "0 20px 20px", color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.7 }}>{f.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
