# Brief SEO — TECH SOLUTION RDC

> État relevé le 18 août 2026, sur le build de production, page par page.
> Ce document dit **ce qui existe** et **ce qui manque**. Il ne dit pas quoi
> faire : c'est le travail à venir. Rien ici n'est supposé — tout a été lu dans
> le HTML produit ou dans le dépôt.

Contexte général du projet : `docs/HANDOFF.md`. Règles visuelles :
`docs/design-system.md`. Source de vérité du contenu :
`docs/FARDE TECH SOLUTION.pdf`.

---

## 1. L'objectif, tel qu'énoncé par le propriétaire

Se rendre trouvable, dans cet ordre d'importance :

1. **Recherche Google** sur les requêtes commerciales congolaises
   (« installation solaire Bunia », « onduleur hybride Goma », « groupe
   électrogène remplacement RDC »…).
2. **Réponses d'IA conversationnelles** — être cité quand on demande à un
   assistant qui installe du solaire en RDC.
3. **Recherche locale** — les deux implantations, Bunia et Kinshasa.
4. **Partage social** — la vignette quand un lien est collé dans WhatsApp,
   LinkedIn ou un email.

Et derrière tout ça : **attirer les bons prospects**, pas du volume. Le site
sert des institutionnels (ONG, banques, programmes publics) autant que des
particuliers ; les deux ne cherchent pas les mêmes mots.

---

## 2. Ce qui est déjà en place

- **Métadonnées par page** : `title`, `description`, `canonical` sur les huit
  pages. Gabarit `%s | Tech Solution RDC`. Aucun titre en doublon.
- **Un seul `h1` par page**, vérifié sur les huit.
- `sitemap.ts`, `robots.ts` (avec `Disallow: /api/`), `app/icon.png`,
  `apple-icon.png`, `opengraph-image.png`.
- **JSON-LD `Organization`** global (`app/layout.tsx`) : nom, logo, téléphone,
  email, les deux adresses, `areaServed: CD`, `contactPoint`.
- **JSON-LD `LocalBusiness`** sur `/contact` : une fiche par implantation, avec
  `openingHoursSpecification` (Mo–Sa 08:00–17:00).
- **GA4** (`G-BM0WRKQTVY`) + événements d'entonnoir `devis_*` sur /contact.
- Images servies depuis `public/gallery-web/` via `next/image`.
- `lang="fr"`, OpenGraph `locale: fr_CD`, `twitter:card summary_large_image`.

---

## 3. Ce qui manque — relevé, non supposé

### Technique

| Constat | Où |
|---|---|
| **Une seule image OG pour tout le site.** Les huit pages partagent `app/opengraph-image.png`. Un lien vers une étude de cas, un kit ou /contact affiche la même vignette générique. | `app/opengraph-image.png` |
| **`keywords` dans les métadonnées** — ignoré par Google depuis 2009, et ça n'aide aucun autre moteur. Bruit à retirer. | `app/layout.tsx` |
| **Pas de JSON-LD `BreadcrumbList`** alors que le fil d'Ariane existe visuellement sur toutes les pages intérieures. | partout |
| **Pas de `FAQPage`** alors que /services et /produits portent de vraies FAQ. C'est aussi le format que les moteurs conversationnels extraient le plus facilement. | `lib/data/services.ts` |
| **Pas de `Service` ni de `Product`/`OfferCatalog`** pour les 6 domaines et les 9 kits. Aucun prix publié — décision du propriétaire — donc un `Offer` sans `price` avec `availability` seulement. | `lib/data/{services,kits}.ts` |
| **Pas de `Article`/`CreativeWork` sur les études de cas**, qui sont le contenu le plus substantiel du site. | `app/references/[slug]/` |
| `/contact` et `/references` sont **rendus dynamiquement** (`ƒ`) à cause de `searchParams`. À vérifier : cela n'empêche pas l'indexation, mais le budget de crawl et la latence en pâtissent. Un `generateStaticParams` ou un découpage statique/dynamique serait à étudier. | build output |
| **Aucun `llms.txt`** ni équivalent. Convention émergente pour les moteurs conversationnels. À évaluer, pas à adopter les yeux fermés. | racine |
| **Poids des images** : 4,4 Mo dans `gallery-web`, la plus lourde à 624 Ko. `next/image` sert du WebP/AVIF redimensionné, donc l'impact réel est à **mesurer** avant de conclure. | `public/gallery-web/` |
| **Core Web Vitals jamais mesurés.** `framer-motion` est présent sur presque toutes les sections. À passer au Lighthouse mobile, en conditions réseau dégradées — c'est le terrain RDC. | — |

