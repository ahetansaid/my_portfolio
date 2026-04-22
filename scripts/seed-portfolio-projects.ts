import { PrismaClient, TechnologyCategory } from "@prisma/client";

const prisma = new PrismaClient();

const TECHNOLOGIES: {
  name: string;
  slug: string;
  category: TechnologyCategory | null;
  sortOrder: number;
}[] = [
  // Existing techs will be kept (upsert on slug)
  { name: "Next.js", slug: "nextjs", category: "development", sortOrder: 1 },
  { name: "React", slug: "react", category: "development", sortOrder: 2 },
  { name: "TypeScript", slug: "typescript", category: "development", sortOrder: 3 },
  { name: "Tailwind CSS", slug: "tailwindcss", category: "development", sortOrder: 4 },
  { name: "Node.js", slug: "nodejs", category: "development", sortOrder: 10 },
  { name: "Express", slug: "express", category: "development", sortOrder: 11 },
  { name: "Laravel", slug: "laravel", category: "development", sortOrder: 12 },
  { name: "Nuxt", slug: "nuxt", category: "development", sortOrder: 13 },
  { name: "Vue", slug: "vue", category: "development", sortOrder: 14 },
  { name: "Django", slug: "django", category: "development", sortOrder: 15 },
  { name: "Python", slug: "python", category: "development", sortOrder: 16 },
  { name: "Flutter", slug: "flutter", category: "development", sortOrder: 17 },
  { name: "Rust", slug: "rust", category: "development", sortOrder: 18 },
  { name: "Prisma", slug: "prisma", category: "development", sortOrder: 19 },
  { name: "Claude AI", slug: "claude-ai", category: "development", sortOrder: 20 },
  // Systems
  { name: "MySQL", slug: "mysql", category: "systems", sortOrder: 30 },
  { name: "PostgreSQL", slug: "postgresql", category: "systems", sortOrder: 31 },
  { name: "Supabase", slug: "supabase", category: "systems", sortOrder: 32 },
  { name: "Elasticsearch", slug: "elasticsearch", category: "systems", sortOrder: 33 },
  { name: "Redis", slug: "redis", category: "systems", sortOrder: 34 },
  { name: "Docker", slug: "docker", category: "systems", sortOrder: 35 },
  { name: "Socket.IO", slug: "socketio", category: "systems", sortOrder: 36 },
  { name: "ERP", slug: "erp", category: "systems", sortOrder: 40 },
  { name: "DGMS", slug: "dgms", category: "systems", sortOrder: 41 },
  // Methodologies
  { name: "RAG", slug: "rag", category: "methodologies", sortOrder: 50 },
];

type ProjectSeed = {
  slug: string;
  name: string;
  tagline: string;
  discoveryContext: string;
  problem: string;
  approach: string;
  results: string;
  repoUrl?: string;
  sortOrder: number;
  isPublished: boolean;
  isFeatured?: boolean;
  technologySlugs: string[];
};

