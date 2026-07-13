import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { RadarActions } from "@/components/admin/radar/RadarActions";

export const metadata: Metadata = { title: "Career Radar" };
export const dynamic = "force-dynamic";

type Opp = Awaited<ReturnType<typeof getOpps>>[number];

async function getOpps() {
  return prisma.opportunity.findMany({
    where: { status: { not: "dismissed" } },
    orderBy: [{ fitScore: { sort: "desc", nulls: "last" } }, { createdAt: "desc" }],
    include: { source: { select: { name: true } } },
  });
}

function fmtDate(d: Date | null) {
  if (!d) return null;
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(d);
}

const CATEGORY_LABELS: Record<string, string> = {
  scholarship: "Bourse", fellowship: "Fellowship", job: "Emploi", internship: "Stage",
  conference: "Conférence", training: "Formation", volunteering: "Bénévolat", grant: "Financement", call: "Appel",
};

function ScoreBadge({ score }: { score: number | null }) {
  if (score === null) {
    return <span className="rounded-full bg-[hsl(var(--color-surface-muted))] px-2.5 py-1 text-xs font-bold text-[hsl(var(--color-muted))]">non scoré</span>;
  }
  const tone = score >= 70 ? "bg-green-500/15 text-green-600" : score >= 45 ? "bg-amber-500/15 text-amber-600" : "bg-red-500/15 text-red-500";
  return <span className={`rounded-full px-2.5 py-1 text-xs font-black tabular-nums ${tone}`}>{score}</span>;
}

function OppCard({ o }: { o: Opp }) {
  const reasons = (o.fitReasons as { forces?: string[]; attention?: string[] } | null) ?? null;
  const tags = Array.isArray(o.tags) ? (o.tags as string[]) : [];
  const deadline = fmtDate(o.deadline);
  return (
    <article className="rounded-2xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <ScoreBadge score={o.fitScore} />
          <span className="rounded-full border border-[hsl(var(--color-surface-muted))] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[hsl(var(--color-muted))]">
            {CATEGORY_LABELS[o.category] ?? o.category}
          </span>
          {o.isRemote && <span className="rounded-full bg-[hsl(var(--color-accent))]/10 px-2.5 py-1 text-[11px] font-semibold text-[hsl(var(--color-accent))]">Remote</span>}
        </div>
        {deadline && (
          <span className="shrink-0 text-xs font-semibold text-[hsl(var(--color-accent-warm))]">⏳ {deadline}</span>
        )}
      </div>

      <h3 className="mt-3 font-display text-base font-bold leading-snug text-[hsl(var(--color-foreground))]">
        <a href={o.url} target="_blank" rel="noopener" className="hover:underline">{o.title}</a>
      </h3>
      <p className="mt-1 text-xs text-[hsl(var(--color-muted))]">
        {[o.org, o.location, o.source.name].filter(Boolean).join(" · ")}
      </p>

      {o.summary && <p className="mt-2 text-sm leading-relaxed text-[hsl(var(--color-foreground))]/90">{o.summary}</p>}
      {o.whyNow && <p className="mt-2 text-sm text-[hsl(var(--color-muted))]"><span className="font-semibold text-[hsl(var(--color-foreground))]">Pourquoi maintenant :</span> {o.whyNow}</p>}
      {o.recommendedAction && <p className="mt-1 text-sm text-[hsl(var(--color-muted))]"><span className="font-semibold text-[hsl(var(--color-foreground))]">Action :</span> {o.recommendedAction}</p>}

      {reasons && (reasons.forces?.length || reasons.attention?.length) ? (
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {reasons.forces?.length ? (
            <ul className="text-xs text-green-600/90">{reasons.forces.map((f, i) => <li key={i}>+ {f}</li>)}</ul>
          ) : null}
          {reasons.attention?.length ? (
            <ul className="text-xs text-amber-600/90">{reasons.attention.map((f, i) => <li key={i}>! {f}</li>)}</ul>
          ) : null}
        </div>
      ) : null}

      {(tags.length > 0 || o.languageReq || o.fundingInfo) && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {o.fundingInfo && <span className="rounded bg-[hsl(var(--color-surface-muted))] px-2 py-0.5 text-[11px] text-[hsl(var(--color-muted))]">💰 {o.fundingInfo}</span>}
          {o.languageReq && <span className="rounded bg-[hsl(var(--color-surface-muted))] px-2 py-0.5 text-[11px] text-[hsl(var(--color-muted))]">🗣 {o.languageReq}</span>}
          {tags.map((t) => <span key={t} className="rounded bg-[hsl(var(--color-surface-muted))] px-2 py-0.5 text-[11px] text-[hsl(var(--color-muted))]">#{t}</span>)}
        </div>
      )}
    </article>
  );
}

function Section({ title, subtitle, opps }: { title: string; subtitle: string; opps: Opp[] }) {
  return (
    <section>
      <div className="mb-4 flex items-baseline gap-3">
        <h2 className="font-display text-lg font-bold text-[hsl(var(--color-foreground))]">{title}</h2>
        <span className="text-sm text-[hsl(var(--color-muted))]">{opps.length}</span>
      </div>
      <p className="mb-4 text-sm text-[hsl(var(--color-muted))]">{subtitle}</p>
      {opps.length ? (
        <div className="grid gap-4">{opps.map((o) => <OppCard key={o.id} o={o} />)}</div>
      ) : (
        <p className="rounded-xl border border-dashed border-[hsl(var(--color-surface-muted))] p-6 text-sm text-[hsl(var(--color-muted))]">Aucune opportunité dans ce flux pour l'instant.</p>
      )}
    </section>
  );
}

export default async function RadarPage() {
  const opps = await getOpps();
  const smartPorts = opps.filter((o) => o.stream === "smart_ports");
  const general = opps.filter((o) => o.stream === "general");
  const unscored = opps.filter((o) => o.fitScore === null).length;

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-2">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-[hsl(var(--color-foreground))]">📡 Career Radar</h1>
          <p className="mt-1 text-sm text-[hsl(var(--color-muted))]">
            {opps.length} opportunités réelles · {smartPorts.length} Smart Ports · {general.length} général
          </p>
        </div>
        <RadarActions unscoredCount={unscored} />
      </header>

      {unscored > 0 && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-700 dark:text-amber-300">
          <strong>{unscored} opportunité(s) réelle(s) en attente de scoring IA.</strong> La clé LLM du serveur n'a pas de quota
          disponible. Fournis une clé valide (OpenAI avec crédit, ou une clé Anthropic à câbler) puis clique
          « Ré-scorer » pour calculer les scores, classer par pertinence et activer les alertes email.
        </div>
      )}

      <Section
        title="🚢 Flux A — Smart Ports"
        subtitle="Maritime, portuaire, logistique, IA/data appliquée. Le flux prioritaire qui déclenchera les alertes email."
        opps={smartPorts}
      />
      <Section
        title="🌍 Flux B — Général"
        subtitle="Opportunités tech / bourses / formations compatibles avec le profil. Consultation, sans alerte unitaire."
        opps={general}
      />
    </div>
  );
}
