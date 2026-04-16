"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const inputClass =
  "w-full rounded-lg border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] px-3 py-2.5 text-sm text-[hsl(var(--color-foreground))] placeholder:text-[hsl(var(--color-muted))] focus:border-[hsl(var(--color-accent))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--color-accent))]/20 transition";

export function BookingForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    topic: "",
    message: "",
    preferredDate: "",
    duration: 30,
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Erreur d'envoi");
      }
      setStatus("success");
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
        className="flex flex-col items-center justify-center rounded-2xl border border-green-200 bg-green-50 p-12 text-center"
      >
        <div className="mb-4 text-5xl">✓</div>
        <h2 className="font-display text-2xl font-bold text-green-900">Demande envoyée !</h2>
        <p className="mt-3 text-green-700 max-w-md">
          Merci. Je reviens vers vous dans les 24h pour confirmer un créneau et vous envoyer une
          invitation calendrier.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-8 shadow-sm"
    >
      <h2 className="font-display text-xl font-semibold text-[hsl(var(--color-foreground))]">
        Demande de rendez-vous
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[hsl(var(--color-foreground))]">
            Nom complet *
          </label>
          <input
            className={inputClass}
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[hsl(var(--color-foreground))]">Email *</label>
          <input
            className={inputClass}
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[hsl(var(--color-foreground))]">Entreprise</label>
          <input
            className={inputClass}
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[hsl(var(--color-foreground))]">Téléphone</label>
          <input
            className={inputClass}
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-[hsl(var(--color-foreground))]">
          Sujet du RDV *
        </label>
        <input
          className={inputClass}
          required
          placeholder="Ex : discuter d'un projet d'intégration ERP"
          value={form.topic}
          onChange={(e) => setForm({ ...form, topic: e.target.value })}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-[hsl(var(--color-foreground))]">
          Contexte & détails
        </label>
        <textarea
          className={inputClass}
          rows={4}
          placeholder="Quelques lignes pour me préparer à notre échange…"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[hsl(var(--color-foreground))]">
            Créneau souhaité
          </label>
          <input
            className={inputClass}
            type="datetime-local"
            value={form.preferredDate}
            onChange={(e) => setForm({ ...form, preferredDate: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[hsl(var(--color-foreground))]">Durée</label>
          <select
            className={inputClass}
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
          >
            <option value={30}>30 minutes</option>
            <option value={45}>45 minutes</option>
            <option value={60}>1 heure</option>
          </select>
        </div>
      </div>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-lg bg-[hsl(var(--color-accent-warm))] px-4 py-3 text-sm font-semibold text-[hsl(var(--color-accent-warm-foreground))] shadow-sm transition hover:opacity-90 disabled:opacity-60"
      >
        {status === "loading" ? "Envoi…" : "📅 Envoyer ma demande"}
      </button>
      <p className="text-center text-xs text-[hsl(var(--color-muted))]">
        Je reviens vers vous sous 24h avec une proposition de créneau ferme.
      </p>
    </motion.form>
  );
}
