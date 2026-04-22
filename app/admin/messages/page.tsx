"use client";

import { useEffect, useMemo, useState } from "react";
import { api, ApiError } from "@/lib/api-client";
import { useToast } from "@/components/admin/Toaster";

type Message = {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
};

type Filter = "all" | "unread" | "read";

export default function AdminMessagesPage() {
  const toast = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  async function load() {
    try {
      const data = await api.get<Message[]>("/api/contact/messages");
      setMessages(Array.isArray(data) ? data : []);
    } catch {
      setMessages([]);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Supprimer le message de ${name} ?`)) return;
    try {
      await api.delete(`/api/contact/messages/${id}`);
      toast.success("Message supprimé.");
      load();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Erreur lors de la suppression.");
    }
  }

  async function toggleRead(msg: Message) {
    try {
      await api.patch(`/api/contact/messages/${msg.id}`, { isRead: !msg.isRead });
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, isRead: !msg.isRead } : m))
      );
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Erreur.");
    }
  }

  const unreadCount = messages.filter((m) => !m.isRead).length;

  const filtered = useMemo(() => {
    return messages.filter((m) => {
      if (filter === "unread" && m.isRead) return false;
      if (filter === "read" && !m.isRead) return false;
      if (query) {
        const q = query.toLowerCase();
        return (
          m.name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          (m.subject ?? "").toLowerCase().includes(q) ||
          m.message.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [messages, filter, query]);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-[hsl(var(--color-foreground))]">
            Messages de contact
          </h1>
          <p className="mt-1 text-sm text-[hsl(var(--color-muted))]">
            {messages.length} message{messages.length !== 1 ? "s" : ""} au total
            {unreadCount > 0 && ` · ${unreadCount} non lu${unreadCount !== 1 ? "s" : ""}`}
          </p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="flex gap-1 rounded-lg bg-[hsl(var(--color-surface-muted))] p-1">
          {(["all", "unread", "read"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                filter === f
                  ? "bg-[hsl(var(--color-surface))] text-[hsl(var(--color-foreground))] shadow-sm"
                  : "text-[hsl(var(--color-muted))] hover:text-[hsl(var(--color-foreground))]"
              }`}
            >
              {f === "all" ? "Tous" : f === "unread" ? `Non lus (${unreadCount})` : "Lus"}
            </button>
          ))}
        </div>
        <input
          type="search"
          placeholder="Rechercher…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 min-w-[200px] rounded-lg border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] px-3 py-1.5 text-sm text-[hsl(var(--color-foreground))] placeholder:text-[hsl(var(--color-muted))] focus:border-[hsl(var(--color-accent))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--color-accent))]/20"
        />
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="rounded-xl border border-dashed border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-8 text-center">
            <p className="text-sm text-[hsl(var(--color-muted))]">
              {messages.length === 0 ? "Aucun message reçu." : "Aucun message ne correspond."}
            </p>
          </div>
        )}
        {filtered.map((msg) => (
          <div
            key={msg.id}
            className={`rounded-xl border bg-[hsl(var(--color-surface))] shadow-sm overflow-hidden transition ${
              msg.isRead
                ? "border-[hsl(var(--color-surface-muted))]"
                : "border-[hsl(var(--color-accent-warm))]/40 bg-[hsl(var(--color-accent-warm))]/5"
            }`}
          >
            <div className="flex items-start justify-between gap-4 px-5 py-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {!msg.isRead && (
                    <span
                      className="h-2 w-2 shrink-0 rounded-full bg-[hsl(var(--color-accent-warm))]"
                      aria-label="Non lu"
                    />
                  )}
                  <p className="font-medium text-[hsl(var(--color-foreground))]">{msg.name}</p>
                  <a
                    href={`mailto:${msg.email}`}
                    className="text-xs text-[hsl(var(--color-accent))] hover:underline"
                  >
                    {msg.email}
                  </a>
                </div>
                {msg.subject && (
                  <p className="text-sm text-[hsl(var(--color-muted))] mt-0.5">
                    Sujet :{" "}
                    <span className="text-[hsl(var(--color-foreground))]">{msg.subject}</span>
                  </p>
                )}
                <p className="text-xs text-[hsl(var(--color-muted))] mt-1">
                  {new Date(msg.createdAt).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => toggleRead(msg)}
                  className="rounded-lg border border-[hsl(var(--color-surface-muted))] px-3 py-1.5 text-xs text-[hsl(var(--color-muted))] transition hover:text-[hsl(var(--color-accent))]"
                >
                  {msg.isRead ? "Marquer non lu" : "Marquer lu"}
                </button>
                <button
                  onClick={() => {
                    const next = expanded === msg.id ? null : msg.id;
                    setExpanded(next);
                    if (next !== null && !msg.isRead) toggleRead(msg);
                  }}
                  className="rounded-lg border border-[hsl(var(--color-surface-muted))] px-3 py-1.5 text-xs text-[hsl(var(--color-muted))] transition hover:text-[hsl(var(--color-accent))]"
                >
                  {expanded === msg.id ? "Réduire" : "Voir"}
                </button>
                <button
                  onClick={() => handleDelete(msg.id, msg.name)}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-500 transition hover:bg-red-50"
                >
                  Supprimer
                </button>
              </div>
            </div>
            {expanded === msg.id && (
              <div className="border-t border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface-muted))]/40 px-5 py-4">
                <p className="text-sm text-[hsl(var(--color-foreground))] leading-relaxed whitespace-pre-wrap">
                  {msg.message}
                </p>
                <a
                  href={`mailto:${msg.email}?subject=Re: ${msg.subject ?? ""}`}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[hsl(var(--color-accent))]/10 px-3 py-1.5 text-xs font-medium text-[hsl(var(--color-accent))] transition hover:bg-[hsl(var(--color-accent))]/20"
                >
                  Répondre par email →
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
