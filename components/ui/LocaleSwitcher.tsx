"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { motion } from "framer-motion";
import { setLocaleAction } from "@/app/actions/locale";
import type { Locale } from "@/i18n/request";

export function LocaleSwitcher({ variant = "light" }: { variant?: "light" | "dark" }) {
  const locale = useLocale();
  const t = useTranslations("locale");
  const [isPending, startTransition] = useTransition();

  const next: Locale = locale === "fr" ? "en" : "fr";

  const handleClick = () => {
    startTransition(async () => {
      await setLocaleAction(next);
    });
  };

  const isDark = variant === "dark";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label={t("switchTo")}
      title={locale === "fr" ? t("labelEn") : t("labelFr")}
      className={`group relative inline-flex h-9 items-center gap-1 rounded-full border px-1 text-[11px] font-bold uppercase tracking-wider transition disabled:opacity-50 ${
        isDark
          ? "border-white/15 bg-white/5 hover:border-[hsl(var(--color-electric))]/50"
          : "border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] hover:border-[hsl(var(--color-accent))]/50"
      }`}
    >
      {(["fr", "en"] as const).map((loc) => {
        const active = locale === loc;
        return (
          <span
            key={loc}
            className={`relative z-10 rounded-full px-2.5 py-1 transition-colors ${
              active
                ? "text-[hsl(var(--color-electric-foreground))]"
                : isDark
                  ? "text-white/60 group-hover:text-white/90"
                  : "text-[hsl(var(--color-muted))] group-hover:text-[hsl(var(--color-foreground))]"
            }`}
          >
            {active && (
              <motion.span
                layoutId="locale-indicator"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="absolute inset-0 -z-10 rounded-full bg-[hsl(var(--color-electric))] shadow-[0_0_16px_rgba(163,230,53,0.4)]"
              />
            )}
            {loc.toUpperCase()}
          </span>
        );
      })}
    </button>
  );
}
