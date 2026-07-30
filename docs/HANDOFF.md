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

**Palette** (`tailwind.config.ts`):
- `navy` 50–950 — brand dark (navy-950 `#0B192C`, navy-800 `#1E3E62`). Primary dark surfaces.
- `brand` 100–800 — official logo blue (brand-500 `#3130D0`, brand-600 `#2A28B8`). Blue accents/links.
- `solar` 50–900 — amber (solar-500 `#FFB800`, solar-400). Energy accent, map highlight, "populaire".
- Amber `#C2410C` (burnt orange) — the hero's rotating-phrase color + hero primary CTA. (Deliberately kept orange after experimentation; brand blue was tried and reverted.)
- Neutrals: white / `slate-50` backgrounds, `slate-900` headings, `slate-600` body.

**Type scale (mobile-first, recently tuned for small screens like Galaxy A16):**
- Section H2: `text-[26px] sm:text-3xl md:text-4xl lg:text-[40–46px]`
- PageHero H1: `text-[30px] sm:text-4xl md:text-5xl`
- Section vertical padding: `py-14 sm:py-20 lg:py-28` (mobile intentionally tighter)
- Body/lead: `text-[15px] sm:text-base md:text-lg`

**Reusable pieces:**
- `components/section.tsx` → `Section`, `Eyebrow`, `SectionHeading` (eyebrow/title/lead/align/onDark)
- `components/motion.tsx` → `Reveal`, `Stagger`, `StaggerItem`, `CountUp` (framer-motion; all respect `prefers-reduced-motion` and render the same tree with animation neutralized; there's a `<noscript>` fallback that forces `[data-reveal]` visible)
- `components/ui/button.tsx` variants: `default` (navy-950), `brand` (brand blue), `solar`, `outline`, `outline-light`, `secondary`, `ghost`, `link`, `whatsapp`. Sizes: `sm`, `default`, `lg`, `icon`.
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

**Homepage `app/page.tsx` (order is intentional — a conversion funnel):**
1. `Hero` — full-bleed model. Left: H1 "Prenez le contrôle de votre énergie :" + **rotating phrase** (Framer Motion, 3.5s, amber `#C2410C`, reserved min-height so NO layout shift), subtitle, amber primary CTA "Obtenez un devis gratuit", ghost secondary. Desktop: background solar image with a **cream (`#FFF7ED`) left→transparent veil**; image hidden `<lg` (centered text only). **DO NOT redesign the hero without explicit ask — owner is fine-tuning it deliberately.**
2. `Authority` — "17+ projets / 60+ ménages" statement + wall of **9 grayscale client logos** (`public/logos/`, real from Wikimedia Commons + typographic wordmarks for CADECO/PDL-145T/GRECOM/Afriland).
3. `Solutions` — 2 image offer cards (Résidentiel / Commercial-Hôtellerie, `aspect-[16/10]`, real photos) + "Ce que nous offrons" 4-pillar trust bar. Silent white→slate-50 gradient bg (grid motif was removed — looked "too AI").
4. `CaseStudiesReach` — **dark navy full-bleed** section. Case-study **card LEFT** (full-image + gradient, spec badge, city-left/CTA-right) + **interactive dot-matrix map RIGHT** (same height, blends into navy). Carousel: as you move projects, the **map highlights that city** (amber pulse) to show national reach. Controls: progress dots (card left edge) + nav buttons (card right edge) on one row under the card; "Voir tous les projets" far-right under the map (same line on desktop, right-aligned own line on mobile). **Map hidden on mobile.** Client-side component.
5. `KitsShowcase` — **this is the final CTA** (placed last on purpose). 4 curated kit tiers (1.5/5/10/30 kVA) as premium image cards with datasheet spec strips + impact headlines. Footer CTA: "Parlons de votre projet" (/contact, primary) + "Voir tout le catalogue" (/produits, secondary).

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

## 8. Open items / backlog (owner's stated direction)

- **Fine-tune the landing page more** (current focus — hero especially, but owner drives changes).
- **Testimonials section** — agreed placement: between `CaseStudiesReach` and `KitsShowcase`. NOT built yet — needs **real client quotes** (won't fabricate). 
- **After products → FAQ, then Blog** (future).
- Backfill **real kW/kWh figures** for case-study `spec` fields and confirm the 9-province reach with real projects (currently only 5 documented cities).
- Possibly realign `app/references/page.tsx` (index) with the new case-study card model.
- Use the **drone video** (compressed) somewhere; maybe a Réalisations/gallery page.
- Deploy config: set `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` in Vercel; verify `techsolution.cd` domain in Resend; attach domain in Vercel (see `README.md`).
- Confirm with client: exact office address, real site photos already partly in, social accounts (none shown — not in farde).

---

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
