"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/admin/Toaster";

export function RadarActions({ unscoredCount }: { unscoredCount: number }) {
  const router = useRouter();
  const toast = useToast();
  const [scanning, setScanning] = useState(false);
  const [rescoring, setRescoring] = useState(false);

  async function run(path: string, label: string, setBusy: (b: boolean) => void) {
    setBusy(true);
    try {
      const res = await fetch(path, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.ok === false) {
        throw new Error(data.error || `Échec ${label}`);
      }
      if (path.includes("ingest")) {
        toast.success(`Scan terminé · ${data.created ?? 0} scorées, ${data.createdUnscored ?? 0} non-scorées, ${data.skipped ?? 0} doublons`);
      } else {
        toast.success(`Ré-scoring · ${data.rescored ?? 0} enrichies, ${data.errors ?? 0} erreurs`);
      }
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : `Erreur ${label}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        disabled={scanning}
        onClick={() => run("/api/radar/ingest", "scan", setScanning)}
        className="rounded-lg bg-[hsl(var(--color-accent))] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
      >
        {scanning ? "Scan en cours…" : "📡 Lancer un scan"}
      </button>
      {unscoredCount > 0 && (
        <button
          type="button"
          disabled={rescoring}
          onClick={() => run("/api/radar/rescore", "ré-scoring", setRescoring)}
          className="rounded-lg border border-[hsl(var(--color-surface-muted))] px-4 py-2 text-sm font-semibold text-[hsl(var(--color-foreground))] transition hover:bg-[hsl(var(--color-surface-muted))] disabled:opacity-50"
        >
          {rescoring ? "Ré-scoring…" : `🤖 Ré-scorer (${unscoredCount})`}
        </button>
      )}
    </div>
  );
}
