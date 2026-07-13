import { rescoreUnscored } from "@/lib/radar/rescore";
import { llmProvider } from "@/lib/radar/llm";
import { emailConfigured } from "@/lib/radar/notify";
import { prisma } from "@/lib/db";

async function main() {
  console.log(`→ Moteur LLM : ${llmProvider() ?? "AUCUN"} · Email : ${emailConfigured() ? "configuré" : "non configuré"}`);
  const limit = Number(process.argv[2]) || 20;
  const res = await rescoreUnscored({ limit });
  console.log(`\n=== Ré-scoring ===`);
  console.log(`En attente: ${res.pending} · Enrichies: ${res.rescored} · Erreurs: ${res.errors} · Emails envoyés: ${res.notified}`);

  const top = await prisma.opportunity.findMany({
    where: { scoredAt: { not: null } },
    orderBy: [{ fitScore: "desc" }],
    take: 15,
    select: { fitScore: true, stream: true, category: true, title: true },
  });
  console.log("\nTop opportunités scorées :");
  for (const o of top) {
    console.log(`  [${String(o.fitScore ?? "?").padStart(3)}] (${o.stream}/${o.category}) ${o.title.slice(0, 72)}`);
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
