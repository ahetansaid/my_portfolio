import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Profil de référence injecté dans les prompts d'extraction/scoring.
// Seule source de vérité du scoring — éditable ensuite dans /admin/radar (réglages).
const PROFILE_TEXT = `
PROFIL — Mohamed Saïd AHETAN (Cotonou, Bénin)
Développeur Full Stack & Intégrateur Système Informatique, fondateur de DrwinTech.
Stack : TypeScript, React, Next.js, Vue, Node.js, Express, Laravel, Python, PHP, C++, SQL.
BDD/DevOps : MySQL, MariaDB, PostgreSQL, Supabase, Prisma, Drizzle, Docker, Git, CI/CD, Linux.
Paiements/intégrations : FedaPay, Mobile Money (MTN/Moov/Orange), Africa's Talking (SMS OTP), API REST, webhooks.
IA & données : Anthropic Claude API, OpenAI, RAG, PowerBI.
Réalisation phare : Afri-Members (SaaS cotisations + Mobile Money + conformité IA).
Éligibilité : ressortissant du Bénin (éligible bourses ciblant l'Afrique de l'Ouest / pays en développement, ex. IsDB).
Langue : anglais niveau A1 en progression (objectif B2/C1 ; IELTS visé). Français natif.

OBJECTIF STRATÉGIQUE (feuille de route 2026-2033) :
Devenir expert en Smart Ports & ingénieur en systèmes de gestion de données portuaires + IA maritime.
Rôles cibles : (A) Port Data Systems Engineer/Architect, (B) Port AI/Data Scientist,
(C) Smart Port Consultant, (D) Founder/CTO Smart Port SaaS Africa.
Compétences à construire : Java Spring Boot, Kafka, Kubernetes, ElasticSearch ; ML/DL (PyTorch),
Computer Vision (YOLO), MLOps, Digital Twin ; cloud AWS/Azure/GCP ; métier portuaire (TOS Navis/Kaleris,
EDI EDIFACT, PCS, Code ISPS, IMO/IAPH/UNCTAD, Green Ports).
Cibles études : WMU Malmö (bourse IsDB), Rotterdam MEL, Erasmus Mundus CoMEM+/MIR, NUS Singapour.
Cibles employeurs : PAC Cotonou, AGL, DP World, APM, Port of Rotterdam, Antwerp-Bruges, PSA, MPA Singapore,
IBM/Accenture Maritime, Kaleris, startups (Portchain/Portcast/Sedna).
Institutions/réseau : IMO, IAPH, PMAWCA, UNCTAD, WCO, IGF/ICANN (gouvernance internet).

PRINCIPES DE SCORING :
- Priorité absolue à ce qui sert la trajectoire Smart Ports / maritime / data-IA logistique.
- L'anglais requis n'exclut pas : signaler l'exigence, ajuster la faisabilité selon le niveau courant et l'échéance.
- Vérifier l'éligibilité Bénin ; écarter uniquement si clairement inéligible.
- Valoriser financement (bourse 100%), prestige/réseau (WMU, Erasmus Mundus, Rotterdam), et timing atteignable.
`.trim();

const WEIGHTS = {
  smartPortsAlignment: 40,
  eligibility: 15,
  languageFeasibility: 15,
  timing: 15,
  strategicValue: 15,
};

async function main() {
  const profile = await prisma.radarProfile.upsert({
    where: { id: 1 },
    update: { profileText: PROFILE_TEXT, weights: WEIGHTS },
    create: {
      id: 1,
      profileText: PROFILE_TEXT,
      englishLevel: "A1",
      weights: WEIGHTS,
      fitThreshold: 70,
      digestDay: 1,
    },
  });
  console.log("✓ RadarProfile seedé (id", profile.id, ") — seuil alerte:", profile.fitThreshold, "· anglais:", profile.englishLevel);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
