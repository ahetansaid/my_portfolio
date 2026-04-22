"use client";

import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api-client";
import { useToast } from "@/components/admin/Toaster";

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

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function AdminPlaygroundPage() {
  const toast = useToast();
  const [items, setItems] = useState<Item[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
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
    try {
      const data = await api.get<Item[]>("/api/playground?all=1", { redirectOn401: false });
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setItems([]);
    }
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      };
      if (editingId) {
        await api.put(`/api/playground/${editingId}`, payload);
        toast.success("Expérience mise à jour.");
      } else {
        await api.post("/api/playground", payload);
        toast.success("Expérience créée.");
      }
      await load();
      setShowForm(false);
      resetForm();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Erreur lors de l'enregistrement.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Supprimer « ${title} » ?`)) return;
    try {
      await api.delete(`/api/playground/${id}`);
      toast.success("Expérience supprimée.");
      await load();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Erreur lors de la suppression.");
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
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
          className="rounded-lg bg-[hsl(var(--color-accent-warm))] px-4 py-2 text-sm font-semibold text-[hsl(var(--color-accent-warm-foreground))] shadow-sm transition hover:opacity-90"
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
                <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">
                  Emoji
                </label>
                <input
                  className={inputClass}
                  placeholder="⚗️"
                  value={form.emoji}
                  onChange={(e) => setForm({ ...form, emoji: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">
                  Titre *
                </label>
                <input
                  className={inputClass}
                  required
                  value={form.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setForm((f) => ({
                      ...f,
                      title,
                      slug: !editingId && (!f.slug || f.slug === slugify(f.title)) ? slugify(title) : f.slug,
                    }));
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">
                  Slug *
                </label>
                <input
                  className={inputClass}
                  required
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">
                Description *
              </label>
              <textarea
                className={inputClass}
                rows={3}
                required
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">
                  Image URL
                </label>
                <input
                  className={inputClass}
                  type="url"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">
                  Démo URL
                </label>
                <input
                  className={inputClass}
                  type="url"
                  value={form.demoUrl}
                  onChange={(e) => setForm({ ...form, demoUrl: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">
                  Repo URL
                </label>
                <input
                  className={inputClass}
                  type="url"
                  value={form.repoUrl}
                  onChange={(e) => setForm({ ...form, repoUrl: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">
                Tags (séparés par des virgules)
              </label>
              <input
                className={inputClass}
                placeholder="ai, experiment, weekend"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">
                  Ordre
                </label>
                <input
                  className={inputClass}
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-[hsl(var(--color-foreground))] cursor-pointer mt-6">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                />
                Publié
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-[hsl(var(--color-accent-warm))] px-4 py-2 text-sm font-semibold text-[hsl(var(--color-accent-warm-foreground))] shadow-sm transition hover:opacity-90 disabled:opacity-60"
              >
                {loading ? "Enregistrement…" : "Enregistrer"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="rounded-lg border border-[hsl(var(--color-surface-muted))] px-4 py-2 text-sm font-medium text-[hsl(var(--color-muted))] transition hover:bg-[hsl(var(--color-surface-muted))]"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {items.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-12 text-center">
            <p className="text-sm text-[hsl(var(--color-muted))]">
              Aucune expérience. Cliquez sur « + Nouvelle expérience » pour commencer.
            </p>
          </div>
        )}
        {items.map((it) => (
          <div
            key={it.id}
            className="rounded-xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-5 shadow-sm"
          >
            <div className="flex items-start gap-3 mb-2">
              {it.emoji && <span className="text-2xl">{it.emoji}</span>}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-[hsl(var(--color-foreground))]">{it.title}</h3>
                  {!it.isPublished && (
                    <span className="rounded bg-[hsl(var(--color-surface-muted))] px-1.5 py-0.5 text-[10px] font-medium text-[hsl(var(--color-muted))]">
                      Brouillon
                    </span>
                  )}
                </div>
                <p className="text-xs text-[hsl(var(--color-muted))]">{it.slug}</p>
              </div>
            </div>
            <p className="text-sm text-[hsl(var(--color-muted))] line-clamp-2 mb-3">
              {it.description}
            </p>
            {it.tags && it.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {it.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded bg-[hsl(var(--color-accent))]/10 px-2 py-0.5 text-[10px] font-medium text-[hsl(var(--color-accent))]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => openEdit(it)}
                className="rounded-lg border border-[hsl(var(--color-surface-muted))] px-3 py-1.5 text-xs font-medium text-[hsl(var(--color-muted))] transition hover:bg-[hsl(var(--color-surface-muted))]"
              >
                Modifier
              </button>
              <button
                onClick={() => handleDelete(it.id, it.title)}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
