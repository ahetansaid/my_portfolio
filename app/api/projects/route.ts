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
    },
  });

  const data = projects.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    problem: p.problem ?? "",
    solution: p.solution ?? "",
    results: p.results ?? "",
    imageUrl: p.imageUrl,
    sortOrder: p.sortOrder,
    isPublished: p.isPublished,
    technologies: p.technologies.map((pt) => ({
      id: pt.technology.id,
      name: pt.technology.name,
      slug: pt.technology.slug,
      category: pt.technology.category,
    })),
  }));

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const body = await request.json();
  const { name, slug, problem, solution, results, imageUrl, sortOrder, isPublished, technologyIds } = body;

  if (!name || !slug) {
    return NextResponse.json({ error: "Nom et slug requis." }, { status: 400 });
  }

  const project = await prisma.project.create({
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
        create: (technologyIds ?? []).map((id: number) => ({ technologyId: id })),
      },
    },
    include: { technologies: { include: { technology: true } } },
  });

  return NextResponse.json(project, { status: 201 });
}
