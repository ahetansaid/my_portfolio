import type { Metadata } from "next";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "À propos",
  description: "Parcours, vision et présentation professionnelle d'un intégrateur systèmes.",
};

export const revalidate = 60;

async function getData() {
  try {
    const [timeline, values] = await Promise.all([
      prisma.timelineItem.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "asc" }] }),
      prisma.aboutValue.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "asc" }] }),
    ]);
    return { timeline, values };
  } catch {
    return { timeline: [], values: [] };
  }
}

export default async function AboutPage() {
  const { timeline, values } = await getData();

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
        {timeline.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-xl font-semibold text-[hsl(var(--color-foreground))] mb-8">
              Parcours
            </h2>
            <div className="relative border-l-2 border-[hsl(var(--color-surface-muted))] pl-8 space-y-8">
              {timeline.map((item) => (
                <div key={item.id} className="relative">
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
        )}

        {/* Values */}
        {values.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-xl font-semibold text-[hsl(var(--color-foreground))] mb-6">
              Vision & valeurs
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {values.map((v) => (
                <div key={v.id}
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
        )}

        {timeline.length === 0 && values.length === 0 && (
          <p className="mt-12 text-[hsl(var(--color-muted))]">
            Contenu à définir dans le{" "}
            <a href="/admin/about" className="text-[hsl(var(--color-accent))] hover:underline">backoffice</a>.
          </p>
        )}
      </div>
    </div>
  );
}
