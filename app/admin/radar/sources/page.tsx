"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api-client";
import { useToast } from "@/components/admin/Toaster";

type SourceRow = {
  id: number | null;
  name: string;
  type: string;
  url: string;
  isActive: boolean;
  lastStatus: string | null;
  lastFetchedAt: string | null;
  opportunities: number;
};

function fmtDateTime(iso: string | null) {
  if (!iso) return "jamais";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
  }).format(new Date(iso));
}

export default function RadarSourcesPage() {
  const router = useRouter();
  const toast = useToast();
  const [sources, setSources] = useState<SourceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await api.get<{ sources: SourceRow[] }>("/api/radar/sources");
      setSources(data.sources);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Impossible de charger les sources.");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggle = async (s: SourceRow) => {
    if (s.id === null) {
      toast.error("Source pas encore synchronisée en base — lance un scan d'abord.");
      return;
    }
    setTogglingId(s.id);
    try {
      await api.patch("/api/radar/sources", { id: s.id, isActive: !s.isActive });
      setSources((prev) => prev.map((x) => (x.id === s.id ? { ...x, isActive: !s.isActive } : x)));
      toast.success(`« ${s.name} » ${!s.isActive ? "activée" : "désactivée"}.`);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Erreur lors du changement d'état.");
    } finally {
      setTogglingId(null);
    }
  };

  const scan = async () => {
    setScanning(true);
    try {
      const data = await api.post<{ ok?: boolean; error?: string; created?: number; createdUnscored?: number; skipped?: number; errors?: number }>("/api/radar/ingest");
      toast.success(`Scan terminé · ${data.created ?? 0} scorées, ${data.createdUnscored ?? 0} non-scorées, ${data.skipped ?? 0} doublons, ${data.errors ?? 0} erreurs`);
      await load();
      router.refresh();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Échec du scan.");
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[hsl(var(--color-foreground))]">☁️ Sources du radar</h1>
          <p className="mt-1 text-sm text-[hsl(var(--color-muted))]">
            Registre des flux interrogés par l&apos;ingestion. L&apos;activation/désactivation est persistée en base ;
            la liste de référence vit dans <code>lib/radar/sources.ts</code>.
          </p>
        </div>
        <button
          type="button"
          disabled={scanning}
          onClick={scan}
          className="rounded-lg bg-[hsl(var(--color-accent))] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {scanning ? "Scan en cours…" : "📡 Lancer un scan"}
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-[hsl(var(--color-muted))]">Chargement…</p>
      ) : (
        <div className="grid gap-4">
          {sources.map((s) => {
            const statusOk = s.lastStatus?.startsWith("ok");
            const statusErr = s.lastStatus?.startsWith("error");
            return (
              <article
                key={s.name}
                className={`rounded-2xl border bg-[hsl(var(--color-surface))] p-5 shadow-sm ${
                  s.isActive ? "border-[hsl(var(--color-surface-muted))]" : "border-dashed opacity-60"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-display text-base font-bold text-[hsl(var(--color-foreground))]">{s.name}</h2>
                      <span className="rounded-full border border-[hsl(var(--color-surface-muted))] px-2 py-0.5 text-[11px] font-semibold uppercase text-[hsl(var(--color-muted))]">
                        {s.type}
                      </span>
                      <span className="rounded-full bg-[hsl(var(--color-surface-muted))] px-2 py-0.5 text-[11px] font-semibold text-[hsl(var(--color-muted))]">
                        {s.opportunities} opportunité(s)
                      </span>
                    </div>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener"
                      className="mt-1 block truncate text-xs text-[hsl(var(--color-accent))] hover:underline"
                    >
                      {s.url}
                    </a>
                  </div>
                  <button
                    type="button"
                    disabled={togglingId === s.id}
                    onClick={() => toggle(s)}
                    className={`shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition disabled:opacity-50 ${
                      s.isActive
                        ? "border border-[hsl(var(--color-surface-muted))] text-[hsl(var(--color-foreground))] hover:bg-[hsl(var(--color-surface-muted))]"
                        : "bg-[hsl(var(--color-accent))] text-white hover:opacity-90"
                    }`}
                  >
                    {togglingId === s.id ? "…" : s.isActive ? "Désactiver" : "Activer"}
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                  <span className="text-[hsl(var(--color-muted))]">Dernier fetch : {fmtDateTime(s.lastFetchedAt)}</span>
                  {s.lastStatus && (
                    <span className={statusOk ? "font-semibold text-green-600" : statusErr ? "font-semibold text-red-500" : "text-[hsl(var(--color-muted))]"}>
                      {s.lastStatus}
                    </span>
                  )}
                  {s.id === null && (
                    <span className="text-amber-600">en attente du premier scan</span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
