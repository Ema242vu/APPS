import type { Metadata } from "next";
import EscanerClient from "@/components/EscanerClient";

export const metadata: Metadata = {
  title: "Escáner de APKs",
  description:
    "Pega el enlace de descarga de un APK y averigua con VirusTotal si tiene virus o si son falsos positivos.",
  alternates: { canonical: "/escaner" },
};

export default function Escaner() {
  return <EscanerClient />;
}
