"use client";

import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/lib/motion";

type Item = {
  id: number;
  slug: string;
  title: string;
  emoji: string | null;
  description: string;
  imageUrl: string | null;
  demoUrl: string | null;
  repoUrl: string | null;
  tags: string[];
};

export function PlaygroundClient({ items }: { items: Item[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-[hsl(var(--color-surface-muted))] p-16 text-center">
        <div className="mb-3 text-5xl">⚗️</div>
        <p className="text-[hsl(var(--color-muted))]">Aucune expérience publique pour l&apos;instant.</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      {items.map((it) => (
        <motion.article
          key={it.id}
          variants={fadeUp}
          whileHover={{ y: -4 }}
          className="group flex flex-col overflow-hidden rounded-2xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] shadow-sm transition hover:shadow-xl"
        >
          {it.imageUrl ? (
            <div className="aspect-[16/9] overflow-hidden bg-[hsl(var(--color-surface-muted))]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={it.imageUrl}
                alt={it.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
          ) : (
            <div className="flex aspect-[16/9] items-center justify-center bg-gradient-to-br from-[hsl(var(--color-accent))]/10 to-[hsl(var(--color-accent-warm))]/10 text-6xl">
              {it.emoji ?? "⚗️"}
            </div>
          )}

          <div className="flex flex-1 flex-col p-5">
            <div className="mb-2 flex items-center gap-2">
              {it.emoji && !it.imageUrl === false && (
                <span className="text-xl">{it.emoji}</span>
              )}
              <h3 className="font-display text-lg font-semibold text-[hsl(var(--color-foreground))]">
                {it.title}
              </h3>
            </div>
            <p className="mb-4 flex-1 text-sm text-[hsl(var(--color-muted))]">{it.description}</p>

            {it.tags.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-1.5">
                {it.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-md bg-[hsl(var(--color-accent))]/10 px-2 py-0.5 text-[11px] font-medium text-[hsl(var(--color-accent))]"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-2 border-t border-[hsl(var(--color-surface-muted))] pt-4">
              {it.demoUrl && (
                <a
                  href={it.demoUrl}
                  target="_blank"
                  rel="noopener"
                  className="flex-1 rounded-lg bg-[hsl(var(--color-accent))] px-3 py-2 text-center text-xs font-semibold text-[hsl(var(--color-accent-foreground))] transition hover:opacity-90"
                >
                  🚀 Démo
                </a>
              )}
              {it.repoUrl && (
                <a
                  href={it.repoUrl}
                  target="_blank"
                  rel="noopener"
                  className="flex-1 rounded-lg border border-[hsl(var(--color-surface-muted))] px-3 py-2 text-center text-xs font-semibold text-[hsl(var(--color-foreground))] transition hover:bg-[hsl(var(--color-surface-muted))]"
                >
                  ⚡ Code
                </a>
              )}
            </div>
          </div>
        </motion.article>
      ))}
    </motion.div>
  );
}
