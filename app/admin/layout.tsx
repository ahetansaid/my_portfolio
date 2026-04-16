import Link from "next/link";
import { LogoutButton } from "@/components/admin/LogoutButton";

const navLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/projects", label: "Projets" },
  { href: "/admin/playground", label: "Playground" },
  { href: "/admin/technologies", label: "Technologies" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/testimonials", label: "Témoignages" },
  { href: "/admin/bookings", label: "RDV" },
  { href: "/admin/about", label: "À propos" },
  { href: "/admin/skills", label: "Compétences" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/settings", label: "Paramètres" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[hsl(var(--color-surface-muted))]">
      <header className="sticky top-0 z-50 border-b border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] shadow-sm">
        <div className="container-tight flex h-14 items-center justify-between gap-4">
          <Link
            href="/admin"
            className="font-display text-lg font-semibold text-[hsl(var(--color-foreground))] shrink-0"
          >
            Backoffice
          </Link>
          <nav className="flex items-center gap-4 overflow-x-auto">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-[hsl(var(--color-muted))] hover:text-[hsl(var(--color-accent))] whitespace-nowrap transition"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/"
              className="text-sm font-medium text-[hsl(var(--color-muted))] hover:text-[hsl(var(--color-accent))] whitespace-nowrap transition"
            >
              Voir le site
            </Link>
            <LogoutButton />
          </nav>
        </div>
      </header>
      <div className="container-tight py-8">{children}</div>
    </div>
  );
}
