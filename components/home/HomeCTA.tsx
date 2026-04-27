"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export function HomeCTA() {
  const t = useTranslations("homeCta");
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
            {t("title")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[hsl(var(--color-muted))] sm:text-lg">
            {t("subtitle")}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/booking" className="btn-cta">
              {t("ctaPrimary")}
            </Link>
            <Link href="/contact" className="btn-outline">
              {t("ctaSecondary")}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
