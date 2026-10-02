"use client";

import { useState, useEffect } from "react";

type Comment = { name: string; text: string; date: string };

export default function Comments({ appName }: { appName: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(`comments-${appName}`);
    if (saved) setComments(JSON.parse(saved));
  }, [appName]);

  const addComment = () => {
    if (!name.trim() || !text.trim()) return;
    const newComment: Comment = { name: name.trim(), text: text.trim(), date: new Date().toLocaleDateString("es-CO") };
    const updated = [newComment, ...comments];
    setComments(updated);
    localStorage.setItem(`comments-${appName}`, JSON.stringify(updated));
    setName("");
    setText("");
  };

  return (
    <div style={{ marginTop: "30px", padding: "25px", borderRadius: "20px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
      <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "20px" }}>💬 Comentarios ({comments.length})</h2>

      <input
        type="text"
        placeholder="Tu nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ width: "100%", padding: "12px", borderRadius: "10px", backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid var(--border-color)", color: "var(--text-primary)", fontSize: "14px", marginBottom: "10px", boxSizing: "border-box", outline: "none" }}
      />
      <textarea
        placeholder="Escribe tu comentario..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        style={{ width: "100%", padding: "12px", borderRadius: "10px", backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid var(--border-color)", color: "var(--text-primary)", fontSize: "14px", marginBottom: "10px", boxSizing: "border-box", outline: "none", fontFamily: "inherit", resize: "none" }}
      />
      <button
        onClick={addComment}
        className="bounce-click"
        style={{ width: "100%", padding: "12px", borderRadius: "10px", backgroundColor: "#facc15", color: "#0d0d12", fontWeight: "bold", border: "none", cursor: "pointer", fontSize: "14px", marginBottom: "20px" }}
      >
        Enviar comentario
      </button>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {comments.length === 0 ? (
          <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "13px", fontStyle: "italic" }}>
            Sé el primero en comentar 👀
          </p>
        ) : (
          comments.map((c, i) => (
            <div key={i} style={{ padding: "14px", borderRadius: "12px", backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid var(--border-color)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ fontSize: "13px", fontWeight: "bold", color: "#facc15" }}>{c.name}</span>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{c.date}</span>
              </div>
              <p style={{ fontSize: "13px", color: "var(--text-primary)", margin: 0, lineHeight: 1.5 }}>{c.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
