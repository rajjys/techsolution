# TECH SOLUTION RDC — Project Handoff / Context

> Paste this into a new chat as context. It captures the full state of the
> `techsolution.cd` corporate site so work can continue seamlessly.
> Repo: https://github.com/rajjys/techsolution — branch `main`.

---

## 1. What this is

Production-ready B2B corporate website for **TECH SOLUTION RDC** — a solar
energy & technical-infrastructure company operating across the Democratic
Republic of Congo (DRC). Language: **professional Congolese French**. Light
theme. Deploys to Vercel → `techsolution.cd`.

**Source of truth for all real content:** `docs/FARDE TECH SOLUTION.pdf` (the
company's official brochure) + a `public/gallery/` of real HD photos/videos the
client sent. Never invent client names, projects, or figures not grounded in
these — accuracy has been a hard requirement throughout.

---

## 2. Stack & how to run

- **Next.js 16.2** (App Router, Turbopack, RSC), **React 19.2**, **TypeScript** strict
- **Tailwind CSS v3.4** (`tailwind.config.ts`), custom design tokens
- **framer-motion 12**, **lucide-react**, **zod 4**, **resend 6**
- Hand-written shadcn-style UI primitives in `components/ui/` (NOT the shadcn CLI)
- Fonts: **Outfit** only (via `next/font`), mapped to both `font-sans` and `font-display`

```bash
npm install
npm run dev          # localhost:3000
npm run build        # production build (also runs TS)
npm run lint         # eslint — keep it clean before committing
```

**GOTCHA — port 3000 is taken** on the owner's machine by another app (redirects
to /login). Always test on another port:
```bash
PORT=3100 npm start   # after a build
```

**GOTCHA — Next image optimizer cache** serves stale derivatives after you
replace a file in `public/`. When a swapped image looks unchanged locally:
```bash
rm -rf .next/cache/images
```
(Production/Vercel always builds fresh, so this only bites local testing.)

**GOTCHA — `@radix-ui/react-slot` breaks RSC** (calls `createContext` at module
scope). `components/ui/button.tsx` uses a hand-rolled minimal `Slot` instead —
don't reintroduce the radix one.

---

## 3. Design system

**Palette** (`tailwind.config.ts`) — voir `docs/design-system.md`, qui fait foi.
- `brand` 50–950 — bleu officiel du logo (`brand-500 #3130D0`). Fonds, mobilier,
  chrome de navigation, accents de titre. `brand-950` est le quasi-noir.
- `solar` 50–900 — jaune de marque (`solar-500 #FFB800`). **C'est la couleur
  d'action, et elle ne sert qu'à ça** : un seul aplat saturé par écran. Texte
  d'un bouton jaune toujours `brand-950` (le blanc plafonne à 1,7:1).
- `ember` (orange) — **retiré de l'interface** en août 2026. Il portait tous les
  CTA sans appartenir à l'identité (bleu / jaune / blanc). Ne subsiste qu'en
  couleur d'état (erreur de formulaire) et en teinte de catégorie « Électricité ».
  ⚠️ Une version antérieure de ce document affirmait l'inverse — ne pas la suivre.
- `navy` — **déprécié**, en cours de purge. Pas de nouveau code.
- Neutres : blanc / `brand-50` / `surface-cool` en fonds, `slate-900` en titres,
  `slate-600` en corps.

**Type scale (mobile-first, recently tuned for small screens like Galaxy A16):**
- Section H2: `text-[26px] sm:text-3xl md:text-4xl lg:text-[40–46px]`
- PageHero H1: `text-[30px] sm:text-4xl md:text-5xl`
- Section vertical padding: `py-14 sm:py-20 lg:py-28` (mobile intentionally tighter)
- Body/lead: `text-[15px] sm:text-base md:text-lg`

