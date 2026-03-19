# Portfolio Digital — Intégrateur Systèmes

Site portfolio professionnel avec backoffice, base MySQL et design moderne.

## Documentation

| Fichier | Description |
|--------|-------------|
| [SPEC.md](./SPEC.md) | Spécification technique (MySQL, backoffice, page Projets en onglets, filtres dynamiques) |
| [docs/schema-mysql.md](./docs/schema-mysql.md) | Schéma de la base de données MySQL |
| [docs/design-guide.md](./docs/design-guide.md) | Guide design — pages modernes et professionnelles |

## Choix techniques

- **Base de données :** MySQL
- **Projets :** une seule page avec sections/onglets + **filtres dynamiques par technologie**
- **Backoffice :** admin intégré pour gérer projets et technologies
- **Design :** moderne et professionnel pour valoriser le portfolio

## Stack prévue

- Next.js (App Router), React, Tailwind CSS
- MySQL + Prisma (ou Drizzle)
- Zone admin `/admin` avec authentification
- Hébergement : Vercel + MySQL (PlanetScale, Railway, etc.)

---

*Voir [SPEC.md](./SPEC.md) pour le détail complet.*
