"use client";

import type { JSX } from "react";
import { useState, useEffect } from "react";
import { loadAccount, isSkipActive, remainingSkipMinutes } from "@/lib/accounts";

export default function SkipBanner(): JSX.Element | null {
  const [acc, setAcc] = useState<ReturnType<typeof loadAccount> | null>(null);

  useEffect(() => {
    setAcc(loadAccount());
    const handle = () => setAcc(loadAccount());
    window.addEventListener("persons-account-change", handle);
    return () => window.removeEventListener("persons-account-change", handle);
  }, []);

  const active = isSkipActive(acc);
  const mins = active ? remainingSkipMinutes(acc!) : 0;

  if (!active) return null;

  // Mostrar aviso cada 10 min mientras quede tiempo
  const show = mins > 0 && mins % 10 === 0;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        padding: "10px 16px",
        background: "linear-gradient(135deg, #22c55e, #16a34a)",
        color: "#fff",
        textAlign: "center",
        fontSize: 13,
        fontWeight: 700,
        boxShadow: "0 4px 12px rgba(34,197,94,0.3)",
      }}
    >
      ⚡ Acceso directo activo — te quedan <b>{mins} min</b> sin pasos de verificación.
      {show && <span style={{ marginLeft: 10, fontSize: 11, opacity: 0.9 }}>¡Date prisa!</span>}
    </div>
  );
}
