# Système de design — TECH SOLUTION RDC

Ce document décrit le système tel qu'il est **réellement implémenté** dans la
page d'accueil. Il n'a pas été conçu en amont : il a été extrait du code, puis
formalisé pour que les autres pages s'y conforment. En cas de doute, la page
d'accueil fait foi ; ce document doit être corrigé, pas contourné.

Principe directeur : **simplicité et clarté avant l'astuce.** Une page doit se
lire, pas s'admirer.

---

## 1. Rythme des fonds

La page ne se contente pas d'alterner clair et foncé : elle descend un arc,
de l'aube à la nuit. C'est ce qui donne au parcours sa continuité.

| # | Section | Surface |
|---|---------|---------|
| 1 | Hero | `brand-50` |
| 2 | Autorité (logos clients) | `white`, bords elliptiques |
| 3 | Solutions | `surface-cool` + halos |
| 4 | Engagements | `white` |
| 5 | Réalisations | `brand-900` |
| 6 | Déclaration solaire | `surface-warm` + halos chauds |
| 7 | Kits | `surface-cool-deep` + halos |
| 8 | Pied de page | `brand-950` + halos + filigrane |

**Règles**

1. Jamais deux surfaces identiques adjacentes.
2. Toute surface teintée ou sombre porte `<Glow />` — la paire de halos
   radiaux (bleu de marque en haut, trace solaire au coin opposé). Le coin
   solaire alterne d'une section à l'autre. Sans elle, les aplats paraissent
   plats et bon marché.
3. Les surfaces blanches sont les temps de repos : aucune décoration.
4. **Le sombre est réservé** aux moments de preuve (réalisations, méthode) et
   à la conclusion (pied de page). Ce n'est pas une couleur d'en-tête.
5. **Une seule surface chaude par page.** La chaleur est une ponctuation.
6. Les pages intérieures ouvrent en **clair** (`PageHero`, `brand-50`) : passer
   de l'accueil à une page interne ne doit pas donner l'impression de changer
   de site.
7. **Une suite de blocs de même nature ne partage pas un seul fond.** Six
   expertises posées sur une même teinte se lisent comme six lignes d'un
   tableau. Chaque bloc devient sa propre `<section>`, avec sa surface (blanc /
   teinté en alternance), son côté d'image et son propre titre. La variation
   doit rester **prévisible** : deux surfaces qui alternent, pas six.
8. Une section d'index (le menu d'une page) prend la teinte la plus soutenue
   de la page — `surface-cool-deep` — pour que les cartes blanches y ressortent
   et qu'on la distingue immédiatement du contenu qu'elle annonce.

**Pleine largeur.** Une image qui illustre un bloc majeur occupe la moitié de
la section et touche le bord de l'écran (`lg:absolute lg:inset-y-0 lg:w-1/2`),
le texte restant aligné sur la grille du conteneur. C'est ce qui distingue une
scène d'une ligne de tableau. Sous `lg`, l'image repasse dans le flux, au-dessus
du texte.

## 2. Rôles de couleur

| Rampe | Rôle | Interdit |
|-------|------|----------|
| `brand` | Identité, surfaces, teintes de section, accent de titre | — |
| `solar` | Surligneur **rare** : filet d'eyebrow, soulignement, pictos de specs, états actifs, accents sur fond sombre | Texte courant, grands aplats sur clair |
| `ember` | **Action, exclusivement** | Tout usage décoratif |
| `slate` | Texte neutre sur clair : `900` titres, `600` corps, `500` méta | — |
| `navy` | **Déprécié.** Palette héritée, conservée le temps de la purge | Tout nouveau code |

Sur fond sombre, le corps de texte est en `brand-200`, la méta en `brand-300`.

Catégorisation (badges, étiquettes) : s'en tenir à `solar` / `brand` / `ember` /
`slate`. Pas d'ambre, d'émeraude ni de ciel — ils n'appartiennent à aucune
rampe du système.

## 3. Appels à l'action

Le style ne dépend pas de l'importance seule mais du **contexte de pose** :
la surface et le voisinage. Voir `components/ui/button.tsx`.

| Variante | Contexte |
|----------|----------|
| `primary` | Action principale sur surface claire — `ember-700` |
| `primary-dark` | La même sur surface sombre — `ember-600`, plus lumineux |
| `outline-ember` | Secondaire adossé à un primaire |
| `outline-brand` | Secondaire isolé, registre navigation |
| `outline-light` | Secondaire sur surface sombre — s'inverse au survol |
| `nav` | Chrome de navigation (header, menu) — `brand-700`, jamais `ember` |
| `card` / `card-outline` | Action à l'intérieur d'une carte ou d'un panneau produit — `brand` |
| `neutral` | Secondaire neutre : blanc bordé, la couleur reste au picto |
| `whatsapp` | Canal WhatsApp en plein vert — réservé aux endroits où c'est *le* canal proposé |

`ember` reste l'action du **contenu éditorial** (une page qui pousse vers le
devis). À l'intérieur d'un objet — carte, panneau de produit — l'action est en
`brand` : elle appartient à l'objet, pas à la page. Deux boutons pleins et
colorés côte à côte se disputent le regard : le second passe en `neutral`, et
seul son picto garde sa couleur.

**Constantes** : `rounded-xl` ; anneau au survol `ring-4` + `ring-offset-1` ;
anneau de focus `ring-2` + `ring-offset-2` ; sur fond sombre, décalage d'anneau
en `brand-950`.

Les variantes à bordure reçoivent un padding réduit de 2 px pour retomber sur
la hauteur de leur primaire — `box-sizing: border-box` compte la bordure.

