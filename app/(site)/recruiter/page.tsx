import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { RecruiterClient } from "@/components/recruiter/RecruiterClient";

export const metadata: Metadata = {
  title: "Espace recruteurs",
  description:
    "Tout ce dont vous avez besoin pour évaluer mon profil en 2 minutes : résumé, projets phares, CV PDF et matching IA avec votre offre.",
};

export const dynamic = "force-dynamic";

export default async function RecruiterPage() {
  const [projects, skills, stats] = await Promise.all([
    prisma.project.findMany({
      where: { isPublished: true },
      orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }],
      take: 6,
      include: {
        technologies: { include: { technology: true }, orderBy: { technology: { sortOrder: "asc" } } },
      },
    }),
    prisma.skillCategory.findMany({
      include: { items: { orderBy: { sortOrder: "asc" } } },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.siteStats.findFirst({ orderBy: { id: "asc" } }),
  ]);

  return (
    <RecruiterClient
      stats={
        stats ?? {
          projectsShipped: 0,
          yearsExperience: 0,
          domainsCovered: 0,
          clientsServed: 0,
        }
      }
      topProjects={projects.map((p) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        tagline: p.tagline,
        problem: p.problem,
        technologies: p.technologies.map((pt) => pt.technology.name),
      }))}
      skills={skills.map((c) => ({
        name: c.name,
        icon: c.icon,
        items: c.items.map((i) => i.name),
      }))}
    />
  );
}
