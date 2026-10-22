import type { Metadata } from "next";
import CodigosList from "@/components/CodigosList";

export const metadata: Metadata = {
  title: "Códigos Premium Gratis",
  description:
    "Códigos exclusivos de Downloader para Xuper TV: toca cualquier código para copiarlo y actívalo gratis.",
  alternates: { canonical: "/codigos" },
};

export default function Codigos() {
  return <CodigosList />;
}
