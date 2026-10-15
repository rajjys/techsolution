/**
 * Études de cas — les réalisations racontées de bout en bout.
 *
 * Six viennent de la farde officielle (docs/FARDE TECH SOLUTION.pdf), deux de
 * Kinshasa (2026), documentées avec le propriétaire et publiées avec l'accord
 * des clients. Chaque projet porte une localisation (ville + province) qui
 * pilote la carte de la section.
 *
 * ⚠️ **Ce fichier est lu par `next.config.ts`** (redirections des anciens
 * slugs) : il ne doit importer que des types, jamais du code.
 *
 * Règle de preuve — chaque chiffre dit d'où il vient :
 * - `installateur` : donnée de l'entreprise (dimensionnement, matériel posé) ;
 * - `client` : rapporté par le client, non audité (carburant, usage).
 * Ce qui n'est pas confirmé n'est pas écrit ici — il attend sa réponse dans
 * docs/SEO-STRATEGY.md §7, il n'est pas approché.
 */
export type CaseCategory =
  | "Solaire"
  | "Backup"
  | "Électricité"
  | "Télécoms"
  | "Maintenance";

export type Evidence = "installateur" | "client";

/** Un repère technique — et ce qu'il mesure, en clair. */
export type CaseSpec = {
  label: string;
  /** Écriture française : « 38,5 kWc », jamais « 38.5 Kwc ». */
  value: string;
  meaning: string;
  evidence: Evidence;
};

/** Dépense de carburant avant / après — toujours rapportée par le client. */
export type FuelFigures = {
  before: string;
  after?: string;
  /** Période et périmètre, tels que le client les a donnés. */
  note: string;
};

export type CaseImage = {
  src: string;
  /** Ce que montre la photo — jamais un chiffre qu'elle n'établit pas. */
  alt: string;
  width: number;
  height: number;
  /** `object-position` quand le sujet n'est pas au centre. */
  position?: string;
  /** Pleine largeur (16:9) ; sinon deux par ligne, recadrées en 4:5. */
  wide?: boolean;
};

