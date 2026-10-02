import { NextRequest, NextResponse } from "next/server";

const VT_API_KEY = process.env.VIRUSTOTAL_API_KEY;
const VT_BASE = "https://www.virustotal.com/api/v3";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No se envió ningún archivo." }, { status: 400 });
    }

    // Subir a VirusTotal
    const uploadForm = new FormData();
    uploadForm.append("file", file);

    const uploadRes = await fetch(`${VT_BASE}/files`, {
      method: "POST",
      headers: {
        "x-apikey": VT_API_KEY!,
      },
      body: uploadForm,
    });

    if (!uploadRes.ok) {
      const errData = await uploadRes.json();
      return NextResponse.json(
        { error: errData.error?.message || "Error al subir el archivo a VirusTotal." },
        { status: uploadRes.status }
      );
    }

    const uploadData = await uploadRes.json();
    return NextResponse.json(uploadData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Falta el ID del análisis." }, { status: 400 });
    }

    const reportRes = await fetch(`${VT_BASE}/analyses/${id}`, {
      headers: {
        "x-apikey": VT_API_KEY!,
      },
    });

    if (!reportRes.ok) {
      if (reportRes.status === 404) {
        return NextResponse.json({ pending: true }, { status: 404 });
      }
      return NextResponse.json({ error: "Error al obtener el reporte." }, { status: reportRes.status });
    }

    const reportData = await reportRes.json();
    const stats = reportData.data.attributes.stats;
    const results = reportData.data.attributes.results;

    // Formatear para el frontend
    const scans = Object.entries(results).map(([engine, data]: [string, any]) => ({
      engine,
      detected: data.category === "malicious" || data.category === "suspicious",
      result: data.result,
    }));

    return NextResponse.json({
      positives: stats.malicious + stats.suspicious,
      total: stats.malicious + stats.suspicious + stats.harmless + stats.undetected,
      scans,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
