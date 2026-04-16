"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { fadeUp, stagger } from "@/lib/motion";

type Stats = {
  projectsShipped: number;
  yearsExperience: number;
  domainsCovered: number;
  clientsServed: number;
};

type TopProject = {
  id: number;
  slug: string;
  name: string;
  tagline: string | null;
  problem: string | null;
  technologies: string[];
};

type SkillCat = {
  name: string;
  icon: string | null;
  items: string[];
};

type MatchResult = {
  score: number;
  verdict: "excellent_match" | "good_match" | "partial_match" | "weak_match";
  summary: string;
  strengths: string[];
  gaps: string[];
  topProjects: string[];
  pitchMessage: string;
};

const verdictConfig = {
  excellent_match: { label: "Excellent match", color: "text-green-600 bg-green-50 border-green-200" },
  good_match: { label: "Bon match", color: "text-blue-600 bg-blue-50 border-blue-200" },
  partial_match: { label: "Match partiel", color: "text-yellow-600 bg-yellow-50 border-yellow-200" },
  weak_match: { label: "Match faible", color: "text-red-600 bg-red-50 border-red-200" },
};

export function RecruiterClient({
  stats,
  topProjects,
  skills,
}: {
  stats: Stats;
  topProjects: TopProject[];
  skills: SkillCat[];
}) {
  const [jobOffer, setJobOffer] = useState("");
  const [result, setResult] = useState<MatchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/ai/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobOffer }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-padding">
      <div className="container-tight">
        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[hsl(var(--color-accent))]/10 px-3 py-1 text-xs font-semibold text-[hsl(var(--color-accent))]">
            👋 Espace recruteurs
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tight text-[hsl(var(--color-foreground))] sm:text-5xl">
            Tout ce dont vous avez besoin en 2 minutes
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[hsl(var(--color-muted))]">
            Résumé, chiffres clés, projets phares, et un outil IA qui compare automatiquement
            mon profil à votre offre d&apos;emploi.
          </p>
        </motion.div>

        {/* STATS + CV */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="mb-16 grid gap-6 md:grid-cols-[2fr_1fr]"
        >
          <motion.div
            variants={fadeUp}
            className="grid grid-cols-2 gap-6 rounded-2xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-8 shadow-sm sm:grid-cols-4"
          >
            <div className="text-center">
              <div className="font-display text-3xl font-bold text-[hsl(var(--color-accent))]">
                {stats.projectsShipped}+
              </div>
              <div className="mt-1 text-xs uppercase text-[hsl(var(--color-muted))]">Projets livrés</div>
            </div>
            <div className="text-center">
              <div className="font-display text-3xl font-bold text-[hsl(var(--color-accent))]">
                {stats.yearsExperience}
              </div>
              <div className="mt-1 text-xs uppercase text-[hsl(var(--color-muted))]">Années XP</div>
            </div>
            <div className="text-center">
              <div className="font-display text-3xl font-bold text-[hsl(var(--color-accent))]">
                {stats.domainsCovered}
              </div>
              <div className="mt-1 text-xs uppercase text-[hsl(var(--color-muted))]">Domaines</div>
            </div>
            <div className="text-center">
              <div className="font-display text-3xl font-bold text-[hsl(var(--color-accent))]">
                {stats.clientsServed}+
              </div>
              <div className="mt-1 text-xs uppercase text-[hsl(var(--color-muted))]">Clients</div>
            </div>
          </motion.div>

          <motion.a
            variants={fadeUp}
            href="/cv-mohamed-ahetan.pdf"
            download
            className="group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[hsl(var(--color-accent-warm))] bg-[hsl(var(--color-accent-warm))]/5 p-8 text-center transition hover:bg-[hsl(var(--color-accent-warm))]/10"
          >
            <div className="text-4xl">📄</div>
            <div className="mt-2 font-semibold text-[hsl(var(--color-foreground))]">Télécharger le CV</div>
            <div className="text-xs text-[hsl(var(--color-muted))]">Format PDF</div>
          </motion.a>
        </motion.div>

        {/* IA MATCH */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 rounded-3xl border border-[hsl(var(--color-surface-muted))] bg-gradient-to-br from-[hsl(var(--color-accent))]/5 to-[hsl(var(--color-accent-warm))]/5 p-8 shadow-sm sm:p-10"
        >
          <div className="mb-6">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[hsl(var(--color-accent))]/10 px-3 py-1 text-xs font-semibold text-[hsl(var(--color-accent))]">
              🤖 IA — Matching automatique
            </div>
            <h2 className="font-display text-2xl font-bold text-[hsl(var(--color-foreground))] sm:text-3xl">
              Collez votre offre d&apos;emploi, j&apos;analyse le fit
            </h2>
            <p className="mt-2 text-[hsl(var(--color-muted))]">
              Une IA compare votre offre à mon profil complet (projets, compétences, expérience) et
              vous donne un verdict immédiat avec un message personnalisé.
            </p>
          </div>

          <form onSubmit={analyze} className="space-y-4">
            <textarea
              className="w-full rounded-xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-4 text-sm text-[hsl(var(--color-foreground))] placeholder:text-[hsl(var(--color-muted))] focus:border-[hsl(var(--color-accent))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--color-accent))]/20"
              rows={8}
              placeholder="Collez ici la description complète du poste : missions, compétences requises, stack technique, contexte…"
              value={jobOffer}
              onChange={(e) => setJobOffer(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading || jobOffer.length < 30}
              className="rounded-lg bg-[hsl(var(--color-accent-warm))] px-6 py-3 text-sm font-semibold text-[hsl(var(--color-accent-warm-foreground))] shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Analyse en cours…" : "✨ Analyser le fit"}
            </button>
          </form>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </motion.p>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 space-y-6 rounded-2xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-6"
            >
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[hsl(var(--color-accent))] to-[hsl(var(--color-accent-warm))] font-display text-2xl font-bold text-white">
                  {result.score}
                </div>
                <div>
                  <span
                    className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold ${verdictConfig[result.verdict].color}`}
                  >
                    {verdictConfig[result.verdict].label}
                  </span>
                  <p className="mt-2 text-sm text-[hsl(var(--color-foreground))]">{result.summary}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h4 className="mb-2 text-xs font-semibold uppercase text-green-600">✓ Forces</h4>
                  <ul className="space-y-1 text-sm">
                    {result.strengths.map((s, i) => (
                      <li key={i} className="flex gap-2 text-[hsl(var(--color-foreground))]">
                        <span className="text-green-600">•</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="mb-2 text-xs font-semibold uppercase text-yellow-600">⚠ Points d&apos;attention</h4>
                  <ul className="space-y-1 text-sm">
                    {result.gaps.map((g, i) => (
                      <li key={i} className="flex gap-2 text-[hsl(var(--color-foreground))]">
                        <span className="text-yellow-600">•</span>
                        {g}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {result.topProjects.length > 0 && (
                <div>
                  <h4 className="mb-2 text-xs font-semibold uppercase text-[hsl(var(--color-accent))]">
                    Projets les plus pertinents
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.topProjects.map((p, i) => (
                      <span
                        key={i}
                        className="rounded-full bg-[hsl(var(--color-accent))]/10 px-3 py-1 text-xs font-medium text-[hsl(var(--color-accent))]"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-xl border border-[hsl(var(--color-accent-warm))]/30 bg-[hsl(var(--color-accent-warm))]/5 p-4">
                <h4 className="mb-2 text-xs font-semibold uppercase text-[hsl(var(--color-accent-warm))]">
                  💬 Message personnalisé à envoyer
                </h4>
                <p className="text-sm leading-relaxed text-[hsl(var(--color-foreground))]">
                  {result.pitchMessage}
                </p>
                <button
                  onClick={() => navigator.clipboard.writeText(result.pitchMessage)}
                  className="mt-3 text-xs font-medium text-[hsl(var(--color-accent))] hover:underline"
                >
                  📋 Copier le message
                </button>
              </div>

              <div className="flex gap-3 border-t border-[hsl(var(--color-surface-muted))] pt-4">
                <Link href="/booking" className="btn-cta">
                  📅 Réserver un entretien
                </Link>
                <Link href="/contact" className="btn-outline">
                  Envoyer un message
                </Link>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* TOP PROJECTS */}
        <section className="mb-16">
          <h2 className="mb-6 font-display text-2xl font-bold text-[hsl(var(--color-foreground))]">
            🏆 Projets phares
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {topProjects.map((p) => (
              <Link
                key={p.id}
                href={`/projects/${p.slug}`}
                className="group rounded-xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-5 shadow-sm transition hover:border-[hsl(var(--color-accent))] hover:shadow-md"
              >
                <h3 className="font-semibold text-[hsl(var(--color-foreground))] group-hover:text-[hsl(var(--color-accent))]">
                  {p.name}
                </h3>
                <p className="mt-1 text-xs text-[hsl(var(--color-muted))] line-clamp-2">
                  {p.tagline ?? p.problem}
                </p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {p.technologies.slice(0, 3).map((t) => (
                    <span key={t} className="rounded bg-[hsl(var(--color-surface-muted))] px-1.5 py-0.5 text-[10px]">
                      {t}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* SKILLS */}
        <section>
          <h2 className="mb-6 font-display text-2xl font-bold text-[hsl(var(--color-foreground))]">
            🛠 Stack maîtrisée
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {skills.map((c) => (
              <div
                key={c.name}
                className="rounded-xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-5 shadow-sm"
              >
                <div className="mb-3 flex items-center gap-2">
                  {c.icon && <span className="text-xl">{c.icon}</span>}
                  <h3 className="font-semibold text-[hsl(var(--color-foreground))]">{c.name}</h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {c.items.map((i) => (
                    <span
                      key={i}
                      className="rounded bg-[hsl(var(--color-surface-muted))] px-2 py-0.5 text-xs text-[hsl(var(--color-foreground))]"
                    >
                      {i}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
