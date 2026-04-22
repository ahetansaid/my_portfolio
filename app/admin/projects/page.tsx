"use client";

import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api-client";
import { useToast } from "@/components/admin/Toaster";

type Technology = { id: number; name: string; slug: string };
type Project = {
  id: number;
  slug: string;
  name: string;
  discoveryContext?: string | null;
  problem: string;
  approach?: string | null;
  solution: string;
  results: string;
  imageUrl: string | null;
  sortOrder: number;
  isPublished: boolean;
  technologies: Technology[];
};

const emptyForm = {
  name: "",
  slug: "",
  discoveryContext: "",
  problem: "",
  approach: "",
  solution: "",
  results: "",
  imageUrl: "",
  sortOrder: 0,
  isPublished: true,
  technologyIds: [] as number[],
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

export default function AdminProjectsPage() {
  const toast = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [allTechs, setAllTechs] = useState<Technology[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  async function load() {
    try {
      const [p, t] = await Promise.all([
        api.get<Project[]>("/api/projects", { redirectOn401: false }),
        api.get<Technology[]>("/api/technologies", { redirectOn401: false }),
      ]);
      setProjects(Array.isArray(p) ? p : []);
      setAllTechs(Array.isArray(t) ? t : []);
    } catch {
      setProjects([]);
      setAllTechs([]);
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

  function openEdit(p: Project) {
    setForm({
      name: p.name,
      slug: p.slug,
      discoveryContext: p.discoveryContext ?? "",
      problem: p.problem ?? "",
      approach: p.approach ?? "",
      solution: p.solution ?? "",
      results: p.results ?? "",
      imageUrl: p.imageUrl ?? "",
      sortOrder: p.sortOrder,
      isPublished: p.isPublished,
      technologyIds: p.technologies.map((t) => t.id),
    });
    setEditingId(p.id);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, imageUrl: form.imageUrl || null };
      if (editingId) {
        await api.put(`/api/projects/${editingId}`, payload);
        toast.success("Projet mis à jour.");
      } else {
        await api.post("/api/projects", payload);
        toast.success("Projet créé.");
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
    if (!confirm(`Supprimer le projet « ${name} » ? Cette action est irréversible.`)) return;
    try {
      await api.delete(`/api/projects/${id}`);
      toast.success("Projet supprimé.");
      load();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Erreur lors de la suppression.");
    }
  }

  function toggleTech(id: number) {
    setForm((f) => ({
      ...f,
      technologyIds: f.technologyIds.includes(id)
        ? f.technologyIds.filter((x) => x !== id)
        : [...f.technologyIds, id],
    }));
  }

  const filtered = projects.filter(
    (p) =>
      !query ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.slug.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-[hsl(var(--color-foreground))]">
            Projets
          </h1>
          <p className="mt-1 text-sm text-[hsl(var(--color-muted))]">
            {projects.length} projet{projects.length !== 1 ? "s" : ""}.
          </p>
        </div>
        <button
          onClick={openNew}
          className="rounded-lg bg-[hsl(var(--color-accent-warm))] px-4 py-2 text-sm font-semibold text-[hsl(var(--color-accent-warm-foreground))] shadow-sm transition hover:opacity-90"
        >
          + Nouveau projet
        </button>
      </div>

      {showForm && (
        <div className="mb-8 rounded-xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-6 shadow-sm">
          <h2 className="font-display text-lg font-semibold text-[hsl(var(--color-foreground))] mb-4">
            {editingId ? "Modifier le projet" : "Nouveau projet"}
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
            <div className="rounded-xl border border-[hsl(var(--color-accent))]/20 bg-[hsl(var(--color-accent))]/5 p-4">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[hsl(var(--color-accent))]">
                Double Diamond · 4 phases de la case study
              </p>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">
                    🔍 01 Discover — Contexte &amp; découverte
                  </label>
                  <textarea
                    className={inputClass}
                    rows={3}
                    placeholder="Situation de départ, utilisateurs, contraintes, ce qu'on a appris en explorant…"
                    value={form.discoveryContext}
                    onChange={(e) => setForm({ ...form, discoveryContext: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">
                    🎯 02 Define — Problématique identifiée
                  </label>
                  <textarea
                    className={inputClass}
                    rows={3}
                    placeholder="Le vrai problème qu'il faut résoudre après l'exploration…"
                    value={form.problem}
                    onChange={(e) => setForm({ ...form, problem: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">
                    💡 03 Develop — Approche &amp; architecture
                  </label>
                  <textarea
                    className={inputClass}
                    rows={3}
                    placeholder="Options explorées, choix techniques, pourquoi cette approche…"
                    value={form.approach}
                    onChange={(e) => setForm({ ...form, approach: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">
                    🚀 Solution livrée (fallback si « Approche » est vide)
                  </label>
                  <textarea
                    className={inputClass}
                    rows={3}
                    placeholder="Ce qui a été construit…"
                    value={form.solution}
                    onChange={(e) => setForm({ ...form, solution: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">
                    ✓ 04 Deliver — Résultats &amp; impact mesuré
                  </label>
                  <textarea
                    className={inputClass}
                    rows={3}
                    placeholder="Résultats concrets, métriques, gains mesurables…"
                    value={form.results}
                    onChange={(e) => setForm({ ...form, results: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">
                  URL image
                </label>
                <input
                  className={inputClass}
                  type="url"
                  placeholder="https://…"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">
                  Ordre d&apos;affichage
                </label>
                <input
                  className={inputClass}
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-2">
                Technologies
              </label>
              <div className="flex flex-wrap gap-2">
                {allTechs.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => toggleTech(t.id)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                      form.technologyIds.includes(t.id)
                        ? "bg-[hsl(var(--color-accent))] text-[hsl(var(--color-accent-foreground))]"
                        : "bg-[hsl(var(--color-surface-muted))] text-[hsl(var(--color-muted))] hover:bg-[hsl(var(--color-accent))]/10"
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
                {allTechs.length === 0 && (
                  <p className="text-sm text-[hsl(var(--color-muted))]">
                    Ajoutez d&apos;abord des technologies.
                  </p>
                )}
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-[hsl(var(--color-foreground))] cursor-pointer">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
              />
              Publié
            </label>

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

      {projects.length > 0 && (
        <div className="mb-4">
          <input
            type="search"
            placeholder="Rechercher un projet…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={inputClass}
          />
        </div>
      )}

      <div className="space-y-3">
        {projects.length === 0 && (
          <div className="rounded-xl border border-dashed border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-8 text-center">
            <p className="text-sm text-[hsl(var(--color-muted))]">
              Aucun projet. Créez le premier !
            </p>
          </div>
        )}
        {filtered.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between rounded-xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] px-5 py-4 shadow-sm"
          >
            <div className="min-w-0">
              <p className="font-medium text-[hsl(var(--color-foreground))]">{p.name}</p>
              <p className="mt-0.5 text-xs text-[hsl(var(--color-muted))] truncate">
                /{p.slug} · {p.isPublished ? "Publié" : "Brouillon"}
                {p.technologies.length > 0 &&
                  " · " + p.technologies.map((t) => t.name).join(", ")}
              </p>
            </div>
            <div className="flex gap-2 shrink-0 ml-4">
              <button
                onClick={() => openEdit(p)}
                className="rounded-lg border border-[hsl(var(--color-surface-muted))] px-3 py-1.5 text-sm font-medium text-[hsl(var(--color-muted))] transition hover:border-[hsl(var(--color-accent))]/50 hover:text-[hsl(var(--color-accent))]"
              >
                Modifier
              </button>
              <button
                onClick={() => handleDelete(p.id, p.name)}
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
