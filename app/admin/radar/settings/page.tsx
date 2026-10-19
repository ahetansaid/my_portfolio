"use client";

import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api-client";
import { useToast } from "@/components/admin/Toaster";

const inputClass =
  "w-full rounded-lg border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] px-3 py-2 text-sm text-[hsl(var(--color-foreground))] placeholder:text-[hsl(var(--color-muted))] focus:border-[hsl(var(--color-accent))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--color-accent))]/20";

type Profile = {
  profileText: string;
  englishLevel: string;
  weights: Record<string, number>;
  fitThreshold: number;
  digestDay: number;
};

const WEIGHT_LABELS: { key: string; label: string }[] = [
  { key: "smartPortsAlignment", label: "Alignement Smart Ports / maritime / data-IA" },
  { key: "eligibility", label: "Éligibilité (Bénin, diplôme, expérience)" },
  { key: "languageFeasibility", label: "Faisabilité linguistique" },
  { key: "timing", label: "Timing / deadline & phase-roadmap" },
  { key: "strategicValue", label: "Valeur stratégique (réseau, prestige, financement)" },
];

const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

export default function RadarSettingsPage() {
  const toast = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.get<{ profile: Profile | null }>("/api/radar/settings");
        setProfile(
          data.profile ?? {
            profileText: "",
            englishLevel: "A1",
            weights: { smartPortsAlignment: 40, eligibility: 15, languageFeasibility: 15, timing: 15, strategicValue: 15 },
            fitThreshold: 70,
            digestDay: 1,
          }
        );
      } catch (err) {
        toast.error(err instanceof ApiError ? err.message : "Impossible de charger les réglages.");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    try {
      await api.put("/api/radar/settings", profile);
      toast.success("Réglages enregistrés — le prochain scoring les appliquera.");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !profile) {
    return <p className="text-sm text-[hsl(var(--color-muted))]">Chargement…</p>;
  }

  const weightSum = WEIGHT_LABELS.reduce((s, w) => s + (Number(profile.weights[w.key]) || 0), 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-[hsl(var(--color-foreground))]">⚙️ Réglages Career Radar</h1>
        <p className="mt-1 text-sm text-[hsl(var(--color-muted))]">
          Profil de scoring, pondération, seuil d&apos;alerte email et digest. Source de vérité : <code>RadarProfile</code>.
        </p>
      </div>

      <form onSubmit={save} className="space-y-8">
        <div className="rounded-xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-6 shadow-sm">
          <h2 className="mb-4 font-display text-lg font-semibold text-[hsl(var(--color-foreground))]">
            Pondération du scoring (Flux A)
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {WEIGHT_LABELS.map((w) => (
              <div key={w.key}>
                <label className="mb-1 block text-sm font-medium text-[hsl(var(--color-foreground))]">{w.label}</label>
                <input
                  className={inputClass}
                  type="number"
                  min={0}
                  max={100}
                  value={profile.weights[w.key] ?? 0}
                  onChange={(e) =>
                    setProfile({ ...profile, weights: { ...profile.weights, [w.key]: Number(e.target.value) } })
                  }
                />
              </div>
            ))}
          </div>
          <p className={`mt-3 text-xs font-semibold ${weightSum === 100 ? "text-green-600" : "text-amber-600"}`}>
            Total : {weightSum}/100 {weightSum === 100 ? "✓" : "— la spec recommande 100"}
          </p>
        </div>

        <div className="rounded-xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-6 shadow-sm">
          <h2 className="mb-4 font-display text-lg font-semibold text-[hsl(var(--color-foreground))]">
            Alertes &amp; profil linguistique
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-[hsl(var(--color-foreground))]">
                Seuil d&apos;alerte email (fitScore)
              </label>
              <input
                className={inputClass}
                type="number"
                min={0}
                max={100}
                value={profile.fitThreshold}
                onChange={(e) => setProfile({ ...profile, fitThreshold: Number(e.target.value) })}
              />
              <p className="mt-1 text-xs text-[hsl(var(--color-muted))]">Alerte instantanée Flux A si score ≥ seuil.</p>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[hsl(var(--color-foreground))]">Niveau d&apos;anglais courant</label>
              <select
                className={inputClass}
                value={profile.englishLevel}
                onChange={(e) => setProfile({ ...profile, englishLevel: e.target.value })}
              >
                {["A1", "A2", "B1", "B2", "C1", "C2"].map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
              <p className="mt-1 text-xs text-[hsl(var(--color-muted))]">Ajuste la faisabilité linguistique (flag, pas exclusion).</p>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[hsl(var(--color-foreground))]">Jour du digest hebdo</label>
              <select
                className={inputClass}
                value={profile.digestDay}
                onChange={(e) => setProfile({ ...profile, digestDay: Number(e.target.value) })}
              >
                {DAYS.map((d, i) => (
                  <option key={d} value={i + 1}>{d}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-6 shadow-sm">
          <h2 className="mb-4 font-display text-lg font-semibold text-[hsl(var(--color-foreground))]">
            Profil de référence (injecté aux prompts IA)
          </h2>
          <textarea
            className={`${inputClass} min-h-[320px] font-mono text-xs leading-relaxed`}
            value={profile.profileText}
            onChange={(e) => setProfile({ ...profile, profileText: e.target.value })}
          />
          <p className="mt-1 text-xs text-[hsl(var(--color-muted))]">
            CV + roadmap compilés. Seul endroit à éditer pour recalibrer tout le scoring ; utiliser « Ré-scorer » ensuite.
          </p>
        </div>

        <div>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-[hsl(var(--color-accent-warm))] px-4 py-2 text-sm font-semibold text-[hsl(var(--color-accent-warm-foreground))] shadow-sm transition hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Enregistrement…" : "Enregistrer les réglages"}
          </button>
        </div>
      </form>
    </div>
  );
}
