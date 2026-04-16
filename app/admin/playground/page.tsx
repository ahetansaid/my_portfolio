"use client";

import { useEffect, useState } from "react";

type Item = {
  id: number;
  slug: string;
  title: string;
  emoji: string | null;
  description: string;
  imageUrl: string | null;
  demoUrl: string | null;
  repoUrl: string | null;
  tags: string[] | null;
  sortOrder: number;
  isPublished: boolean;
};

const inputClass =
  "w-full rounded-lg border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] px-3 py-2 text-sm text-[hsl(var(--color-foreground))] placeholder:text-[hsl(var(--color-muted))] focus:border-[hsl(var(--color-accent))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--color-accent))]/20";

export default function AdminPlaygroundPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    emoji: "",
    description: "",
    imageUrl: "",
    demoUrl: "",
    repoUrl: "",
    tags: "",
    sortOrder: 0,
    isPublished: true,
  });

  const load = async () => {
    const res = await fetch("/api/playground?all=1");
    if (res.ok) setItems(await res.json());
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm({
      title: "",
      slug: "",
      emoji: "",
      description: "",
      imageUrl: "",
      demoUrl: "",
      repoUrl: "",
      tags: "",
      sortOrder: 0,
      isPublished: true,
    });
    setEditingId(null);
    setError(null);
  };

  const openNew = () => {
    resetForm();
    setShowForm(true);
  };

  const openEdit = (it: Item) => {
    setForm({
      title: it.title,
      slug: it.slug,
      emoji: it.emoji ?? "",
      description: it.description,
      imageUrl: it.imageUrl ?? "",
      demoUrl: it.demoUrl ?? "",
      repoUrl: it.repoUrl ?? "",
      tags: (it.tags ?? []).join(", "),
      sortOrder: it.sortOrder,
      isPublished: it.isPublished,
    });
    setEditingId(it.id);
    setShowForm(true);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...form,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      };
      const url = editingId ? `/api/playground/${editingId}` : "/api/playground";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Erreur");
      }
      await load();
      setShowForm(false);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cet élément ?")) return;
    await fetch(`/api/playground/${id}`, { method: "DELETE" });
    await load();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-[hsl(var(--color-foreground))]">
            Playground
          </h1>
          <p className="mt-1 text-sm text-[hsl(var(--color-muted))]">
            Expérimentations, démos rapides, curiosités techniques — séparé des projets officiels.
          </p>
        </div>
        <button
          onClick={openNew}
          className="rounded-lg bg-[hsl(var(--color-accent-warm))] px-4 py-2 text-sm font-medium text-[hsl(var(--color-accent-warm-foreground))] hover:opacity-90 transition"
        >
          + Nouvelle expérience
        </button>
      </div>

      {showForm && (
        <div className="mb-8 rounded-xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-6 shadow-sm">
          <h2 className="font-display text-lg font-semibold text-[hsl(var(--color-foreground))] mb-4">
            {editingId ? "Modifier" : "Nouvelle expérience"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-[80px_1fr_1fr]">
              <div>
                <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">Emoji</label>
                <input className={inputClass} placeholder="⚗️" value={form.emoji} onChange={(e) => setForm({ ...form, emoji: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">Titre *</label>
                <input className={inputClass} required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">Slug *</label>
                <input className={inputClass} required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">Description *</label>
              <textarea className={inputClass} rows={3} required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">Image URL</label>
                <input className={inputClass} type="url" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">Démo URL</label>
                <input className={inputClass} type="url" value={form.demoUrl} onChange={(e) => setForm({ ...form, demoUrl: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">Repo URL</label>
                <input className={inputClass} type="url" value={form.repoUrl} onChange={(e) => setForm({ ...form, repoUrl: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">
                Tags (séparés par des virgules)
              </label>
              <input className={inputClass} placeholder="ai, experiment, weekend" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">Ordre</label>
                <input className={inputClass} type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} />
              </div>
              <label className="flex items-center gap-2 text-sm text-[hsl(var(--color-foreground))] cursor-pointer mt-6">
                <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} />
                Publié
              </label>
            </div>

            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

            <div className="flex gap-3">
              <button type="submit" disabled={loading} className="rounded-lg bg-[hsl(var(--color-accent-warm))] px-4 py-2 text-sm font-medium text-[hsl(var(--color-accent-warm-foreground))] hover:opacity-90 disabled:opacity-60 transition">
                {loading ? "Enregistrement…" : "Enregistrer"}
              </button>
              <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="rounded-lg border border-[hsl(var(--color-surface-muted))] px-4 py-2 text-sm font-medium text-[hsl(var(--color-muted))] hover:bg-[hsl(var(--color-surface-muted))] transition">
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((it) => (
          <div key={it.id} className="rounded-xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-5 shadow-sm">
            <div className="flex items-start gap-3 mb-2">
              {it.emoji && <span className="text-2xl">{it.emoji}</span>}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-[hsl(var(--color-foreground))]">{it.title}</h3>
                  {!it.isPublished && (
                    <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-600">Brouillon</span>
                  )}
                </div>
                <p className="text-xs text-[hsl(var(--color-muted))]">{it.slug}</p>
              </div>
            </div>
            <p className="text-sm text-[hsl(var(--color-muted))] line-clamp-2 mb-3">{it.description}</p>
            {it.tags && it.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {it.tags.map((t) => (
                  <span key={t} className="rounded bg-[hsl(var(--color-accent))]/10 px-2 py-0.5 text-[10px] font-medium text-[hsl(var(--color-accent))]">
                    {t}
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <button onClick={() => openEdit(it)} className="rounded-lg border border-[hsl(var(--color-surface-muted))] px-3 py-1.5 text-xs font-medium text-[hsl(var(--color-muted))] hover:bg-[hsl(var(--color-surface-muted))] transition">
                Modifier
              </button>
              <button onClick={() => handleDelete(it.id)} className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition">
                Supprimer
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="col-span-full text-center text-sm text-[hsl(var(--color-muted))] py-12">
            Aucune expérience. Cliquez sur « + Nouvelle expérience » pour commencer.
          </p>
        )}
      </div>
    </div>
  );
}
