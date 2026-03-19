import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin",
  description: "Backoffice du portfolio.",
};

export default function AdminPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-[hsl(var(--color-foreground))]">
        Tableau de bord
      </h1>
      <p className="mt-2 text-[hsl(var(--color-muted))]">
        Gestion des projets et des technologies. Connexion et CRUD à implémenter.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/projects"
          className="rounded-xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-6 shadow-sm transition hover:border-[hsl(var(--color-accent))]/50 hover:shadow-md"
        >
          <h2 className="font-display font-semibold text-[hsl(var(--color-foreground))]">
            Projets
          </h2>
          <p className="mt-1 text-sm text-[hsl(var(--color-muted))]">
            Ajouter, modifier ou supprimer des projets.
          </p>
        </Link>
        <Link
          href="/admin/technologies"
          className="rounded-xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-6 shadow-sm transition hover:border-[hsl(var(--color-accent))]/50 hover:shadow-md"
        >
          <h2 className="font-display font-semibold text-[hsl(var(--color-foreground))]">
            Technologies
          </h2>
          <p className="mt-1 text-sm text-[hsl(var(--color-muted))]">
            Gérer les technologies pour les filtres.
          </p>
        </Link>
      </div>
    </div>
  );
}
