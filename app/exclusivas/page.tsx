import type { Metadata } from "next";
import ExclusivasClient from "@/components/ExclusivasClient";

export const metadata: Metadata = {
  title: "Apps Exclusivas VIP",
  description:
    "Zona VIP: apps creadas por nosotros, sin anuncios internos. Desbloquea el acceso apoyando con anuncios.",
  alternates: { canonical: "/exclusivas" },
};

export default function Exclusivas() {
  return <ExclusivasClient />;
}
