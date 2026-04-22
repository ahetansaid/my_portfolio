"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const target = from && from.startsWith("/admin") ? from : "/admin";
        router.push(target);
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Erreur de connexion.");
      }
    } catch {
      setError("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--color-surface-muted))] px-4">
      <div className="w-full max-w-sm rounded-2xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-8 shadow-lg">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[hsl(var(--color-accent))] via-[hsl(var(--color-accent-warm))] to-[hsl(var(--color-electric))] text-sm font-black text-white">
            BO
          </span>
          <div>
            <h1 className="font-display text-xl font-bold text-[hsl(var(--color-foreground))]">
              Backoffice
            </h1>
            <p className="text-xs text-[hsl(var(--color-muted))]">Connexion administrateur</p>
          </div>
        </div>

        {from && (
          <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
            Votre session a expiré. Reconnectez-vous pour continuer.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1.5"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] px-3 py-2 text-sm text-[hsl(var(--color-foreground))] placeholder:text-[hsl(var(--color-muted))] focus:border-[hsl(var(--color-accent))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--color-accent))]/20"
              placeholder="admin@exemple.com"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[hsl(var(--color-foreground))] mb-1.5"
            >
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] px-3 py-2 text-sm text-[hsl(var(--color-foreground))] placeholder:text-[hsl(var(--color-muted))] focus:border-[hsl(var(--color-accent))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--color-accent))]/20"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[hsl(var(--color-accent-warm))] px-4 py-2.5 text-sm font-semibold text-[hsl(var(--color-accent-warm-foreground))] shadow-sm transition hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Connexion…" : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--color-surface-muted))]">
          <p className="text-sm text-[hsl(var(--color-muted))]">Chargement…</p>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
