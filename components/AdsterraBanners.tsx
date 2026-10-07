"use client";

import { useEffect, useRef } from "react";

/**
 * Adsterra 300x250
 * Usa iframe aislado para evitar el conflicto de `atOptions` global
 */
export function AdsterraBanner300x250() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>body{margin:0;padding:0;overflow:hidden;background:transparent;}</style></head>
<body>
<script type="text/javascript">
  atOptions = { 'key' : '9c418f5f528430201ed07204e5c895aa', 'format' : 'iframe', 'height' : 250, 'width' : 300, 'params' : {} };
</script>
<script type="text/javascript" src="https://bellnewyork.org/22/9c418f5f528430201ed07204e5c895aa"></script>
</body></html>`;

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(html);
      doc.close();
    }
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "25px", marginBottom: "25px", minHeight: "250px", width: "100%" }}>
      <iframe
        ref={iframeRef}
        title="Publicidad"
        width={300}
        height={250}
        style={{ border: "none", overflow: "hidden" }}
        scrolling="no"
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      />
    </div>
  );
}

/**
 * Adsterra 468x60
 * Usa iframe aislado para evitar el conflicto de `atOptions` global
 */
export function AdsterraBanner468x60() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>body{margin:0;padding:0;overflow:hidden;background:transparent;}</style></head>
<body>
<script type="text/javascript">
  atOptions = { 'key' : 'f3a25420cb8f0ff813de40e101870a27', 'format' : 'iframe', 'height' : 60, 'width' : 468, 'params' : {} };
</script>
<script type="text/javascript" src="https://bellnewyork.org/22/f3a25420cb8f0ff813de40e101870a27"></script>
</body></html>`;

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(html);
      doc.close();
    }
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "20px", marginBottom: "20px", minHeight: "60px", width: "100%", overflow: "hidden" }}>
      <iframe
        ref={iframeRef}
        title="Publicidad"
        width={468}
        height={60}
        style={{ border: "none", overflow: "hidden", maxWidth: "100%" }}
        scrolling="no"
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      />
    </div>
  );
}