**Reusable pieces:**
- `components/section.tsx` → `Section`, `Eyebrow`, `SectionHeading` (eyebrow/title/lead/align/onDark)
- `components/motion.tsx` → `Reveal`, `Stagger`, `StaggerItem`, `CountUp` (framer-motion; all respect `prefers-reduced-motion` and render the same tree with animation neutralized; there's a `<noscript>` fallback that forces `[data-reveal]` visible)
- `components/ui/button.tsx` variantes : `primary` (jaune, texte navy), `primary-dark`,
  `outline-strong` (contour `brand-950`), **`link`** (renvoi d'ancre, sans boîte —
  un lien de section n'est pas une action), `outline-brand`, `outline-light`,
  `nav` (`brand-950`, mobilier), `card`, `card-outline`, `neutral` (téléchargement),
  `ghost`, `whatsapp`. Tailles : `sm`, `md`, `lg`, `icon`.
- `components/icons.tsx` → `BoltRule`, le filet des surtitres : une impulsion
  électrique reprenant l'angle de l'éclair du logo, à la place du tiret plat
  devenu la signature des sites générés.
- `components/page-hero.tsx` — navy hero band for interior pages
- `components/cta-panel.tsx` — navy CTA band (single focused CTA; WhatsApp/phone deliberately removed to avoid clutter)
- Rounded style: cards `rounded-2xl`/`rounded-3xl`, buttons/inputs `rounded-xl`/`rounded-lg`

---

## 4. Data layer (`lib/`)

- `lib/site.ts` — company info (name, `domain: techsolution.cd`, phone `+243 821 250 250`, email `info@techsolution.cd`, base `Bunia, Ituri`, `foundedYear: 2024`), `navLinks`, `metrics`. **Nav is: Services · Produits · Références · À propos** (Accueil & Contact removed — logo links home, "Demander un devis" button → /contact).
- `lib/whatsapp.ts` — `buildWhatsAppLink()`, `buildProductWhatsAppLink()`, `buildServiceWhatsAppLink()` (pre-filled FR messages, `wa.me/243821250250`).
- `lib/data/services.ts` — 6 expertise areas + process steps + FAQ. Real references per service. Images point to `/gallery-web/service-*.jpg`.
- `lib/data/kits.ts` — **9 REAL solar kits** (650 Va → 30 kVA triphasé) transcribed from the `VERSO.jpg` catalog poster: composition (inverter/battery/panels) + usage + segment (residentiel/professionnel/industriel). Note the 650 Va kit uses a **Gel** battery (only non-lithium one).
- `lib/data/case-studies.ts` — **6 case studies** from the farde (Mahagi, Goma, Butembo, Numbi, Bunia across Ituri/Nord-Kivu/Sud-Kivu) with `challenge/solution/results`, city coords, and a `spec` field (⚠️ the spec kW/kWh values are **made-up placeholders**, flagged in comments, awaiting real data). Plus `presenceCities` = the 9 provinces of presence for the map.
- `lib/data/clients.ts` — 10 real clients (MONUSCO, CARE, Save the Children, ALIMA, LSC, Afriland, CADECO, PDL-145T, GRECOM, LTJ, New AZ) + 17 projects + 7 company values. **Personal contact phone numbers from the farde are deliberately NOT published.**
- `lib/data/drc.ts` — DRC outline polygon + projection + province list, used by the dot-matrix map.

---

## 5. Pages & current state

**Homepage `app/page.tsx` — l'ordre est un entonnoir, il est intentionnel :**
`Hero → Authority → Solutions → Offerings → CaseStudiesReach → Maintenance → CostFrame → KitsSelector`

1. `Hero` — « Fini les délestages : l'autonomie solaire pour **[vos entreprises /
   vos foyers / vos sites industriels]** », la rotation étant la chute de la
   phrase, en or, juste au-dessus du CTA jaune. Un seul bouton ; le secondaire
   est un lien texte. Photo masquée sous `lg`. ⚠️ **Ne pas redessiner le hero
   sans demande explicite** — le propriétaire le règle finement, et il est
   déclaré clos.
2. `Authority` — surtitre, une phrase, **deux tuiles de chiffres** (17+ projets /
   60+ ménages, unités séparées) et le mur de 9 logos.
3. `Solutions` — colonne sticky + liste des expertises.
4. `Offerings` — les 4 engagements. Seule section sans CTA, assumé.
5. `CaseStudiesReach` — bandeau navy, carrousel + carte à points.
6. `Maintenance` — l'après-vente. Reprend la grammaire des blocs /services
   (demi-écran image). ⚠️ **48 h / 1 an / 2 bases sont des engagements validés
   avec l'entreprise, pas des ordres de grandeur.**
7. `CostFrame` — le cadre de prix **sans prix** (décision du propriétaire :
   aucun tarif publié). Répond aux trois peurs derrière « combien ? ».
8. `KitsSelector` — 4 paliers + conclusion.

`SolarStatement` a été supprimé de l'accueil (argument de haut d'entonnoir placé
en bas) ; sa preuve chiffrée a été fondue dans la raison d'être de /about.

