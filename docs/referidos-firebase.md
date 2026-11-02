# Sistema de referidos con Firebase

El panel está en `/referidos`. Los datos se guardan en **Cloud Firestore** y
solo se escriben desde las API routes del servidor con **Firebase Admin SDK**.
El navegador nunca escribe directo en la base.

> La configuración web de Firebase (`apiKey`, `authDomain`, `appId`, etc.) no
> alcanza para este sistema. Para escribir de forma segura desde el servidor
> hace falta una **cuenta de servicio** (Admin SDK). En Next.js las variables
> públicas usan el prefijo `NEXT_PUBLIC_`, no `VITE_`.

## 1. Activar Firestore

1. Entra a [Firebase Console](https://console.firebase.google.com/) y abre el
   proyecto `hacklingo-nova` (o el proyecto que quieras usar).
2. Ve a **Build → Firestore Database** y crea la base en **modo producción**.
3. Elige una ubicación cercana a tus usuarios.

## 2. Crear la cuenta de servicio

1. En Firebase Console abre **Project settings → Service accounts**.
2. Pulsa **Generate new private key** y descarga el JSON.
3. **No subas ese JSON al repositorio.** Contiene una clave privada.

Tienes dos formas de configurarlo:

### Opción A: una sola variable con el JSON

Copia el contenido completo del JSON en `FIREBASE_SERVICE_ACCOUNT`. En Vercel
debe quedar en una sola línea. Si tu proveedor no acepta el JSON multilínea,
puedes minificarlo con:

```bash
node -e "console.log(JSON.stringify(require('./serviceAccount.json')))"
```

### Opción B: variables separadas

```env
FIREBASE_PROJECT_ID=hacklingo-nova
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@hacklingo-nova.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTU_CLAVE_PRIVADA\n-----END PRIVATE KEY-----\n"
```

`FIREBASE_PRIVATE_KEY` debe conservar los saltos de línea. En Vercel puedes
pegarla con `\n` literales; el código los convierte a saltos reales.

## 3. Reglas de Firestore

Como todo pasa por el Admin SDK, bloquea el acceso directo desde el cliente.
En **Firestore → Rules**, publica:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

El Admin SDK omite estas reglas, así que la API del sitio sigue funcionando.

## 4. Variables de entorno

En Vercel → **Project → Settings → Environment Variables**, agrega:

| Variable | Uso | ¿Pública? |
| --- | --- | --- |
| `FIREBASE_SERVICE_ACCOUNT` | JSON completo de la cuenta de servicio | **No** |
| `FIREBASE_PROJECT_ID` | Alternativa a la variable anterior | No |
| `FIREBASE_CLIENT_EMAIL` | Alternativa a la variable anterior | No |
| `FIREBASE_PRIVATE_KEY` | Alternativa a la variable anterior | **No** |
| `REFERRAL_IP_SALT` | Sal para hashear IPs (opcional) | No |
| `NEXT_PUBLIC_SITE_URL` | Dominio para armar links (opcional) | Sí |

Usa **una** de las dos opciones: `FIREBASE_SERVICE_ACCOUNT` o las tres variables
separadas. Después de guardar, haz un redeploy.

Para desarrollo local, crea `.env.local` con las mismas variables. Hay una
plantilla en [`.env.example`](../.env.example).

## 5. Estructura en Firestore

| Ruta | Contenido |
| --- | --- |
| `referrers/{code}` | Datos del referidor, PIN hasheado, contadores y ganancias |
| `referrers/{code}/visits/{visitorId}` | Visitas únicas |
| `referrers/{code}/events/{eventId}` | Clics en anuncios y descargas |
| `referrers/{code}/payouts/{payoutId}` | Solicitudes de pago |
| `referralIpDaily/{ipHash_fecha}` | Límites anti-abuso por IP |
| `referralAdDaily/{code_visitorId_fecha}` | Límite de clics por visitante/día |

No necesitas crear las colecciones a mano: Firestore las crea al primer
documento.

## 6. Tarifas y límites

Edita `lib/referrals/config.ts`:

```ts
export const REFERRAL_RATES = {
  visitCents: 1, // $0.01 por visita única
  adClickCents: 5, // $0.05 por clic en anuncio
  downloadCents: 10, // $0.10 por descarga
};

export const MIN_PAYOUT_CENTS = 500; // $5.00 mínimo
```

Los valores están en centavos. También puedes ajustar:

- `MAX_AD_CLICKS_PER_DAY`: clics pagados por visitante y día.
- `MAX_VISITS_PER_IP_PER_DAY`: visitas por IP por día (UTC).
- `MAX_EVENTS_PER_IP_PER_DAY`: eventos por IP por día (UTC).
- `MAX_REGISTRATIONS_PER_IP_PER_DAY`: códigos creados por IP por día (UTC).

Las ganancias se acumulan en `earningsCents` al momento de cada evento. Si
cambias las tarifas después, lo ya ganado no se recalcula.

## 7. Pagar a un referidor

Las solicitudes quedan en `referrers/{code}/payouts` con estado `pending`.

1. Abre **Firestore Database** en Firebase Console.
2. Entra a `referrers → {code} → payouts`.
3. Revisa `amountCents`, `method` y `contact`.
4. Cuando hayas pagado, abre el documento y cambia:
   - `status` → `paid`
   - `paidAt` → la fecha y hora del pago (tipo timestamp)
5. Si rechazas la solicitud, cambia `status` → `rejected`.

El saldo disponible se calcula como:

```text
ganado - pagos pagados - pagos pendientes
```

No hace falta editar contadores del referidor: las estadísticas leen las
solicitudes de pago y suman los estados.

## 8. PIN de seguridad

Al crear el código, el usuario elige un PIN de 6 dígitos. Se guarda hasheado
con `scrypt` en `pinHash`; nunca en texto plano.

- El link público solo lleva el código: `/?ref=CODIGO`.
- Para ver estadísticas o pedir un pago se necesita el código **y** el PIN.
- Después de 5 intentos fallidos, la cuenta se bloquea 15 minutos.
- El PIN se guarda en `sessionStorage`, así que se borra al cerrar la pestaña.
  Si se pierde, no hay recuperación automática: el usuario tendría que crear
  otro código.

## 9. Cómo se cuentan los eventos

- **Visita única:** una por combinación de referidor + visitante. El visitante
  se identifica con un ID guardado en `localStorage`.
- **Clic en anuncio:** se cuenta al tocar los botones de Monetag y los enlaces
  de anuncios del sitio. Máximo 3 clics por visitante y por día.
- **Descarga:** se cuenta al tocar el botón final de descarga del flujo
  `/dl/[slug]`. Solo una vez por app y visitante.
- Los eventos solo cuentan si el visitante llegó antes con `?ref=CODIGO`.
- Límite anti-abuso: 100 visitas y 300 eventos por IP por día (UTC).
- Se bloquea el auto-referido comparando el código guardado en el navegador.

## 10. Probar el flujo

1. Configura `.env.local` y ejecuta `npm run dev`.
2. Abre `/referidos`, crea un código y copia el link.
3. Abre el link en una ventana de incógnito.
4. Entra a una app, pulsa un anuncio y completa una descarga.
5. Vuelve a `/referidos`, introduce el código y el PIN.
6. Verifica visitas, clics, descargas y saldo.
7. Con saldo suficiente, solicita un pago y revísalo en Firestore.

## 11. Limitaciones

- El pago es manual; no hay pasarela automática.
- Un usuario puede borrar `localStorage` y aparecer como visitante nuevo. Los
  límites por IP y la revisión manual reducen el abuso, pero no lo eliminan.
- La descarga se cuenta cuando se pulsa el botón final, no cuando se confirma
  una instalación real.
- Pagar por clics en anuncios puede violar los términos de Monetag/Adsterra. Si
  te preocupa, pon `adClickCents: 0` y paga solo por visitas o descargas.
- Para producción seria conviene agregar autenticación real, verificación de
  descargas y límites más estrictos.

## 12. Problemas comunes

**La API responde 503 “Falta configurar Firebase”.**
Revisa que exista `FIREBASE_SERVICE_ACCOUNT` o las tres variables separadas, y
que hayas hecho redeploy después de guardarlas.

**`FIREBASE_SERVICE_ACCOUNT no es un JSON válido`.**
El valor debe ser el JSON completo en una sola línea. Escapa las comillas si lo
pegas en una terminal.

**`No se pudo inicializar Firebase. Revisa ...`.**
La clave privada está mal copiada. Debe incluir `BEGIN PRIVATE KEY` y
`END PRIVATE KEY`, con los saltos de línea correctos.

**Firestore devuelve “Missing or insufficient permissions”.**
Estás intentando usar el SDK web directamente. Este sistema solo usa el Admin
SDK; las reglas deben denegar el acceso del cliente.

**El build falla al empaquetar `firebase-admin`.**
`next.config.ts` ya incluye `serverExternalPackages: ["firebase-admin"]`. Si
agregas otra librería nativa, añádela a esa lista.
