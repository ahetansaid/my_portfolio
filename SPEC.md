# Spécification technique — Portfolio Digital

**Projet :** Portfolio Intégrateur Systèmes  
**Version :** 1.1  
**Dernière mise à jour :** 2026

---

## 1. Choix techniques validés

| Élément | Choix |
|--------|--------|
| **Base de données** | MySQL |
| **Détail des projets** | Une seule page avec **sections / onglets** (pas de page par projet) |
| **Filtres** | Par **technologie**, **dynamiques** (données issues de la BDD) |
| **Gestion du contenu** | **Backoffice (admin)** pour ajouter/modifier projets et données |
| **Design** | **Moderne et professionnel** pour valoriser le portfolio |

---

## 2. Architecture technique

### 2.1 Stack recommandée

- **Frontend :** Next.js (App Router), React, Tailwind CSS
- **Base de données :** MySQL
- **ORM / requêtes :** Prisma ou Drizzle (recommandé : Prisma)
- **Backoffice :** Zone admin intégrée au même projet Next.js (routes `/admin/*`) avec authentification
- **API :** Next.js API Routes ou Route Handlers pour CRUD projets, technologies, etc.
- **Hébergement :** Vercel (front) + base MySQL (PlanetScale, Railway, ou VPS)

### 2.2 Base de données MySQL

**Tables principales :**

- **projects** — id, slug, name, problem, solution, technologies (JSON ou table de liaison), results, image_url, order, is_published, created_at, updated_at
- **technologies** — id, name, slug, category (développement / systèmes / méthodologies), order
- **project_technologies** — project_id, technology_id (relation N-N pour filtres dynamiques)
- **admin_users** — id, email, password_hash pour accès backoffice
- Optionnel : **contact_messages** si tu stockes les messages du formulaire

Les **filtres par techno** sont dynamiques : les options viennent de la table `technologies` et les projets sont filtrés via `project_technologies`.

### 2.3 Page « Projets » (une seule page, onglets/sections)

- **Une seule URL** (ex. `/projets`).
- **Liste des projets** : cartes ou grille avec filtre par technologie (dropdown ou tags cliquables).
- **Détail d’un projet** : affiché sur la **même page** sous forme de :
  - **Onglets** (ex. Contexte, Solution, Technologies, Résultats), ou
  - **Sections dépliables / accordéon**, ou
  - **Modal / panneau latéral** au clic sur une carte.
- Pas de route dédiée type `/projets/[slug]` pour le détail : tout reste sur `/projets` avec état (projet sélectionné + onglet actif).

### 2.4 Backoffice (admin)

- **URL dédiée** : ex. `/admin` (redirection login si non connecté).
- **Fonctionnalités :**
  - CRUD **Projets** (titre, problématique, solution, résultats, image, ordre, publication).
  - Gestion des **technologies** (nom, slug, catégorie) pour alimenter les filtres.
  - Association **projet ↔ technologies** (cases à cocher ou multi-select).
  - Gestion des **sections À propos** si contenu en BDD.
- **Sécurité :** authentification (session ou JWT), mots de passe hashés, accès réservé aux admins.

---

## 3. Design — Moderne et professionnel

### 3.1 Principes

- **Moderne :** typographie soignée (polices sans-serif type Inter, Plus Jakarta Sans, ou Geist), espacements généreux, ombres légères, bords arrondis cohérents.
- **Professionnel :** palette sobre (bleu marine / gris / blanc, ou fond sombre avec accents), pas d’effets « gadget », hiérarchie claire (titres, sous-titres, corps de texte).
- **Valorisation :** mise en avant des projets (visuels, chiffres, technologies en badges), CTA visibles (contact, voir les projets).

### 3.2 À prévoir

- **Thème :** clair ou sombre (ou les deux avec toggle).
- **Composants :** cartes projet, filtres par techno (tags/boutons), onglets ou accordéons pour le détail projet, formulaire de contact épuré, footer structuré.
- **Responsive :** mobile-first, grille adaptée (1 col mobile, 2–3 cols desktop).
- **Micro-interactions :** hover sur cartes et boutons, transitions courtes pour onglets/accordéons.

### 3.3 Références (à adapter)

- Dribbble / Awwwards : portfolios développeurs ou intégrateurs.
- Sites type Linear, Vercel, Stripe : clarté, typo, couleurs limitées.

---

## 4. Arborescence du site (côté utilisateur)

```
/                → Accueil (nom, métier, slogan, CTA)
/about           → À propos (parcours, vision)
/projects        → Projets (liste + filtre par techno + détail en onglets/sections sur la même page)
/skills          → Compétences (catégories : développement, systèmes, méthodologies)
/contact         → Contact (formulaire, email, WhatsApp, réseaux)
```

```
/admin           → Backoffice (login + CRUD projets, technologies, etc.)
```

---

## 5. Filtres dynamiques (technologies)

- Au chargement de `/projets`, récupérer **tous les projets** (ou paginés) et la **liste des technologies** depuis l’API/BDD.
- Afficher les **filtres** sous forme de boutons ou tags (tous + une entrée par techno).
- Au clic sur une techno : filtrer côté client (ou nouvelle requête API) pour n’afficher que les projets ayant cette techno.
- **100 % dynamique** : ajout d’une techno dans le backoffice = elle apparaît automatiquement dans les filtres.

---

## 6. Récapitulatif des livrables

1. **Site public** : pages Accueil, À propos, Projets (une page avec onglets/sections + filtre par techno), Compétences, Contact.
2. **Base MySQL** : tables projets, technologies, project_technologies, admin_users (et optionnel contact_messages).
3. **Backoffice** : authentification + CRUD projets + gestion technologies + liaison projet–techno.
4. **Design** : moderne, professionnel, responsive, valorisant pour le portfolio.
5. **SEO** : balises, meta, URLs propres ; performance &lt; 3 s.

---

## 7. Évolutions futures (rappel)

- Blog technique
- Dashboard admin enrichi
- Multilingue
- Export PDF des projets

---

*Document de référence pour le développement. À mettre à jour en cas de changement de périmètre.*
