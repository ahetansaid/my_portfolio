"use client";

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

export function ServicesClient({ services }: { services: Service[] }) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="grid gap-6 md:grid-cols-2"
    >
      {services.map((s) => (
        <motion.article
          key={s.id}
          variants={fadeUp}
          className="group flex flex-col rounded-2xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
        >
          {s.icon && <div className="mb-4 text-4xl">{s.icon}</div>}
          <h2 className="font-display text-xl font-semibold text-[hsl(var(--color-foreground))]">
            {s.title}
          </h2>
          <p className="mt-2 text-sm text-[hsl(var(--color-muted))]">{s.description}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {s.duration && (
              <span className="inline-flex items-center gap-1 rounded-md bg-[hsl(var(--color-surface-muted))] px-2.5 py-1 text-xs font-medium text-[hsl(var(--color-foreground))]">
                ⏱ {s.duration}
              </span>
            )}
            {s.priceRange && (
              <span className="inline-flex items-center gap-1 rounded-md bg-[hsl(var(--color-accent-warm))]/10 px-2.5 py-1 text-xs font-semibold text-[hsl(var(--color-accent-warm))]">
                💰 {s.priceRange}
              </span>
            )}
          </div>

          {s.deliverables.length > 0 && (
            <div className="mt-5 border-t border-[hsl(var(--color-surface-muted))] pt-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[hsl(var(--color-muted))]">
                Livrables
              </p>
              <ul className="space-y-1.5">
                {s.deliverables.map((d, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[hsl(var(--color-foreground))]">
                    <span className="mt-0.5 text-[hsl(var(--color-accent))]">✓</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.article>
      ))}
    </motion.div>
  );
}
