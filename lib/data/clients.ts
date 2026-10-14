import {
  Building2,
  Globe2,
  Landmark,
  RadioTower,
  Users,
  type LucideIcon,
} from "lucide-react";

export type SectorGroup = "ong" | "banque" | "public" | "telecom" | "prive";

export type Client = {
  name: string;
  monogram: string;
  /** Nom court pour puces et marquee */
  shortName: string;
  sector: string;
  sectorGroup: SectorGroup;
  city: string;
  services: string[];
  featured?: boolean;
};

export const sectorGroups: {
  id: SectorGroup;
  label: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    id: "ong",
    label: "Organisations internationales & ONG",
    description:
      "Des organisations aux standards exigeants nous confient l'énergie et la sécurité de leurs bureaux de terrain.",
    icon: Globe2,
  },
  {
    id: "banque",
    label: "Banques & institutions financières",
    description:
      "Continuité d'exploitation, conformité et sécurité : nos installations répondent aux contraintes du secteur bancaire.",
    icon: Landmark,
  },
  {
    id: "public",
    label: "Secteur public & programmes d'État",
    description:
      "Nous contribuons aux programmes nationaux de développement, dont le PDL-145T dans le territoire de Mahagi.",
    icon: Building2,
  },
  {
    id: "telecom",
    label: "Télécoms & médias",
    description:
      "Stations de radio, serveurs et infrastructures de communication alimentés en énergie stable et autonome.",
    icon: RadioTower,
  },
  {
    id: "prive",
    label: "Entreprises & organisations privées",
    description:
      "Sièges, bâtiments et salles communautaires équipés en solaire, backup et infrastructures électriques.",
    icon: Users,
  },
];

/**
 * Clients **nommés** — farde officielle TECH SOLUTION (10 références) et
 * réalisations documentées depuis. Un client qui n'a pas autorisé la
 * publication de son nom (le bar de Mbudi) n'y figure pas : il a sa
 * réalisation dans `projects`, pas de ligne ici.
 * Les personnes de contact et leurs numéros figurent dans la farde et sont
 * volontairement non publiés sur le site : « disponibles sur demande ».
 */
export const clients: Client[] = [
  {
    name: "MONUSCO / FRAPEZ",
    monogram: "MO",
    shortName: "MONUSCO / FRAPEZ",
    sector: "Organisation internationale",
    sectorGroup: "ong",
    /* La farde range sous MONUSCO / FRAPEZ les kits solaires de cinq
       stations de radio d'Ituri : un client, cinq réalisations. */
    city: "Bunia, Mahagi & Aveba",
    services: ["Kits solaires pour cinq stations de radio"],
    featured: true,
  },
  {
    name: "CARE International",
    monogram: "CA",
    shortName: "CARE International",
    sector: "ONG internationale",
    sectorGroup: "ong",
    city: "Bunia",
    services: ["Kit solaire — alimentation du bureau"],
    featured: true,
  },
  {
    name: "Save the Children",
    monogram: "SC",
    shortName: "Save the Children",
    sector: "ONG internationale",
    sectorGroup: "ong",
    city: "Bunia",
    services: ["Système d'alarme du bureau"],
    featured: true,
  },
  {
    name: "ALIMA-RDC",
    monogram: "AL",
    shortName: "ALIMA-RDC",
    sector: "ONG médicale internationale",
    sectorGroup: "ong",
    city: "Bunia",
    services: ["Kit solaire — alimentation du bureau"],
  },
  {
    name: "LSC — Ligue sociale pour la solidarité congolaise",
    monogram: "LS",
    shortName: "LSC",
    sector: "ONG nationale",
    sectorGroup: "ong",
    city: "Numbi",
    services: ["Kit solaire — bureau de Numbi"],
  },
  {
    name: "Afriland First Bank",
    monogram: "AF",
    shortName: "Afriland First Bank",
    sector: "Banque commerciale",
    sectorGroup: "banque",
    city: "Bunia",
    services: ["Maintenance climatisation & installations"],
    featured: true,
  },
  {
    name: "CADECO — Agence de Mahagi",
    monogram: "CD",
    shortName: "CADECO",
    sector: "Banque publique",
    sectorGroup: "banque",
    city: "Mahagi",
    services: ["Rénovation électrique + Système solaire"],
    featured: true,
  },
  {
    name: "Territoire de Mahagi — Projet PDL-145T",
    monogram: "PD",
    shortName: "PDL-145T Mahagi",
    sector: "Programme national de développement",
    sectorGroup: "public",
    city: "Mahagi",
    services: ["Système solaire du bureau administratif"],
    featured: true,
  },
  {
    name: "GRECOM-RDC",
    monogram: "GR",
    shortName: "GRECOM-RDC",
    sector: "Télécoms & médias",
    sectorGroup: "telecom",
    city: "Goma",
    services: ["Kit solaire — alimentation du serveur"],
  },
  {
    name: "LTJ — Les Témoins de Jéhovah asbl",
    monogram: "LT",
    shortName: "LTJ asbl",
    sector: "Organisation privée",
    sectorGroup: "prive",
    city: "Bunia, Butembo & Goma",
    services: ["Backups & systèmes solaires (4 sites)"],
  },
  {
    name: "New AZ Building",
    monogram: "AZ",
    shortName: "New AZ Building",
    sector: "Entreprise privée",
    sectorGroup: "prive",
    city: "Bunia",
    services: ["Prestations techniques & énergie"],
  },
  {
    name: "Hôtel Gracia",
    monogram: "HG",
    shortName: "Hôtel Gracia",
    sector: "Hôtellerie — hôtel, salle de fête et bar",
    sectorGroup: "prive",
    city: "Kinshasa",
    services: ["Système solaire de l'établissement"],
  },
];

