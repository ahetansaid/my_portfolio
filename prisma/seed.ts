import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Admin user
  const hash = await bcrypt.hash("admin123", 10);
  const admin = await prisma.adminUser.upsert({
    where: { email: "admin@portfolio.local" },
    update: {},
    create: { email: "admin@portfolio.local", passwordHash: hash },
  });
  console.log("Admin créé :", admin.email);

  // Technologies
  const techs = await Promise.all([
    prisma.technology.upsert({
      where: { slug: "nextjs" },
      update: {},
      create: { name: "Next.js", slug: "nextjs", category: "development", sortOrder: 1 },
    }),
    prisma.technology.upsert({
      where: { slug: "react" },
      update: {},
      create: { name: "React", slug: "react", category: "development", sortOrder: 2 },
    }),
    prisma.technology.upsert({
      where: { slug: "mysql" },
      update: {},
      create: { name: "MySQL", slug: "mysql", category: "systems", sortOrder: 3 },
    }),
    prisma.technology.upsert({
      where: { slug: "erp" },
      update: {},
      create: { name: "ERP", slug: "erp", category: "systems", sortOrder: 4 },
    }),
    prisma.technology.upsert({
      where: { slug: "dgms" },
      update: {},
      create: { name: "DGMS", slug: "dgms", category: "systems", sortOrder: 5 },
    }),
    prisma.technology.upsert({
      where: { slug: "typescript" },
      update: {},
      create: { name: "TypeScript", slug: "typescript", category: "development", sortOrder: 6 },
    }),
  ]);
  console.log("Technologies créées :", techs.map((t) => t.name).join(", "));

  const [nextjs, react, mysql, erp, dgms] = techs;

  // Projects
  const p1 = await prisma.project.upsert({
    where: { slug: "dgms-gestion-flotte" },
    update: {},
    create: {
      slug: "dgms-gestion-flotte",
      name: "DGMS — Gestion de flotte",
      problem: "Suivi des véhicules et des conducteurs difficile à centraliser. Les données étaient dispersées entre plusieurs outils incompatibles, rendant le reporting manuel et chronophage.",
      solution: "Déploiement d'une solution DGMS centralisée avec tableau de bord cartographique en temps réel, alertes automatiques et rapports d'activité paramétrables.",
      results: "Réduction de 30% des coûts opérationnels, visibilité complète sur la flotte en temps réel, génération automatique des rapports hebdomadaires.",
      imageUrl: null,
      sortOrder: 1,
      isPublished: true,
      technologies: {
        create: [{ technologyId: dgms.id }, { technologyId: mysql.id }, { technologyId: react.id }],
      },
    },
  });

  const p2 = await prisma.project.upsert({
    where: { slug: "erp-module-sur-mesure" },
    update: {},
    create: {
      slug: "erp-module-sur-mesure",
      name: "Module ERP sur mesure",
      problem: "Le progiciel ERP standard ne couvrait pas les processus métier spécifiques du client. Des écarts de données entre services entraînaient des erreurs coûteuses.",
      solution: "Développement de modules complémentaires et d'interfaces d'intégration sur mesure, connectés à l'ERP existant via API et scripts d'import.",
      results: "Processus entièrement unifiés, gain de 15h/semaine sur les opérations manuelles, zéro écart de données entre services.",
      imageUrl: null,
      sortOrder: 2,
      isPublished: true,
      technologies: {
        create: [{ technologyId: erp.id }, { technologyId: mysql.id }],
      },
    },
  });

  const p3 = await prisma.project.upsert({
    where: { slug: "portfolio-digital" },
    update: {},
    create: {
      slug: "portfolio-digital",
      name: "Portfolio digital",
      problem: "Absence de vitrine professionnelle structurée pour valoriser les réalisations et faciliter la prise de contact.",
      solution: "Conception et développement d'un portfolio Next.js avec backoffice intégré, base MySQL et design responsive moderne.",
      results: "Présentation claire et professionnelle des projets, mise à jour centralisée via backoffice, déploiement optimisé.",
      imageUrl: null,
      sortOrder: 3,
      isPublished: true,
      technologies: {
        create: [{ technologyId: nextjs.id }, { technologyId: react.id }, { technologyId: mysql.id }],
      },
    },
  });

  console.log("Projets créés :", p1.name, "|", p2.name, "|", p3.name);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
