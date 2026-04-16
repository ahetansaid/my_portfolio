"use client";

import { useEffect, useState } from "react";

type Service = {
  id: number;
  title: string;
  slug: string;
  icon: string | null;
  description: string;
  priceRange: string | null;
  duration: string | null;
  deliverables: string[] | null;
  sortOrder: number;
  isPublished: boolean;
};

const inputClass =
  "w-full rounded-lg border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] px-3 py-2 text-sm text-[hsl(var(--color-foreground))] placeholder:text-[hsl(var(--color-muted))] focus:border-[hsl(var(--color-accent))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--color-accent))]/20";

export default function AdminServicesPage() {
  const [items, setItems] = useState<Service[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    icon: "",
    description: "",
    priceRange: "",
    duration: "",
    deliverables: "",
    sortOrder: 0,
    isPublished: true,
  });

  const load = async () => {
    const res = await fetch("/api/services");
    if (res.ok) setItems(await res.json());
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm({
      title: "",
      slug: "",
      icon: "",
      description: "",
      priceRange: "",
      duration: "",
      deliverables: "",
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

  const openEdit = (s: Service) => {
    setForm({
      title: s.title,
      slug: s.slug,
      icon: s.icon ?? "",
      description: s.description,
      priceRange: s.priceRange ?? "",
      duration: s.duration ?? "",
      deliverables: (s.deliverables ?? []).join("\n"),
      sortOrder: s.sortOrder,
      isPublished: s.isPublished,
    });
    setEditingId(s.id);
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
        deliverables: form.deliverables
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
      };
      const url = editingId ? `/api/services/${editingId}` : "/api/services";
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
    if (!confirm("Supprimer ce service ?")) return;
    await fetch(`/api/services/${id}`, { method: "DELETE" });
    await load();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-[hsl(var(--color-foreground))]">Services</h1>
        <button
          onClick={openNew}
          className="rounded-lg bg-[hsl(var(--color-accent-warm))] px-4 py-2 text-sm font-medium text-[hsl(var(--color-accent-warm-foreground))] hover:opacity-90 transition"
        >
          + Nouveau service
        </button>
      </div>

      {showForm && (
        <div className="mb-8 rounded-xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-6 shadow-sm">
          <h2 className="font-display text-lg font-semibold text-[hsl(var(--color-foreground))] mb-4">
            {editingId ? "Modifier le service" : "Nouveau service"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">Icône</label>
                <input
                  className={inputClass}
                  placeholder="🔍"
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">Titre *</label>
                <input
                  className={inputClass}
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">Slug *</label>
              <input
                className={inputClass}
                required
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">Description *</label>
              <textarea
                className={inputClass}
                rows={4}
                required
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">Fourchette de prix</label>
                <input
                  className={inputClass}
                  placeholder="À partir de 1 500 €"
                  value={form.priceRange}
                  onChange={(e) => setForm({ ...form, priceRange: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">Durée</label>
                <input
                  className={inputClass}
                  placeholder="2 à 5 jours"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">
                Livrables (un par ligne)
              </label>
              <textarea
                className={inputClass}
                rows={4}
                placeholder="Rapport d'audit&#10;Plan d'action&#10;Restitution orale"
                value={form.deliverables}
                onChange={(e) => setForm({ ...form, deliverables: e.target.value })}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">Ordre</label>
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

            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-[hsl(var(--color-accent-warm))] px-4 py-2 text-sm font-medium text-[hsl(var(--color-accent-warm-foreground))] hover:opacity-90 disabled:opacity-60 transition"
              >
                {loading ? "Enregistrement…" : "Enregistrer"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="rounded-lg border border-[hsl(var(--color-surface-muted))] px-4 py-2 text-sm font-medium text-[hsl(var(--color-muted))] hover:bg-[hsl(var(--color-surface-muted))] transition"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((s) => (
          <div
            key={s.id}
            className="rounded-xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-5 shadow-sm"
          >
            <div className="flex items-start gap-3 mb-2">
              {s.icon && <span className="text-2xl">{s.icon}</span>}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[hsl(var(--color-foreground))]">{s.title}</h3>
                <p className="text-xs text-[hsl(var(--color-muted))]">{s.priceRange} · {s.duration}</p>
              </div>
            </div>
            <p className="text-sm text-[hsl(var(--color-muted))] line-clamp-3 mb-3">{s.description}</p>
            <div className="flex gap-2">
              <button
                onClick={() => openEdit(s)}
                className="rounded-lg border border-[hsl(var(--color-surface-muted))] px-3 py-1.5 text-xs font-medium text-[hsl(var(--color-muted))] hover:bg-[hsl(var(--color-surface-muted))] transition"
              >
                Modifier
              </button>
              <button
                onClick={() => handleDelete(s.id)}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition"
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
