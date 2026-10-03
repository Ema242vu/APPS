"use client";

import { useEffect } from "react";

export default function NativeBanner() {
  useEffect(() => {
    // Reinserta el script cada vez que se monta el componente
    // para que Adsterra lo detecte en cada página individual
    const existingScript = document.querySelector(
      'script[src*="bellnewyork.org/21/"]'
    );
    if (!existingScript) {
      const script = document.createElement("script");
      script.async = true;
      script.setAttribute("data-cfasync", "false");
      script.src = "https://bellnewyork.org/21/885a3a3a0173836d790936818ab5a034";
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div
      style={{
        marginTop: "30px",
        marginBottom: "30px",
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div id="container-885a3a3a0173836d790936818ab5a034"></div>
    </div>
  );
}
