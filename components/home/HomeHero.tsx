"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { AvailabilityBanner } from "@/components/ui/AvailabilityBanner";
import { CurrentlyBuilding } from "@/components/ui/CurrentlyBuilding";
import { StatsGrid } from "@/components/ui/StatsGrid";
import { fadeUp, stagger } from "@/lib/motion";

const STACK_ITEMS = [
  { emoji: "⚙️", title: "DGMS Fleet", meta: "Django + Next.js", tone: "from-[hsl(var(--color-accent))]/20 to-transparent" },
  { emoji: "📊", title: "ERP sur mesure", meta: "NestJS + MySQL", tone: "from-[hsl(var(--color-accent-warm))]/20 to-transparent" },
  { emoji: "🤖", title: "GED Intelligent", meta: "OCR · ML · Elasticsearch", tone: "from-[hsl(var(--color-electric))]/20 to-transparent" },
  { emoji: "🔐", title: "WorkPulse", meta: "QR anti-fraude", tone: "from-[hsl(var(--color-accent))]/20 to-transparent" },
];

export function HomeHero() {
  const t = useTranslations("home");
  return (
    <section className="relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-[10%] top-0 h-[540px] w-[540px] rounded-full bg-[hsl(var(--color-accent))] opacity-[0.14] blur-[140px]" />
        <div className="absolute right-[5%] top-40 h-[420px] w-[420px] rounded-full bg-[hsl(var(--color-accent-warm))] opacity-[0.12] blur-[130px]" />
        <div className="absolute left-1/2 bottom-0 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-[hsl(var(--color-electric))] opacity-[0.08] blur-[120px]" />
      </div>

      <div className="container-tight pt-20 pb-16 sm:pt-28 sm:pb-24">
        {/* LAYOUT ASYMÉTRIQUE — gauche: pitch · droite: stack */}
        <div className="grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-16 lg:items-center">
          {/* === LEFT — PITCH === */}
          <motion.div variants={stagger} initial="hidden" animate="visible">
            <motion.div variants={fadeUp} className="mb-5 flex flex-wrap gap-2.5">
              <AvailabilityBanner />
              <CurrentlyBuilding />
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--color-electric))]/30 bg-[hsl(var(--color-electric))]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[hsl(var(--color-electric))]"
            >
              <motion.span
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
                className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--color-electric))]"
              />
              {t("badge")}
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="font-display text-[2.75rem] font-extrabold leading-[1] tracking-tight text-[hsl(var(--color-foreground))] sm:text-6xl md:text-7xl lg:text-[5rem] xl:text-[5.5rem]"
            >
              {t("titlePrefix")}{" "}
              <span className="relative inline-block">
                <span className="text-gradient">{t("titleHighlight")}</span>
                <motion.span
                  aria-hidden
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute -bottom-1 left-0 h-1 w-full origin-left rounded-full bg-gradient-to-r from-[hsl(var(--color-accent))] via-[hsl(var(--color-accent-warm))] to-[hsl(var(--color-electric))]"
                />
              </span>
              <br className="hidden sm:block" />
              {" " + t("titleMiddle") + " "}
              <span className="italic font-light text-[hsl(var(--color-muted))]">{t("titleItalic")}</span>{" "}
              {t("titleSuffix")}
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-8 max-w-xl text-lg leading-relaxed text-[hsl(var(--color-muted))]"
            >
              {t("description1")}{" "}
              <strong className="text-[hsl(var(--color-foreground))]">
                {t("descriptionStrong")}
              </strong>
              {" " + t("description2") + " "}
              <span className="line-through opacity-60">{t("descriptionStrike")}</span>
              {t("description3")}
            </motion.p>

            <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-4">
              <Link href="/booking" className="btn-cta group">
                <span>{t("ctaPrimary")}</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
              <Link href="/projects" className="btn-outline">
                {t("ctaSecondary")}
              </Link>
            </motion.div>

            {/* Micro-proof row */}
            <motion.div
              variants={fadeUp}
              className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[hsl(var(--color-muted))]"
            >
              <span className="flex items-center gap-1.5">
                <span className="text-[hsl(var(--color-electric))]">●</span> {t("proof1")}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-[hsl(var(--color-accent-warm))]">●</span> {t("proof2")}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-[hsl(var(--color-accent))]">●</span> {t("proof3")}
              </span>
            </motion.div>
          </motion.div>

          {/* === RIGHT — FLOATING STACK CARDS === */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden lg:block"
          >
            <div className="relative mx-auto aspect-square max-w-md">
              {/* Rotation subtile de l'ensemble */}
              <motion.div
                animate={{ rotate: [-1, 1, -1] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                {STACK_ITEMS.map((item, i) => {
                  const rotations = [-8, 4, -4, 8];
                  const offsets = [
                    { top: "0%", left: "10%" },
                    { top: "20%", left: "40%" },
                    { top: "50%", left: "5%" },
                    { top: "60%", left: "45%" },
                  ];
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20, rotate: 0 }}
                      animate={{
                        opacity: 1,
                        y: [0, -8, 0],
                        rotate: rotations[i],
                      }}
                      transition={{
                        opacity: { delay: 0.5 + i * 0.15 },
                        y: { duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 },
                        rotate: { delay: 0.5 + i * 0.15, duration: 0.6 },
                      }}
                      whileHover={{ rotate: 0, scale: 1.05, zIndex: 50 }}
                      className={`absolute w-56 rounded-2xl border border-[hsl(var(--color-surface-muted))] bg-gradient-to-br ${item.tone} bg-[hsl(var(--color-surface))] p-5 shadow-xl backdrop-blur-sm`}
                      style={offsets[i]}
                    >
                      <div className="mb-2 text-3xl">{item.emoji}</div>
                      <div className="font-display text-base font-bold text-[hsl(var(--color-foreground))]">
                        {item.title}
                      </div>
                      <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-[hsl(var(--color-muted))]">
                        {item.meta}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Central glow */}
              <div className="absolute left-1/2 top-1/2 -z-10 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-[hsl(var(--color-accent))] via-[hsl(var(--color-accent-warm))] to-[hsl(var(--color-electric))] opacity-20 blur-3xl" />
            </div>
          </motion.div>
        </div>

        {/* STATS ROW — pleine largeur */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-20 border-t border-[hsl(var(--color-surface-muted))] pt-12"
        >
          <StatsGrid />
        </motion.div>

        {/* SCROLL HINT */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="mt-16 flex flex-col items-center gap-2 text-xs uppercase tracking-widest text-[hsl(var(--color-muted))]"
        >
          <span>{t("scrollHint")}</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="h-8 w-[2px] bg-gradient-to-b from-[hsl(var(--color-accent))] to-transparent"
          />
        </motion.div>
      </div>
    </section>
  );
}
