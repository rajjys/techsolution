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

**Photo derrière du texte** (hero d'accueil, `PageHero`) — deux couches, pas
une :

1. un **masque en dégradé sur l'image elle-même**
   (`[mask-image:linear-gradient(...)]`). C'est lui qui supprime l'arête où la
   photo commence. Un voile posé par-dessus ne la cache pas : on voit le bord,
   comme un mur derrière un nuage ;
2. un **voile de la couleur du fond** pour le contraste du texte. Sur mobile il
   est **uniforme** (`bg-brand-50/90`) : un dégradé y fait varier la lisibilité
   d'une ligne à l'autre, et c'est toujours le chapô qui passe sous le seuil.
   Il redevient directionnel à partir de `lg`, où le texte est cantonné à une
   moitié.

La photo est décorative (`alt=""`), son sujet décrit en `sr-only` dans le flux :
annoncée deux fois, elle gêne. Le fil d'Ariane reste en tête et à gauche, hors
du bloc centré verticalement. Les appels à l'action se posent **sous** le chapô,
jamais à côté.

## 2. Rôles de couleur

| Rampe | Rôle | Interdit |
|-------|------|----------|
| `brand` | Identité, surfaces, teintes de section, accent de titre | — |
| `solar` | **Action, exclusivement** — y compris la **réponse choisie** dans un formulaire, plus le filet d'eyebrow et les pictos de specs | Texte courant ; tout souligné sur du non-cliquable |
| `ember` | **Retiré de l'interface.** Ne subsiste qu'en couleur d'**état** (erreur de formulaire) et en teinte de catégorie « Électricité » | Toute action, tout décor |
| `slate` | Texte neutre sur clair : `900` titres, `600` corps, `500` méta | — |
| `navy` | **Déprécié.** Palette héritée, conservée le temps de la purge | Tout nouveau code |

Sur fond sombre, le corps de texte est en `brand-200`, la méta en `brand-300`.

Catégorisation (badges, étiquettes) : s'en tenir à `solar` / `brand` /
`slate`. Pas d'ambre, d'émeraude ni de ciel — ils n'appartiennent à aucune
rampe du système.

## 3. Appels à l'action

Le style ne dépend pas de l'importance seule mais du **contexte de pose** :
la surface et le voisinage. Voir `components/ui/button.tsx`.

| Variante | Contexte |
|----------|----------|
| `primary` | Action principale sur surface claire — `solar-500`, **texte `brand-950`** |
| `primary-dark` | La même sur surface sombre — `solar-500` y tient tel quel |
| `outline-strong` | Secondaire adossé à un primaire — contour `brand-950` |
| `link` | **Renvoi vers une section de la même page.** Texte gris souligné au survol, sans boîte |
| `outline-brand` | Secondaire isolé, registre navigation |
| `outline-light` | Secondaire sur surface sombre — s'inverse au survol |
| `nav` | Chrome de navigation (header, menu) — `brand-950`, jamais la couleur d'action |
| `card` / `card-outline` | Action à l'intérieur d'une carte ou d'un panneau produit — `brand` |
| `neutral` | **Téléchargement**, et rien d'autre : blanc bordé, la couleur reste au picto. Un secondaire ordinaire prend `outline-strong` — sinon le blanc cesse de signaler « vous repartez avec un fichier » |
| `whatsapp` | Canal WhatsApp en plein vert — réservé aux endroits où c'est *le* canal proposé |

`solar` est l'action du **contenu éditorial** (une page qui pousse vers le
devis). Le jaune impose son sens de lecture : du blanc sur `solar-500` plafonne
à 1,7:1 — le texte d'un bouton jaune est donc toujours sombre (`brand-950`,
11:1). Sur fond blanc le jaune n'a qu'un contour mou : `primary` porte un
`shadow-sm` pour lui rendre son arête, jamais une bordure — elle fausserait les
hauteurs face aux variantes à bordure de 2 px.

L'orange a été retiré parce qu'il n'appartenait pas à l'identité (bleu / jaune /
blanc) : il portait toutes les actions sans figurer nulle part dans la marque.
Le jaune, lui, y était déjà — et ne servait presque à rien dans l'interface. À l'intérieur d'un objet — carte, panneau de produit — l'action est en
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

**Un renvoi n'est pas une action.** Un lien d'ancre (« Voir les six domaines »,
« Voir le relevé complet ») prend `link`, jamais un contour. Encadré, il devient
un second bouton, et deux cibles de poids voisin n'en laissent aucune dominante
— c'est ce qui faisait que les en-têtes de /services et /references semblaient
proposer trois actions concurrentes.

**La paire canonique.** Un bloc de contenu détaillé propose deux sorties et
pas plus : *agir* (`primary` → `/contact`, préqualifié par un paramètre) et
*se rassurer* (`outline-strong` → la preuve correspondante). Une page ne
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

## 6 bis. Pages-outils

Une page dont l'objet **est** un formulaire ne se compose pas comme une page
éditoriale. /contact en donne la forme de référence.

**Pas de `PageHero`.** Il posait 570 px de préambule au-dessus de la première
question : sur un téléphone, l'outil vers lequel converge tout le site
commençait sous la ligne de flottaison. Le fil d'Ariane, le `h1`, la promesse
et le formulaire tiennent dans une seule colonne bornée à `46rem`, et cette
colonne est la page. La surface reste claire (`brand-50`), comme toute page
intérieure.