### Contenu et intention de recherche

- **Aucune page ne cible une requête locale.** Il n'existe pas de page
  « installation solaire à Bunia » ni « à Goma », alors que les études de cas
  documentent des réalisations à Mahagi, Goma, Butembo, Numbi et Bunia. Le
  maillage ville → réalisation → service n'est pas fait.
- **Aucun contenu informationnel.** Rien ne répond à « combien coûte une
  installation solaire », « quelle puissance pour une maison », « lithium ou
  gel » — les requêtes qui amènent quelqu'un six mois avant l'achat. Un blog
  est listé au backlog depuis le début.
- **Les descriptions font 99 à 155 caractères** : correct, mais elles décrivent
  la page plutôt que de donner une raison de cliquer. À réécrire en visant
  l'intention, pas le résumé.
- **`/references` porte 10 clients réels** (MONUSCO, CARE, Save the Children,
  ALIMA, Afriland, CADECO, PDL-145T…) — c'est le principal actif de crédibilité
  du site et il n'est structuré nulle part.

### Hors site — à ne pas oublier, c'est le plus rentable en local

- **Fiche Google Business Profile** pour Bunia et Kinshasa : c'est ce qui fait
  apparaître dans le pack local, et aucun travail sur le code ne le remplace.
  Le `LocalBusiness` JSON-LD de /contact ne sert vraiment que corrélé à une
  fiche vérifiée.
- **Cohérence NAP** (nom, adresse, téléphone) entre le site, la fiche Google et
  tout annuaire. Le site est déjà cohérent, via `lib/site.ts`.

---

## 4. Contraintes — non négociables

- **Aucun prix publié.** Décision du propriétaire, réaffirmée. Cela vaut aussi
  pour les données structurées : `Offer` sans `price`.
- **Aucun fait inventé.** Pas de client, de chiffre, de délai ou d'avis qui ne
  soit dans la farde officielle. Tout chiffre non sourcé porte un commentaire
  `⚠️ À SOURCER` dans le code.
- **Pas de faux avis, pas de balisage `AggregateRating`** — il n'existe aucun
  avis client publié, et en fabriquer est à la fois une faute et un motif de
  pénalité.
- **Français professionnel congolais.** Apostrophes typographiques (`&apos;`).
- **`npm run build`, `tsc` et `eslint` verts** à chaque commit.
- Respecter `docs/design-system.md` — notamment §6 bis (pages-outils) et la
  matrice de boutons.
- **Vérifier le rendu réel** avant de conclure : build →
  `PORT=3100 npm start` → lecture du HTML produit et capture navigateur. Trois
  bugs du projet ne se voyaient que là (cf. « pièges », design-system.md §10).

---

## 5. Données déjà exploitables pour le balisage

Tout est typé et centralisé — il n'y a rien à ressaisir.

| Fichier | Contenu |
|---|---|
| `lib/site.ts` | NAP, horaires, domaine, provinces couvertes, `offices[]` |
| `lib/data/services.ts` | 6 domaines + `processSteps` + `faqs` + `projectCategory` |
| `lib/data/kits.ts` | 9 kits réels : puissance, phase, composition, usages |
| `lib/data/case-studies.ts` | 6 études : ville, coordonnées, défi/solution/résultats. ⚠️ le champ `spec` contient des valeurs **fictives**, signalées en commentaire |
| `lib/data/clients.ts` | 10 clients réels, 17 projets, 7 valeurs |
| `lib/data/drc.ts` | provinces, tracé du pays |

---

## 6. Comment mesurer

Aucun de ces chantiers ne se juge à l'œil. Avant/après attendu sur :

- Lighthouse mobile (performance, SEO, accessibilité), en réseau bridé.
- Rendu du HTML produit — les balises, pas le code source JSX.
- Validation des données structurées (Rich Results Test / validator.schema.org).
- Aperçu de partage réel : WhatsApp, LinkedIn, X.
- Search Console : impressions et position moyenne par requête — mais le signal
  met des semaines à apparaître, et c'est normal.
