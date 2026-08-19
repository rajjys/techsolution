# Brief SEO — TECH SOLUTION RDC

> État relevé le 18 août 2026, sur le build de production, page par page.
> Ce document dit **ce qui existe** et **ce qui manque**. Il ne dit pas quoi
> faire : c'est le travail à venir. Rien ici n'est supposé — tout a été lu dans
> le HTML produit ou dans le dépôt.
>
> **Mise à jour du 19 août 2026** — les lots A, B et C sont livrés. Ce qui a
> changé est consigné au §7, avec les mesures avant/après et les trois constats
> que ce relevé avait manqués. Les §2 et §3 restent l'état du 18 août : ils
> servent de point de comparaison, ils ne décrivent plus le site.

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

---

## 7. Ce qui a été livré — 19 août 2026

Onze commits. `npm run build`, `tsc` et `eslint` verts à chacun ; chaque point
vérifié sur le HTML produit et en capture navigateur, jamais sur le JSX.

### 7.1 Ce que le relevé du 18 avait manqué

Trois constats, tous confirmés sur le rendu, tous plus lourds que ce qui était
listé au §3 :

1. **Le partage social ne fonctionnait sur aucune page sauf l'accueil.** Le §3
   ne signalait que l'image. En réalité `og:title`, `og:description` **et
   `og:url`** étaient identiques partout : un lien vers un kit collé dans
   WhatsApp affichait le titre, le texte et l'URL de la page d'accueil. Cause :
   `openGraph` déclaré dans une page **remplace** celui du layout, il n'en
   hérite pas champ par champ — et aucune page ne déclarait le sien.
2. **Les six études de cas manquaient au sitemap.** Le seul contenu qui associe
   une ville réelle à une réalisation réelle, donc exactement ce qui sert le
   local, n'était pas déclaré.
3. **La photo la plus visible du site est une image de stock Unsplash**
   (`components/home/hero.tsx`), alors que 142 Mo de photos de chantiers réels
   dorment dans `public/gallery/`. Décision du propriétaire : on la garde pour
   l'instant, seule la performance est corrigée.

### 7.2 Ce qui est corrigé

| | Avant | Après |
|---|---|---|
| URLs au sitemap | 7 | **13** (les 6 études de cas) |
| `lastmod` | recalculé à chaque build | figé par route |
| `og:url` / `og:title` | ceux de l'accueil, partout | propres à chaque page |
| Vignette de partage | logo bleu sur blanc, une pour tout le site | **une par page**, photo de chantier réelle, ville en surtitre pour les études de cas |
| Poids d'une vignette | — | 70 à 130 Ko (JPEG, sous le seuil WhatsApp) |
| Favicon | tracé creux, invisible à 16 px et sur SERP sombre | pastille indigo pleine, lisible à 16/24/32/48 px dans les deux thèmes |
| `BreadcrumbList` | absent | sur les 11 pages intérieures |
| `sameAs` | absent | les 3 comptes officiels |
| Identifiants légaux | absents | RCCM, ID. Nat., NIF — pied de page **et** `Organization` |
| `areaServed` | « RDC » | RDC **+ les 9 provinces livrées**, dérivées de `presenceCities` |
| `keywords` | présent | retiré |
| Titre d'accueil | 86 caractères, tronqué par Google | 58 |
| Descriptions | résumé de la page | preuve chiffrée, clients nommés, lieu |
| Pied de page | « Interventions dans les 26 provinces » | « 17 installations livrées dans 9 provinces — interventions sur les 26 » |

### 7.3 Performance — mesurée, plus supposée

Le §3 disait « jamais mesuré ». Fait, sur l'accueil mobile, en **Slow-4G +
CPU ×4** — les conditions de terrain :

| | Avant | Après |
|---|---|---|
| LCP | 17 324 ms | **11 856 ms** |
| Poids total | 473 Ko | **282 Ko** |