const PROJECTS: ProjectSeed[] = [
  {
    slug: "workpulse",
    name: "WorkPulse",
    tagline: "SaaS de gestion des présences par QR code dynamique anti-fraude.",
    discoveryContext:
      "Les PME/ETI pointent encore sur feuilles Excel ou badges clonables. Les fraudes (pointage par un collègue, copie de QR statique, falsification d'horaires) passent sous le radar, et les managers perdent des heures à consolider les exceptions (congés, missions, permissions) dans des outils éclatés.",
    problem:
      "Construire un système SaaS multi-rôles qui sécurise le pointage côté serveur (pas seulement côté app), centralise les exceptions RH dans un workflow unique, et donne au manager une vue temps réel sans import de fichier.",
    approach:
      "Rotation de QR toutes les 30–60 s signé côté serveur + nonce anti-rejeu + device binding → 8 validations serveur avant d'enregistrer un pointage. Socket.IO pour pousser les événements au dashboard. Jobs Node-cron pour déclencher automatiquement absences à 23h59 et rapports hebdomadaires le vendredi 17h. Scoring disciplinaire automatisé avec seuils 90/75/60/40.",
    results:
      "MVP fonctionnel avec 7 processus métier documentés, PWA installable mobile avec service worker offline, dashboard multi-rôles (admin / manager / employé), 20+ cas de test manuels validés. Pas encore déployé en production.",
    sortOrder: 10,
    isPublished: true,
    technologySlugs: ["nextjs", "typescript", "react", "tailwindcss", "express", "nodejs", "mysql", "socketio"],
  },
  {
    slug: "sys-certificat",
    name: "Sys_Certificat",
    tagline: "Génération et vérification publique de certificats de formation par QR code.",
    discoveryContext:
      "Formateurs indépendants, écoles et entreprises de formation produisent des certificats papier ou PDF non vérifiables, ce qui laisse la porte ouverte à la contrefaçon. L'absence de registre centralisé empêche aussi la révocation après sanction ou erreur administrative.",
    problem:
      "Construire une plateforme multi-tenant qui émet des certificats numériques signés, expose une vérification publique par QR (sans login), et permet la révocation à chaud tout en conservant un journal d'audit immuable.",
    approach:
      "Architecture multi-tenant avec isolation stricte par tenant_id (6 tests dédiés). Génération PDF via pdf-lib + QRCode pointant vers /verify/cert/[token]. Migrations versionnées avec Umzug. Refresh tokens DB-backed avec rotation (30 j) et access tokens courts (15 min). Plans tarifaires (Starter → École → Business) intégrés au modèle de données.",
    results:
      "24 tests Vitest + Supertest couvrant auth et isolation multi-tenant, 8 migrations appliquées, 4 plans tarifaires implémentés, documentation en 7 jalons. Modules Assessment / MOOC / Library amorcés, intégration en cours.",
    repoUrl: "https://github.com/Devdrwt/Sys_Certificat_front",
    sortOrder: 20,
    isPublished: true,
    technologySlugs: ["nextjs", "typescript", "react", "tailwindcss", "express", "nodejs", "mysql"],
  },
  {
    slug: "supportai",
    name: "SupportAI",
    tagline: "Widget de support client B2B avec agent Claude + RAG, dashboard temps réel.",
    discoveryContext:
      "Les équipes de support N1 (SaaS B2B, e-commerce) répondent 50 à 70 % du temps aux mêmes questions (documentation, pricing, troubleshooting simple). Les bots FAQ classiques donnent des réponses rigides, frustrent l'utilisateur et n'escaladent jamais proprement vers un humain.",
    problem:
      "Construire un widget embeddable en une ligne de <script>, qui répond en streaming via Claude avec RAG sur la base de connaissances du client, détecte les cas qu'il ne sait pas traiter, et passe la main à un humain dans un dashboard temps réel — tout en restant multi-tenant.",
    approach:
      "Refonte complète à partir du template open-source qirolab/Nuxt3-Laravel-Reverb-Chat (+ contributions). Widget Vue 3 compilé en web-component avec isolation Shadow DOM. Embeddings Voyage AI (1024 dims) stockés en pgvector + index HNSW, recherche sémantique puis Claude Sonnet 4.6 en streaming SSE avec tool-use (recherche KB, escalade, collecte contact). Laravel Reverb self-hosted pour le WebSocket (protocole Pusher-compatible). Prompt caching sur les prompts système longs.",
    results:
      "MVP commercialisable livré : 9 chantiers complétés (multi-tenant, widget, IA streaming, RAG, dashboard, onboarding, analytics, emails, tests PHPUnit). Roadmap post-MVP : Stripe Cashier, ingestion PDF, i18n, Reverb prod.",
    repoUrl: "https://github.com/qirolab/Nuxt3-Laravel-Reverb-Chat",
    sortOrder: 30,
    isPublished: true,
    isFeatured: true,
    technologySlugs: ["laravel", "nuxt", "vue", "typescript", "tailwindcss", "postgresql", "claude-ai", "rag", "socketio"],
  },
  {
    slug: "ged-intelligent",
    name: "GED Intelligent",
    tagline: "Plateforme GED avec OCR, classification ML et recherche sémantique documentaire.",
    discoveryContext:
      "Un client SaaS béninois devait traiter manuellement des milliers de documents (factures, contrats, CV) : tri, classement, extraction de données, recherche. Coût humain élevé, délai long pour répondre à un audit, aucune traçabilité conforme RGPD.",
    problem:
      "Automatiser le cycle de vie documentaire complet : OCR multilingue sur PDFs scannés ou natifs, classification auto du type (facture, contrat, CV…), extraction des métadonnées clés (montants, dates, entités), recherche full-text + sémantique, workflow de validation, journal d'audit immuable.",
    approach:
      "Django + DRF pour l'API, React pour le frontend. MinerU (opendatalab, dépendance externe — pas un fork) appelé en HTTP pour l'OCR multilingue et l'extraction structurée (tableaux → HTML, formules → LaTeX). scikit-learn (TF-IDF + LinearSVC) pour la classification, spaCy pour le NER. Elasticsearch pour la recherche full-text + facettes. Celery + RabbitMQ pour les traitements asynchrones, Django Channels + Redis pour le temps réel. MinIO en stockage S3-compatible. Docker Compose pour l'infra complète.",
    results:
      "Phase POC avec roadmap 20 semaines jusqu'au go-live (phases 1-5). Cibles mesurables post-lancement : 5000+ documents indexés, recherche < 5 s, classification auto > 80 %, uptime 99,9 %.",
    repoUrl: "https://github.com/ahetansaid/ged-intelligent-back",
    sortOrder: 40,
    isPublished: true,
    isFeatured: true,
    technologySlugs: ["django", "python", "react", "typescript", "postgresql", "elasticsearch", "redis", "docker"],
  },
  {
    slug: "parcauto-manager",
    name: "ParcAuto Manager",
    tagline: "ERP SaaS pour importateurs automobiles ouest-africains : VIN → livraison.",
    discoveryContext:
      "Les importateurs de véhicules d'occasion en Afrique de l'Ouest (Bénin, Togo, Côte d'Ivoire, Sénégal, Burkina, Mali) gèrent leur pipeline dans Excel + WhatsApp : achat conteneur, transit international, douanes, atelier, ventes, trésorerie FCFA + USD/EUR. La donnée est fragmentée, les erreurs de change coûtent cher, et aucun audit n'est possible pour la compta locale.",
    problem:
      "Unifier le pipeline complet, du VIN à la livraison, dans un ERP multi-tenant qui parle FCFA en natif, trace les devises avec persistance du taux au moment de l'opération, implémente un RBAC strict par module, et produit un journal d'audit complet pour la conformité comptable.",
    approach:
      "Stack Node.js / Express / Prisma / MySQL pour l'API, Next.js 14 App Router en front. Schéma Prisma de ~24 modèles couvrant 7 modules (flotte, facturation, CRM, atelier, transit, paramètres, sécurité). RBAC 8 rôles avec permissions granulaires par module. Fichiers (photos véhicules, BL, cartes grises) stockés sur MinIO. PDF via @react-pdf/renderer (4 templates), emails via React Email + Nodemailer. 2FA TOTP disponible côté auth.",
    results:
      "Phases 0-2 de la roadmap 16 semaines en cours (fondations + core modules). Architecture et contrats API documentés en détail (BRIEFING_BACKEND.md, PLAN_IMPLEMENTATION_FRONTEND.md, FEUILLE_DE_ROUTE_PRODUIT.md). Couverture test à compléter avant commercialisation.",
    sortOrder: 50,
    isPublished: true,
    technologySlugs: ["nextjs", "typescript", "react", "tailwindcss", "express", "nodejs", "prisma", "mysql", "erp"],
  },
  {
    slug: "allochap",
    name: "Allochap",
    tagline: "Codes USSD Bénin centralisés — back-office admin + app mobile hors ligne.",
    discoveryContext:
      "Au Bénin, les codes USSD (opérateurs MTN / Moov / Celtis + services publics ANIP / RAVIP / CNSS / DGI…) sont dispersés sur dizaines de pages web et évoluent sans préavis. L'utilisateur mobile finit par tâtonner ou les oublier.",
    problem:
      "Centraliser le référentiel dans un back-office administrable par une équipe éditoriale, puis servir les codes à une app mobile qui fonctionne hors ligne et se synchronise quand le réseau revient. Permissions claires entre super-admin, éditeur et lecteur.",
    approach:
      "Next.js 15 App Router + React 19 + Radix UI pour le back-office. Supabase (Postgres + Auth + RLS) pour le stockage et l'authentification, avec Row-Level Security pour isoler les rôles. Import / export CSV en masse, filtres par opérateur / statut, gestion des catégories et organismes. App mobile Flutter prévue (repo prévoit admin/ + mobile/ + supabase/ — partie mobile à implémenter).",
    results:
      "Back-office en développement avancé (dashboard, CRUD codes télécoms + services publics, rôles via Supabase RLS). Migrations Supabase complètes + seed données Bénin. App mobile Flutter à venir.",
    sortOrder: 60,
    isPublished: true,
    technologySlugs: ["nextjs", "react", "typescript", "tailwindcss", "supabase", "postgresql", "flutter"],
  },
  {
    slug: "gws-cli-contribution",
    name: "Google Workspace CLI — étude & automation",
    tagline: "Étude de la CLI gws (Rust) et intégration dans un workflow d'automation pour agents IA.",
    discoveryContext:
      "Besoin d'automatiser des workflows récurrents sur Google Workspace (Drive, Gmail, Sheets, Calendar) depuis des agents IA, sans écrire un client par API ni manipuler 40+ SDKs distincts.",
    problem:
      "Les APIs Google Workspace (40+ services) imposent du boilerplate OAuth2, des patterns de pagination différents et des formats non uniformes — inexploitable en l'état pour un agent LLM qui a besoin de commandes structurées, d'un output JSON prévisible et d'un contrôle fin de la context window.",
    approach:
      "Étude du projet open-source @googleworkspace/cli (Rust, Apache-2.0), qui reconstruit dynamiquement les commandes via le Discovery Service de Google (chaque nouvelle API est donc supportée automatiquement). Contribution à l'upstream + intégration dans un workflow d'automation : binaire unique exposé aux agents via 100+ skills pré-écrites, field masks pour protéger la context window, dry-run pour prévisualiser les requêtes, multi-mode OAuth (interactif, service account, headless CI/CD).",
    results:
      "Capacité d'automation cross-produits Workspace depuis un binaire Rust compilé, consommable par agents Claude / Gemini sans apprentissage spécifique par API. Model Armor intégré pour sanitisation contre prompt injection.",
    repoUrl: "https://github.com/googleworkspace/cli",
    sortOrder: 70,
    isPublished: true,
    technologySlugs: ["rust", "claude-ai"],
  },
];

