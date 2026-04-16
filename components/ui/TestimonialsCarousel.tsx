"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

type Testimonial = {
  id: number;
  authorName: string;
  authorRole: string | null;
  authorCompany: string | null;
  authorAvatar: string | null;
  linkedinUrl: string | null;
  content: string;
  rating: number;
};

export function TestimonialsCarousel() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    fetch("/api/testimonials")
      .then((r) => r.json())
      .then(setItems)
      .catch(() => null);
  }, []);

  useEffect(() => {
    if (items.length <= 1 || paused) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [items.length, paused]);

  if (items.length === 0) return null;
  const current = items[index];

  return (
    <div
      className="mx-auto max-w-4xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Large quote card */}
      <div className="relative overflow-hidden rounded-3xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-8 shadow-xl sm:p-12">
        <div className="absolute -left-4 -top-6 font-display text-[12rem] leading-none text-[hsl(var(--color-accent))]/10 select-none pointer-events-none">
          &ldquo;
        </div>

        <div className="relative min-h-[220px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-4 flex gap-1 text-xl text-[hsl(var(--color-accent-warm))]">
                {"★".repeat(current.rating)}
                <span className="text-[hsl(var(--color-surface-muted))]">
                  {"★".repeat(5 - current.rating)}
                </span>
              </div>
              <blockquote className="text-lg leading-relaxed text-[hsl(var(--color-foreground))] sm:text-xl">
                {current.content}
              </blockquote>
              <div className="mt-8 flex items-center gap-4">
                {current.authorAvatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={current.authorAvatar}
                    alt={current.authorName}
                    className="h-14 w-14 rounded-full object-cover ring-4 ring-[hsl(var(--color-accent))]/10"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[hsl(var(--color-accent))] to-[hsl(var(--color-accent-warm))] text-lg font-bold text-white ring-4 ring-[hsl(var(--color-accent))]/10">
                    {current.authorName.charAt(0)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-[hsl(var(--color-foreground))]">
                      {current.authorName}
                    </p>
                    {current.linkedinUrl && (
                      <a
                        href={current.linkedinUrl}
                        target="_blank"
                        rel="noopener"
                        className="inline-flex items-center justify-center rounded-full bg-[hsl(var(--color-accent))]/10 px-2 py-0.5 text-[10px] font-semibold text-[hsl(var(--color-accent))] transition hover:bg-[hsl(var(--color-accent))]/20"
                        title="Profil LinkedIn vérifié"
                      >
                        ✓ VÉRIFIÉ
                      </a>
                    )}
                  </div>
                  {(current.authorRole || current.authorCompany) && (
                    <p className="text-sm text-[hsl(var(--color-muted))]">
                      {current.authorRole}
                      {current.authorRole && current.authorCompany && " · "}
                      {current.authorCompany}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation dots */}
      {items.length > 1 && (
        <div className="mt-8 flex items-center justify-center gap-3">
          {items.map((t, i) => (
            <button
              key={t.id}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === index
                  ? "w-10 bg-[hsl(var(--color-accent))]"
                  : "w-2 bg-[hsl(var(--color-surface-muted))] hover:bg-[hsl(var(--color-accent))]/40"
              }`}
              aria-label={`Témoignage ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Avatar strip (all testimonials at a glance) */}
      <div className="mt-8 flex items-center justify-center gap-3">
        {items.map((t, i) => (
          <button
            key={t.id}
            onClick={() => setIndex(i)}
            className={`transition-all ${i === index ? "scale-110" : "opacity-50 hover:opacity-80"}`}
          >
            {t.authorAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={t.authorAvatar}
                alt={t.authorName}
                className={`h-10 w-10 rounded-full object-cover ring-2 ${
                  i === index ? "ring-[hsl(var(--color-accent))]" : "ring-transparent"
                }`}
              />
            ) : (
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[hsl(var(--color-accent))] to-[hsl(var(--color-accent-warm))] text-xs font-bold text-white ring-2 ${
                  i === index ? "ring-[hsl(var(--color-accent))]" : "ring-transparent"
                }`}
              >
                {t.authorName.charAt(0)}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
