import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { PlaygroundClient } from "@/components/playground/PlaygroundClient";

export const metadata: Metadata = {
  title: "Playground",
  description:
    "Expérimentations, mini-démos et curiosités techniques. Là où je teste les idées avant qu'elles deviennent des projets sérieux.",
};

export const dynamic = "force-dynamic";

export default async function PlaygroundPage() {
  const items = await prisma.playgroundItem.findMany({
    where: { isPublished: true },
    orderBy: [{ sortOrder: "asc" }, { id: "desc" }],
  });

  return (
    <div className="section-padding">
      <div className="container-tight">
        <div className="mb-12 max-w-3xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[hsl(var(--color-accent))]/10 px-3 py-1 text-xs font-semibold text-[hsl(var(--color-accent))]">
            ⚗️ Laboratoire
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tight text-[hsl(var(--color-foreground))] sm:text-5xl">
            Playground
          </h1>
          <p className="mt-4 text-lg text-[hsl(var(--color-muted))]">
            Expérimentations, prototypes de week-end, idées à moitié cuites. Là où je teste les
            concepts avant qu&apos;ils deviennent des projets sérieux. Aucune garantie de stabilité.
          </p>
        </div>

        <PlaygroundClient
          items={items.map((it) => ({
            id: it.id,
            slug: it.slug,
            title: it.title,
            emoji: it.emoji,
            description: it.description,
            imageUrl: it.imageUrl,
            demoUrl: it.demoUrl,
            repoUrl: it.repoUrl,
            tags: (it.tags as string[] | null) ?? [],
          }))}
        />
      </div>
    </div>
  );
}