**Colonne unique, jamais de rail.** Un rail latéral se replie *sous* le contenu
dès qu'on passe sous `lg` — il s'efface donc exactement là où il servirait le
plus. Ce qu'il porterait remonte au-dessus (les engagements, au point de
décision) ou descend juste dessous (les canaux de secours).

**Les engagements en une ligne, pas en grille.** Trois items sur une ligne qui
se replie (`flex flex-wrap`) se lisent comme une politique ; en tuiles, comme
un argumentaire. Ils appartiennent au dessus du formulaire, là où l'on décide.

**Barre d'action collante.** Sur un écran de choix un peu long, la réponse est
donnée bien avant que le bouton n'entre dans le champ. La barre se colle au bas
de la fenêtre et se pose d'elle-même au bas de la carte quand celle-ci y tient.
Elle doit **affleurer les trois bords** de la carte — marges négatives accordées
à chaque rembourrage (`-mx-5 -mb-5 sm:-mx-8 sm:-mb-8 lg:-mx-10 lg:-mb-10`) —
faute de quoi le contenu continue de défiler dans l'interstice qui reste
dessous. Fond **opaque** : `backdrop-filter` n'est garanti nulle part.

**Une carte de choix a trois états, et aucun n'est bleu.** Une pastille
`brand-100` par option devient un aplat indigo dès la cinquième, où la sélection
ne se voit plus faute de contraste avec son voisinage. Repos neutre
(`bg-slate-50/70`, pictogramme `slate-500` sur blanc cerclé), survol sur
l'anneau qui sert de signature au site.

**La réponse choisie est en `solar`** — comme le bouton qui la valide. C'est la
seule extension de la règle « un seul aplat saturé par écran », et elle est
volontaire : choisir *est* l'action du visiteur, et lui donner le bleu du
mobilier revenait à peindre sa décision de la couleur des meubles. Le reste
suit la règle du jaune — texte `brand-950` (11:1), coche en quasi-noir pour
qu'un seul jaune saturé porte la carte. Le bouton d'action et la carte choisie
forment alors une paire lisible : votre choix, votre validation.

Une réponse d'une autre nature — un raccourci, un « je ne sais pas » — prend le
trait discontinu et traverse la grille, au lieu de se déguiser en pair.

**La question est l'interaction principale**, pas une étiquette de champ : elle
prend l'échelle d'un titre de bloc (24 → 30 px) et reste alignée à gauche, comme
l'indice et les cartes. Un titre centré au-dessus de réponses alignées à gauche
fait repartir l'œil de deux endroits.

**Chaque question dit pourquoi elle est posée.** Un entonnoir qui interroge sans
se justifier se lit comme un péage.

**Les réponses données restent visibles et révisables.** Chacune devient une
puce sous l'étiquette d'étape, et chaque puce rouvre son écran. Au dernier
écran, l'ensemble tient lieu de relecture — sans quoi il faut remonter le
parcours pour vérifier ce qu'on s'apprête à envoyer.

**Un entonnoir nomme ce qu'il livre, il ne le vend pas.** Le visiteur arrivé
jusqu'au formulaire a lu le site : le pitch est derrière lui. « Une installation
solaire » plutôt que « Ne plus subir les coupures » — la règle du §9 (énoncer un
résultat client) vaut pour les titres éditoriaux, pas pour un bon de commande.

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

## 10. Deux pièges qui ne préviennent pas

Tous deux compilent, passent le typage et le lint, et se voient uniquement à
l'écran. Ils ont chacun coûté une itération.

**Les positions de dégradé s'écrivent entre crochets.** L'échelle
`gradientColorStopPositions` de Tailwind ne contient que des multiples de 5 :
`from-54%` ou `to-84%` ne produisent *aucune règle*, les variables retombent
sur leurs valeurs par défaut (0 % et 100 %) et le dégradé se comporte tout
autrement. Écrire `from-[54%]`, toujours.

Corollaire de mise en page : un dégradé à trois arrêts est une rampe d'alpha
linéaire, dont l'œil repère la cassure de pente et lit une arête franche.
Au-delà d'un simple voile, écrire le `linear-gradient()` en toutes lettres avec
huit ou neuf paliers.

**Le texte JSX perd son espace de tête après une expression.** JSX rogne chaque
ligne d'un nœud de texte avant de les joindre : `{services.length} expertises`
réparti sur deux lignes rend « 6expertises ». Pour toute phrase mêlant
expression et texte, utiliser un littéral gabarit —
`` {`${services.length} expertises…`} `` — plutôt que du texte JSX.

**Un rail horizontal rogne aussi en hauteur.** `overflow-x: auto` force
`overflow-y` à `auto` : le conteneur coupe les angles arrondis, les ombres
portées et les survols qui soulèvent. Il lui faut un `pt-*`. Et l'accroche de
défilement aligne sur la boîte de padding, donc `snap-start` colle la première
carte au bord de l'écran malgré le `px-*` : c'est `scroll-pl-*` qui le corrige,
pas plus de padding.
