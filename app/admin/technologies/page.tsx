"use client";

import { useEffect, useState } from "react";

type Technology = {
  id: number;
  name: string;
  slug: string;
  category: "development" | "systems" | "methodologies" | null;
  sortOrder: number;
};

const emptyForm = {
  name: "",
  slug: "",
  category: "" as "" | "development" | "systems" | "methodologies",
  sortOrder: 0,
};

const categoryLabels = {
  development: "Développement",
  systems: "Systèmes",
  methodologies: "Méthodologies",
};

const inputClass =
  "w-full rounded-lg border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] px-3 py-2 text-sm text-[hsl(var(--color-foreground))] focus:border-[hsl(var(--color-accent))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--color-accent))]/20";

export default function AdminTechnologiesPage() {
  const [techs, setTechs] = useState<Technology[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch("/api/technologies");
    const data = await res.json();
    setTechs(Array.isArray(data) ? data : []);
  }

  useEffect(() => { load(); }, []);

  function openNew() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    setError("");
  }

  function openEdit(t: Technology) {
    setForm({
      name: t.name,
      slug: t.slug,
      category: t.category ?? "",
      sortOrder: t.sortOrder,
    });
    setEditingId(t.id);
    setShowForm(true);
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const url = editingId ? `/api/technologies/${editingId}` : "/api/technologies";
    const res = await fetch(url, {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, category: form.category || null }),
    });
    if (res.ok) {
      setShowForm(false);
      load();
    } else {
      const data = await res.json();
      setError(data.error ?? "Erreur.");
    }
    setLoading(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("Supprimer cette technologie ?")) return;
    await fetch(`/api/technologies/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-[hsl(var(--color-foreground))]">
          Technologies
        </h1>
        <button onClick={openNew}
          className="rounded-lg bg-[hsl(var(--color-accent))] px-4 py-2 text-sm font-medium text-[hsl(var(--color-accent-foreground))] hover:opacity-90 transition">
          + Nouvelle technologie
        </button>
      </div>

      {showForm && (
        <div className="mb-8 rounded-xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-6 shadow-sm">
          <h2 className="font-display text-lg font-semibold text-[hsl(var(--color-foreground))] mb-4">
            {editingId ? "Modifier la technologie" : "Nouvelle technologie"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">Nom *</label>
                <input className={inputClass} required value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">Slug *</label>
                <input className={inputClass} required value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">Catégorie</label>
                <select className={inputClass} value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as typeof form.category })}>
                  <option value="">— Aucune —</option>
                  <option value="development">Développement</option>
                  <option value="systems">Systèmes</option>
                  <option value="methodologies">Méthodologies</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">Ordre</label>
                <input className={inputClass} type="number" value={form.sortOrder}
                  onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} />
              </div>
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
            )}
            <div className="flex gap-3">
              <button type="submit" disabled={loading}
                className="rounded-lg bg-[hsl(var(--color-accent))] px-4 py-2 text-sm font-medium text-[hsl(var(--color-accent-foreground))] hover:opacity-90 disabled:opacity-60 transition">
                {loading ? "Enregistrement…" : "Enregistrer"}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="rounded-lg border border-[hsl(var(--color-surface-muted))] px-4 py-2 text-sm font-medium text-[hsl(var(--color-muted))] hover:bg-[hsl(var(--color-surface-muted))] transition">
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {techs.length === 0 && (
          <p className="text-[hsl(var(--color-muted))] text-sm">Aucune technologie.</p>
        )}
        {techs.map((t) => (
          <div key={t.id}
            className="flex items-center justify-between rounded-xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] px-5 py-4 shadow-sm">
            <div>
              <p className="font-medium text-[hsl(var(--color-foreground))]">{t.name}</p>
              <p className="text-xs text-[hsl(var(--color-muted))] mt-0.5">
                {t.slug}
                {t.category && " · " + categoryLabels[t.category]}
              </p>
            </div>
            <div className="flex gap-2 shrink-0 ml-4">
              <button onClick={() => openEdit(t)}
                className="rounded-lg border border-[hsl(var(--color-surface-muted))] px-3 py-1.5 text-sm font-medium text-[hsl(var(--color-muted))] hover:border-[hsl(var(--color-accent))]/50 hover:text-[hsl(var(--color-accent))] transition">
                Modifier
              </button>
              <button onClick={() => handleDelete(t.id)}
                className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-500 hover:bg-red-50 transition">
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
