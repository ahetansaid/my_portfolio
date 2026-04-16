import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  let status = await prisma.availabilityStatus.findFirst({ orderBy: { id: "asc" } });
  if (!status) {
    status = await prisma.availabilityStatus.create({
      data: { status: "available", message: "Disponible pour une nouvelle mission" },
    });
  }
  return NextResponse.json(status);
}

export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const body = await request.json();
  const existing = await prisma.availabilityStatus.findFirst({ orderBy: { id: "asc" } });

  const data = {
    status: body.status,
    message: body.message ?? null,
    nextAvailableDate: body.nextAvailableDate ? new Date(body.nextAvailableDate) : null,
  };

  const updated = existing
    ? await prisma.availabilityStatus.update({ where: { id: existing.id }, data })
    : await prisma.availabilityStatus.create({ data });

  return NextResponse.json(updated);
}
