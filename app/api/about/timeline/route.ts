import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const items = await prisma.timelineItem.findMany({
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
  });
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const { year, title, description, sortOrder } = await request.json();
  if (!year || !title || !description) {
    return NextResponse.json({ error: "Année, titre et description requis." }, { status: 400 });
  }

  const item = await prisma.timelineItem.create({
    data: { year, title, description, sortOrder: sortOrder ?? 0 },
  });
  return NextResponse.json(item, { status: 201 });
}
