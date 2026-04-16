import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  let stats = await prisma.siteStats.findFirst({ orderBy: { id: "asc" } });
  if (!stats) {
    stats = await prisma.siteStats.create({
      data: { projectsShipped: 0, yearsExperience: 0, domainsCovered: 0, clientsServed: 0 },
    });
  }
  return NextResponse.json(stats);
}

export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const body = await request.json();
  const existing = await prisma.siteStats.findFirst({ orderBy: { id: "asc" } });

  const data = {
    projectsShipped: Number(body.projectsShipped) || 0,
    yearsExperience: Number(body.yearsExperience) || 0,
    domainsCovered: Number(body.domainsCovered) || 0,
    clientsServed: Number(body.clientsServed) || 0,
    currentlyBuilding: body.currentlyBuilding ?? null,
  };

  const updated = existing
    ? await prisma.siteStats.update({ where: { id: existing.id }, data })
    : await prisma.siteStats.create({ data });

  return NextResponse.json(updated);
}
