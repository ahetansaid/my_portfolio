import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { ServicesClient } from "@/components/services/ServicesClient";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Audit SI, intégration ERP/GED, développement SaaS sur mesure, consulting et architecture — mes services pour vos projets tech.",
};

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="section-padding">
      <div className="container-tight">
        <div className="mb-12 max-w-3xl">
          <h1 className="font-display text-4xl font-bold tracking-tight text-[hsl(var(--color-foreground))] sm:text-5xl">
            Services
          </h1>
          <p className="mt-4 text-lg text-[hsl(var(--color-muted))]">
            Du diagnostic à la livraison, en passant par l&apos;architecture et le développement —
            des prestations pensées pour livrer des résultats mesurables.
          </p>
        </div>

        <ServicesClient
          services={services.map((s) => ({
            id: s.id,
            slug: s.slug,
            title: s.title,
            icon: s.icon,
            description: s.description,
            priceRange: s.priceRange,
            duration: s.duration,
            deliverables: (s.deliverables as string[] | null) ?? [],
          }))}
        />

        <div className="mt-16 rounded-2xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface-muted))]/40 p-8 text-center sm:p-12">
          <h2 className="font-display text-2xl font-bold text-[hsl(var(--color-foreground))]">
            Votre projet ne rentre dans aucune de ces cases ?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[hsl(var(--color-muted))]">
            Pas de problème. Réservons 30 minutes pour en discuter — je vous dirai honnêtement si je
            peux vous aider.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/booking" className="btn-cta">
              Prendre un RDV
            </Link>
            <Link href="/contact" className="btn-outline">
              Envoyer un message
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
