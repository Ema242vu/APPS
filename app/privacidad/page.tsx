import Link from "next/link";

export const metadata = {
  title: "Política de Privacidad",
  description:
    "Política de privacidad de PERSONS-COMUNITY: cookies, anuncios (AdSense y terceros), datos de uso y contacto.",
};

export default function Privacidad() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-primary)",
        fontFamily: "system-ui, sans-serif",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <Link
          href="/"
          style={{
            color: "var(--accent)",
            textDecoration: "none",
            fontWeight: "bold",
            display: "inline-block",
            marginBottom: "30px",
          }}
        >
          ← Volver a la tienda
        </Link>
        <h1 style={{ fontSize: 36, fontWeight: "bold", marginBottom: 10, color: "var(--text-primary)" }}>
          🔒 Privacidad
        </h1>
        <p style={{ color: "var(--text-muted)", marginBottom: 30 }}>
          Esta política explica qué datos manejamos y cómo usamos las cookies y los anuncios.
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
            color: "var(--text-secondary)",
            lineHeight: 1.7,
            fontSize: 15,
          }}
        >
          <h2 style={{ fontSize: 20, color: "var(--text-primary)", marginTop: 15 }}>1. Datos que recogemos</h2>
          <p>
            <b>PERSONS-COMUNITY</b> no registra cuentas de usuario ni almacena datos personales en
            nuestros servidores. Tus preferencias (tema, favoritos, valoraciones, comentarios y
            descargas) se guardan <b>únicamente en tu dispositivo</b> mediante localStorage, y se
            borran si limpias los datos del navegador.
          </p>

          <h2 style={{ fontSize: 20, color: "var(--text-primary)", marginTop: 15 }}>2. Cookies y almacenamiento local</h2>
          <p>
            Esta web no usa cookies propias de seguimiento. Solo guardamos en tu navegador datos
            funcionales (tema elegido, aceptación del aviso de cookies) con las herramientas
            estándar del navegador.
          </p>

          <h2 style={{ fontSize: 20, color: "var(--text-primary)", marginTop: 15 }}>3. Anuncios de terceros</h2>
          <p>
            Usamos anuncios de <b>Google AdSense</b> y de redes de publicidad de terceros para
            mantener el sitio gratis. Estas redes pueden usar cookies y tecnologías similares para
            mostrar anuncios personalizados según tus visitas a este y otros sitios. Puedes
            desactivar los anuncios personalizados en los ajustes de tu cuenta de Google o
            visitando <i>aboutads.info</i> / <i>youronlinechoices</i>.
          </p>

          <h2 style={{ fontSize: 20, color: "var(--text-primary)", marginTop: 15 }}>4. Enlaces externos</h2>
          <p>
            Los enlaces de descarga y de comunidades (WhatsApp, Telegram, Instagram, Discord, y
            servidores externos como MediaFire) pertenecen a terceros. No controlamos sus
            contenidos ni sus políticas de privacidad, así que revisa las suyas antes de usarlos.
          </p>

          <h2 style={{ fontSize: 20, color: "var(--text-primary)", marginTop: 15 }}>5. Descargas</h2>
          <p>
            Las aplicaciones compartidas aquí son archivos modificados de terceros. No solicitamos
            permisos ni información del usuario para descargar. Instala bajo tu propia
            responsabilidad, como ya indican los Términos.
          </p>

          <h2 style={{ fontSize: 20, color: "var(--text-primary)", marginTop: 15 }}>6. Contacto</h2>
          <p>
            Si tienes dudas sobre privacidad o quieres pedir la eliminación de algún contenido,
            escríbenos por nuestro grupo de WhatsApp o Telegram (enlaces en la página principal).
          </p>

          <p
            style={{
              marginTop: 20,
              padding: 20,
              borderRadius: 12,
              backgroundColor: "rgba(250, 204, 21, 0.05)",
              border: "1px solid rgba(250, 204, 21, 0.2)",
              color: "var(--accent)",
              fontSize: 13,
            }}
          >
            🍪 Sigues navegando bajo tu propio criterio; nada de lo que ves aquí se envía a
            nuestros servidores.
          </p>
        </div>
      </div>
    </div>
  );
}
