import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
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
  const t = await getTranslations("skillsPage");

  return (
    <div className="section-padding">
      <div className="container-tight">
        <div className="max-w-2xl">
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl text-[hsl(var(--color-foreground))]">
            {t("title")}
          </h1>
          <p className="mt-4 text-[hsl(var(--color-muted))] leading-relaxed">
            {t("description")}
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
                    <li className="text-xs text-[hsl(var(--color-muted))] italic">{t("emptyItems")}</li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-12 text-[hsl(var(--color-muted))]">
            {t("emptyCategories")}
          </p>
        )}
      </div>
    </div>
  );
}
