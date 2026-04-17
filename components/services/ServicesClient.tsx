"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/lib/motion";

type Service = {
  id: number;
  slug: string;
  title: string;
  icon: string | null;
  description: string;
  priceRange: string | null;
  duration: string | null;
  deliverables: string[];
};

const TONES = [
  {
    bar: "from-[hsl(var(--color-accent))] to-transparent",
    numText: "text-[hsl(var(--color-accent))]",
    numBg: "bg-[hsl(var(--color-accent))]/10",
    glow: "bg-[hsl(var(--color-accent))]",
    check: "text-[hsl(var(--color-accent))]",
  },
  {
    bar: "from-[hsl(var(--color-accent-warm))] to-transparent",
    numText: "text-[hsl(var(--color-accent-warm))]",
    numBg: "bg-[hsl(var(--color-accent-warm))]/10",
    glow: "bg-[hsl(var(--color-accent-warm))]",
    check: "text-[hsl(var(--color-accent-warm))]",
  },
  {
    bar: "from-[hsl(var(--color-electric))] to-transparent",
    numText: "text-[hsl(var(--color-electric))]",
    numBg: "bg-[hsl(var(--color-electric))]/10",
    glow: "bg-[hsl(var(--color-electric))]",
    check: "text-[hsl(var(--color-electric))]",
  },
  {
    bar: "from-[hsl(var(--color-accent))] to-transparent",
    numText: "text-[hsl(var(--color-accent))]",
    numBg: "bg-[hsl(var(--color-accent))]/10",
    glow: "bg-[hsl(var(--color-accent))]",
    check: "text-[hsl(var(--color-accent))]",
  },
];

export function ServicesClient({ services }: { services: Service[] }) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="grid gap-6 md:grid-cols-2"
    >
      {services.map((s, i) => {
        const tone = TONES[i % TONES.length];
        const num = String(i + 1).padStart(2, "0");

        return (
          <motion.article
            key={s.id}
            variants={fadeUp}
            whileHover={{ y: -8 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="group relative flex flex-col overflow-hidden rounded-3xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-8 shadow-sm transition-shadow hover:shadow-2xl sm:p-10"
          >
            {/* LEFT ACCENT BAR */}
            <div className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${tone.bar}`} />

            {/* NUMBER XL EN ARRIÈRE-PLAN */}
            <div className={`pointer-events-none absolute -right-4 -top-6 font-display text-[10rem] font-extrabold leading-none ${tone.numText} opacity-[0.06] transition-opacity duration-500 group-hover:opacity-[0.12]`}>
              {num}
            </div>

            {/* CORNER GLOW ON HOVER */}
            <div className={`pointer-events-none absolute -bottom-20 -right-10 h-48 w-48 rounded-full ${tone.glow} opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-[0.18]`} />

            {/* HEAD : Numéro + Icon */}
            <div className="relative mb-6 flex items-start gap-4">
              <motion.div
                whileHover={{ scale: 1.08, rotate: -6 }}
                transition={{ type: "spring", stiffness: 300 }}
                className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] text-3xl shadow-lg`}
              >
                {s.icon ?? "⚙️"}
              </motion.div>
              <div className="flex-1 min-w-0">
                <div className={`font-mono text-xs font-extrabold uppercase tracking-[0.25em] ${tone.numText}`}>
                  {num} · Service
                </div>
                <h2 className="mt-1 font-display text-2xl font-extrabold leading-tight text-[hsl(var(--color-foreground))] sm:text-3xl">
                  {s.title}
                </h2>
              </div>
            </div>

            {/* DESCRIPTION */}
            <p className="relative text-[15px] leading-relaxed text-[hsl(var(--color-muted))]">
              {s.description}
            </p>

            {/* META CHIPS */}
            <div className="relative mt-6 flex flex-wrap gap-2">
              {s.duration && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface-muted))]/50 px-3 py-1 text-xs font-semibold text-[hsl(var(--color-foreground))]">
                  <span>⏱</span>
                  {s.duration}
                </span>
              )}
              {s.priceRange && (
                <span className={`inline-flex items-center gap-1.5 rounded-full border border-[hsl(var(--color-accent-warm))]/30 ${tone.numBg} px-3 py-1 text-xs font-bold ${tone.numText}`}>
                  <span>💰</span>
                  {s.priceRange}
                </span>
              )}
            </div>

            {/* DELIVERABLES */}
            {s.deliverables.length > 0 && (
              <div className="relative mt-6 border-t border-dashed border-[hsl(var(--color-surface-muted))] pt-6">
                <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[hsl(var(--color-muted))]">
                  Ce que vous recevez
                </p>
                <ul className="space-y-2.5">
                  {s.deliverables.map((d, di) => (
                    <motion.li
                      key={di}
                      initial={{ opacity: 0, x: -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: di * 0.05 }}
                      className="flex items-start gap-3 text-sm text-[hsl(var(--color-foreground))]"
                    >
                      <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${tone.numBg} ${tone.check} font-bold text-xs`}>
                        ✓
                      </span>
                      <span className="leading-relaxed">{d}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}

            {/* FOOTER CTA */}
            <div className="relative mt-auto border-t border-[hsl(var(--color-surface-muted))] pt-6">
              <Link
                href="/booking"
                className="group/cta inline-flex items-center gap-2 text-sm font-bold text-[hsl(var(--color-foreground))] transition-colors hover:text-[hsl(var(--color-accent))]"
              >
                <span>Démarrer cette mission</span>
                <motion.span
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[hsl(var(--color-surface-muted))] transition-all group-hover/cta:border-[hsl(var(--color-accent))] group-hover/cta:bg-[hsl(var(--color-accent))] group-hover/cta:text-white"
                >
                  →
                </motion.span>
              </Link>
            </div>
          </motion.article>
        );
      })}
    </motion.div>
  );
}
