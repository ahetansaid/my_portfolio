import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/db";
import { ServicesClient } from "@/components/services/ServicesClient";
import { ProcessSection } from "@/components/services/ProcessSection";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Audit SI, intégration ERP/GED, développement SaaS sur mesure, consulting et architecture — mes prestations pour vos projets tech.",
};

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: "asc" },
  });
  const t = await getTranslations("servicesPage");

  return (
    <div className="relative">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-[hsl(var(--color-surface-muted))]">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-[15%] top-0 h-[420px] w-[560px] rounded-full bg-[hsl(var(--color-accent))] opacity-[0.12] blur-[140px]" />
          <div className="absolute right-[10%] top-32 h-[360px] w-[360px] rounded-full bg-[hsl(var(--color-electric))] opacity-[0.10] blur-[120px]" />
        </div>

        <div className="container-tight pt-20 pb-12 sm:pt-28 sm:pb-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--color-accent-warm))]/30 bg-[hsl(var(--color-accent-warm))]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[hsl(var(--color-accent-warm))]">
            <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--color-accent-warm))]" />
            {services.length} {t("badge")}
          </div>
          <h1 className="font-display text-5xl font-extrabold tracking-tight text-[hsl(var(--color-foreground))] sm:text-6xl lg:text-7xl">
            {t("title1")}{" "}
            <span className="text-gradient">{t("titleHighlight")}</span>
            <br className="hidden sm:block" />
            {" " + t("title2")}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[hsl(var(--color-muted))]">
            {t("description1")}{" "}
            <strong className="text-[hsl(var(--color-foreground))]">{t("descriptionStrong")}</strong>{" "}
            {t("description2")}
          </p>
        </div>
      </section>

      {/* SERVICES LISTE */}
      <section className="section-padding">
        <div className="container-tight">
          {services.length > 0 ? (
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
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-[hsl(var(--color-surface-muted))] p-16 text-center">
              <div className="mb-3 text-5xl">🛠</div>
              <p className="text-[hsl(var(--color-muted))]">{t("empty")}</p>
            </div>
          )}
        </div>
      </section>

      {/* PROCESS */}
      <ProcessSection />

      {/* CTA FINAL */}
      <section className="section-padding">
        <div className="container-tight">
          <div className="relative overflow-hidden rounded-3xl border border-[hsl(var(--color-surface-muted))] bg-gradient-to-br from-[hsl(var(--color-accent))]/10 via-[hsl(var(--color-surface))] to-[hsl(var(--color-accent-warm))]/10 p-10 text-center sm:p-16">
            <h2 className="font-display text-3xl font-extrabold text-[hsl(var(--color-foreground))] sm:text-5xl">
              {t("finalCtaTitle")}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[hsl(var(--color-muted))] sm:text-lg">
              {t("finalCtaSubtitle")}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/booking" className="btn-cta">
                {t("finalCtaPrimary")}
              </Link>
              <Link href="/contact" className="btn-outline">
                {t("finalCtaSecondary")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