Quatre causes traitées : le hero Unsplash était **préchargé sur mobile alors
qu'il y est masqué** (`hidden lg:block` n'empêche pas le téléchargement — 80 Ko
jamais affichés, en tête de file) ; les deux logos étaient servis en `w=3840`
faute de `sizes` (44 + 41 Ko → 9 Ko) ; le filigrane du pied de page portait
40 Ko de RVB inutile pour un masque CSS qui n'utilise que l'alpha (→ 6 Ko) ;
`icon.png` pesait 40 Ko sur chaque page (→ 6 Ko servis).

**Fausse alerte levée** : les 4,4 Mo de `gallery-web` ne sont pas un problème.
`next/image` sert 65 Ko d'AVIF sur l'accueil mobile. Le §3 avait raison de dire
« à mesurer avant de conclure ».

**Reste** : `gtag.js` pèse 166 Ko et redevient, de loin, la ressource la plus
lourde du site. C'est un arbitrage — mesurer coûte, et l'entonnoir `devis_*` en
dépend.

### 7.4 Vérifications de non-régression

- 44 liens internes, toutes variantes `?kit=` / `?service=` / `?domaine=` et
  ancres comprises : **tous en 200**. Aucun lien mort.
- Liens externes : tous résolvent. LinkedIn répond 999, réponse anti-robot
  standard, pas une erreur.
- **Liens WhatsApp : corrects.** Vérifié dans le HTML produit, les espaces sont
  encodés en `%20`. Ce qui avait été pris pour des espaces vient d'ailleurs :
  d'anciennes URL `/contact?produit=Kit Solaire Hybride 650 Va` encore indexées.
  Elles répondent 200 et déclarent `canonical → /contact` : elles sortiront
  seules de l'index, rien à faire.
- Les 13 blocs JSON-LD parsent et portent tous `@context` et `@type`.
- Captures desktop (1440) et mobile (390) sur accueil, services, produits,
  références : aucune régression visuelle.

### 7.5 Ce qui reste ouvert

**Lot D — local et contenu.** Décision prise : « la preuve d'abord » — une page
par ville où un chantier est documenté (Mahagi, Bunia, Goma, Butembo, Numbi)
plus Kinshasa au titre du bureau. Lubumbashi, Beni et les autres attendent une
première réalisation. Plus une page `/faq` : les 6 questions actuelles sont
**rendues à l'identique sur /services et /produits** — doublon interne à
traiter — et il en faudrait 8 à 12 de plus, techniques et locales, que seule
l'entreprise peut fournir.

⚠️ **Beni n'existe nulle part dans le projet**, ni dans `presenceCities`, ni
dans les études de cas.

**Lot E — balisage sémantique.** `Service`, `Product`/`OfferCatalog` (sans prix,
`Offer` avec `availability` seule), `Article` sur les études de cas, `llms.txt`.
Aucun ne produit de résultat enrichi ; leur valeur est l'extraction par les
moteurs conversationnels.

**Note sur `FAQPage`** : Google a supprimé les résultats enrichis FAQ en
août 2023 sauf pour les sites gouvernementaux et de santé. Le baliser reste
utile pour les IA, mais il ne faut en attendre aucun accordéon dans la SERP.

**Hors site, et c'est le plus rentable** : la fiche Google Business Profile
n'est **pas revendiquée** (« Own this business? » visible dans le panneau) et
contredit le site — adresse « LUXBEAUTY, Yambi yaya » au lieu du Boulevard de
la Libération, horaires « opens 8 pm » au lieu de 8h–17h. Aucune ligne de code
ne compense ça.

**Le vrai problème de fond** : sur « techsolution rdc », `techsolution.cd`
n'apparaît pas en première page — elle est occupée par techsolutionsrdc.com,
Intelligencia Tech Solutions RDC, Itechsolution et Tech Solutions Congo. La
Search Console montre 60 impressions et une position moyenne de 6,8 : quand le
site sort, il sort bien. Il ne sort presque jamais. Ce n'est pas un problème de
classement, c'est un problème de couverture et d'entité.
