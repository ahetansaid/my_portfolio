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

  // Site stats
  await prisma.siteStats.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      projectsShipped: 10,
      yearsExperience: 3,
      domainsCovered: 6,
      clientsServed: 8,
      currentlyBuilding: "FleetPulse v2 — SaaS gestion de flotte",
    },
  });

  // Playground items (exemples)
  const playground = [
    {
      slug: "qr-rotatif-anti-fraude",
      title: "QR rotatif anti-fraude",
      emoji: "🔐",
      description:
        "Expérimentation de QR codes signés HMAC-SHA256 qui rotent toutes les 30 secondes. Redis pour les nonces anti-replay.",
      tags: ["security", "experiment", "redis"],
      sortOrder: 1,
    },
    {
      slug: "ged-ocr-mineru",
      title: "OCR documents + classification ML",
      emoji: "📄",
      description:
        "Pipeline MinerU + scikit-learn pour extraire et classer automatiquement des factures, contrats et devis.",
      tags: ["ai", "ml", "ocr"],
      sortOrder: 2,
    },
    {
      slug: "ia-match-offre-profil",
      title: "Matching IA offre / profil",
      emoji: "🤖",
      description:
        "Endpoint OpenAI qui analyse une offre d'emploi et produit un score de fit + pitch personnalisé. Utilisé sur /recruiter.",
      tags: ["ai", "openai", "recruiting"],
      sortOrder: 3,
    },
  ];
  for (const p of playground) {
    await prisma.playgroundItem.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    });
  }
  console.log("Playground créé :", playground.length);

  // Availability
  await prisma.availabilityStatus.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      status: "available",
      message: "Disponible pour une nouvelle mission dès maintenant",
    },
  });

  // Services
  const services = [
    {
      slug: "audit-si",
      title: "Audit SI & Cartographie",
      icon: "🔍",
      description: "Analyse complète de votre système d'information existant, cartographie des processus, identification des points de friction et recommandations concrètes d'amélioration.",
      priceRange: "À partir de 1 500 €",
      duration: "2 à 5 jours",
      deliverables: ["Rapport d'audit détaillé", "Cartographie des processus", "Plan d'action priorisé", "Restitution orale"],
      sortOrder: 1,
    },
    {
      slug: "integration-erp-ged",
      title: "Intégration ERP / GED",
      icon: "🔧",
      description: "Intégration et déploiement de solutions ERP, GED et systèmes métier. Migration de données, paramétrage, formation des utilisateurs et accompagnement au changement.",
      priceRange: "Sur devis",
      duration: "4 à 12 semaines",
      deliverables: ["Installation & paramétrage", "Migration des données", "Formation équipes", "Documentation utilisateur", "Support post-déploiement"],
      sortOrder: 2,
    },
    {
      slug: "developpement-saas-custom",
      title: "Développement SaaS sur mesure",
      icon: "⚙️",
      description: "Conception et développement de plateformes SaaS multi-tenants, avec architecture scalable, authentification, paiements et tableaux de bord analytiques.",
      priceRange: "Sur devis",
      duration: "6 à 16 semaines",
      deliverables: ["Architecture technique", "MVP fonctionnel", "CI/CD + déploiement", "Documentation API", "Suivi post-lancement"],
      sortOrder: 3,
    },
    {
      slug: "consulting-architecture",
      title: "Consulting & Architecture",
      icon: "🧭",
      description: "Accompagnement en architecture logicielle, choix technologiques, revue de code, optimisation des performances et mentorat technique pour équipes de développement.",
      priceRange: "À la journée",
      duration: "Flexible",
      deliverables: ["Schémas d'architecture", "Revue de code", "Recommandations techniques", "Sessions de mentorat"],
      sortOrder: 4,
    },
  ];

  for (const s of services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: {},
      create: s,
    });
  }
  console.log("Services créés :", services.length);

  // Sample testimonials (publiés par défaut pour la démo)
  const testimonials = [
    {
      authorName: "Aïcha K.",
      authorRole: "Directrice Technique",
      authorCompany: "Oasis Consulting",
      content: "Un travail d'une qualité remarquable. Mohamed a livré notre plateforme dans les temps, avec une rigueur et une capacité d'adaptation qui ont fait toute la différence. Recommandé sans hésiter.",
      rating: 5,
      isPublished: true,
      sortOrder: 1,
    },
    {
      authorName: "Jean-Luc M.",
      authorRole: "Fondateur",
      authorCompany: "Drwintech",
      content: "Mohamed comprend rapidement les enjeux métier et propose des solutions pragmatiques. Son approche orientée résultats et sa maîtrise technique font de lui un partenaire de confiance.",
      rating: 5,
      isPublished: true,
      sortOrder: 2,
    },
    {
      authorName: "Fatou D.",
      authorRole: "Responsable IT",
      authorCompany: "CNAD",
      content: "Excellente intégration de notre système métier. Documentation claire, processus transparent, et un support après livraison qui fait la différence.",
      rating: 5,
      isPublished: true,
      sortOrder: 3,
    },
  ];

  for (const t of testimonials) {
    const exists = await prisma.testimonial.findFirst({ where: { authorName: t.authorName, authorCompany: t.authorCompany } });
    if (!exists) await prisma.testimonial.create({ data: t });
  }
  console.log("Témoignages créés :", testimonials.length);

  // Timeline — parcours réel (CV)
  const timeline = [
    {
      year: "2019-2020",
      title: "Baccalauréat Série C — CEG Akpakpa-Centre",
      description: "Baccalauréat scientifique (maths, physique, biologie). Première approche de la logique et des sciences exactes, socle des futures études techniques.",
      sortOrder: 1,
    },
    {
      year: "Juil-Oct 2022",
      title: "Stage — Port Autonome de Cotonou (DSI)",
      description: "Stage professionnel à la Direction des Systèmes d'Information. Immersion dans l'administration de systèmes critiques, maintenance et exploitation.",
      sortOrder: 2,
    },
    {
      year: "2021-2024",
      title: "Licence Pro Systèmes Informatiques & Logiciels — ESEP Le Berger",
      description: "Formation en développement d'applications, bases de données et génie logiciel. Premiers vrais projets web en PHP, Laravel, MySQL.",
      sortOrder: 3,
    },
    {
      year: "Oct 2024",
      title: "Lauréat — Défi des Innovateurs Blockchain",
      description: "Reconnaissance par Africa Blockchain Institute pour un projet innovant combinant blockchain et usage concret.",
      sortOrder: 4,
    },
    {
      year: "Déc 2024 - Mars 2025",
      title: "Stage — Ministère du Travail et de la Fonction Publique",
      description: "Stage professionnel dans un environnement administratif de l'État béninois. Conception et déploiement de solutions internes.",
      sortOrder: 5,
    },
    {
      year: "2024-présent",
      title: "Coding Academy Full Stack — Epitech Bénin",
      description: "Formation intensive par projet chez Epitech : Next.js, React, TypeScript, architectures scalables, DevOps.",
      sortOrder: 6,
    },
    {
      year: "Avril 2025-présent",
      title: "Intégrateur Système Informatique — DrwinTech Inc.",
      description: "Conception et déploiement de plateformes numériques pour le marché ouest-africain. Réalisation phare : Afri-Members — SaaS de cotisations avec Mobile Money (FedaPay), relances SMS (Africa's Talking) et module de conformité légale par IA (Anthropic Claude). Migration de paiement Gobipay → FedaPay, système OTP SMS, prototype Alogo.",
      sortOrder: 7,
    },
  ];
  for (const t of timeline) {
    const exists = await prisma.timelineItem.findFirst({ where: { year: t.year, title: t.title } });
    if (!exists) await prisma.timelineItem.create({ data: t });
  }
  console.log("Timeline créée :", timeline.length);

  // About values
  const values = [
    { title: "Qualité & rigueur", description: "Code propre, tests, documentation. Un livrable solide qui ne casse pas après 2 mois.", sortOrder: 1 },
    { title: "Orientation résultats", description: "Chaque projet est pensé pour résoudre un vrai problème métier, avec des métriques d'impact mesurables.", sortOrder: 2 },
    { title: "Transparence", description: "Communication claire tout au long du projet, pas de surprise sur les délais ni les coûts.", sortOrder: 3 },
    { title: "Apprentissage continu", description: "Veille technologique permanente pour proposer les meilleures solutions actuelles, sans surenchère inutile.", sortOrder: 4 },
  ];
  for (const v of values) {
    const exists = await prisma.aboutValue.findFirst({ where: { title: v.title } });
    if (!exists) await prisma.aboutValue.create({ data: v });
  }
  console.log("Valeurs créées :", values.length);

  // Skill categories + items
  const skillsData = [
    {
      name: "Développement",
      description: "Langages & frameworks maîtrisés au quotidien",
      icon: "💻",
      sortOrder: 1,
      items: ["TypeScript", "JavaScript (ES6+)", "React", "Next.js", "Vue.js", "Node.js", "Express", "Laravel", "Python", "PHP", "C++"],
    },
    {
      name: "Bases de données & DevOps",
      description: "Données, conteneurs et intégration continue",
      icon: "🗄️",
      sortOrder: 2,
      items: ["MySQL", "MariaDB", "PostgreSQL", "Supabase", "Prisma", "Drizzle ORM", "Docker", "Git / GitHub", "CI/CD", "Linux"],
    },
    {
      name: "Paiements & Intégrations",
      description: "Mobile Money, SMS et API métier",
      icon: "💳",
      sortOrder: 3,
      items: ["FedaPay", "Mobile Money (MTN/Moov/Orange)", "Africa's Talking (SMS OTP)", "API REST", "Webhooks"],
    },
    {
      name: "IA & Données",
      description: "IA appliquée et analyse de données",
      icon: "🤖",
      sortOrder: 4,
      items: ["Anthropic Claude API", "OpenAI", "RAG", "PowerBI", "Analyse de données"],
    },
  ];
  for (const cat of skillsData) {
    const category = await prisma.skillCategory.upsert({
      where: { id: cat.sortOrder },
      update: { name: cat.name, description: cat.description, icon: cat.icon, sortOrder: cat.sortOrder },
      create: { id: cat.sortOrder, name: cat.name, description: cat.description, icon: cat.icon, sortOrder: cat.sortOrder },
    });
    for (let i = 0; i < cat.items.length; i++) {
      const exists = await prisma.skillItem.findFirst({ where: { categoryId: category.id, name: cat.items[i] } });
      if (!exists) {
        await prisma.skillItem.create({
          data: { categoryId: category.id, name: cat.items[i], sortOrder: i },
        });
      }
    }
  }
  console.log("Compétences créées");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
