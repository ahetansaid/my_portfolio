"use client";

import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api-client";
import { useToast } from "@/components/admin/Toaster";

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

type StatusFilter = "all" | Booking["status"];

const statusLabels: Record<Booking["status"], { label: string; color: string }> = {
  pending: { label: "En attente", color: "bg-amber-100 text-amber-800" },
  confirmed: { label: "Confirmé", color: "bg-emerald-100 text-emerald-800" },
  cancelled: { label: "Annulé", color: "bg-red-100 text-red-800" },
  completed: { label: "Terminé", color: "bg-[hsl(var(--color-accent))]/10 text-[hsl(var(--color-accent))]" },
};

export default function AdminBookingsPage() {
  const toast = useToast();
  const [items, setItems] = useState<Booking[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filter, setFilter] = useState<StatusFilter>("all");

  const load = async () => {
    try {
      const data = await api.get<Booking[]>("/api/bookings");
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setItems([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id: number, status: Booking["status"]) => {
    try {
      await api.put(`/api/bookings/${id}`, { status });
      toast.success(`Statut mis à jour : ${statusLabels[status].label}.`);
      await load();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Erreur lors de la mise à jour.");
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Supprimer la demande de ${name} ?`)) return;
    try {
      await api.delete(`/api/bookings/${id}`);
      toast.success("Demande supprimée.");
      await load();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Erreur lors de la suppression.");
    }
  };

  const filtered = filter === "all" ? items : items.filter((b) => b.status === filter);
  const pendingCount = items.filter((b) => b.status === "pending").length;

  const statusTabs: { value: StatusFilter; label: string; count: number }[] = [
    { value: "all", label: "Toutes", count: items.length },
    { value: "pending", label: "En attente", count: pendingCount },
    {
      value: "confirmed",
      label: "Confirmées",
      count: items.filter((b) => b.status === "confirmed").length,
    },
    {
      value: "completed",
      label: "Terminées",
      count: items.filter((b) => b.status === "completed").length,
    },
    {
      value: "cancelled",
      label: "Annulées",
      count: items.filter((b) => b.status === "cancelled").length,
    },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-[hsl(var(--color-foreground))]">
            Demandes de rendez-vous
          </h1>
          <p className="mt-1 text-sm text-[hsl(var(--color-muted))]">
            {items.length} demande{items.length !== 1 ? "s" : ""} au total
            {pendingCount > 0 && ` · ${pendingCount} en attente`}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 overflow-x-auto rounded-lg bg-[hsl(var(--color-surface-muted))] p-1">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              filter === tab.value
                ? "bg-[hsl(var(--color-surface))] text-[hsl(var(--color-foreground))] shadow-sm"
                : "text-[hsl(var(--color-muted))] hover:text-[hsl(var(--color-foreground))]"
            }`}
          >
            {tab.label}
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                filter === tab.value
                  ? "bg-[hsl(var(--color-accent))]/10 text-[hsl(var(--color-accent))]"
                  : "bg-[hsl(var(--color-surface-muted))] text-[hsl(var(--color-muted))]"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {filtered.map((b) => {
          const isExpanded = expandedId === b.id;
          return (
            <div
              key={b.id}
              className="rounded-xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-semibold text-[hsl(var(--color-foreground))]">
                      {b.name}
                    </span>
                    {b.company && (
                      <span className="text-sm text-[hsl(var(--color-muted))]">· {b.company}</span>
                    )}
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        statusLabels[b.status].color
                      }`}
                    >
                      {statusLabels[b.status].label}
                    </span>
                  </div>
                  <p className="text-sm text-[hsl(var(--color-foreground))] font-medium mb-1">
                    {b.topic}
                  </p>
                  <p className="text-xs text-[hsl(var(--color-muted))]">
                    {b.email} {b.phone && `· ${b.phone}`} ·{" "}
                    {new Date(b.createdAt).toLocaleString("fr-FR")}
                  </p>
                  {b.preferredDate && (
                    <p className="text-xs text-[hsl(var(--color-muted))] mt-1">
                      📅 Date souhaitée : {new Date(b.preferredDate).toLocaleString("fr-FR")} (
                      {b.duration} min)
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
                  className="shrink-0 text-xs text-[hsl(var(--color-accent))] hover:underline"
                >
                  {isExpanded ? "Réduire" : "Détails"}
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => updateStatus(b.id, "confirmed")}
                  disabled={b.status === "confirmed"}
                  className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ✓ Confirmer
                </button>
                <button
                  onClick={() => updateStatus(b.id, "completed")}
                  disabled={b.status === "completed"}
                  className="rounded-lg border border-[hsl(var(--color-accent))]/30 bg-[hsl(var(--color-accent))]/10 px-3 py-1.5 text-xs font-medium text-[hsl(var(--color-accent))] transition hover:bg-[hsl(var(--color-accent))]/20 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ✓✓ Terminé
                </button>
                <button
                  onClick={() => updateStatus(b.id, "cancelled")}
                  disabled={b.status === "cancelled"}
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ✗ Annuler
                </button>
                <a
                  href={`mailto:${b.email}?subject=Re: ${encodeURIComponent(b.topic)}`}
                  className="rounded-lg bg-[hsl(var(--color-accent))]/10 px-3 py-1.5 text-xs font-medium text-[hsl(var(--color-accent))] transition hover:bg-[hsl(var(--color-accent))]/20"
                >
                  ✉ Répondre
                </a>
                <button
                  onClick={() => handleDelete(b.id, b.name)}
                  className="ml-auto rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
                >
                  Supprimer
                </button>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="rounded-xl border border-dashed border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-12 text-center">
            <p className="text-sm text-[hsl(var(--color-muted))]">
              {filter === "all"
                ? "Aucune demande de RDV pour l'instant."
                : `Aucune demande ${statusLabels[filter as Booking["status"]]?.label.toLowerCase() ?? ""}.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
