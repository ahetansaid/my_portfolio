# Guide design — Portfolio moderne et professionnel

Objectif : **pages très modernes et professionnelles** pour valoriser le portfolio.

---

## Principes généraux

1. **Hiérarchie claire** — Titres, sous-titres, corps de texte bien différenciés.
2. **Espacement généreux** — Pas de surcharge visuelle ; respiration entre les blocs.
3. **Cohérence** — Même style de cartes, boutons et typo sur tout le site.
4. **Contraste et lisibilité** — Texte lisible sur fond (contraste suffisant pour l’accessibilité).

---

## Typographie

- **Titres :** police distinctive (ex. Plus Jakarta Sans, Clash Display, ou Geist).
- **Corps :** police lisible (Inter, Geist, ou système).
- **Tailles :**  
  - H1 : 2.5rem – 3.5rem  
  - H2 : 1.75rem – 2.25rem  
  - Corps : 1rem – 1.125rem  
  - Petit texte / légendes : 0.875rem

---

## Couleurs

- **Option A (clair) :** fond blanc / gris très clair, texte noir ou gris foncé, accent (bleu marine, indigo ou teal) pour liens et CTA.
- **Option B (sombre) :** fond gris très foncé / noir, texte blanc / gris clair, accent vif (bleu, vert, ou orange discret).
- **Accents :** une à deux couleurs d’accent max (boutons, liens, badges techno).

---

## Composants clés

### Cartes projet
- Fond blanc (mode clair) ou carte légèrement surélevée (ombre, bord arrondi).
- Image ou placeholder soigné, titre, courte description, badges technologies.
- Hover : légère élévation ou bordure accent.

### Filtres par techno
- Boutons ou tags cliquables, état actif visible (couleur de fond ou bordure).
- Style cohérent avec le reste (arrondi, padding).

### Onglets (détail projet sur une page)
- Onglets horizontaux ou pills ; contenu en dessous.
- Transition courte au changement d’onglet.
- Indication claire de l’onglet actif.

### Formulaire contact
- Champs épurés (bordure fine, focus visible).
- Bouton CTA bien visible.
- Message de succès/erreur discret mais lisible.

---

## Responsive

- **Mobile :** 1 colonne, filtres en ligne wrap ou menu déroulant, onglets scrollables si besoin.
- **Tablette / desktop :** grille 2–3 colonnes pour les cartes projets, onglets en ligne.

---

## Performance et ressenti « pro »

- Images optimisées (Next.js `Image`), formats WebP si possible.
- Animations légères (transitions 200–300 ms), pas d’animations lourdes.
- Chargement rapide (< 3 s) pour renforcer l’image professionnelle.

---

*À compléter avec une maquette ou un thème (ex. Tailwind) une fois la stack en place.*
