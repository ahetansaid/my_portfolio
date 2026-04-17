import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { AboutClient } from "@/components/about/AboutClient";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Mohamed Saïd AHETAN — Développeur Full Stack & Intégrateur Système. Parcours, formations, compétences, centres d'intérêt. Basé à Cotonou, Bénin.",
};

export const revalidate = 60;

async function getData() {
  try {
    const [timeline, values] = await Promise.all([
      prisma.timelineItem.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "asc" }] }),
      prisma.aboutValue.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "asc" }] }),
    ]);
    return { timeline, values };
  } catch {
    return { timeline: [], values: [] };
  }
}

export default async function AboutPage() {
  const { timeline, values } = await getData();

  return (
    <AboutClient
      timeline={timeline.map((t) => ({
        id: t.id,
        year: t.year,
        title: t.title,
        description: t.description,
      }))}
      values={values.map((v) => ({ id: v.id, title: v.title, description: v.description }))}
    />
  );
}
