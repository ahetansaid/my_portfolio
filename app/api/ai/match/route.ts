import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import OpenAI from "openai";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const jobOffer: string = (body.jobOffer ?? "").toString().trim();

  if (!jobOffer || jobOffer.length < 30) {
    return NextResponse.json(
      { error: "Collez une offre d'emploi complète (30 caractères minimum)." },
      { status: 400 }
    );
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OpenAI API key manquante côté serveur." },
      { status: 500 }
    );
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  // Fetch portfolio data to build candidate context
  const [projects, skills, stats, services] = await Promise.all([
    prisma.project.findMany({
      where: { isPublished: true },
      include: { technologies: { include: { technology: true } } },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.skillCategory.findMany({ include: { items: true }, orderBy: { sortOrder: "asc" } }),
    prisma.siteStats.findFirst({ orderBy: { id: "asc" } }),
    prisma.service.findMany({ where: { isPublished: true }, orderBy: { sortOrder: "asc" } }),
  ]);

  const candidateProfile = {
    name: "Mohamed Saïd AHETAN",
    role: "Intégrateur Systèmes & Développeur Full-Stack",
    stats: stats
      ? {
          projetsLivres: stats.projectsShipped,
          anneesExperience: stats.yearsExperience,
          domainesMaitrises: stats.domainsCovered,
          clientsServis: stats.clientsServed,
        }
      : null,
    competences: skills.map((c) => ({
      categorie: c.name,
      items: c.items.map((i) => i.name),
    })),
    projets: projects.map((p) => ({
      nom: p.name,
      probleme: p.problem ?? "",
      solution: p.solution ?? "",
      resultats: p.results ?? "",
      stack: p.technologies.map((t) => t.technology.name),
    })),
    services: services.map((s) => ({ titre: s.title, description: s.description })),
  };

  const systemPrompt = `Tu es un assistant de recrutement expert. Analyse une offre d'emploi face au profil d'un candidat et réponds UNIQUEMENT en JSON valide strict :

{
  "score": number (0-100),
  "verdict": "excellent_match" | "good_match" | "partial_match" | "weak_match",
  "summary": "2-3 phrases de résumé en français",
  "strengths": ["force 1", "force 2", "force 3"],
  "gaps": ["gap 1", "gap 2"],
  "topProjects": ["nom projet 1", "nom projet 2"],
  "pitchMessage": "message personnalisé en français de 3-5 phrases à envoyer au recruteur"
}

Base ton analyse UNIQUEMENT sur les informations du profil fournies. Sois honnête et précis.`;

  const userPrompt = `OFFRE D'EMPLOI :
${jobOffer}

PROFIL CANDIDAT :
${JSON.stringify(candidateProfile, null, 2)}

Analyse cette offre face au profil et renvoie le JSON strict demandé.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const content = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(content);
    return NextResponse.json(parsed);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Erreur inconnue";
    return NextResponse.json({ error: `Erreur OpenAI : ${msg}` }, { status: 500 });
  }
}