export type CaseStudy = {
  slug: string;
  /**
   * Anciens slugs : chacun devient une redirection permanente (308) vers le
   * slug courant, générée dans `next.config.ts`. Migration faite une fois,
   * en octobre 2026, quand les pages n'avaient presque aucune équité.
   */
  previousSlugs?: string[];
  /** Titre court — cartes, carrousel, listes. */
  title: string;
  /** Titre de la page : l'intervention, le client, le lieu. */
  h1: string;
  /**
   * `<title>`, avant « | Tech Solution RDC ». `{Client} {Ville} : {intervention}`,
   * 45 caractères visés : au-delà, c'est la marque qui se fait tronquer.
   */
  metaTitle: string;
  client: string;
  /** `false` : le client n'a pas autorisé la publication de son nom. */
  clientNamed: boolean;
  sector: string;
  city: string;
  /** Quartier ou repère, quand il est publiable. */
  district?: string;
  province: string;
  category: CaseCategory;
  /** Année de mise en service, quand elle est connue. */
  year?: number;
  /**
   * Repère technique affiché en pastille sur la carte — **uniquement une
   * valeur vérifiée**. Les six valeurs d'origine (« ≈ 8 kVA · Lithium
   * 10 kWh »…) étaient des espaces réservés inventés, et elles s'affichaient
   * en production. Absent = pas de pastille.
   */
  spec?: string;
  /**
   * Photo du chantier, et son texte alternatif.
   *
   * ⚠️ **L'`imageAlt` décrit ce que montre la photo** — le client ou la ville
   * seulement s'ils sont établis par l'image (panneau, enseigne) ou si la
   * photo documente le chantier lui-même, avec l'accord du client.
   */
  image: string;
  imageAlt: string;
  imagePosition?: string;
  summary: string;
  /** Coordonnées pour la carte */
  lon: number;
  lat: number;
  /** Publication de la page (Article.datePublished) — pas la mise en service. */
  published: string;
  /** Dernière révision réelle du contenu — `lastmod` et `dateModified`. */
  revised: string;
  /** Contenu de la page dédiée */
  context?: string;
  challenge: string;
  solution: string;
  specs?: CaseSpec[];
  /** Ce que le système alimente. */
  loads?: string[];
  fuel?: FuelFigures;
  results: string[];
  /** Les résultats sont rapportés par le client (et dits comme tels). */
  resultsReported?: boolean;
  gallery?: CaseImage[];
  /**
   * Le kit du catalogue le plus proche. `comparable` : même palier, autre
   * composition — jamais « installé » sans confirmation.
   */
  relatedKit?: { slug: string; relation: "comparable" | "installed" };
  /**
   * L'exemple de système hors catalogue — au-delà du plus grand kit. Les
   * pages produits y renvoient comme preuve du « sur mesure ».
   */
  beyondCatalogue?: boolean;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "hotel-gracia-solaire-kinshasa",
    title: "Système solaire d'un hôtel, d'une salle de fête et d'un bar",
    h1: "Système solaire de 38,5 kWc de l'hôtel Gracia, à Kinshasa",
    metaTitle: "Hôtel Gracia Kinshasa : système solaire 38,5 kWc",
    client: "Hôtel Gracia",
    clientNamed: true,
    sector: "Hôtellerie — hôtel, salle de fête et bar",
    city: "Kinshasa",
    district: "Victoire, près du pont Kalamu",
    province: "Kinshasa",
    category: "Solaire",
    year: 2026,
    spec: "38,5 kWc · 120 kWh",
    image: "/photos/hotel-gracia-champ-solaire-toiture.webp",
    imageAlt:
      "Champ de panneaux solaires sur la toiture de l'hôtel Gracia, Kinshasa en arrière-plan",
    summary:
      "38,5 kWc de panneaux, 120 kWh de stockage lithium : un hôtel, sa salle de fête et son bar qui ne s'arrêtent plus quand la SNEL coupe.",
    lon: 15.31,
    lat: -4.33,
    published: "2026-10-14",
    revised: "2026-10-15",
    context:
      "L'hôtel Gracia, dans le quartier Victoire près du pont Kalamu, réunit plus de dix chambres et quatre grandes salles, dont une salle de fête, ainsi qu'un bar.",
    challenge:
      "Quand le courant de la SNEL était coupé, les appareils de l'établissement cessaient de fonctionner. L'établissement estime qu'il dépensait alors entre 1 200 et 1 900 $ de carburant par mois pour son groupe électrogène.",
    solution:
      "Un champ photovoltaïque de 38,5 kWc en toiture, un stockage lithium Felicity de 120 kWh et une capacité de conversion de 100 kVA, dimensionnés pour l'hôtel, ses salles et son bar.",
    specs: [
      {
        label: "Champ photovoltaïque",
        value: "38,5 kWc",
        meaning: "puissance crête des panneaux posés en toiture",
        evidence: "installateur",
      },
      {
        label: "Stockage",
        value: "120 kWh",
        meaning: "capacité des batteries lithium (Felicity)",
        evidence: "installateur",
      },
      {
        label: "Conversion",
        value: "100 kVA",
        meaning: "capacité des onduleurs",
        evidence: "installateur",
      },
    ],
    loads: [
      "Plus de dix chambres",
      "Quatre grandes salles, dont la salle de fête",
      "Le bar",
    ],
    fuel: {
      before: "1 200 à 1 900 $ / mois",
      note: "Carburant du groupe électrogène avant l'installation, estimé par l'établissement.",
    },
    results: [
      "L'activité continue pendant les coupures du réseau",
      "Des économies de carburant, non chiffrées à ce jour",
    ],
    resultsReported: true,
    beyondCatalogue: true,
    gallery: [
      {
        src: "/photos/hotel-gracia-panneaux-toiture.webp",
        alt: "Rangées de panneaux solaires sur la toiture de l'hôtel Gracia",
        width: 1024,
        height: 576,
        wide: true,
      },
      {
        src: "/photos/hotel-gracia-local-batteries.webp",
        alt: "Onduleur et armoire de batteries lithium Felicity dans le local technique de l'hôtel Gracia",
        width: 1280,
        height: 1030,
        /* L'armoire est à droite du cadre. */
        position: "68% 50%",
      },
      {
        src: "/photos/hotel-gracia-facade.webp",
        alt: "Façade de l'hôtel Gracia, avec l'enseigne de la salle Gracia",
        width: 810,
        height: 1080,
      },
    ],
  },
  {
    slug: "bar-mbudi-solaire-kinshasa",
    title: "Système solaire d'un bar avec chambres",
    h1: "Système solaire d'un bar avec chambres à Mbudi, Kinshasa",
    metaTitle: "Bar à Mbudi, Kinshasa : système solaire 6,5 kWc",
    /* Non nommé, à sa demande : décrit par ce qu'il est, jamais par un nom
       inventé. */
    client: "Un bar à Mbudi (client privé)",
    clientNamed: false,
    sector: "Hôtellerie — bar avec chambres",
    city: "Kinshasa",
    district: "Mbudi, commune de Mont-Ngafula",
    province: "Kinshasa",
    category: "Solaire",
    year: 2026,
    spec: "6,5 kWc · 20 kWh",
    image: "/photos/bar-mbudi-pose-panneaux.webp",
    imageAlt:
      "Technicien Tech Solution RDC fixant des panneaux solaires sur une toiture en tôle",
    imagePosition: "50% 45%",
    summary:
      "Un bar de douze chambres passé du groupe électrogène au solaire : 400 à 600 $ de carburant par mois avant, 50 à 80 $ après, selon l'exploitant.",
    lon: 15.22,
    lat: -4.41,
    published: "2026-10-14",
    revised: "2026-10-15",
    context:
      "Un bar de Mbudi, sur la commune de Mont-Ngafula, qui loue aussi douze chambres.",
    challenge:
      "Sans le courant de la SNEL, les appareils électriques s'arrêtaient. Le bar faisait tourner un groupe électrogène, pour 400 à 600 $ de carburant par mois en moyenne, selon l'exploitant.",
    solution:
      "Un champ solaire de 6,5 kWc, une batterie de 20 kWh et un système de conversion de 12 kVA, dimensionnés sur les chambres, la ventilation et le froid du bar.",
    specs: [
      {
        label: "Champ photovoltaïque",
        value: "6,5 kWc",
        meaning: "puissance crête des panneaux",
        evidence: "installateur",
      },
      {
        label: "Stockage",
        value: "20 kWh",
        meaning: "capacité de la batterie",
        evidence: "installateur",
      },
      {
        label: "Conversion",
        value: "12 kVA",
        meaning: "capacité de l'onduleur",
        evidence: "installateur",
      },
    ],
    loads: ["12 chambres", "35 ventilateurs", "5 congélateurs et réfrigérateurs"],
    fuel: {
      before: "400 à 600 $ / mois",
      after: "50 à 80 $ / mois",
      note: "Carburant seul, en moyenne mensuelle, rapporté par l'exploitant. Le groupe n'est plus utilisé qu'en appoint.",
    },
    results: [
      "Les appareils fonctionnent pendant les coupures de la SNEL",
      "Le groupe électrogène ne sert plus qu'en appoint",
    ],
    resultsReported: true,
    relatedKit: { slug: "kit-solaire-hybride-12-kva", relation: "comparable" },
  },
  {
    slug: "pdl-145t-solaire-mahagi",
    previousSlugs: ["pdl-145t-mahagi"],
    title: "Système solaire du bureau administratif du territoire",
    h1: "Système solaire du bureau administratif du territoire de Mahagi",
    metaTitle: "Système solaire du bureau territorial de Mahagi",
    client: "Programme PDL-145T — État congolais",
    clientNamed: true,
    sector: "Secteur public",
    city: "Mahagi",
    province: "Ituri",
    category: "Solaire",
    image: "/photos/mahagi-batiment-administratif.webp",
    imageAlt: "Bâtiment administratif du territoire de Mahagi, équipé par Tech Solution RDC",
    summary:
      "Alimentation solaire du bureau administratif du territoire de Mahagi, dans le cadre du Programme PDL-145T.",
    lon: 30.98,
    lat: 2.3,
    published: "2026-07-30",
    revised: "2026-10-15",
    challenge:
      "Assurer une alimentation électrique fiable au bureau administratif du territoire de Mahagi, dans une zone où le réseau public est absent ou instable, pour garantir la continuité du service public.",
    solution:
      "Conception et installation d'un système solaire hybride dimensionné sur les charges réelles du bâtiment, avec stockage et supervision, dans le cadre du programme national PDL-145T.",
    results: [
      "Continuité de service du bureau administratif",
      "Réalisé dans le cadre du programme national PDL-145T",
    ],
  },
  {
    slug: "cadeco-renovation-electrique-solaire-mahagi",
    previousSlugs: ["cadeco-mahagi"],
    title: "Rénovation électrique & système solaire de l'agence bancaire",
    h1: "Rénovation électrique et système solaire de l'agence CADECO de Mahagi",
    metaTitle: "CADECO Mahagi : rénovation électrique et solaire",
    client: "CADECO",
    clientNamed: true,
    sector: "Banque publique",
    city: "Mahagi",
    province: "Ituri",
    category: "Électricité",
    /* L'enseigne CADECO est lisible dans le cadre : la photo documente bien
       une agence CADECO, sans établir laquelle — l'alt n'en dit pas plus. */
    image: "/photos/mise-a-la-terre-parafoudre.webp",
    imageAlt:
      "Technicien Tech Solution RDC sur une échelle devant une agence CADECO",
    imagePosition: "50% 32%",
    summary:
      "Rénovation complète de l'infrastructure électrique et installation d'un système solaire pour l'agence CADECO de Mahagi.",
    lon: 30.98,
    lat: 2.34,
    published: "2026-07-30",
    revised: "2026-10-15",
    challenge:
      "Moderniser une agence bancaire en activité, dont l'installation électrique vieillissante ne garantissait plus la continuité d'exploitation ni la sécurité des équipements.",
    solution:
      "Rénovation de l'infrastructure électrique et déploiement d'un système solaire, réalisés sans interrompre l'activité de l'agence.",
    results: [
      "Continuité d'exploitation bancaire assurée",
      "Protection des équipements sensibles",
      "Infrastructure électrique de l'agence rénovée",
    ],
  },
  {
    slug: "grecom-solaire-serveur-goma",
    previousSlugs: ["grecom-goma"],
    title: "Alimentation solaire du serveur télécom",
    h1: "Alimentation solaire du serveur de GRECOM-RDC à Goma",
    metaTitle: "GRECOM Goma : alimentation solaire d'un serveur",
    client: "GRECOM-RDC",
    clientNamed: true,
    sector: "Télécoms & médias",
    city: "Goma",
    province: "Nord-Kivu",
    category: "Télécoms",
    image: "/photos/baie-batterie-salle-technique.webp",
    imageAlt: "Baie technique et batterie de secours alimentant un serveur",
    summary:
      "Kit solaire dédié à l'alimentation du serveur de GRECOM-RDC, à son bureau de Goma.",
    lon: 29.22,
    lat: -1.68,
    published: "2026-07-30",
    revised: "2026-10-15",
    challenge:
      "Garantir une alimentation ininterrompue au serveur télécom de GRECOM, où toute coupure entraîne une perte de service pour les utilisateurs.",
    solution:
      "Installation d'un kit solaire avec stockage, dédié à l'alimentation du serveur et de la salle technique.",
    results: [
      "Serveur alimenté par une source dédiée",
      "Réduction de la dépendance au groupe électrogène",
    ],
  },
  {
    slug: "ltj-backup-butembo",
    previousSlugs: ["ltj-butembo"],
    title: "Système backup pour le site RTO",
    h1: "Système backup du site RTO de LTJ à Butembo",
    metaTitle: "LTJ Butembo : système backup du site RTO",
    client: "LTJ",
    clientNamed: true,
    sector: "Organisation privée",
    city: "Butembo",
    province: "Nord-Kivu",
    category: "Backup",
    image: "/photos/victron-onduleur-batteries.webp",
    imageAlt: "Onduleur Victron et parc batteries assurant la continuité électrique",
    summary:
      "Installation d'un système de secours (backup) pour le site RTO de LTJ à Butembo, garantissant la continuité en cas de coupure.",
    lon: 29.28,
    lat: 0.14,
    published: "2026-07-30",
    revised: "2026-10-15",
    challenge:
      "Maintenir l'activité du site malgré des coupures fréquentes du réseau, sans recourir à un groupe électrogène bruyant et coûteux.",
    solution:
      "Déploiement d'un système backup — onduleur hybride et batteries — qui prend le relais pendant les coupures du réseau.",
    results: [
      "Continuité assurée pendant les coupures",
      "Fonctionnement silencieux",
      "Maintenance réduite",
    ],
  },
  {
    slug: "lsc-kit-solaire-numbi",
    previousSlugs: ["lsc-numbi"],
    title: "Kit solaire pour le bureau LSC",
    h1: "Kit solaire du bureau de LSC à Numbi, au Sud-Kivu",
    metaTitle: "LSC Numbi : kit solaire pour un bureau d'ONG",
    client: "LSC — Ligue sociale pour la solidarité congolaise",
    clientNamed: true,
    sector: "ONG nationale",
    city: "Numbi",
    province: "Sud-Kivu",
    category: "Solaire",
    image: "/photos/toiture-residence-duo.webp",
    imageAlt: "Deux techniciens sur un système solaire en toiture de résidence",
    summary:
      "Kit solaire alimentant le bureau de LSC à Numbi, en zone reculée du Sud-Kivu.",
    lon: 28.85,
    lat: -2.08,
    published: "2026-07-30",
    revised: "2026-10-15",
    challenge:
      "Alimenter un bureau d'ONG situé en zone reculée, hors de portée d'un réseau électrique fiable.",
    solution:
      "Installation d'un kit solaire dimensionné pour les besoins du bureau et de ses équipements.",
    results: [
      "Continuité des opérations de terrain",
      "Solution adaptée aux sites isolés",
    ],
  },
  {
    slug: "afriland-maintenance-bunia",
    previousSlugs: ["afriland-bunia"],
    title: "Maintenance climatisation & installations techniques",
    h1: "Maintenance de la climatisation et des installations d'Afriland First Bank à Bunia",
    metaTitle: "Afriland First Bank Bunia : maintenance technique",
    client: "Afriland First Bank",
    clientNamed: true,
    sector: "Banque commerciale",
    city: "Bunia",
    province: "Ituri",
    category: "Maintenance",
    image: "/photos/tableau-pose-duo.webp",
    imageAlt: "Techniciens posant un tableau de distribution basse tension",
    summary:
      "Contrat de maintenance des systèmes de climatisation et des installations techniques de l'agence Afriland First Bank de Bunia.",
    lon: 30.25,
    lat: 1.56,
    published: "2026-07-30",
    revised: "2026-10-15",
    challenge:
      "Garantir le bon fonctionnement continu des installations techniques et de la climatisation d'une agence bancaire aux exigences élevées.",
    solution:
      "Mise en place d'un contrat de maintenance préventive et corrective, avec interventions planifiées et suivi technique.",
    results: [
      "Interventions rapides et planifiées",
      "Durée de vie des équipements prolongée",
    ],
  },
];

