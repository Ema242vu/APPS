"use client";

import { useEffect, useRef } from "react";

/**
 * Monetag Vignette — se carga en la portada.
 * Script proporcionado por el usuario (zona 11940230).
 */
export default function MonetagVignette() {
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;

    const script = document.createElement("script");
    script.dataset.zone = "11940230";
    script.src = "https://n6wxm.com/vignette.min.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return null;
}
