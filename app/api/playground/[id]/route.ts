import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const { id } = await params;
  const body = await request.json();

  const item = await prisma.playgroundItem.update({
    where: { id: Number(id) },
    data: {
      title: body.title,
      slug: body.slug,
      emoji: body.emoji ?? null,
      description: body.description,
      imageUrl: body.imageUrl ?? null,
      demoUrl: body.demoUrl ?? null,
      repoUrl: body.repoUrl ?? null,
      tags: body.tags ?? undefined,
      sortOrder: body.sortOrder ?? 0,
      isPublished: body.isPublished ?? true,
    },
  });

  return NextResponse.json(item);
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const { id } = await params;
  await prisma.playgroundItem.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
