# Sistema de referidos

Este módulo guarda los referidos en Supabase. Sin Supabase configurado, el
panel de `/referidos` muestra un error de conexión.

## 1. Crear el proyecto en Supabase

1. Entra a https://supabase.com y crea un proyecto gratuito.
2. Abre **SQL Editor** y pega el contenido de `supabase/referrals.sql`.
3. Ejecuta el SQL. Deben crearse estas tablas:
   - `referrers`
   - `referral_visits`
   - `referral_events`
   - `referral_payouts`

Las tablas tienen RLS activado y **no** tienen políticas públicas. Solo la API
del sitio (con la service role key) puede leer y escribir.

## 2. Variables de entorno

En Vercel → Project → Settings → Environment Variables, agrega:

| Variable | Dónde se usa | ¿Pública? |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Cliente y servidor | Sí |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Cliente Supabase existente | Sí |
| `SUPABASE_SERVICE_ROLE_KEY` | API de referidos | **No. Nunca la expongas.** |
| `REFERRAL_IP_SALT` | Hash de IP anti-spam (opcional) | No |
| `NEXT_PUBLIC_SITE_URL` | Dominio para armar links (opcional) | Sí |

La URL y la publishable key están en **Project Settings → API**.
La `service_role` key también está ahí, pero es secreta: úsala solo en el
servidor. No la pongas en componentes `"use client"`.

Después de guardar las variables, haz un redeploy.

## 3. Ajustar las tarifas

Edita `lib/referrals/config.ts`:

```ts
export const REFERRAL_RATES = {
  visitCents: 1, // $0.01 por visita única
  adClickCents: 5, // $0.05 por clic en anuncio
  downloadCents: 10, // $0.10 por descarga
};
export const MIN_PAYOUT_CENTS = 500; // $5.00 mínimo
```

Los valores están en centavos. Cámbialos según tu presupuesto.

## 4. Pagar a un referidor

Las solicitudes quedan en `referral_payouts` con estado `pending`. Para verlas
con el nombre del referidor:

```sql
select
  p.id,
  p.referrer_code,
  r.name,
  p.amount_cents,
  p.method,
  p.contact,
  p.status,
  p.requested_at
from public.referral_payouts p
join public.referrers r on r.code = p.referrer_code
order by p.requested_at desc;
```

Cuando ya hayas pagado por PayPal, Binance o transferencia, marca la solicitud
como pagada:

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

El saldo disponible se calcula como:

```
ganado - pagos pagados - pagos pendientes
```

## 5. PIN de seguridad

Al crear el código, el usuario elige un PIN de 6 dígitos. Se guarda hasheado
con `scrypt` en `referrers.pin_hash`; nunca se guarda en texto plano.

- El link público solo lleva el código: `/?ref=CODIGO`.
- Para ver estadísticas o pedir un pago se necesita el código **y** el PIN.
- Después de 5 intentos fallidos, la cuenta se bloquea 15 minutos
  (`failed_attempts` y `locked_until`).
- El PIN se guarda en `sessionStorage` del navegador, así que se borra al
  cerrar la pestaña. Si se pierde, no hay recuperación automática: el usuario
  tendría que crear otro código.

## 6. Cómo se cuentan los eventos

- **Visita única:** una por combinación de referidor + visitante. El visitante
  se identifica con un ID guardado en `localStorage`.
- **Clic en anuncio:** se cuenta al tocar los botones de Monetag y los enlaces
  de anuncios del sitio. Máximo 3 clics por visitante y por día.
- **Descarga:** se cuenta al tocar el botón final de descarga del flujo
  `/dl/[slug]`. Solo una vez por app y visitante.
- Los eventos solo cuentan si el visitante llegó antes con `?ref=CODIGO`.
- Límite anti-abuso: 100 visitas y 300 eventos por IP cada 24 horas.

## 7. Limitaciones importantes

- El pago es manual. No hay pasarela de pago automática.
- Un usuario puede borrar `localStorage` y aparecer como visitante nuevo. El
  límite por IP y la revisión manual reducen el abuso, pero no lo eliminan.
- Los anuncios no informan el ingreso exacto por clic. Las tarifas son fijas y
  las defines tú, no son una repartición automática de lo que paga la red de
  anuncios.
- Para producción seria conviene agregar autenticación, verificación de
  descargas reales y límites más estrictos.
