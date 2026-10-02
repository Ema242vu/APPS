"use client";

import { useState } from "react";
import { avExplanations } from "@/lib/av-explanations";

type ScanResult = {
  positives: number;
  total: number;
  scans: { engine: string; detected: boolean; result: string | null }[];
};

export default function Escaner() {
  const [url, setUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState("");

  const handleScan = async () => {
    if (!url) {
      setError("Por favor, pega un enlace de descarga.");
      return;
    }

    if (!url.startsWith("http")) {
      setError("El enlace debe empezar con http:// o https://");
      return;
    }

    setScanning(true);
    setError("");
    setResult(null);
    setProgress("Enviando enlace a VirusTotal...");

    try {
      const uploadRes = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!uploadRes.ok) {
        throw new Error("Error al enviar el enlace.");
      }

      const uploadData = await uploadRes.json();
      const analysisId = uploadData.data.id;
      setProgress("Analizando enlace... Esto puede tardar unos segundos.");

      let attempts = 0;
      const maxAttempts = 10;
      const delay = 5000;

      const checkResult = async (): Promise<ScanResult | null> => {
        const reportRes = await fetch(`/api/scan?id=${analysisId}`);
        if (!reportRes.ok) {
          if (reportRes.status === 404) return null;
          throw new Error("Error al obtener el reporte.");
        }
        return await reportRes.json();
      };

      let report: ScanResult | null = null;
      while (attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        report = await checkResult();
        if (report) break;
        attempts++;
        setProgress(`Analizando... (intento ${attempts + 1}/${maxAttempts})`);
      }

      if (!report) throw new Error("El análisis tardó demasiado. Inténtalo de nuevo.");

      setResult(report);
      setProgress("");
    } catch (err: any) {
      setError(err.message || "Ocurrió un error inesperado.");
      setProgress("");
    } finally {
      setScanning(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-primary)", color: "var(--text-primary)", fontFamily: "system-ui, sans-serif", padding: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width: "100%", maxWidth: "600px" }}>
        <a href="/" style={{ color: "#facc15", textDecoration: "none", fontWeight: "bold", display: "inline-block", marginBottom: "30px" }}>
          ← Volver a la tienda
        </a>

        <h1 style={{ fontSize: "36px", fontWeight: "bold", marginBottom: "10px" }}>🔍 Escáner de APKs</h1>
        <p style={{ color: "var(--text-muted)", marginBottom: "30px" }}>
          Pega el enlace de descarga de un APK y te diremos si tiene virus o si son falsos positivos.
        </p>

        <div style={{ padding: "30px", borderRadius: "20px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", marginBottom: "30px" }}>
          <input
            type="text"
            placeholder="https://www.mediafire.com/file/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{ width: "100%", padding: "14px", borderRadius: "10px", backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid var(--border-color)", color: "var(--text-primary)", fontSize: "14px", marginBottom: "20px", boxSizing: "border-box", outline: "none" }}
          />
          <button
            onClick={handleScan}
            disabled={scanning || !url}
            className="bounce-click"
            style={{ width: "100%", padding: "18px", borderRadius: "14px", backgroundColor: "#facc15", color: "#0d0d12", fontWeight: "bold", fontSize: "16px", border: "none", cursor: scanning ? "not-allowed" : "pointer", opacity: scanning ? 0.6 : 1 }}
          >
            {scanning ? "Escaneando..." : "Escanear enlace"}
          </button>
          {progress && <p style={{ color: "#facc15", marginTop: "15px", textAlign: "center" }}>{progress}</p>}
          {error && <p style={{ color: "#fca5a5", marginTop: "15px", textAlign: "center" }}>{error}</p>}
        </div>

        {result && (
          <div style={{ padding: "30px", borderRadius: "20px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
              Resultado: {result.positives} / {result.total} detecciones
            </h2>
            <p style={{ color: "var(--text-muted)", marginBottom: "20px" }}>
              {result.positives === 0
                ? "✅ ¡Todo limpio! Ningún antivirus detectó amenazas."
                : "⚠️ Algunos antivirus detectaron posibles amenazas. Revisa los detalles abajo."}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {result.scans
                .filter((s) => s.detected)
                .map((scan, i) => (
                  <div key={i} style={{ padding: "15px", borderRadius: "12px", backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid var(--border-color)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
                      <b>{scan.engine}</b>
                      <span style={{ color: "#fca5a5", fontWeight: "bold" }}>{scan.result}</span>
                    </div>
                    <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                      {getExplanation(scan.result)}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getExplanation(result: string | null): string {
  if (!result) return "Sin información.";
  const lower = result.toLowerCase();
  for (const key of Object.keys(avExplanations)) {
    if (lower.includes(key.toLowerCase())) {
      const value = avExplanations[key];
      return value.isFalsePositive
        ? `✅ FALSO POSITIVO: ${value.explanation}`
        : `❌ PELIGRO: ${value.explanation}`;
    }
  }
  return "⚠️ Detección desconocida. Investiga antes de instalar.";
}
