# SEO strategy & implementation plan — techsolution.cd

> Written 2 October 2026 from the repository at `ce4de15`, a local production
> build, and the live site. Every finding below was observed in rendered HTML,
> in production, or in the data files. None of it is inferred from JSX.
>
> **Relationship to other docs.** `docs/SEO-BRIEF.md` records the state in
> August and what lots A–C delivered; it stays the record of what is done.
> This file is the plan for what comes next. It absorbs
> `docs/seo-handover-prompt.md` (references), `docs/claude_code_prompt_product_architecture_seo_refactor.md`
> (products) and the owner's brief of 2 October (locations, NAP, footer, GBP).
>
> **Status, 14 Oct:** two rounds of owner answers are recorded in §7.1.
> Delivered in the working tree, **not yet committed** (see the ticks in §8):
> - Phase 1 (urgent fixes);
> - the data foundation;
> - product pages and categories;
> - the mega menu.
>
> The owner's additions of 14 Oct (product categories, households, back
> office, the CEO's name) are in §17.

---

## How to use this document

- **Work in §8 order, one step at a time.** Each step lists what it is
  *blocked by* (question IDs from §7) and when it is *done* (a check on
  rendered HTML or production, never on the source).
- **Tick the box in the same commit that delivers the step.** This file is the
  progress tracker.
- **No fact enters the site unless it is in the farde, the data files, or an
  answered question in §7.** Where a step needs a fact that isn't there, the
  step waits. It does not guess.
- Existing rules still apply: no published prices, no fabricated reviews or
  ratings, build, `tsc` and `eslint` green on every commit, French copy with
  typographic apostrophes, and **verify the render** (build →
  `MAINTENANCE_MODE=false PORT=3100 npm start` → read the HTML → screenshot at
  360/390/768/1024/1440).
- This is Next 16. Before writing route, metadata, redirect or proxy code,
  read the relevant guide in `node_modules/next/dist/docs/` (AGENTS.md).
- **Two standing rules from the owner (14 Oct), part of every step's "done":**
  1. **The sitemap follows the content.** A commit that changes what a page
     says updates its `lastmod` (`REVISED` in `app/sitemap.ts`, or the
     `revised` field of its data) in the same commit. A new page enters the
     sitemap from the data, never by hand.
  2. **No page ships without its internal links**, inbound and outbound, per
     §11. The full link graph is checked at the end (step 7.3).
- **Local dev:** run `next dev --webpack`. Turbopack's dev server leaks about
  1 GB of memory every 90 seconds on this machine, even on `main`; webpack
  stays flat at about 1 GB.

---

## 1. Diagnosis in one screen

**The basics are sound.** Since August every page has a unique title,
description, canonical and per-page OG image. Breadcrumbs are marked up,
`Organization` JSON-LD is in place, the sitemap is declared, and http→https and
trailing-slash redirects are 308s. Re-checked in production on 2 October.

**The problem is coverage, not ranking.** In August, Search Console showed
60 impressions in 3 months at an average position of 6.8: when the site
appears it ranks well, but it almost never appears. It has **13 indexable
URLs** for a company that sells 6 services and 9 kits, operates from 2 offices
and works in about 11 cities:

| What the company sells | Pages that can rank for it today |
|---|---|
| 6 services | **1** page (`/services`, one anchor per service) |
| 9 solar kits | **0** product pages (`/produits` is one page; every CTA goes to `/contact?kit=`) |
| 2 offices + ~11 cities served | **0** location pages |
| 17 delivered projects | 6 case studies, whose titles carry neither client nor scale |

**The brand query is contested, partly by the company itself.** The legacy
site is still live and competes for the same name, phone and city (§2,
finding 1).

---

## 2. New findings — fix before anything else

These are live on the public site today. Most are small to fix and costly to
leave.

