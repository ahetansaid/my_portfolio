"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { Project, Technology } from "@/lib/types";
import { ProjectCard } from "./ProjectCard";
import { ProjectFilters } from "./ProjectFilters";
import { stagger, fadeUp } from "@/lib/motion";

type ProjectsSectionProps = {
  projects: Project[];
  technologies: Technology[];
};

export function ProjectsSection({ projects, technologies }: ProjectsSectionProps) {
  const [filterSlug, setFilterSlug] = useState<string | null>(null);

  const filteredProjects = useMemo(() => {
    if (!filterSlug) return projects;
    return projects.filter((p) => p.technologies.some((t) => t.slug === filterSlug));
  }, [projects, filterSlug]);

  return (
    <div className="space-y-10">
      <ProjectFilters technologies={technologies} activeSlug={filterSlug} onFilter={setFilterSlug} />
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        key={filterSlug ?? "all"}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {filteredProjects.map((project) => (
          <motion.div key={project.id} variants={fadeUp}>
            <ProjectCard project={project} />
          </motion.div>
        ))}
      </motion.div>
      {filteredProjects.length === 0 && (
        <p className="text-center text-[hsl(var(--color-muted))]">Aucun projet pour cette technologie.</p>
      )}
    </div>
  );
}
