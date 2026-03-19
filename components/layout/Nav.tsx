"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/about", label: "À propos" },
  { href: "/projects", label: "Projets" },
  { href: "/skills", label: "Compétences" },
  { href: "/contact", label: "Contact" },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))]/95 backdrop-blur supports-[backdrop-filter]:bg-[hsl(var(--color-surface))]/80">
      <nav className="container-tight flex h-16 items-center justify-between">
        <Link
          href="/"
          className="font-display text-lg font-semibold tracking-tight text-[hsl(var(--color-foreground))]"
        >
          Portfolio
        </Link>

        {/* Desktop */}
        <ul className="hidden items-center gap-8 md:flex">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`text-sm font-medium transition-colors hover:text-[hsl(var(--color-accent))] ${
                  pathname === href
                    ? "text-[hsl(var(--color-accent))]"
                    : "text-[hsl(var(--color-muted))]"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
          <li>
            <ThemeToggle />
          </li>
        </ul>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-label="Menu"
          className="flex flex-col gap-1.5 p-2 md:hidden"
          onClick={() => setOpen((o) => !o)}
        >
          <span
            className={`h-0.5 w-5 rounded bg-current transition-transform ${open ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`h-0.5 w-5 rounded bg-current transition-opacity ${open ? "opacity-0" : ""}`}
          />
          <span
            className={`h-0.5 w-5 rounded bg-current transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </nav>

      {/* Mobile dropdown */}
      {open && (
        <div className="border-t border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] md:hidden">
          <ul className="container-tight flex flex-col gap-1 py-4">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-lg px-3 py-2 text-sm font-medium ${
                    pathname === href
                      ? "bg-[hsl(var(--color-surface-muted))] text-[hsl(var(--color-accent))]"
                      : "text-[hsl(var(--color-muted))] hover:bg-[hsl(var(--color-surface-muted))]"
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
            <li className="px-3 py-2">
              <ThemeToggle />
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
