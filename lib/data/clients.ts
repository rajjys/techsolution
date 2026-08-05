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
 * Clients & références réels — farde officielle TECH SOLUTION (10 références).
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
    city: "Bunia",
    services: ["Prestations techniques & énergie"],
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
    services: ["Rénovation électrique + centrale solaire"],
    featured: true,
  },
  {
    name: "Territoire de Mahagi — Projet PDL-145T",
    monogram: "PD",
    shortName: "PDL-145T Mahagi",
    sector: "Programme national de développement",
    sectorGroup: "public",
    city: "Mahagi",
    services: ["Centrale solaire du bureau administratif"],
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
    services: ["Backups & centrales solaires (4 sites)"],
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
];

export type Project = {
  title: string;
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
};

/** 17 réalisations documentées dans la farde de l'entreprise. */
export const projects: Project[] = [
  {
    title: "Centrale solaire du bureau administratif du territoire (PDL-145T)",
    client: "État congolais — programme PDL-145T",
    caseStudy: "pdl-145t-mahagi",
    city: "Mahagi",
    province: "Ituri",
    category: "Solaire",
  },
  {
    title: "Rénovation électrique et centrale solaire de l'agence bancaire",
    client: "CADECO",
    caseStudy: "cadeco-mahagi",
    city: "Mahagi",
    province: "Ituri",
    category: "Électricité",
  },
  {
    title: "Installation backup du site RTO",
    client: "LTJ",
    city: "Bunia",
    province: "Ituri",
    category: "Backup",
  },
  {
    title: "Installation backup du site RTO",
    client: "LTJ",
    caseStudy: "ltj-butembo",
    city: "Butembo",
    province: "Nord-Kivu",
    category: "Backup",
  },
  {
    title: "Système solaire — salle du royaume",
    client: "LTJ",
    city: "Goma",
    province: "Nord-Kivu",
    category: "Solaire",
  },
  {
    title: "Système solaire — salle du royaume",
    client: "LTJ",
    city: "Bunia",
    province: "Ituri",
    category: "Solaire",
  },
  {
    title: "Kit solaire — alimentation du bureau pays",
    client: "ALIMA-RDC",
    city: "Bunia",
    province: "Ituri",
    category: "Solaire",
  },
  {
    title: "Kit solaire — alimentation du bureau",
    client: "CARE International",
    city: "Bunia",
    province: "Ituri",
    category: "Solaire",
  },
  {
    title: "Kit solaire — alimentation du bureau",
    client: "LSC",
    caseStudy: "lsc-numbi",
    city: "Numbi",
    province: "Sud-Kivu",
    category: "Solaire",
  },
  {
    title: "Système d'alarme du bureau",
    client: "Save the Children",
    city: "Bunia",
    province: "Ituri",
    category: "Sécurité",
  },
  {
    title: "Maintenance climatisation & installations de l'agence",
    client: "Afriland First Bank",
    caseStudy: "afriland-bunia",
    city: "Bunia",
    province: "Ituri",
    category: "Maintenance",
  },
  {
    title: "Kit solaire — alimentation du serveur télécom",
    client: "GRECOM-RDC",
    caseStudy: "grecom-goma",
    city: "Goma",
    province: "Nord-Kivu",
    category: "Télécoms",
  },
  {
    title: "Kit solaire — Radio La Colombe",
    client: "Radio La Colombe",
    city: "Mahagi",
    province: "Ituri",
    category: "Télécoms",
  },
  {
    title: "Kit solaire — Radio Canal Révélation",
    client: "Radio Canal Révélation",
    city: "Bunia",
    province: "Ituri",
    category: "Télécoms",
  },
  {
    title: "Kit solaire — Radio Amani",
    client: "Radio Amani",
    city: "Aveba",
    province: "Ituri",
    category: "Télécoms",
  },
  {
    title: "Kit solaire — RTNC",
    client: "RTNC Bunia",
    city: "Bunia",
    province: "Ituri",
    category: "Télécoms",
  },
  {
    title: "Kit solaire — Radio RTFi",
    client: "RTFi Bunia",
    city: "Bunia",
    province: "Ituri",
    category: "Télécoms",
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
