export type Technology = {
  id: number;
  name: string;
  slug: string;
  category?: "development" | "systems" | "methodologies";
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
  technologies: Technology[];
};
