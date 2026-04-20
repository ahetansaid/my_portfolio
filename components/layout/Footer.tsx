"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface-muted))]/50">
      <div className="container-tight py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[hsl(var(--color-accent))] to-[hsl(var(--color-accent-warm))] text-sm font-bold text-white">
                M
              </span>
              <span className="font-display font-semibold text-[hsl(var(--color-foreground))]">
                Mohamed Saïd AHETAN
              </span>
            </div>
            <p className="mt-3 text-sm text-[hsl(var(--color-muted))]">
              {t("tagline")}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-[hsl(var(--color-foreground))]">
              {t("navTitle")}
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/projects", key: "projects" as const },
                { href: "/services", key: "services" as const },
                { href: "/about", key: "about" as const },
                { href: "/playground", key: "playground" as const },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[hsl(var(--color-muted))] hover:text-[hsl(var(--color-accent))] transition">
                    {tNav(l.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Audience */}
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-[hsl(var(--color-foreground))]">
              {t("audienceTitle")}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/recruiter" className="text-[hsl(var(--color-muted))] hover:text-[hsl(var(--color-accent))] transition">
                  {t("audienceRecruiters")}
                </Link>
              </li>
              <li>
                <Link href="/booking" className="text-[hsl(var(--color-muted))] hover:text-[hsl(var(--color-accent))] transition">
                  {t("audienceBooking")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[hsl(var(--color-muted))] hover:text-[hsl(var(--color-accent))] transition">
                  {t("audienceContact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-[hsl(var(--color-foreground))]">
              {t("socialTitle")}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://github.com/ahetansaid" target="_blank" rel="noopener" className="text-[hsl(var(--color-muted))] hover:text-[hsl(var(--color-accent))] transition">
                  GitHub →
                </a>
              </li>
              <li>
                <a href="https://linkedin.com/in/mohamed-saïd-ahetan" target="_blank" rel="noopener" className="text-[hsl(var(--color-muted))] hover:text-[hsl(var(--color-accent))] transition">
                  LinkedIn →
                </a>
              </li>
              <li>
                <a href="mailto:saidahetan@gmail.com" className="text-[hsl(var(--color-muted))] hover:text-[hsl(var(--color-accent))] transition">
                  Email →
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-[hsl(var(--color-surface-muted))] pt-6 text-center text-xs text-[hsl(var(--color-muted))]">
          © {year} Mohamed Saïd AHETAN. {t("rights")}
        </div>
      </div>
    </footer>
  );
}
