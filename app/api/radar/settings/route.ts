import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WEIGHT_KEYS = [
  "smartPortsAlignment",
  "eligibility",
  "languageFeasibility",
  "timing",
  "strategicValue",
] as const;

const ENGLISH_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const profile = await prisma.radarProfile.findUnique({ where: { id: 1 } });
  if (!profile) return NextResponse.json({ profile: null });
  return NextResponse.json({
    profile: {
      profileText: profile.profileText,
      englishLevel: profile.englishLevel,
      weights: profile.weights,
      fitThreshold: profile.fitThreshold,
      digestDay: profile.digestDay,
      updatedAt: profile.updatedAt,
    },
  });
}

export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "JSON invalide." }, { status: 400 });

  const profileText = typeof body.profileText === "string" ? body.profileText.trim() : "";
  if (!profileText) return NextResponse.json({ error: "Le profil de scoring ne peut pas être vide." }, { status: 400 });

  const englishLevel = ENGLISH_LEVELS.includes(body.englishLevel) ? body.englishLevel : "A1";

  const weights: Record<string, number> = {};
  for (const key of WEIGHT_KEYS) {
    const v = Number(body.weights?.[key]);
    if (!Number.isFinite(v) || v < 0 || v > 100) {
      return NextResponse.json({ error: `Poids invalide pour « ${key} » (0-100).` }, { status: 400 });
    }
    weights[key] = Math.round(v);
  }

  const fitThreshold = Math.round(Number(body.fitThreshold));
  if (!Number.isFinite(fitThreshold) || fitThreshold < 0 || fitThreshold > 100) {
    return NextResponse.json({ error: "Seuil d'alerte invalide (0-100)." }, { status: 400 });
  }

  const digestDay = Math.round(Number(body.digestDay));
  if (!Number.isFinite(digestDay) || digestDay < 1 || digestDay > 7) {
    return NextResponse.json({ error: "Jour de digest invalide (1=lundi … 7=dimanche)." }, { status: 400 });
  }

  const profile = await prisma.radarProfile.upsert({
    where: { id: 1 },
    update: { profileText, englishLevel, weights, fitThreshold, digestDay },
    create: { id: 1, profileText, englishLevel, weights, fitThreshold, digestDay },
  });

  return NextResponse.json({ ok: true, profile });
}
