import { prisma } from "@/lib/db";
import { scoreItem, type RadarProfileLite } from "./score";

/** Enrichit (score) les opportunités réelles non encore scorées. */
export async function rescoreUnscored(opts: { limit?: number } = {}) {
  const limit = opts.limit ?? 20;

  const profileRow = await prisma.radarProfile.findUnique({ where: { id: 1 } });
  if (!profileRow) throw new Error("RadarProfile introuvable.");
  const profile: RadarProfileLite = {
    profileText: profileRow.profileText,
    englishLevel: profileRow.englishLevel,
    weights: (profileRow.weights as Record<string, number>) ?? {},
  };

  const pending = await prisma.opportunity.findMany({
    where: { scoredAt: null },
    take: limit,
    orderBy: { createdAt: "desc" },
  });

  let rescored = 0;
  let errors = 0;

  for (const opp of pending) {
    try {
      const s = await scoreItem(profile, {
        externalId: opp.externalId,
        url: opp.url,
        title: opp.title,
        org: opp.org,
        rawText: opp.rawText ?? "",
        postedAt: opp.postedAt,
      });
      await prisma.opportunity.update({
        where: { id: opp.id },
        data: {
          org: s.org ?? opp.org,
          category: s.category,
          stream: s.stream,
          summary: s.summary,
          location: s.location,
          country: s.country,
          isRemote: s.isRemote,
          languageReq: s.languageReq,
          fundingInfo: s.fundingInfo,
          eligibility: s.eligibility,
          deadline: s.deadline,
          tags: s.tags,
          fitScore: s.fitScore,
          fitReasons: s.fitReasons,
          whyNow: s.whyNow,
          recommendedAction: s.recommendedAction,
          scoredAt: new Date(),
        },
      });
      rescored++;
    } catch (e) {
      errors++;
      console.error(`  ⚠ ré-scoring échoué (${opp.title.slice(0, 60)}):`, e instanceof Error ? e.message : e);
    }
  }

  return { pending: pending.length, rescored, errors };
}
