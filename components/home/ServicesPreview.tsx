"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/lib/motion";

type S = {
  id: number;
  slug: string;
  title: string;
  icon: string | null;
  description: string;
  priceRange: string | null;
  duration: string | null;
};

export function ServicesPreview({ services }: { services: S[] }) {
  if (services.length === 0) return null;

  return (
    <section className="section-padding bg-[hsl(var(--color-surface-muted))]">
      <div className="container-tight">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="font-display text-3xl font-bold text-[hsl(var(--color-foreground))] sm:text-4xl">
            Comment je peux vous aider
          </h2>
          <p className="mt-3 text-[hsl(var(--color-muted))] max-w-2xl mx-auto">
            Des services sur mesure, pensés pour livrer des résultats mesurables — pas juste du code.
          </p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {services.map((s) => (
            <motion.div
              key={s.id}
              variants={fadeUp}
              className="group flex flex-col rounded-2xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              {s.icon && <div className="mb-3 text-3xl">{s.icon}</div>}
              <h3 className="font-display text-lg font-semibold text-[hsl(var(--color-foreground))]">
                {s.title}
              </h3>
              <p className="mt-2 text-sm text-[hsl(var(--color-muted))] line-clamp-3 flex-1">
                {s.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-[hsl(var(--color-muted))]">
                {s.duration && (
                  <span className="rounded-md bg-[hsl(var(--color-surface-muted))] px-2 py-1">⏱ {s.duration}</span>
                )}
                {s.priceRange && (
                  <span className="rounded-md bg-[hsl(var(--color-surface-muted))] px-2 py-1">💰 {s.priceRange}</span>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-10 text-center">
          <Link href="/services" className="text-sm font-medium text-[hsl(var(--color-accent))] hover:underline">
            Détails des services →
          </Link>
        </div>
      </div>
    </section>
  );
}
