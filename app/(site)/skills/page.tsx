import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compétences",
  description: "Développement, systèmes et méthodologies.",
};

const categories = [
  {
    name: "Développement",
    icon: "⌨️",
    description: "Technologies web et applicatives",
    items: [
      "Next.js / React",
      "TypeScript",
      "Node.js",
      "Tailwind CSS",
      "REST API",
      "MySQL / Prisma",
      "Git",
    ],
  },
  {
    name: "Systèmes",
    icon: "🔧",
    description: "Intégration et infrastructure",
    items: [
      "ERP (intégration)",
      "DGMS / Gestion de flotte",
      "Linux",
      "Docker",
      "Réseaux TCP/IP",
      "XAMPP / Apache",
    ],
  },
  {
    name: "Méthodologies",
    icon: "📐",
    description: "Organisation et gestion de projet",
    items: [
      "Agile / Scrum",
      "Analyse des besoins",
      "Documentation technique",
      "Tests & recette",
      "CI/CD",
    ],
  },
];

export default function SkillsPage() {
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

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <div key={cat.name}
              className="rounded-xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-2xl" role="img" aria-label={cat.name}>{cat.icon}</span>
                <h2 className="font-display text-lg font-semibold text-[hsl(var(--color-foreground))]">
                  {cat.name}
                </h2>
              </div>
              <p className="text-xs text-[hsl(var(--color-muted))] mb-4">{cat.description}</p>
              <ul className="flex flex-wrap gap-2">
                {cat.items.map((item) => (
                  <li key={item}
                    className="rounded-md bg-[hsl(var(--color-surface-muted))] px-3 py-1 text-sm text-[hsl(var(--color-muted))]">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
