import HomeStore from "@/components/HomeStore";
import type { Metadata } from "next";

/**
 * Portada como Server Component: el catálogo completo se prerenderiza en el
 * HTML (antes solo el "gate" era visible para Google). El gate ahora es una
 * capa de cliente por encima del contenido y solo se muestra una vez por sesión.
 */
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return <HomeStore />;
}
