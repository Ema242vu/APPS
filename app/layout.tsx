import type { Metadata, Viewport } from "next";
import "./globals.css";
import Script from "next/script";
import AdBlockBlocker from "@/components/AdBlockBlocker";

export const metadata: Metadata = {
  metadataBase: new URL("https://apps-peach-two.vercel.app"),
  title: {
    default: "PERSONS-COMUNITY | Apps Premium y Juegos Mod Gratis para Android",
    template: "%s | PERSONS-COMUNITY",
  },
  description: "Descarga gratis las mejores apps premium y juegos mod para Android. CapCut, Spotify, Netflix, Free Fire, Minecraft y más. Última versión, sin anuncios, todo desbloqueado.",
  keywords: [
    "apps premium gratis",
    "juegos mod apk",
    "apk premium",
    "descargar apps mod",
    "juegos hackeados android",
    "apk sin anuncios",
    "capcut premium",
    "spotify premium gratis",
    "netflix mod apk",
    "minecraft mod apk",
    "free fire mod",
    "PERSONS-COMUNITY",
    "personas community",
    "apk mod 2026",
    "descargar apk",
    "apks premium",
  ],
  authors: [{ name: "PERSONS-COMUNITY" }],
  creator: "PERSONS-COMUNITY",
  publisher: "PERSONS-COMUNITY",
  manifest: "/manifest.json",
  verification: {
    google: "HQZMfoyoknT16-KfNb7dod3ZhXSqbREY6_elZCzsgvA",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PERSONS-COMUNITY",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://apps-peach-two.vercel.app",
    siteName: "PERSONS-COMUNITY",
    title: "PERSONS-COMUNITY | Apps Premium y Juegos Mod Gratis",
    description: "Descarga gratis apps premium y juegos mod para Android. Última versión, sin anuncios y 100% funcionales.",
  },
  twitter: {
    card: "summary_large_image",
    title: "PERSONS-COMUNITY | Apps Premium y Juegos Mod",
    description: "Descarga gratis apps premium y juegos mod para Android.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
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
        <meta name="google-site-verification" content="HQZMfoyoknT16-KfNb7dod3ZhXSqbREY6_elZCzsgvA" />
        <link rel="canonical" href="https://apps-peach-two.vercel.app" />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "PERSONS-COMUNITY",
              url: "https://apps-peach-two.vercel.app",
              description: "Descarga gratis apps premium y juegos mod para Android.",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://apps-peach-two.vercel.app/?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />

        {/* Monetag */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(s){s.dataset.zone='11940277',s.src='https://al5sm.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`,
          }}
        />
        <script data-cfasync="false" src="https://bellnewyork.org/14/cfed6f54b73385057c4c709b0d06da79" />
        <script async data-cfasync="false" src="https://bellnewyork.org/21/885a3a3a0173836d790936818ab5a034" />

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
