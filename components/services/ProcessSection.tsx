"use client";

import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/lib/motion";

const STEPS = [
  {
    num: "01",
    icon: "💬",
    title: "Discovery call",
    duration: "30 min · gratuit",
    description:
      "On discute de votre contexte, vos contraintes, vos objectifs. Je vous dis franchement si je peux vous aider ou pas.",
    tone: "accent",
  },
  {
    num: "02",
    icon: "📋",
    title: "Cadrage & proposition",
    duration: "3 à 5 jours",
    description:
      "Je reviens avec un périmètre précis, un planning, un budget ferme. Pas de surprise en cours de route.",
    tone: "warm",
  },
  {
    num: "03",
    icon: "⚒️",
    title: "Build en sprints",
    duration: "Selon projet",
    description:
      "Livraisons hebdomadaires d'incréments fonctionnels. Vous suivez l'avancement en temps réel, vous ajustez en direct.",
    tone: "electric",
  },
  {
    num: "04",
    icon: "🚀",
    title: "Déploiement & support",
    duration: "30 jours inclus",
    description:
      "Mise en prod, formation de vos équipes, documentation complète. Un mois de support inclus pour garantir une vraie adoption.",
    tone: "gradient",
  },
];

const TONE_STYLES = {
  accent: {
    num: "text-[hsl(var(--color-accent))]",
    bg: "bg-[hsl(var(--color-accent))]/10",
    border: "border-[hsl(var(--color-accent))]/30",
    line: "from-[hsl(var(--color-accent))] to-transparent",
  },
  warm: {
    num: "text-[hsl(var(--color-accent-warm))]",
    bg: "bg-[hsl(var(--color-accent-warm))]/10",
    border: "border-[hsl(var(--color-accent-warm))]/30",
    line: "from-[hsl(var(--color-accent-warm))] to-transparent",
  },
  electric: {
    num: "text-[hsl(var(--color-electric))]",
    bg: "bg-[hsl(var(--color-electric))]/10",
    border: "border-[hsl(var(--color-electric))]/30",
    line: "from-[hsl(var(--color-electric))] to-transparent",
  },
  gradient: {
    num: "bg-gradient-to-r from-[hsl(var(--color-accent))] via-[hsl(var(--color-accent-warm))] to-[hsl(var(--color-electric))] bg-clip-text text-transparent",
    bg: "bg-gradient-to-br from-[hsl(var(--color-accent))]/10 to-[hsl(var(--color-electric))]/10",
    border: "border-[hsl(var(--color-accent-warm))]/30",
    line: "from-[hsl(var(--color-accent))] via-[hsl(var(--color-accent-warm))] to-[hsl(var(--color-electric))]",
  },
};

export function ProcessSection() {
  return (
    <section className="section-padding border-y border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface-muted))]/40">
      <div className="container-tight">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 max-w-2xl"
        >
          <div className="mb-3 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[hsl(var(--color-accent))]">
            <span className="h-px w-8 bg-[hsl(var(--color-accent))]" />
            Processus · 4 étapes
          </div>
          <h2 className="font-display text-4xl font-extrabold text-[hsl(var(--color-foreground))] sm:text-5xl">
            Comment je travaille.
          </h2>
          <p className="mt-4 text-[hsl(var(--color-muted))]">
            Transparent, itératif, sans mystère. Vous savez toujours où on en est, et à quel
            horizon la prochaine étape arrive.
          </p>
        </motion.div>

        {/* Steps grid */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="relative grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        >
          {/* Ligne de connexion horizontale (desktop only) */}
          <div className="pointer-events-none absolute left-0 right-0 top-[76px] hidden h-px bg-gradient-to-r from-transparent via-[hsl(var(--color-surface-muted))] to-transparent lg:block" />

          {STEPS.map((s) => {
            const tone = TONE_STYLES[s.tone as keyof typeof TONE_STYLES];
            return (
              <motion.div
                key={s.num}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className={`group relative overflow-hidden rounded-3xl border ${tone.border} bg-[hsl(var(--color-surface))] p-6 shadow-sm transition-shadow hover:shadow-xl`}
              >
                {/* Top line */}
                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${tone.line}`} />

                <div className="relative">
                  {/* Icon bubble above line */}
                  <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${tone.bg} text-2xl`}>
                    {s.icon}
                  </div>

                  {/* Num */}
                  <div className={`font-mono text-xs font-extrabold uppercase tracking-[0.25em] ${tone.num}`}>
                    Étape {s.num}
                  </div>

                  {/* Title */}
                  <h3 className="mt-1 font-display text-lg font-extrabold leading-tight text-[hsl(var(--color-foreground))]">
                    {s.title}
                  </h3>

                  {/* Duration pill */}
                  <div className={`mt-2 inline-block rounded-full ${tone.bg} px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${tone.num}`}>
                    {s.duration}
                  </div>

                  {/* Description */}
                  <p className="mt-4 text-sm leading-relaxed text-[hsl(var(--color-muted))]">
                    {s.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
