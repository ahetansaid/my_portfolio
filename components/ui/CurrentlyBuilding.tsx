"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type Stats = {
  currentlyBuilding: string | null;
};

export function CurrentlyBuilding() {
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((s: Stats) => setText(s.currentlyBuilding ?? null))
      .catch(() => null);
  }, []);

  if (!text) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="inline-flex items-center gap-3 rounded-full border border-[hsl(var(--color-accent-warm))]/30 bg-[hsl(var(--color-accent-warm))]/5 px-4 py-1.5 text-xs font-medium text-[hsl(var(--color-foreground))] backdrop-blur"
    >
      <motion.span
        animate={{ rotate: [0, 15, -10, 15, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        className="text-base"
      >
        🛠
      </motion.span>
      <span>
        <span className="font-semibold text-[hsl(var(--color-accent-warm))]">En ce moment :</span>{" "}
        <span className="text-[hsl(var(--color-muted))]">{text}</span>
      </span>
    </motion.div>
  );
}
