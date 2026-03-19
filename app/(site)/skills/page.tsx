import type { Metadata } from "next";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Compétences",
  description: "Développement, systèmes et méthodologies.",
};

export const revalidate = 60;

async function getData() {
  try {
    const categories = await prisma.skillCategory.findMany({
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
      include: { items: { orderBy: [{ sortOrder: "asc" }, { id: "asc" }] } },
    });
    return categories;
  } catch {
    return [];
  }
}

export default async function SkillsPage() {
  const categories = await getData();

  return (
    <div className="section-padding">
      <div className="container-tight">
        <div className="max-w-2xl">
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl text-[hsl(var(--color-foreground))]">
            Compétences
          </h1>
          <p className="mt-4 text-[hsl(var(--color-muted))] leading-relaxed">
            Un profil transverse — du développement à l'intégration système — pour couvrir
            l'ensemble du cycle de vie d'une solution technique.
          </p>
        </div>

        {categories.length > 0 ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <div key={cat.id}
                className="rounded-xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-1">
                  {cat.icon && (
                    <span className="text-2xl" role="img" aria-label={cat.name}>{cat.icon}</span>
                  )}
                  <h2 className="font-display text-lg font-semibold text-[hsl(var(--color-foreground))]">
                    {cat.name}
                  </h2>
                </div>
                {cat.description && (
                  <p className="text-xs text-[hsl(var(--color-muted))] mb-4">{cat.description}</p>
                )}
                <ul className="flex flex-wrap gap-2 mt-3">
                  {cat.items.map((item) => (
                    <li key={item.id}
                      className="rounded-md bg-[hsl(var(--color-surface-muted))] px-3 py-1 text-sm text-[hsl(var(--color-muted))]">
                      {item.name}
                    </li>
                  ))}
                  {cat.items.length === 0 && (
                    <li className="text-xs text-[hsl(var(--color-muted))] italic">Aucun élément.</li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-12 text-[hsl(var(--color-muted))]">
            Compétences à définir dans le{" "}
            <a href="/admin/skills" className="text-[hsl(var(--color-accent))] hover:underline">backoffice</a>.
          </p>
        )}
      </div>
    </div>
  );
}
