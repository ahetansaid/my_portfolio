"use client";

import { useEffect, useState } from "react";

type Booking = {
  id: number;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  topic: string;
  message: string | null;
  preferredDate: string | null;
  duration: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  adminNotes: string | null;
  createdAt: string;
};

const statusLabels: Record<Booking["status"], { label: string; color: string }> = {
  pending: { label: "En attente", color: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "Confirmé", color: "bg-green-100 text-green-800" },
  cancelled: { label: "Annulé", color: "bg-red-100 text-red-800" },
  completed: { label: "Terminé", color: "bg-blue-100 text-blue-800" },
};

export default function AdminBookingsPage() {
  const [items, setItems] = useState<Booking[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const load = async () => {
    const res = await fetch("/api/bookings");
    if (res.ok) setItems(await res.json());
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id: number, status: Booking["status"], adminNotes?: string) => {
    await fetch(`/api/bookings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, adminNotes }),
    });
    await load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cette demande ?")) return;
    await fetch(`/api/bookings/${id}`, { method: "DELETE" });
    await load();
  };

  const pendingCount = items.filter((b) => b.status === "pending").length;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-[hsl(var(--color-foreground))]">
          Demandes de RDV
        </h1>
        {pendingCount > 0 && (
          <span className="rounded-full bg-[hsl(var(--color-accent))] px-3 py-1 text-xs font-medium text-[hsl(var(--color-accent-foreground))]">
            {pendingCount} en attente
          </span>
        )}
      </div>

      <div className="grid gap-4">
        {items.map((b) => {
          const isExpanded = expandedId === b.id;
          return (
            <div
              key={b.id}
              className="rounded-xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-semibold text-[hsl(var(--color-foreground))]">{b.name}</span>
                    {b.company && (
                      <span className="text-sm text-[hsl(var(--color-muted))]">· {b.company}</span>
                    )}
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusLabels[b.status].color}`}
                    >
                      {statusLabels[b.status].label}
                    </span>
                  </div>
                  <p className="text-sm text-[hsl(var(--color-foreground))] font-medium mb-1">{b.topic}</p>
                  <p className="text-xs text-[hsl(var(--color-muted))]">
                    {b.email} {b.phone && `· ${b.phone}`} · {new Date(b.createdAt).toLocaleString("fr-FR")}
                  </p>
                  {b.preferredDate && (
                    <p className="text-xs text-[hsl(var(--color-muted))] mt-1">
                      📅 Date souhaitée : {new Date(b.preferredDate).toLocaleString("fr-FR")} ({b.duration} min)
                    </p>
                  )}
                  {isExpanded && b.message && (
                    <div className="mt-3 p-3 rounded-lg bg-[hsl(var(--color-surface-muted))] text-sm text-[hsl(var(--color-foreground))] whitespace-pre-wrap">
                      {b.message}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setExpandedId(isExpanded ? null : b.id)}
                  className="text-xs text-[hsl(var(--color-accent))] hover:underline shrink-0"
                >
                  {isExpanded ? "Réduire" : "Détails"}
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => updateStatus(b.id, "confirmed")}
                  disabled={b.status === "confirmed"}
                  className="rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  ✓ Confirmer
                </button>
                <button
                  onClick={() => updateStatus(b.id, "completed")}
                  disabled={b.status === "completed"}
                  className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  ✓✓ Terminé
                </button>
                <button
                  onClick={() => updateStatus(b.id, "cancelled")}
                  disabled={b.status === "cancelled"}
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  ✗ Annuler
                </button>
                <a
                  href={`mailto:${b.email}?subject=Re: ${encodeURIComponent(b.topic)}`}
                  className="rounded-lg bg-[hsl(var(--color-accent))]/10 px-3 py-1.5 text-xs font-medium text-[hsl(var(--color-accent))] hover:bg-[hsl(var(--color-accent))]/20 transition"
                >
                  ✉️ Répondre
                </a>
                <button
                  onClick={() => handleDelete(b.id)}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition ml-auto"
                >
                  Supprimer
                </button>
              </div>
            </div>
          );
        })}
        {items.length === 0 && (
          <p className="text-center text-sm text-[hsl(var(--color-muted))] py-12">
            Aucune demande de RDV pour l&apos;instant.
          </p>
        )}
      </div>
    </div>
  );
}
