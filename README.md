# Portfolio — Mohamed Saïd AHETAN

Portfolio professionnel complet avec backoffice, IA intégrée, déploiement production.
Positionné comme **"systems builder"** pour l'Afrique francophone.

🌐 **Live** : [my-portfolio-guqn.vercel.app](https://my-portfolio-guqn.vercel.app/)
📧 **Contact** : saidahetan@gmail.com
💼 **LinkedIn** : [@mohamed-saïd-ahetan](https://linkedin.com/in/mohamed-saïd-ahetan)

---

## ✨ Features

### Site public
- **Hero animé** avec stack cards flottantes (rotation 3D)
- **Magic Chat** IA flottant — assistant GPT-4o-mini qui répond aux visiteurs sur le profil (streaming temps réel)
- **Page projets** éditoriale avec filtres pills animés + cards 3D tilt + métriques XL
- **Case study Double Diamond** — 4 phases (Discover → Define → Develop → Deliver) avec SVG animé
- **Services** avec section Process (4 étapes : Discovery, Cadrage, Build, Deploy)
- **Page recruteurs** avec matching IA instantané (colle une offre → score + verdict + pitch personnalisé)
- **À propos** éditorial avec timeline parcours, formations, certifications, langues, centres d'intérêt
- **Playground** — expérimentations et prototypes techniques
- **Booking** — demande de RDV 30 min avec formulaire complet
- **Témoignages** en carrousel auto-rotatif avec modération admin
- **Nav dark glass** avec sidebar slide droite + toggle animé
- **Typographie Syne** + palette Indigo / Coral / Lime électrique
- **Background vidéo rotatif** (3 clips Pexels) avec overlays marque
- **Responsive** progressif mobile → tablette → desktop

### Backoffice admin (protégé JWT)
- Dashboard avec stats
- CRUD complet : Projets · Playground · Technologies · Services · Témoignages · RDV · À propos · Compétences · Messages
- Paramètres : disponibilité live + chiffres clés + "currently building"
- Modération des témoignages publics
- Inbox des demandes de RDV avec statuts (pending / confirmed / cancelled / completed)

### IA intégrée
- **`/api/ai/match`** — matching offre d'emploi ↔ profil (score 0-100 + forces/gaps/pitch)
- **`/api/ai/chat`** — assistant conversationnel streamé avec accès DB live

---

## 🛠 Stack technique

| Couche | Technologie |
|---|---|
| **Framework** | Next.js 15 (App Router) + React 19 |
| **Langage** | TypeScript 5 |
| **Style** | Tailwind CSS 3 + CSS variables |
| **Animations** | Framer Motion 12 |
| **Polices** | Geist Sans (body) + Syne (display) via `next/font` |
| **Base de données** | PostgreSQL (Neon — serverless) |
| **ORM** | Prisma 5 |
| **Auth admin** | JWT via `jose` + middleware Next |
| **Password hashing** | bcryptjs |
| **IA** | OpenAI GPT-4o-mini (chat + matching) |
| **Hébergement** | Vercel (edge + serverless) |
| **CI/CD** | Auto-deploy GitHub → Vercel |

---

## 🏗 Architecture

```
my_portfolio/
├── app/
│   ├── (site)/              # Routes publiques
│   │   ├── page.tsx                # Home
│   │   ├── about/                  # À propos éditorial
│   │   ├── projects/               # Liste + /[slug] case study Double Diamond
│   │   ├── services/               # Services + Process
│   │   ├── recruiter/              # Espace recruteurs + IA match
│   │   ├── booking/                # Prise de RDV
│   │   ├── playground/             # Expérimentations
│   │   ├── contact/                # Formulaire contact
│   │   └── skills/                 # Compétences
│   │
│   ├── admin/               # Backoffice protégé
│   │   ├── layout.tsx              # Nav admin + auth
│   │   ├── login/
│   │   ├── projects/ technologies/ services/
│   │   ├── testimonials/ bookings/ about/
│   │   ├── skills/ messages/ playground/
│   │   └── settings/
│   │
│   ├── api/                 # Route handlers
│   │   ├── auth/                   # login / logout (JWT)
│   │   ├── ai/chat/                # Assistant IA streaming
│   │   ├── ai/match/               # Matching offre/profil
│   │   ├── projects/ technologies/ services/
│   │   ├── testimonials/ bookings/
│   │   ├── availability/ stats/
│   │   ├── playground/ skills/ about/
│   │   └── contact/ contact/messages/
│   │
│   ├── layout.tsx           # Root layout (fonts, metadata SEO)
│   ├── globals.css          # Palette + utilities
│   ├── sitemap.ts           # Sitemap dynamique
│   └── robots.ts            # Robots.txt
│
├── components/
│   ├── layout/              # Nav, Footer
│   ├── home/                # HomeHero, FeaturedProjects, etc.
│   ├── projects/            # ProjectCard, ProjectsSection, DoubleDiamondDiagram, ProjectDetailClient
│   ├── services/            # ServicesClient, ProcessSection
│   ├── recruiter/           # RecruiterClient
│   ├── about/               # AboutClient
│   ├── playground/          # PlaygroundClient
│   ├── booking/             # BookingForm
│   ├── admin/               # LogoutButton
│   └── ui/                  # MagicChat, VideoBackground, AvailabilityBanner, StatsGrid, CountUp, etc.
│
├── lib/
│   ├── db.ts                # Client Prisma singleton
│   ├── auth.ts              # Sign/verify JWT
│   ├── motion.ts            # Variants Framer Motion
│   └── types.ts             # Types partagés
│
├── prisma/
│   ├── schema.prisma        # Schema Postgres
│   ├── migrations/          # Migrations versionnées
│   └── seed.ts              # Données de démo
│
├── public/
│   └── videos/              # Background vidéos (Pexels)
│
├── middleware.ts            # Protection /admin via JWT
└── scripts/                 # Utilitaires (clean, seed)
```

---

## 🚀 Getting started (local)

### Prérequis

- Node.js 20+
- npm 10+
- Une base PostgreSQL (Neon recommandé — [neon.tech](https://neon.tech))
- Une clé API OpenAI (pour les features IA) — [platform.openai.com](https://platform.openai.com)

### 1. Cloner et installer

```bash
git clone https://github.com/ahetansaid/my_portfolio.git
cd my_portfolio
npm install
```

### 2. Configurer l'environnement

Copie `.env.example` vers `.env` :

```bash
cp .env.example .env
```

Remplis les variables :

```env
DATABASE_URL="postgresql://user:pwd@host/db?sslmode=require"
JWT_SECRET="<generate with: node -e \"console.log(require('crypto').randomBytes(32).toString('base64'))\">"
OPENAI_API_KEY="sk-proj-..."
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

### 3. Initialiser la base

```bash
npm run db:migrate    # crée les tables
npm run db:seed       # peuple avec des données démo
```

### 4. Lancer en dev

```bash
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

### 5. Accès admin

Va sur [/admin/login](http://localhost:3000/admin/login) avec les identifiants générés par le seed.

> ⚠️ **Sécurité prod** : change le password admin immédiatement en édition depuis `/admin` ou via `npx prisma studio` (édite la table `admin_users`, remplace `passwordHash` par un nouveau hash bcrypt).

---

## 🌐 Déploiement (Vercel + Neon)

### 1. Neon — Base PostgreSQL

- [console.neon.tech](https://console.neon.tech) → Sign up with GitHub
- **New project** → nom `portfolio`, region **Frankfurt** (UE proche Afrique)
- Copier la **connection string** fournie

### 2. Vercel

- [vercel.com](https://vercel.com) → Sign up with GitHub
- **Add New Project** → importer ce repo
- **Framework Preset** : Next.js (auto)
- **Environment Variables** :
  - `DATABASE_URL` — la connection Neon
  - `JWT_SECRET` — 32+ chars aléatoires
  - `OPENAI_API_KEY` — ta clé OpenAI
  - `NEXT_PUBLIC_BASE_URL` — ton URL Vercel
- **Deploy**

### 3. Migrations en prod

Les migrations Postgres sont jouées automatiquement par `npm run db:migrate` au 1er seed local (qui connecte à Neon). Vercel ne relance pas les migrations au deploy — elles sont déjà en base.

Pour les futures modifications de schema :

```bash
npx prisma migrate dev --name <nom_migration>
# commit le dossier prisma/migrations/
# push → Vercel redeploy
# Les nouvelles migrations doivent être appliquées manuellement sur Neon
# via `npx prisma migrate deploy` (en local avec DATABASE_URL = prod)
```

---

## 📜 Scripts npm

| Script | Description |
|---|---|
| `npm run dev` | Serveur dev Next.js |
| `npm run build` | Build production (Prisma generate + Next build) |
| `npm run start` | Serveur production local |
| `npm run lint` | Lint ESLint |
| `npm run db:seed` | Seeder la base avec données démo (tsx) |
| `npm run db:migrate` | Créer/appliquer une migration Prisma |
| `npm run db:studio` | Interface Prisma Studio (GUI base) |

---

## 🔐 Variables d'environnement

| Variable | Requis | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | Connection string PostgreSQL (Neon ou autre) |
| `JWT_SECRET` | ✅ | Secret de signature JWT (32+ chars aléatoires) |
| `OPENAI_API_KEY` | ✅ pour IA | Clé API OpenAI (sk-proj-...) — sans, `/api/ai/*` renverront 500 |
| `NEXT_PUBLIC_BASE_URL` | recommandé | URL canonique pour sitemap, OG, liens absolus |

---

## 🎨 Design system

### Palette

```
--color-accent        : 243 75% 58%   Indigo électrique (liens, nav, filtres)
--color-accent-warm   : 350 89% 60%   Coral vibrant (CTA principaux)
--color-electric      : 75 94% 56%    Acid lime (highlights, header actif)
--color-surface       : 240 20% 99%   Blanc cassé léger teint indigo
--color-surface-muted : 240 14% 95%   Gris très clair
--color-foreground    : 240 15% 9%    Noir chaud
--color-muted         : 240 6% 46%    Gris moyen
```

Dark mode : mêmes couleurs ajustées (voir `app/globals.css`).

### Typographie

- **Body** : Geist Sans (variable)
- **Display / Headings** : Syne (variable — 400 à 800)

### Composants UI clés

- `.btn-cta` — Gradient Indigo→Coral→Lime animé (CTA principaux)
- `.btn-primary` — Gradient Indigo→Coral (actions secondaires)
- `.btn-outline` — Bordure + hover subtle
- `.text-gradient` — Texte avec gradient animé (hero titles)
- `.bg-gradient-brand` — Background gradient signature

---

## 🧪 Tester les features IA

### Assistant conversationnel (Magic Chat)

1. Ouvre la home
2. Clique le bouton ✨ flottant bottom-right
3. Essaie : *"Quels sont les projets phares de Mohamed ?"*
4. L'IA répond en streaming, basée sur les données DB réelles

### Matching offre/profil (Recruiters)

1. Va sur `/recruiter`
2. Colle une offre d'emploi complète dans le textarea
3. Clique **✨ Analyser le fit**
4. Résultat : score 0-100, verdict (excellent/good/partial/weak), forces, gaps, projets pertinents, message personnalisé à copier

---

## 📊 Modèles de données (Prisma)

```
AdminUser            Testimonial           Project
Technology           Service               ProjectTechnology
TimelineItem         Booking               ProjectSocialLink
AboutValue           SiteStats             PlaygroundItem
SkillCategory        AvailabilityStatus    ContactMessage
SkillItem
```

Voir [`prisma/schema.prisma`](./prisma/schema.prisma) pour le détail.

---

## 🗺 Roadmap possible

- [ ] Intégration email (Resend) pour notification auto sur nouveau booking
- [ ] Upload d'images local (pas d'URL) dans l'admin projects
- [ ] Éditeur Markdown WYSIWYG pour les case studies
- [ ] Analytics (Plausible / Vercel)
- [ ] Blog / articles techniques
- [ ] Cache Redis pour les API routes les plus sollicitées
- [ ] Tests E2E Playwright
- [ ] i18n (FR + EN)
- [ ] Domaine custom (`ahetan.dev` ou équivalent)

---

## 📝 Licence

MIT — voir [LICENSE](./LICENSE).

---

## 🤝 Crédits

- **Vidéos background** : [Pexels](https://pexels.com) (Free license)
- **Polices** : Geist (Vercel), Syne (Bonjour Monde)
- **Icons** : Emojis natifs (accessible, zero dep)
- **Développement assisté** : Claude Code (Anthropic)

---

*Construit avec rigueur entre Cotonou et le reste du monde — 2025/2026.*
