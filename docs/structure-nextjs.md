# Structure Next.js — Portfolio

## Arborescence des dossiers

```
my_portfolio/
├── app/
│   ├── layout.tsx                 # Layout racine (html, body, metadata)
│   ├── globals.css                # Styles globaux + variables CSS
│   ├── (site)/                    # Groupe de routes : site public (Nav + Footer)
│   │   ├── layout.tsx             # Nav + main + Footer
│   │   ├── page.tsx               # / — Accueil
│   │   ├── about/
│   │   │   └── page.tsx           # /about
│   │   ├── projects/
│   │   │   └── page.tsx           # /projects — liste + filtre + détail onglets
│   │   ├── skills/
│   │   │   └── page.tsx           # /skills
│   │   └── contact/
│   │       └── page.tsx           # /contact
│   └── admin/                     # Backoffice (sans Nav/Footer du site)
│       ├── layout.tsx             # En-tête admin + liens Projets / Technologies
│       ├── page.tsx               # /admin — tableau de bord
│       ├── projects/
│       │   └── page.tsx           # /admin/projects — CRUD à venir
│       └── technologies/
│           └── page.tsx           # /admin/technologies — CRUD à venir
├── components/
│   ├── layout/
│   │   ├── Nav.tsx                # Navigation principale + menu mobile
│   │   └── Footer.tsx             # Pied de page
│   └── projects/
│       ├── ProjectCard.tsx        # Carte projet (clic = sélection)
│       ├── ProjectFilters.tsx     # Filtres par technologie (dynamiques)
│       ├── ProjectDetailTabs.tsx  # Onglets Contexte / Solution / Technos / Résultats
│       └── ProjectsSection.tsx    # Orchestration : filtres + grille + détail
├── lib/
│   ├── types.ts                   # Types Project, Technology
│   └── mock-data.ts               # Données de démo (à remplacer par API/MySQL)
├── docs/
│   ├── schema-mysql.md
│   ├── design-guide.md
│   └── structure-nextjs.md        # Ce fichier
├── SPEC.md
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

## Routes

| URL | Contenu |
|-----|--------|
| `/` | Accueil (nom, slogan, CTA) |
| `/about` | À propos |
| `/projects` | Projets : filtres par techno + cartes + détail en onglets sur la même page |
| `/skills` | Compétences (catégories) |
| `/contact` | Formulaire contact |
| `/admin` | Tableau de bord admin |
| `/admin/projects` | Gestion projets (CRUD à brancher) |
| `/admin/technologies` | Gestion technologies (CRUD à brancher) |

## Données

- **Actuellement :** `lib/mock-data.ts` (projets + technologies en dur).
- **À venir :** API routes Next.js + Prisma/MySQL pour charger projets et technologies, et CRUD dans l’admin.

## Design

- Variables CSS dans `app/globals.css` (couleurs, surfaces).
- Tailwind avec thème étendu dans `tailwind.config.ts` (polices, couleurs).
- Polices : Geist Sans + Geist Mono (package `geist`).

## Commandes

```bash
npm install
npm run dev    # http://localhost:3000
npm run build
npm run start
```
