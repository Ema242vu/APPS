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
        {/* Adsterra - Bar Social */}
        <script
          data-cfasync="false"
          src="https://bellnewyork.org/14/cfed6f54b73385057c4c709b0d06da79"
        />
        {/* Adsterra - Native Banner */}
        <script
          async
          data-cfasync="false"
          src="https://bellnewyork.org/21/885a3a3a0173836d790936818ab5a034"
        />
      </head>
      <body>
        {children}
        <AdBlockNotice />
      </body>
    </html>
  );
}
