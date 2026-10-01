import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mi Store - Apps Premium",
  description: "Descarga las mejores apps premium gratis.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
