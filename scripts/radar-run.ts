import { runIngest } from "@/lib/radar/ingest";
import { prisma } from "@/lib/db";

async function main() {
  const limit = Number(process.argv[2]) || 6;
  console.log(`→ Ingestion réelle (limit ${limit}/source)…`);
  const stats = await runIngest({ limitPerSource: limit });
  console.log("\n=== Résultat ===");
  console.log(`Sources: ${stats.sources} · Récupérés: ${stats.fetched} · Créés scorés: ${stats.created} · Créés non-scorés: ${stats.createdUnscored} · Ignorés (doublons): ${stats.skipped} · Erreurs scoring: ${stats.errors}`);
  if (stats.createdItems.length) {
    console.log("\nNouvelles opportunités (score) :");
    for (const it of stats.createdItems.sort((a, b) => (b.fitScore ?? 0) - (a.fitScore ?? 0))) {
      console.log(`  [${String(it.fitScore ?? "?").padStart(3)}] (${it.stream}) ${it.title.slice(0, 80)}`);
    }
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
