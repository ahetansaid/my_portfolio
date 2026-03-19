import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const { id } = await params;
  const { year, title, description, sortOrder } = await request.json();

  const item = await prisma.timelineItem.update({
    where: { id: Number(id) },
    data: { year, title, description, sortOrder: sortOrder ?? 0 },
  });
  return NextResponse.json(item);
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const { id } = await params;
  await prisma.timelineItem.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
