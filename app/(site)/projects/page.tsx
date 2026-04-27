import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/db";
import { ProjectsSection } from "@/components/projects/ProjectsSection";
import type { ImpactMetric, Project, Technology } from "@/lib/types";

export const metadata: Metadata = {
  title: "Projets",
  description:
    "Systèmes en production — SaaS, ERP, GED, gestion de flotte. Case studies détaillés avec architecture, stack et impact mesurable.",
};

export const revalidate = 60;

async function getData(): Promise<{ projects: Project[]; technologies: Technology[] }> {
  try {
    const [dbProjects, dbTechs] = await Promise.all([
      prisma.project.findMany({
        where: { isPublished: true },
        orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }, { id: "asc" }],
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
      tagline: p.tagline,
      problem: p.problem ?? "",
      solution: p.solution ?? "",
      results: p.results ?? "",
      imageUrl: p.imageUrl,
      demoUrl: p.demoUrl,
      prodUrl: p.prodUrl,
      isFeatured: p.isFeatured,
      impactMetrics: (p.impactMetrics as ImpactMetric[] | null) ?? [],
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
  const t = await getTranslations("projectsPage");

  return (
    <div className="relative">
      {/* Hero mini */}
      <section className="relative overflow-hidden border-b border-[hsl(var(--color-surface-muted))]">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/4 top-0 h-[300px] w-[500px] rounded-full bg-[hsl(var(--color-accent))] opacity-[0.08] blur-[120px]" />
          <div className="absolute right-1/4 top-20 h-[250px] w-[400px] rounded-full bg-[hsl(var(--color-accent-warm))] opacity-[0.08] blur-[110px]" />
        </div>
        <div className="container-tight pt-20 pb-12 sm:pt-28 sm:pb-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--color-electric))]/30 bg-[hsl(var(--color-electric))]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[hsl(var(--color-electric))]">
            <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--color-electric))]" />
            {projects.length} {t("badge")}
          </div>
          <h1 className="font-display text-5xl font-extrabold tracking-tight text-[hsl(var(--color-foreground))] sm:text-6xl lg:text-7xl">
            {t("title1")}{" "}
            <span className="text-gradient">{t("titleHighlight")}</span>
            {t("titleSuffix")}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-[hsl(var(--color-muted))]">
            {t("description")}
          </p>
        </div>
      </section>

      {/* Liste / grid */}
      <section className="section-padding">
        <div className="container-tight">
          {projects.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-[hsl(var(--color-surface-muted))] p-16 text-center">
              <div className="mb-3 text-5xl">⚙️</div>
              <p className="text-[hsl(var(--color-muted))]">{t("empty")}</p>
            </div>
          ) : (
            <ProjectsSection projects={projects} technologies={technologies} />
          )}
        </div>
      </section>
    </div>
  );
}
