"use client";

import { motion } from "framer-motion";

const PHASES = [
  { key: "discover", label: "Discover", sub: "Contexte", color: "hsl(var(--color-accent))" },
  { key: "define", label: "Define", sub: "Problème", color: "hsl(var(--color-accent-warm))" },
  { key: "develop", label: "Develop", sub: "Approche", color: "hsl(var(--color-electric))" },
  { key: "deliver", label: "Deliver", sub: "Résultats", color: "hsl(var(--color-accent))" },
];

export function DoubleDiamondDiagram({ active }: { active?: number }) {
  return (
    <div className="w-full">
      {/* SVG — 2 diamants côte à côte */}
      <div className="relative mx-auto w-full max-w-4xl">
        <svg
          viewBox="0 0 800 120"
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="diamond-gradient-1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--color-accent))" stopOpacity="0.6" />
              <stop offset="100%" stopColor="hsl(var(--color-accent-warm))" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="diamond-gradient-2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--color-accent-warm))" stopOpacity="0.6" />
              <stop offset="100%" stopColor="hsl(var(--color-electric))" stopOpacity="0.6" />
            </linearGradient>
          </defs>

          {/* Diamant 1 — Problem (Discover → Define) */}
          <motion.path
            d="M 50 60 L 200 10 L 350 60 L 200 110 Z"
            fill="url(#diamond-gradient-1)"
            stroke="hsl(var(--color-accent))"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Connection line */}
          <motion.line
            x1="350"
            y1="60"
            x2="450"
            y2="60"
            stroke="hsl(var(--color-foreground) / 0.2)"
            strokeWidth="2"
            strokeDasharray="4 4"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 1.2 }}
          />

          {/* Diamant 2 — Solution (Develop → Deliver) */}
          <motion.path
            d="M 450 60 L 600 10 L 750 60 L 600 110 Z"
            fill="url(#diamond-gradient-2)"
            stroke="hsl(var(--color-accent-warm))"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Points centraux */}
          {[50, 200, 350, 450, 600, 750].map((cx, i) => (
            <motion.circle
              key={i}
              cx={cx}
              cy="60"
              r="6"
              fill="hsl(var(--color-surface))"
              stroke={PHASES[i % 4]?.color ?? "hsl(var(--color-accent))"}
              strokeWidth="2.5"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.15 }}
              className={active === i ? "drop-shadow-[0_0_8px_currentColor]" : ""}
            />
          ))}
        </svg>

        {/* Labels sous le SVG */}
        <div className="mt-6 grid grid-cols-4 gap-2 text-center">
          {PHASES.map((phase, i) => (
            <motion.div
              key={phase.key}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className={`rounded-lg border px-2 py-2 transition-all ${
                active === i
                  ? "border-[hsl(var(--color-accent))] bg-[hsl(var(--color-accent))]/5 shadow-md"
                  : "border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))]"
              }`}
            >
              <div className="font-display text-xs font-extrabold uppercase tracking-wider sm:text-sm" style={{ color: phase.color }}>
                {phase.label}
              </div>
              <div className="mt-0.5 text-[10px] text-[hsl(var(--color-muted))] sm:text-xs">
                {phase.sub}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
