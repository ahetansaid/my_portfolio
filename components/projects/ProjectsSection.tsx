"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Project, Technology } from "@/lib/types";
import { ProjectCard } from "./ProjectCard";
import { ProjectFilters } from "./ProjectFilters";
import { fadeUp, stagger } from "@/lib/motion";

type ProjectsSectionProps = {
  projects: Project[];
  technologies: Technology[];
};

export function ProjectsSection({ projects, technologies }: ProjectsSectionProps) {
  const [filterSlug, setFilterSlug] = useState<string | null>(null);

  // Compteurs par techno (pour les pills)
  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const p of projects) {
      for (const t of p.technologies) {
        c[t.slug] = (c[t.slug] ?? 0) + 1;
      }
    }
    return c;
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (!filterSlug) return projects;
    return projects.filter((p) => p.technologies.some((t) => t.slug === filterSlug));
  }, [projects, filterSlug]);

  // Séparer le projet featured du reste
  const featured = filteredProjects.find((p) => p.isFeatured);
  const rest = filteredProjects.filter((p) => !p.isFeatured || p.id !== featured?.id);

  return (
    <div className="space-y-10">
      {/* FILTERS STICKY */}
      <div className="sticky top-24 z-20 -mx-4 border-y border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))]/90 px-4 py-4 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <ProjectFilters
            technologies={technologies}
            activeSlug={filterSlug}
            onFilter={setFilterSlug}
            counts={counts}
            totalCount={projects.length}
          />
          <span className="hidden text-xs text-[hsl(var(--color-muted))] sm:inline">
            {filteredProjects.length} résultat{filteredProjects.length > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* GRID */}
      {filteredProjects.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-[hsl(var(--color-surface-muted))] p-16 text-center">
          <div className="mb-3 text-5xl">🔎</div>
          <p className="text-[hsl(var(--color-muted))]">Aucun projet avec cette technologie.</p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={filterSlug ?? "all"}
            variants={stagger}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
            className="grid gap-6 md:grid-cols-2 md:grid-rows-[auto] lg:grid-cols-3"
          >
            {/* Featured (taille 2x2 en desktop) */}
            {featured && (
              <motion.div variants={fadeUp} className="contents">
                <ProjectCard project={featured} size="featured" />
              </motion.div>
            )}

            {/* Reste */}
            {rest.map((p) => (
              <motion.div key={p.id} variants={fadeUp}>
                <ProjectCard project={p} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
