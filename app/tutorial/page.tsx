export default function Tutorial() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0d0d12', color: '#ffffff', fontFamily: 'system-ui, sans-serif', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ maxWidth: '600px', width: '100%' }}>
        <a href="/" style={{ color: '#facc15', textDecoration: 'none', fontWeight: 'bold', display: 'inline-block', marginBottom: '30px' }}>← Volver a la tienda</a>

        <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '10px' }}>📖 Tutorial de Instalación</h1>
        <p style={{ color: '#9ca3af', marginBottom: '40px' }}>Aprende a instalar tus apps premium paso a paso.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>

          <div style={{ padding: '25px', borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '15px', color: '#facc15' }}>Paso 1: Descarga la app</h2>
            <p style={{ color: '#d1d5db', lineHeight: 1.7 }}>Entra a nuestra tienda, elige la app que quieras y toca el botón <b>"Descargar"</b>. Se abrirá una pestaña nueva con el archivo APK. Espera a que termine la descarga.</p>
          </div>

          <div style={{ padding: '25px', borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '15px', color: '#facc15' }}>Paso 2: Permite instalar apps desconocidas</h2>
            <p style={{ color: '#d1d5db', lineHeight: 1.7 }}>Anda a <b>Ajustes</b> → <b>Seguridad</b> → <b>Instalar apps desconocidas</b> y activa el permiso para tu navegador (Chrome, Firefox, etc.). Esto es necesario porque estas apps no están en Play Store.</p>
          </div>

          <div style={{ padding: '25px', borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '15px', color: '#facc15' }}>Paso 3: Abre el archivo APK</h2>
            <p style={{ color: '#d1d5db', lineHeight: 1.7 }}>Ve a tu gestor de archivos → carpeta <b>Descargas</b> → toca el archivo APK que acabas de descargar. Te aparecerá un aviso de seguridad, toca <b>"Instalar de todas formas"</b>.</p>
          </div>

          <div style={{ padding: '25px', borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '15px', color: '#facc15' }}>Paso 4: ¡Listo!</h2>
            <p style={{ color: '#d1d5db', lineHeight: 1.7 }}>Espera a que termine la instalación y abre la app. Disfruta de tu versión premium. 🎉</p>
          </div>

          <div style={{ padding: '25px', borderRadius: '16px', backgroundColor: 'rgba(250, 204, 21, 0.05)', border: '1px solid rgba(250, 204, 21, 0.3)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px', color: '#facc15' }}>⚠️ Consejos importantes</h2>
            <ul style={{ color: '#d1d5db', lineHeight: 1.9, paddingLeft: '20px' }}>
              <li>Antes de instalar una versión premium, <b>desinstala la versión original</b> de Play Store.</li>
              <li>Algunas apps pueden pedir permisos adicionales, léelos bien.</li>
              <li>Si la app no se instala, verifica que tengas espacio suficiente.</li>
              <li>Si tienes problemas, únete a nuestro grupo de WhatsApp para ayudarte.</li>
            </ul>
          </div>

        </div>

        <a href="https://chat.whatsapp.com/HoM5JTuNl16BBhFSp1YBkm" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '30px', padding: '18px', backgroundColor: '#25D366', color: '#ffffff', borderRadius: '14px', fontWeight: 'bold', textDecoration: 'none', fontSize: '16px' }}>
          💬 Necesito ayuda
        </a>
      </div>
    </div>
  )
}
