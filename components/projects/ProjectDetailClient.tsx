"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/lib/motion";
import { DoubleDiamondDiagram } from "./DoubleDiamondDiagram";

type Project = {
  id: number;
  slug: string;
  name: string;
  tagline: string | null;
  discoveryContext: string | null;
  problem: string | null;
  approach: string | null;
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

      {/* DOUBLE DIAMOND METHODOLOGY */}
      <section className="section-padding border-t border-[hsl(var(--color-surface-muted))]">
        <div className="container-tight">
          {/* Intro */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 max-w-2xl"
          >
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--color-accent))]/30 bg-[hsl(var(--color-accent))]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[hsl(var(--color-accent))]">
              <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--color-accent))]" />
              Méthodologie Double Diamond
            </div>
            <h2 className="font-display text-3xl font-extrabold text-[hsl(var(--color-foreground))] sm:text-5xl">
              Le parcours, pas juste le code.
            </h2>
            <p className="mt-4 text-[hsl(var(--color-muted))]">
              4 phases : découvrir le terrain, définir le vrai problème, développer la solution,
              livrer l&apos;impact mesuré.
            </p>
          </motion.div>

          {/* Diagramme animé */}
          <div className="mb-16">
            <DoubleDiamondDiagram />
          </div>

          {/* 4 phases en journey vertical */}
          <div className="space-y-16">
            {/* PHASE 1 — DISCOVER */}
            {(project.discoveryContext || project.tagline) && (
              <DiamondPhase
                number="01"
                label="Discover"
                subLabel="Contexte & exploration"
                color="accent"
                icon="🔍"
                description={project.discoveryContext || project.tagline || ""}
              />
            )}

            {/* PHASE 2 — DEFINE */}
            {project.problem && (
              <DiamondPhase
                number="02"
                label="Define"
                subLabel="Problème identifié"
                color="warm"
                icon="🎯"
                description={project.problem}
              />
            )}

            {/* PHASE 3 — DEVELOP */}
            {(project.approach || project.solution) && (
              <DiamondPhase
                number="03"
                label="Develop"
                subLabel="Approche & solution"
                color="electric"
                icon="💡"
                description={project.approach || project.solution || ""}
              />
            )}

            {/* PHASE 4 — DELIVER */}
            {project.results && (
              <DiamondPhase
                number="04"
                label="Deliver"
                subLabel="Résultats livrés"
                color="gradient"
                icon="🚀"
                description={project.results}
                metrics={project.impactMetrics}
              />
            )}
          </div>
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

// ════════════════════════════════════════════════════════════════
// DIAMOND PHASE — composant pour chaque phase du Double Diamond
// ════════════════════════════════════════════════════════════════

type PhaseColor = "accent" | "warm" | "electric" | "gradient";

const phaseStyles: Record<PhaseColor, {
  numberColor: string;
  borderColor: string;
  bgSoft: string;
  barGradient: string;
  dotColor: string;
}> = {
  accent: {
    numberColor: "text-[hsl(var(--color-accent))]",
    borderColor: "border-[hsl(var(--color-accent))]/30",
    bgSoft: "bg-[hsl(var(--color-accent))]/5",
    barGradient: "from-[hsl(var(--color-accent))] to-transparent",
    dotColor: "bg-[hsl(var(--color-accent))]",
  },
  warm: {
    numberColor: "text-[hsl(var(--color-accent-warm))]",
    borderColor: "border-[hsl(var(--color-accent-warm))]/30",
    bgSoft: "bg-[hsl(var(--color-accent-warm))]/5",
    barGradient: "from-[hsl(var(--color-accent-warm))] to-transparent",
    dotColor: "bg-[hsl(var(--color-accent-warm))]",
  },
  electric: {
    numberColor: "text-[hsl(var(--color-electric))]",
    borderColor: "border-[hsl(var(--color-electric))]/30",
    bgSoft: "bg-[hsl(var(--color-electric))]/5",
    barGradient: "from-[hsl(var(--color-electric))] to-transparent",
    dotColor: "bg-[hsl(var(--color-electric))]",
  },
  gradient: {
    numberColor: "bg-gradient-to-r from-[hsl(var(--color-accent))] via-[hsl(var(--color-accent-warm))] to-[hsl(var(--color-electric))] bg-clip-text text-transparent",
    borderColor: "border-[hsl(var(--color-accent-warm))]/30",
    bgSoft: "bg-gradient-to-br from-[hsl(var(--color-accent))]/10 via-transparent to-[hsl(var(--color-electric))]/10",
    barGradient: "from-[hsl(var(--color-accent))] via-[hsl(var(--color-accent-warm))] to-[hsl(var(--color-electric))]",
    dotColor: "bg-gradient-to-r from-[hsl(var(--color-accent))] to-[hsl(var(--color-electric))]",
  },
};

function DiamondPhase({
  number,
  label,
  subLabel,
  color,
  icon,
  description,
  metrics,
}: {
  number: string;
  label: string;
  subLabel: string;
  color: PhaseColor;
  icon: string;
  description: string;
  metrics?: Array<{ label: string; value: string }>;
}) {
  const s = phaseStyles[color];
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`relative overflow-hidden rounded-3xl border ${s.borderColor} ${s.bgSoft} p-5 sm:p-8 lg:p-10`}
    >
      {/* Left accent bar */}
      <div className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${s.barGradient}`} />

      {/* Decorative gradient blob */}
      <div className={`pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full ${s.dotColor} opacity-[0.08] blur-3xl`} />

      <div className="relative grid gap-6 lg:grid-cols-[auto_1fr] lg:gap-12">
        {/* LEFT — Number + Icon + Label */}
        <div className="flex items-center gap-4 lg:flex-col lg:items-start lg:gap-3">
          <motion.div
            whileHover={{ scale: 1.08, rotate: -6 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] text-2xl shadow-lg sm:h-20 sm:w-20 sm:text-4xl"
          >
            {icon}
          </motion.div>
          <div className="min-w-0 flex-1 lg:flex-initial">
            <div className={`font-mono text-xs font-extrabold sm:text-sm ${s.numberColor}`}>
              {number}
            </div>
            <div className={`font-display text-xl font-extrabold uppercase tracking-tight leading-none sm:text-2xl lg:text-3xl ${s.numberColor}`}>
              {label}
            </div>
            <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-[hsl(var(--color-muted))] sm:text-xs">
              {subLabel}
            </div>
          </div>
        </div>

        {/* RIGHT — Description + Metrics */}
        <div>
          <p className="text-[15px] leading-relaxed text-[hsl(var(--color-foreground))] sm:text-lg">
            {description}
          </p>

          {/* Metrics inline (uniquement pour Deliver) */}
          {metrics && metrics.length > 0 && (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {metrics.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-2xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-4 text-center"
                >
                  <div className="font-display text-3xl font-extrabold bg-gradient-to-r from-[hsl(var(--color-accent))] via-[hsl(var(--color-accent-warm))] to-[hsl(var(--color-electric))] bg-clip-text text-transparent">
                    {m.value}
                  </div>
                  <div className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-[hsl(var(--color-muted))]">
                    {m.label}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}