async function main() {
  console.log("→ Upserting technologies…");
  for (const t of TECHNOLOGIES) {
    await prisma.technology.upsert({
      where: { slug: t.slug },
      create: t,
      update: { name: t.name, category: t.category, sortOrder: t.sortOrder },
    });
  }
  const techs = await prisma.technology.findMany();
  const techBySlug = new Map(techs.map((t) => [t.slug, t.id]));
  console.log(`  ✓ ${techs.length} technologies in DB.`);

  console.log("→ Upserting projects…");
  for (const p of PROJECTS) {
    const techIds = p.technologySlugs
      .map((s) => techBySlug.get(s))
      .filter((id): id is number => typeof id === "number");

    if (techIds.length !== p.technologySlugs.length) {
      const missing = p.technologySlugs.filter((s) => !techBySlug.has(s));
      throw new Error(`Missing techs for project ${p.slug}: ${missing.join(", ")}`);
    }

    const existing = await prisma.project.findUnique({ where: { slug: p.slug } });

    if (existing) {
      await prisma.projectTechnology.deleteMany({ where: { projectId: existing.id } });
      await prisma.project.update({
        where: { id: existing.id },
        data: {
          name: p.name,
          tagline: p.tagline,
          discoveryContext: p.discoveryContext,
          problem: p.problem,
          approach: p.approach,
          results: p.results,
          repoUrl: p.repoUrl ?? null,
          sortOrder: p.sortOrder,
          isPublished: p.isPublished,
          isFeatured: p.isFeatured ?? false,
          technologies: {
            create: techIds.map((id) => ({ technologyId: id })),
          },
        },
      });
      console.log(`  ↻ updated ${p.slug}`);
    } else {
      await prisma.project.create({
        data: {
          slug: p.slug,
          name: p.name,
          tagline: p.tagline,
          discoveryContext: p.discoveryContext,
          problem: p.problem,
          approach: p.approach,
          results: p.results,
          repoUrl: p.repoUrl ?? null,
          sortOrder: p.sortOrder,
          isPublished: p.isPublished,
          isFeatured: p.isFeatured ?? false,
          technologies: {
            create: techIds.map((id) => ({ technologyId: id })),
          },
        },
      });
      console.log(`  + created ${p.slug}`);
    }
  }

  const total = await prisma.project.count();
  console.log(`\n✓ Done. ${total} projects in DB.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
