# Career Radar — Spécification technique

> Module interne du back-office portfolio. Radar d'opportunités ciblé, scoré par IA,
> aligné sur la feuille de route Smart Ports 2026-2033 de Mohamed Saïd AHETAN.
>
> **Statut :** spec v1 — à valider avant développement.
> **Décidé :** 2 flux (Smart Ports + Général) · module dans l'admin existant · notification email par opportunité.

---

## 1. Vision & principes

**Objectif.** Recevoir automatiquement, et sans effort de veille manuelle, les opportunités
mondiales (bourses, conférences, formations, bénévolat, emplois, stages, appels) qui servent
la trajectoire Smart Ports — chacune extraite, **scorée**, dédupliquée, avec deadline et action
recommandée, et **notifiée par email**.

**Principe directeur : radar ciblé, pas firehose.** La feuille de route identifie la dispersion
comme le risque n°1 (« décliner les distractions pour rester focalisé »). Le système doit donc
**réduire le bruit**, pas l'amplifier. Toute fonctionnalité qui augmente le volume sans augmenter
la pertinence est un anti-objectif.

**Deux flux séparés :**
- **Flux A — Smart Ports (prioritaire).** Maritime, portuaire, data/IA appliquée à la logistique,
  gouvernance internet. Scoring complet, pondéré roadmap. C'est le flux qui déclenche les alertes.
- **Flux B — Général (secondaire).** Opportunités tech/dev/bourses génériques compatibles avec le
  profil, dans un onglet distinct. Scoring allégé, **digest** seulement (pas d'alerte unitaire par
  défaut), pour ne rien rater sans polluer le focus principal.

**Double dividende.** Le système est lui-même un projet « Rôle D » de la roadmap (Founder/CTO SaaS)
et pourra devenir un case study du portfolio.

---

## 2. Périmètre

### Inclus (MVP)
- Ingestion de 10-15 sources curées (API + RSS prioritaires, quelques scrapers ciblés).
- Extraction IA des champs structurés + scoring de fit 0-100 contre profil + roadmap.
- Dédup, filtres éligibilité, seuil de pertinence.
- **Notification email par opportunité** au-dessus d'un seuil (Flux A) + digest hebdo (Flux B & reste).
- Dashboard admin : feed filtrable, détail, gestion des sources, réglages.
- Tracker de candidatures (Kanban) branché sur les indicateurs mensuels de la roadmap.

### Différé (post-MVP)
- Crawling « mondial » généralisé, recherche via SerpAPI/Bing.
- Canaux WhatsApp / Telegram (réutiliser le WhatsApp CRM DrwinTech plus tard).
- Sync Google Calendar des deadlines.
- Ranking ML maison / embeddings pgvector (matching sémantique avancé).
- Multi-utilisateur.

---

## 3. Architecture

Module intégré au portfolio Next.js existant (réutilise auth JWT, Prisma, Neon Postgres).

```
Sources (API / RSS / scrape)
        │  (cron: ingestion planifiée)
        ▼
[1] Collecteur ─ normalise chaque item brut → OpportunityRaw
        ▼
[2] Extracteur IA ─ champs structurés (deadline, éligibilité, langue, financement, lieu)
        ▼
[3] Dédup + filtres ─ clé unique, éligibilité Bénin, deadline valide, seuil
        ▼
[4] Scoreur IA ─ fit 0-100 + raisons + why-now + action, par flux
        ▼
[5] Persistance (Postgres) ─ Opportunity
        ▼
[6] Notifieur ─ email instantané si fit ≥ seuil (Flux A) ; sinon file digest
        ▼
[7] UI admin ─ feed, détail, tracker, sources, réglages
```

**Découpage code (proposé) :**
```
app/admin/radar/            → pages UI (feed, tracker, sources, settings)
app/api/radar/ingest/       → route POST protégée (déclenchée par cron)
app/api/radar/opportunities → CRUD / actions (save, dismiss, score, track)
app/api/radar/notify/       → envoi email (interne)
lib/radar/sources/          → 1 adaptateur par type (rss.ts, reliefweb.ts, scrape-*.ts)
lib/radar/extract.ts        → extraction IA (structured output)
lib/radar/score.ts          → scoring IA + rubrique
lib/radar/dedup.ts          → clé de dédup + filtres
lib/radar/notify.ts         → Resend (email)
lib/radar/profile.ts        → profil compilé + poids roadmap (source de vérité du scoring)
```

---

## 4. Modèle de données (Prisma / Postgres)

