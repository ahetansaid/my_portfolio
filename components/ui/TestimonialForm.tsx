"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const inputClass =
  "w-full rounded-lg border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] px-3 py-2.5 text-sm text-[hsl(var(--color-foreground))] placeholder:text-[hsl(var(--color-muted))] focus:border-[hsl(var(--color-accent))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--color-accent))]/20 transition";

export function TestimonialForm() {
  const [form, setForm] = useState({
    authorName: "",
    authorRole: "",
    authorCompany: "",
    linkedinUrl: "",
    content: "",
    rating: 5,
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Erreur");
      }
      setStatus("success");
      setForm({
        authorName: "",
        authorRole: "",
        authorCompany: "",
        linkedinUrl: "",
        content: "",
        rating: 5,
      });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Erreur");
    }
  };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center"
      >
        <div className="text-3xl mb-2">✓</div>
        <h3 className="font-semibold text-green-900 mb-1">Merci pour votre témoignage !</h3>
        <p className="text-sm text-green-700">
          Il sera publié après modération. Vous recevrez une confirmation sous peu.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-6 shadow-sm">
      <h3 className="font-display text-lg font-semibold text-[hsl(var(--color-foreground))]">
        Laisser un témoignage
      </h3>
      <p className="text-sm text-[hsl(var(--color-muted))]">
        Votre retour sera publié après une rapide modération.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          className={inputClass}
          placeholder="Votre nom *"
          required
          value={form.authorName}
          onChange={(e) => setForm({ ...form, authorName: e.target.value })}
        />
        <input
          className={inputClass}
          placeholder="Votre rôle"
          value={form.authorRole}
          onChange={(e) => setForm({ ...form, authorRole: e.target.value })}
        />
        <input
          className={inputClass}
          placeholder="Entreprise"
          value={form.authorCompany}
          onChange={(e) => setForm({ ...form, authorCompany: e.target.value })}
        />
        <input
          className={inputClass}
          type="url"
          placeholder="LinkedIn (facultatif)"
          value={form.linkedinUrl}
          onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })}
        />
      </div>
      <textarea
        className={inputClass}
        rows={4}
        placeholder="Votre témoignage *"
        required
        value={form.content}
        onChange={(e) => setForm({ ...form, content: e.target.value })}
      />
      <div className="flex items-center gap-3">
        <span className="text-sm text-[hsl(var(--color-foreground))]">Note :</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setForm({ ...form, rating: n })}
              className={`text-2xl transition ${
                n <= form.rating ? "text-[hsl(var(--color-accent-warm))]" : "text-gray-300"
              }`}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-lg bg-[hsl(var(--color-accent-warm))] px-4 py-3 text-sm font-medium text-[hsl(var(--color-accent-warm-foreground))] shadow-sm transition hover:opacity-90 disabled:opacity-60"
      >
        {status === "loading" ? "Envoi…" : "Publier mon témoignage"}
      </button>
    </form>
  );
}
