"use client";

import { useEffect, useRef } from "react";

/**
 * Adsterra Social Bar — se carga en todas las sub-páginas de descarga.
 * Usa el script que proporcionó el usuario.
 */
export default function AdsterraSocialBar() {
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;

    const script = document.createElement("script");
    script.setAttribute("data-cfasync", "false");
    script.src = "https://bellnewyork.org/14/cfed6f54b73385057c4c709b0d06da79";
    document.body.appendChild(script);

    return () => {
      // No remover en cleanup para que persista entre renders
    };
  }, []);

  return null;
}
