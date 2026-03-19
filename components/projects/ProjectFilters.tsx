"use client";

import type { Technology } from "@/lib/types";

type ProjectFiltersProps = {
  technologies: Technology[];
  activeSlug: string | null;
  onFilter: (slug: string | null) => void;
};

export function ProjectFilters({
  technologies,
  activeSlug,
  onFilter,
}: ProjectFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => onFilter(null)}
        className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
          activeSlug === null
            ? "bg-[hsl(var(--color-accent))] text-[hsl(var(--color-accent-foreground))]"
            : "bg-[hsl(var(--color-surface-muted))] text-[hsl(var(--color-muted))] hover:bg-[hsl(var(--color-accent))]/10 hover:text-[hsl(var(--color-accent))]"
        }`}
      >
        Tous
      </button>
      {technologies.map((tech) => (
        <button
          key={tech.id}
          type="button"
          onClick={() => onFilter(tech.slug)}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            activeSlug === tech.slug
              ? "bg-[hsl(var(--color-accent))] text-[hsl(var(--color-accent-foreground))]"
              : "bg-[hsl(var(--color-surface-muted))] text-[hsl(var(--color-muted))] hover:bg-[hsl(var(--color-accent))]/10 hover:text-[hsl(var(--color-accent))]"
          }`}
        >
          {tech.name}
        </button>
      ))}
    </div>
  );
}
