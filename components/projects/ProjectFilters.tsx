"use client";

import { motion } from "framer-motion";
import type { Technology } from "@/lib/types";

type ProjectFiltersProps = {
  technologies: Technology[];
  activeSlug: string | null;
  onFilter: (slug: string | null) => void;
  counts: Record<string, number>;
  totalCount: number;
};

export function ProjectFilters({
  technologies,
  activeSlug,
  onFilter,
  counts,
  totalCount,
}: ProjectFiltersProps) {
  const relevantTechs = technologies.filter((t) => counts[t.slug] > 0);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <FilterPill
        active={activeSlug === null}
        onClick={() => onFilter(null)}
        label="Tous"
        count={totalCount}
      />
      {relevantTechs.map((tech) => (
        <FilterPill
          key={tech.id}
          active={activeSlug === tech.slug}
          onClick={() => onFilter(tech.slug)}
          label={tech.name}
          count={counts[tech.slug]}
        />
      ))}
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all"
    >
      {active && (
        <motion.span
          layoutId="filter-active-indicator"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
          className="absolute inset-0 rounded-full bg-gradient-to-r from-[hsl(var(--color-accent))] via-[hsl(var(--color-accent-warm))] to-[hsl(var(--color-electric))] shadow-[0_4px_20px_rgba(99,102,241,0.35)]"
        />
      )}
      <span
        className={`relative z-10 transition-colors ${
          active
            ? "text-white"
            : "text-[hsl(var(--color-muted))] hover:text-[hsl(var(--color-foreground))]"
        }`}
      >
        {label}
      </span>
      <span
        className={`relative z-10 rounded-full px-1.5 text-[10px] font-bold transition-colors ${
          active
            ? "bg-white/20 text-white"
            : "bg-[hsl(var(--color-surface-muted))] text-[hsl(var(--color-muted))]"
        }`}
      >
        {count}
      </span>
      {!active && (
        <span className="absolute inset-0 rounded-full border border-[hsl(var(--color-surface-muted))] transition-colors hover:border-[hsl(var(--color-accent))]/40" />
      )}
    </button>
  );
}
