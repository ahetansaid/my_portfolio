"use client";

import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api-client";
import { useToast } from "@/components/admin/Toaster";

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

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function AdminServicesPage() {
  const toast = useToast();
  const [items, setItems] = useState<Service[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
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
    try {
      const data = await api.get<Service[]>("/api/services", { redirectOn401: false });
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
      icon: "",
      description: "",
      priceRange: "",
      duration: "",
      deliverables: "",
      sortOrder: 0,
      isPublished: true,
    });
    setEditingId(null);
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        deliverables: form.deliverables
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
      };
      if (editingId) {
        await api.put(`/api/services/${editingId}`, payload);
        toast.success("Service mis à jour.");
      } else {
        await api.post("/api/services", payload);
        toast.success("Service créé.");
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
    if (!confirm(`Supprimer le service « ${title} » ?`)) return;
    try {
      await api.delete(`/api/services/${id}`);
      toast.success("Service supprimé.");
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
            Services
          </h1>
          <p className="mt-1 text-sm text-[hsl(var(--color-muted))]">
            {items.length} service{items.length !== 1 ? "s" : ""}.
          </p>
        </div>
        <button
          onClick={openNew}
          className="rounded-lg bg-[hsl(var(--color-accent-warm))] px-4 py-2 text-sm font-semibold text-[hsl(var(--color-accent-warm-foreground))] shadow-sm transition hover:opacity-90"
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
                <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">
                  Icône
                </label>
                <input
                  className={inputClass}
                  placeholder="🔍"
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
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
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">
                Description *
              </label>
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
                <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">
                  Fourchette de prix
                </label>
                <input
                  className={inputClass}
                  placeholder="À partir de 1 500 €"
                  value={form.priceRange}
                  onChange={(e) => setForm({ ...form, priceRange: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">
                  Durée
                </label>
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
          <div className="col-span-full rounded-xl border border-dashed border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-8 text-center">
            <p className="text-sm text-[hsl(var(--color-muted))]">
              Aucun service. Cliquez sur « + Nouveau service » pour commencer.
            </p>
          </div>
        )}
        {items.map((s) => (
          <div
            key={s.id}
            className="rounded-xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-5 shadow-sm"
          >
            <div className="flex items-start gap-3 mb-2">
              {s.icon && <span className="text-2xl">{s.icon}</span>}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[hsl(var(--color-foreground))]">{s.title}</h3>
                <p className="text-xs text-[hsl(var(--color-muted))]">
                  {s.priceRange ?? "—"} · {s.duration ?? "—"}
                </p>
              </div>
            </div>
            <p className="text-sm text-[hsl(var(--color-muted))] line-clamp-3 mb-3">{s.description}</p>
            <div className="flex gap-2">
              <button
                onClick={() => openEdit(s)}
                className="rounded-lg border border-[hsl(var(--color-surface-muted))] px-3 py-1.5 text-xs font-medium text-[hsl(var(--color-muted))] transition hover:bg-[hsl(var(--color-surface-muted))]"
              >
                Modifier
              </button>
              <button
                onClick={() => handleDelete(s.id, s.title)}
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
