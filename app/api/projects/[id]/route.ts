import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_: NextRequest, { params }: Params) {
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id: Number(id) },
    include: { technologies: { include: { technology: true } } },
  });
  if (!project) return NextResponse.json({ error: "Introuvable." }, { status: 404 });
  return NextResponse.json(project);
}

export async function PUT(request: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const { name, slug, problem, solution, results, imageUrl, sortOrder, isPublished, technologyIds } = body;

  await prisma.projectTechnology.deleteMany({ where: { projectId: Number(id) } });

  const project = await prisma.project.update({
    where: { id: Number(id) },
    data: {
      name,
      slug,
      problem: problem ?? null,
      solution: solution ?? null,
      results: results ?? null,
      imageUrl: imageUrl ?? null,
      sortOrder: sortOrder ?? 0,
      isPublished: isPublished ?? true,
      technologies: {
        create: (technologyIds ?? []).map((tid: number) => ({ technologyId: tid })),
      },
    },
    include: { technologies: { include: { technology: true } } },
  });

  return NextResponse.json(project);
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const { id } = await params;
  await prisma.project.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
