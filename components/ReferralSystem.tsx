"use client";

import {
  useCallback,
  useEffect,
  useState,
  type CSSProperties,
  type FormEvent,
} from "react";
import { centsToUsd, SITE_URL } from "@/lib/referrals/config";
import {
  clearOwnCode,
  getOwnCode,
  getStoredPin,
  setOwnCode as saveOwnCode,
  setStoredPin,
} from "@/lib/referrals/client";

type PayoutItem = {
  id: number;
  amount_cents: number;
  method: string | null;
  contact: string | null;
  status: "pending" | "paid" | "rejected";
  requested_at: string;
  paid_at: string | null;
};

type StatsPayload = {
  referrer: {
    code: string;
    name: string | null;
    contact: string | null;
    payout_method: string | null;
    created_at: string;
  };
  stats: {
    visits: number;
    adClicks: number;
    downloads: number;
    earningsCents: number;
    paidCents: number;
    pendingCents: number;
    availableCents: number;
  };
  payouts: PayoutItem[];
  rates: {
    visitCents: number;
    adClickCents: number;
    downloadCents: number;
  };
  minPayoutCents: number;
};

const cardStyle: CSSProperties = {
  background: "var(--bg-card)",
  border: "1px solid var(--border-color)",
  borderRadius: 20,
  padding: 22,
  marginBottom: 16,
};

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid var(--border-color)",
  background: "var(--bg-secondary)",
  color: "var(--text-primary)",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle: CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 600,
  marginBottom: 6,
  marginTop: 14,
  color: "var(--text-primary)",
};

const primaryButton: CSSProperties = {
  width: "100%",
  padding: "14px 18px",
  borderRadius: 999,
  border: "none",
  background: "linear-gradient(135deg, #facc15, #f59e0b)",
  color: "#0a0a0f",
  fontWeight: 700,
  fontSize: 15,
  cursor: "pointer",
};

const secondaryButton: CSSProperties = {
  width: "100%",
  padding: "13px 18px",
  borderRadius: 999,
  border: "1px solid var(--border-color)",
  background: "transparent",
  color: "var(--text-primary)",
  fontWeight: 600,
  fontSize: 14,
  cursor: "pointer",
};

const mutedText: CSSProperties = {
  color: "var(--text-muted)",
  fontSize: 14,
  lineHeight: 1.6,
  margin: 0,
};

function Stat({
  icon,
  label,
  value,
  accent = false,
}: {
  icon: string;
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: `1px solid ${accent ? "rgba(250, 204, 21, 0.35)" : "var(--border-color)"}`,
        borderRadius: 16,
        padding: 16,
      }}
    >
      <div style={{ fontSize: 20, marginBottom: 6 }}>{icon}</div>
      <div
        style={{
          fontSize: accent ? 24 : 22,
          fontWeight: 800,
          color: accent ? "var(--accent)" : "var(--text-primary)",
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
        {label}
      </div>
    </div>
  );
}

