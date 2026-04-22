"use client";

import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api-client";
import { useToast } from "@/components/admin/Toaster";

const inputClass =
  "w-full rounded-lg border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] px-3 py-2 text-sm text-[hsl(var(--color-foreground))] placeholder:text-[hsl(var(--color-muted))] focus:border-[hsl(var(--color-accent))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--color-accent))]/20";

export default function AdminSettingsPage() {
  const toast = useToast();
  const [availability, setAvailability] = useState({
    status: "available" as "available" | "on_mission" | "unavailable",
    message: "",
    nextAvailableDate: "",
  });
  const [stats, setStats] = useState({
    projectsShipped: 0,
    yearsExperience: 0,
    domainsCovered: 0,
    clientsServed: 0,
    currentlyBuilding: "",
  });
  const [savingA, setSavingA] = useState(false);
  const [savingS, setSavingS] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [a, s] = await Promise.all([
          api.get<{
            status?: string;
            message?: string | null;
            nextAvailableDate?: string | null;
          }>("/api/availability", { redirectOn401: false }),
          api.get<{
            projectsShipped?: number;
            yearsExperience?: number;
            domainsCovered?: number;
            clientsServed?: number;
            currentlyBuilding?: string | null;
          }>("/api/stats", { redirectOn401: false }),
        ]);
        setAvailability({
          status: (a?.status as "available" | "on_mission" | "unavailable") ?? "available",
          message: a?.message ?? "",
          nextAvailableDate: a?.nextAvailableDate
            ? String(a.nextAvailableDate).split("T")[0]
            : "",
        });
        setStats({
          projectsShipped: s?.projectsShipped ?? 0,
          yearsExperience: s?.yearsExperience ?? 0,
          domainsCovered: s?.domainsCovered ?? 0,
          clientsServed: s?.clientsServed ?? 0,
          currentlyBuilding: s?.currentlyBuilding ?? "",
        });
      } catch {
        // silent
      }
    })();
  }, []);

  const saveAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingA(true);
    try {
      await api.put("/api/availability", availability);
      toast.success("Disponibilité enregistrée.");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Erreur lors de l'enregistrement.");
    } finally {
      setSavingA(false);
    }
  };

  const saveStats = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingS(true);
    try {
      await api.put("/api/stats", stats);
      toast.success("Chiffres enregistrés.");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Erreur lors de l'enregistrement.");
    } finally {
      setSavingS(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-[hsl(var(--color-foreground))]">
          Paramètres du site
        </h1>
        <p className="mt-1 text-sm text-[hsl(var(--color-muted))]">
          Disponibilité publique et chiffres affichés sur la home.
        </p>
      </div>

      <div className="rounded-xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-6 shadow-sm">
        <h2 className="font-display text-lg font-semibold text-[hsl(var(--color-foreground))] mb-4">
          Statut de disponibilité
        </h2>
        <form onSubmit={saveAvailability} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">
              Statut
            </label>
            <select
              className={inputClass}
              value={availability.status}
              onChange={(e) =>
                setAvailability({
                  ...availability,
                  status: e.target.value as typeof availability.status,
                })
              }
            >
              <option value="available">🟢 Disponible</option>
              <option value="on_mission">🟡 En mission (ouvert à discussion)</option>
              <option value="unavailable">🔴 Indisponible</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">
              Message affiché
            </label>
            <input
              className={inputClass}
              placeholder="Disponible pour une nouvelle mission dès mai 2026"
              value={availability.message}
              onChange={(e) => setAvailability({ ...availability, message: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">
              Prochaine disponibilité (optionnel)
            </label>
            <input
              className={inputClass}
              type="date"
              value={availability.nextAvailableDate}
              onChange={(e) =>
                setAvailability({ ...availability, nextAvailableDate: e.target.value })
              }
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={savingA}
              className="rounded-lg bg-[hsl(var(--color-accent-warm))] px-4 py-2 text-sm font-semibold text-[hsl(var(--color-accent-warm-foreground))] shadow-sm transition hover:opacity-90 disabled:opacity-60"
            >
              {savingA ? "Enregistrement…" : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-6 shadow-sm">
        <h2 className="font-display text-lg font-semibold text-[hsl(var(--color-foreground))] mb-4">
          Chiffres clés &amp; statut live
        </h2>
        <form onSubmit={saveStats} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">
              🛠 En ce moment je construis
            </label>
            <input
              className={inputClass}
              placeholder="Ex: FleetPulse v2 — SaaS gestion de flotte"
              value={stats.currentlyBuilding}
              onChange={(e) => setStats({ ...stats, currentlyBuilding: e.target.value })}
            />
            <p className="mt-1 text-xs text-[hsl(var(--color-muted))]">
              Affiché dans un bandeau animé sur la home page. Laisser vide pour cacher.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">
                Projets livrés
              </label>
              <input
                className={inputClass}
                type="number"
                value={stats.projectsShipped}
                onChange={(e) =>
                  setStats({ ...stats, projectsShipped: Number(e.target.value) })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">
                Années d&apos;expérience
              </label>
              <input
                className={inputClass}
                type="number"
                value={stats.yearsExperience}
                onChange={(e) =>
                  setStats({ ...stats, yearsExperience: Number(e.target.value) })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">
                Domaines couverts
              </label>
              <input
                className={inputClass}
                type="number"
                value={stats.domainsCovered}
                onChange={(e) => setStats({ ...stats, domainsCovered: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">
                Clients servis
              </label>
              <input
                className={inputClass}
                type="number"
                value={stats.clientsServed}
                onChange={(e) => setStats({ ...stats, clientsServed: Number(e.target.value) })}
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={savingS}
              className="rounded-lg bg-[hsl(var(--color-accent-warm))] px-4 py-2 text-sm font-semibold text-[hsl(var(--color-accent-warm-foreground))] shadow-sm transition hover:opacity-90 disabled:opacity-60"
            >
              {savingS ? "Enregistrement…" : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
