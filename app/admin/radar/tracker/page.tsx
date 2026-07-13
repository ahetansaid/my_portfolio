import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";

export const metadata: Metadata = { title: "Candidatures · Career Radar" };
export const dynamic = "force-dynamic";

const STAGE_LABELS: Record<string, string> = {
  spotted: "Repéré", considering: "À l'étude", preparing: "En préparation",
  submitted: "Soumis", interview: "Entretien", accepted: "Accepté",
  rejected: "Refusé", withdrawn: "Abandonné",
};
const STAGES = Object.keys(STAGE_LABELS);

export default async function TrackerPage() {
  const tracks = await prisma.applicationTrack.findMany({
    include: { opportunity: { select: { title: true, url: true, deadline: true } } },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl space-y-6 py-2">
      <header>
        <h1 className="font-display text-2xl font-extrabold text-[hsl(var(--color-foreground))]">🎯 Candidatures</h1>
        <p className="mt-1 text-sm text-[hsl(var(--color-muted))]">
          Suivi des opportunités sauvegardées, du repérage au résultat. Alimente les indicateurs de la feuille de route.
        </p>
      </header>

      {tracks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[hsl(var(--color-surface-muted))] p-8 text-center text-sm text-[hsl(var(--color-muted))]">
          Aucune candidature suivie pour l'instant. Depuis le{" "}
          <Link href="/admin/radar" className="font-semibold text-[hsl(var(--color-accent))] hover:underline">radar</Link>,
          ajoute une opportunité au tracker pour la suivre ici.
        </div>
      ) : (
        <div className="grid gap-3">
          {tracks.map((t) => (
            <article key={t.id} className="rounded-xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-4">
              <div className="flex items-center justify-between gap-3">
                <a href={t.opportunity.url} target="_blank" rel="noopener" className="font-semibold text-[hsl(var(--color-foreground))] hover:underline">
                  {t.opportunity.title}
                </a>
                <span className="rounded-full bg-[hsl(var(--color-accent))]/10 px-2.5 py-1 text-xs font-semibold text-[hsl(var(--color-accent))]">
                  {STAGE_LABELS[t.stage] ?? t.stage}
                </span>
              </div>
              {t.notes && <p className="mt-2 text-sm text-[hsl(var(--color-muted))]">{t.notes}</p>}
            </article>
          ))}
        </div>
      )}

      <p className="text-xs text-[hsl(var(--color-muted))]">
        Étapes : {STAGES.map((s) => STAGE_LABELS[s]).join(" → ")}
      </p>
    </div>
  );
}
