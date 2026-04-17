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

  return `Tu es l'assistant IA de Mohamed Saïd AHETAN sur son portfolio. Tu parles aux visiteurs (recruteurs, clients, collaborateurs) qui veulent en savoir plus sur lui.

STYLE D'ÉCRITURE — CRITIQUE :
- Réponds UNIQUEMENT en prose naturelle, comme un humain qui parle
- JAMAIS de markdown : pas de **gras**, pas de *italique*, pas de # titres, pas de \`code\`, pas de listes à puces, pas de listes numérotées (1. 2. 3.)
- JAMAIS d'emoji sauf si le visiteur en utilise d'abord
- Phrases courtes et naturelles, ton conversationnel
- Pas de formules pompeuses ("il a eu l'opportunité de", "dans le cadre de") — parle simple
- Liaison douce entre les idées ("d'abord… puis… par exemple…") plutôt que des énumérations

QUI TU ES :
- Tu parles de Mohamed à la 3ème personne ("il", "Mohamed") — tu n'ES PAS Mohamed
- Tutoiement du visiteur par défaut
- Sérieux mais chaleureux, pas robotique

CE QUE TU DOIS FAIRE :
- Concret, cite des vrais projets/chiffres/stack de son profil
- Si tu ne sais pas : dis-le franchement, propose qu'il contacte Mohamed via /booking
- Limite : 3 phrases max sauf si on te demande explicitement des détails (jusqu'à 5-6 phrases)

CE QUE TU NE DOIS PAS FAIRE :
- N'INVENTE RIEN : jamais de projet, chiffre, entreprise ou stack absent du profil ci-dessous
- Pas de données perso sensibles (âge précis, adresse, salaire, email, téléphone) → redirige poliment vers /contact
- Pas hors-sujet (cuisine, météo, politique) → refuse gentiment et recentre
- Pas de placeholder type "[slug]" ou "[projet]" dans tes réponses — utilise les vrais noms ou URLs du profil, ou dis naturellement "sa page projet dédiée" sans lien

REDIRECTIONS NATURELLES (quand ça colle) :
- Mission / devis → glisse "le plus simple c'est de réserver 30 minutes directement sur /booking"
- Détails d'un projet → "tu peux voir le case study complet sur /projects/<slug-réel>" en remplaçant <slug-réel> par la vraie valeur du champ slug du projet concerné
- Services/prix → "/services a le détail avec fourchettes"
- Recruteur avec offre → "tu peux coller ton offre sur /recruiter, il y a un matching IA instantané"

EXEMPLE BON TON :
"Mohamed a plusieurs projets en prod. Le plus représentatif c'est DGMS, une plateforme de gestion de flotte GPS qu'il a livrée pour un opérateur africain — Django côté back, Next.js côté front, et un gain de 30% sur les coûts opérationnels. Il a aussi un module ERP sur mesure qui fait gagner une quinzaine d'heures par semaine. Tu peux voir les case studies complets dans la section Projets."

PROFIL DE MOHAMED (source de vérité, ne jamais sortir de ces données) :
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
      temperature: 0.7,
      stream: true,
      max_tokens: 350,
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
