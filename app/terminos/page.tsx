export default function Terminos() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0d0d12', color: '#fff', fontFamily: 'system-ui, sans-serif', padding: '40px 20px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <a href="/" style={{ color: '#facc15', textDecoration: 'none', fontWeight: 'bold', display: 'inline-block', marginBottom: '30px' }}>← Volver a la tienda</a>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '10px' }}>📜 Términos y Condiciones</h1>
        <p style={{ color: '#9ca3af', marginBottom: '30px' }}>Última actualización: {new Date().toLocaleDateString()}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: '#d1d5db', lineHeight: 1.7, fontSize: '15px' }}>
          <p>Bienvenido a <b>Mi Store</b>. Al acceder y usar este sitio web, aceptas los siguientes términos y condiciones. Si no estás de acuerdo, por favor no uses el sitio.</p>

          <h2 style={{ fontSize: '20px', color: '#fff', marginTop: '15px' }}>1. Uso del sitio</h2>
          <p>Este sitio web ofrece enlaces de descarga de aplicaciones modificadas. Todo el contenido se proporciona "tal cual", sin garantías de ningún tipo. El uso de las apps descargadas es responsabilidad exclusiva del usuario.</p>

          <h2 style={{ fontSize: '20px', color: '#fff', marginTop: '15px' }}>2. Propiedad intelectual</h2>
          <p>Todas las aplicaciones mencionadas son propiedad de sus respectivos desarrolladores. Nosotros solo compartimos enlaces de versiones modificadas con fines de entretenimiento y prueba. Recomendamos comprar las versiones oficiales para apoyar a los desarrolladores.</p>

          <h2 style={{ fontSize: '20px', color: '#fff', marginTop: '15px' }}>3. Responsabilidad del usuario</h2>
          <p>El usuario es el único responsable del uso que le dé a las aplicaciones descargadas. No nos hacemos responsables de daños, pérdida de datos o cualquier problema derivado del uso de las apps.</p>

          <h2 style={{ fontSize: '20px', color: '#fff', marginTop: '15px' }}>4. Enlaces a terceros</h2>
          <p>Nuestro sitio contiene enlaces a servidores externos (MediaFire, AndroForever, GitHub, etc.). No controlamos esos sitios y no somos responsables de su contenido, políticas o disponibilidad.</p>

          <h2 style={{ fontSize: '20px', color: '#fff', marginTop: '15px' }}>5. Modificaciones</h2>
          <p>Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entran en vigencia al publicarse en esta página.</p>

          <h2 style={{ fontSize: '20px', color: '#fff', marginTop: '15px' }}>6. Contacto</h2>
          <p>Si tienes preguntas sobre estos términos, puedes contactarnos a través de nuestro grupo de WhatsApp.</p>

          <p style={{ marginTop: '20px', padding: '20px', borderRadius: '12px', backgroundColor: 'rgba(250, 204, 21, 0.05)', border: '1px solid rgba(250, 204, 21, 0.2)', color: '#facc15', fontSize: '13px' }}>
            ⚠️ Al continuar usando este sitio, confirmas que has leído y aceptado estos términos.
          </p>
        </div>
      </div>
    </div>
  );
}
