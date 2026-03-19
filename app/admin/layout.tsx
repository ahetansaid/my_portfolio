import Link from "next/link";
import { LogoutButton } from "@/components/admin/LogoutButton";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[hsl(var(--color-surface-muted))]">
      <header className="sticky top-0 z-50 border-b border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))]">
        <div className="container-tight flex h-14 items-center justify-between">
          <Link
            href="/admin"
            className="font-display text-lg font-semibold text-[hsl(var(--color-foreground))]"
          >
            Backoffice
          </Link>
          <nav className="flex items-center gap-5">
            <Link href="/admin"
              className="text-sm font-medium text-[hsl(var(--color-muted))] hover:text-[hsl(var(--color-accent))]">
              Dashboard
            </Link>
            <Link href="/admin/projects"
              className="text-sm font-medium text-[hsl(var(--color-muted))] hover:text-[hsl(var(--color-accent))]">
              Projets
            </Link>
            <Link href="/admin/technologies"
              className="text-sm font-medium text-[hsl(var(--color-muted))] hover:text-[hsl(var(--color-accent))]">
              Technologies
            </Link>
            <Link href="/admin/about"
              className="text-sm font-medium text-[hsl(var(--color-muted))] hover:text-[hsl(var(--color-accent))]">
              À propos
            </Link>
            <Link href="/admin/skills"
              className="text-sm font-medium text-[hsl(var(--color-muted))] hover:text-[hsl(var(--color-accent))]">
              Compétences
            </Link>
            <Link href="/admin/messages"
              className="text-sm font-medium text-[hsl(var(--color-muted))] hover:text-[hsl(var(--color-accent))]">
              Messages
            </Link>
            <Link href="/"
              className="text-sm font-medium text-[hsl(var(--color-muted))] hover:text-[hsl(var(--color-accent))]">
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
