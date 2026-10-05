"use client";

import { useEffect, useRef } from "react";

export function AdsterraBanner300x250() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    const configScript = document.createElement("script");
    configScript.type = "text/javascript";
    configScript.innerHTML = `
      atOptions = {
        'key' : '9c418f5f528430201ed07204e5c895aa',
        'format' : 'iframe',
        'height' : 250,
        'width' : 300,
        'params' : {}
      };
    `;

    const invokeScript = document.createElement("script");
    invokeScript.type = "text/javascript";
    invokeScript.src = "https://bellnewyork.org/22/9c418f5f528430201ed07204e5c895aa";

    containerRef.current.appendChild(configScript);
    containerRef.current.appendChild(invokeScript);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "25px",
        marginBottom: "25px",
        minHeight: "250px",
        width: "100%",
      }}
    >
      <div ref={containerRef} style={{ width: "300px", height: "250px" }}></div>
    </div>
  );
}

export function AdsterraBanner468x60() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    const configScript = document.createElement("script");
    configScript.type = "text/javascript";
    configScript.innerHTML = `
      atOptions = {
        'key' : 'f3a25420cb8f0ff813de40e101870a27',
        'format' : 'iframe',
        'height' : 60,
        'width' : 468,
        'params' : {}
      };
    `;

    const invokeScript = document.createElement("script");
    invokeScript.type = "text/javascript";
    invokeScript.src = "https://bellnewyork.org/22/f3a25420cb8f0ff813de40e101870a27";

    containerRef.current.appendChild(configScript);
    containerRef.current.appendChild(invokeScript);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "20px",
        marginBottom: "20px",
        minHeight: "60px",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <div ref={containerRef} style={{ width: "468px", height: "60px", maxWidth: "100%" }}></div>
    </div>
  );
}