| # | Finding | Evidence | Why it matters | Step |
|---|---|---|---|---|
| 1 | **The legacy site `techsolution-congo.com` is live.** Same phone (+243 821 250 250), Bunia, same tagline. It canonicalises to itself, lists `techsolutiondrc@gmail.com`, and has **no link to techsolution.cd**. Its public "Customer Reviews" section shows dozens of spam messages ("FreeB2BData…", "Feature techsolution-congo.com in GoogleSearchIndex…"). | `curl`, 2 Oct; HTTP 200, Apache | Two sites claim the same entity, so Google has to choose, and the older one may hold the backlinks. The spam, displayed as "reviews", is a trust problem for anyone who finds it. | 1.4 |
| 2 | **The public farde exposes 10 personal phone numbers of client contacts.** `/farde-tech-solution.pdf` is byte-identical to the internal `docs/FARDE TECH SOLUTION.pdf` (same SHA-1, and the production copy matches). `lib/site.ts` says the public copy was meant to be redacted, and the site deliberately never publishes those numbers. The PDF also advertises `www.techsolution-congo.com` and `info@techsolution-congo.com`. | `shasum`, production download | Privacy breach toward clients, plus an indexable PDF that points Google at the old domain. | ✅ 1.3 |
| 3 | **Placeholder specs are shown publicly.** `case-study-card.tsx` renders `study.spec`. HANDOFF §4 records these values as *made-up placeholders* ("≈ 8 kVA · Lithium 10 kWh" for PDL-145T, etc.). | Production HTML of `/` and `/references` | These are invented technical figures presented as fact. | ✅ 1.1 |
| 4 | **Imagery implies work that the reference list doesn't document.** The `/references` hero **and the site-wide default share image** (`lib/og.tsx`) is "l'hôtel Bambou, sur le fleuve à Kisangani". Kisangani is in no project, client or presence list. `/about` uses "station de traitement d'eau de Nzulo, Nord-Kivu", also not listed. The homepage logo wall shows **International Medical Corps**, which is in neither `clients` nor `projects`. | `app/references/page.tsx:52`, `lib/og.tsx:31`, `components/about/engagement.tsx:43`, `components/home/authority.tsx:47` | If these are real projects, they're unexploited proof: Kisangani becomes a documented city and Bambou a third hospitality reference. If not, they are false claims. | ✅ 1.2 (not ours: removed; IMC is a client) |
| 5 | **Unsupported outcome claims in case studies:** "Zéro interruption liée aux coupures réseau", "Autonomie énergétique complète", "Autonomie énergétique sans groupe électrogène", "Disponibilité maximale", "Installation conforme aux exigences du programme d'État", "Installation électrique aux normes", "relais automatique instantané". The footer also says "Certifié & agréé" without naming the certifying body. | `lib/data/case-studies.ts`, `components/layout/footer.tsx` | These are exactly the claims the handover prompt (§9) says to audit. | ✅ 1.1 (absolute claims); rest in 4.4; badge kept (owner) |
| 6 | **NAP is inconsistent across the web:** 3 domains, 4 emails, one hours label wrong for one office, and both office addresses changed on 18 Sept with no record of whether they moved. Details in §6.1. | §6.1 | Local ranking depends on matching NAP across the site, GBP and citations. | ✅ 1.6 on site; 12.x off-site |
| 7 | **Hero titles are invisible until JavaScript runs.** The homepage `<h1>` and every `PageHero` `<h1>` are server-rendered as `style="opacity:0;transform:translateY(26px)"` (`Reveal mode="mount"`). The browser does not count an invisible element as painted. | Local production HTML | On the Slow-4G profile measured in August (LCP 11.9 s), the main text waits for the JS bundle. A likely large share of LCP. | 10.2 |
| 8 | **`www` redirects with a 307 (temporary)** to the apex. | `curl -I https://www.techsolution.cd` | Weak canonical signal; it should be 308. | 1.5 |
| 9 | **The footer is 2.2 screens tall on a phone** and makes up **53 % of a case-study page**. | §6.3 | UX cost on every page. It can also become the NAP and location hub the site lacks. | 7.1 |
| 10 | **Case-study pages are dead ends.** Each has only a back link and a CTA: no link to its service, its city, related studies or a product. | `app/references/[slug]/page.tsx` | The evidence layer passes no authority to the pages that sell. | 4.x, 7.2 |
| 11 | `middleware.ts` uses a convention Next 16 has renamed to **Proxy** (`01-getting-started/16-proxy.md`). It runs on every request. The local `.env` has `MAINTENANCE_MODE=true` (production returns 200, so it's off on Vercel). | build output "ƒ Proxy (Middleware)" | Deprecation, plus a function call on every request. A 503 lasting more than a few days starts deindexing. | ✅ 1.7 |

**Found while delivering Phase 1:**

| # | Finding | Status |
|---|---|---|
| 12 | `victron-triphase-batteries.webp`, the **Backup & stockage** service image with alt "installés par Tech Solution RDC", comes from the same outside set as Bambou and Nzulo (pixel match with "techsolution victron 3-phase 40kw system"). | Q27 |
| 13 | The homepage says **"77+ installations"** (`projects.length + 60`, owner edit of 18 Sept), while `/references` and the footer say **17**. Same noun, two numbers. | Q29 |
| 14 | `/references` rendered **"Nos 11villes d'intervention"** in production (a JSX space swallowed after an expression). | fixed (1.8) |
| 15 | The farde lists the five radio kits **under the MONUSCO/FRAPEZ reference**. The site lists each radio as its own client. If MONUSCO funded them, it's a strong case study. | Q30 |
| 16 | `mise-a-la-terre-parafoudre.webp` shows a **"Caisse Générale d'Épargne du Congo"** (CADECO) sign. It's real CADECO proof, better than the generic photo the CADECO study uses today. | Phase 4 |

---

## 3. The strategy

### 3.1 Thesis

Tech Solution RDC competes against firms that *say* they install solar. It can
**show** that it has: 17+ named projects, recognisable clients (MONUSCO, CARE,
Afriland, CADECO), and now two Kinshasa hospitality systems with
before-and-after fuel figures. The strategy turns that proof into the
structure of the site:

- **Every commercial query gets a page whose job is to answer it.**
- **Every claim on those pages links to the evidence that backs it.**
- **The brand is consolidated into one entity before we chase rankings.** The
  legacy domain, the farde, the social profiles and the GBPs must all point
  to `techsolution.cd` with the same NAP.

### 3.2 Four page types, one job each

```
                    ┌──────────────── Home (brand, routing) ───────────────┐
                    │                                                       │
     SERVICES  — what we do         PRODUCTS — what you can buy
     /services/[slug]  (6)          /produits/[slug]  (9)
            │   ▲                          │   ▲
            │   │ "voir les réalisations"  │   │ "installé chez…" (comparable scale)
            ▼   │                          ▼   │
     REFERENCES — proof that we did it  ◄──────┘
     /references/[slug]  (6 → 8+)
            │   ▲
            ▼   │ "réalisations à Kinshasa"
     LOCATIONS — where we are / where we've delivered
     /zones/[ville]  (2 offices + proven cities)
                    │
                    ▼
                /contact  (pre-qualified)  ·  quote modal on product pages
```

- **Services** explain capability and own the generic national query
  ("installation solaire RDC").
- **Products** own the kit queries ("kit solaire 5 kVA") and convert in place.
- **References** prove both, and own the long tail (client + city +
  system).
- **Locations** own "{service} {ville}" queries and carry the NAP.

### 3.3 Query ownership: one intent, one URL

There is no keyword-volume tool in this project. This is an **intent map**, to
be validated with Search Console and Keyword Planner (step 11.3), not a
volume forecast.

| Intent cluster (FR) | Owner page | Must *not* compete |
|---|---|---|
| tech solution rdc, techsolution | `/` | everything else (brand stays in title suffix only) |
| installation solaire RDC, système solaire entreprise, photovoltaïque RDC | `/services/energie-solaire` | `/` (keeps brand-led title), city pages |
| onduleur hybride, batterie lithium, backup électrique, alimentation sans coupure | `/services/backup-stockage` | product pages |
| installation électrique bâtiment, parafoudre, tableau électrique | `/services/infrastructure-electrique` | — |
| énergie solaire radio / site télécom | `/services/telecom-medias` | — |
| alarme, vidéosurveillance, contrôle d'accès | `/services/securite-electronique` | — |
| maintenance climatisation / solaire | `/services/maintenance-climatisation` | — |
| kit solaire RDC, kit solaire hybride, prix kit solaire* | `/produits` | services |
| kit solaire {N} kVA | `/produits/{kit}` | `/produits` |
| installation solaire / panneaux solaires {Kinshasa, Bunia, Goma, Mahagi…} | `/zones/{ville}` | services, case studies |
| système solaire hôtel Kinshasa, CADECO Mahagi, solaire serveur Goma… | `/references/{slug}` | city pages (they link up) |
| réalisations / références solaire RDC | `/references` | — |

\* No prices are published (owner decision). `/produits` answers price intent
honestly: *"le prix dépend de vos charges ; l'audit est gratuit."*

### 3.4 Rules that keep the structure clean

1. **Proof gates pages.** A location page exists only where there is an
   office or documented work (§5). A case study exists only where facts exist
   (§4.1).
2. **No service × city pages** (`/services/energie-solaire/goma`). That is
   the doorway pattern Google's spam policies name explicitly.
3. **Numbers come from data, never from copy.** Counts ("17 installations",
   "11 organisations") are derived from the data files. Today one fallback OG
   title hardcodes them (`app/references/[slug]/opengraph-image.tsx`).
4. **Every href to an entity comes from one helper** (`lib/routes.ts`, step
   2.1), so URL changes happen in one place.

---

## 4. Page specifications

### 4.1 Case study — `/references/[slug]`

**Purpose:** answer *"has this company done this kind of work, here?"* in
under ten seconds, then provide depth.

**Above the fold:**
- Visual breadcrumb (currently markup only).
- H1: `{intervention} {de/pour} {client} à {ville}`.
- One fact strip: city · sector · system size (only verified values) · year.

**Body, in order (each section renders only if its data exists):**
1. **Le contexte**: who the client is, what the site does.
2. **Le problème**: in operational terms (*"les appareils s'arrêtaient à
   chaque coupure SNEL"*).
3. **Ce que nous avons installé**: spec table (kWc / kWh / kVA, each labelled
   with its meaning and evidence level), plus what it powers.
4. **Avant / après**: client-reported figures, labelled as such, with
   period and scope.
5. **Photos / vidéo**: real site media, with alt text that describes what is
   visible.
6. **Related**: its service, its city, the closest catalogue kit (only if
   relevant and true), and 2–3 related studies.
7. **CTA**: pre-qualified (exists today).

**Title formula:** `{Client court} {Ville} : {intervention}`. Aim for ≤ 45
characters before the ` | Tech Solution RDC` suffix (Google truncates around
60; the suffix is the least useful part of a case-study title). Examples,
final after §7 answers:
- `Système solaire de l'hôtel Gracia, Kinshasa`
- `CADECO Mahagi : rénovation électrique et solaire`
- `GRECOM Goma : alimentation solaire d'un serveur`

**Today's titles** (`Alimentation solaire du serveur télécom — Goma`) carry
neither the client nor the scale. Recognisable client names are what
institutional buyers search for and click on.

**Evidence model.** Every figure carries one level, and the page renders the
label:

| Level | Rendered as | Example |
|---|---|---|
| `verified` | plain fact | "38,5 kWc de panneaux" (once Q14 is answered) |
| `client-reported` | "selon le client" + period | "Carburant : 400–600 $/mois avant, 50–80 $/mois après (selon l'exploitant)" |
| `pending` | not rendered | — |
| `do-not-claim` | never rendered; kept in data as a warning | "élimination du groupe électrogène" |

**The two Kinshasa studies: what we have (updated 2 Oct with the owner's answers).**

| | Hôtel Gracia | Bar à Mbudi |
|---|---|---|
| Name | **"Hôtel Gracia"**: spelling confirmed; naming and publication **permitted** | **Not published**, so the title is descriptive |
| Type | Hotel + salle de fête + bar (4 large halls, 10+ rooms) | **A bar with 12 rooms** (owner's statement) |
| Location | Victoire, near Pont Kalamu, Kinshasa | Mbudi (Mont-Ngafula), Kinshasa. The owner's "côté terrain cimetière" stays internal. |
| PV | 38,5 kWc (full array? Q15) | **6,5 kWc**, confirmed. The filename's "7kw" is wrong. |
| Storage | 120 kWh (nominal or usable? Q15) | 20 kWh (nominal or usable? Q21) |
| Conversion | 100 kVA | 12 kVA ("système de conversion", owner's words) |
| Loads | 4 halls, 10+ rooms (all circuits? Q15) | 12 rooms, 35 fans, "5 congélateurs et réfrigérateurs" (5 in total? Q21) |
| Before | Appliances stopped whenever SNEL was off; generator fuel **1 200–1 900 $/mois** (client-reported; period? Q15) | Appliances stopped whenever SNEL was off; generator fuel **400–600 $/mois on average, fuel only** (client-reported) |
| After | Runs through outages (client-reported); current fuel spend? (Q15) | Fuel **50–80 $/mois** (client-reported) |
| Equipment visible | FelicityESS inverter + Felicity Solar battery rack (name it? Q16) | — |
| Media | 3 photos + **42,6 s video**: rooftop walk-through of the PV field over the Kinshasa skyline, then from ~30 s a man speaks to camera (Q17) | 1 photo (technician fixing panels on a metal roof) |
| Slug | `hotel-gracia-solaire-kinshasa` | `bar-mbudi-solaire-kinshasa` |

Two cross-links worth proving:
- **Mbudi ↔ "Kit Solaire 12 kVA".** Same 12 kVA tier, but a different
  composition: Mbudi is 6,5 kWc / 20 kWh, the catalogue kit is 7,7 kWc
  (14 × 550 W) / 17,5 kWh. Link it as **"comparable"**, never "installed".
  The kit page gets a real installation at its scale.
- **Gracia → "sur mesure".** 100 kVA is above the 30 kVA top of the
  catalogue. That is the proof behind `/produits`'s *"Aucun palier ne
  correspond ?"* block.
- **Gracia → the `/references` hero.** The video's rooftop shot (PV field
  with the Kinshasa skyline) is the best "scale delivered" image the company
  has. Consider it for the hero once the case study is live (Phase 4).

### 4.2 References index — `/references`

- **Title:** `Réalisations solaires et électriques en RDC` (43 chars).
  Today's title (`Réalisations — MONUSCO, CARE, ALIMA, Afriland`) has the
  client names but no subject and no place.
- **Description**, derived from data: names 3–4 clients and the city span
  ("de Bunia à Kinshasa"), plus counts.
- **H1:** keep the brand voice and add the descriptor in the same line, e.g.
  *"Nos réalisations en RDC : **ce que nous avons livré, et où.**"*. The
  eyebrow stays.
- **Counting vocabulary, used everywhere:**
  - *Client*: an organisation.
  - *Réalisation*: a delivered installation at one site.
  - *Étude de cas*: a réalisation with its own page.
  - *Provinces livrées*: provinces with a documented réalisation.
  - *Zone d'intervention*: where the company can deploy.

  "9 provinces livrées" (`site.provincesDelivered`) remains a company
  declaration until six more provinces are documented. With Kinshasa added,
  documented provinces go from 3 to 4.
- **Make the page static.** It is dynamic (`ƒ`) only because it reads
  `?domaine=`. Read the filter client-side in `RealisationsList`
  (`useSearchParams` inside `Suspense`) and the page prerenders.
- **The 11 projects without case studies** stay as list rows, with no thin
  pages. A row links to a case study when one exists (as today), and to its
  city page when that city has one.
- **Fix the hero image** per Q3: either document Bambou or replace the image.

### 4.3 Product pages and quote modal

**Structure (delivered 14 Oct):**

| URL | Role |
|---|---|
| `/produits` | catalogue hub |
| `/produits/<gamme>` | category page |
| `/produits/<gamme>/<produit>` | product page |

- **Kits are the first category:** `/produits/kits-solaires` (the former
  `/produits` page, moved as is) and 9 product pages under it.
- **Other categories (power banks…)** each get their own folder and their own
  typed data. A power bank has no inverter, so it won't fit the `Kit` type.
  `lib/data/products.ts` holds only what every category shares.
- **The hub** guides by use (home / office / establishment, households first)
  plus a "hors catalogue" block. It does not repeat the ladder or the
  comparison table.

**Route:** `generateStaticParams` from `kits`, unknown slugs return 404, all
9 pages static (`○`/`●`).

**Content per kit:**
- H1 = kit name. Units corrected: **"650 VA"**, not "650 Va".
- The outcome line (`kit.outcome`).
- Composition table (onduleur / batterie / panneaux).
- "Ce qu'il fait tourner" (`runs` + `usage`).
- Phase and segment.
- "Le palier en dessous / au-dessus" (ladder neighbours).
- Installations of comparable scale (once proven, §4.1).
- 3–4 FAQs specific to this tier, **answered by the company** (Q24).
- What is included (the `commitments` block from `/produits`).
- CTA pair.

**Why these pages are not thin:** every kit has a unique composition and set
of uses. The risk is a template with three different numbers, so the
segment-specific guidance and the neighbour comparison carry the unique
value.

**Images:** there are no kit-specific photos. Use a shared fallback (real
inverter/battery photo from `public/photos/`) with an honest alt text. A
per-kit OG image is generated with the kit name and power.

**Quote modal ("Demander ce kit"):**
- **Progressive enhancement:** the trigger stays
  `<a href="/contact?kit={slug}">` and the click is intercepted once JS is
  ready. Without JS, or on middle-click, the existing funnel still works.
- **Fields:** Nom*, Téléphone/WhatsApp*, Ville du site*, Email (optional, as
  in `validateField`), Message (optional). The kit is shown as an editable
  chip.
- **Reuse, don't fork:** POST to the existing `/api/contact` with the same
  `validateField` rules (client and server), honeypot and rate limit. The
  lead email shows `source: kit_modal`.
- **Analytics:** the existing `devis_*` events with `source: "kit_modal"`
  and `kit`.
- **Accessibility:** dialog on desktop, full-height sheet under `md`, focus
  trap, `Esc`, return focus to the trigger, 16 px inputs (no iOS zoom).
- **Success state** in the modal: re-read the phone number to the visitor (as
  `/contact` does), plus a WhatsApp link.
- `/contact` itself is **closed** (HANDOFF §8). The modal is a new entry
  point, not a redesign.

**A correction to the product prompt's rationale.** `/contact?kit=` URLs
already canonicalise to `/contact` and the site has 13 URLs, so crawl budget
is not an issue here. The SEO gain is **having indexable product URLs at
all**. The UX gain is converting without a page change.

**Structured data: `Service`, not `Product` (changed 15 Oct).** The first
version used `Product` without `offers`, expecting only "no rich result".
Search Console reports it as an **error** instead: *"Either 'offers', 'review'
or 'aggregateRating' should be specified"*. None of the three is honest here:
an `Offer` requires `price` (Google, Product snippet doc, updated 8 Sept
2026); `price: 0` would say the kit is free; there are no customer reviews.
The kits are sold installed (sizing, installation, 1-year warranty, priced on
quote after the audit), so `Service` is also the accurate type: `name`,
`serviceType`, `category`, `description` (with the composition), `image`,
`provider`, `areaServed`. No Google rich result exists for `Service`, so
nothing is required and nothing errors. **Rule for future products** (power
banks…): `Product` only with a public price or genuine on-page reviews.
After deploy: Search Console → Product snippets → **Validate fix**.

**GBP Products are a separate system (owner's question, 15 Oct).** The kits
go into each Business Profile as **Products**, as the owner intends: name,
category "Kits solaires hybrides", photo, short description, button → the kit
page URL. GBP product entries are free-form; they don't read the linked
page's schema type, and Google doesn't cross-check the two. What both must
share is what people see: the same kit names, the same composition, the same
URLs. **Leave the GBP price field empty**: a price there is a public price.
If prices or genuine reviews are ever published, the kit pages go back to
`Product` with `offers`, and the site's markup and the GBP agree in type too.
**Rule:** never change an entity's type (product ↔ service) without stating
what it means for the GBP and the visible labels first.

### 4.4 Service pages — `/services/[slug]`

`/services` becomes a hub (short intro per service, the process, the FAQ).
Each service gets its own page:

- the existing `description` and `capabilities`;
- **its case studies** (by `projectCategory`) and its project rows;
- the related kits (solar and backup only);
- the cities where it has been delivered;
- the service-specific FAQ.

`Service` JSON-LD with `provider` → Organization `@id` and `areaServed`.

Slugs: keep the 5 existing ones; rename `maintenance-froid` →
`maintenance-climatisation` to match its title (anchors aren't server URLs, so
no redirect is needed; keep the old slug as an alias for `/contact?service=`).

### 4.5 Location pages — `/zones/[ville]`

Spec per tier in §5.1. Common to all:
- H1 `Installation solaire à {Ville}`. Title the same (≤ 40 chars + suffix).
- Proof first: the city's case studies and project rows, with photos.
- **Only facts the company supplies about operating there** (Q25): which
  base deploys, how the audit visit works, typical lead time, local
  maintenance.
- **The "remove the city name" test:** content that would still be true if
  the city name were removed is not local content and doesn't count toward
  the gate.

### 4.6 Metadata formulas (summary)

| Page | Title (before suffix) | Description carries |
|---|---|---|
| Case study | `{Client} {Ville} : {intervention}` | problem → system → outcome, 1 sentence each |
| `/references` | `Réalisations solaires et électriques en RDC` | clients named, city span, counts from data |
| Product | `{Kit} — {tier/usage}` e.g. `Kit solaire hybride 5 kVA — villa` | composition + what it runs + "pose incluse, audit gratuit" |
| Service | `{Service} en RDC — {promesse courte}` | 2 named references + delivery promise |
| Office city | `Installation solaire à {Ville}` | address fragment + named local projects |
| Proven city | `Installation solaire à {Ville}` | named local projects + which base serves it |

Descriptions: 120–155 characters, with a reason to click (proof), not a
summary (rule set in August, `de8ac46`).

---

## 5. Location strategy

The owner wants Goma, Lubumbashi, Mahagi, Matadi, Beni and Kisangani taken
into account alongside the Bunia and Kinshasa offices, so that no city is
left out. Every city below is covered. **Not every city gets a page today**,
because a page with nothing local in it ranks poorly, converts poorly and is
what Google's spam policy calls a doorway ("pages targeted at specific
regions or cities that funnel users to one page"). On a site this size, six
thin city pages would be a third of the site.

**What "covered" means.** Every city is reachable through at least three
surfaces from day one, and has a written trigger that promotes it to a page:
1. it is named, with a real sentence, in its serving office's page;
2. it is in that office's GBP *service areas* (up to 20 per profile);
3. it is in the `areaServed` of that office's `LocalBusiness` markup.

### 5.1 Three tiers

| Tier | Condition | Page | Schema |
|---|---|---|---|
| **1. Office** | Staffed office with signage, open the stated hours | `/zones/{ville}`: full NAP, hours (local time), map/GBP link, local projects, the cities served from here, local FAQ, office photos | `LocalBusiness` (own `@id`, `geo`, `openingHoursSpecification`, `areaServed`) |
| **2. Proven city** | ≥ 1 published case study in the city **and** ≥ 3 company-supplied local operating facts | `/zones/{ville}`: local projects first, then how it's served and from which base | No `LocalBusiness`, because there is no address to mark up. `WebPage` + `BreadcrumbList`; projects carry `contentLocation`. |
| **3. Served** | Company deploys there, nothing documented yet | No standalone page. Named on the serving office page and on the `/zones` hub. | `areaServed` of the serving office |

### 5.2 City by city

Demand is qualitative (by city size and commercial activity) and must be
validated (step 11.3).

| City | Province | Proof on the site today | Demand | Tier now | Treatment now | Promotes when |
|---|---|---|---|---|---|---|
| **Bunia** | Ituri | HQ; 9 of 17 projects (Afriland study, CARE, ALIMA, Save the Children, 3 radios, 2 LTJ sites) | medium | **1** | Office page | — |
| **Kinshasa** | Kinshasa | Office; **2 new studies** (Gracia, Mbudi) | highest | **1** | Office page, the most important on the site | — |
| **Goma** | Nord-Kivu | GRECOM study + LTJ salle du royaume; RCCM registered in Goma; **permanent technicians** but **no office** (confirmed) | high | **2** | City page, with no `LocalBusiness`; local content = "une équipe technique permanente à Goma" | — |
| **Mahagi** | Ituri | PDL-145T and CADECO studies + Radio La Colombe | low | **2** | City page: strongest proof outside HQ, almost no competition | — |
| **Butembo** | Nord-Kivu | LTJ backup study | medium | 3 → 2 | Section of the Bunia page | Q25 facts arrive |
| **Kisangani** | Tshopo | none (the Bambou photo was **not** a Tech Solution project, removed) | medium-high | **3** | `/zones` hub + GBP service area of the serving office (Q25) | first documented project |
| **Lubumbashi** | Haut-Katanga | Listed in `presenceCities`. **No shop**: partner contacts only (the "boutique" photo shows a partner displaying the company poster) | high | **3** | `/zones` hub + GBP service area of the serving office (Q25) | first documented project |
| **Beni** | Nord-Kivu | none (in no data file) | medium | **3** | Bunia page section + GBP service area | first documented project |
| **Matadi** | Kongo-Central | `presenceCities` only | low-medium | **3** | Kinshasa page section + GBP service area | first documented project |
| Isiro, Kenge, Kolwezi | | `presenceCities` only | low | 3 | `/zones` hub | first documented project |
| Numbi, Aveba | | 1 project each | ~none | — | stay in their study / list row | — |

**Launch set (confirmed by the owner's answers):** `/zones` hub + Bunia +
Kinshasa (offices) + Goma + Mahagi (proven cities). That is 4 location pages,
each with something no competitor can copy. Kisangani, Lubumbashi, Beni and
Matadi are Tier 3 until their first documented project.

**The `/zones` hub** names every city with an honest status: "Bureau",
"Réalisations documentées" or "Intervention sur demande". The existing DRC
dot map can live here, with dots linking to pages that exist. This is the
legitimate place for "Lubumbashi" or "Beni" to appear in crawlable text
before they have a page.

---

## 6. NAP and footer

### 6.1 NAP audit

| | Site (`lib/site.ts`) | Public farde PDF | techsolution-congo.com | Lubumbashi poster | Bunia GBP (Aug, unclaimed) |
|---|---|---|---|---|---|
| Name | Tech Solution RDC / TECH SOLUTION RDC (legal) | TECH SOLUTION | "TechSolution-Congo", "TechSolution DRC" | "Tech Solution" | ? |
| Website | techsolution.cd | **techsolution-congo.com** | itself | `techsolution?rdc.com`: **does not resolve** | ? |
| Email | info@techsolution.cd | **info@techsolution-congo.com** | **techsolutiondrc@gmail.com** | `sales@…rdc.com` (dead domain) | ? |
| Phone | +243 821 250 250, **for both offices** | same | same | 0821250250 | ? |
| Bunia | "32 Avenue Bakuwasa, Quartier Hoho, Commune de Mbunya" (**since 18 Sept**; before: "Boulevard de la Libération, près du Rond-Point Zéro") | — | Bunia | — | **"LUXBEAUTY, Yambi yaya"** |
| Kinshasa | "Avenue Mbomu numéro 157 commune de Kinshasa" (**since 18 Sept**; before: "Limete, 2ᵉ Rue Industrielle") | — | — | — | none |
| Hours | "Lun.–Sam., 8h00–17h00 **(heure de l'Est)**", for both offices | | | | **"opens 8 pm"** |

**Issues, in order of impact** (status after the owner's answers, 2 Oct):
1. **Three domains and four emails** in circulation; two of them are dead or
   legacy. The farde is fixed (1.3); the legacy site depends on the agency
   (1.4); social bios and print are 12.6.
2. ✅ **Time zone.** The DRC has two (Kinshasa UTC+1, Bunia UTC+2), and both
   offices open 8h–17h *local* time. The label now reads "heure locale"
   instead of "heure de l'Est".
3. ✅ **Address format.** Kinshasa now follows Bunia's pattern (number, street,
   commune).
4. ✅ **Addresses changed on 18 Sept.** Confirmed: the current ones are the
   real ones. Any citation with the old ones ("Boulevard de la Libération",
   "Limete, 2ᵉ Rue Industrielle", and the GBP's "LUXBEAUTY") must be
   corrected (12.1, 12.6).
5. **One phone number for two offices**: confirmed, and acceptable. Google
   prefers a per-location line, so if Kinshasa ever gets one, add it to that
   profile.

### 6.2 Canonical NAP (confirmed 2 Oct; type exactly this into the GBPs)

```
Name      Tech Solution RDC           (legal name TECH SOLUTION RDC only in the legal bar + schema legalName)
Website   https://techsolution.cd     (each GBP → its /zones/{ville} page)
Email     info@techsolution.cd
Phone     +243 821 250 250            (shared by both offices)
Hours     Lun.–Sam. 8h00–17h00, local time (Bunia UTC+2 · Kinshasa UTC+1)

Bunia — Siège        32 Avenue Bakuwasa, Quartier Hoho, Commune de Mbunya, Bunia, Ituri
Kinshasa — Antenne   157 Avenue Mbomu, Commune de Kinshasa, Kinshasa
```

These strings come from `lib/site.ts`. The site, the schema, the GBPs, the
social bios and the directories carry them identically.

### 6.3 Footer — verdict and proposal

**Measured on the production build, 2 Oct:**

| Viewport | Footer height | Screens | Share of the homepage | Share of a case-study page |
|---|---|---|---|---|
| 360 × 780 | 1 965 px | **2,52** | 18 % | **54 %** |
| 390 × 844 | 1 882 px | **2,23** | 18 % | **53 %** |
| 768 × 1024 | 1 444 px | 1,41 | 16 % | 39 % |
| 1024 × 768 | 984 px | 1,28 | 12 % | 38 % |
| 1440 × 900 | 898 px | 1,00 | 11 % | 33 % |

**Verdict:** desktop is acceptable (it was cut from 1 073 to 898 px in
August, `0726b66`). **On mobile it is too big**: a phone visitor scrolls more
than two screens of footer, and on a case study the footer is longer than the
content. Mobile is where the DRC audience is.

**Where the height goes on mobile:** the conclusion band (~820 px) stacks a
title, lead, 2 full-width buttons, the contact line, and then a **brand block**
(logo, a tagline that repeats the header, a "Certifié & agréé" badge, 3 social
icons). The utility rows (~800 px) stack 2 tall office cards with a region
line, plus 2 link lists.

**Proposal: tighten and repurpose, not redesign.** The conclusion band stays,
because the design system makes the footer the single conclusion of every
page.

| Keep | Change | Remove / move |
|---|---|---|
| Conclusion title + 1 primary CTA + WhatsApp | Buttons side by side from 360 px if they fit; contact line stays one line | — |
| Navigation + Expertises lists | Expertises link to `/services/{slug}` (not anchors) | — |
| Office cards | Compact: city, role, address, **phone and hours per office in local time**, link to `/zones/{ville}` (the NAP hub) | Region line folds into the address |
| Legal IDs bar | Social icons join this bar | — |
| — | Add one line: "Nous intervenons aussi à : Goma · Mahagi · …", linking **only to pages that exist** | — |
| "Certifié & agréé" badge: **stays** (owner decision, 2 Oct) | Moves into the legal bar | Brand block: the logo (already in the header) and the repeated tagline |

**Targets:** ≤ 1 150 px at 390 (≈ 1,35 screens) and ≤ 760 px at 1440. Verify
by measurement, as in August.

**Correction (15 Oct, owner):** removing the brand block also removed the
**name** from the NAP. A name, address and phone only count as a NAP together.
The offices column is now one `<address>`: glyph + "Tech Solution RDC" (the
exact GBP name), the two office cards, then the shared phone and email
(moved from the conclusion). Cost: +4 px at 390 (1 126 px), 0 at 1440.

---

## 7. Questions

### 7.1 Answered (2 Oct 2026)

| Q | Owner's answer | Consequence |
|---|---|---|
| Q1 legacy domain | Run by another agency; access unlikely; the site goes **offline within days**; owner will ask for a redirect | 1.4 reworded (ask for spam removal → 301 → transfer) |
| Q2 GSC for the legacy domain | — | moot if the site goes offline; dropped |
| Q3 Hôtel Bambou, Q4 Nzulo | **Not Tech Solution projects** | removed (1.2) |
| Q5 International Medical Corps | **A client** | logo stays; needs a project row (Q28) |
| Q6 addresses | The current ones are the real ones | NAP frozen (§6.2) |
| Q7 hours / phone | 8h–17h **local time** at both offices; one shared number | "heure locale" label (1.6) |
| Q8 Lubumbashi | **No shop**; partner contacts only | Tier 3 |
| Q9 Goma | **No office**; Bunia and Kinshasa only | Tier 2, no `LocalBusiness` |
| Q14 Gracia | Spelling correct; **rights to publish**; hotel + salle de fête + bar | named case study, figures publishable as client-reported |
| Q19 Mbudi (from the owner's statement) | A **bar with 12 rooms**; **6,5 kWc** / 20 kWh / 12 kVA; 35 fans, 5 freezers and fridges; appliances stopped without SNEL; fuel 400–600 $ on average, fuel only → now 50–80 $/mois | §4.1 table; slug `bar-mbudi-solaire-kinshasa` |
| Q22 certification | "Leave it for now" | badge and "certifié" wording untouched |

### 7.1 bis Answered (14 Oct 2026)

| Q | Owner's answer | Consequence |
|---|---|---|
| Q27 Victron image | "Not really sure… use the hotel Bambou maybe" | **Not Bambou**: the owner said on 2 Oct it isn't theirs. Replaced with the **Hôtel Gracia battery room** (their own Felicity lithium rack), and the outside file deleted. |
| Q29 counting | 19 installations (17 + the 2 Kinshasa projects) and 60 households, kept separate | Every count is now derived from data: "19 installations documentées · 60+ foyers équipés" |
| Q30 MONUSCO, LTJ | One client, several projects; group them | Radio projects now have client = MONUSCO / FRAPEZ, beneficiary = the station. Grouped display comes in Phase 4. |
| Farde | Owner edited it and says it can be public | **The edit only drew white boxes over the text.** Every number, name and the old domain were still in the file. Published instead: the owner's choices (whole contact block removed, `www.techsolution.cd`) applied as a true redaction. |
| Q17 video | The speaker is **Jonathan Mupenda, CEO and lead engineer**; the narration isn't usable | Show the rooftop part, muted. No transcript. |
| Q13 dates | Gracia and Mbudi: 2026. Farde projects: mostly 2025, some 2024. | `year: 2026` on the two Kinshasa projects; the farde set stays "2024–2025" |
| Q16 brand | Felicity is the lithium they use | Can be named (done in the Gracia image alt) |
| Q21 Mbudi | 5 appliances in total; generator still used minimally | "Groupe désormais d'appoint" (client-reported) |
| Q5b JW.ORG logo | Allowed | stays |
| Q10 payment | No mobile money; payment at the office | No `paymentAccepted` |
| Q23 kits | 8, 12, 20 kVA are hybrids too | All 9 named "Kit Solaire Hybride…"; 30 kVA → "…30 kVA Triphasé". Old slugs kept as aliases. |
| Q24 FAQ | "Create the questions, I'll answer them" | `docs/FAQ-PRODUITS-QUESTIONS.md`: 16 questions waiting for answers |
| Q25 local operations | **Permanent technicians in Bunia, Kinshasa and Goma.** Elsewhere, technicians are hired locally on contract, per job; local maintenance works the same way. | Goma's page can say it has a permanent team. Tier 3 pages must say the team is assembled locally. |
| Q26 photos | Office photos coming. **Complaint: the site talks to companies more than to households.** | §17.2 |
| Q31 the CEO | Yes: Jonathan Mupenda, CEO and lead engineer, on the site with his photo | Done on `/about` (§17.3); FAQ questionnaire sent to the owner |
| Q33 his bio (15 Oct) | Electrical and electronics engineer (school unknown). Solar systems engineer at BBOXX 2019–2022, then head of the repair centre in Bunia and Goma 2022–2024. **Founded** the company in 2024 for what the sector overlooked: product quality, ongoing maintenance, warranty. Quality and durability over price; a lifetime partnership rather than a one-off installation; introduced **payment by instalments** for households and businesses. Goal: solve DRC's electricity problem with solar. | `/about` rewritten (§17.3); `founder` in the JSON-LD |

### 7.2 Still open

- **Q28** International Medical Corps: which project, where, when?
- **Q11** Real system sizes for the 6 existing studies (owner asking).
- **Q12** Which outcomes are true for each existing study (owner asking).
- **Q15** Gracia: topology, full array?, nominal or usable 120 kWh, which
  loads, the period of the 1 200–1 900 $ figure, current fuel spend.
- **Q20 bis** Mbudi: is 20 kWh nominal or usable?
- **Q24** The 16 product FAQ answers (`docs/FAQ-PRODUITS-QUESTIONS.md`).
- **Q26** Office photos, plus **real household photos**, with the families'
  agreement (§17.2).
- **Q34 (new)** Payment by instalments: for which kits, what deposit, over
  how many months, on what conditions? Until answered, `/about` mentions it
  without detail. Once answered, it belongs on the kit pages and in the
  mega menu ("paiement échelonné" is a real search for households).
- **Q32 (new)** Lubumbashi, Kisangani, Matadi, Beni: which office's GBP
  should list each one as a service area?

---

## 8. The step-by-step implementation plan

Phases run in order. Inside a phase, steps can run in any order unless
noted. Size: **S** < ½ day, **M** ≈ 1 day, **L** 2–3 days.

### Phase 0 — Facts and decisions (owner, no code)
- [x] **0.1** First round of answers (§7.1); recorded in the data-file
  comments where they apply (`lib/site.ts`).
- [x] **0.1 bis** Second round (§7.1 bis).
- [ ] **0.2** Freeze the URL map in §9. **Products frozen 14 Oct**
  (`/produits/kits-solaires/<kit>`, hybrid names, old slugs as aliases).
  Still to freeze: case-study slugs, service slugs, the `/zones` prefix.

### Phase 1 — Stop the bleeding (P0)

Delivered in the working tree on 2 Oct and verified:
- `next build`, `tsc` and `eslint` clean;
- 10 rendered pages grepped with no placeholder or banned string left;
- screenshots at 1440 and 390;
- the default share image comes out at 90 KB JPEG.

- [x] **1.1** Placeholder specs gone: the card renders `spec` only when a
  verified value exists. Absolute claims removed from the 6 studies (zéro
  interruption, autonomie totale/complète, sans groupe électrogène,
  disponibilité maximale, conforme / aux normes, instantané). The remaining
  "results" are still unverified copy, handled in 4.4 (Q12). "Certifié"
  wording kept (Q22).
- [x] **1.2** Outside photos removed. The Bambou hero on `/references` is
  replaced by `drone-ensemble-panneaux`, the default share image by
  `pose-panneau-equipe`, and Nzulo on `/about` by `rails-montage-toiture`
  (a technician in a branded coverall). The three outside files are deleted,
  including the unused Kigali one. **Still open:** Q27
  (`victron-triphase-batteries`), Q28 (IMC row), Q5b (JW.ORG).
- [x] **1.3** Public farde redacted with PyMuPDF:
  - the 10 contact numbers now read "sur demande" (the text is removed, not
    covered);
  - the old email and domain now read `info@techsolution.cd` and
    `techsolution.cd`, in the farde's own Montserrat;
  - background art intact, internal copy untouched, new SHA-1.

  After deploy: check whether Google indexed the PDF
  (`site:techsolution.cd filetype:pdf`) and request a recrawl.
- [ ] **1.4 (owner ↔ agency)** Legacy domain. Ask the agency, in this order:
  1. delete the spam "Customer Reviews" now;
  2. put a 301 from every URL to techsolution.cd for at least 12 months;
  3. transfer the domain to the company.

  If the site just goes offline, the conflict ends but its backlinks are
  lost. Once the registration lapses, anyone can buy a domain that carries
  your name and number in old caches and print. At minimum, ask that it not
  be released.
- [x] **1.5** `www` → 308, **fixed by the owner on 15 Oct** (`www` added to
  the project with a 308 redirect; verified: one hop, query string kept).
  Original diagnosis: **found 15 Oct:**
  `www.techsolution.cd` is answered by Vercel (`server: Vercel`, DNS on
  `vercel-dns.com`), with a 307 to the apex. But the domain isn't in the
  `techsolution` project, so it's attached to **another project** in the
  account, or set at team level.

  To fix:
  1. Team → Domains → `techsolution.cd` shows which project holds `www`.
  2. Either change its redirect to "308 Permanent Redirect" there, or remove
     it there and add it to this project with "Redirect to Another
     Domain → techsolution.cd · 308".

  Also, `http://www` takes two hops (308 to `https://www`, then 307); the
  fix makes it one.
- [x] **1.6** Hours label is now "(heure locale)". Kinshasa reads "157 Avenue
  Mbomu, Commune de Kinshasa", Bunia's pattern. `lib/site.ts` records "two
  offices, one number, no Goma office, no Lubumbashi shop". Stale footer
  comment fixed.
- [x] **1.7** `middleware.ts` → `proxy.ts` (`export function proxy`); the
  maintenance page is now in French. The "short outages only" rule is
  documented in the file. Verified: 503 + `Retry-After` with the flag on, 200
  without.
- [x] **1.8** (found while verifying) "Nos 11villes d'intervention" on
  `/references`, live in production, fixed with an explicit `{" "}`. All
  pages scanned; no other swallowed space.
- [x] **1.2 bis** (14 Oct) `victron-triphase-batteries` (outside source,
  Q27) replaced by `hotel-gracia-local-batteries.webp` on Backup & stockage,
  and the file deleted. No image from the outside set is left in
  `public/photos/`.
- [x] **1.3 bis** (14 Oct) The farde is regenerated from the owner's version.
  The owner's cover boxes became true redactions:
  - the whole contact blocks are removed (names, job titles, numbers);
  - the email and website now read `info@techsolution.cd` /
    `www.techsolution.cd` in Montserrat.

  Verified: zero annotations, zero reference persons, only the company number
  left in the text layer.
- [ ] **1.9** Commit once the owner has reviewed it.

### Phase 2 — Data foundation (everything after reads from it)
- [x] **2.1** `lib/routes.ts` is the only place entity URLs are built:
  `productCategoryHref`, `kitHref`, `serviceHref` (still `/services#…` until
  Phase 5), `caseStudyHref`, `contactHref`. Kit components, footer, cards,
  the realisations list, the case-study CTA and `/services` all use it.
  `cityHref` arrives with Phase 6.
- [x] **2.2** `CaseStudy` extended (14 Oct). New fields:
  - identity and titles: `previousSlugs`, `h1`, `metaTitle`, `clientNamed`,
    `district`, `year`;
  - dates: `published` (the page's publication date, not the install date),
    `revised`;
  - content: `context`, `specs[]` (each with `evidence`:
    `installateur` | `client`), `loads`, `fuel` (always client-reported),
    `resultsReported`, `gallery` (`wide` or 4:5);
  - links: `relatedKit` (`comparable` | `installed`), `imagePosition`,
    `beyondCatalogue`.
  - helpers: `findCaseStudy`, `relatedCaseStudies`, `caseStudyRedirects`.

  The file is read by `next.config.ts`, so it may import types only.
- [ ] **2.3 (S)** `lib/data/locations.ts`: cities with `slug`, `province`,
  `tier`, `servedFrom`, `localFacts[]` (company-supplied), coordinates. Derive
  `presenceCities` and the map from it.
- [x] **2.4** Every count is derived from data:
  - home (Authority tiles and proof band);
  - `/references` (meta description, lead, stats, both share images);
  - footer and mega menu.

  One figure is declared rather than counted, `site.householdsEquipped` (60),
  flagged "⚠️ À SOURCER". "Organisations" is now "clients nommés": the
  anonymous Mbudi client has a project row but no client row.
- [x] **2.5** Per-item `revised` dates feed the sitemap: products through
  `ProductCategory.revised`, case studies through `CaseStudy.revised`.
  `CASE_STUDIES_REVISED` is gone.

### Phase 3 — Products
- [x] **3.1** Delivered 14 Oct:
  - `/produits` is the hub;
  - `/produits/kits-solaires` is the range (the former page, unchanged);
  - `/produits/kits-solaires/[slug]` × 9 pages, static, with
    `dynamicParams = false` (unknown or old slug → 404).

  Each kit page has, in order:
  - breadcrumb Produits › Kits solaires › Kit;
  - H1 = kit name;
  - three-figure spec strip;
  - composition;
  - what it powers;
  - shared commitments;
  - the neighbouring tiers;
  - `Product` JSON-LD with no `offers`.

  Verified in production HTML: unique title, description and canonical; one
  H1; Product, BreadcrumbList and Organization all parse.
- [x] **3.2** Share image per kit (segment, phase, name and promise, segment
  photo), plus one each for the hub and the range.
- [x] **3.3** Quote modal `components/products/kit-quote.tsx` (14 Oct).
  - **Trigger:** `KitQuoteLink`, a real link to `/contact?kit=`. A plain
    click opens the modal; ⌘/Ctrl/middle-click and no-JS go to the funnel.
    It takes the **kit slug, not the object**: a `Kit` carries icon
    components, and passing it from a server page broke the kit page with a
    500 that `tsc` never sees.
  - **Form:** five fields (name, phone, city, optional email and message).
    The kit can be changed. Validation is `validateField`, with errors under
    each field and focus on the first. The honeypot is kept.
  - **Submission:** sends `source: "modal"`, `need: energie-solaire` and a
    `siteType` derived from the segment; emits the `devis_*` events.
  - **Success state:** reads the phone number back and offers WhatsApp.
  - **Layout:** a sheet on mobile, a dialog from `sm` up; the sticky action
    bar from `/contact` keeps the submit button visible down to 360 × 740.
  - **API, additive only:** `source: "modal"` is accepted; for modal requests
    alone, the timing question becomes optional. The `/contact` funnel's
    rules are unchanged (a probe without timing still gets 422). The lead
    email shows the source: "Fenêtre « Demander ce kit »".
- [x] **3.4** Two calls to action on the ladder, the comparison table, the
  home cards and the kit page: "Demander ce kit" opens the modal, and
  "Fiche / En savoir plus" goes to the product page. Old `?kit=` links still
  pre-fill via `findKit`.
- [x] **3.5** Sitemap: hub, range and 9 kits from data (24 URLs).
- [x] **3.6** Modal tested in Chrome at 1440/1024/390/360.
  - **Interaction:** opens without changing the URL; an empty submit gives 3
    errors and focuses the first; changing the kit changes `siteType`;
    success state; closing returns focus to the trigger; Esc closes;
    ⌘-click opens a new tab on `/contact`; the table's "Devis" opens the
    right kit; inputs are 16 px; no JS → funnel.
  - **Requests:** browser submissions were intercepted with `page.route`.
    The server schema was checked by posting the modal's exact payload with
    the honeypot filled: 200, and no email sent.

### Phase 3 bis — Navigation (delivered 14 Oct)
- [x] **3b.1** Mega menus for Services and Produits
  (`components/layout/site-nav.tsx`). Disclosure pattern:
  - hover intent 90 / 160 ms; click; ↓ moves into the panel;
  - Esc returns focus to the trigger; clicking outside, scrolling or following
    a link closes the panel;
  - the header leaves its blended-into-hero state while a panel is open;
  - closed panels are `hidden`, so their links are in the served HTML and
    their photos load only on first open.

  **Produits:** kits by use, households first; a star marks the most
  requested; "Au-delà de 30 kVA" aside; the commitments in a bottom strip.
  **Services:** the 6 services with icon and promise; a dark "Preuves sur le
  terrain" aside showing the derived count; audit promise.
  **Mobile:** the same content as accordions in the slide-out menu, with the
  current section open by default.

  Verified: every interaction scripted in a real browser; 1440 and 1024
  without overflow.

### Phase 4 — References (delivered 14 Oct, except 4.4)
- [x] **4.1** Case-study template v2 (`app/references/[slug]/page.tsx`):
  - **Header (dark):** breadcrumb, category and place, H1 (`h1` field),
    summary, fact strip (place and district, sector, year, system).
  - **Body:** contexte, problème, ce que nous avons installé (spec table,
    each value with its evidence chip), ce que le système alimente,
    gallery.
  - **Sticky aside:** a fuel card (before/after, "Selon le client", "Pas
    encore chiffré" when unknown), results (marked as client-reported when
    they are), and the pre-qualified CTA.
  - **"Pour aller plus loin":** the service, the closest kit (or the
    references list), 3 related studies, and a sign-off linking to `/about`.
  - **Markup:** `Article` (headline, image, `datePublished`/`dateModified`,
    `contentLocation`; `about` only when the client is named) +
    `BreadcrumbList`. `dynamicParams = false`.
- [x] **4.2** **Hôtel Gracia** and **a bar in Mbudi** published, with only
  the confirmed facts.
  - **Media:** two stills from the rooftop video (the speaking part is not
    used), the façade with its "SALLE GRACIA" sign, the battery room, and the
    Mbudi technician photo.
  - The Mbudi page links to the 12 kVA kit as **comparable**, never
    "installed".
- [x] **4.3** Six slugs migrated (§9): each old URL now 308-redirects to
  its new URL, generated from `previousSlugs` in `next.config.ts` (verified
  on the production build). Internal links follow via `lib/routes` and the
  `caseStudy` field of each project row.
- [ ] **4.4** Rewrite the 6 older studies: **titles, H1s and metaTitles
  done**; the "results" wait for Q11–Q13.
- [x] **4.5** `/references`:
  - title "Réalisations solaires et électriques en RDC";
  - description with client names and counts from data;
  - H1 "Nos réalisations en RDC : ce que nous avons livré, et où.";
  - **static** (○): `?domaine=` is read client-side inside a `Suspense`
    whose fallback is the full list, so all 19 rows are in the served HTML;
  - **grouped by client**: LTJ (4) and MONUSCO / FRAPEZ (5) are one block
    each;
  - Kinshasa projects at the top, and "Kinshasa — Kinshasa" shortened to
    "Kinshasa".
- [x] **4.6** Verified on the production build:
  - the 6 old slugs return 308 to the new ones; an unknown slug returns 404;
  - each study has one H1, a self-canonical and parsing JSON-LD;
  - `?domaine=energie-solaire` → 8 of 19 rows;
  - no overflow at 390 or 1440.
- [x] **4.7 (link graph)** The kit ↔ study links go both ways:
  - 12 kVA → Mbudi ("Sur le terrain, à ce palier");
  - 30 kVA → Gracia (the "au-delà, sur mesure" proof);
  - the `/produits` hub's "hors catalogue" block → Gracia.

### Phase 5 — Services (delivered 15 Oct)
- [x] **5.1** `app/services/[slug]/page.tsx` × 6, static,
  `dynamicParams = false`. Each page has, in order:
  - its own H1, metaTitle and description;
  - "Ce que nous faisons";
  - the proof: the domain's case studies + project rows + "Livré notamment
    à" with links to city pages;
  - the kits (solar and backup only);
  - the five other services;
  - `Service` JSON-LD and a share image.

  `maintenance-froid` stays the funnel's ID; its page lives at
  `/services/maintenance-climatisation` (`urlSlug`).

  `/services` becomes the hub (index → pages, method, FAQ). Its title no
  longer competes with the solar page: "Services solaires et électriques en
  RDC".
- [x] **5.2** Every `/services#…` link now points to a service page (footer,
  mega menu, cards, home, case studies) via `serviceHref`. Sitemap from data.
  Copy errors left by the "centrale" → "système" rename fixed ("Systemes",
  "un système … dimensionnée", "elle produit").

### Phase 6 — Locations (delivered 15 Oct)
- [x] **6.1** `/zones` hub:
  - **H1:** "Où nous intervenons en RDC : deux bureaux, des chantiers
    documentés dans 4 provinces." (counted from the data, not declared);
  - **city cards:** one per city with a page;
  - **"Ailleurs en RDC":** Butembo, Beni, Kisangani, Lubumbashi, Matadi.
    They are named without a page, with the confirmed operating model, and
    Butembo links to the LTJ study.
- [x] **6.2** `/zones/bunia` and `/zones/kinshasa`:
  - address, hours **in local time**, permanent team, contact card,
    Maps link;
  - the city's projects, the services delivered there, the other cities;
  - `LocalBusiness` from `lib/jsonld.ts`, shared with `/contact` under
    **one `@id`** (`/zones/<city>#bureau`). Name "Tech Solution RDC", the
    same as the GBP.
- [x] **6.3** `/zones/goma` (permanent team, no office) and `/zones/mahagi`
  (3 projects, technicians hired locally). **No `LocalBusiness`**, because a
  city page never invents an office.

  Only facts the owner gave: permanent teams in Bunia, Kinshasa and Goma;
  local hiring elsewhere; the founder's repair centre in Bunia and Goma.
  Unverifiable sentences were removed before publication ("connaît les
  pannes", "premiers chantiers"…). Headline counts are derived ("trois
  chantiers livrés").
- [ ] **6.4** Kisangani / Lubumbashi / Butembo / Beni / Matadi: a page when
  their trigger fires (a documented project + local facts).
- [x] **6.5** Verified:
  - `/zones/lubumbashi` returns 404 (no page without proof);
  - Kinshasa → `LocalBusiness` `#bureau`; Goma → none.

### Phase 7 — Footer and the link graph (delivered 15 Oct)
- [x] **7.1** Footer rebuilt (§6.3):
  - **removed:** the brand block (logo, repeated tagline);
  - **moved up:** the offices, as compact cards (address, local hours,
    "Itinéraire", link to the city page);
  - **added:** a "Zones" column, plus one line linking the proven cities;
  - **phone layout:** the site map sits behind a "Plan du site" toggle (its
    links stay in the HTML); WhatsApp is an icon next to the CTA, so the
    two sit on one row;
  - **legal bar:** the social icons and the "Certifié & agréé" badge (kept,
    owner decision).

  | | Before | After |
  |---|---|---|
  | 390 px | 1 882 px (2,23 screens) | **1 122 px (1,33)** |
  | 360 px | 1 965 | 1 122 |
  | 1440 px | 898 | **740** |
  | Share of a case-study page (390) | 53 % | 22 % |
- [x] **7.2** Link pass:
  - case study → its city (3rd "Pour aller plus loin" card);
  - service → its cities;
  - city → its studies, services and the other cities;
  - `/references` → city pages in the cities line;
  - footer → services, cities, hub.
- [x] **7.3** Production-build crawl, links counted in `<main>` only
  (header and footer excluded):
  - **35 of 36** sitemap pages have ≥ 3 contextual inbound links; the 36th
    is `/confidentialite`, a legal page linked from the footer;
  - **0** internal links to a redirect or a 404.
- [x] **7.4** Typography: a title never breaks before its colon (non-breaking
  space). Verified at 5 widths on 5 pages.

### Phase 8 — Structured data consolidation
- [ ] **8.1 (M)** One `@graph` per page with stable `@id`s per §10.
- [ ] **8.2 (S)** `/llms.txt` (key pages, one line each). Costs little, and
  the evidence that AI engines use it is still thin.
- [ ] **8.3 (S)** Validate every page type in the Rich Results Test and
  validator.schema.org; zero errors.

### Phase 9 — Images and video
- [ ] **9.1 (S)** Alt-text audit of every image against §12 rules.
- [ ] **9.2 (M)** Gracia video per §12 (`ffmpeg` is not installed: `brew
  install ffmpeg`). *Blocked by Q17.*
- [ ] **9.3 (S)** OG images for the new page types (city, service, product).

### Phase 10 — Technical QA and performance
- [ ] **10.1 (S)** §13 checklist on the production build.
- [x] **10.2** Fixed 14 Oct (`components/motion.tsx`, Tailwind `reveal-up`
  keyframe):
  - `Reveal mode="mount"` (home hero, `PageHero`, case-study header) is now
    **pure CSS**: same curve, duration and offset, painted with the
    stylesheet instead of after hydration. Reduced motion is handled by
    `motion-safe:`.
  - Scroll reveals keep framer, but their **initial state is the same on
    server and client**; the preference only zeroes the transition, which is
    never written into the HTML.
  - Verified on the production build:
    - **all JS bundles blocked → H1 fully visible** on `/`, `/produits` and a
      case study (before: invisible forever);
    - **reduced motion → 0 hydration errors** on dev and prod (before: one
      per page).
- [ ] **10.3 (S)** Local lab, 14 Oct, Slow 4G + CPU ×4, 390 px: home LCP
  **1 772 ms = FCP** (the title no longer waits for JS). On the 5 kVA kit
  page LCP is a section heading below the hero, still revealed by JS
  (4 240 ms). Next step (**10.4**): make scroll reveals visible in the
  server HTML and hide, at hydration, only what is below the current
  viewport. That way no content is ever JS-gated. Re-measure on production
  after deploy (local lab and production aren't comparable). Original step:
  re-measure LCP on Slow 4G + CPU ×4 (August baseline:
  11 856 ms). Then evaluate GA loading (`gtag.js` is 166 KB; the `devis_*`
  events go through `dataLayer`, so a later load doesn't lose them; verify
  before changing).

### Phase 11 — Deploy and validate
- [x] **11.1** **Deployed 15 Oct 2026** (merge `8a25441`). The merge kept
  Vercel Web Analytics, which had been added to `main` via PR #1.
  Production verified:
  - all new pages return 200, with their own canonical and JSON-LD;
  - the 6 old slugs return 308;
  - the sitemap has 25 URLs;
  - the public farde has only the company number in its text layer;
  - the hero H1 is CSS-revealed;
  - `MAINTENANCE_MODE` is off.
- [ ] **11.2** GSC: resubmit the sitemap; URL Inspection → request indexing
  for each new page type; check redirects are reported as such.
- [ ] **11.3** Add **Bing Webmaster Tools** (Bing's index feeds Copilot and
  is used by ChatGPT search, which matters for the AI-answers goal) and import from GSC. Pull
  the first query data to validate §3.3 and §5.2.
- [x] **11.2** Sitemap resubmitted by the owner on 15 Oct: 25 URLs
  discovered (36 after the next deploy).
- [x] **11.4** **Baseline, GSC 28 days to 13 Oct 2026** (before the first
  deploy):

  | Clicks | Impressions | CTR | Avg. position |
  |---|---|---|---|
  | 5 | 204 | 2,5 % | 9,4 |

  13 queries in all. The top one is **"greentech energy bunia"** (1 click,
  15 impressions), followed by "tech", "électricien", "solution solaire
  entreprise rdc", "panneaux solaires" and others at 1–3 impressions each.

  **About Greentech Energy:** it is Bunia's electricity distributor (ACP,
  Feb. 2025: upgrades to two of its substations in Bunia). Google already
  associates the site with "électricité à Bunia". But those searchers want
  the grid operator, so **no page targets that brand**.
- [x] **11.5** `site:techsolution.cd filetype:pdf` returns nothing (owner, 15
  Oct): the old farde was never indexed.

### Phase 12 — Google Business Profiles (last, external)
- **Status 15 Oct:** the **Bunia** profile is live; **Kinshasa** is still
  unverified.
- [ ] **12.1** Claim the **existing** Bunia profile (don't create a duplicate),
  then correct the address, hours, category and website per §16.
- [ ] **12.2** Create and verify the Kinshasa profile (Lubumbashi if Q8 = a
  staffed shop).
- [ ] **12.3** Service areas per office (§5.2).
- [ ] **12.4** Photos (Q26), products (kits, no price), services.
- [ ] **12.5** On the site: office cards and `/zones/{ville}` link to the GBP
  place URL; `LocalBusiness` gains `hasMap` and `sameAs` (GBP URL).
- [ ] **12.6** Citations: Facebook, Instagram and LinkedIn bios → new site
  and NAP; reprint offline material (the Lubumbashi poster advertises a dead
  domain); the farde (done in 1.3).

### Phase 13 — Ongoing
- Promote Tier 3 cities when their trigger fires.
- Every new delivered project becomes at least a list row. If it has
  figures, photos and permission, it becomes a case study.
- Ask clients who agree to link to their case study (radios, NGOs, CADECO);
  each is a local backlink no competitor can buy.
- Quarterly: refresh the §14 indicators; prune or merge pages that get no
  impressions after 6 months.

---

## 9. URL map and migrations

| URL | Status | Note |
|---|---|---|
| `/` | exists | |
| `/services` | exists → hub | |
| `/services/{energie-solaire, backup-stockage, infrastructure-electrique, telecom-medias, securite-electronique, maintenance-climatisation}` | new | `maintenance-froid` kept as alias for `/contact?service=` |
| `/produits` | catalogue hub (14 Oct) | |
| `/produits/kits-solaires` | range (the former `/produits`) | |
| `/produits/kits-solaires/{kit}` × 9 | **live** | `kit-solaire-hybride-{650-va, 1-5-kva, 3-kva, 5-kva, 8-kva, 10-kva, 12-kva, 20-kva, 30-kva-triphase}`; old slugs (`kit-solaire-8-kva`…) are `previousSlugs`, resolved by `/contact?kit=` |
| `/produits/<future range>/{product}` | when needed | e.g. `/produits/batteries-portables/…` |
| `/references` | exists | becomes static |
| `/references/{slug}` | exists → migrate | see below |
| `/zones`, `/zones/{bunia, kinshasa, goma, mahagi}` (+ kisangani, lubumbashi, butembo when triggered) | new | |
| `/contact`, `/about`, `/confidentialite` | exist | |
| `/llms.txt` | new | |

**Case-study slug migration.** Now is the cheapest moment to migrate: the
pages have almost no search equity (60 impressions in 3 months across the
site) and few external links. Do it once, in 4.3, never again.

| Current | New (candidate, frozen at 0.2) |
|---|---|
| `pdl-145t-mahagi` | `pdl-145t-solaire-mahagi` |
| `cadeco-mahagi` | `cadeco-renovation-electrique-solaire-mahagi` |
| `grecom-goma` | `grecom-solaire-serveur-goma` |
| `ltj-butembo` | `ltj-backup-butembo` |
| `lsc-numbi` | `lsc-kit-solaire-numbi` |
| `afriland-bunia` | `afriland-maintenance-bunia` |
| — | `hotel-gracia-solaire-kinshasa` (live) |
| — | `bar-mbudi-solaire-kinshasa` (live) |

**Done 14 Oct**: all six migrated, 308 verified.

Redirects: generated from `previousSlugs` (permanent, so 308 in Next; Google
treats 308 like 301). Old `/contact?produit=` and `/contact?kit=` URLs keep
answering 200 with canonical `/contact`. Nothing to do.

---

## 10. Structured data

| Where | Types | Notes |
|---|---|---|
| Layout | `Organization` (`@id #organization`), `WebSite` (`@id #website`) | Keep legal identifiers and `sameAs`. Add the GBP URLs after phase 12. `address` = HQ only; offices referenced via `subOrganization` → their `LocalBusiness` `@id`. |
| `/zones/{office}` | `LocalBusiness` (option: `Electrician` subtype) | own `@id`, `parentOrganization` → `#organization`, `geo`, per-office `telephone`, `openingHoursSpecification`, `areaServed` (Tier 2–3 cities), `image`, `paymentAccepted` (Q10), `hasMap`. **`geo` and `hasMap` come only from a verified GBP** (`Office.google`: Place ID, CID, pin). Bunia done 15 Oct (pin 1.5403231, 30.2400022; it was the city centre before, ~2.5 km off); Kinshasa has no `geo` until its GBP is verified |
| Case study | `Article` + `BreadcrumbList` | `headline`, `image`, `datePublished`/`dateModified` (Q13), `author`/`publisher` → `#organization`, `about` (client org by name), `contentLocation` (`Place`, city) |
| Gracia page | + `VideoObject` | `name`, `description`, `thumbnailUrl`, `uploadDate`, `contentUrl`, `duration: PT43S`. The video must be prominent on the page. |
| Kit | `Service` (was `Product`) | `Product` without `offers` is a Search Console error, and an `Offer` needs a price (§4.3) |
| Service | `Service` | `provider` → `#organization`, `areaServed`, `serviceType` |
| All interior pages | `BreadcrumbList` | exists |
| FAQ blocks | `FAQPage` optional | no Google rich result since 2023 (except government/health sites); AI extraction only |

**Never:** `AggregateRating`, `Review`, testimonials, awards, savings or ROI
figures in markup. Markup never states what the visible page doesn't.

---

## 11. Internal linking rules

- **Case study →** its service ("Notre offre {service}"), its city ("Nos
  réalisations à {ville}"), the related kit (only with a true relation), 2–3
  related studies (same service first, then same city), and the pre-qualified
  CTA.
- **Product →** its service, its ladder neighbours, case studies at that
  scale, `/produits`.
- **Service →** its case studies and project rows, its kits, the cities where
  it is delivered.
- **City →** its studies and rows, the services delivered there, the serving
  office (Tier 2), and the cities served from it (Tier 1).
- **Footer →** services, office pages, existing city pages, legal pages.
- **Anchor text** describes the destination in natural French. No exact-match
  repetition, and no keyword link blocks.
- **Count check (7.3):** ≥ 3 contextual inbound links per indexable page,
  besides navigation and footer.

---

## 12. Images and video

- **Source of truth stays `public/photos/`** (WebP, ≤ 1920 px, ~130 KB).
  Originals stay in the gitignored `public/gallery/`.
- **Naming rule, amended:** a file name is still a claim. A **documentary
  photo of a published case study** may carry the client and city
  (`hotel-gracia-kinshasa-facade.webp`) **once Q14/Q20 grant permission**.
  Generic service photos stay unnamed.
- **The new Kinshasa files:**

  | File | Shows | Use | Caution |
  |---|---|---|---|
  | `hotel-gracia-victoire-kinshasa.jpeg` (1080×810) | street façade, passers-by, a political banner | secondary | crop out the banner |
  | `Hotel-gracia-victoire-kinshasa-2.jpeg` (810×1080) | façade with "SALLE GRACIA" sign | façade visual | — |
  | `stockage-energie-solaire-hotel-gracia-victoire-kinshasa.jpeg` (1280×1030) | FelicityESS inverter + battery rack, person from behind | **lead image** (it shows the system) | brand naming per Q16 |
  | `panneau-solaire-resto-bar-mbudi-7kw.jpeg` (960×1280) | technician fixing panels on a metal roof | lead image | "7kw" is wrong (6,5 kWc confirmed); new name `bar-mbudi-pose-panneaux.webp` |
  | `video-hotel-gracia-victoire-kinshasa.mp4` | 42,6 s, 1024×576, H.264 + AAC, 5,1 MB. Rooftop walk-through of the PV field over the Kinshasa skyline (0–30 s), then a man speaks to camera on the roof | case-study video, **rooftop part only (0–30 s), muted**; a still is the poster and a hero candidate | the speaker is the CEO (Jonathan Mupenda); the narration isn't usable, so no transcript |

- **Alt text:** what is visible plus context established by the page, never a
  number the image doesn't show. Bad: *"Installation solaire de 38,5 kWc de
  l'hôtel Gracia"*. Good: *"Armoire de batteries lithium et onduleur dans le
  local technique de l'hôtel Gracia, à Kinshasa"*.
- **Video:**
  - Re-encode (≈ 2–2,5 MB). Strip the audio if it carries nothing.
  - Poster frame as WebP, `preload="none"`, no autoplay on mobile data.
  - `VideoObject` markup.
  - Optional: also upload to YouTube (a second discovery surface, and one
    more `sameAs`), embedded behind a lightweight facade, never the default
    ~1 MB embed.
- **`next/image`:** `sizes` on every image; `priority` only on the LCP image
  of each template; nothing preloaded that is hidden on mobile (August
  lesson).

---

## 13. Technical QA checklist (per release)

- [ ] Build output: every content route `○` or `●`, except `/contact` and `/api/*`
- [ ] One `<h1>` per page; heading levels don't skip
- [ ] Unique `<title>` and meta description; canonical = self, absolute, no params
- [ ] `og:url`/`og:title` per page; OG image ≤ 600 KB JPEG
- [ ] Sitemap = exactly the indexable URLs; `lastmod` from data, not build time
- [ ] `robots.txt` unchanged (`Disallow: /api/`)
- [ ] Unknown slugs → 404 (not 200 soft-404); old slugs → 308
- [ ] http→https, www→apex, trailing slash: all 308
- [ ] No internal link to a redirect or a 404 (crawl)
- [ ] JSON-LD parses on every page; Rich Results Test zero errors
- [ ] No `pending`/`do-not-claim` value in HTML (grep the build)
- [ ] No hero text server-rendered at `opacity:0`
- [ ] Mobile: no horizontal overflow at 320–390; CTA visible; keyboard-only
  path through the modal
- [ ] Lighthouse mobile, Slow 4G + CPU ×4, on home, one product, one case
  study, one city

---

## 14. Measurement

Record a baseline on deploy day, then monthly. Expect signals in weeks, and
rankings in months.

| Indicator | Source | Why |
|---|---|---|
| Indexed pages vs. sitemap | GSC Pages | coverage is the core problem |
| Impressions on **non-brand** queries | GSC Performance, query filter excluding "tech solution" | measures the new pages |
| Queries containing a city name | GSC, regex `kinshasa\|bunia\|goma\|mahagi…` | the location strategy |
| Clicks per page type | GSC, page filter `/produits/`, `/references/`, `/zones/` | which layer works |
| `devis_succes` by `source` (`kit_modal`, `kit`, `service`, `nu`) | GA4 | conversion; mark as key events |
| Brand SERP: does techsolution.cd rank #1 for "tech solution rdc"? | manual, monthly, private window | the entity consolidation |
| GBP calls, website clicks, direction requests | GBP insights (after phase 12) | local |
| LCP (lab) | Lighthouse throttled | performance |

---

## 15. Guardrails: what we must not claim

Carried from the handover prompt (§9–11) and SEO-BRIEF §4, and binding on
every step:

- **Never invent:** client names, dates, equipment brands or models, panel
  counts, autonomy hours, savings, ROI, CO₂, percentages, certifications,
  warranties, budgets.
- **Fuel figures are client-reported.** Show them as ranges with their
  period, labelled "selon l'exploitant / le client". No derived "−80 %" or
  "520 $ économisés" unless explicitly labelled as derived from reported
  ranges, with the method stated.
- **Units:** kWc (PV peak), kWh (storage, saying nominal or usable), kVA
  (conversion). French decimals: "38,5 kWc". Never "Kwc", never "Va".
- **Banned without evidence:** zéro interruption, autonomie totale, sans
  groupe électrogène, disponibilité maximale, conforme aux normes,
  instantané, certifié.
- **An unnamed client stays unnamed.** Use a descriptive title ("un resto-bar
  à Mbudi"), never an invented name.
- **A location page never implies an office that doesn't exist.**

---

## 16. Google Business Profiles (last step)

**Naming: use the same name on both profiles, `Tech Solution RDC`. Do not
add "| Bunia" or "| Kinshasa".**

Google's guidelines are explicit: *"All locations within the same country
must have the same name"*, and location information in the name is listed as
not permitted. Keyword or city stuffing in the name is a well-known trigger
for suspensions, and for a brand already fighting name confusion a suspended
profile is the worst outcome. The city distinction comes from what Google already shows next to
the name:

- the **address** (and, for Tier 3 cities, the **service areas**);
- the **website link**: each profile points to its own page
  (`https://techsolution.cd/zones/bunia`, `…/zones/kinshasa`), not the home
  page;
- the **phone**: the shared number is fine; add a Kinshasa line to that profile if one ever exists;
- the **photos**: office front with signage, team, real installations in
  that city.

**The name must match the signage.** If the Bunia storefront reads "TECH
SOLUTION RDC", the profile says "Tech Solution RDC". If signage differs
between offices, fix the signage, not the profile.

**Other settings:**
- **Category:** primary "Solar energy company" (pick its exact label in
  the French category list when you set it up). Secondary categories from what the office really sells (e.g.
  solar equipment supplier, electrician, electrical installation service). Use
  the same set on both profiles unless an office genuinely differs.
- **Bunia already has an unclaimed profile** with a wrong address ("LUXBEAUTY,
  Yambi yaya") and wrong hours ("opens 8 pm"). Claim it and correct it.
  Creating a second one leads to duplicates and suspensions.
- **No profile for a city without staff on site during stated hours** (Goma,
  Matadi…). That is ineligible under the guidelines. Those cities go in
  service areas.
- **Order of operations:** NAP frozen (1.6) → location pages live (6.2) →
  GBPs claimed and verified → GBP URLs linked from the site (12.5).

---

## 17. The owner's additions of 14 October

### 17.1 Product categories
Done; see §4.3. Adding a category takes:
1. a slug in `ProductCategorySlug`;
2. an entry in `productCategories`;
3. a folder `app/produits/<gamme>/`, with its own data type;
4. a column in the Produits mega menu.

The hub, menu and sitemap read the list.

### 17.2 Households: the site under-serves its largest audience
The owner reports complaints that the site talks to companies more than to
households, and the data agrees: 60+ households equipped against 19
documented installations, yet the proof on the site is almost entirely
institutional. Done today:
- the hub and the menu put "Ma maison" first;
- the hub's hero shows a house.

Still needed:
- **Real household photos** (inside and outside the home, people with
  their system), with the families' written agreement. None exist in
  `public/photos/` today.
- **Two or three household stories** told like the Mbudi case: problem,
  system, before/after, with a first name only or anonymous. These are what
  "kit solaire maison Kinshasa" searchers need, and they are the
  testimonials the home page reserves a place for (HANDOFF §8).
- Once those exist, a **"Pour la maison"** entry point on the home page,
  linking to the residential kits and the household stories. No new
  template is needed.

### 17.3 E-E-A-T: a named expert (agreed 14 Oct, bio 15 Oct)

**15 Oct:** the "La direction" block now tells his story, using only the
facts he gave:
- **why he founded the company:** for what the sector overlooked — product
  quality, maintenance, warranty;
- **his career:** BBOXX 2019–2022, then the Bunia and Goma repair centre
  2022–2024, then founding the company in 2024;
- **his three principles:** quality before price, a partnership rather than
  a one-off installation, payment by instalments;
- **his goal.**

The JSON-LD now uses `founder` (Person, job title, career, `knowsAbout`).
**Jonathan Mupenda, CEO and lead engineer.** Search engines and AI answers
weigh who stands behind a technical claim.

Done:
- [x] `/about`: a "La direction" block (business portrait, name, both roles)
  between the manifesto and the figures;
- [x] `Organization` JSON-LD: `employee` → `Person` (name, job title, photo);
  not `founder`, since nobody has said he founded it;
- [x] his two site photos renamed for what they now prove
  (`jonathan-mupenda-chantier-*.webp`);
- [x] `/about` figures derived from data (19 · 60+ · 12 · 26), which also
  replaces the "100 % démarche client" slogan tile with households.

Next:
- his bio (Q33);
- sign the case studies "Système conçu sous la direction de Jonathan Mupenda,
  ingénieur principal" (Phase 4), with the rooftop photo in branded gear as
  the byline image.

### 17.4 A Supabase back office, once the SEO is sound
The plan holds. Four rules so it doesn't undo the SEO work:
1. **Pages stay static.** The site reads the database at build time (or
   through `use cache` + revalidation on publish), never per request. One
   publish = one revalidation of the affected URLs.
2. **The data shape moves, not the URLs.** `lib/data/*` and `lib/routes.ts`
   become the read layer over Supabase, with the same types. Slugs,
   `previousSlugs` and evidence levels (§4.1) become columns, and the
   back-office forms enforce them (no figure without its evidence level).
3. **Mind the free tier.** Supabase pauses a free project after about a week
   without activity. A paused database must never break a build or a
   revalidation: keep a content export in the repo as a fallback, or use a
   paid tier once the site depends on it.
4. **Images.** Uploaded photos go to Supabase Storage. `next.config.ts` then
   needs a `remotePatterns` entry for that bucket only, and the "a file name
   is a claim" rule becomes a required alt-text field.

Back-office scope that matches the site's needs:
- case studies with evidence levels;
- projects and clients;
- kits and future categories;
- the product FAQ;
- leads (the contact form writes there before sending the email). That also
  closes the "no fallback if Resend is down" gap in HANDOFF §8.

