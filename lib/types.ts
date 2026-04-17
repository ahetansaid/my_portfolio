export type Technology = {
  id: number;
  name: string;
  slug: string;
  category?: "development" | "systems" | "methodologies";
};

export type ImpactMetric = {
  label: string;
  value: string;
};

export type Project = {
  id: number;
  slug: string;
  name: string;
  tagline?: string | null;
  problem: string;
  solution: string;
  results: string;
  imageUrl: string | null;
  demoUrl?: string | null;
  prodUrl?: string | null;
  isFeatured?: boolean;
  impactMetrics?: ImpactMetric[];
  technologies: Technology[];
};
