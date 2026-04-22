"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Badges = {
  messagesUnread?: number;
  bookingsPending?: number;
};

type NavItem = {
  href: string;
  label: string;
  icon: string;
  badgeKey?: keyof Badges;
  group?: "content" | "inbox" | "settings";
};

const NAV: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: "⌂", group: "content" },
  { href: "/admin/projects", label: "Projets", icon: "◆", group: "content" },
  { href: "/admin/playground", label: "Playground", icon: "⚗", group: "content" },
  { href: "/admin/technologies", label: "Technologies", icon: "#", group: "content" },
  { href: "/admin/services", label: "Services", icon: "✦", group: "content" },
  { href: "/admin/testimonials", label: "Témoignages", icon: "❝", group: "content" },
  { href: "/admin/about", label: "À propos", icon: "☰", group: "content" },
  { href: "/admin/skills", label: "Compétences", icon: "★", group: "content" },

  { href: "/admin/messages", label: "Messages", icon: "✉", badgeKey: "messagesUnread", group: "inbox" },
  { href: "/admin/bookings", label: "Rendez-vous", icon: "📅", badgeKey: "bookingsPending", group: "inbox" },

  { href: "/admin/documents", label: "Documents", icon: "📄", group: "settings" },
  { href: "/admin/settings", label: "Paramètres", icon: "⚙", group: "settings" },
];

const GROUP_LABELS: Record<NonNullable<NavItem["group"]>, string> = {
  content: "Contenu",
  inbox: "Boîte de réception",
  settings: "Système",
};

export function Sidebar({
  open,
  onClose,
  onLogout,
  adminEmail,
}: {
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
  adminEmail: string | null;
}) {
  const pathname = usePathname();
  const [badges, setBadges] = useState<Badges>({});

  useEffect(() => {
    let cancelled = false;

    const fetchBadges = async () => {
      try {
        const res = await fetch("/api/admin/overview");
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        setBadges({
          messagesUnread: data?.counts?.messages?.unread ?? 0,
          bookingsPending: data?.counts?.bookings?.pending ?? 0,
        });
      } catch {
        // ignore
      }
    };

    fetchBadges();
    const interval = setInterval(fetchBadges, 30_000);
    const onFocus = () => fetchBadges();
    window.addEventListener("focus", onFocus);

    return () => {
      cancelled = true;
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, [pathname]);

  const groups = (["content", "inbox", "settings"] as const).map((g) => ({
    group: g,
    items: NAV.filter((n) => n.group === g),
  }));

  return (
    <>
      {/* Mobile backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden="true"
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] transition-transform duration-200 lg:sticky lg:top-0 lg:z-0 lg:h-screen lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-[hsl(var(--color-surface-muted))] px-5">
          <Link
            href="/admin"
            className="flex items-center gap-2 font-display text-base font-bold text-[hsl(var(--color-foreground))]"
            onClick={onClose}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[hsl(var(--color-accent))] via-[hsl(var(--color-accent-warm))] to-[hsl(var(--color-electric))] text-xs font-black text-white">
              BO
            </span>
            Backoffice
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer la navigation"
            className="rounded-lg p-1.5 text-[hsl(var(--color-muted))] hover:bg-[hsl(var(--color-surface-muted))] lg:hidden"
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {groups.map(({ group, items }) => (
            <div key={group} className="mb-4 last:mb-0">
              <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--color-muted))]">
                {GROUP_LABELS[group]}
              </p>
              <ul className="space-y-0.5">
                {items.map((item) => {
                  const active =
                    item.href === "/admin"
                      ? pathname === "/admin"
                      : pathname === item.href || pathname.startsWith(item.href + "/");
                  const badgeValue = item.badgeKey ? badges[item.badgeKey] : undefined;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                          active
                            ? "bg-[hsl(var(--color-accent))]/10 text-[hsl(var(--color-accent))]"
                            : "text-[hsl(var(--color-muted))] hover:bg-[hsl(var(--color-surface-muted))] hover:text-[hsl(var(--color-foreground))]"
                        }`}
                      >
                        {active && (
                          <span className="absolute inset-y-1 left-0 w-0.5 rounded-r-full bg-[hsl(var(--color-accent))]" />
                        )}
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center text-sm">
                          {item.icon}
                        </span>
                        <span className="flex-1 truncate">{item.label}</span>
                        {badgeValue && badgeValue > 0 ? (
                          <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[hsl(var(--color-accent-warm))] px-1.5 text-[10px] font-bold text-[hsl(var(--color-accent-warm-foreground))]">
                            {badgeValue > 99 ? "99+" : badgeValue}
                          </span>
                        ) : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="shrink-0 border-t border-[hsl(var(--color-surface-muted))] p-3">
          <div className="mb-2 rounded-lg bg-[hsl(var(--color-surface-muted))]/60 px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[hsl(var(--color-muted))]">
              Connecté
            </p>
            <p className="truncate text-sm font-medium text-[hsl(var(--color-foreground))]">
              {adminEmail ?? "—"}
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/"
              className="flex-1 rounded-lg border border-[hsl(var(--color-surface-muted))] px-3 py-1.5 text-center text-xs font-medium text-[hsl(var(--color-muted))] transition hover:bg-[hsl(var(--color-surface-muted))] hover:text-[hsl(var(--color-foreground))]"
            >
              Voir le site
            </Link>
            <button
              type="button"
              onClick={onLogout}
              className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-50"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
