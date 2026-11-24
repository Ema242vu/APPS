"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

type Props = {
  slot: string;
  format?: string;
  responsive?: boolean;
  style?: React.CSSProperties;
};

/**
 * Bloque de anuncio de Google AdSense.
 * El script global se carga en app/layout.tsx.
 */
export default function GoogleAdUnit({
  slot,
  format = "auto",
  responsive = true,
  style,
}: Props) {
  const insRef = useRef<HTMLModElement>(null);
  const pushedRef = useRef(false);

  useEffect(() => {
    if (pushedRef.current) return;
    const el = insRef.current;
    if (!el) return;
    // Evita rellenar dos veces el mismo bloque (StrictMode / re-render).
    if (el.getAttribute("data-adsbygoogle-status")) return;
    pushedRef.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Si el script aún no cargó, AdSense procesa la cola al terminar.
    }
  }, []);

  return (
    <ins
      ref={insRef}
      className="adsbygoogle"
      style={{ display: "block", ...style }}
      data-ad-client="ca-pub-5959908767381687"
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive ? "true" : "false"}
    />
  );
}
