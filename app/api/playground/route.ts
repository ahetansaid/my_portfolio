import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const all = searchParams.get("all") === "1";
  const session = all ? await getSession() : null;

  const items = await prisma.playgroundItem.findMany({
    where: all && session ? {} : { isPublished: true },
    orderBy: [{ sortOrder: "asc" }, { id: "desc" }],
  });
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const body = await request.json();
  const { title, slug, emoji, description, imageUrl, demoUrl, repoUrl, tags, sortOrder, isPublished } = body;

  if (!title || !slug || !description) {
    return NextResponse.json({ error: "Titre, slug et description requis." }, { status: 400 });
  }

  const item = await prisma.playgroundItem.create({
    data: {
      title,
      slug,
      emoji: emoji ?? null,
      description,
      imageUrl: imageUrl ?? null,
      demoUrl: demoUrl ?? null,
      repoUrl: repoUrl ?? null,
      tags: tags ?? undefined,
      sortOrder: sortOrder ?? 0,
      isPublished: isPublished ?? true,
    },
  });

  return NextResponse.json(item, { status: 201 });
}
