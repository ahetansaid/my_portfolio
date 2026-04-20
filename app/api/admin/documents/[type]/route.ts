import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

type Params = { params: Promise<{ type: string }> };

export async function DELETE(_: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { type } = await params;
  const existing = await prisma.document.findUnique({ where: { type } });
  if (!existing) {
    return NextResponse.json({ error: "Document introuvable." }, { status: 404 });
  }

  await prisma.document.delete({ where: { type } });
  return NextResponse.json({ ok: true });
}
