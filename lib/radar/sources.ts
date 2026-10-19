import type { SourceType } from "@prisma/client";

// Registre des sources RÉELLES interrogées par le radar.
// Endpoints publics sans clé, testés le 2026-10-19.
// Le flux (smart_ports / general) de chaque opportunité est décidé par le
// scoring IA, pas figé par la source.
// Note Phase 0 : ReliefWeb API (v2) exige un appname approuvé
// (https://apidoc.reliefweb.int/parameters#appname) — à demander pour ajouter
// les offres jobs/training maritime. UNjobs et IGF n'exposent pas de RSS public ;
// IAPH bloque les clients non-navigateur (403 TLS).
export type RadarSource = {
  name: string;
  type: SourceType; // "rss" pour l'instant
  url: string;
};

export const SOURCES: RadarSource[] = [
  // Flux B — général
  {
    name: "OpportunityDesk",
    type: "rss",
    url: "https://opportunitydesk.org/feed/",
  },
  {
    name: "WeWorkRemotely",
    type: "rss",
    url: "https://weworkremotely.com/remote-jobs.rss",
  },
  // Flux A — Smart Ports / maritime / gouvernance internet
  {
    name: "gCaptain Maritime",
    type: "rss",
    url: "https://gcaptain.com/feed/",
  },
  {
    name: "Internet Society",
    type: "rss",
    url: "https://www.internetsociety.org/feed/",
  },
];
