"use client";

import { useState, useEffect, useSearchParams } from "next/navigation";

interface VerificarResponse {
  ok: boolean;
}

interface GenerarResponse {
  ok: boolean;
  codigo?: string;
  error?: string;
}

export default function Generar() {
  const params = useSearchParams();
  const chat = params.get("chat") || "";
  const token = params.get("token") || "";

  const [verificado, setVerificado] = useState<boolean | null>(null);
  const [procedimientoCompleto, setProcedimientoCompleto] = useState(false);
  const [codigo, setCodigo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState(10);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [pasoActual, setPasoActual] = useState(1);
  const [botOffline, setBotOffline] = useState(false);

  // Función para iniciar el timer
  useEffect(() => {
    if (procedimientoCompleto) {
      return;
    }
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimer(10);
          setPasoActual(3);
          return 10;
        }
        return prev - 1;
      });
    }, 1000);
    setTimerInterval(interval);
    return () => clearInterval(interval);
  }, [procedimientoCompleto]);

  useEffect(() => {
    if (!chat || !token) {
      setVerificado(false);
      return;
    }

    async function verificar() {
      try {
        const res = await fetch(`${process.env.BOT_API_URL}/api/verificar?token=${token}&chat=${chat}`, {
          cache: "no-store",
        });
        const data: VerificarResponse = await res.json();
        setVerificado(data.ok);
        
        if (data.ok) {
          setProcedimientoCompleto(true);
          setBotOffline(false); // Reset offline state when bot comes back
          // Reset timer cuando se habilita el procedimiento
          setTimer(10);
          setPasoActual(1);
        }
      } catch (err: any) {
        console.error("Error al verificar:", err);
        // Si no puede conectar, el bot está offline
        setBotOffline(true);
        setVerificado(false);
      }
    }

    verificar();
  }, [chat, token]);

  // Manejar el click en GENERAR MI CÓDIGO
  const handleGenerar = async () => {
    if (!token || !chat) return;
    
    setError(null);
    try {
      const res = await fetch(`${process.env.BOT_API_URL}/api/generar-desde-link`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, chat }),
      });
      const data: GenerarResponse = await res.json();
      
      if (data.ok && data.codigo) {
        setCodigo(data.codigo);
        setError(null);
      } else {
        setError(data.error || "Error desconocido");
      }
    } catch (err: any) {
      console.error("Error al generar:", err);
      setError("Error al conectar con la API");
    }
  };

  // Si no está verificado, mostrar mensaje y salir
  if (!chat || !token) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>Parámetros faltantes</h2>
        <p>Faltan los parámetros chat y/o token en la URL.</p>
      </div>
    );
  }

  if (verificado === false) {
    if (botOffline) {
      return (
        <div style={{ padding: "20px", textAlign: "center" }}>
          <h2 style={{ color: "#f87171" }}>🔴 El bot está apagado</h2>
          <p>El bot está apagado, espera 1 min y dale Reintentar</p>
          <button
            onClick={() => {
              setBotOffline(false);
              setVerificado(null);
            }}
            style={{
              marginTop: "12px",
              padding: "12px 24px",
              background: "#3b82f6",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            Reintentar
          </button>
        </div>
      );
    }
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>Link vencido o ya usado</h2>
        <p>Link vencido o ya usado, pide otro con !link en WhatsApp</p>
      </div>
    );
  }

  // Si fue verificado pero aún no completó el procedimiento
  if (!procedimientoCompleto) {
    return (
      <div style={{ padding: "20px", textAlign: "center", maxWidth: 400, margin: "0 auto" }}>
        <h2>Procedimiento de Monetización</h2>
        <div style={{ background: "#1a1a24", padding: "20px", borderRadius: "12px", marginBottom: "20px" }}>
          <h3 style={{ color: "#facc15", margin: "0 0 16px 0" }}>Sigue estos pasos:</h3>
          
          {pasoActual === 1 && (
            <div style={{ marginBottom: "16px" }}>
              <p style={{ color: "#fff", margin: "0 0 8px 0" }}>Paso 1: Click aquí</p>
              <button
                onClick={() => {
                  setPasoActual(2);
                  // Timer empieza cuando hacen click
                  setTimer(10);
                  if (timerInterval) clearInterval(timerInterval);
                }}
                style={{
                  width: "100%",
                  marginTop: "8px",
                  padding: "12px",
                  background: "#22c55e",
                  color: "#0a0a0f",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                Ir a anuncios / botón
              </button>
            </div>
          )}

          {pasoActual === 2 && (
            <div style={{ marginBottom: "16px" }}>
              <p style={{ color: "#fff", margin: "0 0 8px 0" }}>Paso 2: Espera 10 segundos</p>
              <div style={{ color: "#facc15", fontWeight: "bold" }}>
                Tiempo restante: <span style={{ color: "#fff", fontWeight: "bold" }} id="timer-display">{timer}</span> seg
              </div>
              <button
                onClick={() => {
                  // Forzar paso 3
                  setPasoActual(3);
                }}
                style={{
                  marginTop: "8px",
                  padding: "10px 20px",
                  background: "#3b82f6",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                Saltar timer
              </button>
            </div>
          )}

          {pasoActual === 3 && (
            <div style={{ marginBottom: "16px" }}>
              <p style={{ color: "#fff", margin: "0 0 8px 0" }}>Paso 3: Click aquí</p>
              <button
                onClick={() => setPasoActual(4)}
                style={{
                  width: "100%",
                  marginTop: "8px",
                  padding: "12px",
                  background: "#a855f7",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                Verificar click
              </button>
            </div>
          )}

          {pasoActual >= 4 && (
            <button
              onClick={() => setProcedimientoCompleto(true)}
              style={{
                width: "100%",
                marginTop: "16px",
                padding: "14px",
                background: "#facc15",
                color: "#0a0a0f",
                border: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              He completado los 3 pasos
            </button>
          )}
        </div>
      </div>
    );
  }

  // Procedimiento completado, mostrar botón GENERAR MI CÓDIGO
  return (
    <div style={{ padding: "20px", textAlign: "center", maxWidth: 400, margin: "0 auto" }}>
      <h2>Generador de Código</h2>
      
      {codigo ? (
        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ color: "#facc15", marginBottom: "16px" }}>TU CÓDIGO ES:</h3>
          <div style={{
            background: "#1a1a24",
            padding: "20px",
            borderRadius: "12",
            marginBottom: "16px",
            border: "1px solid #333",
          }}>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#fff", letterSpacing: "3px" }}>
              {codigo}
            </div>
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(codigo)}
            style={{
              width: "100%",
              marginTop: "12px",
              padding: "14px",
              background: "#3b82f6",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            Copiar Código
          </button>
          <p style={{ marginTop: "12px", color: "#888", fontSize: "12px" }}>
            Vuelve a WhatsApp y manda !activar {codigo}
          </p>
        </div>
      ) : (
        <button
          onClick={handleGenerar}
          style={{
            width: "100%",
            marginTop: "20px",
            padding: "16px",
            background: "#facc15",
            color: "#0a0a0f",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          GENERAR MI CÓDIGO
        </button>
      )}
    </div>
  );
}