"use client";

import { useEffect, useState } from "react";

type SkillItem = { id: number; name: string; sortOrder: number };
type SkillCategory = { id: number; name: string; icon: string | null; description: string | null; sortOrder: number; items: SkillItem[] };

const inputClass =
  "w-full rounded-lg border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] px-3 py-2 text-sm text-[hsl(var(--color-foreground))] placeholder:text-[hsl(var(--color-muted))] focus:border-[hsl(var(--color-accent))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--color-accent))]/20";

const emptyCategory = { name: "", icon: "", description: "", sortOrder: 0 };

export default function AdminSkillsPage() {
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [catForm, setCatForm] = useState(emptyCategory);
  const [editingCatId, setEditingCatId] = useState<number | null>(null);
  const [showCatForm, setShowCatForm] = useState(false);
  const [catLoading, setCatLoading] = useState(false);

  // Per-category item add form
  const [itemForms, setItemForms] = useState<Record<number, string>>({});

  async function load() {
    const res = await fetch("/api/skills");
    const data = await res.json();
    setCategories(Array.isArray(data) ? data : []);
  }

  useEffect(() => { load(); }, []);

  function openNewCat() {
    setCatForm(emptyCategory);
    setEditingCatId(null);
    setShowCatForm(true);
  }

  function openEditCat(c: SkillCategory) {
    setCatForm({ name: c.name, icon: c.icon ?? "", description: c.description ?? "", sortOrder: c.sortOrder });
    setEditingCatId(c.id);
    setShowCatForm(true);
  }

  async function saveCat(e: React.FormEvent) {
    e.preventDefault();
    setCatLoading(true);
    const url = editingCatId ? `/api/skills/${editingCatId}` : "/api/skills";
    await fetch(url, {
      method: editingCatId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...catForm, icon: catForm.icon || null, description: catForm.description || null }),
    });
    setShowCatForm(false);
    setEditingCatId(null);
    load();
    setCatLoading(false);
  }

  async function deleteCat(id: number) {
    if (!confirm("Supprimer cette catégorie et tous ses éléments ?")) return;
    await fetch(`/api/skills/${id}`, { method: "DELETE" });
    load();
  }

  async function addItem(categoryId: number) {
    const name = itemForms[categoryId]?.trim();
    if (!name) return;
    await fetch("/api/skills/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, categoryId }),
    });
    setItemForms((f) => ({ ...f, [categoryId]: "" }));
    load();
  }

  async function deleteItem(id: number) {
    if (!confirm("Supprimer cet élément ?")) return;
    await fetch(`/api/skills/items/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-[hsl(var(--color-foreground))]">
          Compétences
        </h1>
        <button onClick={openNewCat}
          className="rounded-lg bg-[hsl(var(--color-accent-warm))] px-4 py-2 text-sm font-medium text-[hsl(var(--color-accent-warm-foreground))] hover:opacity-90 transition">
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
                <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">Nom *</label>
                <input className={inputClass} required value={catForm.name}
                  onChange={(e) => setCatForm({ ...catForm, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">Icône (emoji)</label>
                <input className={inputClass} placeholder="💻" value={catForm.icon}
                  onChange={(e) => setCatForm({ ...catForm, icon: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">Description courte</label>
              <input className={inputClass} value={catForm.description}
                onChange={(e) => setCatForm({ ...catForm, description: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">Ordre</label>
              <input className={inputClass} type="number" value={catForm.sortOrder}
                onChange={(e) => setCatForm({ ...catForm, sortOrder: Number(e.target.value) })} />
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={catLoading}
                className="rounded-lg bg-[hsl(var(--color-accent-warm))] px-4 py-2 text-sm font-medium text-[hsl(var(--color-accent-warm-foreground))] hover:opacity-90 disabled:opacity-60 transition">
                {catLoading ? "Enregistrement…" : "Enregistrer"}
              </button>
              <button type="button" onClick={() => setShowCatForm(false)}
                className="rounded-lg border border-[hsl(var(--color-surface-muted))] px-4 py-2 text-sm font-medium text-[hsl(var(--color-muted))] hover:bg-[hsl(var(--color-surface-muted))] transition">
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-6">
        {categories.length === 0 && (
          <p className="text-sm text-[hsl(var(--color-muted))]">Aucune catégorie.</p>
        )}
        {categories.map((cat) => (
          <div key={cat.id}
            className="rounded-xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-6 shadow-sm">
            {/* Category header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {cat.icon && <span className="text-xl">{cat.icon}</span>}
                <div>
                  <h2 className="font-display font-semibold text-[hsl(var(--color-foreground))]">{cat.name}</h2>
                  {cat.description && (
                    <p className="text-xs text-[hsl(var(--color-muted))]">{cat.description}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEditCat(cat)}
                  className="rounded-lg border border-[hsl(var(--color-surface-muted))] px-3 py-1.5 text-xs text-[hsl(var(--color-muted))] hover:text-[hsl(var(--color-accent))] transition">
                  Modifier
                </button>
                <button onClick={() => deleteCat(cat.id)}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-500 hover:bg-red-50 transition">
                  Supprimer
                </button>
              </div>
            </div>

            {/* Items */}
            <div className="flex flex-wrap gap-2 mb-4">
              {cat.items.map((item) => (
                <span key={item.id}
                  className="group flex items-center gap-1.5 rounded-md bg-[hsl(var(--color-surface-muted))] px-3 py-1 text-sm text-[hsl(var(--color-muted))]">
                  {item.name}
                  <button type="button" onClick={() => deleteItem(item.id)}
                    className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition leading-none text-xs">
                    ✕
                  </button>
                </span>
              ))}
              {cat.items.length === 0 && (
                <p className="text-xs text-[hsl(var(--color-muted))]">Aucun élément.</p>
              )}
            </div>

            {/* Add item */}
            <div className="flex gap-2">
              <input
                className="flex-1 rounded-lg border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface-muted))] px-3 py-1.5 text-sm text-[hsl(var(--color-foreground))] placeholder:text-[hsl(var(--color-muted))] focus:border-[hsl(var(--color-accent))] focus:outline-none"
                placeholder="Ajouter un élément (ex. React)…"
                value={itemForms[cat.id] ?? ""}
                onChange={(e) => setItemForms((f) => ({ ...f, [cat.id]: e.target.value }))}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addItem(cat.id); } }}
              />
              <button type="button" onClick={() => addItem(cat.id)}
                className="rounded-lg bg-[hsl(var(--color-accent))]/10 px-3 py-1.5 text-sm font-medium text-[hsl(var(--color-accent))] hover:bg-[hsl(var(--color-accent))]/20 transition">
                Ajouter
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
