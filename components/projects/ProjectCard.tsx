"use client";

import type { Project } from "@/lib/types";

type ProjectCardProps = {
  project: Project;
  isSelected?: boolean;
  onSelect: () => void;
};

export function ProjectCard({ project, isSelected, onSelect }: ProjectCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-xl border bg-[hsl(var(--color-surface))] p-6 text-left shadow-sm transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[hsl(var(--color-accent))] focus:ring-offset-2 ${
        isSelected
          ? "border-[hsl(var(--color-accent))] ring-2 ring-[hsl(var(--color-accent))]/20"
          : "border-[hsl(var(--color-surface-muted))] hover:border-[hsl(var(--color-accent))]/50"
      }`}
    >
      <h3 className="font-display text-lg font-semibold text-[hsl(var(--color-foreground))]">
        {project.name}
      </h3>
      <p className="mt-2 line-clamp-2 text-sm text-[hsl(var(--color-muted))]">
        {project.problem}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {project.technologies.map((tech) => (
          <span
            key={tech.id}
            className="rounded-md bg-[hsl(var(--color-surface-muted))] px-2.5 py-0.5 text-xs font-medium text-[hsl(var(--color-muted))]"
          >
            {tech.name}
          </span>
        ))}
      </div>
    </button>
  );
}
