import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const values = await prisma.aboutValue.findMany({
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
  });
  return NextResponse.json(values);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const { title, description, sortOrder } = await request.json();
  if (!title || !description) {
    return NextResponse.json({ error: "Titre et description requis." }, { status: 400 });
  }

  const value = await prisma.aboutValue.create({
    data: { title, description, sortOrder: sortOrder ?? 0 },
  });
  return NextResponse.json(value, { status: 201 });
}
