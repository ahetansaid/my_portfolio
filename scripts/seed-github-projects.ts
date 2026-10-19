import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Ajoute les 10 projets des dépôts GitHub github.com/ahetansaid (oct. 2026).
// Idempotent : upsert par slug, ne touche pas aux projets existants.

const TECHNOLOGIES = [
  { name: "Drizzle ORM", slug: "drizzle", category: "development", sortOrder: 21 },
  { name: "Hono", slug: "hono", category: "development", sortOrder: 22 },
  { name: "FastAPI", slug: "fastapi", category: "development", sortOrder: 23 },
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
    slug: "beile",
    name: "BEILE",
    tagline:
      "Couche nationale d'intelligence éducative : registre unique des faits scolaires, identité NPI, connecteurs signés.",
    discoveryContext:
      "Le système éducatif béninois produit chaque jour des faits — inscription, absence, note, transfert, diplôme — dispersés entre établissements, directions et systèmes (EducMaster, eRESULTATS, universités, DBAU). Ces faits sont ressaisis plusieurs fois et remontent tard, souvent incomplets.",
    problem:
      "Construire une couche nationale interopérable (pas un logiciel de gestion de plus) qui relie ces faits en un registre unique, rattache chaque apprenant par son NPI, et restitue à chaque acteur — famille, direction, inspection, carte nationale — exactement ce dont il a besoin, sans aucune ressaisie.",
    approach:
      "Next.js 16 + API Hono (Node.js 22), PostgreSQL 18 + PostGIS sur Neon (Francfort), TypeScript strict. Registre en ajout seul garanti par la base elle-même : une erreur se corrige par un événement correctif motivé, l'original reste tracé. Les systèmes existants transmettent leurs faits par connecteurs signés (esprit X-Road) ; les écrans de saisie ne sont que le mode secours. Chaque accès est découplé et contrôlé ; l'enfant sans acte de naissance est inscrit, signalé et régularisé, jamais exclu.",
    results:
      "MVP déployé sur Vercel (fra1) avec API de santé publique, CI de recette de bout en bout, conception de tenue en charge à l'échelle nationale et trajectoire de déploiement souverain documentées.",
    repoUrl: "https://github.com/ahetansaid/EduTech",
    sortOrder: 75,
    isPublished: true,
    technologySlugs: ["nextjs", "hono", "typescript", "react", "nodejs", "postgresql"],
  },
  {
    slug: "staybj-pms",
    name: "StayBJ PMS",
    tagline:
      "PMS hôtelier pour l'hôtellerie indépendante africaine : planning, réservations, caisse Mobile Money, facturation OHADA.",
    discoveryContext:
      "Les hôtels indépendants du Bénin pilotent planning, réservations et caisse sur des cahiers et tableurs, avec des outils pensés ni pour le Mobile Money ni pour la facturation OHADA. L'annuaire public et le back-office d'exploitation sont deux besoins distincts, souvent mélangés.",
    problem:
      "Livrer le front-office d'un PMS (Property Management System) derrière login — planning, réservations, caisse Mobile Money, facturation conforme OHADA — édité par Drwintech SaaS Solutions (Porto-Novo), avec l'annuaire public SEO dans un dépôt séparé.",
    approach:
      "Next.js 16 (App Router, Turbopack), TypeScript strict, Tailwind CSS v4 en configuration CSS-first avec design system maison, recharts pour les graphiques. Client fetch typé vers une API Django REST (/api/v1), authentification JWT. Architecture d'ensemble consignée dans un blueprint ADR (StayBJ_Architecture_v1.md) qui sépare strictement PMS et annuaire.",
    results:
      "Back-office PMS en construction sur une architecture ADR documentée, avec maquettes de référence et séparation claire des surfaces (exploitation vs SEO public).",
    repoUrl: "https://github.com/ahetansaid/guide229",
    sortOrder: 80,
    isPublished: true,
    technologySlugs: ["nextjs", "typescript", "react", "tailwindcss", "django", "python"],
  },
  {
    slug: "orientafrik",
    name: "OrientAfrik",
    tagline:
      "Plateforme tripartite d'orientation post-bac au Bénin : Plan de Parcours personnalisé, funnel écoles CPA, créneaux consultants.",
    discoveryContext:
      "Au Bénin, l'orientation post-bac repose sur le bouche-à-oreille : les bacheliers choisissent des filières sans visibilité sur les débouchés ni les bourses, les écoles peinent à recruter et les consultants d'orientation n'ont aucun outil de prise de rendez-vous.",
    problem:
      "Relier bacheliers, écoles et consultants sur une plateforme unique : le bachelier répond à quelques questions et reçoit un Plan de Parcours (3 filières, écoles, bourses), partageable, avec PDF détaillé payant (200 F), réservation de consultation et orientation vers une école ; les écoles suivent un funnel d'inscription CPA ; les consultants gèrent leurs créneaux.",
    approach:
      "Next.js 16 (App Router, RSC, Server Actions) en architecture feature-first à imports à sens unique (ui → actions → domain + data). Neon Postgres + Drizzle ORM, Better Auth email-OTP sans service externe (tables dans la base), PDF sur Vercel Blob, paiement Fedapay avec webhooks, Resend pour les emails. Domaine métier en TypeScript pur validé par Zod, cible des tests unitaires Vitest ; E2E Playwright ; Sentry + Plausible.",
    results:
      "Plateforme complète avec authentification OTP, paiement Mobile Money, partage OG des plans, typecheck strict et lint à 0 warning toléré, couverte par tests unitaires et E2E.",
    repoUrl: "https://github.com/ahetansaid/orientafrik",
    sortOrder: 85,
    isPublished: true,
    technologySlugs: ["nextjs", "typescript", "react", "tailwindcss", "postgresql", "drizzle", "fedapay"],
  },
  {
    slug: "scg-plateforme",
    name: "SCG — Plateforme L'Arc",
    tagline:
      "Masterclasses, formations certifiantes, mentorat et publications pour Strategic Consulting Group (Cotonou).",
    discoveryContext:
      "Strategic Consulting Group (Cotonou, Bénin) dispense masterclasses, formations certifiantes et mentorat sans plateforme dédiée. Le contenu doit être créé depuis un back-office — aucun jeu de démonstration — dans le respect d'une charte graphique maison, le système « L'Arc ».",
    problem:
      "Construire la plateforme pédagogique (sessions à capacité limitée, mentorat à quota mensuel, plafond de demandes ouvertes, publications) avec une autorisation réellement tenue côté serveur : les actions serveur s'appellent directement, masquer un bouton ne protège rien.",
    approach:
      "Next.js 16 (App Router, Turbopack) + React 19, Tailwind 4 à tokens, PostgreSQL 16 via Drizzle, TypeScript strict. Vérification de rôle (exigerUtilisateur / exigerRole) en tête de chaque page privée et de chaque action ; un rôle insuffisant renvoie un 404 plutôt qu'un 403. Règles métier (capacité, quotas, cohérence des dates) vérifiées à l'écriture. Création de compte administrateur uniquement en CLI, identifiants passés par l'environnement — jamais en drapeaux (historique shell, liste des processus).",
    results:
      "Plateforme au design system « L'Arc » (motifs porteurs d'information), seed idempotent qui refuse de s'exécuter si la base porte des inscriptions réelles, rôle applicatif non-superutilisateur, typecheck et lint outillés.",
    repoUrl: "https://github.com/ahetansaid/scg",
    sortOrder: 90,
    isPublished: true,
    technologySlugs: ["nextjs", "typescript", "react", "tailwindcss", "postgresql", "drizzle"],
  },
  {
    slug: "mediatrust-ledger",
    name: "MediaTrust Ledger",
    tagline:
      "Certificats d'antériorité et d'intégrité pour le journalisme citoyen ouest-africain : registre chaîné, ancrage Bitcoin, 4 langues.",
    discoveryContext:
      "Les journalistes citoyens d'Afrique de l'Ouest se font copier, modifier ou voler leurs textes et photos sans recours : aucune preuve d'antériorité abordable, aucun moyen de démontrer qu'une version qui circule a été altérée. Projet porté dans le cadre du Hackathon Jeunesse UNESCO (Éducation aux Médias et à l'Information).",
    problem:
      "Délivrer en moins d'une minute un Certificat d'Antériorité et d'Intégrité — empreinte cryptographique horodatée, registre chaîné, ancrage public — avec analyse IA indicative et recherche inverse (remonter d'une copie recompressée à l'original), en français, anglais, yoruba et fon.",
    approach:
      "Registre append-only garanti par les GRANT SQL. API : certify (texte, image, lien), verify/match en recherche exacte et perceptuelle, vérification publique, export de la chaîne. Certificat PDF à QR code avec diacritiques yoruba composées, page publique cible des QR. Ancrage public sur Bitcoin via OpenTimestamps. Analyse Claude conçue pour ne jamais lever : clé absente, panne ou sortie invalide → null, échec inscrit (ai_status), certificat intact — contrat vérifié par db:smoke à chaque passage, y compris sans clé API. Vérification indépendante db:verify, y compris hors base.",
    results:
      "Phase 0 fonctionnelle : registre chaîné, certification, recherche inverse, vérification publique, export, ancrage OpenTimestamps, interface complète en 4 langues, PDF + QR. Porteur 1er Prix du Défi des Innovateurs Blockchain (Africa Blockchain Institute).",
    repoUrl: "https://github.com/ahetansaid/mediatrust-ledger",
    sortOrder: 95,
    isPublished: true,
    technologySlugs: ["nextjs", "typescript", "react", "postgresql", "claude-ai"],
  },
  {
    slug: "verifon-factcheck",
    name: "Vérifon",
    tagline:
      "Fact-checking AI-native multilingue (français, fon, yoruba) : ClaimReview, bot conversationnel sourcé, POC voix.",
    discoveryContext:
      "Aucune plateforme francophone d'Afrique de l'Ouest n'offre aujourd'hui de fact-checking conversationnel, multilingue par la voix, ni de balisage ClaimReview exploitable par Google et les LLM. Cible : un partenaire éditorial béninois éligible à l'appel EPSG, avec un MVP buildable sur moyens propres, sans dépendance externe bloquante.",
    problem:
      "Livrer un MVP démontrable immédiatement : chaque vérification publiée porte le balisage ClaimReview (schema.org) validé en CI ; un bot répond au « c'est vrai ? » par une réponse ancrée et sourcée, jamais inventée ; la faisabilité de la vérification par la voix en fon/yoruba est mesurée, pas supposée.",
    approach:
      "Trois briques : core Laravel 12 (API publique, administration Filament, génération ClaimReview, bot VerificationSearch, file éditoriale, throttle), web Next.js 15 SSR (accueil, recherche, vérifications avec ClaimReview injecté, personnalités, signalement, widget de chat, sitemap + RSS), workers FastAPI d'embeddings e5 pour la recherche sémantique. Chaîne de réponse déterministe → sémantique → reformulation Claude. POC voix : pipeline ASR → traduction → WER mesuré, avec gold-tool. CI GitHub Actions : tests + validation ClaimReview.",
    results:
      "Les trois différenciateurs concrétisés et vérifiés en CI. Base SQLite en dev, PostgreSQL en cible production, documentation de déploiement complète et page de candidature EPSG livrée.",
    repoUrl: "https://github.com/ahetansaid/factcheck-mvp",
    sortOrder: 100,
    isPublished: true,
    technologySlugs: ["laravel", "nextjs", "react", "typescript", "python", "fastapi", "claude-ai"],
  },
  {
    slug: "agri-market-africa",
    name: "Agri Market Africa",
    tagline:
      "Marketplace agricole panafricaine : mise en relation d'agriculteurs à fort potentiel et chercheurs d'opportunités.",
    discoveryContext:
      "Le secteur agricole ouest-africain manque d'intermédiation numérique : les agriculteurs à fort potentiel restent invisibles pour les acheteurs, investisseurs et programmes d'opportunités, et les données du secteur sont fragmentées.",
    problem:
      "Construire une marketplace qui facilite la mise en relation entre agriculteurs et chercheurs d'opportunités, avec statistiques consolidées, sur une architecture backend/frontend découplée et déployable séparément.",
    approach:
      "Backend Django REST (IDA Marketplace) avec base SQLite par défaut et PostgreSQL recommandé en production. Frontend Next.js 15 + Tailwind 4 + Motion + shadcn/ui, construit autour du design system « African Terra » (tokens de marque documentés), consommant l'API via des endpoints typés (/api/stats/summary, fiches, mise en relation).",
    results:
      "MVP frontend/backend découplé et fonctionnel en local, design system documenté, statistiques de la marketplace exposées par l'API.",
    repoUrl: "https://github.com/ahetansaid/agri-market-frontend",
    sortOrder: 105,
    isPublished: true,
    technologySlugs: ["nextjs", "django", "python", "typescript", "react", "tailwindcss", "postgresql"],
  },
  {
    slug: "trousseau",
    name: "Trousseau",
    tagline:
      "Répertoire des dossiers clients : identité, documents administratifs, accès chiffrés et alertes sur échéances.",
    discoveryContext:
      "Les professionnels qui suivent des dossiers clients (identité, documents administratifs, accès) les éparpillent entre dossiers papier, disques et gestionnaires de mots de passe. Les échéances passent inaperçues et les secrets circulent en clair.",
    problem:
      "Centraliser les dossiers clients dans une application à deux rôles (administrateur et lecteur), avec chiffrement des champs secrets, alerte sur les échéances et journal d'audit en ajout seul — en assumant qu'une seule négligence est irréversible : la perte de la clé de chiffrement.",
    approach:
      "Next.js sur Vercel + PostgreSQL Neon + Drizzle. Chiffrement AES-256-GCM des champs secrets (clé 32 octets base64), sessions en base avec hachage et gardes de rôle vérifiés côté serveur (exigerAdmin() en tête de toute action), journal en ajout seul. Semis initial idempotent qui n'affiche le mot de passe administrateur qu'une fois. Document de conception et maquette des écrans livrés dans docs/.",
    results:
      "Application fonctionnelle déployable, droits tenus côté serveur, irréversibilité de la perte de clé documentée explicitement — le seul point du projet dont la négligence est définitive.",
    repoUrl: "https://github.com/ahetansaid/trousseau",
    sortOrder: 110,
    isPublished: true,
    technologySlugs: ["nextjs", "typescript", "react", "postgresql", "drizzle"],
  },
  {
    slug: "tempo-reservation",
    name: "TEMPO",
    tagline:
      "Réservation et gestion de clientèle pour coiffeurs, barbiers et salons du Bénin — étude, architecture et POC notifications.",
    discoveryContext:
      "À Cotonou et Abomey-Calavi, coiffeurs, barbiers et salons gèrent leurs rendez-vous par WhatsApp et cahiers : oublis, no-shows, aucune historique client, aucune relance. Avant d'investir dans le produit, il fallait vérifier que les 7 fonctions de la V1 sont réellement faisables à moyens constants.",
    problem:
      "Dérisquer le produit avant de le construire : verdict de faisabilité fonction par fonction, points de fragilité identifiés, stack retenue justifiée, et chaîne de notifications prouvée de bout en bout — le point technique le plus incertain du MVP.",
    approach:
      "Dossier d'étude technique complet : ETUDE_FAISABILITE.md (verdict sur les 7 fonctions V1, dérisquage), ARCHITECTURE.md (stack, surfaces, modèle de données, auth, notifications in-app, séquencement). Stack retenue : Flutter pour l'app mobile professionnelle (agenda, push FCM, offline, géoloc) + Next.js fullstack (API REST consommée par Flutter et front-office web SSR : découverte, fiches pros, réservation). POC_NOTIFICATIONS.md : preuve de bout en bout device FCM → réservation → push + centre de notifications in-app.",
    results:
      "Socle prêt à construire : faisabilité tranchée, architecture documentée, notifications prouvées en POC de bout en bout.",
    repoUrl: "https://github.com/ahetansaid/tempo_mobile",
    sortOrder: 115,
    isPublished: true,
    technologySlugs: ["flutter", "nextjs", "typescript"],
  },
  {
    slug: "afrimentor",
    name: "AfriMentor",
    tagline:
      "Préserver, connecter et propulser le patrimoine intellectuel des pionniers d'Afrique — prototype Next.js/Supabase.",
    discoveryContext:
      "Le patrimoine intellectuel des pionniers d'Afrique (chercheurs, penseurs, bâtisseurs) est dispersé, mal indexé et peu transmis. Un prototype HTML statique existait ; il fallait le transformer en produit réaliste pour valider la proposition de valeur.",
    problem:
      "Reconstruire le prototype en application Next.js réaliste, testable et déployable sur Vercel : vitrine éditoriale des pionniers, connexion avec les nouvelles générations, authentification et stockage, sans dépendre d'un backend auto-hébergé.",
    approach:
      "Next.js 16 (App Router) + TypeScript, Tailwind CSS v4 en design system éditorial-patrimonial (Fraunces pour les titres, Inter Tight pour le corps), Framer Motion (révélations au scroll, hero carousel), next/image avec repli SVG généré. Backend Supabase : Postgres, Auth par lien magique, Storage. Tests Vitest ; l'application démarre et reste démontrable sans clés Supabase.",
    results:
      "Prototype déployable sur Vercel + Supabase Cloud, testé, avec mode dégradé sans backend — utilisable en démonstration immédiate.",
    repoUrl: "https://github.com/ahetansaid/AfriMentor_prototype",
    sortOrder: 120,
    isPublished: true,
    technologySlugs: ["nextjs", "typescript", "react", "tailwindcss", "supabase", "postgresql"],
  },
];

