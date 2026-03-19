import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const categories = await prisma.skillCategory.findMany({
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    include: {
      items: { orderBy: [{ sortOrder: "asc" }, { id: "asc" }] },
    },
  });
  return NextResponse.json(categories);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const { name, icon, description, sortOrder } = await request.json();
  if (!name) return NextResponse.json({ error: "Nom requis." }, { status: 400 });

  const category = await prisma.skillCategory.create({
    data: { name, icon: icon ?? null, description: description ?? null, sortOrder: sortOrder ?? 0 },
    include: { items: true },
  });
  return NextResponse.json(category, { status: 201 });
}