```prisma
enum OppStream    { smart_ports  general }
enum OppCategory  { scholarship  fellowship  job  internship  conference  training  volunteering  grant  call }
enum SourceType   { rss  api  scrape  manual }
enum OppStatus    { new  reviewed  saved  dismissed }
enum AppStage     { spotted  considering  preparing  submitted  interview  accepted  rejected  withdrawn }

model OpportunitySource {
  id           Int          @id @default(autoincrement())
  name         String
  type         SourceType
  url          String
  category     OppCategory?
  stream       OppStream    @default(general)
  config       Json?        // { rssUrl, apiParams, selectors, ... }
  isActive     Boolean      @default(true)
  lastFetchedAt DateTime?
  lastStatus   String?      // ok | error | empty  + message
  createdAt    DateTime     @default(now())
  opportunities Opportunity[]
  @@map("opp_sources")
}

model Opportunity {
  id           Int          @id @default(autoincrement())
  sourceId     Int
  source       OpportunitySource @relation(fields: [sourceId], references: [id], onDelete: Cascade)
  externalId   String       // id/hash source pour dédup
  url          String
  title        String
  org          String?
  category     OppCategory
  stream       OppStream
  rawText      String?      @db.Text
  summary      String?      @db.Text     // résumé IA court
  location     String?
  country      String?
  isRemote     Boolean      @default(false)
  languageReq  String?      // ex: "English IELTS 6.5"
  fundingInfo  String?      // ex: "100% + 1000€/mois"
  eligibility  String?      // synthèse éligibilité
  deadline     DateTime?
  postedAt     DateTime?
  tags         Json?
  fitScore     Int?         // 0-100
  fitReasons   Json?        // { forces:[], attention:[] }
  whyNow       String?
  recommendedAction String?
  status       OppStatus    @default(new)
  notifiedAt   DateTime?    // email envoyé ?
  scoredAt     DateTime?
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt
  track        ApplicationTrack?
  @@unique([sourceId, externalId])
  @@index([stream, fitScore])
  @@index([deadline])
  @@map("opportunities")
}

model ApplicationTrack {
  id             Int         @id @default(autoincrement())
  opportunityId  Int         @unique
  opportunity    Opportunity @relation(fields: [opportunityId], references: [id], onDelete: Cascade)
  stage          AppStage    @default(spotted)
  notes          String?     @db.Text
  nextActionDate DateTime?
  submittedAt    DateTime?
  outcome        String?
  createdAt      DateTime    @default(now())
  updatedAt      DateTime    @updatedAt
  @@map("opp_application_tracks")
}

model RadarProfile {          // source de vérité du scoring — éditable dans les réglages
  id            Int      @id @default(1)
  profileText   String   @db.Text   // profil compilé (CV + roadmap) injecté au prompt
  englishLevel  String   @default("A1")   // évolue → ajuste le gating anglais
  weights       Json     // poids rubrique (voir §6)
  fitThreshold  Int      @default(70)      // seuil d'alerte email (Flux A)
  digestDay     Int      @default(1)       // jour d'envoi du digest (1 = lundi)
  updatedAt     DateTime @updatedAt
  @@map("radar_profile")
}

model DigestRun {
  id        Int      @id @default(autoincrement())
  runAt     DateTime @default(now())
  kind      String   // "instant" | "weekly"
  itemCount Int
  status    String
  @@map("radar_digest_runs")
}
```

---

## 5. Ingestion — catalogue de sources (MVP)

Priorité **API > RSS > scrape**. Les scrapers sont fragiles (ToS, changement de DOM) : à limiter
et monitorer (`lastStatus`). Chaque source déclare son `stream` et sa `category`.

### Flux A — Smart Ports
| Source | Type | Catégorie |
|---|---|---|
| ReliefWeb API (jobs/training, filtres maritime/logistics) | api | job/training |
| UNjobs (RSS par mot-clé: port, maritime, logistics) | rss | job |
| Erasmus Mundus catalogue (bourses maritimes/ports) | scrape léger | scholarship |
| IsDB Scholarships | scrape léger | scholarship |
| IAPH / TOC / Smart Ports Summit (events) | rss/scrape | conference |
| Africa Ports & Harbours Show | scrape léger | conference |
| AGL / DP World / APM Terminals / Kaleris (careers) | scrape/rss | job |
| IGF / ICANN / ISOC (appels, bénévolat gouvernance) | rss | volunteering/call |

