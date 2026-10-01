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
      <head>
        {/* Script de Monetag */}
        <script 
          src="https://quge5.com/88/tag.min.js" 
          data-zone="289447" 
          async 
          data-cfasync="false"
        ></script>
      </head>
      <body>{children}</body>
    </html>
  );
}