**Other pages:**
- `app/services/page.tsx` — 6 services (real photos), 4-step process, FAQ accordion, CtaPanel
- `app/produits/page.tsx` — the 9 real kits, filterable by segment (`components/products/kits-catalogue.tsx`, client), WhatsApp/devis CTAs
- `app/references/page.tsx` — clients-by-sector + 17 projects + province coverage (older layout; overlaps conceptually with the new case studies — a future pass could align it)
- `app/references/[slug]/page.tsx` — **case-study detail pages** (generateStaticParams from the 6 case studies), défi/solution/résultats
- `app/about/page.tsx` — vision, mission, 7 values, + the `Engagement` component (moved here from the homepage)
- `app/contact/page.tsx` — validated form → `app/api/contact/route.ts` (zod + Resend + honeypot; demo-mode logs if no `RESEND_API_KEY`). Prefills from `?produit=`. Direct call + WhatsApp live ONLY here + the floating FAB.
- `app/layout.tsx` — Outfit fonts, header, footer, `WhatsAppFab` (floating, `hidden lg:flex` — hidden on mobile), Organization JSON-LD, OpenGraph
- SEO: `sitemap.ts`, `robots.ts`, `app/icon.png`, `app/apple-icon.png`, `app/opengraph-image.png`, `app/not-found.tsx`, `app/error.tsx`

**Header (`components/layout/header.tsx`):** sticky, **auto-hides on scroll down / reappears on scroll up** (stays visible when mobile menu open). Utility bar (phone/email centered) on lg. Nav `text-base`. CTA "Demander un devis" = dark navy-950, bold, subtle lift-hover. Mobile: hamburger `Sheet` with blue-bg active link, orange "Demander un devis", white/green WhatsApp button, large tappable phone/email.

**Logo (`components/logo.tsx`):** official logo processed via a sharp pipeline into `public/assets/`. `variant="nav"` (used in header/menu) is **two-tone: blue bulb/lightning mark + BLACK wordmark**. `variant="full"` (footer, white on dark). Favicon/apple/OG all derived from it.

---

## 6. Images / gallery (IMPORTANT)

- `public/gallery/` — **142 MB of real HD originals** (77 photos ~4000px, 3 videos incl. a 37 MB drone clip). **Gitignored** — never committed. Keep on disk.
- `public/gallery-web/` — **committed, optimized web versions** (~1.5 MB total, ~150–350 KB each). These are what the app references. Curated & downsized (≤1400px, q78) from the originals via `sharp`.
- The **drone video is NOT used yet** (would need compression to a few MB + poster frame, or external hosting).
- Approach agreed with owner: bind images to **tier/context** (equipment / residential / industrial), NOT to an exact kit config (configs change).
- All image work is done in the scratchpad with `sharp` + `playwright-core` (Chrome at `/Applications/Google Chrome.app/...`) for screenshot verification. I visually verify every image/section at desktop (1440) and mobile (360/390) before committing.

