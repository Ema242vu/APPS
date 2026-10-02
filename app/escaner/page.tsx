"use client";

import { useState } from "react";

type ScanResult = {
  positives: number;
  total: number;
  scans: { engine: string; detected: boolean; result: string | null }[];
};

export default function Escaner() {
  const [file, setFile] = useState<File | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState("");
  const [analysisId, setAnalysisId] = useState("");
  const [progress, setProgress] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      setError("");
    }
  };

  const handleScan = async () => {
    if (!file) {
      setError("Por favor, selecciona un archivo APK.");
      return;
    }

    if (!file.name.endsWith(".apk")) {
      setError("El archivo debe ser un APK.");
      return;
    }

    setScanning(true);
    setError("");
    setProgress("Subiendo archivo a VirusTotal...");

    try {
      // Paso 1: Subir el archivo a VirusTotal
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/scan", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error("Error al subir el archivo.");
      }

      const uploadData = await uploadRes.json();
      const analysisId = uploadData.data.id;
      setAnalysisId(analysisId);
      setProgress("Analizando archivo... Esto puede tardar unos segundos.");

      // Paso 2: Esperar y obtener el reporte
      let attempts = 0;
      const maxAttempts = 10;
      const delay = 5000; // 5 segundos

      const checkResult = async (): Promise<ScanResult | null> => {
        const reportRes = await fetch(`/api/scan?id=${analysisId}`);
        if (!reportRes.ok) {
          if (reportRes.status === 404) {
            return null; // Aún no está listo
          }
          throw new Error("Error al obtener el reporte.");
        }
        const reportData = await reportRes.json();
        return reportData;
      };

      let report: ScanResult | null = null;
      while (attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        report = await checkResult();
        if (report) break;
        attempts++;
        setProgress(`Analizando... (intento ${attempts + 1}/${maxAttempts})`);
      }

      if (!report) {
        throw new Error("El análisis tardó demasiado. Inténtalo de nuevo más tarde.");
      }

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
          Sube un APK y te diremos si tiene virus o si son falsos positivos.
        </p>

        <div style={{ padding: "30px", borderRadius: "20px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", marginBottom: "30px" }}>
          <input
            type="file"
            accept=".apk"
            onChange={handleFileChange}
            style={{ marginBottom: "20px", color: "var(--text-primary)" }}
          />
          <button
            onClick={handleScan}
            disabled={scanning || !file}
            className="bounce-click"
            style={{ width: "100%", padding: "18px", borderRadius: "14px", backgroundColor: "#facc15", color: "#0d0d12", fontWeight: "bold", fontSize: "16px", border: "none", cursor: scanning ? "not-allowed" : "pointer", opacity: scanning ? 0.6 : 1 }}
          >
            {scanning ? "Escaneando..." : "Escanear APK"}
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

// Función para obtener la explicación de una detección
function getExplanation(result: string | null): string {
  if (!result) return "Sin información.";
  const lower = result.toLowerCase();
  for (const [key, value] of Object.entries(avExplanations)) {
    if (lower.includes(key.toLowerCase())) {
      return value.isFalsePositive
        ? `✅ FALSO POSITIVO: ${value.explanation}`
        : `❌ PELIGRO: ${value.explanation}`;
    }
  }
  return "⚠️ Detección desconocida. Investiga antes de instalar.";
}
