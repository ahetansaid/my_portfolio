import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { ProjectsSection } from "@/components/projects/ProjectsSection";
import type { Project, Technology } from "@/lib/types";

export const metadata: Metadata = {
  title: "Projets",
  description: "Projets réalisés : DGMS, ERP, intégration de systèmes.",
};

export const revalidate = 60;

async function getData(): Promise<{ projects: Project[]; technologies: Technology[] }> {
  try {
    const [dbProjects, dbTechs] = await Promise.all([
      prisma.project.findMany({
        where: { isPublished: true },
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        include: {
          technologies: {
            include: { technology: true },
            orderBy: { technology: { sortOrder: "asc" } },
          },
        },
      }),
      prisma.technology.findMany({
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
      }),
    ]);

    const projects: Project[] = dbProjects.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      problem: p.problem ?? "",
      solution: p.solution ?? "",
      results: p.results ?? "",
      imageUrl: p.imageUrl,
      technologies: p.technologies.map((pt) => ({
        id: pt.technology.id,
        name: pt.technology.name,
        slug: pt.technology.slug,
        category: pt.technology.category ?? undefined,
      })),
    }));

    const technologies: Technology[] = dbTechs.map((t) => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
      category: t.category ?? undefined,
    }));

    return { projects, technologies };
  } catch {
    return { projects: [], technologies: [] };
  }
}

export default async function ProjectsPage() {
  const { projects, technologies } = await getData();

  return (
    <div className="section-padding">
      <div className="container-tight">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl text-[hsl(var(--color-foreground))]">
          Projets
        </h1>
        <p className="mt-4 text-[hsl(var(--color-muted))] max-w-2xl">
          Filtrez par technologie et consultez le détail de chaque projet sur la même page.
        </p>
        <div className="mt-10">
          {projects.length === 0 ? (
            <p className="text-[hsl(var(--color-muted))]">
              Aucun projet publié pour le moment.
            </p>
          ) : (
            <ProjectsSection projects={projects} technologies={technologies} />
          )}
        </div>
      </div>
    </div>
  );
}
