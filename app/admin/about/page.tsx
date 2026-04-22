"use client";

import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api-client";
import { useToast } from "@/components/admin/Toaster";

type TimelineItem = {
  id: number;
  year: string;
  title: string;
  description: string;
  sortOrder: number;
};
type AboutValue = { id: number; title: string; description: string; sortOrder: number };

const inputClass =
  "w-full rounded-lg border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] px-3 py-2 text-sm text-[hsl(var(--color-foreground))] placeholder:text-[hsl(var(--color-muted))] focus:border-[hsl(var(--color-accent))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--color-accent))]/20";

function ItemForm<T extends { id: number }>({
  title,
  fields,
  editingItem,
  onSave,
  onCancel,
}: {
  title: string;
  fields: { key: string; label: string; multiline?: boolean; type?: string }[];
  editingItem: Partial<T> | null;
  onSave: (data: Record<string, string | number>) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Record<string, string | number>>(() => {
    const init: Record<string, string | number> = { sortOrder: 0 };
    fields.forEach((f) => {
      init[f.key] = (editingItem as Record<string, string | number>)?.[f.key] ?? "";
    });
    if (editingItem && "sortOrder" in editingItem)
      init.sortOrder = (editingItem as Record<string, number>).sortOrder ?? 0;
    return init;
  });
  const [loading, setLoading] = useState(false);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
          await onSave(form);
        } finally {
          setLoading(false);
        }
      }}
      className="space-y-3 rounded-xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-5 shadow-sm"
    >
      <h3 className="font-display text-sm font-semibold text-[hsl(var(--color-foreground))]">
        {title}
      </h3>
      {fields.map((f) => (
        <div key={f.key}>
          <label className="block text-xs font-medium text-[hsl(var(--color-muted))] mb-1">
            {f.label}
          </label>
          {f.multiline ? (
            <textarea
              className={inputClass}
              rows={3}
              required
              value={String(form[f.key] ?? "")}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
            />
          ) : (
            <input
              className={inputClass}
              type={f.type ?? "text"}
              required={f.type !== "number"}
              value={f.type === "number" ? Number(form[f.key]) : String(form[f.key] ?? "")}
              onChange={(e) =>
                setForm({
                  ...form,
                  [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value,
                })
              }
            />
          )}
        </div>
      ))}
      <div>
        <label className="block text-xs font-medium text-[hsl(var(--color-muted))] mb-1">
          Ordre
        </label>
        <input
          className={inputClass}
          type="number"
          value={Number(form.sortOrder)}
          onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-[hsl(var(--color-accent-warm))] px-3 py-1.5 text-xs font-semibold text-[hsl(var(--color-accent-warm-foreground))] shadow-sm transition hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "…" : "Enregistrer"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-[hsl(var(--color-surface-muted))] px-3 py-1.5 text-xs font-medium text-[hsl(var(--color-muted))] transition hover:bg-[hsl(var(--color-surface-muted))]"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}

export default function AdminAboutPage() {
  const toast = useToast();
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [values, setValues] = useState<AboutValue[]>([]);
  const [editingTimeline, setEditingTimeline] = useState<Partial<TimelineItem> | null>(null);
  const [editingValue, setEditingValue] = useState<Partial<AboutValue> | null>(null);
  const [showTimelineForm, setShowTimelineForm] = useState(false);
  const [showValueForm, setShowValueForm] = useState(false);

  async function load() {
    try {
      const [t, v] = await Promise.all([
        api.get<TimelineItem[]>("/api/about/timeline", { redirectOn401: false }),
        api.get<AboutValue[]>("/api/about/values", { redirectOn401: false }),
      ]);
      setTimeline(Array.isArray(t) ? t : []);
      setValues(Array.isArray(v) ? v : []);
    } catch {
      setTimeline([]);
      setValues([]);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function saveTimeline(data: Record<string, string | number>) {
    try {
      if (editingTimeline?.id) {
        await api.put(`/api/about/timeline/${editingTimeline.id}`, data);
        toast.success("Étape mise à jour.");
      } else {
        await api.post("/api/about/timeline", data);
        toast.success("Étape ajoutée.");
      }
      setShowTimelineForm(false);
      setEditingTimeline(null);
      load();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Erreur lors de l'enregistrement.");
    }
  }

  async function saveValue(data: Record<string, string | number>) {
    try {
      if (editingValue?.id) {
        await api.put(`/api/about/values/${editingValue.id}`, data);
        toast.success("Valeur mise à jour.");
      } else {
        await api.post("/api/about/values", data);
        toast.success("Valeur ajoutée.");
      }
      setShowValueForm(false);
      setEditingValue(null);
      load();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Erreur lors de l'enregistrement.");
    }
  }

  async function deleteTimeline(id: number) {
    if (!confirm("Supprimer cet élément ?")) return;
    try {
      await api.delete(`/api/about/timeline/${id}`);
      toast.success("Étape supprimée.");
      load();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Erreur lors de la suppression.");
    }
  }

  async function deleteValue(id: number) {
    if (!confirm("Supprimer cette valeur ?")) return;
    try {
      await api.delete(`/api/about/values/${id}`);
      toast.success("Valeur supprimée.");
      load();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Erreur lors de la suppression.");
    }
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-2xl font-bold text-[hsl(var(--color-foreground))]">
          À propos — Contenu
        </h1>
        <p className="mt-1 text-sm text-[hsl(var(--color-muted))]">
          Parcours et valeurs affichés sur la page /about.
        </p>
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold text-[hsl(var(--color-foreground))]">
            Parcours (timeline) · {timeline.length}
          </h2>
          <button
            onClick={() => {
              setEditingTimeline(null);
              setShowTimelineForm(true);
            }}
            className="rounded-lg bg-[hsl(var(--color-accent-warm))] px-3 py-1.5 text-xs font-semibold text-[hsl(var(--color-accent-warm-foreground))] shadow-sm transition hover:opacity-90"
          >
            + Ajouter
          </button>
        </div>

        {showTimelineForm && (
          <div className="mb-4">
            <ItemForm<TimelineItem>
              title={editingTimeline?.id ? "Modifier l'étape" : "Nouvelle étape"}
              fields={[
                { key: "year", label: "Année / Période (ex. 2022)" },
                { key: "title", label: "Titre" },
                { key: "description", label: "Description", multiline: true },
              ]}
              editingItem={editingTimeline}
              onSave={saveTimeline}
              onCancel={() => {
                setShowTimelineForm(false);
                setEditingTimeline(null);
              }}
            />
          </div>
        )}

        <div className="space-y-2">
          {timeline.length === 0 && (
            <div className="rounded-xl border border-dashed border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-6 text-center">
              <p className="text-sm text-[hsl(var(--color-muted))]">Aucune étape.</p>
            </div>
          )}
          {timeline.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between rounded-xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] px-5 py-4 shadow-sm"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--color-accent))]">
                  {item.year}
                </p>
                <p className="font-medium text-[hsl(var(--color-foreground))]">{item.title}</p>
                <p className="text-sm text-[hsl(var(--color-muted))] mt-0.5 line-clamp-2">
                  {item.description}
                </p>
              </div>
              <div className="flex gap-2 shrink-0 ml-4">
                <button
                  onClick={() => {
                    setEditingTimeline(item);
                    setShowTimelineForm(true);
                  }}
                  className="rounded-lg border border-[hsl(var(--color-surface-muted))] px-3 py-1.5 text-xs text-[hsl(var(--color-muted))] transition hover:text-[hsl(var(--color-accent))]"
                >
                  Modifier
                </button>
                <button
                  onClick={() => deleteTimeline(item.id)}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-500 transition hover:bg-red-50"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold text-[hsl(var(--color-foreground))]">
            Valeurs / Vision · {values.length}
          </h2>
          <button
            onClick={() => {
              setEditingValue(null);
              setShowValueForm(true);
            }}
            className="rounded-lg bg-[hsl(var(--color-accent-warm))] px-3 py-1.5 text-xs font-semibold text-[hsl(var(--color-accent-warm-foreground))] shadow-sm transition hover:opacity-90"
          >
            + Ajouter
          </button>
        </div>

        {showValueForm && (
          <div className="mb-4">
            <ItemForm<AboutValue>
              title={editingValue?.id ? "Modifier la valeur" : "Nouvelle valeur"}
              fields={[
                { key: "title", label: "Titre" },
                { key: "description", label: "Description", multiline: true },
              ]}
              editingItem={editingValue}
              onSave={saveValue}
              onCancel={() => {
                setShowValueForm(false);
                setEditingValue(null);
              }}
            />
          </div>
        )}

        <div className="space-y-2">
          {values.length === 0 && (
            <div className="rounded-xl border border-dashed border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-6 text-center">
              <p className="text-sm text-[hsl(var(--color-muted))]">Aucune valeur.</p>
            </div>
          )}
          {values.map((v) => (
            <div
              key={v.id}
              className="flex items-start justify-between rounded-xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] px-5 py-4 shadow-sm"
            >
              <div>
                <p className="font-medium text-[hsl(var(--color-foreground))]">{v.title}</p>
                <p className="text-sm text-[hsl(var(--color-muted))] mt-0.5 line-clamp-2">
                  {v.description}
                </p>
              </div>
              <div className="flex gap-2 shrink-0 ml-4">
                <button
                  onClick={() => {
                    setEditingValue(v);
                    setShowValueForm(true);
                  }}
                  className="rounded-lg border border-[hsl(var(--color-surface-muted))] px-3 py-1.5 text-xs text-[hsl(var(--color-muted))] transition hover:text-[hsl(var(--color-accent))]"
                >
                  Modifier
                </button>
                <button
                  onClick={() => deleteValue(v.id)}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-500 transition hover:bg-red-50"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
