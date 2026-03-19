"use client";

import { useMemo, useState } from "react";
import type { Project, Technology } from "@/lib/types";
import { ProjectCard } from "./ProjectCard";
import { ProjectFilters } from "./ProjectFilters";
import { ProjectDetailTabs } from "./ProjectDetailTabs";

type ProjectsSectionProps = {
  projects: Project[];
  technologies: Technology[];
};

export function ProjectsSection({ projects, technologies }: ProjectsSectionProps) {
  const [filterSlug, setFilterSlug] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(projects[0] ?? null);

  const filteredProjects = useMemo(() => {
    if (!filterSlug) return projects;
    return projects.filter((p) =>
      p.technologies.some((t) => t.slug === filterSlug)
    );
  }, [projects, filterSlug]);

  return (
    <div className="space-y-10">
      <ProjectFilters
        technologies={technologies}
        activeSlug={filterSlug}
        onFilter={setFilterSlug}
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            isSelected={selectedProject?.id === project.id}
            onSelect={() => setSelectedProject(project)}
          />
        ))}
      </div>
      {filteredProjects.length === 0 && (
        <p className="text-center text-[hsl(var(--color-muted))]">
          Aucun projet pour cette technologie.
        </p>
      )}
      {selectedProject && (
        <section className="mt-12">
          <h2 className="font-display text-xl font-semibold text-[hsl(var(--color-foreground))] mb-4">
            Détail — {selectedProject.name}
          </h2>
          <ProjectDetailTabs project={selectedProject} />
        </section>
      )}
    </div>
  );
}
