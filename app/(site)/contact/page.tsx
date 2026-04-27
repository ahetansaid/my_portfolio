"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

const inputClass =
  "mt-1 block w-full rounded-lg border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] px-3 py-2 text-sm text-[hsl(var(--color-foreground))] shadow-sm placeholder:text-[hsl(var(--color-muted))] focus:border-[hsl(var(--color-accent))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--color-accent))]/20";

export default function ContactPage() {
  const t = useTranslations("contactPage");
  const tCommon = useTranslations("common");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } else {
      const data = await res.json();
      setErrorMsg(data.error ?? tCommon("error"));
      setStatus("error");
    }
  }

  return (
    <div className="section-padding">
      <div className="container-tight">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left col */}
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl text-[hsl(var(--color-foreground))]">
              {t("title")}
            </h1>
            <p className="mt-4 text-[hsl(var(--color-muted))] leading-relaxed">
              {t("description")}
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(var(--color-surface-muted))] text-lg">
                  📧
                </div>
                <div>
                  <p className="text-xs font-medium text-[hsl(var(--color-muted))] uppercase tracking-wide">Email</p>
                  <a href="mailto:saidahetan@gmail.com"
                    className="text-sm font-medium text-[hsl(var(--color-foreground))] hover:text-[hsl(var(--color-accent))] transition">
                    saidahetan@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(var(--color-surface-muted))] text-lg">
                  💼
                </div>
                <div>
                  <p className="text-xs font-medium text-[hsl(var(--color-muted))] uppercase tracking-wide">LinkedIn</p>
                  <a href="https://linkedin.com/in/mohamed-saïd-ahetan" target="_blank" rel="noopener noreferrer"
                    className="text-sm font-medium text-[hsl(var(--color-foreground))] hover:text-[hsl(var(--color-accent))] transition">
                    @mohamed-saïd-ahetan
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(var(--color-surface-muted))] text-lg">
                  🐙
                </div>
                <div>
                  <p className="text-xs font-medium text-[hsl(var(--color-muted))] uppercase tracking-wide">GitHub</p>
                  <a href="https://github.com/ahetansaid" target="_blank" rel="noopener noreferrer"
                    className="text-sm font-medium text-[hsl(var(--color-foreground))] hover:text-[hsl(var(--color-accent))] transition">
                    @ahetansaid
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="rounded-2xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-8 shadow-sm">
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                <div className="text-4xl mb-3">✅</div>
                <h2 className="font-display text-lg font-semibold text-[hsl(var(--color-foreground))]">
                  {t("successTitle")}
                </h2>
                <p className="mt-2 text-sm text-[hsl(var(--color-muted))]">
                  {t("successMessage")}
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-6 rounded-lg border border-[hsl(var(--color-surface-muted))] px-4 py-2 text-sm text-[hsl(var(--color-muted))] hover:bg-[hsl(var(--color-surface-muted))] transition"
                >
                  {t("sendAnother")}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[hsl(var(--color-foreground))]">
                      {t("labelName")} *
                    </label>
                    <input id="name" type="text" required placeholder={t("placeholderName")}
                      className={inputClass} value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[hsl(var(--color-foreground))]">
                      {t("labelEmail")} *
                    </label>
                    <input id="email" type="email" required placeholder={t("placeholderEmail")}
                      className={inputClass} value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-[hsl(var(--color-foreground))]">
                    {t("labelSubject")}
                  </label>
                  <input id="subject" type="text" placeholder={t("placeholderSubject")}
                    className={inputClass} value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })} />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-[hsl(var(--color-foreground))]">
                    {t("labelMessage")} *
                  </label>
                  <textarea id="message" rows={5} required placeholder={t("placeholderMessage")}
                    className={inputClass} value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })} />
                </div>

                {status === "error" && (
                  <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                    {errorMsg}
                  </p>
                )}

                <button type="submit" disabled={status === "loading"}
                  className="w-full rounded-lg bg-[hsl(var(--color-accent-warm))] px-4 py-3 text-sm font-medium text-[hsl(var(--color-accent-warm-foreground))] shadow-sm transition hover:opacity-90 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--color-accent-warm))] focus:ring-offset-2">
                  {status === "loading" ? t("submitting") : t("submit")}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
