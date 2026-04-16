import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const services = await prisma.service.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(services);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const body = await request.json();
  const { title, slug, icon, description, priceRange, duration, deliverables, sortOrder, isPublished } = body;

  if (!title || !slug || !description) {
    return NextResponse.json({ error: "Titre, slug et description requis." }, { status: 400 });
  }

  const service = await prisma.service.create({
    data: {
      title,
      slug,
      icon: icon ?? null,
      description,
      priceRange: priceRange ?? null,
      duration: duration ?? null,
      deliverables: deliverables ?? undefined,
      sortOrder: sortOrder ?? 0,
      isPublished: isPublished ?? true,
    },
  });

  return NextResponse.json(service, { status: 201 });
}