### Flux B — Général
| Source | Type | Catégorie |
|---|---|---|
| DAAD / Chevening / Holland Scholarship (bourses) | rss/scrape | scholarship |
| ReliefWeb / UNjobs (tech/data, hors maritime) | api/rss | job |
| Coursera / AWS / edX (formations/certifs) | rss/api | training |
| Opportunités dev/tech (RemoteOK, WeWorkRemotely RSS) | rss | job |

> La liste exacte + faisabilité technique de chaque source sera figée en **phase 0** (voir §10).

**Normalisation.** Chaque adaptateur renvoie un objet commun `{ externalId, url, title, org?, rawText,
postedAt?, category, stream }`. Le reste est rempli par l'extracteur IA.

---

## 6. Extraction & scoring IA

Modèles déjà câblés dans le repo (OpenAI) ; Claude possible. **Extraction** avec un modèle
économique (gpt-4o-mini / Claude Haiku) ; **scoring** idem, escalade seulement sur cas limites.

**Étape extraction** → *structured output* :
```json
{
  "summary": "…", "org": "…", "location": "…", "country": "…", "isRemote": false,
  "deadline": "2028-01-15", "languageReq": "English IELTS 6.5",
  "fundingInfo": "100% + 1000€/mois", "eligibility": "Bachelor + exp. maritime, Bénin éligible",
  "tags": ["scholarship","erasmus","ports"]
}
```

**Étape scoring** → rubrique pondérée (poids éditables dans `RadarProfile.weights`) :

| Critère | Poids (Flux A) | Note |
|---|---|---|
| Alignement Smart Ports / maritime / data-IA | 40 | cœur de cible |
| Éligibilité (Bénin, diplôme, expérience) | 15 | **gate** : si inéligible → écarté |
| Faisabilité linguistique | 15 | anglais requis vs niveau courant (`englishLevel`) et date cible — **flag, pas exclusion** |
| Timing / deadline & phase-roadmap | 15 | deadline atteignable ? cohérente avec l'année-jalon ? |
| Valeur stratégique (réseau, prestige, financement) | 15 | IsDB-WMU, Erasmus Mundus, Rotterdam MEL = top |

Flux B : rubrique allégée (profil dev/tech + éligibilité + financement), sans pondération maritime.

**Gating anglais (important).** Le niveau actuel est A1 et progresse dans le temps. Une opportunité
exigeant l'anglais **n'est pas exclue** : elle est signalée (« anglais requis : IELTS 6.5 ») et son
score de faisabilité linguistique s'ajuste selon `englishLevel` et l'échéance. Quand le niveau
monte, il suffit d'éditer `RadarProfile.englishLevel` pour re-pondérer.

**Sortie de scoring :** `fitScore`, `fitReasons {forces, attention}`, `whyNow`, `recommendedAction`.

Le **profil de référence** (`RadarProfile.profileText`) est compilé depuis le CV + la roadmap
(rôles cibles, stack, contraintes, phases). C'est le seul endroit à éditer pour recalibrer tout le
scoring.

---

## 7. Anti-bruit

- **Dédup** : `@@unique([sourceId, externalId])` + hash titre+org pour cross-source.
- **Filtre éligibilité** : `eligibility` inéligible (ex : réservé UE, diplôme absent) → `dismissed` auto.
- **Deadline** : passée → non notifiée, archivée.
- **Seuil** : sous `fitThreshold`, pas d'alerte (reste consultable dans le feed / digest).
- **Cap notification** : max N alertes/jour (anti-rafale) ; au-delà → regroupées en un email.

---

## 8. Notifications & livraison

**Exigence : email à chaque opportunité pertinente.** Implémentée avec garde-fou anti-spam.

- **Alerte instantanée (Flux A)** : dès qu'une opportunité passe `fitScore ≥ fitThreshold`
  (défaut 70), un email est envoyé (titre, org, score, deadline, why-now, action, lien vers le
  détail admin). `notifiedAt` évite les doublons. Cap journalier → regroupement si rafale.
- **Digest hebdomadaire** : lundi (configurable), récap Flux A sous le seuil + Flux B + deadlines
  imminentes à surveiller.
- **Deadlines** : rappel email à J-14 et J-3 pour toute opportunité `saved` ou en tracker avec
  deadline.

**Fournisseur email : Resend** (recommandé — compatible serverless/Vercel, free tier, DX simple).
Alternative : SMTP Gmail via Nodemailer. À ajouter : `RESEND_API_KEY` + email destinataire dans `.env`.

**Dashboard admin (`/admin/radar`) :**
- **Feed** : onglets Flux A / Flux B, filtres (catégorie, score min, deadline, pays, remote),
  tri par fit ou urgence. Actions : sauvegarder, écarter, ajouter au tracker.
