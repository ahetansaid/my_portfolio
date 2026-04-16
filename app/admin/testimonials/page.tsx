"use client";

import { useEffect, useState } from "react";

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
  const [items, setItems] = useState<Testimonial[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    const res = await fetch("/api/testimonials?all=1");
    if (res.ok) setItems(await res.json());
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
    setError(null);
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
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const url = editingId ? `/api/testimonials/${editingId}` : "/api/testimonials";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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
    if (!confirm("Supprimer ce témoignage ?")) return;
    await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
    await load();
  };

  const togglePublish = async (t: Testimonial) => {
    await fetch(`/api/testimonials/${t.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...t, isPublished: !t.isPublished }),
    });
    await load();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-[hsl(var(--color-foreground))]">
          Témoignages
        </h1>
        <button
          onClick={openNew}
          className="rounded-lg bg-[hsl(var(--color-accent-warm))] px-4 py-2 text-sm font-medium text-[hsl(var(--color-accent-warm-foreground))] hover:opacity-90 transition"
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
                <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">Nom *</label>
                <input
                  className={inputClass}
                  required
                  value={form.authorName}
                  onChange={(e) => setForm({ ...form, authorName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">Rôle</label>
                <input
                  className={inputClass}
                  value={form.authorRole}
                  onChange={(e) => setForm({ ...form, authorRole: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">Entreprise</label>
                <input
                  className={inputClass}
                  value={form.authorCompany}
                  onChange={(e) => setForm({ ...form, authorCompany: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">LinkedIn URL</label>
                <input
                  className={inputClass}
                  type="url"
                  value={form.linkedinUrl}
                  onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">Avatar URL</label>
              <input
                className={inputClass}
                type="url"
                placeholder="https://…"
                value={form.authorAvatar}
                onChange={(e) => setForm({ ...form, authorAvatar: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">Contenu *</label>
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
                <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">Note (1-5)</label>
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
                <label className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1">Ordre</label>
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

      <div className="grid gap-4">
        {items.map((t) => (
          <div
            key={t.id}
            className="rounded-xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-[hsl(var(--color-foreground))]">{t.authorName}</span>
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
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {t.isPublished ? "✓ Publié" : "⏸ Brouillon"}
                </button>
                <button
                  onClick={() => openEdit(t)}
                  className="rounded-lg border border-[hsl(var(--color-surface-muted))] px-3 py-1.5 text-xs font-medium text-[hsl(var(--color-muted))] hover:bg-[hsl(var(--color-surface-muted))] transition"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-center text-sm text-[hsl(var(--color-muted))] py-12">
            Aucun témoignage. Cliquez sur « + Nouveau témoignage » pour commencer.
          </p>
        )}
      </div>
    </div>
  );
}
