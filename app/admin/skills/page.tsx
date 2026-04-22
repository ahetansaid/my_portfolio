"use client";

import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api-client";
import { useToast } from "@/components/admin/Toaster";

type SkillItem = { id: number; name: string; sortOrder: number };
type SkillCategory = {
  id: number;
  name: string;
  icon: string | null;
  description: string | null;
  sortOrder: number;
  items: SkillItem[];
};

const inputClass =
  "w-full rounded-lg border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] px-3 py-2 text-sm text-[hsl(var(--color-foreground))] placeholder:text-[hsl(var(--color-muted))] focus:border-[hsl(var(--color-accent))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--color-accent))]/20";

const emptyCategory = { name: "", icon: "", description: "", sortOrder: 0 };

export default function AdminSkillsPage() {
  const toast = useToast();
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [catForm, setCatForm] = useState(emptyCategory);
  const [editingCatId, setEditingCatId] = useState<number | null>(null);
  const [showCatForm, setShowCatForm] = useState(false);
  const [catLoading, setCatLoading] = useState(false);
  const [itemForms, setItemForms] = useState<Record<number, string>>({});

  async function load() {
    try {
      const data = await api.get<SkillCategory[]>("/api/skills", { redirectOn401: false });
      setCategories(Array.isArray(data) ? data : []);
    } catch {
      setCategories([]);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openNewCat() {
    setCatForm(emptyCategory);
    setEditingCatId(null);
    setShowCatForm(true);
  }

  function openEditCat(c: SkillCategory) {
    setCatForm({
      name: c.name,
      icon: c.icon ?? "",
      description: c.description ?? "",
      sortOrder: c.sortOrder,
    });
    setEditingCatId(c.id);
    setShowCatForm(true);
  }

  async function saveCat(e: React.FormEvent) {
    e.preventDefault();
    setCatLoading(true);
    try {
      const payload = {
        ...catForm,
        icon: catForm.icon || null,
        description: catForm.description || null,
      };
      if (editingCatId) {
        await api.put(`/api/skills/${editingCatId}`, payload);
        toast.success("Catégorie mise à jour.");
      } else {
        await api.post("/api/skills", payload);
        toast.success("Catégorie créée.");
      }
      setShowCatForm(false);
      setEditingCatId(null);
      load();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Erreur lors de l'enregistrement.");
    } finally {
      setCatLoading(false);
    }
  }

  async function deleteCat(id: number, name: string) {
    if (!confirm(`Supprimer la catégorie « ${name} » et tous ses éléments ?`)) return;
    try {
      await api.delete(`/api/skills/${id}`);
      toast.success("Catégorie supprimée.");
      load();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Erreur lors de la suppression.");
    }
  }

  async function addItem(categoryId: number) {
    const name = itemForms[categoryId]?.trim();
    if (!name) return;
    try {
      await api.post("/api/skills/items", { name, categoryId });
      toast.success("Élément ajouté.");
      setItemForms((f) => ({ ...f, [categoryId]: "" }));
      load();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Erreur lors de l'ajout.");
    }
  }

  async function deleteItem(id: number, name: string) {
    if (!confirm(`Supprimer « ${name} » ?`)) return;
    try {
      await api.delete(`/api/skills/items/${id}`);
      toast.success("Élément supprimé.");
      load();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Erreur lors de la suppression.");
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-[hsl(var(--color-foreground))]">
            Compétences
          </h1>
          <p className="mt-1 text-sm text-[hsl(var(--color-muted))]">
            {categories.length} catégorie{categories.length !== 1 ? "s" : ""} ·{" "}
            {categories.reduce((sum, c) => sum + c.items.length, 0)} élément(s)
          </p>
        </div>
        <button
          onClick={openNewCat}
          className="rounded-lg bg-[hsl(var(--color-accent-warm))] px-4 py-2 text-sm font-semibold text-[hsl(var(--color-accent-warm-foreground))] shadow-sm transition hover:opacity-90"
        >
          + Nouvelle catégorie
        </button>
      </div>

      {showCatForm && (
        <div className="mb-8 rounded-xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-6 shadow-sm">
          <h2 className="font-display text-lg font-semibold text-[hsl(var(--color-foreground))] mb-4">
            {editingCatId ? "Modifier la catégorie" : "Nouvelle catégorie"}
          </h2>
          <form onSubmit={saveCat} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">
                  Nom *
                </label>
                <input
                  className={inputClass}
                  required
                  value={catForm.name}
                  onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">
                  Icône (emoji)
                </label>
                <input
                  className={inputClass}
                  placeholder="💻"
                  value={catForm.icon}
                  onChange={(e) => setCatForm({ ...catForm, icon: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">
                Description courte
              </label>
              <input
                className={inputClass}
                value={catForm.description}
                onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">
                Ordre
              </label>
              <input
                className={inputClass}
                type="number"
                value={catForm.sortOrder}
                onChange={(e) => setCatForm({ ...catForm, sortOrder: Number(e.target.value) })}
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={catLoading}
                className="rounded-lg bg-[hsl(var(--color-accent-warm))] px-4 py-2 text-sm font-semibold text-[hsl(var(--color-accent-warm-foreground))] shadow-sm transition hover:opacity-90 disabled:opacity-60"
              >
                {catLoading ? "Enregistrement…" : "Enregistrer"}
              </button>
              <button
                type="button"
                onClick={() => setShowCatForm(false)}
                className="rounded-lg border border-[hsl(var(--color-surface-muted))] px-4 py-2 text-sm font-medium text-[hsl(var(--color-muted))] transition hover:bg-[hsl(var(--color-surface-muted))]"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-6">
        {categories.length === 0 && (
          <div className="rounded-xl border border-dashed border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-8 text-center">
            <p className="text-sm text-[hsl(var(--color-muted))]">Aucune catégorie.</p>
          </div>
        )}
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="rounded-xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {cat.icon && <span className="text-xl">{cat.icon}</span>}
                <div>
                  <h2 className="font-display font-semibold text-[hsl(var(--color-foreground))]">
                    {cat.name}
                  </h2>
                  {cat.description && (
                    <p className="text-xs text-[hsl(var(--color-muted))]">{cat.description}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditCat(cat)}
                  className="rounded-lg border border-[hsl(var(--color-surface-muted))] px-3 py-1.5 text-xs text-[hsl(var(--color-muted))] transition hover:text-[hsl(var(--color-accent))]"
                >
                  Modifier
                </button>
                <button
                  onClick={() => deleteCat(cat.id, cat.name)}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-500 transition hover:bg-red-50"
                >
                  Supprimer
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {cat.items.map((item) => (
                <span
                  key={item.id}
                  className="group flex items-center gap-1.5 rounded-md bg-[hsl(var(--color-surface-muted))] px-3 py-1 text-sm text-[hsl(var(--color-muted))]"
                >
                  {item.name}
                  <button
                    type="button"
                    onClick={() => deleteItem(item.id, item.name)}
                    className="opacity-0 group-hover:opacity-100 text-red-400 transition hover:text-red-600 leading-none text-xs"
                    aria-label={`Supprimer ${item.name}`}
                  >
                    ✕
                  </button>
                </span>
              ))}
              {cat.items.length === 0 && (
                <p className="text-xs text-[hsl(var(--color-muted))]">Aucun élément.</p>
              )}
            </div>

            <div className="flex gap-2">
              <input
                className="flex-1 rounded-lg border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface-muted))] px-3 py-1.5 text-sm text-[hsl(var(--color-foreground))] placeholder:text-[hsl(var(--color-muted))] focus:border-[hsl(var(--color-accent))] focus:outline-none"
                placeholder="Ajouter un élément (ex. React)…"
                value={itemForms[cat.id] ?? ""}
                onChange={(e) => setItemForms((f) => ({ ...f, [cat.id]: e.target.value }))}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addItem(cat.id);
                  }
                }}
              />
              <button
                type="button"
                onClick={() => addItem(cat.id)}
                className="rounded-lg bg-[hsl(var(--color-accent))]/10 px-3 py-1.5 text-sm font-medium text-[hsl(var(--color-accent))] transition hover:bg-[hsl(var(--color-accent))]/20"
              >
                Ajouter
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
