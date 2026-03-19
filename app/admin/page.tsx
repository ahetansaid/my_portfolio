import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin",
  description: "Backoffice du portfolio.",
};

const sections = [
  { href: "/admin/projects", title: "Projets", description: "Ajouter, modifier ou supprimer des projets." },
  { href: "/admin/technologies", title: "Technologies", description: "Gérer les technologies pour les filtres." },
  { href: "/admin/about", title: "À propos", description: "Éditer la timeline et les valeurs/vision." },
  { href: "/admin/skills", title: "Compétences", description: "Gérer les catégories et les éléments de compétences." },
  { href: "/admin/messages", title: "Messages", description: "Consulter et supprimer les messages de contact." },
];

export default function AdminPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-[hsl(var(--color-foreground))]">
        Tableau de bord
      </h1>
      <p className="mt-2 text-[hsl(var(--color-muted))]">
        Gestion complète du contenu du portfolio.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((s) => (
          <Link key={s.href} href={s.href}
            className="rounded-xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-6 shadow-sm transition hover:border-[hsl(var(--color-accent))]/50 hover:shadow-md">
            <h2 className="font-display font-semibold text-[hsl(var(--color-foreground))]">
              {s.title}
            </h2>
            <p className="mt-1 text-sm text-[hsl(var(--color-muted))]">{s.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
