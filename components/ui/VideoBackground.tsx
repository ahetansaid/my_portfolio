"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const VIDEOS = [
  { src: "/videos/circuit.mp4" },
  { src: "/videos/robot.mp4" },
  { src: "/videos/tech3.mp4" },
];

const ROTATION_MS = 18000;
const INIT_DELAY_MS = 2500; // attente avant d'injecter la vidéo pour ne pas bloquer le 1er rendu

export function VideoBackground() {
  const [index, setIndex] = useState(0);
  const [enabled, setEnabled] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Détection desktop / connexion / a11y + délai pour ne pas bloquer le first paint
  useEffect(() => {
    if (typeof window === "undefined") return;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // @ts-expect-error - navigator.connection est non standard
    const conn = navigator.connection;
    const slowConnection =
      conn &&
      (conn.effectiveType === "2g" ||
        conn.effectiveType === "3g" ||
        conn.saveData === true);

    const isEnabled = !isMobile && !prefersReduced && !slowConnection;
    setEnabled(isEnabled);

    if (!isEnabled) return;

    // Attend que le thread principal soit libre avant de charger la 1re vidéo
    const requestIdle =
      typeof (window as unknown as { requestIdleCallback?: (cb: () => void) => number })
        .requestIdleCallback === "function"
        ? (window as unknown as { requestIdleCallback: (cb: () => void) => number })
            .requestIdleCallback
        : (cb: () => void) => window.setTimeout(cb, 1);

    const timer = window.setTimeout(() => {
      requestIdle(() => setMounted(true));
    }, INIT_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, []);

  // Rotation automatique (seulement une fois monté)
  useEffect(() => {
    if (!enabled || !mounted) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % VIDEOS.length);
    }, ROTATION_MS);
    return () => clearInterval(timer);
  }, [enabled, mounted]);

  // Fond de base toujours présent (chargement instantané, pas de FOUC)
  const baseBg = (
    <>
      <div className="absolute inset-0 bg-[hsl(var(--color-surface))]" />
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--color-accent))]/5 via-transparent to-[hsl(var(--color-accent-warm))]/5" />
    </>
  );

  // Mobile / reduce motion / connexion lente → juste le fond, pas de vidéo
  if (!enabled) {
    return (
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        {baseBg}
      </div>
    );
  }

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {baseBg}

      {/* Vidéo injectée seulement après INIT_DELAY + idle (pas de blocage du 1er paint) */}
      {mounted && (
        <AnimatePresence mode="sync">
          <motion.video
            key={VIDEOS[index].src}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src={VIDEOS[index].src} type="video/mp4" />
          </motion.video>
        </AnimatePresence>
      )}

      {/* OVERLAY 1 — tint de marque (Indigo → Coral) mix */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--color-accent))]/25 via-transparent to-[hsl(var(--color-accent-warm))]/20 mix-blend-multiply dark:mix-blend-overlay" />

      {/* OVERLAY 2 — voile surface pour lisibilité (réduit : vidéos plus visibles) */}
      <div className="absolute inset-0 bg-[hsl(var(--color-surface))]/45 dark:bg-[hsl(var(--color-surface))]/55" />

      {/* OVERLAY 3 — touche lime subtile */}
      <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--color-electric))]/8 via-transparent to-transparent" />

      {/* Vignette haut/bas allégée pour guider l'œil */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--color-surface))]/15 via-transparent to-[hsl(var(--color-surface))]/25" />
    </div>
  );
}
