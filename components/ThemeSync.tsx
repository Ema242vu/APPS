"use client";

import { useEffect } from "react";

/**
 * Aplica el tema guardado en localStorage a TODAS las páginas.
 * Sin esto, páginas hechas como Server Components (terminos, tutorial,
 * blog, 404...) se quedaban siempre en dark aunque estuviera en light.
 */
export default function ThemeSync() {
  useEffect(() => {
    const saved = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  return null;
}
