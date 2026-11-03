# Referidos con Supabase

Supabase tiene plan gratuito y **no pide tarjeta**. El panel está en
`/referidos`.

## 1. Crear el proyecto

1. Entra a https://supabase.com y crea una cuenta.
2. Pulsa **New project** y elige el plan **Free**.
3. Espera a que termine de crearse.

## 2. Crear las tablas

1. Abre **SQL Editor**.
2. Copia todo el contenido de `supabase/referrals.sql`.
3. Pégalo y pulsa **Run**.

Se crean estas tablas:

- `referrers`
- `referral_visits`
- `referral_events`
- `referral_payouts`

Las tablas tienen RLS activado y no tienen políticas públicas. Solo la API del
sitio, usando la `service_role` key, puede leer y escribir.

## 3. Copiar las claves

En Supabase ve a **Project Settings → API**:

| Dato de Supabase | Variable de Vercel |
| --- | --- |
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` |
| Publishable key | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` |
| Secret / service_role key | `SUPABASE_SERVICE_ROLE_KEY` |

La `service_role` key es secreta. No la pongas en componentes `"use client"` ni
la subas al repositorio.

## 4. Variables en Vercel

En **Settings → Environment Variables** agrega:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=tu_publishable_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
```

Opcionales:

```env
REFERRAL_IP_SALT=una-cadena-larga-y-aleatoria
NEXT_PUBLIC_SITE_URL=https://apps-peach-two.vercel.app
```

Guarda y pulsa **Redeploy**.

## 5. Probar

1. Abre `/referidos`.
2. Crea tu código y copia el link.
3. Abre el link en una ventana de incógnito.
4. Haz clic en un anuncio y completa una descarga.
5. Vuelve a `/referidos`, entra con tu código y PIN.
6. Revisa visitas, clics, descargas y saldo.

## 6. Pagar a un referidor

Las solicitudes quedan en la tabla `referral_payouts` con estado `pending`.

En Supabase puedes abrir **Table Editor → referral_payouts** y cambiar:

- `status` → `paid`
- `paid_at` → la fecha del pago

O usar SQL:

```sql
update public.referral_payouts
set status = 'paid', paid_at = now()
where id = 123;
```

Si rechazas una solicitud:

```sql
update public.referral_payouts
set status = 'rejected'
where id = 123;
```

El saldo disponible se calcula así:

```text
ganado - pagos pagados - pagos pendientes
```

## 7. PIN y límites

- El PIN de 6 dígitos se guarda hasheado con `scrypt`.
- Después de 5 intentos fallidos, la cuenta se bloquea 15 minutos.
- El PIN se guarda en `sessionStorage`, así que se borra al cerrar la pestaña.
- Visita única por referidor y visitante.
- Máximo 3 clics por visitante y día.
- Descarga única por app y visitante.
- Límites por IP: 100 visitas, 300 eventos y 3 registros cada 24 horas.

## 8. Tarifas

Edita `lib/referrals/config.ts`:

```ts
export const REFERRAL_RATES = {
  visitCents: 1, // $0.01 por visita única
  adClickCents: 5, // $0.05 por clic en anuncio
  downloadCents: 10, // $0.10 por descarga
};

export const MIN_PAYOUT_CENTS = 500; // $5.00 mínimo
```

Los valores están en centavos.

## 9. Limitaciones

- El pago es manual; no hay pasarela automática.
- La descarga se cuenta al pulsar el botón final, no al confirmar una instalación.
- Un usuario puede borrar `localStorage` y aparecer como visitante nuevo. Los
  límites por IP y la revisión manual reducen el abuso, pero no lo eliminan.
- Pagar por clics en anuncios puede violar los términos de Monetag/Adsterra. Si
  te preocupa, pon `adClickCents: 0`.
