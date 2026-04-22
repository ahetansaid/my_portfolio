import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const data: { isRead?: boolean } = {};
  if (typeof body.isRead === "boolean") data.isRead = body.isRead;

  const updated = await prisma.contactMessage.update({
    where: { id: Number(id) },
    data,
  });
  return NextResponse.json(updated);
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const { id } = await params;
  await prisma.contactMessage.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