/** Une étude par son slug — courant ou ancien. */
export function findCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find(
    (study) => study.slug === slug || study.previousSlugs?.includes(slug),
  );
}

/**
 * Deux ou trois études voisines : même domaine d'abord, puis même province,
 * puis les plus récentes. Jamais l'étude elle-même.
 */
export function relatedCaseStudies(study: CaseStudy, count = 3): CaseStudy[] {
  const others = caseStudies.filter((item) => item.slug !== study.slug);
  const score = (item: CaseStudy) =>
    (item.category === study.category ? 2 : 0) +
    (item.province === study.province ? 1 : 0);
  return [...others]
    .sort((a, b) => score(b) - score(a))
    .slice(0, count);
}

/** Les redirections des anciens slugs — lues par `next.config.ts`. */
export const caseStudyRedirects = caseStudies.flatMap((study) =>
  (study.previousSlugs ?? []).map((previous) => ({
    source: `/references/${previous}`,
    destination: `/references/${study.slug}`,
    permanent: true,
  })),
);

/** Villes de présence — pour la carte (9 provinces confirmées). */
export type PresenceCity = {
  name: string;
  province: string;
  lon: number;
  lat: number;
  anchor: "start" | "end";
  dx: number;
  dy: number;
};

export const presenceCities: PresenceCity[] = [
  { name: "Mahagi", province: "Ituri", lon: 30.98, lat: 2.3, anchor: "end", dx: -9, dy: -4 },
  { name: "Bunia", province: "Ituri", lon: 30.25, lat: 1.56, anchor: "end", dx: -9, dy: 4 },
  { name: "Isiro", province: "Haut-Uélé", lon: 27.62, lat: 2.77, anchor: "start", dx: 9, dy: -2 },
  { name: "Butembo", province: "Nord-Kivu", lon: 29.28, lat: 0.14, anchor: "end", dx: -9, dy: 3 },
  { name: "Goma", province: "Nord-Kivu", lon: 29.22, lat: -1.68, anchor: "end", dx: -9, dy: 0 },
  { name: "Numbi", province: "Sud-Kivu", lon: 28.85, lat: -2.08, anchor: "end", dx: -9, dy: 12 },
  { name: "Kinshasa", province: "Kinshasa", lon: 15.31, lat: -4.32, anchor: "start", dx: 9, dy: -4 },
  { name: "Matadi", province: "Kongo-Central", lon: 13.45, lat: -5.82, anchor: "start", dx: 9, dy: 8 },
  { name: "Kenge", province: "Kwango", lon: 17.03, lat: -4.8, anchor: "start", dx: 9, dy: 10 },
  { name: "Kolwezi", province: "Lualaba", lon: 25.47, lat: -10.72, anchor: "end", dx: -9, dy: -2 },
  { name: "Lubumbashi", province: "Haut-Katanga", lon: 27.48, lat: -11.66, anchor: "end", dx: -9, dy: 4 },
];
