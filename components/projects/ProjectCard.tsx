"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import type { Project } from "@/lib/types";

export function ProjectCard({ project, size = "default" }: { project: Project; size?: "default" | "featured" }) {
  const ref = useRef<HTMLDivElement>(null);

  // 3D tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const primaryMetric = project.impactMetrics?.[0];
  const hasLive = Boolean(project.prodUrl || project.demoUrl);
  const isFeatured = size === "featured" || project.isFeatured;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", transformPerspective: 1000 }}
      className={`group relative ${isFeatured ? "md:col-span-2 md:row-span-2" : ""}`}
    >
      <Link
        href={`/projects/${project.slug}`}
        className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] shadow-sm transition-shadow hover:shadow-2xl"
      >
        {/* IMAGE / COVER */}
        <div
          className={`relative overflow-hidden bg-gradient-to-br from-[hsl(var(--color-accent))]/15 via-[hsl(var(--color-accent-warm))]/10 to-[hsl(var(--color-electric))]/15 ${
            isFeatured ? "aspect-[16/9]" : "aspect-[16/10]"
          }`}
        >
          {project.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.imageUrl}
              alt={project.name}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <div
                className={`font-display font-extrabold opacity-15 ${
                  isFeatured ? "text-[10rem]" : "text-7xl"
                }`}
              >
                {project.name.charAt(0)}
              </div>
            </div>
          )}

          {/* OVERLAY TOP-RIGHT — Métrique principale */}
          {primaryMetric && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute right-4 top-4 rounded-2xl bg-[hsl(var(--color-surface))]/95 px-4 py-2.5 shadow-lg backdrop-blur"
            >
              <div className="font-display text-xl font-extrabold leading-none text-[hsl(var(--color-accent-warm))] sm:text-2xl">
                {primaryMetric.value}
              </div>
              <div className="mt-1 text-[9px] font-semibold uppercase tracking-wider text-[hsl(var(--color-muted))]">
                {primaryMetric.label}
              </div>
            </motion.div>
          )}

          {/* OVERLAY TOP-LEFT — Featured badge */}
          {isFeatured && (
            <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-black/80 px-3 py-1 backdrop-blur">
              <span className="text-[10px]">★</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-white">
                Phare
              </span>
            </div>
          )}

          {/* OVERLAY BOTTOM — Status live/demo */}
          {hasLive && (
            <div className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full border border-green-400/40 bg-green-500/20 px-3 py-1 backdrop-blur">
              <motion.span
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 1.6, repeat: Infinity }}
                className="h-1.5 w-1.5 rounded-full bg-green-400"
              />
              <span className="text-[10px] font-bold uppercase tracking-wider text-green-100">
                {project.prodUrl ? "Live" : "Demo"}
              </span>
            </div>
          )}

          {/* Gradient overlay for hover contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>

        {/* CONTENT */}
        <div
          className={`flex flex-1 flex-col ${isFeatured ? "p-6 sm:p-8" : "p-5"}`}
          style={{ transform: "translateZ(30px)" }}
        >
          <h3
            className={`font-display font-bold text-[hsl(var(--color-foreground))] transition-colors group-hover:text-[hsl(var(--color-accent))] ${
              isFeatured ? "text-2xl sm:text-3xl" : "text-lg"
            }`}
          >
            {project.name}
          </h3>
          {(project.tagline || project.problem) && (
            <p
              className={`mt-2 text-[hsl(var(--color-muted))] ${
                isFeatured ? "text-base line-clamp-3" : "text-sm line-clamp-2"
              }`}
            >
              {project.tagline || project.problem}
            </p>
          )}

          {/* Tech badges */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.technologies.slice(0, isFeatured ? 7 : 4).map((t) => (
              <span
                key={t.id}
                className="rounded-md bg-[hsl(var(--color-surface-muted))] px-2 py-0.5 text-[11px] font-medium text-[hsl(var(--color-foreground))]"
              >
                {t.name}
              </span>
            ))}
            {project.technologies.length > (isFeatured ? 7 : 4) && (
              <span className="text-[11px] font-medium text-[hsl(var(--color-muted))]">
                +{project.technologies.length - (isFeatured ? 7 : 4)}
              </span>
            )}
          </div>

          {/* Arrow */}
          <div className="mt-auto flex items-center justify-between pt-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--color-muted))]">
              Case study
            </span>
            <motion.span
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[hsl(var(--color-surface-muted))] text-[hsl(var(--color-accent))] transition-all group-hover:border-[hsl(var(--color-accent))] group-hover:bg-[hsl(var(--color-accent))] group-hover:text-white"
            >
              →
            </motion.span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
