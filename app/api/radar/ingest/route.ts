import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { runIngest } from "@/lib/radar/ingest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Déclenche une passe d'ingestion réelle.
 * Autorisé si : header `x-radar-secret` == RADAR_CRON_SECRET (pour le cron externe),
 * OU session admin connectée (déclenchement manuel depuis le back-office).
 */
export async function POST(request: NextRequest) {
  const secret = process.env.RADAR_CRON_SECRET;
  const provided = request.headers.get("x-radar-secret");
  const authorizedByCron = Boolean(secret) && provided === secret;

  if (!authorizedByCron) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const url = new URL(request.url);
  const limit = Number(url.searchParams.get("limit")) || 8;

  try {
    const stats = await runIngest({ limitPerSource: limit });
    return NextResponse.json({ ok: true, ...stats });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erreur inconnue";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