function statusLabel(status: PayoutItem["status"]) {
  if (status === "paid") return "Pagado";
  if (status === "rejected") return "Rechazado";
  return "Pendiente";
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ReferralSystem() {
  const [ownCode, setOwnCodeState] = useState<string | null>(null);
  const [payload, setPayload] = useState<StatsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [method, setMethod] = useState("PayPal");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [recover, setRecover] = useState("");
  const [accessPin, setAccessPin] = useState("");
  const [activePin, setActivePin] = useState("");

  const [copied, setCopied] = useState(false);
  const [siteOrigin, setSiteOrigin] = useState(SITE_URL);

  const [payoutMethod, setPayoutMethod] = useState("");
  const [payoutContact, setPayoutContact] = useState("");
  const [payoutMessage, setPayoutMessage] = useState<string | null>(null);
  const [payoutError, setPayoutError] = useState<string | null>(null);
  const [payoutLoading, setPayoutLoading] = useState(false);

  const fetchStats = useCallback(
    async (code: string, pinValue: string): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/referrals/stats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, pin: pinValue }),
          cache: "no-store",
        });
        const data = (await response.json().catch(() => null)) as
          | (StatsPayload & { error?: string })
          | null;

        if (!response.ok || !data) {
          throw new Error(
            data?.error || "No se pudo cargar tu panel de referidos."
          );
        }

        setPayload(data);
        setPayoutMethod(data.referrer.payout_method || "");
        setPayoutContact(data.referrer.contact || "");
        return true;
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "No se pudo cargar tu panel de referidos."
        );
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    // Inicialización desde localStorage/sessionStorage: solo existe en el navegador.
    /* eslint-disable react-hooks/set-state-in-effect */
    setSiteOrigin(window.location.origin);

    const stored = getOwnCode();
    const storedPin = getStoredPin();

    if (stored) {
      setOwnCodeState(stored);
      if (storedPin) {
        setAccessPin(storedPin);
        setActivePin(storedPin);
        fetchStats(stored, storedPin);
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [fetchStats]);

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!/^\d{6}$/.test(pin)) {
      setError("El PIN debe tener exactamente 6 dígitos.");
      return;
    }

    if (pin !== confirmPin) {
      setError("Los dos PIN no coinciden.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/referrals/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          contact,
          payoutMethod: method,
          pin,
        }),
      });
      const data = (await response.json().catch(() => null)) as
        | { code?: string; error?: string }
        | null;

      if (!response.ok || !data?.code) {
        throw new Error(data?.error || "No se pudo crear tu código de referido.");
      }

      saveOwnCode(data.code);
      setOwnCodeState(data.code);
      setActivePin(pin);
      setAccessPin(pin);
      setStoredPin(pin);
      await fetchStats(data.code, pin);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo crear tu código."
      );
      setLoading(false);
    }
  };

  const handleRecover = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const code = recover.trim().toUpperCase();
    if (!/^[A-Z0-9]{6,12}$/.test(code)) {
      setError("Escribe un código válido (6 a 12 letras o números).");
      return;
    }

    if (!/^\d{6}$/.test(accessPin)) {
      setError("Escribe tu PIN de 6 dígitos.");
      return;
    }

    const ok = await fetchStats(code, accessPin);
    if (ok) {
      saveOwnCode(code);
      setOwnCodeState(code);
      setActivePin(accessPin);
      setStoredPin(accessPin);
    }
  };

  const handleAccess = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!ownCode) return;
    setError(null);

    if (!/^\d{6}$/.test(accessPin)) {
      setError("Escribe tu PIN de 6 dígitos.");
      return;
    }

    const ok = await fetchStats(ownCode, accessPin);
    if (ok) {
      setActivePin(accessPin);
      setStoredPin(accessPin);
    }
  };

  const handleCopy = async () => {
    if (!ownCode) return;
    const link = `${siteOrigin}/?ref=${encodeURIComponent(ownCode)}`;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(link);
      } else {
        const input = document.createElement("textarea");
        input.value = link;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        input.remove();
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("No se pudo copiar. Mantén presionado el link y cópialo manualmente.");
    }
  };

  const handlePayout = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!ownCode) return;

    setPayoutLoading(true);
    setPayoutMessage(null);
    setPayoutError(null);

    try {
      const response = await fetch("/api/referrals/payout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: ownCode,
          pin: activePin,
          method: payoutMethod,
          contact: payoutContact,
        }),
      });
      const data = (await response.json().catch(() => null)) as
        | { error?: string; message?: string }
        | null;

      if (!response.ok) {
        throw new Error(data?.error || "No se pudo solicitar el pago.");
      }

      setPayoutMessage(
        data?.message || "Solicitud enviada. Te contactaremos para pagarte."
      );
      await fetchStats(ownCode, activePin);
    } catch (err) {
      setPayoutError(
        err instanceof Error ? err.message : "No se pudo solicitar el pago."
      );
    } finally {
      setPayoutLoading(false);
    }
  };

  const handleChangeCode = () => {
    clearOwnCode();
    setOwnCodeState(null);
    setPayload(null);
    setError(null);
    setRecover("");
    setPin("");
    setConfirmPin("");
    setAccessPin("");
    setActivePin("");
    setPayoutMethod("");
    setPayoutContact("");
    setPayoutMessage(null);
    setPayoutError(null);
  };

  const referralLink = ownCode
    ? `${siteOrigin}/?ref=${encodeURIComponent(ownCode)}`
    : "";

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 800,
            color: "var(--accent)",
            letterSpacing: 1.4,
            textTransform: "uppercase",
          }}
        >
          Programa de referidos
        </div>
        <h1
          style={{
            fontSize: 32,
            lineHeight: 1.08,
            margin: "8px 0 10px",
            letterSpacing: "-0.8px",
          }}
        >
          Invita y gana dinero
        </h1>
        <p style={mutedText}>
          Comparte tu link. Ganas por cada persona que entre, haga clic en los
          anuncios y descargue APKs. Los pagos se revisan manualmente para
          evitar fraude.
        </p>
      </div>

      {error && (
        <div
          style={{
            ...cardStyle,
            borderColor: "rgba(239, 68, 68, 0.45)",
            color: "#fca5a5",
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 6 }}>No se pudo completar la acción</div>
          <div style={{ fontSize: 14, lineHeight: 1.5 }}>{error}</div>
        </div>
      )}

      {loading && !payload && (
        <div style={{ ...cardStyle, textAlign: "center" }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>⏳</div>
          <p style={{ ...mutedText, margin: 0 }}>Cargando tu panel...</p>
        </div>
      )}

      {!loading && !ownCode && (
        <>
          <form onSubmit={handleRegister} style={cardStyle}>
            <h2 style={{ fontSize: 20, margin: "0 0 6px" }}>
              Crea tu link de referido
            </h2>
            <p style={{ ...mutedText, marginBottom: 4 }}>
              Es gratis. Necesitamos un nombre, un contacto para pagarte y un
              PIN para proteger tu panel.
            </p>

            <label htmlFor="ref-name" style={labelStyle}>
              Tu nombre
            </label>
            <input
              id="ref-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ej: Emanuel"
              minLength={2}
              maxLength={80}
              required
              style={inputStyle}
            />

            <label htmlFor="ref-contact" style={labelStyle}>
              Contacto para pagarte
            </label>
            <input
              id="ref-contact"
              value={contact}
              onChange={(event) => setContact(event.target.value)}
              placeholder="Ej: correo o @usuario de Telegram"
              minLength={3}
              maxLength={120}
              required
              style={inputStyle}
            />

            <label htmlFor="ref-method" style={labelStyle}>
              Método de pago
            </label>
            <select
              id="ref-method"
              value={method}
              onChange={(event) => setMethod(event.target.value)}
              style={inputStyle}
            >
              <option value="PayPal">PayPal</option>
              <option value="Binance">Binance</option>
              <option value="Transferencia">Transferencia</option>
              <option value="Otro">Otro</option>
            </select>

            <label htmlFor="ref-pin" style={labelStyle}>
              PIN de seguridad (6 dígitos)
            </label>
            <input
              id="ref-pin"
              type="password"
              value={pin}
              onChange={(event) => setPin(event.target.value.replace(/\D/g, ""))}
              placeholder="••••••"
              inputMode="numeric"
              pattern="[0-9]{6}"
              minLength={6}
              maxLength={6}
              autoComplete="new-password"
              required
              style={inputStyle}
            />
            <p style={{ ...mutedText, fontSize: 12, marginTop: 6 }}>
              Lo necesitarás para entrar a tu panel. No lo compartas con nadie.
            </p>

            <label htmlFor="ref-pin-confirm" style={labelStyle}>
              Confirma tu PIN
            </label>
            <input
              id="ref-pin-confirm"
              type="password"
              value={confirmPin}
              onChange={(event) =>
                setConfirmPin(event.target.value.replace(/\D/g, ""))
              }
              placeholder="••••••"
              inputMode="numeric"
              pattern="[0-9]{6}"
              minLength={6}
              maxLength={6}
              autoComplete="new-password"
              required
              style={inputStyle}
            />

            <div style={{ height: 18 }} />
            <button type="submit" style={primaryButton}>
              Crear mi código
            </button>
          </form>

          <form onSubmit={handleRecover} style={cardStyle}>
            <h2 style={{ fontSize: 18, margin: "0 0 6px" }}>
              Ya tengo un código
            </h2>
            <p style={{ ...mutedText, marginBottom: 14 }}>
              Ingresa tu código para ver tus visitas, clics, descargas y
              ganancias.
            </p>
            <input
              value={recover}
              onChange={(event) => setRecover(event.target.value)}
              placeholder="Ej: ABC123XY"
              maxLength={12}
              required
              style={{ ...inputStyle, textTransform: "uppercase" }}
            />
            <div style={{ height: 10 }} />
            <input
              type="password"
              value={accessPin}
              onChange={(event) =>
                setAccessPin(event.target.value.replace(/\D/g, ""))
              }
              placeholder="PIN de 6 dígitos"
              inputMode="numeric"
              pattern="[0-9]{6}"
              minLength={6}
              maxLength={6}
              autoComplete="current-password"
              required
              style={inputStyle}
            />
            <div style={{ height: 12 }} />
            <button type="submit" style={secondaryButton}>
              Ver mi panel
            </button>
          </form>

          <div style={cardStyle}>
            <h2 style={{ fontSize: 18, margin: "0 0 10px" }}>¿Cómo funciona?</h2>
            <ol
              style={{
                margin: 0,
                paddingLeft: 20,
                color: "var(--text-muted)",
                fontSize: 14,
                lineHeight: 1.8,
              }}
            >
              <li>Creas tu código, tu PIN y recibes un link único.</li>
              <li>Lo compartes con tus amigos o en tus redes.</li>
              <li>Cada persona que entre con tu link queda registrada.</li>
              <li>Ganas por visita única, clic en anuncio y descarga.</li>
              <li>Solicitas tu pago cuando llegues al mínimo.</li>
            </ol>
          </div>
        </>
      )}

      {ownCode && payload && (
        <>
          <div style={cardStyle}>
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 4 }}>
              Panel de
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 2 }}>
              {payload.referrer.name || "Referidor"}
            </div>
            <div
              style={{
                display: "inline-block",
                padding: "4px 10px",
                borderRadius: 999,
                background: "rgba(250, 204, 21, 0.12)",
                color: "var(--accent)",
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: 1,
              }}
            >
              {payload.referrer.code}
            </div>
          </div>

          <div style={cardStyle}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 800,
                color: "var(--text-muted)",
                letterSpacing: 1,
                marginBottom: 10,
              }}
            >
              TU LINK DE REFERIDO
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <input
                readOnly
                value={referralLink}
                onFocus={(event) => event.currentTarget.select()}
                style={{ ...inputStyle, flex: "1 1 240px", minWidth: 0 }}
              />
              <button
                type="button"
                onClick={handleCopy}
                style={{ ...primaryButton, width: "auto", padding: "12px 20px" }}
              >
                {copied ? "¡Copiado!" : "Copiar link"}
              </button>
            </div>
            <p style={{ ...mutedText, fontSize: 12, marginTop: 10 }}>
              Compártelo en WhatsApp, Telegram, TikTok o donde quieras.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <Stat icon="👥" label="Visitas únicas" value={payload.stats.visits} />
            <Stat icon="🖱️" label="Clics en anuncios" value={payload.stats.adClicks} />
            <Stat icon="⬇️" label="Descargas" value={payload.stats.downloads} />
            <Stat
              icon="💰"
              label="Total ganado"
              value={centsToUsd(payload.stats.earningsCents)}
              accent
            />
            <Stat
              icon="✅"
              label="Disponible para retirar"
              value={centsToUsd(payload.stats.availableCents)}
              accent
            />
          </div>

          <div style={cardStyle}>
            <h2 style={{ fontSize: 18, margin: "0 0 10px" }}>Tus tarifas</h2>
            <div style={{ display: "grid", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 14 }}>
                <span style={{ color: "var(--text-muted)" }}>Visita única</span>
                <strong>{centsToUsd(payload.rates.visitCents)}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 14 }}>
                <span style={{ color: "var(--text-muted)" }}>
                  Clic en anuncio (máx. 3 por persona/día)
                </span>
                <strong>{centsToUsd(payload.rates.adClickCents)}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 14 }}>
                <span style={{ color: "var(--text-muted)" }}>Descarga verificada</span>
                <strong>{centsToUsd(payload.rates.downloadCents)}</strong>
              </div>
            </div>
            <p style={{ ...mutedText, fontSize: 12, marginTop: 12 }}>
              Pago mínimo: {centsToUsd(payload.minPayoutCents)}. Las solicitudes
              se revisan manualmente antes de pagar.
            </p>
          </div>

          {payload.stats.pendingCents > 0 ? (
            <div style={{ ...cardStyle, borderColor: "rgba(250, 204, 21, 0.35)" }}>
              <h2 style={{ fontSize: 18, margin: "0 0 6px" }}>Pago pendiente</h2>
              <p style={{ ...mutedText, margin: 0 }}>
                Tienes una solicitud por {centsToUsd(payload.stats.pendingCents)} en
                revisión. Te contactaremos para enviarte el pago.
              </p>
            </div>
          ) : payload.stats.availableCents >= payload.minPayoutCents ? (
            <form onSubmit={handlePayout} style={cardStyle}>
              <h2 style={{ fontSize: 18, margin: "0 0 6px" }}>
                Solicitar pago
              </h2>
              <p style={{ ...mutedText, marginBottom: 4 }}>
                Puedes retirar {centsToUsd(payload.stats.availableCents)}. Te
                contactaremos para coordinar el pago.
              </p>

              <label htmlFor="payout-method" style={labelStyle}>
                Método de pago
              </label>
              <input
                id="payout-method"
                value={payoutMethod}
                onChange={(event) => setPayoutMethod(event.target.value)}
                placeholder="Ej: PayPal, Binance, transferencia"
                maxLength={40}
                required
                style={inputStyle}
              />

              <label htmlFor="payout-contact" style={labelStyle}>
                Contacto / cuenta de pago
              </label>
              <input
                id="payout-contact"
                value={payoutContact}
                onChange={(event) => setPayoutContact(event.target.value)}
                placeholder="Ej: correo de PayPal o wallet"
                maxLength={120}
                required
                style={inputStyle}
              />

              {payoutMessage && (
                <p style={{ color: "#22c55e", fontSize: 13, marginTop: 12 }}>
                  {payoutMessage}
                </p>
              )}
              {payoutError && (
                <p style={{ color: "#fca5a5", fontSize: 13, marginTop: 12 }}>
                  {payoutError}
                </p>
              )}

              <div style={{ height: 16 }} />
              <button type="submit" style={primaryButton} disabled={payoutLoading}>
                {payoutLoading ? "Enviando..." : "Solicitar pago"}
              </button>
            </form>
          ) : (
            <div style={cardStyle}>
              <h2 style={{ fontSize: 18, margin: "0 0 6px" }}>
                Aún no puedes retirar
              </h2>
              <p style={{ ...mutedText, marginBottom: 12 }}>
                Necesitas al menos {centsToUsd(payload.minPayoutCents)}. Te faltan{" "}
                {centsToUsd(
                  Math.max(0, payload.minPayoutCents - payload.stats.availableCents)
                )}
                .
              </p>
              <div
                style={{
                  height: 10,
                  borderRadius: 999,
                  background: "var(--border-color)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${Math.min(
                      100,
                      (payload.stats.availableCents / payload.minPayoutCents) * 100
                    )}%`,
                    height: "100%",
                    borderRadius: 999,
                    background: "linear-gradient(90deg, #facc15, #f59e0b)",
                  }}
                />
              </div>
            </div>
          )}

          {payload.payouts.length > 0 && (
            <div style={cardStyle}>
              <h2 style={{ fontSize: 18, margin: "0 0 10px" }}>
                Historial de pagos
              </h2>
              <div style={{ display: "grid", gap: 10 }}>
                {payload.payouts.map((payout) => (
                  <div
                    key={payout.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                      padding: "10px 0",
                      borderBottom: "1px solid var(--border-color)",
                      fontSize: 13,
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700 }}>
                        {centsToUsd(payout.amount_cents)}
                      </div>
                      <div style={{ color: "var(--text-muted)", marginTop: 2 }}>
                        {formatDate(payout.requested_at)} · {payout.method || "Sin método"}
                      </div>
                    </div>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: 999,
                        fontSize: 11,
                        fontWeight: 800,
                        background:
                          payout.status === "paid"
                            ? "rgba(34, 197, 94, 0.12)"
                            : payout.status === "rejected"
                              ? "rgba(239, 68, 68, 0.12)"
                              : "rgba(250, 204, 21, 0.12)",
                        color:
                          payout.status === "paid"
                            ? "#22c55e"
                            : payout.status === "rejected"
                              ? "#fca5a5"
                              : "var(--accent)",
                      }}
                    >
                      {statusLabel(payout.status)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button type="button" onClick={handleChangeCode} style={secondaryButton}>
            Usar otro código
          </button>
        </>
      )}

      {ownCode && !payload && !loading && (
        <form onSubmit={handleAccess} style={cardStyle}>
          <h2 style={{ fontSize: 18, margin: "0 0 6px" }}>Ingresa tu PIN</h2>
          <p style={{ ...mutedText, marginBottom: 14 }}>
            El código <strong>{ownCode}</strong> está guardado en este
            dispositivo. Escribe tu PIN de 6 dígitos para entrar a tu panel.
          </p>
          <input
            type="password"
            value={accessPin}
            onChange={(event) =>
              setAccessPin(event.target.value.replace(/\D/g, ""))
            }
            placeholder="PIN de 6 dígitos"
            inputMode="numeric"
            pattern="[0-9]{6}"
            minLength={6}
            maxLength={6}
            autoComplete="current-password"
            required
            style={inputStyle}
          />
          <div style={{ height: 12 }} />
          <button type="submit" style={primaryButton}>
            Entrar a mi panel
          </button>
          <div style={{ height: 10 }} />
          <button type="button" onClick={handleChangeCode} style={secondaryButton}>
            Usar otro código
          </button>
        </form>
      )}
    </div>
  );
}
