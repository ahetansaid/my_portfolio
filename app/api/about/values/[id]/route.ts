import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const { id } = await params;
  const { title, description, sortOrder } = await request.json();

  const value = await prisma.aboutValue.update({
    where: { id: Number(id) },
    data: { title, description, sortOrder: sortOrder ?? 0 },
  });
  return NextResponse.json(value);
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const { id } = await params;
  await prisma.aboutValue.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
