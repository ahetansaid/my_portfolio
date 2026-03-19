import type { Project, Technology } from "./types";

export const mockTechnologies: Technology[] = [
  { id: 1, name: "Next.js", slug: "nextjs", category: "development" },
  { id: 2, name: "MySQL", slug: "mysql", category: "systems" },
  { id: 3, name: "ERP", slug: "erp", category: "systems" },
  { id: 4, name: "React", slug: "react", category: "development" },
  { id: 5, name: "DGMS", slug: "dgms", category: "systems" },
];

export const mockProjects: Project[] = [
  {
    id: 1,
    slug: "dgms",
    name: "DGMS — Gestion de flotte",
    problem: "Suivi des véhicules et des conducteurs en temps réel.",
    solution: "Solution centralisée avec cartographie et rapports.",
    results: "Réduction des coûts et meilleure visibilité opérationnelle.",
    imageUrl: null,
    technologies: [
      mockTechnologies[4],
      mockTechnologies[1],
      mockTechnologies[3],
    ],
  },
  {
    id: 2,
    slug: "erp-module",
    name: "Module ERP sur mesure",
    problem: "Adaptation du progiciel aux processus métier.",
    solution: "Développement de modules et interfaces d’intégration.",
    results: "Processus unifiés et gains de productivité.",
    imageUrl: null,
    technologies: [
      mockTechnologies[2],
      mockTechnologies[1],
    ],
  },
  {
    id: 3,
    slug: "portfolio",
    name: "Portfolio digital",
    problem: "Vitrine professionnelle et valorisation des projets.",
    solution: "Site Next.js avec backoffice et base MySQL.",
    results: "Présentation claire et mise à jour centralisée.",
    imageUrl: null,
    technologies: [
      mockTechnologies[0],
      mockTechnologies[1],
      mockTechnologies[3],
    ],
  },
];
