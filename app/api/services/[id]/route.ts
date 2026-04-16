import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const { id } = await params;
  const body = await request.json();

  const service = await prisma.service.update({
    where: { id: Number(id) },
    data: {
      title: body.title,
      slug: body.slug,
      icon: body.icon ?? null,
      description: body.description,
      priceRange: body.priceRange ?? null,
      duration: body.duration ?? null,
      deliverables: body.deliverables ?? undefined,
      sortOrder: body.sortOrder ?? 0,
      isPublished: body.isPublished ?? true,
    },
  });

  return NextResponse.json(service);
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const { id } = await params;
  await prisma.service.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
