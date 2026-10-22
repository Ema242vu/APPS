import type { Metadata } from "next";
import FaqAccordion from "@/components/FaqAccordion";

export const metadata: Metadata = {
  title: "Preguntas Frecuentes",
  description:
    "¿Las apps son seguras? ¿Necesitas root? Antivirus, actualizaciones y pedidos: todas las dudas sobre apps premium y juegos mod resueltas.",
  alternates: { canonical: "/faq" },
};

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

/* Rich results de Google: acordeón visible en el buscador */
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function FAQ() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <FaqAccordion faqs={faqs} />
    </>
  );
}
