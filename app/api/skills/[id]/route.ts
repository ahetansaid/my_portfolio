import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const { id } = await params;
  const { name, icon, description, sortOrder } = await request.json();

  const category = await prisma.skillCategory.update({
    where: { id: Number(id) },
    data: { name, icon: icon ?? null, description: description ?? null, sortOrder: sortOrder ?? 0 },
    include: { items: { orderBy: [{ sortOrder: "asc" }, { id: "asc" }] } },
  });
  return NextResponse.json(category);
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const { id } = await params;
  await prisma.skillCategory.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
