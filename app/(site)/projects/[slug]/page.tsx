import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ProjectDetailClient } from "@/components/projects/ProjectDetailClient";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug } });
  if (!project) return { title: "Projet introuvable" };
  return {
    title: project.name,
    description: project.tagline ?? project.problem?.slice(0, 160) ?? undefined,
    openGraph: {
      title: project.name,
      description: project.tagline ?? project.problem?.slice(0, 160) ?? undefined,
      images: project.imageUrl ? [project.imageUrl] : undefined,
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
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

  if (!project || !project.isPublished) notFound();

  const impactMetrics =
    (project.impactMetrics as Array<{ label: string; value: string }> | null) ?? [];

  return (
    <ProjectDetailClient
      project={{
        id: project.id,
        slug: project.slug,
        name: project.name,
        tagline: project.tagline,
        discoveryContext: project.discoveryContext,
        problem: project.problem,
        approach: project.approach,
        solution: project.solution,
        results: project.results,
        caseStudyMd: project.caseStudyMd,
        imageUrl: project.imageUrl,
        architectureUrl: project.architectureUrl,
        demoUrl: project.demoUrl,
        prodUrl: project.prodUrl,
        repoUrl: project.repoUrl,
        impactMetrics,
        technologies: project.technologies.map((pt) => ({
          id: pt.technology.id,
          name: pt.technology.name,
          slug: pt.technology.slug,
        })),
        socialLinks: project.socialLinks.map((s) => ({
          id: s.id,
          platform: s.platform,
          url: s.url,
          title: s.title,
        })),
      }}
    />
  );
}
