import type { Metadata } from "next";
import "./globals.css";
import AdBlockNotice from "@/components/AdBlockNotice";

export const metadata: Metadata = {
  title: "Mi Store - Apps Premium",
  description: "Descarga las mejores apps premium gratis. Escáner de APKs, blog y más.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" data-theme="dark" suppressHydrationWarning>
      <head>
        {/* Monetag */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(s){s.dataset.zone='11940277',s.src='https://al5sm.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`,
          }}
        />
      </head>
      <body>
        {children}
        <AdBlockNotice />
      </body>
    </html>
  );
}