- **Détail** : texte complet, champs extraits, raisons de score, lien source.
- **Tracker (Kanban)** : colonnes = `AppStage`. Alimente les indicateurs roadmap (candidatures en
  cours, soumises).
- **Sources** : CRUD, activer/désactiver, voir `lastStatus`, relancer.
- **Réglages** : profil de scoring, poids, `englishLevel`, seuil d'alerte, jour de digest.

---

## 9. Planification (cron)

Next serverless → pas de process long. Options pour déclencher `POST /api/radar/ingest` (protégé
par secret) :
1. **Cron externe** (cron-job.org gratuit, ou GitHub Actions schedule) qui ping la route — simple,
   portable, recommandé pour le MVP.
2. **Vercel Cron** si déploiement Vercel.
3. `/schedule` de Claude Code pour un run assisté.

Cadence proposée : ingestion **toutes les 6 h** ; digest **hebdo** (route dédiée `?kind=weekly`).

---

## 10. Roadmap de développement (MVP ~1-2 semaines)

**Phase 0 — Cadrage sources (0,5 j)**
- Figer la liste des sources + tester l'accès (API/RSS/scrape) et la faisabilité de chacune.

**Phase 1 — Fondations (1-2 j)**
- Migration Prisma (modèles §4), seed `RadarProfile` (profil compilé CV+roadmap, poids, seuil).
- Squelette `/admin/radar` + entrée sidebar admin.

**Phase 2 — Ingestion + IA (2-3 j)**
- 3-4 adaptateurs prioritaires (ReliefWeb API, 1-2 RSS, 1 scraper).
- `extract.ts` + `score.ts` (structured output) + `dedup.ts`.
- Route `POST /api/radar/ingest` bout-en-bout.

**Phase 3 — Notifications (1 j)**
- Intégration Resend, template email alerte + digest, `notifiedAt`, cap anti-rafale.

**Phase 4 — UI (2-3 j)**
- Feed filtrable (2 flux), détail, tracker Kanban, gestion sources, réglages.

**Phase 5 — Automatisation + réglage (0,5-1 j)**
- Cron externe branché, calibrage du seuil et des poids sur données réelles.

**Reste (post-MVP) :** sources additionnelles, WhatsApp/Telegram, Google Calendar, pgvector.

---

## 11. Risques & parades

| Risque | Parade |
|---|---|
| Scrapers cassent (DOM/ToS) | Prioriser API/RSS ; `lastStatus` + alerte source en erreur ; scrapers isolés |
| Bruit / trop d'emails | Seuil de fit, cap journalier, digest pour le reste, 2 flux séparés |
| Coût IA | Modèle économique en extraction ; bat+ cache ; ~centimes/jour à 100 items |
| Faux négatifs (bonne opp mal scorée) | Feed complet consultable même sous le seuil ; calibrage itératif |
| Le radar devient une distraction | Design volontairement minimal et focalisé ; Flux B silencieux par défaut |
| Éligibilité mal jugée par l'IA | Gate conservateur ; opps « incertaines » marquées à revoir, pas auto-écartées |

---

## 12. Indicateurs (branchés sur la roadmap)

Le tracker alimente directement le tableau de bord mensuel de la feuille de route :
nouveaux contacts/opportunités ciblés, candidatures en cours, bourses/stages soumis, deadlines
respectées. Objectif : que le radar **produise** les indicateurs, au lieu de les tenir à la main.

---

## 13. Dépendances & coûts

- **Nouveau** : compte Resend (email) + `RESEND_API_KEY` ; parseur RSS (`rss-parser`) ; scraper
  (`cheerio`) ; cron externe (gratuit).
- **Réutilisé** : Next.js, Prisma, Neon Postgres, OpenAI/Claude, auth JWT admin.
- **Coût mensuel estimé** : ~0 € infra (free tiers) + quelques centimes à ~1-2 € d'API IA selon
  volume.

---

## 14. Décisions ouvertes (à trancher avant/pendant Phase 0)

1. **Fournisseur email** : Resend (recommandé) ou SMTP Gmail ?
2. **Où tourne le cron** : cron-job.org, GitHub Actions, ou Vercel Cron (selon cible de déploiement) ?
3. **Seuil d'alerte initial** : 70/100 par défaut — à ajuster après calibrage réel.
4. **Liste finale des sources** Flux A / Flux B (figée en Phase 0).
5. **Modèle IA** : OpenAI (déjà en place) ou bascule Claude pour extraction/scoring ?
