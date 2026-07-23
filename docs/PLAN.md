# TECH SOLUTION RDC — Plan de construction du site (techsolution.cd)

> Document de référence pour la construction du site corporate Next.js.
> Source de vérité des données : `docs/FARDE TECH SOLUTION.pdf` (farde officielle de l'entreprise).

---

## 1. Données réelles extraites de la farde (source de vérité)

### Identité
- **Nom** : TECH SOLUTION RDC — actif **depuis 2024**
- **Slogan** : « La révolution énergétique » — démarche **100% client**
- **Téléphone / WhatsApp** : +243 821 250 250
- **Email** : info@techsolution.cd
- **Site historique** : www.techsolution-congo.com → nouveau domaine : **techsolution.cd**
- **Vision** : devenir un leader incontournable de la transformation énergétique et technologique en Afrique.
- **Mission** : fournir des solutions fiables en énergie solaire et technologies de proximité, contribuer à la protection de l'environnement et à la lutte contre la déforestation.
- **Valeurs** : Innovation durable, Engagement environnemental, Proximité, Excellence, Responsabilité sociale, Intégrité, Collaboration.
- **Zone d'intervention** : toute la RDC (carte des 26 provinces dans la farde).

### Clients & références (10 — réels, documentés)
| # | Organisation | Secteur |
|---|--------------|---------|
| 1 | LTJ (Les Témoins de Jéhovah asbl) | Organisation privée |
| 2 | MONUSCO / FRAPEZ | Organisation internationale |
| 3 | New AZ Building | Entreprise privée |
| 4 | CADECO — Agence de Mahagi | Banque publique |
| 5 | GRECOM-RDC | Télécoms / Médias |
| 6 | ALIMA-RDC | ONG internationale |
| 7 | LSC (Ligue sociale pour la solidarité congolaise) | ONG nationale |
| 8 | CARE International | ONG internationale |
| 9 | Save the Children | ONG internationale |
| 10 | Afriland First Bank | Banque commerciale |

> ⚠️ La farde contient les noms et téléphones personnels des personnes de référence.
> **Décision** : ne PAS publier ces données personnelles sur le site public (protection des données).
> Le site mentionne « personnes de référence disponibles sur demande ».

### Réalisations documentées (17)
Backup LTJ Bunia · Backup LTJ Butembo · Solaire salle du royaume Goma · Solaire salle du royaume Bunia · Solaire bureau administratif du territoire de Mahagi (**projet étatique PDL-145T**) · Rénovation + solaire banque CADECO Mahagi · Kit solaire bureau ALIMA Bunia · Kit solaire bureau LSC Numbi · Kit solaire bureau CARE Bunia · Système d'alarme Save the Children Bunia · Maintenance climatisation + installations Afriland First Bank Bunia · Kit solaire serveur GRECOM Goma · Kits solaires 5 radios (La Colombe Mahagi, Canal Révélation Bunia, Amani Aveba, RTNC Bunia, RTFi Bunia).

### Villes d'intervention réelles
Bunia, Mahagi, Aveba (Ituri) · Goma, Butembo (Nord-Kivu) · Numbi (Sud-Kivu).

### Chiffres clés honnêtes (utilisés sur le site)
- **17+** projets livrés — **10** clients institutionnels — **26** provinces (zone d'intervention) — **6** villes actives — **100%** démarche client — depuis **2024**.

---

## 2. Stack technique

| Élément | Choix |
|---------|-------|
| Framework | Next.js 15 (App Router, Server Components par défaut) |
| Langage | TypeScript strict |
| Styles | Tailwind CSS **v3.4** (`tailwind.config.ts` avec palette étendue) |
| UI | Composants style shadcn/ui écrits en dur (Button, Card, Badge, Tabs, Accordion, Sheet, Input…) sur primitives Radix |
| Icônes | lucide-react (uniformité totale) |
| Animations | framer-motion (reveals au scroll, compteurs, flottants) + keyframes CSS (marquee) |
| Emails | Resend (`app/api/contact/route.ts`) + validation zod |
| Images | next/image + images.unsplash.com (IDs vérifiés HTTP 200) |
| Déploiement | Vercel → domaine techsolution.cd |

## 3. Design system

- **Thème clair uniquement.** Rythme de sections : blanc → bande navy → blanc → slate clair → blanc → CTA navy.
- **Couleurs** : `navy` (50→950, marque : #1E3E62 / #0B192C) · `solar` (50→900, marque : #F1C40F / #FFB800) · fonds #FFFFFF / #F8FAFC · titres #0F172A · corps #475569.
- **Typo** : Space Grotesk (display/titres) + Inter (texte) via next/font.
- **Rayons** : `rounded-2xl` cartes, `rounded-xl` boutons/champs. Ombres douces personnalisées.
- **Signature visuelle** : motif grille « blueprint » discret, halos ambrés, pastilles « eyebrow » en petites capitales, carte RDC en matrice de points avec villes pulsantes, monogrammes clients navy/solar.

## 4. Architecture des pages

1. `/` — Hero split (badge Certifié & Agréé, H1 leader, 2 CTA, image + badges flottants) → marquee clients → bande métriques (compteurs) → solutions (6 cartes) → engagement (vision/valeurs) → couverture RDC (carte à points) → références en vedette → CTA final.
2. `/services` — 6 domaines détaillés (solaire, backup & stockage, infrastructure électrique, télécoms & médias, sécurité électronique, maintenance & froid) avec références réelles par service, processus en 4 étapes, FAQ accordion, CTA.
3. `/produits` — catalogue filtrable par catégorie (panneaux, onduleurs, batteries lithium, protection, distribution, éclairage public, kits) — visuels de marque + fiches specs + « Demander un devis » pré-rempli.
4. `/references` — track record par secteur (ONG & organisations internationales, banques, secteur public/PDL-145T, médias & télécoms, entreprises privées), 17 réalisations par ville, visualiseur de couverture provinciale.
5. `/contact` — formulaire validé (Resend), bouton WhatsApp pré-rempli, coordonnées, carte RDC (base opérationnelle : Bunia, Ituri).
6. `app/api/contact/route.ts` — validation zod + envoi Resend + honeypot anti-spam + repli simulation si `RESEND_API_KEY` absent.
7. SEO : metadata FR par page, OpenGraph, sitemap.ts, robots.ts, JSON-LD Organization, page 404.

## 5. Étapes de build (suivi)

- [x] Extraction des données de la farde PDF
- [x] Vérification des images Unsplash (20 IDs → HTTP 200 + contenu visuel contrôlé)
- [x] Scaffold Next.js + dépendances (Next 16.2, React 19.2, Tailwind 3.4)
- [x] Design system (tailwind.config.ts, globals.css, UI kit style shadcn)
- [x] Couche données (`lib/`)
- [x] Composants partagés (logo, motion, carte RDC vérifiée visuellement, marquee, FAB WhatsApp)
- [x] Header / Footer
- [x] 5 pages + API route + SEO (sitemap, robots, JSON-LD, 404, error)
- [x] `npm run build` + `npm run lint` sans erreur — toutes les routes en HTTP 200, 404 custom OK
- [x] API contact testée (validation zod 422, honeypot silencieux, mode démo sans clé Resend)
- [x] Vérification visuelle (captures desktop + mobile des 5 pages) + polish

### Corrections notables pendant le build
- `@radix-ui/react-slot` v1.3 appelle `createContext` côté serveur (incompatible RSC) →
  remplacé par un Slot minimal maison dans `components/ui/button.tsx`.
- Accessibilité `prefers-reduced-motion` : les primitives motion rendent désormais le même
  arbre avec animation neutralisée (jamais de contenu invisible) + repli `<noscript>`.
- Honeypot : réponse « faux succès » silencieuse pour ne pas révéler le champ piège aux robots.

## 6. À confirmer avec l'entreprise (post-livraison)

- Adresse physique exacte du bureau (le site affiche « Base opérationnelle : Bunia, Ituri — RDC »).
- Logo officiel vectoriel (un logotype éclair/navy de substitution est fourni).
- Domaine d'envoi Resend (vérifier techsolution.cd dans Resend puis remplacer `onboarding@resend.dev`).
- Photos réelles des chantiers pour remplacer les visuels Unsplash.
- Comptes réseaux sociaux éventuels (non présents dans la farde — non affichés).
