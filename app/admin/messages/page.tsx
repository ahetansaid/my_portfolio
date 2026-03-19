"use client";

import { useEffect, useState } from "react";

type Message = {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  createdAt: string;
};

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);

  async function load() {
    const res = await fetch("/api/contact/messages");
    const data = await res.json();
    setMessages(Array.isArray(data) ? data : []);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: number) {
    if (!confirm("Supprimer ce message ?")) return;
    await fetch(`/api/contact/messages/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-[hsl(var(--color-foreground))]">
          Messages de contact
        </h1>
        <span className="rounded-full bg-[hsl(var(--color-accent))]/10 px-3 py-1 text-xs font-medium text-[hsl(var(--color-accent))]">
          {messages.length} message{messages.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="space-y-3">
        {messages.length === 0 && (
          <div className="rounded-xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-8 text-center">
            <p className="text-[hsl(var(--color-muted))]">Aucun message reçu.</p>
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id}
            className="rounded-xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] shadow-sm overflow-hidden">
            <div className="flex items-start justify-between px-5 py-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-[hsl(var(--color-foreground))]">{msg.name}</p>
                  <a href={`mailto:${msg.email}`}
                    className="text-xs text-[hsl(var(--color-accent))] hover:underline">{msg.email}</a>
                </div>
                {msg.subject && (
                  <p className="text-sm text-[hsl(var(--color-muted))] mt-0.5">
                    Sujet : <span className="text-[hsl(var(--color-foreground))]">{msg.subject}</span>
                  </p>
                )}
                <p className="text-xs text-[hsl(var(--color-muted))] mt-1">
                  {new Date(msg.createdAt).toLocaleDateString("fr-FR", {
                    day: "2-digit", month: "long", year: "numeric",
                    hour: "2-digit", minute: "2-digit",
                  })}
                </p>
              </div>
              <div className="flex gap-2 shrink-0 ml-4">
                <button onClick={() => setExpanded(expanded === msg.id ? null : msg.id)}
                  className="rounded-lg border border-[hsl(var(--color-surface-muted))] px-3 py-1.5 text-xs text-[hsl(var(--color-muted))] hover:text-[hsl(var(--color-accent))] transition">
                  {expanded === msg.id ? "Réduire" : "Voir"}
                </button>
                <button onClick={() => handleDelete(msg.id)}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-500 hover:bg-red-50 transition">
                  Supprimer
                </button>
              </div>
            </div>
            {expanded === msg.id && (
              <div className="border-t border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface-muted))]/40 px-5 py-4">
                <p className="text-sm text-[hsl(var(--color-foreground))] leading-relaxed whitespace-pre-wrap">
                  {msg.message}
                </p>
                <a href={`mailto:${msg.email}?subject=Re: ${msg.subject ?? ""}`}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[hsl(var(--color-accent))]/10 px-3 py-1.5 text-xs font-medium text-[hsl(var(--color-accent))] hover:bg-[hsl(var(--color-accent))]/20 transition">
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
