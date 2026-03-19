import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const technologies = await prisma.technology.findMany({
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
  });
  return NextResponse.json(technologies);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const { name, slug, category, sortOrder } = await request.json();
  if (!name || !slug) {
    return NextResponse.json({ error: "Nom et slug requis." }, { status: 400 });
  }

  const tech = await prisma.technology.create({
    data: { name, slug, category: category ?? null, sortOrder: sortOrder ?? 0 },
  });
  return NextResponse.json(tech, { status: 201 });
}
