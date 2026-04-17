"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTED = [
  "Quels sont ses projets phares ?",
  "Est-il disponible pour une mission ?",
  "Quelle est sa stack ?",
  "Combien coûte un audit SI ?",
];

export function MagicChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // Welcome message on first open
  useEffect(() => {
    if (open && !hasInteracted && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content:
            "👋 Salut ! Je suis l'assistant IA de Mohamed. Pose-moi une question sur ses projets, sa stack, sa disponibilité, ou ses services — je réponds en quelques secondes.",
        },
      ]);
      setHasInteracted(true);
    }
  }, [open, hasInteracted, messages.length]);

  const send = async (text: string) => {
    const userMsg = text.trim();
    if (!userMsg || loading) return;

    setInput("");
    setLoading(true);
    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: userMsg },
    ];
    setMessages(newMessages);
    // Placeholder for streaming assistant message
    setMessages([...newMessages, { role: "assistant", content: "" }]);

    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: "Erreur" }));
        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content: `❌ ${error.error ?? "Une erreur est survenue."}`,
          },
        ]);
        setLoading(false);
        return;
      }

      // Read stream
      const reader = res.body?.getReader();
      if (!reader) {
        setLoading(false);
        return;
      }

      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages([
          ...newMessages,
          { role: "assistant", content: accumulated },
        ]);
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        // Aborted cleanly
      } else {
        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content: "❌ Connexion impossible. Réessaye dans un instant.",
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
  };

  return (
    <>
      {/* FLOATING BUTTON */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, duration: 0.4 }}
        onClick={() => setOpen(true)}
        aria-label="Ouvrir le chat IA"
        className={`fixed bottom-6 right-6 z-40 flex h-14 items-center gap-3 rounded-full bg-gradient-to-br from-[hsl(var(--color-accent))] via-[hsl(var(--color-accent-warm))] to-[hsl(var(--color-electric))] px-5 shadow-[0_8px_32px_rgba(0,0,0,0.25)] transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(163,230,53,0.5)] ${
          open ? "pointer-events-none opacity-0" : ""
        }`}
      >
        <motion.span
          animate={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="text-2xl"
        >
          ✨
        </motion.span>
        <span className="font-display text-sm font-bold text-white">
          Demander à l&apos;IA
        </span>
        <motion.span
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          className="h-2 w-2 rounded-full bg-white/90"
        />
      </motion.button>

      {/* CHAT PANEL */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop (mobile only) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
            />

            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 260 }}
              className="fixed inset-x-4 bottom-4 z-50 flex h-[80vh] max-h-[640px] flex-col overflow-hidden rounded-3xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] shadow-[0_24px_64px_rgba(0,0,0,0.3)] md:inset-auto md:bottom-6 md:right-6 md:h-[560px] md:w-[420px]"
            >
              {/* HEADER */}
              <div className="relative border-b border-[hsl(var(--color-surface-muted))] bg-gradient-to-br from-[hsl(var(--color-accent))]/10 via-transparent to-[hsl(var(--color-accent-warm))]/10 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[hsl(var(--color-accent))] via-[hsl(var(--color-accent-warm))] to-[hsl(var(--color-electric))] text-lg"
                    >
                      ✨
                    </motion.div>
                    <motion.span
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{ duration: 1.6, repeat: Infinity }}
                      className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-[hsl(var(--color-surface))] bg-[hsl(var(--color-electric))]"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-sm font-bold text-[hsl(var(--color-foreground))]">
                      Assistant IA de Mohamed
                    </div>
                    <div className="text-[11px] text-[hsl(var(--color-muted))]">
                      Propulsé par GPT-4 · Réponse en temps réel
                    </div>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    aria-label="Fermer le chat"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-[hsl(var(--color-muted))] transition hover:bg-[hsl(var(--color-surface-muted))] hover:text-[hsl(var(--color-foreground))]"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* MESSAGES */}
              <div
                ref={scrollRef}
                className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
              >
                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        m.role === "user"
                          ? "bg-gradient-to-br from-[hsl(var(--color-accent))] to-[hsl(var(--color-accent-warm))] text-white"
                          : "bg-[hsl(var(--color-surface-muted))] text-[hsl(var(--color-foreground))]"
                      }`}
                    >
                      {m.content || (loading && i === messages.length - 1 ? (
                        <span className="inline-flex gap-1">
                          <motion.span
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                            className="h-1.5 w-1.5 rounded-full bg-current"
                          />
                          <motion.span
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                            className="h-1.5 w-1.5 rounded-full bg-current"
                          />
                          <motion.span
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                            className="h-1.5 w-1.5 rounded-full bg-current"
                          />
                        </span>
                      ) : null)}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* SUGGESTIONS (only if no user message yet) */}
              {messages.filter((m) => m.role === "user").length === 0 && (
                <div className="border-t border-[hsl(var(--color-surface-muted))] px-4 py-3">
                  <div className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-[hsl(var(--color-muted))]">
                    Suggestions
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED.map((s) => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        className="rounded-full border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] px-3 py-1 text-xs text-[hsl(var(--color-foreground))] transition hover:border-[hsl(var(--color-accent))] hover:bg-[hsl(var(--color-accent))]/5"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* INPUT */}
              <form
                onSubmit={handleSubmit}
                className="flex gap-2 border-t border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-3"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Pose ta question…"
                  disabled={loading}
                  className="flex-1 rounded-full border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface-muted))]/50 px-4 py-2.5 text-sm text-[hsl(var(--color-foreground))] placeholder:text-[hsl(var(--color-muted))] focus:border-[hsl(var(--color-accent))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--color-accent))]/20"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  aria-label="Envoyer"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[hsl(var(--color-accent))] via-[hsl(var(--color-accent-warm))] to-[hsl(var(--color-electric))] text-white shadow-md transition hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading ? "…" : "↑"}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
