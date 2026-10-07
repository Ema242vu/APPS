"use client";

import { useState, useEffect } from "react";

type Comment = { name: string; text: string; date: string };

const MAX_NAME_LENGTH = 30;
const MAX_TEXT_LENGTH = 500;
const MAX_COMMENTS = 50;

function sanitize(input: string): string {
  // Elimina etiquetas HTML y caracteres peligrosos
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, MAX_TEXT_LENGTH);
}

export default function Comments({ appName }: { appName: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`comments-${appName}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setComments(parsed);
      }
    } catch {
      // Ignorar errores de parseo
      setComments([]);
    }
  }, [appName]);

  const addComment = () => {
    setError("");

    const cleanName = sanitize(name);
    const cleanText = sanitize(text);

    if (!cleanName) { setError("Escribe tu nombre"); return; }
    if (!cleanText) { setError("Escribe un comentario"); return; }
    if (cleanName.length > MAX_NAME_LENGTH) { setError(`Máximo ${MAX_NAME_LENGTH} caracteres en el nombre`); return; }

    const newComment: Comment = {
      name: cleanName.slice(0, MAX_NAME_LENGTH),
      text: cleanText.slice(0, MAX_TEXT_LENGTH),
      date: new Date().toLocaleDateString("es-CO"),
    };

    const updated = [newComment, ...comments].slice(0, MAX_COMMENTS);

    try {
      localStorage.setItem(`comments-${appName}`, JSON.stringify(updated));
      setComments(updated);
      setName("");
      setText("");
    } catch {
      setError("Error al guardar. Intenta de nuevo.");
    }
  };

  return (
    <div
      style={{
        marginTop: "30px",
        padding: "25px",
        borderRadius: "20px",
        backgroundColor: "var(--bg-card, #1a1a1f)",
        border: "1px solid var(--border-color, rgba(255,255,255,0.1))",
      }}
    >
      <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "20px" }}>
        💬 Comentarios ({comments.length})
      </h2>

      <input
        type="text"
        placeholder="Tu nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={MAX_NAME_LENGTH}
        aria-label="Tu nombre"
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "10px",
          backgroundColor: "rgba(255,255,255,0.05)",
          border: "1px solid var(--border-color, rgba(255,255,255,0.1))",
          color: "var(--text-primary, #ffffff)",
          fontSize: "14px",
          marginBottom: "10px",
          boxSizing: "border-box",
          outline: "none",
        }}
      />

      <textarea
        placeholder="Escribe tu comentario..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        maxLength={MAX_TEXT_LENGTH}
        aria-label="Tu comentario"
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "10px",
          backgroundColor: "rgba(255,255,255,0.05)",
          border: "1px solid var(--border-color, rgba(255,255,255,0.1))",
          color: "var(--text-primary, #ffffff)",
          fontSize: "14px",
          marginBottom: "10px",
          boxSizing: "border-box",
          outline: "none",
          fontFamily: "inherit",
          resize: "none",
        }}
      />

      <div style={{ fontSize: "11px", color: "#6b7280", marginBottom: "8px", textAlign: "right" }}>
        {text.length}/{MAX_TEXT_LENGTH}
      </div>

      {error && (
        <div style={{ color: "#ef4444", fontSize: "12px", marginBottom: "10px" }}>{error}</div>
      )}

      <button
        onClick={addComment}
        className="bounce-click"
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "10px",
          backgroundColor: "#facc15",
          color: "#0d0d12",
          fontWeight: "bold",
          border: "none",
          cursor: "pointer",
          fontSize: "14px",
          marginBottom: "20px",
        }}
      >
        Enviar comentario
      </button>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {comments.length === 0 ? (
          <p style={{ textAlign: "center", color: "#6b7280", fontSize: "13px", fontStyle: "italic" }}>
            Sé el primero en comentar 👀
          </p>
        ) : (
          comments.map((c, i) => (
            <div
              key={`${c.date}-${i}`}
              style={{
                padding: "14px",
                borderRadius: "12px",
                backgroundColor: "rgba(255,255,255,0.03)",
                border: "1px solid var(--border-color, rgba(255,255,255,0.1))",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ fontSize: "13px", fontWeight: "bold", color: "#facc15" }}>{c.name}</span>
                <span style={{ fontSize: "11px", color: "#6b7280" }}>{c.date}</span>
              </div>
              <p style={{ fontSize: "13px", color: "#ffffff", margin: 0, lineHeight: 1.5, wordBreak: "break-word" }}>
                {c.text}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
