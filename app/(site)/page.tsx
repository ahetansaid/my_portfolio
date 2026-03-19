import Link from "next/link";

export default function HomePage() {
  return (
    <div className="section-padding">
      <section className="container-tight text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-[hsl(var(--color-foreground))]">
          Intégrateur Systèmes
        </h1>
        <p className="mt-4 text-xl text-[hsl(var(--color-muted))] max-w-2xl mx-auto">
          Conception et intégration de solutions — ERP, DGMS, systèmes métier
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/contact"
            className="rounded-lg bg-[hsl(var(--color-accent))] px-6 py-3 text-sm font-medium text-[hsl(var(--color-accent-foreground))] shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--color-accent))] focus:ring-offset-2"
          >
            Me contacter
          </Link>
          <Link
            href="/projects"
            className="rounded-lg border border-[hsl(var(--color-surface-muted))] bg-transparent px-6 py-3 text-sm font-medium text-[hsl(var(--color-foreground))] transition hover:bg-[hsl(var(--color-surface-muted))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--color-accent))] focus:ring-offset-2"
          >
            Voir les projets
          </Link>
        </div>
      </section>
    </div>
  );
}
