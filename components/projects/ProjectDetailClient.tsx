"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp, stagger, slideInLeft, slideInRight } from "@/lib/motion";

type Project = {
  id: number;
  slug: string;
  name: string;
  tagline: string | null;
  problem: string | null;
  solution: string | null;
  results: string | null;
  caseStudyMd: string | null;
  imageUrl: string | null;
  architectureUrl: string | null;
  demoUrl: string | null;
  prodUrl: string | null;
  repoUrl: string | null;
  impactMetrics: Array<{ label: string; value: string }>;
  technologies: Array<{ id: number; name: string; slug: string }>;
  socialLinks: Array<{ id: number; platform: string; url: string; title: string | null }>;
};

const platformIcons: Record<string, string> = {
  linkedin: "💼",
  twitter: "🐦",
  youtube: "📺",
  devto: "📝",
  medium: "📰",
  github: "⚡",
  other: "🔗",
};

export function ProjectDetailClient({ project }: { project: Project }) {
  return (
    <article className="pb-24">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-[hsl(var(--color-surface-muted))]">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[hsl(var(--color-accent))]/5 via-transparent to-[hsl(var(--color-accent-warm))]/5" />
        <div className="container-tight pt-16 pb-12 sm:pt-24 sm:pb-16">
          <motion.nav
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6 text-sm"
          >
            <Link href="/projects" className="text-[hsl(var(--color-muted))] hover:text-[hsl(var(--color-accent))] transition">
              ← Tous les projets
            </Link>
          </motion.nav>

          <motion.div variants={stagger} initial="hidden" animate="visible">
            <motion.h1
              variants={fadeUp}
              className="font-display text-4xl font-bold tracking-tight text-[hsl(var(--color-foreground))] sm:text-5xl lg:text-6xl"
            >
              {project.name}
            </motion.h1>
            {project.tagline && (
              <motion.p
                variants={fadeUp}
                className="mt-4 max-w-3xl text-lg text-[hsl(var(--color-muted))] sm:text-xl"
              >
                {project.tagline}
              </motion.p>
            )}

            <motion.div variants={fadeUp} className="mt-6 flex flex-wrap gap-2">
              {project.technologies.map((t) => (
                <span
                  key={t.id}
                  className="rounded-full bg-[hsl(var(--color-accent))]/10 px-3 py-1 text-xs font-medium text-[hsl(var(--color-accent))]"
                >
                  {t.name}
                </span>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
              {project.demoUrl && (
                <a href={project.demoUrl} target="_blank" rel="noopener" className="btn-cta">
                  🚀 Voir la démo
                </a>
              )}
              {project.prodUrl && (
                <a href={project.prodUrl} target="_blank" rel="noopener" className="btn-outline">
                  🌐 Site en production
                </a>
              )}
              {project.repoUrl && (
                <a href={project.repoUrl} target="_blank" rel="noopener" className="btn-outline">
                  ⚡ Code source
                </a>
              )}
            </motion.div>
          </motion.div>
        </div>

        {project.imageUrl && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="container-tight pb-12"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.imageUrl}
              alt={project.name}
              className="w-full rounded-2xl border border-[hsl(var(--color-surface-muted))] shadow-2xl"
            />
          </motion.div>
        )}
      </section>

      {/* IMPACT METRICS */}
      {project.impactMetrics.length > 0 && (
        <section className="border-b border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface-muted))]/40 py-12">
          <div className="container-tight">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            >
              {project.impactMetrics.map((m, i) => (
                <motion.div key={i} variants={fadeUp} className="text-center">
                  <div className="font-display text-4xl font-bold text-[hsl(var(--color-accent-warm))]">
                    {m.value}
                  </div>
                  <div className="mt-1 text-sm text-[hsl(var(--color-muted))]">{m.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* PROBLEM / SOLUTION / RESULTS */}
      <section className="section-padding">
        <div className="container-tight grid gap-12 lg:grid-cols-3">
          {project.problem && (
            <motion.div
              variants={slideInLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
            >
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                🎯 Problème
              </div>
              <p className="leading-relaxed text-[hsl(var(--color-foreground))]">{project.problem}</p>
            </motion.div>
          )}
          {project.solution && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
            >
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[hsl(var(--color-accent))]/10 px-3 py-1 text-xs font-semibold text-[hsl(var(--color-accent))]">
                💡 Solution
              </div>
              <p className="leading-relaxed text-[hsl(var(--color-foreground))]">{project.solution}</p>
            </motion.div>
          )}
          {project.results && (
            <motion.div
              variants={slideInRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
            >
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                ✓ Résultats
              </div>
              <p className="leading-relaxed text-[hsl(var(--color-foreground))]">{project.results}</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* ARCHITECTURE */}
      {project.architectureUrl && (
        <section className="border-t border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface-muted))]/30 py-16">
          <div className="container-tight">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-2xl font-bold text-[hsl(var(--color-foreground))] mb-6"
            >
              🗺️ Architecture & cartographie
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.architectureUrl}
                alt="Architecture"
                className="w-full rounded-2xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] shadow-lg"
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* CASE STUDY MARKDOWN */}
      {project.caseStudyMd && (
        <section className="section-padding">
          <div className="container-tight max-w-3xl">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-2xl font-bold text-[hsl(var(--color-foreground))] mb-6"
            >
              📖 Le projet en détails
            </motion.h2>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="prose prose-slate max-w-none whitespace-pre-wrap leading-relaxed text-[hsl(var(--color-foreground))]"
            >
              {project.caseStudyMd}
            </motion.div>
          </div>
        </section>
      )}

      {/* SOCIAL LINKS */}
      {project.socialLinks.length > 0 && (
        <section className="border-t border-[hsl(var(--color-surface-muted))] py-12">
          <div className="container-tight">
            <h3 className="mb-4 font-display text-lg font-semibold text-[hsl(var(--color-foreground))]">
              📣 On en parle
            </h3>
            <div className="flex flex-wrap gap-3">
              {project.socialLinks.map((s) => (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] px-4 py-2 text-sm font-medium text-[hsl(var(--color-foreground))] transition hover:border-[hsl(var(--color-accent))] hover:text-[hsl(var(--color-accent))]"
                >
                  <span>{platformIcons[s.platform] ?? "🔗"}</span>
                  <span>{s.title ?? s.platform}</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="border-t border-[hsl(var(--color-surface-muted))] py-16">
        <div className="container-tight text-center">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-2xl font-bold text-[hsl(var(--color-foreground))] sm:text-3xl"
          >
            Un projet similaire en tête ?
          </motion.h2>
          <p className="mx-auto mt-3 max-w-xl text-[hsl(var(--color-muted))]">
            Je suis disponible pour en discuter. Réservons 30 minutes.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/booking" className="btn-cta">
              Prendre un RDV
            </Link>
            <Link href="/projects" className="btn-outline">
              Autres projets
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
