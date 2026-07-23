# TECH SOLUTION RDC — techsolution.cd

Site corporate B2B de **Tech Solution RDC** (« La révolution énergétique », depuis 2024) :
énergie solaire, systèmes backup, infrastructures électriques, télécoms, sécurité
électronique et maintenance — dans les 26 provinces de la RDC.

Construit avec **Next.js (App Router) · TypeScript · Tailwind CSS · Framer Motion ·
composants style shadcn/ui · lucide-react · Resend**. Thème clair, français corporate,
mobile-first, prêt pour Vercel.

## Démarrage

```bash
npm install
npm run dev        # http://localhost:3000
```

## Build de production

```bash
npm run build
npm start
```

## Structure

```
app/
  page.tsx                 # Accueil (hero, métriques, solutions, couverture, références, CTA)
  services/page.tsx        # Services & expertise (6 domaines, processus, FAQ)
  produits/page.tsx        # Catalogue filtrable d'équipements
  references/page.tsx      # Clients, 17 réalisations, présence provinciale
  contact/page.tsx         # Formulaire (Resend) + WhatsApp Business
  api/contact/route.ts     # Endpoint email (zod + Resend + honeypot)
  sitemap.ts / robots.ts   # SEO
components/
  ui/                      # Kit UI style shadcn (Button, Card, Badge, Tabs, Accordion, Sheet…)
  home/                    # Sections de l'accueil
  drc-map.tsx              # Carte RDC en matrice de points (SVG serveur)
  motion.tsx               # Primitives Framer Motion (Reveal, Stagger, CountUp)
lib/
  site.ts                  # Coordonnées & métriques officielles
  whatsapp.ts              # Générateur de liens wa.me pré-remplis
  data/                    # Services, produits, clients, réalisations, géographie RDC
docs/
  FARDE TECH SOLUTION.pdf  # Source de vérité des données entreprise
  PLAN.md                  # Plan de construction & audit des données
```

## Déploiement sur Vercel + techsolution.cd

1. Pousser le dépôt sur GitHub/GitLab puis « Import Project » dans Vercel
   (framework détecté : Next.js — aucun réglage requis).
2. **Variables d'environnement** (Settings → Environment Variables) :
   copier `.env.example` → renseigner `RESEND_API_KEY`, `CONTACT_TO_EMAIL`,
   `CONTACT_FROM_EMAIL`.
3. **Emails** : dans Resend, vérifier le domaine `techsolution.cd` (enregistrements
   DNS fournis par Resend), puis utiliser `devis@techsolution.cd` comme expéditeur.
4. **Domaine** : Vercel → Settings → Domains → ajouter `techsolution.cd` et
   `www.techsolution.cd`, puis configurer chez le registrar (.cd) :
   - `A @ → 76.76.21.21`
   - `CNAME www → cname.vercel-dns.com`
5. Sans `RESEND_API_KEY`, le formulaire fonctionne en mode démo : la demande est
   consignée dans les logs et l'interface confirme l'envoi.

## Personnalisation rapide

- **Coordonnées / WhatsApp** : `lib/site.ts`
- **Couleurs de marque** : `tailwind.config.ts` (`navy`, `solar`)
- **Contenus** : `lib/data/*.ts` (services, produits, clients, réalisations)
- **Photos réelles des chantiers** : remplacer les URLs Unsplash dans
  `lib/data/services.ts` et `components/home/*.tsx`
