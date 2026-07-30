/**
 * Études de cas — construites à partir des réalisations documentées dans la
 * farde officielle (docs/FARDE TECH SOLUTION.pdf). Chaque projet porte une
 * localisation (ville + province) qui pilote la carte de la section.
 */
export type CaseCategory =
  | "Solaire"
  | "Backup"
  | "Électricité"
  | "Télécoms"
  | "Maintenance";

export type CaseStudy = {
  slug: string;
  title: string;
  client: string;
  sector: string;
  city: string;
  province: string;
  category: CaseCategory;
  /** Repère technique (indicatif — à confirmer avec données réelles) */
  spec: string;
  image: string;
  imageAlt: string;
  summary: string;
  /** Coordonnées pour la carte */
  lon: number;
  lat: number;
  /** Contenu de la page dédiée */
  challenge: string;
  solution: string;
  results: string[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "pdl-145t-mahagi",
    title: "Centrale solaire du bureau administratif du territoire",
    client: "Programme PDL-145T — État congolais",
    sector: "Secteur public",
    city: "Mahagi",
    province: "Ituri",
    category: "Solaire",
    spec: "≈ 8 kVA · Lithium 10 kWh",
    image: "/gallery-web/commercial.jpg",
    imageAlt: "Centrale solaire sur bâtiment administratif à Mahagi",
    summary:
      "Alimentation solaire autonome du bureau administratif du territoire, dans le cadre du Programme de Développement Local des 145 territoires.",
    lon: 30.98,
    lat: 2.3,
    challenge:
      "Assurer une alimentation électrique fiable au bureau administratif du territoire de Mahagi, dans une zone où le réseau public est absent ou instable, pour garantir la continuité du service public.",
    solution:
      "Conception et installation d'une centrale solaire hybride dimensionnée sur les charges réelles du bâtiment, avec stockage et supervision, dans le cadre du programme national PDL-145T.",
    results: [
      "Continuité de service du bureau administratif",
      "Autonomie énergétique sans groupe électrogène",
      "Installation conforme aux exigences du programme d'État",
    ],
  },
  {
    slug: "cadeco-mahagi",
    title: "Rénovation électrique & centrale solaire de l'agence bancaire",
    client: "CADECO",
    sector: "Banque publique",
    city: "Mahagi",
    province: "Ituri",
    category: "Électricité",
    spec: "Rénovation + ≈ 5 kVA solaire",
    image: "/gallery-web/service-electricite.jpg",
    imageAlt: "Rénovation électrique de l'agence CADECO de Mahagi",
    summary:
      "Rénovation complète de l'infrastructure électrique et installation d'une centrale solaire pour l'agence CADECO de Mahagi.",
    lon: 30.98,
    lat: 2.34,
    challenge:
      "Moderniser une agence bancaire en activité, dont l'installation électrique vieillissante ne garantissait plus la continuité d'exploitation ni la sécurité des équipements.",
    solution:
      "Rénovation de l'infrastructure électrique et déploiement d'une centrale solaire, réalisés sans interrompre l'activité de l'agence.",
    results: [
      "Continuité d'exploitation bancaire assurée",
      "Protection des équipements sensibles",
      "Installation électrique aux normes",
    ],
  },
  {
    slug: "grecom-goma",
    title: "Alimentation solaire du serveur télécom",
    client: "GRECOM-RDC",
    sector: "Télécoms & médias",
    city: "Goma",
    province: "Nord-Kivu",
    category: "Télécoms",
    spec: "Backup serveur · ≈ 3 kVA",
    image: "/gallery-web/service-telecom.jpg",
    imageAlt: "Alimentation solaire d'une salle serveur à Goma",
    summary:
      "Alimentation autonome et stable du serveur télécom de GRECOM-RDC à Goma, pour une disponibilité continue des services.",
    lon: 29.22,
    lat: -1.68,
    challenge:
      "Garantir une alimentation ininterrompue au serveur télécom de GRECOM, où toute coupure entraîne une perte de service pour les utilisateurs.",
    solution:
      "Installation d'un kit solaire avec stockage lithium dédié à la salle technique, assurant un relais sans interruption.",
    results: [
      "Disponibilité continue du serveur",
      "Zéro interruption liée aux coupures réseau",
      "Réduction de la dépendance au groupe électrogène",
    ],
  },
  {
    slug: "ltj-butembo",
    title: "Système backup pour le site RTO",
    client: "LTJ",
    sector: "Organisation privée",
    city: "Butembo",
    province: "Nord-Kivu",
    category: "Backup",
    spec: "Backup ≈ 5 kVA · Lithium",
    image: "/gallery-web/service-backup.jpg",
    imageAlt: "Système backup lithium installé à Butembo",
    summary:
      "Installation d'un système de secours (backup) pour le site RTO de LTJ à Butembo, garantissant la continuité en cas de coupure.",
    lon: 29.28,
    lat: 0.14,
    challenge:
      "Maintenir l'activité du site malgré des coupures fréquentes du réseau, sans recourir à un groupe électrogène bruyant et coûteux.",
    solution:
      "Déploiement d'un système backup avec onduleur hybride et batteries lithium, à relais automatique instantané.",
    results: [
      "Continuité assurée pendant les coupures",
      "Fonctionnement silencieux",
      "Maintenance réduite",
    ],
  },
  {
    slug: "lsc-numbi",
    title: "Kit solaire pour le bureau LSC",
    client: "LSC — Ligue sociale pour la solidarité congolaise",
    sector: "ONG nationale",
    city: "Numbi",
    province: "Sud-Kivu",
    category: "Solaire",
    spec: "Kit ≈ 3 kVA · Off-grid",
    image: "/gallery-web/residentiel.jpg",
    imageAlt: "Kit solaire installé sur le bureau LSC à Numbi",
    summary:
      "Kit solaire alimentant le bureau de LSC à Numbi, en zone reculée du Sud-Kivu, pour une autonomie totale.",
    lon: 28.85,
    lat: -2.08,
    challenge:
      "Alimenter un bureau d'ONG situé en zone reculée, hors de portée d'un réseau électrique fiable.",
    solution:
      "Installation d'un kit solaire hybride autonome, dimensionné pour les besoins du bureau et de ses équipements.",
    results: [
      "Autonomie énergétique complète",
      "Continuité des opérations de terrain",
      "Solution adaptée aux sites isolés",
    ],
  },
  {
    slug: "afriland-bunia",
    title: "Maintenance climatisation & installations techniques",
    client: "Afriland First Bank",
    sector: "Banque commerciale",
    city: "Bunia",
    province: "Ituri",
    category: "Maintenance",
    spec: "Contrat de maintenance annuel",
    image: "/gallery-web/service-maintenance.jpg",
    imageAlt: "Maintenance des installations de l'agence Afriland à Bunia",
    summary:
      "Contrat de maintenance des systèmes de climatisation et des installations techniques de l'agence Afriland First Bank de Bunia.",
    lon: 30.25,
    lat: 1.56,
    challenge:
      "Garantir le bon fonctionnement continu des installations techniques et de la climatisation d'une agence bancaire aux exigences élevées.",
    solution:
      "Mise en place d'un contrat de maintenance préventive et corrective, avec interventions planifiées et suivi technique.",
    results: [
      "Disponibilité maximale des installations",
      "Interventions rapides et planifiées",
      "Durée de vie des équipements prolongée",
    ],
  },
];

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
