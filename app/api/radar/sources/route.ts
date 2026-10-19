import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { SOURCES } from "@/lib/radar/sources";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const rows = await prisma.opportunitySource.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { opportunities: true } } },
  });

  // Fusionne le registre de code (SOURCES) avec les lignes déjà synchronisées en base.
  const byName = new Map(rows.map((r) => [r.name, r]));
  const merged = SOURCES.map((src) => {
    const row = byName.get(src.name);
    byName.delete(src.name);
    return {
      name: src.name,
      type: src.type,
      url: src.url,
      id: row?.id ?? null,
      isActive: row?.isActive ?? true,
      lastStatus: row?.lastStatus ?? null,
      lastFetchedAt: row?.lastFetchedAt ?? null,
      opportunities: row?._count.opportunities ?? 0,
    };
  });
  // Sources présentes en base mais retirées du registre.
  for (const row of byName.values()) {
    merged.push({
      name: row.name,
      type: row.type,
      url: row.url,
      id: row.id,
      isActive: row.isActive,
      lastStatus: row.lastStatus,
      lastFetchedAt: row.lastFetchedAt,
      opportunities: row._count.opportunities,
    });
  }

  return NextResponse.json({ sources: merged });
}

export async function PATCH(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const body = await request.json().catch(() => null);
  const id = Number(body?.id);
  if (!Number.isInteger(id) || typeof body?.isActive !== "boolean") {
    return NextResponse.json({ error: "Paramètres invalides (id, isActive)." }, { status: 400 });
  }

  const source = await prisma.opportunitySource.findUnique({ where: { id } });
  if (!source) return NextResponse.json({ error: "Source introuvable." }, { status: 404 });

  const updated = await prisma.opportunitySource.update({
    where: { id },
    data: { isActive: body.isActive },
    select: { id: true, name: true, isActive: true },
  });
  return NextResponse.json({ ok: true, source: updated });
}
