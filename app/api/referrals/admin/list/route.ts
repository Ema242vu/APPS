import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY || "cambia-esto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const token = request.headers.get("x-admin-token");
    const providedSecret = typeof body?.secret === "string" ? body.secret : "";

    if (providedSecret !== ADMIN_SECRET && token !== providedSecret) {
      return NextResponse.json({ error: "Token o secreto inválido" }, { status: 401 });
    }

    const supabase = createAdminClient();

    const { data: referrers, error: refError } = await supabase
      .from("referrers")
      .select("code, name, contact, payout_method, created_at")
      .order("created_at", { ascending: false });

    if (refError) throw refError;

    const results = await Promise.all(
      (referrers || []).map(async (r) => {
        const [{ count: visits }, { count: clicks }, { count: downloads }] =
          await Promise.all([
            supabase.from("referral_visits").select("*", { count: "exact" }).eq("referrer_code", r.code),
            supabase.from("referral_events").select("*", { count: "exact" }).eq("referrer_code", r.code).eq("event_type", "ad_click"),
            supabase.from("referral_events").select("*", { count: "exact" }).eq("referrer_code", r.code).eq("event_type", "download"),
          ]);

        const [{ data: paid }, { data: pending }] = await Promise.all([
          supabase.from("referral_payouts").select("*").eq("referrer_code", r.code).eq("status", "paid"),
          supabase.from("referral_payouts").select("*").eq("referrer_code", r.code).eq("status", "pending"),
        ]);

        const earnings = (visits || 0) * 1 + (clicks || 0) * 5 + (downloads || 0) * 10;
        const pagados = (paid || []).reduce((a, p) => a + (p.amount_cents || 0), 0);
        const pendientes = (pending || []).reduce((a, p) => a + (p.amount_cents || 0), 0);

        return {
          code: r.code,
          name: r.name,
          contact: r.contact,
          method: r.payout_method,
          createdAt: r.created_at,
          stats: {
            visits: visits || 0,
            adClicks: clicks || 0,
            downloads: downloads || 0,
            earnings,
            pagados,
            pendientes,
            disponible: Math.max(0, earnings - pagados - pendientes),
          },
        };
      })
    );

    const totales = results.reduce(
      (acc, r) => ({
        visitas: acc.visitas + r.stats.visits,
        clics: acc.clics + r.stats.adClicks,
        descargas: acc.descargas + r.stats.downloads,
        ganancia: acc.ganancia + r.stats.earnings,
        pagado: acc.pagado + r.stats.pagados,
        pendiente: acc.pendiente + r.stats.pendientes,
      }),
      { visitas: 0, clics: 0, descargas: 0, ganancia: 0, pagado: 0, pendiente: 0 }
    );

    return NextResponse.json({ totales, listado: results });
  } catch {
    return NextResponse.json({ error: "Error al obtener estadísticas" }, { status: 500 });
  }
}