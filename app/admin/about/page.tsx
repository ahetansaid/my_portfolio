"use client";

import { useEffect, useState } from "react";

type TimelineItem = { id: number; year: string; title: string; description: string; sortOrder: number };
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
  onSave: (data: Record<string, string | number>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Record<string, string | number>>(() => {
    const init: Record<string, string | number> = { sortOrder: 0 };
    fields.forEach((f) => { init[f.key] = (editingItem as Record<string, string | number>)?.[f.key] ?? ""; });
    if (editingItem && "sortOrder" in editingItem) init.sortOrder = (editingItem as Record<string, number>).sortOrder ?? 0;
    return init;
  });
  const [loading, setLoading] = useState(false);

  return (
    <form onSubmit={(e) => { e.preventDefault(); setLoading(true); onSave(form); setLoading(false); }}
      className="space-y-3 rounded-xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-5 shadow-sm">
      <h3 className="font-display text-sm font-semibold text-[hsl(var(--color-foreground))]">{title}</h3>
      {fields.map((f) => (
        <div key={f.key}>
          <label className="block text-xs font-medium text-[hsl(var(--color-muted))] mb-1">{f.label}</label>
          {f.multiline ? (
            <textarea className={inputClass} rows={3} required value={String(form[f.key] ?? "")}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
          ) : (
            <input className={inputClass} type={f.type ?? "text"} required={f.type !== "number"}
              value={f.type === "number" ? Number(form[f.key]) : String(form[f.key] ?? "")}
              onChange={(e) => setForm({ ...form, [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value })} />
          )}
        </div>
      ))}
      <div>
        <label className="block text-xs font-medium text-[hsl(var(--color-muted))] mb-1">Ordre</label>
        <input className={inputClass} type="number" value={Number(form.sortOrder)}
          onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} />
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={loading}
          className="rounded-lg bg-[hsl(var(--color-accent-warm))] px-3 py-1.5 text-xs font-medium text-[hsl(var(--color-accent-warm-foreground))] hover:opacity-90 disabled:opacity-60 transition">
          {loading ? "…" : "Enregistrer"}
        </button>
        <button type="button" onClick={onCancel}
          className="rounded-lg border border-[hsl(var(--color-surface-muted))] px-3 py-1.5 text-xs font-medium text-[hsl(var(--color-muted))] hover:bg-[hsl(var(--color-surface-muted))] transition">
          Annuler
        </button>
      </div>
    </form>
  );
}

export default function AdminAboutPage() {
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [values, setValues] = useState<AboutValue[]>([]);
  const [editingTimeline, setEditingTimeline] = useState<Partial<TimelineItem> | null>(null);
  const [editingValue, setEditingValue] = useState<Partial<AboutValue> | null>(null);
  const [showTimelineForm, setShowTimelineForm] = useState(false);
  const [showValueForm, setShowValueForm] = useState(false);

  async function load() {
    const [tRes, vRes] = await Promise.all([fetch("/api/about/timeline"), fetch("/api/about/values")]);
    const [t, v] = await Promise.all([tRes.json(), vRes.json()]);
    setTimeline(Array.isArray(t) ? t : []);
    setValues(Array.isArray(v) ? v : []);
  }

  useEffect(() => { load(); }, []);

  async function saveTimeline(data: Record<string, string | number>) {
    const url = editingTimeline?.id ? `/api/about/timeline/${editingTimeline.id}` : "/api/about/timeline";
    await fetch(url, { method: editingTimeline?.id ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    setShowTimelineForm(false);
    setEditingTimeline(null);
    load();
  }

  async function saveValue(data: Record<string, string | number>) {
    const url = editingValue?.id ? `/api/about/values/${editingValue.id}` : "/api/about/values";
    await fetch(url, { method: editingValue?.id ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    setShowValueForm(false);
    setEditingValue(null);
    load();
  }

  async function deleteTimeline(id: number) {
    if (!confirm("Supprimer cet élément ?")) return;
    await fetch(`/api/about/timeline/${id}`, { method: "DELETE" });
    load();
  }

  async function deleteValue(id: number) {
    if (!confirm("Supprimer cette valeur ?")) return;
    await fetch(`/api/about/values/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="space-y-10">
      <h1 className="font-display text-2xl font-bold text-[hsl(var(--color-foreground))]">
        À propos — Contenu
      </h1>

      {/* Timeline */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold text-[hsl(var(--color-foreground))]">
            Parcours (timeline)
          </h2>
          <button onClick={() => { setEditingTimeline(null); setShowTimelineForm(true); }}
            className="rounded-lg bg-[hsl(var(--color-accent-warm))] px-3 py-1.5 text-xs font-medium text-[hsl(var(--color-accent-warm-foreground))] hover:opacity-90 transition">
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
              onCancel={() => { setShowTimelineForm(false); setEditingTimeline(null); }}
            />
          </div>
        )}

        <div className="space-y-2">
          {timeline.length === 0 && <p className="text-sm text-[hsl(var(--color-muted))]">Aucune étape.</p>}
          {timeline.map((item) => (
            <div key={item.id}
              className="flex items-start justify-between rounded-xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] px-5 py-4 shadow-sm">
              <div>
                <p className="text-xs font-semibold text-[hsl(var(--color-accent))] uppercase tracking-wide">{item.year}</p>
                <p className="font-medium text-[hsl(var(--color-foreground))]">{item.title}</p>
                <p className="text-sm text-[hsl(var(--color-muted))] mt-0.5 line-clamp-2">{item.description}</p>
              </div>
              <div className="flex gap-2 shrink-0 ml-4">
                <button onClick={() => { setEditingTimeline(item); setShowTimelineForm(true); }}
                  className="rounded-lg border border-[hsl(var(--color-surface-muted))] px-3 py-1.5 text-xs text-[hsl(var(--color-muted))] hover:text-[hsl(var(--color-accent))] transition">
                  Modifier
                </button>
                <button onClick={() => deleteTimeline(item.id)}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-500 hover:bg-red-50 transition">
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold text-[hsl(var(--color-foreground))]">
            Valeurs / Vision
          </h2>
          <button onClick={() => { setEditingValue(null); setShowValueForm(true); }}
            className="rounded-lg bg-[hsl(var(--color-accent-warm))] px-3 py-1.5 text-xs font-medium text-[hsl(var(--color-accent-warm-foreground))] hover:opacity-90 transition">
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
              onCancel={() => { setShowValueForm(false); setEditingValue(null); }}
            />
          </div>
        )}

        <div className="space-y-2">
          {values.length === 0 && <p className="text-sm text-[hsl(var(--color-muted))]">Aucune valeur.</p>}
          {values.map((v) => (
            <div key={v.id}
              className="flex items-start justify-between rounded-xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] px-5 py-4 shadow-sm">
              <div>
                <p className="font-medium text-[hsl(var(--color-foreground))]">{v.title}</p>
                <p className="text-sm text-[hsl(var(--color-muted))] mt-0.5 line-clamp-2">{v.description}</p>
              </div>
              <div className="flex gap-2 shrink-0 ml-4">
                <button onClick={() => { setEditingValue(v); setShowValueForm(true); }}
                  className="rounded-lg border border-[hsl(var(--color-surface-muted))] px-3 py-1.5 text-xs text-[hsl(var(--color-muted))] hover:text-[hsl(var(--color-accent))] transition">
                  Modifier
                </button>
                <button onClick={() => deleteValue(v.id)}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-500 hover:bg-red-50 transition">
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
