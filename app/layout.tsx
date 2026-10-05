import type { Metadata, Viewport } from "next";
import "./globals.css";
import Script from "next/script";
import AdBlockBlocker from "@/components/AdBlockBlocker";

export const metadata: Metadata = {
  title: "PERSONS oficial - Apps Premium",
  description: "Descarga las mejores apps premium y juegos para Android gratis.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PERSONS",
  },
  openGraph: {
    title: "PERSONS oficial",
    description: "Apps premium y juegos gratis para Android.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#facc15",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
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
        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5959908767381687"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <meta name="google-adsense-account" content="ca-pub-5959908767381687" />
        {/* PWA */}
        <link rel="apple-touch-icon" href="https://i.postimg.cc/QdBk2k5q/13.jpg" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function() {});
                });
              }
            `,
          }}
        />
      </head>
      <body>
        {children}
        <AdBlockBlocker />
      </body>
    </html>
  );
}
