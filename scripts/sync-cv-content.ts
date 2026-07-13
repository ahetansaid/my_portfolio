import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Compétences alignées sur le CV (2026) — 4 catégories
const SKILLS = [
  {
    id: 1,
    name: "Développement",
    icon: "💻",
    description: "Langages & frameworks maîtrisés au quotidien",
    sortOrder: 1,
    items: ["TypeScript", "JavaScript (ES6+)", "React", "Next.js", "Vue.js", "Node.js", "Express", "Laravel", "Python", "PHP", "C++"],
  },
  {
    id: 2,
    name: "Bases de données & DevOps",
    icon: "🗄️",
    description: "Données, conteneurs et intégration continue",
    sortOrder: 2,
    items: ["MySQL", "MariaDB", "PostgreSQL", "Supabase", "Prisma", "Drizzle ORM", "Docker", "Git / GitHub", "CI/CD", "Linux"],
  },
  {
    id: 3,
    name: "Paiements & Intégrations",
    icon: "💳",
    description: "Mobile Money, SMS et API métier",
    sortOrder: 3,
    items: ["FedaPay", "Mobile Money (MTN/Moov/Orange)", "Africa's Talking (SMS OTP)", "API REST", "Webhooks"],
  },
  {
    id: 4,
    name: "IA & Données",
    icon: "🤖",
    description: "IA appliquée et analyse de données",
    sortOrder: 4,
    items: ["Anthropic Claude API", "OpenAI", "RAG", "PowerBI", "Analyse de données"],
  },
];

async function main() {
  // --- Compétences : reset propre puis recréation ---
  console.log("→ Synchronisation des compétences…");
  for (const cat of SKILLS) {
    const category = await prisma.skillCategory.upsert({
      where: { id: cat.id },
      update: { name: cat.name, icon: cat.icon, description: cat.description, sortOrder: cat.sortOrder },
      create: { id: cat.id, name: cat.name, icon: cat.icon, description: cat.description, sortOrder: cat.sortOrder },
    });
    // Remplace intégralement les items pour refléter le CV
    await prisma.skillItem.deleteMany({ where: { categoryId: category.id } });
    await prisma.skillItem.createMany({
      data: cat.items.map((name, i) => ({ categoryId: category.id, name, sortOrder: i })),
    });
    console.log(`  ✓ ${cat.icon} ${cat.name} → ${cat.items.length} items`);
  }
  // Supprime d'éventuelles anciennes catégories au-delà des 4 conservées
  const removed = await prisma.skillCategory.deleteMany({ where: { id: { gt: SKILLS.length } } });
  if (removed.count) console.log(`  ✓ ${removed.count} ancienne(s) catégorie(s) supprimée(s)`);

  // --- Timeline : aligner l'entrée DrwinTech sur le CV ---
  console.log("→ Mise à jour de la timeline DrwinTech…");
  const drwin = await prisma.timelineItem.findFirst({
    where: { title: { contains: "Drwintech" } },
  });
  if (drwin) {
    await prisma.timelineItem.update({
      where: { id: drwin.id },
      data: {
        title: "Intégrateur Système Informatique — DrwinTech Inc.",
        description:
          "Conception et déploiement de plateformes numériques pour le marché ouest-africain. Réalisation phare : Afri-Members — SaaS de cotisations avec Mobile Money (FedaPay), relances SMS (Africa's Talking) et module de conformité légale par IA (Anthropic Claude). Migration de paiement Gobipay → FedaPay, système OTP SMS, prototype Alogo.",
      },
    });
    console.log(`  ✓ Timeline DrwinTech mise à jour (id ${drwin.id})`);
  } else {
    console.log("  ⚠ Entrée DrwinTech introuvable dans la timeline");
  }

  // --- Récap ---
  const cats = await prisma.skillCategory.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { items: true } } },
  });
  console.table(cats.map((c) => ({ id: c.id, name: c.name, items: c._count.items })));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
