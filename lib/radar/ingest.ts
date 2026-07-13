import { prisma } from "@/lib/db";
import { SOURCES } from "./sources";
import { fetchRss } from "./fetch";
import { scoreItem, type RadarProfileLite } from "./score";
import { notifyPending } from "./notify";

export type IngestStats = {
  sources: number;
  fetched: number;
  created: number;
  createdUnscored: number;
  skipped: number;
  errors: number;
  notified: number;
  createdItems: { id: number; title: string; stream: string; fitScore: number | null }[];
};

/**
 * Récupère les opportunités RÉELLES des sources actives, les score contre le profil,
 * et persiste les nouvelles. Idempotent : les doublons (sourceId+externalId) sont ignorés.
 */
export async function runIngest(opts: { limitPerSource?: number } = {}): Promise<IngestStats> {
  const limitPerSource = opts.limitPerSource ?? 8;

  const profileRow = await prisma.radarProfile.findUnique({ where: { id: 1 } });
  if (!profileRow) {
    throw new Error("RadarProfile introuvable — lancer scripts/seed-radar-profile.ts d'abord.");
  }
  const profile: RadarProfileLite = {
    profileText: profileRow.profileText,
    englishLevel: profileRow.englishLevel,
    weights: (profileRow.weights as Record<string, number>) ?? {},
  };

  const stats: IngestStats = {
    sources: 0, fetched: 0, created: 0, createdUnscored: 0, skipped: 0, errors: 0, notified: 0, createdItems: [],
  };

  for (const src of SOURCES) {
    stats.sources++;

    // Enregistre/actualise la source (configuration réelle, pas de donnée fictive)
    const existingSrc = await prisma.opportunitySource.findFirst({ where: { name: src.name } });
    const source = existingSrc
      ? existingSrc
      : await prisma.opportunitySource.create({
          data: { name: src.name, type: src.type, url: src.url, config: { url: src.url } },
        });

    try {
      const items = src.type === "rss" ? await fetchRss(src.url, limitPerSource) : [];
      stats.fetched += items.length;

      for (const item of items) {
        const dup = await prisma.opportunity.findUnique({
          where: { sourceId_externalId: { sourceId: source.id, externalId: item.externalId } },
        });
        if (dup) { stats.skipped++; continue; }

        // Scoring IA — non bloquant : si l'IA échoue (quota, clé…), on enregistre
        // quand même la VRAIE opportunité (non scorée), enrichie plus tard.
        let s: Awaited<ReturnType<typeof scoreItem>> | null = null;
        try {
          s = await scoreItem(profile, item);
        } catch (e) {
          stats.errors++;
          console.error(`  ⚠ scoring indisponible (${item.title.slice(0, 60)}):`, e instanceof Error ? e.message : e);
        }

        const created = await prisma.opportunity.create({
          data: {
            sourceId: source.id,
            externalId: item.externalId,
            url: item.url,
            title: item.title,
            org: s?.org ?? item.org,
            category: s?.category ?? "call",
            stream: s?.stream ?? "general",
            rawText: item.rawText,
            summary: s?.summary ?? null,
            location: s?.location ?? null,
            country: s?.country ?? null,
            isRemote: s?.isRemote ?? false,
            languageReq: s?.languageReq ?? null,
            fundingInfo: s?.fundingInfo ?? null,
            eligibility: s?.eligibility ?? null,
            deadline: s?.deadline ?? null,
            postedAt: item.postedAt,
            tags: s?.tags ?? [],
            fitScore: s?.fitScore ?? null,
            fitReasons: s?.fitReasons ?? undefined,
            whyNow: s?.whyNow ?? null,
            recommendedAction: s?.recommendedAction ?? null,
            scoredAt: s ? new Date() : null,
          },
          select: { id: true, title: true, stream: true, fitScore: true },
        });
        if (s) stats.created++;
        else stats.createdUnscored++;
        stats.createdItems.push(created);
      }

      await prisma.opportunitySource.update({
        where: { id: source.id },
        data: { lastFetchedAt: new Date(), lastStatus: `ok · ${items.length} items` },
      });
    } catch (e) {
      stats.errors++;
      const msg = e instanceof Error ? e.message : String(e);
      await prisma.opportunitySource.update({
        where: { id: source.id },
        data: { lastFetchedAt: new Date(), lastStatus: `error · ${msg.slice(0, 200)}` },
      });
      console.error(`  ✗ source ${src.name}:`, msg);
    }
  }

  const notif = await notifyPending();
  stats.notified = notif.sent;
  return stats;
}
