"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AvailabilityBanner } from "@/components/ui/AvailabilityBanner";
import { CurrentlyBuilding } from "@/components/ui/CurrentlyBuilding";
import { StatsGrid } from "@/components/ui/StatsGrid";
import { fadeUp, stagger } from "@/lib/motion";

export function HomeHero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-[hsl(var(--color-accent))] opacity-10 blur-[140px]" />
        <div className="absolute right-1/4 top-40 h-[320px] w-[320px] rounded-full bg-[hsl(var(--color-accent-warm))] opacity-10 blur-[120px]" />
      </div>

      <div className="container-tight pt-20 pb-16 sm:pt-28 sm:pb-24">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-4xl text-center"
        >
          <motion.div variants={fadeUp} className="mb-4 flex flex-wrap justify-center gap-3">
            <AvailabilityBanner />
            <CurrentlyBuilding />
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="font-display text-4xl font-bold tracking-tight text-[hsl(var(--color-foreground))] sm:text-6xl lg:text-7xl"
          >
            Je construis des{" "}
            <span className="text-gradient">systèmes métier</span>
            <br className="hidden sm:block" />
            {" qui ne cassent pas."}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-6 max-w-2xl text-lg text-[hsl(var(--color-muted))] sm:text-xl"
          >
            Intégrateur SI & développeur full-stack. Je conçois et déploie des plateformes SaaS,
            ERP et GED pour des organisations qui ne peuvent pas se permettre l&apos;échec.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/booking" className="btn-cta">
              Prendre un rendez-vous
            </Link>
            <Link href="/projects" className="btn-outline">
              Voir mes réalisations
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mx-auto mt-20 max-w-4xl"
        >
          <StatsGrid />
        </motion.div>
      </div>
    </section>
  );
}
