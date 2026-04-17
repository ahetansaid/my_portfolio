import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import OpenAI from "openai";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

async function buildSystemPrompt() {
  const [projects, skills, services, stats, availability] = await Promise.all([
    prisma.project.findMany({
      where: { isPublished: true },
      include: { technologies: { include: { technology: true } } },
      orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }],
    }),
    prisma.skillCategory.findMany({
      include: { items: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.service.findMany({ where: { isPublished: true }, orderBy: { sortOrder: "asc" } }),
    prisma.siteStats.findFirst({ orderBy: { id: "asc" } }),
    prisma.availabilityStatus.findFirst({ orderBy: { id: "asc" } }),
  ]);

  const profile = {
    name: "Mohamed Saïd AHETAN",
    role: "Intégrateur SI & Développeur Full-Stack",
    location: "Cotonou, Bénin",
    availability: availability
      ? {
          status: availability.status,
          message: availability.message,
          nextDate: availability.nextAvailableDate,
        }
      : null,
    stats: stats
      ? {
          projets_livres: stats.projectsShipped,
          annees_experience: stats.yearsExperience,
          domaines: stats.domainsCovered,
          clients: stats.clientsServed,
          en_construction: stats.currentlyBuilding,
        }
      : null,
    competences: skills.map((c) => ({
      categorie: c.name,
      items: c.items.map((i) => i.name),
    })),
    projets: projects.map((p) => ({
      nom: p.name,
      slug: p.slug,
      tagline: p.tagline,
      probleme: p.problem,
      solution: p.solution,
      resultats: p.results,
      stack: p.technologies.map((t) => t.technology.name),
      demo: p.demoUrl,
      prod: p.prodUrl,
    })),
    services: services.map((s) => ({
      titre: s.title,
      description: s.description,
      prix: s.priceRange,
      duree: s.duration,
      livrables: s.deliverables,
    })),
  };

  return `Tu es l'assistant IA personnel de Mohamed Saïd AHETAN sur son portfolio.

RÔLE :
- Réponds aux visiteurs (recruteurs, clients potentiels, collaborateurs) qui ont des questions sur Mohamed
- Sois concis, direct et professionnel. Pas de blabla marketing.
- Parle en français par défaut (sauf si la question est en anglais)
- Utilise "Mohamed" ou "il" — jamais "je" (tu n'es PAS Mohamed, tu es son assistant)

TON :
- Sérieux mais pas robotique
- Tutoiement par défaut
- Concret : cite des projets, chiffres, stack — pas de généralités creuses
- Si tu ne sais pas : dis-le clairement et propose de contacter Mohamed via /booking ou /contact

RÈGLES STRICTES :
- Ne donne jamais d'information que tu n'as pas dans le profil ci-dessous
- N'invente JAMAIS de projets, stack, compétences ou chiffres
- Si on te demande des données personnelles sensibles (âge, salaire, adresse précise, email, téléphone) → redirige vers /contact ou /booking
- Limite tes réponses à 3-4 phrases maximum (sauf si on demande explicitement plus de détails)
- Si la question est hors-sujet (cuisine, météo, politique…), refuse poliment et recentre sur Mohamed

APPELS À L'ACTION (à utiliser quand pertinent) :
- Pour une mission/projet → "Le plus simple : réserve 30 min via /booking"
- Pour les détails d'un projet spécifique → "Consulte /projects/[slug]"
- Pour des questions services/pricing → "Voir /services"
- Pour les recruteurs → "Utilise le matching IA sur /recruiter"

PROFIL COMPLET DE MOHAMED :
${JSON.stringify(profile, null, 2)}`;
}

export async function POST(request: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return new Response(
      JSON.stringify({ error: "OpenAI API key manquante côté serveur." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const body = await request.json();
  const messages: ChatMessage[] = Array.isArray(body.messages) ? body.messages : [];

  if (messages.length === 0) {
    return new Response(
      JSON.stringify({ error: "Messages requis." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const systemPrompt = await buildSystemPrompt();

  try {
    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.slice(-10).map((m) => ({ role: m.role, content: m.content })),
      ],
      temperature: 0.5,
      stream: true,
      max_tokens: 400,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Erreur inconnue";
    return new Response(
      JSON.stringify({ error: `Erreur OpenAI : ${msg}` }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