---

## 7. Working conventions (please keep)

- **Verify visually before committing.** Build → `PORT=3100 npm start` → screenshot desktop + mobile with headless Chrome via playwright-core → inspect → then commit.
- **Commit in French**, end body with `Co-Authored-By: Claude <noreply@anthropic.com>`. Small, focused commits. Push to `main` after each.
- Keep `npm run build` and `npm run lint` **green** every commit.
- **No fabricated facts** (client names, project details, figures). Placeholders must be flagged in code comments.
- Match the existing type scale / spacing / motion patterns; don't introduce new one-off styles.
- The owner iterates fast and precisely on UI — expect pixel-level feedback; screenshot to confirm.

---

## 8. Open items / backlog

**Bloqué sur de la donnée — à rouvrir quand elle arrive :**
- **Chiffres de résultat** sur les études de cas : heures d'autonomie, litres de
  carburant évités, mois sans intervention. Le site prouve la présence et la
  continuité, pas encore le **résultat**. Le propriétaire indique que la plupart
  des installations tiennent 24/7 mais les archives ne sont pas exploitables.
  Ne rien approximer.
- **Témoignages clients** — jamais fabriqués. Placement retenu : entre
  `CaseStudiesReach` et `Maintenance`.

**`/contact` — refonte complète menée. La page est close, sauf mention ci-dessous.**

Diagnostic hiérarchisé mené sur neuf axes, puis reconstruction. Ce qui est fait :

*Fiabilité et mesure*
- L'API **échoue franchement en production** quand l'envoi est impossible
  (`RESEND_API_KEY` absente, ou expéditeur resté sur le bac à sable Resend).
  Elle répondait `ok: true` : une variable oubliée sur Vercel avalait
  silencieusement 100 % des demandes. Mode « consigné » réservé au développement.
- **Débit plafonné** à 5 demandes / IP / 10 min (en mémoire, donc par instance —
  BotID ou le WAF si l'abus devient réel).
- **Mesure de l'entonnoir** — `lib/analytics.ts`, événements `devis_*` déposés
  dans `dataLayer` (et non via `window.gtag`, qui se charge trop tard pour
  l'événement d'ouverture) : `devis_ouvert`, `devis_etape`, `devis_retour`,
  `devis_selection_modifiee`, `devis_champs_invalides`, `devis_soumis`,
  `devis_succes`, `devis_erreur`, `devis_whatsapp`. Tous portent `source`
  (`kit` / `service` / `nu`). **À marquer comme conversions dans GA4.**

*Structure*
- **Plus de `PageHero`** : l'entonnoir est la page, en colonne unique. Voir
  design-system.md §6 bis, qui décrit le motif « page-outil ».
- **Barre d'action collante** : « Continuer » est visible sans défiler à tous
  les points de rupture (360 → 1440).
- **« Ou joignez-nous directement » supprimée** — elle redisait le pied de page
  trente centimètres plus haut (numéro 4×, bureaux 2× sur la même page).
  Remplacée par « Ce qui se passe ensuite », la seule chose que la page ne
  disait nulle part.
- Le pied de page **ne renvoie plus vers /contact depuis /contact**
  (`components/layout/footer-cta.tsx`, seul morceau client du pied de page).
- Adresses **ouvrables dans une carte** sur tout le site ; balisage
  `LocalBusiness` des deux implantations sur /contact, horaires compris.

*Parcours*
- Options **nommées par ce qu'on livre** (« Une installation solaire »), ni par
  l'organigramme (« Backup & stockage »), ni par un argument de vente (« Ne plus
  subir les coupures ») : arrivé ici, le visiteur passe commande.
- **Le catalogue n'est plus une réponse à la première question** — un kit est
  une installation solaire. La puissance est demandée en 4ᵉ position, après le
  besoin, le lieu et l'existant. `?need=kit` est réécrit vers le solaire.
- Le verbe de l'écran « site » suit le domaine : à alimenter / à entretenir /
  à protéger.
