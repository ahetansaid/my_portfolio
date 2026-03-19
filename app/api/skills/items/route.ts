import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const { name, categoryId, sortOrder } = await request.json();
  if (!name || !categoryId) {
    return NextResponse.json({ error: "Nom et catégorie requis." }, { status: 400 });
  }

  const item = await prisma.skillItem.create({
    data: { name, categoryId: Number(categoryId), sortOrder: sortOrder ?? 0 },
  });
  return NextResponse.json(item, { status: 201 });
}