La flèche animée reste au **point d'appel** (`group` sur le bouton,
`group-hover:translate-x-1` sur l'icône) : l'intégrer au composant la
déclencherait aussi sur les icônes de tête.

Sur mobile, des boutons empilés sont `w-full` (`block`) : deux largeurs
différentes dans une colonne se lisent comme une erreur.

**La paire canonique.** Un bloc de contenu détaillé propose deux sorties et
pas plus : *agir* (`primary` → `/contact`, préqualifié par un paramètre) et
*se rassurer* (`outline-ember` → la preuve correspondante). Une page ne
recopie pas la preuve : elle y renvoie. C'est ce que fait chaque expertise de
/services, dont le second CTA pointe vers `/references?domaine=<slug>` — le
lien entre un service et sa catégorie de réalisation est porté par la donnée
(`Service.projectCategory`), pas par une table de correspondance parallèle.

## 4. Titres

**Deux grammaires, pas plus** — voir `SectionHeading`.

- `align="left"` + `rule` : surtitre prolongé d'un filet pointillé qui remplit
  la largeur restante. Sections en deux colonnes.
- `align="center"` : surtitre centré, titre équilibré, chapô borné.
  Sections pleine largeur.

**Échelle**

| Niveau | Taille |
|--------|--------|
| `h1` de page | 30 → 56 px |
| Titre de section (`size="section"`) | 26 → 42 px |
| Titre de bloc répété (`size="block"`) | 22 → 32 px |
| Titre de carte | 17 → 20 px |
| Chapô | 15 → 18 px |
| Corps de carte | 14 px, `leading-relaxed` |

Le surtitre (`Eyebrow`) est le seul emploi structurel du solaire : filet de
3 px, capitales, interlettrage `0.18em`.

## 5. Cartes

```
rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-card
hover: -translate-y-0.5 · border-brand-300 · shadow-soft · ring-4 ring-brand-200 ring-offset-1
```

L'**anneau au survol** est la signature d'interaction du site : il vaut pour
les cartes, les boutons, les contrôles de carrousel et les images cliquables.

Séparateurs internes en pointillés (`border-dashed border-slate-200`). Sur
fond sombre, les fiches passent en verre dépoli : `border-white/10 bg-white/[0.03]`.

## 6. Catalogues

Une gamme ordonnée (les kits vont de 650 Va à 30 kVA) ne se présente pas en
grille de cartes : à neuf éléments c'est déjà un mur, à vingt c'est illisible.
Deux vues complémentaires, jamais redondantes :

- **L'échelle** (`PowerLadder`) fait *choisir*. Un seul axe, les zones d'usage
  marquées au-dessus — libellées du point de vue du client (« Ma maison », pas
  « Résidentiel ») — et un palier détaillé à la fois. Ajouter un produit
  ajoute un cran, pas une carte de plus dans un mur.
- **Le comparatif** (`KitsTable`) fait *vérifier*. Vraie `<table>` sémantique,
  groupée par usage, repères courts alignés en colonnes.

Un contrôle de ce type est un `tablist` : sélection au clic, aux flèches et par
Origine/Fin, un seul élément dans l'ordre de tabulation (tabindex mouvant), et
le panneau lié par `aria-controls` / `aria-labelledby`. Sans cela, le motif est
une jolie souricière au clavier.

## 7. Mouvement

`Reveal` / `Stagger` / `StaggerItem`. Décalage vertical de 14 à 30 px, retards
de 0,07 à 0,1 s par élément. `mode="mount"` au-dessus de la ligne de flottaison,
au défilement en dessous. Tout est neutralisé sous `prefers-reduced-motion`.

## 8. Responsive

Points de rupture à vérifier : **360 / 640 / 768 / 1024 / 1280**.

- Conteneur : `1240px` au maximum (`1304px` pour le header et le pied de page).
- Les jeux de cartes qui s'empilent mal passent en **rail à défilement
  horizontal** sous `lg` : `no-scrollbar snap-x snap-mandatory`, cartes en
  `w-[80vw] max-w-[19rem]`.
- Le `sticky` ne s'active qu'à partir de `lg`, et jamais sous un ancêtre en
  `overflow-hidden`.
- Les listes de liens courtes tiennent en deux colonnes dès 360 px.
- Le corps de page est en `overflow-x: clip` et non `hidden` : `hidden` ferait
  du body un conteneur de défilement et casserait tous les `sticky`.

## 9. Contenu

- Français, vouvoiement, apostrophes typographiques (`’` via `&apos;`).
- Un titre énonce un **résultat pour le client**, pas une capacité technique.
  « Ne subissez plus les coupures » plutôt que « Systèmes photovoltaïques ».
  L'intitulé de métier n'est pas supprimé pour autant : il descend en surtitre,
  où il sert de repère sans occuper la place du message.
- Un paragraphe ouvre sur **la situation du lecteur**, jamais sur « Nous
  concevons, nous installons… ». La capacité vient en deuxième phrase, une fois
  le problème nommé. Test rapide : si la première phrase peut commencer par
  « Nous », elle est à réécrire.
- Une étape de processus annonce **ce que le client reçoit**, pas ce que
  l'entreprise fait. D'où le champ `deliverable` sur chaque étape.
- Les chiffres doivent être sourcés. Tout chiffre non issu de la farde
  officielle porte un commentaire `⚠️ À SOURCER` dans le code.
- Une seule conclusion par page : le pied de page. Pas de second appel à
  l'action juste au-dessus.
