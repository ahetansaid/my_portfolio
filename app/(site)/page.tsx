import Link from "next/link";
import { prisma } from "@/lib/db";
import { HomeHero } from "@/components/home/HomeHero";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { ServicesPreview } from "@/components/home/ServicesPreview";
import { HomeTestimonials } from "@/components/home/HomeTestimonials";
import { HomeCTA } from "@/components/home/HomeCTA";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const projects = await prisma.project.findMany({
    where: { isPublished: true },
    orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }],
    take: 6,
    include: {
      technologies: { include: { technology: true }, orderBy: { technology: { sortOrder: "asc" } } },
    },
  });

  const services = await prisma.service.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: "asc" },
    take: 4,
  });

  return (
    <>
      <HomeHero />
      <FeaturedProjects
        projects={projects.map((p) => {
          const metrics = (p.impactMetrics as Array<{ label: string; value: string }> | null) ?? [];
          return {
            id: p.id,
            slug: p.slug,
            name: p.name,
            tagline: p.tagline ?? p.problem?.slice(0, 120) ?? "",
            imageUrl: p.imageUrl,
            isFeatured: p.isFeatured,
            primaryMetric: metrics[0] ?? null,
            technologies: p.technologies.map((pt) => pt.technology.name),
          };
        })}
      />
      <ServicesPreview
        services={services.map((s) => ({
          id: s.id,
          slug: s.slug,
          title: s.title,
          icon: s.icon,
          description: s.description,
          priceRange: s.priceRange,
          duration: s.duration,
        }))}
      />
      <HomeTestimonials />
      <HomeCTA />
    </>
  );
}
