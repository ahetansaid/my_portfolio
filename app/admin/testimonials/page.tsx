"use client";

import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api-client";
import { useToast } from "@/components/admin/Toaster";

type Testimonial = {
  id: number;
  authorName: string;
  authorRole: string | null;
  authorCompany: string | null;
  authorAvatar: string | null;
  linkedinUrl: string | null;
  content: string;
  rating: number;
  isPublished: boolean;
  sortOrder: number;
  createdAt: string;
};

const inputClass =
  "w-full rounded-lg border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] px-3 py-2 text-sm text-[hsl(var(--color-foreground))] placeholder:text-[hsl(var(--color-muted))] focus:border-[hsl(var(--color-accent))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--color-accent))]/20";

export default function AdminTestimonialsPage() {
  const toast = useToast();
  const [items, setItems] = useState<Testimonial[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    authorName: "",
    authorRole: "",
    authorCompany: "",
    authorAvatar: "",
    linkedinUrl: "",
    content: "",
    rating: 5,
    isPublished: false,
    sortOrder: 0,
  });

  const load = async () => {
    try {
      const data = await api.get<Testimonial[]>("/api/testimonials?all=1", { redirectOn401: false });
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
      authorName: "",
      authorRole: "",
      authorCompany: "",
      authorAvatar: "",
      linkedinUrl: "",
      content: "",
      rating: 5,
      isPublished: false,
      sortOrder: 0,
    });
    setEditingId(null);
  };

  const openNew = () => {
    resetForm();
    setShowForm(true);
  };

  const openEdit = (t: Testimonial) => {
    setForm({
      authorName: t.authorName,
      authorRole: t.authorRole ?? "",
      authorCompany: t.authorCompany ?? "",
      authorAvatar: t.authorAvatar ?? "",
      linkedinUrl: t.linkedinUrl ?? "",
      content: t.content,
      rating: t.rating,
      isPublished: t.isPublished,
      sortOrder: t.sortOrder,
    });
    setEditingId(t.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await api.put(`/api/testimonials/${editingId}`, form);
        toast.success("Témoignage mis à jour.");
      } else {
        await api.post("/api/testimonials", form);
        toast.success("Témoignage créé.");
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

  const handleDelete = async (id: number, author: string) => {
    if (!confirm(`Supprimer le témoignage de ${author} ?`)) return;
    try {
      await api.delete(`/api/testimonials/${id}`);
      toast.success("Témoignage supprimé.");
      await load();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Erreur lors de la suppression.");
    }
  };

  const togglePublish = async (t: Testimonial) => {
    try {
      await api.put(`/api/testimonials/${t.id}`, { ...t, isPublished: !t.isPublished });
      toast.success(t.isPublished ? "Dépublié." : "Publié.");
      await load();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Erreur.");
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-[hsl(var(--color-foreground))]">
            Témoignages
          </h1>
          <p className="mt-1 text-sm text-[hsl(var(--color-muted))]">
            {items.length} témoignage{items.length !== 1 ? "s" : ""} ·{" "}
            {items.filter((t) => t.isPublished).length} publié(s)
          </p>
        </div>
        <button
          onClick={openNew}
          className="rounded-lg bg-[hsl(var(--color-accent-warm))] px-4 py-2 text-sm font-semibold text-[hsl(var(--color-accent-warm-foreground))] shadow-sm transition hover:opacity-90"
        >
          + Nouveau témoignage
        </button>
      </div>

      {showForm && (
        <div className="mb-8 rounded-xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-6 shadow-sm">
          <h2 className="font-display text-lg font-semibold text-[hsl(var(--color-foreground))] mb-4">
            {editingId ? "Modifier le témoignage" : "Nouveau témoignage"}
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
                  value={form.authorName}
                  onChange={(e) => setForm({ ...form, authorName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">
                  Rôle
                </label>
                <input
                  className={inputClass}
                  value={form.authorRole}
                  onChange={(e) => setForm({ ...form, authorRole: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">
                  Entreprise
                </label>
                <input
                  className={inputClass}
                  value={form.authorCompany}
                  onChange={(e) => setForm({ ...form, authorCompany: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">
                  LinkedIn URL
                </label>
                <input
                  className={inputClass}
                  type="url"
                  value={form.linkedinUrl}
                  onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">
                Avatar URL
              </label>
              <input
                className={inputClass}
                type="url"
                placeholder="https://…"
                value={form.authorAvatar}
                onChange={(e) => setForm({ ...form, authorAvatar: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">
                Contenu *
              </label>
              <textarea
                className={inputClass}
                rows={4}
                required
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">
                  Note (1-5)
                </label>
                <input
                  className={inputClass}
                  type="number"
                  min={1}
                  max={5}
                  value={form.rating}
                  onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                />
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
              <label className="flex items-center gap-2 text-sm text-[hsl(var(--color-foreground))] cursor-pointer">
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

      <div className="grid gap-4">
        {items.length === 0 && (
          <div className="rounded-xl border border-dashed border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-8 text-center">
            <p className="text-sm text-[hsl(var(--color-muted))]">
              Aucun témoignage. Cliquez sur « + Nouveau témoignage » pour commencer.
            </p>
          </div>
        )}
        {items.map((t) => (
          <div
            key={t.id}
            className="rounded-xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-semibold text-[hsl(var(--color-foreground))]">
                    {t.authorName}
                  </span>
                  {t.authorRole && (
                    <span className="text-sm text-[hsl(var(--color-muted))]">
                      · {t.authorRole}
                      {t.authorCompany && ` @ ${t.authorCompany}`}
                    </span>
                  )}
                  <span className="text-xs">{"⭐".repeat(t.rating)}</span>
                </div>
                <p className="text-sm text-[hsl(var(--color-muted))] line-clamp-3">{t.content}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => togglePublish(t)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                    t.isPublished
                      ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                      : "bg-[hsl(var(--color-surface-muted))] text-[hsl(var(--color-muted))] hover:bg-[hsl(var(--color-surface-muted))]/80"
                  }`}
                >
                  {t.isPublished ? "✓ Publié" : "⏸ Brouillon"}
                </button>
                <button
                  onClick={() => openEdit(t)}
                  className="rounded-lg border border-[hsl(var(--color-surface-muted))] px-3 py-1.5 text-xs font-medium text-[hsl(var(--color-muted))] transition hover:bg-[hsl(var(--color-surface-muted))]"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(t.id, t.authorName)}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
