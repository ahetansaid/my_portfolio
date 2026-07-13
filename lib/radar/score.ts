import OpenAI from "openai";
import type { OppCategory, OppStream } from "@prisma/client";
import type { RawItem } from "./fetch";

const CATEGORIES: OppCategory[] = [
  "scholarship", "fellowship", "job", "internship",
  "conference", "training", "volunteering", "grant", "call",
];
const STREAMS: OppStream[] = ["smart_ports", "general"];

export type ScoredFields = {
  summary: string | null;
  org: string | null;
  location: string | null;
  country: string | null;
  isRemote: boolean;
  deadline: Date | null;
  languageReq: string | null;
  fundingInfo: string | null;
  eligibility: string | null;
  category: OppCategory;
  stream: OppStream;
  tags: string[];
  fitScore: number;
  fitReasons: { forces: string[]; attention: string[] };
  whyNow: string | null;
  recommendedAction: string | null;
};

export type RadarProfileLite = {
  profileText: string;
  englishLevel: string;
  weights: Record<string, number>;
};

function asEnum<T extends string>(val: unknown, allowed: T[], fallback: T): T {
  return typeof val === "string" && (allowed as string[]).includes(val) ? (val as T) : fallback;
}

function parseDeadline(val: unknown): Date | null {
  if (typeof val !== "string" || !val.trim()) return null;
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d;
}

/** Extraction + scoring d'une opportunité réelle contre le profil (1 appel OpenAI). */
export async function scoreItem(profile: RadarProfileLite, item: RawItem): Promise<ScoredFields> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const systemPrompt = `Tu es le moteur d'un radar d'opportunités personnel. À partir d'une opportunité (bourse, emploi, conférence, formation, bénévolat, appel...) et du profil d'une personne, tu EXTRAIS les champs structurés puis tu ATTRIBUES un score de pertinence.

Réponds UNIQUEMENT en JSON valide strict :
{
  "summary": "1-2 phrases FR neutres",
  "org": "organisation/émetteur ou null",
  "location": "ville/pays ou null",
  "country": "pays principal ou null",
  "isRemote": true|false,
  "deadline": "AAAA-MM-JJ ou null",
  "languageReq": "ex 'Anglais IELTS 6.5' ou null",
  "fundingInfo": "ex '100% + 1000€/mois' ou null",
  "eligibility": "synthèse courte de l'éligibilité ou null",
  "category": "scholarship|fellowship|job|internship|conference|training|volunteering|grant|call",
  "stream": "smart_ports|general",
  "tags": ["max 5 mots-clés"],
  "fitScore": 0-100,
  "fitReasons": { "forces": ["..."], "attention": ["..."] },
  "whyNow": "pourquoi c'est pertinent maintenant, ou null",
  "recommendedAction": "action concrète recommandée, ou null"
}

RÈGLES DE SCORING (barème total 100, poids fournis) :
- alignement Smart Ports / maritime / portuaire / logistique / data-IA appliquée : poids ${profile.weights.smartPortsAlignment ?? 40}
- éligibilité (Bénin/Afrique, diplôme, expérience) : poids ${profile.weights.eligibility ?? 15} — GATE : si clairement inéligible, fitScore <= 20
- faisabilité linguistique : poids ${profile.weights.languageFeasibility ?? 15} — l'anglais requis n'exclut PAS ; niveau actuel = ${profile.englishLevel} ; ajuster selon l'échéance
- timing / deadline atteignable : poids ${profile.weights.timing ?? 15}
- valeur stratégique (financement, prestige, réseau) : poids ${profile.weights.strategicValue ?? 15}

"stream" = "smart_ports" UNIQUEMENT si l'opportunité touche le maritime/portuaire/logistique ou l'IA/data appliquée à ce domaine ; sinon "general".
Sois honnête et strict : un score élevé doit être mérité.`;

  const userPrompt = `PROFIL :
${profile.profileText}

OPPORTUNITÉ :
Titre : ${item.title}
Source/émetteur : ${item.org ?? "?"}
URL : ${item.url}
Contenu : ${item.rawText || "(pas de description)"}

Extrais les champs et calcule le score. JSON strict uniquement.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.2,
  });

  const parsed = JSON.parse(completion.choices[0]?.message?.content ?? "{}");

  const rawScore = Number(parsed.fitScore);
  const fitScore = Number.isFinite(rawScore) ? Math.max(0, Math.min(100, Math.round(rawScore))) : 0;

  return {
    summary: parsed.summary ?? null,
    org: parsed.org ?? item.org ?? null,
    location: parsed.location ?? null,
    country: parsed.country ?? null,
    isRemote: Boolean(parsed.isRemote),
    deadline: parseDeadline(parsed.deadline),
    languageReq: parsed.languageReq ?? null,
    fundingInfo: parsed.fundingInfo ?? null,
    eligibility: parsed.eligibility ?? null,
    category: asEnum<OppCategory>(parsed.category, CATEGORIES, "call"),
    stream: asEnum<OppStream>(parsed.stream, STREAMS, "general"),
    tags: Array.isArray(parsed.tags) ? parsed.tags.slice(0, 5).map(String) : [],
    fitScore,
    fitReasons: {
      forces: Array.isArray(parsed.fitReasons?.forces) ? parsed.fitReasons.forces.map(String) : [],
      attention: Array.isArray(parsed.fitReasons?.attention) ? parsed.fitReasons.attention.map(String) : [],
    },
    whyNow: parsed.whyNow ?? null,
    recommendedAction: parsed.recommendedAction ?? null,
  };
}
