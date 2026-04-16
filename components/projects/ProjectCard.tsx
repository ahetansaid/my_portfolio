"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Project } from "@/lib/types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="group overflow-hidden rounded-2xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] shadow-sm transition hover:shadow-xl"
    >
      <Link href={`/projects/${project.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-[hsl(var(--color-accent))]/10 to-[hsl(var(--color-accent-warm))]/10">
          {project.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.imageUrl}
              alt={project.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-6xl opacity-20">⚙️</div>
          )}
        </div>
        <div className="p-5">
          <h3 className="font-display text-lg font-semibold text-[hsl(var(--color-foreground))] group-hover:text-[hsl(var(--color-accent))] transition">
            {project.name}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm text-[hsl(var(--color-muted))]">{project.problem}</p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 5).map((t) => (
              <span
                key={t.id}
                className="rounded-md bg-[hsl(var(--color-surface-muted))] px-2 py-0.5 text-[11px] font-medium text-[hsl(var(--color-foreground))]"
              >
                {t.name}
              </span>
            ))}
            {project.technologies.length > 5 && (
              <span className="text-[11px] text-[hsl(var(--color-muted))]">
                +{project.technologies.length - 5}
              </span>
            )}
          </div>
          <div className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-[hsl(var(--color-accent))] group-hover:gap-2 transition-all">
            Voir le case study →
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