export type Project = {
  title: string;
  /**
   * Bénéficiaire, quand il diffère du client : les cinq radios d'Ituri ont été
   * équipées pour le compte de MONUSCO / FRAPEZ. Le client est celui qui a
   * commandé ; le bénéficiaire, le site alimenté.
   */
  beneficiary?: string;
  /** Secteur du client — facette de filtrage de la liste des réalisations. */
  sectorGroup: SectorGroup;
  /**
   * Slug de l'étude de cas correspondante, quand ce projet en a une : c'est
   * ce lien qui évite de présenter deux fois la même réalisation sans dire
   * qu'il s'agit de la même.
   */
  caseStudy?: string;
  client: string;
  city: string;
  province: string;
  category:
    | "Solaire"
    | "Backup"
    | "Électricité"
    | "Sécurité"
    | "Maintenance"
    | "Télécoms";
  /** Année de mise en service, quand l'entreprise la connaît. */
  year?: number;
};

/**
 * Réalisations documentées : les 17 de la farde (2024–2025, l'entreprise n'a
 * pas l'année de chacune) et les deux de Kinshasa (2026).
 *
 * Un client, plusieurs réalisations : LTJ (4 sites) et MONUSCO / FRAPEZ
 * (5 radios) sont des clients uniques — la liste les regroupe par `client`.
 */