async function main() {
  console.log("→ Upsert technologies…");
  for (const t of TECHNOLOGIES) {
    await prisma.technology.upsert({
      where: { slug: t.slug },
      create: t,
      update: { name: t.name, category: t.category, sortOrder: t.sortOrder },
    });
  }
  const techs = await prisma.technology.findMany();
  const techBySlug = new Map(techs.map((t) => [t.slug, t.id]));

  console.log("→ Upsert projets GitHub…");
  for (const p of PROJECTS) {
    const techIds = p.technologySlugs
      .map((s) => techBySlug.get(s))
      .filter((id): id is number => typeof id === "number");
    if (techIds.length !== p.technologySlugs.length) {
      const missing = p.technologySlugs.filter((s) => !techBySlug.has(s));
      throw new Error(`Technologies manquantes pour ${p.slug}: ${missing.join(", ")}`);
    }

    const existing = await prisma.project.findUnique({ where: { slug: p.slug } });
    const data = {
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
      technologies: { create: techIds.map((id) => ({ technologyId: id })) },
    };

    if (existing) {
      await prisma.projectTechnology.deleteMany({ where: { projectId: existing.id } });
      await prisma.project.update({ where: { id: existing.id }, data });
      console.log(`  ↻ ${p.slug}`);
    } else {
      await prisma.project.create({ data: { slug: p.slug, ...data } });
      console.log(`  + ${p.slug}`);
    }
  }

  const total = await prisma.project.count();
  console.log(`✓ Terminé — ${PROJECTS.length} projets upsertés, ${total} au total en base.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
