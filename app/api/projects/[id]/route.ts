import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_: NextRequest, { params }: Params) {
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id: Number(id) },
    include: {
      technologies: { include: { technology: true } },
      socialLinks: { orderBy: { sortOrder: "asc" } },
    },
  });
  if (!project) return NextResponse.json({ error: "Introuvable." }, { status: 404 });
  return NextResponse.json(project);
}

export async function PUT(request: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const {
    name,
    slug,
    tagline,
    problem,
    solution,
    results,
    caseStudyMd,
    imageUrl,
    architectureUrl,
    demoUrl,
    prodUrl,
    repoUrl,
    impactMetrics,
    sortOrder,
    isFeatured,
    isPublished,
    technologyIds,
  } = body;

  await prisma.projectTechnology.deleteMany({ where: { projectId: Number(id) } });

  const project = await prisma.project.update({
    where: { id: Number(id) },
    data: {
      name,
      slug,
      tagline: tagline ?? null,
      problem: problem ?? null,
      solution: solution ?? null,
      results: results ?? null,
      caseStudyMd: caseStudyMd ?? null,
      imageUrl: imageUrl ?? null,
      architectureUrl: architectureUrl ?? null,
      demoUrl: demoUrl ?? null,
      prodUrl: prodUrl ?? null,
      repoUrl: repoUrl ?? null,
      impactMetrics: impactMetrics ?? undefined,
      sortOrder: sortOrder ?? 0,
      isFeatured: isFeatured ?? false,
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
