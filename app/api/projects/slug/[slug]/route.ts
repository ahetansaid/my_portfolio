import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_: NextRequest, { params }: Params) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({
    where: { slug },
    include: {
      technologies: {
        include: { technology: true },
        orderBy: { technology: { sortOrder: "asc" } },
      },
      socialLinks: { orderBy: { sortOrder: "asc" } },
    },
  });
  if (!project || !project.isPublished) {
    return NextResponse.json({ error: "Introuvable." }, { status: 404 });
  }
  return NextResponse.json(project);
}
