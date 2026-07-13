import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { rescoreUnscored } from "@/lib/radar/rescore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const url = new URL(request.url);
  const limit = Number(url.searchParams.get("limit")) || 20;

  try {
    const res = await rescoreUnscored({ limit });
    return NextResponse.json({ ok: true, ...res });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erreur inconnue";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