export const projects: Project[] = [
  {
    title: "Système solaire du bureau administratif du territoire (PDL-145T)",
    client: "État congolais — programme PDL-145T",
    sectorGroup: "public",
    caseStudy: "pdl-145t-mahagi",
    city: "Mahagi",
    province: "Ituri",
    category: "Solaire",
  },
  {
    title: "Rénovation électrique et système solaire de l'agence bancaire",
    client: "CADECO",
    sectorGroup: "banque",
    caseStudy: "cadeco-mahagi",
    city: "Mahagi",
    province: "Ituri",
    category: "Électricité",
  },
  {
    title: "Installation backup du site RTO",
    client: "LTJ",
    sectorGroup: "prive",
    city: "Bunia",
    province: "Ituri",
    category: "Backup",
  },
  {
    title: "Installation backup du site RTO",
    client: "LTJ",
    sectorGroup: "prive",
    caseStudy: "ltj-butembo",
    city: "Butembo",
    province: "Nord-Kivu",
    category: "Backup",
  },
  {
    title: "Système solaire — salle du royaume",
    client: "LTJ",
    sectorGroup: "prive",
    city: "Goma",
    province: "Nord-Kivu",
    category: "Solaire",
  },
  {
    title: "Système solaire — salle du royaume",
    client: "LTJ",
    sectorGroup: "prive",
    city: "Bunia",
    province: "Ituri",
    category: "Solaire",
  },
  {
    title: "Kit solaire — alimentation du bureau pays",
    client: "ALIMA-RDC",
    sectorGroup: "ong",
    city: "Bunia",
    province: "Ituri",
    category: "Solaire",
  },
  {
    title: "Kit solaire — alimentation du bureau",
    client: "CARE International",
    sectorGroup: "ong",
    city: "Bunia",
    province: "Ituri",
    category: "Solaire",
  },
  {
    title: "Kit solaire — alimentation du bureau",
    client: "LSC",
    sectorGroup: "ong",
    caseStudy: "lsc-numbi",
    city: "Numbi",
    province: "Sud-Kivu",
    category: "Solaire",
  },
  {
    title: "Système d'alarme du bureau",
    client: "Save the Children",
    sectorGroup: "ong",
    city: "Bunia",
    province: "Ituri",
    category: "Sécurité",
  },
  {
    title: "Maintenance climatisation & installations de l'agence",
    client: "Afriland First Bank",
    sectorGroup: "banque",
    caseStudy: "afriland-bunia",
    city: "Bunia",
    province: "Ituri",
    category: "Maintenance",
  },
  {
    title: "Kit solaire — alimentation du serveur télécom",
    client: "GRECOM-RDC",
    sectorGroup: "telecom",
    caseStudy: "grecom-goma",
    city: "Goma",
    province: "Nord-Kivu",
    category: "Télécoms",
  },
  {
    title: "Kit solaire — Radio La Colombe",
    client: "MONUSCO / FRAPEZ",
    beneficiary: "Radio La Colombe",
    sectorGroup: "telecom",
    city: "Mahagi",
    province: "Ituri",
    category: "Télécoms",
  },
  {
    title: "Kit solaire — Radio Canal Révélation",
    client: "MONUSCO / FRAPEZ",
    beneficiary: "Radio Canal Révélation",
    sectorGroup: "telecom",
    city: "Bunia",
    province: "Ituri",
    category: "Télécoms",
  },
  {
    title: "Kit solaire — Radio Amani",
    client: "MONUSCO / FRAPEZ",
    beneficiary: "Radio Amani",
    sectorGroup: "telecom",
    city: "Aveba",
    province: "Ituri",
    category: "Télécoms",
  },
  {
    title: "Kit solaire — RTNC",
    client: "MONUSCO / FRAPEZ",
    beneficiary: "RTNC Bunia",
    sectorGroup: "telecom",
    city: "Bunia",
    province: "Ituri",
    category: "Télécoms",
  },
  {
    title: "Kit solaire — Radio RTFi",
    client: "MONUSCO / FRAPEZ",
    beneficiary: "RTFi Bunia",
    sectorGroup: "telecom",
    city: "Bunia",
    province: "Ituri",
    category: "Télécoms",
  },
  {
    title: "Système solaire de l'hôtel, de la salle de fête et du bar",
    client: "Hôtel Gracia",
    sectorGroup: "prive",
    city: "Kinshasa",
    province: "Kinshasa",
    category: "Solaire",
    year: 2026,
  },
  {
    /* Client non nommé, à sa demande : la réalisation se décrit par ce
       qu'elle alimente, jamais par un nom inventé. */
    title: "Système solaire d'un bar avec chambres, à Mbudi",
    client: "Client privé",
    sectorGroup: "prive",
    city: "Kinshasa",
    province: "Kinshasa",
    category: "Solaire",
    year: 2026,
  },
];

/** Valeurs fondamentales — farde officielle. */
export const values = [
  {
    title: "Innovation durable",
    description: "Des solutions modernes respectueuses de l'environnement.",
  },
  {
    title: "Engagement environnemental",
    description:
      "Promouvoir les énergies renouvelables et protéger les ressources naturelles.",
  },
  {
    title: "Proximité",
    description: "Des solutions adaptées aux réalités locales.",
  },
  {
    title: "Excellence",
    description: "Qualité, performance et durabilité garanties.",
  },
  {
    title: "Responsabilité sociale",
    description: "Participer au développement des communautés.",
  },
  {
    title: "Intégrité",
    description: "Agir avec transparence et éthique.",
  },
  {
    title: "Collaboration",
    description: "Travailler main dans la main avec partenaires et populations.",
  },
] as const;
