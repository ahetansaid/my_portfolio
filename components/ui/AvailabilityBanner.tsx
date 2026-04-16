"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type Availability = {
  status: "available" | "on_mission" | "unavailable";
  message: string | null;
  nextAvailableDate: string | null;
};

const config = {
  available: { dot: "bg-green-500", label: "Disponible", ring: "ring-green-500/20" },
  on_mission: { dot: "bg-yellow-500", label: "En mission", ring: "ring-yellow-500/20" },
  unavailable: { dot: "bg-red-500", label: "Indisponible", ring: "ring-red-500/20" },
};

export function AvailabilityBanner() {
  const [data, setData] = useState<Availability | null>(null);

  useEffect(() => {
    fetch("/api/availability")
      .then((r) => r.json())
      .then(setData)
      .catch(() => null);
  }, []);

  if (!data) return null;
  const c = config[data.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`inline-flex items-center gap-2 rounded-full border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))]/80 px-4 py-1.5 text-xs font-medium text-[hsl(var(--color-foreground))] backdrop-blur ring-4 ${c.ring}`}
    >
      <span className="relative flex h-2 w-2">
        <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${c.dot} opacity-75`} />
        <span className={`relative inline-flex h-2 w-2 rounded-full ${c.dot}`} />
      </span>
      <span className="font-semibold">{c.label}</span>
      {data.message && <span className="text-[hsl(var(--color-muted))]">· {data.message}</span>}
    </motion.div>
  );
}