- **Récapitulatif éditable** : chaque réponse devient une puce qui rouvre son
  écran, et tient lieu de relecture au dernier écran.
- **Sélection en `solar`**, comme le bouton qui la valide (cf. design-system.md
  §2 et §6 bis — seule extension assumée de « un seul aplat saturé par écran »).
- « Ce qui se passe ensuite » est dans la carte, au-dessus du bouton d'envoi.
- **Validation côté client**, toutes les erreurs d'un coup, sous leur champ,
  en français. Règles partagées avec l'API (`validateField`).
- **Zoom iOS supprimé** (champs à 16 px sous `sm`).
- **Le geste « retour » recule d'un écran** (`history.pushState`, même URL).
- **Préqualification modifiable** : la pastille ouvre l'écran correspondant.
- **Barre de progression honnête** : le total n'apparaît qu'une fois le chemin
  déterminé.
- **`?need=`** complète `?kit=` et `?service=` ; les quatre appels posés en
  contexte de catalogue et le CTA des études de cas (via `serviceForCategory`)
  préqualifient désormais.
- Confirmation : le **numéro composé est relu** au visiteur, avec les trois
  temps qui suivent.
- Email reçu : **origine du lead**, page d'arrivée, provenance, et un **lien
  WhatsApp vers le prospect** à côté du lien d'appel.
- `radiogroup` complet : tabindex mouvant, flèches, Origine/Fin. Parcours
  vérifié **au clavier seul**, de la première question au formulaire.
- Nouvelle page **`/confidentialite`**, écrite depuis le code.

**Ce qui reste ouvert sur /contact**
- Le **délai de retour sur investissement** n'est pas repris sur la page —
  décision du propriétaire, il reste sur `CostFrame`. À rouvrir s'il veut le
  répéter au point de décision.
- La **durée de conservation** (3 ans) de /confidentialite est une décision
  d'entreprise à confirmer, et aucun texte de loi n'est cité faute de pouvoir
  le vérifier.
- Pas de **persistance de secours** : si Resend tombe, le visiteur voit une
  erreur honnête mais la demande n'existe nulle part. Un Blob ou un KV écrit
  avant l'envoi serait le filet.
- Pas d'**accusé de réception** au visiteur qui a laissé un email.

**Ailleurs, non traité :**
- Passe section par section sur /services, /produits, /references (seuls les
  en-têtes et la copie ont été repris).
- Sur /about, le manifeste en dégradé (52 px) dépasse le H1 (48 px) — conflit
  de hiérarchie hérité de l'accueil.
- Trop de dispositifs visuels cumulés (courbe, sticky, halos, filets pointillés,
  rail, carte à points, cascades). Choisir deux ou trois signatures.
- Vidéo drone, blog.
- Déploiement : `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`.

## 9. Quick file map

```
app/                     page.tsx (home funnel), services, produits, references(+[slug]),
                         about, contact, api/contact, layout, sitemap, robots, icon/og
components/home/         hero, rotating-phrases, authority, solutions, case-studies-reach,
                         kits-showcase, engagement
components/layout/       header (auto-hide, menu), footer
components/              logo, cta-panel, page-hero, section, motion, drc-map,
                         whatsapp-fab, icons
components/ui/           button, badge, card, input, textarea, label, select, tabs,
                         accordion, sheet
components/products/     kits-catalogue (filterable)
components/contact/      contact-form (client, zod-validated)
lib/                     site, whatsapp, utils
lib/data/                services, kits, case-studies, clients, drc
public/assets/           processed logos (logo-nav-*, logo-full-*, LOGO * originals)
public/logos/            9 grayscale client logos
public/gallery-web/      committed optimized photos (offers, services, kits, cases)
public/gallery/          142 MB HD originals — GITIGNORED
docs/                    FARDE TECH SOLUTION.pdf (source of truth), PLAN.md, HANDOFF.md
```

Latest commit at handoff: `ed16517`.
