"use client";

import type { JSX } from "react";
import { useState, useEffect } from "react";
import { loadAccount, updateProfile } from "@/lib/accounts";

function dataUrl(file: File): Promise<string> {
  return new Promise((resolve) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.readAsDataURL(file);
  });
}

export default function ProfileEditor(): JSX.Element {
  const [acc, setAcc] = useState<ReturnType<typeof loadAccount> | null>(
    () => loadAccount() || null
  );
  const [photo, setPhoto] = useState<string | null>(null);
  const [desc, setDesc] = useState(() => {
    const a = loadAccount();
    return a?.description || "";
  });
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return setErr("Sube una imagen.");
    if (file.size > 2 * 1024 * 1024) return setErr("Máximo 2 MB.");
    const url = await dataUrl(file);
    setPhoto(url);
  };

  const save = () => {
    if (!acc) return;
    const next = updateProfile(acc, {
      profilePhoto: photo ?? undefined,
      description: desc.trim() || undefined,
    });
    setAcc(next);
    setMsg("Perfil guardado.");
    setErr("");
  };

  if (!acc) return <div>Cargando cuenta...</div>;

  const hasPhoto = acc.profilePhoto || photo;

  return (
    <div
      style={{
        padding: "16px",
        borderRadius: "16px",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <h3 style={{ margin: "0 0 14px", fontSize: 16, fontWeight: 700 }}>🖼️ Tu perfil</h3>

      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            overflow: "hidden",
            border: `2px solid ${hasPhoto ? "#facc15" : "rgba(255,255,255,0.12)"}`,
            background: "#0b0c10",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {hasPhoto ? (
            <img src={photo || acc.profilePhoto!} alt="perfil" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <span style={{ fontSize: 34 }}>👤</span>
          )}
        </div>
        <div>
          <label style={{ display: "block", fontSize: 12, color: "#9ca3af", marginBottom: 6 }}>
            Foto de perfil (JPG/PNG/WebP, máx. 2 MB)
          </label>
          <input type="file" accept="image/*" onChange={handlePhoto} />
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={{ display: "block", fontSize: 12, color: "#9ca3af", marginBottom: 6 }}>
          Descripción de tu cuenta
        </label>
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Cuenta algo sobre ti..."
          rows={3}
          style={{
            width: "100%",
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "#0b0c10",
            color: "#fff",
            fontSize: 14,
          }}
        />
      </div>

      {err && <p style={{ color: "#f87171", fontSize: 12, marginBottom: 10 }}>{err}</p>}
      {msg && <p style={{ color: "#34d399", fontSize: 12, marginBottom: 10 }}>{msg}</p>}

      <button
        onClick={save}
        className="bounce-click"
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: 10,
          border: "none",
          background: "#facc15",
          color: "#000",
          fontWeight: 700,
          cursor: "pointer",
          fontSize: 15,
        }}
      >
        Guardar perfil
      </button>
    </div>
  );
}
