"use client";

import { useEffect, useState } from "react";

const inputClass =
  "w-full rounded-lg border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] px-3 py-2 text-sm text-[hsl(var(--color-foreground))] placeholder:text-[hsl(var(--color-muted))] focus:border-[hsl(var(--color-accent))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--color-accent))]/20";

export default function AdminSettingsPage() {
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
  const [savedA, setSavedA] = useState(false);
  const [savedS, setSavedS] = useState(false);

  useEffect(() => {
    (async () => {
      const [a, s] = await Promise.all([
        fetch("/api/availability").then((r) => r.json()),
        fetch("/api/stats").then((r) => r.json()),
      ]);
      setAvailability({
        status: a.status ?? "available",
        message: a.message ?? "",
        nextAvailableDate: a.nextAvailableDate ? a.nextAvailableDate.split("T")[0] : "",
      });
      setStats({
        projectsShipped: s.projectsShipped ?? 0,
        yearsExperience: s.yearsExperience ?? 0,
        domainsCovered: s.domainsCovered ?? 0,
        clientsServed: s.clientsServed ?? 0,
        currentlyBuilding: s.currentlyBuilding ?? "",
      });
    })();
  }, []);

  const saveAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/availability", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(availability),
    });
    setSavedA(true);
    setTimeout(() => setSavedA(false), 2000);
  };

  const saveStats = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/stats", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(stats),
    });
    setSavedS(true);
    setTimeout(() => setSavedS(false), 2000);
  };

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl font-bold text-[hsl(var(--color-foreground))]">Paramètres du site</h1>

      {/* AVAILABILITY */}
      <div className="rounded-xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-6 shadow-sm">
        <h2 className="font-display text-lg font-semibold text-[hsl(var(--color-foreground))] mb-4">
          Statut de disponibilité
        </h2>
        <form onSubmit={saveAvailability} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">Statut</label>
            <select
              className={inputClass}
              value={availability.status}
              onChange={(e) => setAvailability({ ...availability, status: e.target.value as typeof availability.status })}
            >
              <option value="available">🟢 Disponible</option>
              <option value="on_mission">🟡 En mission (ouvert à discussion)</option>
              <option value="unavailable">🔴 Indisponible</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">Message affiché</label>
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
              onChange={(e) => setAvailability({ ...availability, nextAvailableDate: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="rounded-lg bg-[hsl(var(--color-accent-warm))] px-4 py-2 text-sm font-medium text-[hsl(var(--color-accent-warm-foreground))] hover:opacity-90 transition"
            >
              Enregistrer
            </button>
            {savedA && <span className="text-sm text-green-600">✓ Enregistré</span>}
          </div>
        </form>
      </div>

      {/* STATS */}
      <div className="rounded-xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-6 shadow-sm">
        <h2 className="font-display text-lg font-semibold text-[hsl(var(--color-foreground))] mb-4">
          Chiffres clés & statut live
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
              <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">Projets livrés</label>
              <input
                className={inputClass}
                type="number"
                value={stats.projectsShipped}
                onChange={(e) => setStats({ ...stats, projectsShipped: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">Années d&apos;expérience</label>
              <input
                className={inputClass}
                type="number"
                value={stats.yearsExperience}
                onChange={(e) => setStats({ ...stats, yearsExperience: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">Domaines couverts</label>
              <input
                className={inputClass}
                type="number"
                value={stats.domainsCovered}
                onChange={(e) => setStats({ ...stats, domainsCovered: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">Clients servis</label>
              <input
                className={inputClass}
                type="number"
                value={stats.clientsServed}
                onChange={(e) => setStats({ ...stats, clientsServed: Number(e.target.value) })}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="rounded-lg bg-[hsl(var(--color-accent-warm))] px-4 py-2 text-sm font-medium text-[hsl(var(--color-accent-warm-foreground))] hover:opacity-90 transition"
            >
              Enregistrer
            </button>
            {savedS && <span className="text-sm text-green-600">✓ Enregistré</span>}
          </div>
        </form>
      </div>
    </div>
  );
}
