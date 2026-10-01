"use client";
import { useState } from "react";

const faqs = [
  { q: "¿Las apps son seguras?", a: "Sí. Todas las apps que compartimos son revisadas antes de publicarse. Aun así, siempre recomendamos tener un antivirus en el teléfono y revisar los permisos que pide cada app al instalarla." },
  { q: "¿Necesito root para instalar las apps?", a: "No, no necesitas root. Solo debes permitir la instalación desde fuentes desconocidas en los ajustes de tu teléfono." },
  { q: "¿Por qué mi antivirus me avisa?", a: "Es normal. Los antivirus detectan apps modificadas como 'potencialmente peligrosas' porque no vienen firmadas por el desarrollador original. Si descargaste desde nuestra tienda, puedes ignorar ese aviso." },
  { q: "¿Las apps se actualizan solas?", a: "No. Al ser versiones modificadas, debes actualizarlas manualmente descargando la nueva versión desde nuestra tienda cuando la publiquemos." },
  { q: "¿Qué hago si una app no se instala?", a: "Primero desinstala la versión original de Play Store. Si el error persiste, revisa que tengas espacio suficiente y que tu versión de Android sea compatible." },
  { q: "¿Puedo pedir una app específica?", a: "¡Claro! Únete a nuestro grupo de WhatsApp y pide la app que necesitas. Si es posible, la subimos." },
  { q: "¿Es gratis?", a: "Sí, todo el contenido es totalmente gratis. Solo pedimos que compartas la página con tus amigos para que más gente se beneficie." },
  { q: "¿Las apps tienen anuncios?", a: "La mayoría son versiones Premium sin anuncios. Algunas pueden mostrar anuncios, pero siempre tratamos de subir las mejores versiones disponibles." },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0d0d12', color: '#fff', fontFamily: 'system-ui, sans-serif', padding: '40px 20px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <a href="/" style={{ color: '#facc15', textDecoration: 'none', fontWeight: 'bold', display: 'inline-block', marginBottom: '30px' }}>← Volver a la tienda</a>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '10px' }}>❓ Preguntas Frecuentes</h1>
        <p style={{ color: '#9ca3af', marginBottom: '40px' }}>Resolvemos tus dudas más comunes.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {faqs.map((f, i) => (
            <div key={i} style={{ borderRadius: '14px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
              <button onClick={() => setOpen(open === i ? null : i)} style={{ width: '100%', padding: '20px', backgroundColor: 'transparent', border: 'none', color: '#fff', fontSize: '15px', fontWeight: 'bold', textAlign: 'left', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '15px' }}>
                <span>{f.q}</span>
                <span style={{ color: '#facc15', fontSize: '20px', transform: open === i ? 'rotate(45deg)' : 'rotate(0)', transition: 'transform 0.3s' }}>+</span>
              </button>
              {open === i && (
                <div style={{ padding: '0 20px 20px', color: '#d1d5db', fontSize: '14px', lineHeight: 1.7 }}>{f.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
