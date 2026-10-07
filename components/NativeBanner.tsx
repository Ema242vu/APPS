"use client";

import { useEffect, useId } from "react";

export default function NativeBanner() {
  const uniqueId = useId().replace(/:/g, "");

  useEffect(() => {
    const containerId = `container-885a3a3a0173836d790936818ab5a034-${uniqueId}`;
    const container = document.getElementById(containerId);
    if (!container) return;

    // Evitar duplicar el script si ya existe en este contenedor
    if (container.querySelector("script")) return;

    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src = "https://bellnewyork.org/21/885a3a3a0173836d790936818ab5a034";
    container.appendChild(script);

    return () => {
      // Cleanup opcional
      if (container && container.contains(script)) {
        container.removeChild(script);
      }
    };
  }, [uniqueId]);

  return (
    <div style={{ marginTop: "30px", marginBottom: "30px", width: "100%", display: "flex", justifyContent: "center" }}>
      <div id={`container-885a3a3a0173836d790936818ab5a034-${uniqueId}`} />
    </div>
  );
}
