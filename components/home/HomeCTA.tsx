"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function HomeCTA() {
  return (
    <section className="section-padding">
      <div className="container-tight">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-[hsl(var(--color-surface-muted))] bg-gradient-to-br from-[hsl(var(--color-accent))]/10 via-[hsl(var(--color-surface))] to-[hsl(var(--color-accent-warm))]/10 p-10 text-center sm:p-16"
        >
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--color-accent))/0.15,transparent_50%),radial-gradient(circle_at_70%_80%,hsl(var(--color-accent-warm))/0.15,transparent_50%)]" />

          <h2 className="font-display text-3xl font-bold text-[hsl(var(--color-foreground))] sm:text-5xl">
            Un projet en tête ?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[hsl(var(--color-muted))] sm:text-lg">
            Réservons 30 minutes pour en discuter. Sans engagement, sans blabla — on parle de
            votre problème et je vous dis franchement si je peux vous aider.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/booking" className="btn-cta">
              📅 Prendre un RDV
            </Link>
            <Link href="/contact" className="btn-outline">
              Envoyer un message
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
