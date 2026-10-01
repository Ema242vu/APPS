import GoogleAdSense from 'next-google-adsense';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <GoogleAdSense pId="pub-5959908767381687" />
        {children}
      </body>
    </html>
  );
}
