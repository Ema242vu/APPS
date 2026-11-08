import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    const chat = searchParams.get("chat");

    if (!token || !chat) {
      return NextResponse.json(
        { error: "Faltan parámetros token o chat" },
        { status: 400 }
      );
    }

    // Redirigir a la API del bot para verificar
    const botApiUrl = process.env.BOT_API_URL;
    if (!botApiUrl) {
      return NextResponse.json(
        { error: "Configuración del servidor incompleta" },
        { status: 500 }
      );
    }

    const res = await fetch(`${botApiUrl}/api/verificar?token=${token}&chat=${chat}`, {
      cache: "no-store",
    });

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error interno" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, chat } = body;

    if (!token || !chat) {
      return NextResponse.json(
        { error: "Faltan parámetros token o chat" },
        { status: 400 }
      );
    }

    const botApiUrl = process.env.BOT_API_URL;
    if (!botApiUrl) {
      return NextResponse.json(
        { error: "Configuración del servidor incompleta" },
        { status: 500 }
      );
    }

    const res = await fetch(`${botApiUrl}/api/generar-desde-link`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, chat }),
    });

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error interno" },
      { status: 500 }
    );
  }
}