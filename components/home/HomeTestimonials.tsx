"use client";

import { motion } from "framer-motion";
import { TestimonialsCarousel } from "@/components/ui/TestimonialsCarousel";

export function HomeTestimonials() {
  return (
    <section className="section-padding border-t border-[hsl(var(--color-surface-muted))]">
      <div className="container-tight">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="font-display text-3xl font-bold text-[hsl(var(--color-foreground))] sm:text-4xl">
            Ce qu&apos;ils disent de mon travail
          </h2>
          <p className="mt-3 text-[hsl(var(--color-muted))]">
            Retours de clients et partenaires avec qui j&apos;ai collaboré.
          </p>
        </motion.div>
        <TestimonialsCarousel />
      </div>
    </section>
  );
}
