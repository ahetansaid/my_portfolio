"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CountUp } from "./CountUp";
import { stagger, fadeUp } from "@/lib/motion";

type Stats = {
  projectsShipped: number;
  yearsExperience: number;
  domainsCovered: number;
  clientsServed: number;
};

export function StatsGrid() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => null);
  }, []);

  if (!stats) return null;

  const items = [
    { value: stats.projectsShipped, label: "Projets livrés", suffix: "+" },
    { value: stats.yearsExperience, label: "Années d'expérience", suffix: "" },
    { value: stats.domainsCovered, label: "Domaines maîtrisés", suffix: "" },
    { value: stats.clientsServed, label: "Clients satisfaits", suffix: "+" },
  ];

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="grid grid-cols-2 gap-6 sm:grid-cols-4"
    >
      {items.map((it) => (
        <motion.div key={it.label} variants={fadeUp} className="text-center">
          <div className="font-display text-4xl font-bold text-[hsl(var(--color-accent))] sm:text-5xl">
            <CountUp value={it.value} suffix={it.suffix} />
          </div>
          <div className="mt-1 text-xs font-medium uppercase tracking-wide text-[hsl(var(--color-muted))] sm:text-sm">
            {it.label}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
