import { NextResponse } from "next/server";
import { referralErrorResponse } from "@/lib/referrals/http";
import {
  hashIp,
  isValidCode,
  normalizeCode,
  recordEvent,
  recordVisit,
} from "@/lib/referrals/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EVENT_TYPES = new Set(["visit", "ad_click", "download"]);

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as
      | {
          code?: unknown;
          visitorId?: unknown;
          eventType?: unknown;
          appSlug?: unknown;
          path?: unknown;
        }
      | null;

    if (!body) {
      return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
    }

    const code = typeof body.code === "string" ? normalizeCode(body.code) : "";
    const visitorId =
      typeof body.visitorId === "string" ? body.visitorId.trim() : "";
    const eventType =
      typeof body.eventType === "string" ? body.eventType : "";
    const appSlug =
      typeof body.appSlug === "string" ? body.appSlug.trim() : null;
    const path = typeof body.path === "string" ? body.path.trim() : null;

    if (!isValidCode(code)) {
      return NextResponse.json({ error: "Código inválido." }, { status: 400 });
    }

    if (!/^[A-Za-z0-9_-]{8,64}$/.test(visitorId)) {
      return NextResponse.json({ error: "Visitante inválido." }, { status: 400 });
    }

    if (!EVENT_TYPES.has(eventType)) {
      return NextResponse.json({ error: "Evento inválido." }, { status: 400 });
    }

    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip =
      forwardedFor?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const ipHash = hashIp(ip);

    if (eventType === "visit") {
      const counted = await recordVisit(code, visitorId, ipHash, path);
      return NextResponse.json({ ok: true, counted });
    }

    if (eventType === "download" && (!appSlug || !/^[a-z0-9-]{1,80}$/.test(appSlug))) {
      return NextResponse.json({ error: "App inválida." }, { status: 400 });
    }

    const result = await recordEvent({
      code,
      visitorId,
      ipHash,
      eventType: eventType as "ad_click" | "download",
      appSlug,
    });

    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    return referralErrorResponse(error);
  }
}
