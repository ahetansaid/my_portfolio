import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Enrichit le projet DGMS avec les 4 phases Double Diamond
  await prisma.project.update({
    where: { slug: "dgms-gestion-flotte" },
    data: {
      tagline:
        "Plateforme de gestion de flotte GPS centralisée pour un opérateur africain — 40 véhicules, 3 régions, suivi temps réel.",
      discoveryContext:
        "L'opérateur utilisait trois outils séparés (Excel pour la maintenance, un portail GPS-Trace pour la localisation, WhatsApp pour la communication chauffeurs). Entretiens avec 5 gestionnaires de flotte sur 2 semaines : les mêmes données étaient saisies 3 fois, les rapports hebdomadaires prenaient une demi-journée chaque vendredi, et aucune alerte automatique n'existait sur les entretiens ratés. Contraintes clés identifiées : connexion 3G instable sur le terrain, budget limité, 4 langues locales parlées par les chauffeurs.",
      problem:
        "La flotte perdait environ 30% de ses coûts opérationnels à cause de la dispersion des outils : entretiens oubliés, chauffeurs non productifs non détectés, carburant mal tracé, rapports manuels qui arrivaient trop tard pour corriger les écarts.",
      approach:
        "Architecture monorepo Django REST + Next.js avec GPS-Trace Partner API comme source de vérité. Synchronisation toutes les 15 minutes en tâche Celery pour résister aux coupures réseau. Dashboard cartographique temps réel via Channels/WebSockets. Rôles RBAC pour séparer gestionnaires régionaux et direction. Export PDF/Excel généré à la volée. Choix de PostgreSQL pour les requêtes analytiques, Redis pour le cache des positions.",
      solution:
        "Déploiement d'une solution DGMS centralisée avec tableau de bord cartographique en temps réel, alertes automatiques et rapports d'activité paramétrables.",
      results:
        "Réduction de 30% des coûts opérationnels en 4 mois. Visibilité complète de la flotte en temps réel depuis un seul écran. Rapports hebdomadaires générés en un clic au lieu d'une demi-journée. Zéro entretien oublié depuis le déploiement grâce aux alertes automatiques.",
      impactMetrics: [
        { label: "Baisse coûts", value: "-30%" },
        { label: "Gain temps reporting", value: "4h/sem" },
        { label: "Véhicules suivis", value: "40+" },
        { label: "Entretiens oubliés", value: "0" },
      ],
      isFeatured: true,
    },
  });

  console.log("✓ Projet DGMS enrichi avec les 4 phases Double Diamond");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
