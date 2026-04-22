"use client";

import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api-client";
import { useToast } from "@/components/admin/Toaster";

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

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function AdminTechnologiesPage() {
  const toast = useToast();
  const [techs, setTechs] = useState<Technology[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  async function load() {
    try {
      const data = await api.get<Technology[]>("/api/technologies", { redirectOn401: false });
      setTechs(Array.isArray(data) ? data : []);
    } catch {
      setTechs([]);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openNew() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
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
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, category: form.category || null };
      if (editingId) {
        await api.put(`/api/technologies/${editingId}`, payload);
        toast.success("Technologie mise à jour.");
      } else {
        await api.post("/api/technologies", payload);
        toast.success("Technologie créée.");
      }
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Erreur lors de l'enregistrement.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Supprimer la technologie « ${name} » ?`)) return;
    try {
      await api.delete(`/api/technologies/${id}`);
      toast.success("Technologie supprimée.");
      load();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Erreur lors de la suppression.");
    }
  }

  const filtered = techs.filter(
    (t) =>
      !query ||
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.slug.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-[hsl(var(--color-foreground))]">
            Technologies
          </h1>
          <p className="mt-1 text-sm text-[hsl(var(--color-muted))]">
            {techs.length} technologie{techs.length !== 1 ? "s" : ""} référencée
            {techs.length !== 1 ? "s" : ""}.
          </p>
        </div>
        <button
          onClick={openNew}
          className="rounded-lg bg-[hsl(var(--color-accent-warm))] px-4 py-2 text-sm font-semibold text-[hsl(var(--color-accent-warm-foreground))] shadow-sm transition hover:opacity-90"
        >
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
                <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">
                  Nom *
                </label>
                <input
                  className={inputClass}
                  required
                  value={form.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setForm((f) => ({
                      ...f,
                      name,
                      slug: !editingId && (!f.slug || f.slug === slugify(f.name)) ? slugify(name) : f.slug,
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
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">
                  Catégorie
                </label>
                <select
                  className={inputClass}
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value as typeof form.category })
                  }
                >
                  <option value="">— Aucune —</option>
                  <option value="development">Développement</option>
                  <option value="systems">Systèmes</option>
                  <option value="methodologies">Méthodologies</option>
                </select>
              </div>
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
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-[hsl(var(--color-surface-muted))] px-4 py-2 text-sm font-medium text-[hsl(var(--color-muted))] transition hover:bg-[hsl(var(--color-surface-muted))]"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {techs.length > 0 && (
        <div className="mb-4">
          <input
            type="search"
            placeholder="Rechercher…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={inputClass}
          />
        </div>
      )}

      <div className="space-y-3">
        {techs.length === 0 && (
          <div className="rounded-xl border border-dashed border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-8 text-center">
            <p className="text-sm text-[hsl(var(--color-muted))]">
              Aucune technologie. Cliquez sur « + Nouvelle technologie » pour commencer.
            </p>
          </div>
        )}
        {filtered.map((t) => (
          <div
            key={t.id}
            className="flex items-center justify-between rounded-xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] px-5 py-4 shadow-sm"
          >
            <div className="min-w-0">
              <p className="font-medium text-[hsl(var(--color-foreground))]">{t.name}</p>
              <p className="mt-0.5 text-xs text-[hsl(var(--color-muted))]">
                {t.slug}
                {t.category && " · " + categoryLabels[t.category]}
              </p>
            </div>
            <div className="flex gap-2 shrink-0 ml-4">
              <button
                onClick={() => openEdit(t)}
                className="rounded-lg border border-[hsl(var(--color-surface-muted))] px-3 py-1.5 text-sm font-medium text-[hsl(var(--color-muted))] transition hover:border-[hsl(var(--color-accent))]/50 hover:text-[hsl(var(--color-accent))]"
              >
                Modifier
              </button>
              <button
                onClick={() => handleDelete(t.id, t.name)}
                className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-500 transition hover:bg-red-50"
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
