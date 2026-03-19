import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À propos",
  description: "Parcours, vision et présentation professionnelle d'un intégrateur systèmes.",
};

const timeline = [
  {
    year: "2020",
    title: "Début en développement",
    description: "Premiers projets web, découverte des stacks modernes (React, Node.js).",
  },
  {
    year: "2021",
    title: "Intégration ERP",
    description: "Participation à des projets d'intégration de progiciels métier, adaptation aux processus clients.",
  },
  {
    year: "2022",
    title: "Systèmes embarqués & DGMS",
    description: "Intégration de solutions de gestion de flotte et de systèmes de mobilité.",
  },
  {
    year: "2023",
    title: "Architecte de solutions",
    description: "Conception end-to-end : analyse des besoins, choix techniques, livraison.",
  },
  {
    year: "2024–2026",
    title: "Portfolio & évolutions",
    description: "Consolidation de l'expertise, développement de solutions sur mesure.",
  },
];

const values = [
  {
    title: "Clarté technique",
    description: "Traduire les besoins métier en solutions concrètes, sans jargon inutile.",
  },
  {
    title: "Fiabilité",
    description: "Des intégrations robustes, testées et documentées pour durer dans le temps.",
  },
  {
    title: "Amélioration continue",
    description: "Veille technologique, retours d'expérience et itérations régulières.",
  },
];

export default function AboutPage() {
  return (
    <div className="section-padding">
      <div className="container-tight">
        {/* Header */}
        <div className="max-w-2xl">
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl text-[hsl(var(--color-foreground))]">
            À propos
          </h1>
          <p className="mt-4 text-lg text-[hsl(var(--color-muted))] leading-relaxed">
            Intégrateur systèmes passionné par la construction de ponts entre les besoins métier
            et les solutions technologiques — ERP, gestion de flotte, développement sur mesure.
          </p>
        </div>

        {/* Timeline */}
        <section className="mt-16">
          <h2 className="font-display text-xl font-semibold text-[hsl(var(--color-foreground))] mb-8">
            Parcours
          </h2>
          <div className="relative border-l-2 border-[hsl(var(--color-surface-muted))] pl-8 space-y-8">
            {timeline.map((item) => (
              <div key={item.year} className="relative">
                <div className="absolute -left-[2.6rem] flex h-6 w-6 items-center justify-center rounded-full bg-[hsl(var(--color-accent))]">
                  <div className="h-2 w-2 rounded-full bg-white" />
                </div>
                <p className="text-xs font-semibold text-[hsl(var(--color-accent))] uppercase tracking-widest">
                  {item.year}
                </p>
                <h3 className="mt-1 font-display text-base font-semibold text-[hsl(var(--color-foreground))]">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-[hsl(var(--color-muted))] leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Values */}
        <section className="mt-16">
          <h2 className="font-display text-xl font-semibold text-[hsl(var(--color-foreground))] mb-6">
            Vision & valeurs
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {values.map((v) => (
              <div key={v.title}
                className="rounded-xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-6 shadow-sm">
                <h3 className="font-display font-semibold text-[hsl(var(--color-foreground))]">
                  {v.title}
                </h3>
                <p className="mt-2 text-sm text-[hsl(var(--color-muted))] leading-relaxed">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
