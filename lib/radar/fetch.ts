import Parser from "rss-parser";

export type RawItem = {
  externalId: string;
  url: string;
  title: string;
  org: string | null;
  rawText: string;
  postedAt: Date | null;
};

const parser = new Parser({
  timeout: 30_000,
  // Certains sites (IAPH…) bloquent les UA non-navigateur.
  headers: { "User-Agent": "Mozilla/5.0 (compatible; career-radar/1.0)" },
});

/** Récupère les entrées réelles d'un flux RSS et les normalise. */
export async function fetchRss(url: string, limit: number): Promise<RawItem[]> {
  const feed = await parser.parseURL(url);
  return (feed.items ?? [])
    .slice(0, limit)
    .map((it): RawItem => {
      const raw = (it.contentSnippet || it.content || (it as { summary?: string }).summary || "").toString();
      return {
        externalId: (it.guid || it.link || it.title || "").toString().slice(0, 480),
        url: (it.link || "").toString(),
        title: (it.title || "").toString().trim(),
        org: (it.creator || feed.title || null) as string | null,
        rawText: raw.replace(/\s+/g, " ").trim().slice(0, 4000),
        postedAt: it.isoDate ? new Date(it.isoDate) : null,
      };
    })
    .filter((x) => x.url && x.title && x.externalId);
}
