import type { SourceType } from "@prisma/client";

// Registre des sources RÉELLES interrogées par le radar.
// Endpoints publics sans clé. Le flux (smart_ports / general) de chaque opportunité
// est décidé par le scoring IA, pas figé par la source.
export type RadarSource = {
  name: string;
  type: SourceType; // "rss" pour l'instant
  url: string;
};

export const SOURCES: RadarSource[] = [
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
];
