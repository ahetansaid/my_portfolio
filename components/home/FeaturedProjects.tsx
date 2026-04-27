"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { fadeUp, stagger } from "@/lib/motion";

type P = {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  imageUrl: string | null;
  isFeatured: boolean;
  primaryMetric: { label: string; value: string } | null;
  technologies: string[];
};

export function FeaturedProjects({ projects }: { projects: P[] }) {
  const t = useTranslations("featuredProjects");
  if (projects.length === 0) return null;

  return (
    <section className="section-padding border-t border-[hsl(var(--color-surface-muted))]">
      <div className="container-tight">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex flex-wrap items-end justify-between gap-4"
        >
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[hsl(var(--color-accent))]/10 px-3 py-1 text-xs font-semibold text-[hsl(var(--color-accent))]">
              {t("badge")}
            </div>
            <h2 className="font-display text-3xl font-bold text-[hsl(var(--color-foreground))] sm:text-4xl">
              {t("title")}
            </h2>
            <p className="mt-2 text-[hsl(var(--color-muted))]">
              {t("subtitle")}
            </p>
          </div>
          <Link
            href="/projects"
            className="text-sm font-semibold text-[hsl(var(--color-accent))] hover:underline"
          >
            {t("seeAll")}
          </Link>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {projects.map((p) => (
            <motion.article
              key={p.id}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] shadow-sm transition hover:shadow-2xl"
            >
              <Link href={`/projects/${p.slug}`} className="flex flex-1 flex-col">
                <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-[hsl(var(--color-accent))]/15 to-[hsl(var(--color-accent-warm))]/15">
                  {p.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-6xl opacity-20">
                      ⚙️
                    </div>
                  )}
                  {p.isFeatured && (
                    <span className="absolute left-3 top-3 rounded-full bg-[hsl(var(--color-accent-warm))] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[hsl(var(--color-accent-warm-foreground))] shadow-lg">
                      ★ {t("featured")}
                    </span>
                  )}

                  {/* Métrique XL en overlay */}
                  {p.primaryMetric && (
                    <div className="absolute right-3 top-3 rounded-2xl bg-[hsl(var(--color-surface))]/95 px-4 py-3 shadow-lg backdrop-blur">
                      <div className="font-display text-2xl font-bold leading-none text-[hsl(var(--color-accent-warm))]">
                        {p.primaryMetric.value}
                      </div>
                      <div className="mt-1 text-[10px] font-medium uppercase tracking-wide text-[hsl(var(--color-muted))]">
                        {p.primaryMetric.label}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-lg font-semibold text-[hsl(var(--color-foreground))] transition group-hover:text-[hsl(var(--color-accent))]">
                    {p.name}
                  </h3>
                  {p.tagline && (
                    <p className="mt-1.5 line-clamp-2 flex-1 text-sm text-[hsl(var(--color-muted))]">
                      {p.tagline}
                    </p>
                  )}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {p.technologies.slice(0, 4).map((t) => (
                      <span
                        key={t}
                        className="rounded-md bg-[hsl(var(--color-surface-muted))] px-2 py-0.5 text-[11px] font-medium text-[hsl(var(--color-foreground))]"
                      >
                        {t}
                      </span>
                    ))}
                    {p.technologies.length > 4 && (
                      <span className="text-[11px] text-[hsl(var(--color-muted))]">
                        +{p.technologies.length - 4}
                      </span>
                    )}
                  </div>
                  <div className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[hsl(var(--color-accent))] transition-all group-hover:gap-2">
                    {t("viewCaseStudy")} →
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
