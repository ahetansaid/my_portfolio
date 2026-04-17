import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const projects = await prisma.project.findMany({
    where: { isPublished: true },
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    include: {
      technologies: {
        include: { technology: true },
        orderBy: { technology: { sortOrder: "asc" } },
      },
      socialLinks: { orderBy: { sortOrder: "asc" } },
    },
  });

  const data = projects.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    tagline: p.tagline ?? "",
    problem: p.problem ?? "",
    solution: p.solution ?? "",
    results: p.results ?? "",
    caseStudyMd: p.caseStudyMd ?? "",
    imageUrl: p.imageUrl,
    architectureUrl: p.architectureUrl,
    demoUrl: p.demoUrl,
    prodUrl: p.prodUrl,
    repoUrl: p.repoUrl,
    impactMetrics: p.impactMetrics,
    sortOrder: p.sortOrder,
    isFeatured: p.isFeatured,
    isPublished: p.isPublished,
    technologies: p.technologies.map((pt) => ({
      id: pt.technology.id,
      name: pt.technology.name,
      slug: pt.technology.slug,
      category: pt.technology.category,
    })),
    socialLinks: p.socialLinks,
  }));

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const body = await request.json();
  const {
    name,
    slug,
    tagline,
    discoveryContext,
    problem,
    approach,
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

  if (!name || !slug) {
    return NextResponse.json({ error: "Nom et slug requis." }, { status: 400 });
  }

  const project = await prisma.project.create({
    data: {
      name,
      slug,
      tagline: tagline ?? null,
      discoveryContext: discoveryContext ?? null,
      problem: problem ?? null,
      approach: approach ?? null,
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
        create: (technologyIds ?? []).map((id: number) => ({ technologyId: id })),
      },
    },
    include: { technologies: { include: { technology: true } } },
  });

  return NextResponse.json(project, { status: 201 });
}
