"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

type ToastVariant = "success" | "error" | "info";
type Toast = { id: number; message: string; variant: ToastVariant };

type ToastContextValue = {
  toast: (message: string, variant?: ToastVariant) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToasterProvider>");
  return ctx;
}

export function ToasterProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((message: string, variant: ToastVariant = "info") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const value: ToastContextValue = {
    toast: push,
    success: (m) => push(m, "success"),
    error: (m) => push(m, "error"),
    info: (m) => push(m, "info"),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={(id) => setToasts((p) => p.filter((t) => t.id !== id))} />
    </ToastContext.Provider>
  );
}

function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: number) => void;
}) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4 sm:bottom-6 sm:right-6 sm:left-auto sm:items-end">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={() => onDismiss(t.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const styles: Record<ToastVariant, { bar: string; icon: string; label: string }> = {
    success: {
      bar: "bg-emerald-500",
      icon: "✓",
      label: "border-emerald-200 bg-white text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950 dark:text-emerald-100",
    },
    error: {
      bar: "bg-red-500",
      icon: "✕",
      label: "border-red-200 bg-white text-red-900 dark:border-red-900/40 dark:bg-red-950 dark:text-red-100",
    },
    info: {
      bar: "bg-[hsl(var(--color-accent))]",
      icon: "ℹ",
      label: "border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] text-[hsl(var(--color-foreground))]",
    },
  };
  const s = styles[toast.variant];

  return (
    <div
      className={`pointer-events-auto flex w-full max-w-sm items-stretch overflow-hidden rounded-xl border shadow-lg transition-all duration-200 ${s.label} ${
        mounted ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      }`}
      role="status"
    >
      <div className={`flex w-10 shrink-0 items-center justify-center text-white ${s.bar}`}>
        <span className="text-sm font-bold">{s.icon}</span>
      </div>
      <div className="flex flex-1 items-start gap-3 px-4 py-3">
        <p className="flex-1 text-sm font-medium leading-snug">{toast.message}</p>
        <button
          type="button"
          onClick={onDismiss}
          className="text-lg leading-none text-current opacity-50 transition hover:opacity-100"
          aria-label="Fermer"
        >
          ×
        </button>
      </div>
    </div>
  );
}
