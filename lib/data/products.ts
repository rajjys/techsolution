import {
  BatteryCharging,
  Boxes,
  Lightbulb,
  PanelTop,
  ShieldCheck,
  Sun,
  Zap,
  type LucideIcon,
} from "lucide-react";

export type ProductCategory =
  | "panneaux"
  | "onduleurs"
  | "batteries"
  | "protection"
  | "distribution"
  | "eclairage"
  | "kits";

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  specs: string[];
  highlight?: boolean;
};

export const productCategories: {
  id: ProductCategory | "tous";
  label: string;
  icon: LucideIcon;
}[] = [
  { id: "tous", label: "Tous les produits", icon: Boxes },
  { id: "panneaux", label: "Panneaux solaires", icon: Sun },
  { id: "onduleurs", label: "Onduleurs", icon: Zap },
  { id: "batteries", label: "Batteries lithium", icon: BatteryCharging },
  { id: "protection", label: "Protection", icon: ShieldCheck },
  { id: "distribution", label: "Distribution", icon: PanelTop },
  { id: "eclairage", label: "Éclairage public", icon: Lightbulb },
  { id: "kits", label: "Kits solaires", icon: Boxes },
];

export const categoryVisuals: Record<
  ProductCategory,
  { icon: LucideIcon; gradient: string }
> = {
  panneaux: { icon: Sun, gradient: "from-navy-800 via-navy-900 to-navy-950" },
  onduleurs: { icon: Zap, gradient: "from-navy-700 via-navy-800 to-navy-950" },
  batteries: {
    icon: BatteryCharging,
    gradient: "from-navy-800 via-navy-950 to-black",
  },
  protection: {
    icon: ShieldCheck,
    gradient: "from-navy-700 via-navy-900 to-navy-950",
  },
  distribution: {
    icon: PanelTop,
    gradient: "from-navy-800 via-navy-900 to-black",
  },
  eclairage: {
    icon: Lightbulb,
    gradient: "from-navy-700 via-navy-800 to-navy-900",
  },
  kits: { icon: Boxes, gradient: "from-navy-800 via-navy-900 to-navy-950" },
};

/**
 * Catalogue indicatif — chaque équipement est dimensionné et confirmé
 * après étude technique du site. Prix communiqués sur devis.
 */
export const products: Product[] = [
  {
    id: "panneau-mono-450",
    name: "Panneau solaire monocristallin 450 Wc",
    category: "panneaux",
    description:
      "Module haute performance pour installations résidentielles et tertiaires, excellent rendement sous fort ensoleillement.",
    specs: ["450 Wc", "Mono PERC", "Cadre aluminium", "Certifié IEC"],
    highlight: true,
  },
  {
    id: "panneau-mono-550",
    name: "Panneau solaire half-cut 550 Wc",
    category: "panneaux",
    description:
      "Module grande puissance à cellules half-cut pour centrales solaires industrielles et institutionnelles.",
    specs: ["550 Wc", "Half-cut 144 cellules", "Faible dégradation", "Usage intensif"],
  },
  {
    id: "onduleur-hybride-5kva",
    name: "Onduleur hybride 5 kVA / 48 V",
    category: "onduleurs",
    description:
      "Onduleur hybride avec régulateur MPPT intégré — idéal bureaux, agences et résidences à consommation soutenue.",
    specs: ["5 kVA", "48 V", "MPPT intégré", "Sortie onde pure"],
    highlight: true,
  },
  {
    id: "onduleur-hybride-10kva",
    name: "Onduleur hybride 10 kVA triphasé",
    category: "onduleurs",
    description:
      "Solution triphasée pour sites industriels, banques et bâtiments administratifs à forte charge.",
    specs: ["10 kVA", "Triphasé 380 V", "Parallélisable", "Monitoring Wi-Fi"],
  },
  {
    id: "onduleur-chargeur-3kva",
    name: "Onduleur-chargeur backup 3 kVA",
    category: "onduleurs",
    description:
      "Système de secours automatique pour serveurs, studios radio et équipements critiques.",
    specs: ["3 kVA", "Basculement < 10 ms", "Chargeur intégré", "Compact"],
  },
  {
    id: "batterie-lithium-5kwh",
    name: "Batterie lithium LiFePO₄ 5 kWh / 48 V",
    category: "batteries",
    description:
      "Stockage lithium fer phosphate longue durée, sûr et sans entretien, pour systèmes hybrides 48 V.",
    specs: ["5,12 kWh", "LiFePO₄", "6000 cycles", "BMS intégré"],
    highlight: true,
  },
  {
    id: "batterie-lithium-10kwh",
    name: "Batterie lithium rack 10 kWh",
    category: "batteries",
    description:
      "Module rackable haute capacité pour parcs de stockage évolutifs en site tertiaire ou télécom.",
    specs: ["10,24 kWh", "Format rack 19\"", "Empilable", "Écran LCD"],
  },
  {
    id: "parc-batteries-modulaire",
    name: "Armoire de stockage modulaire 20 kWh+",
    category: "batteries",
    description:
      "Parc batteries complet en armoire, extensible selon la charge — conçu pour les sites à autonomie prolongée.",
    specs: ["20 kWh et +", "Extensible", "Protection intégrée", "Supervision"],
  },
  {
    id: "parafoudre-dc-t2",
    name: "Parafoudre DC Type II",
    category: "protection",
    description:
      "Protection des chaînes photovoltaïques contre les surtensions atmosphériques et de manœuvre.",
    specs: ["1000 V DC", "Type II", "Cartouches remplaçables", "Rail DIN"],
  },
  {
    id: "coffret-protection-acdc",
    name: "Coffret de protection AC/DC",
    category: "protection",
    description:
      "Coffret pré-câblé regroupant sectionneurs, fusibles et parafoudres pour une installation solaire sécurisée.",
    specs: ["AC + DC", "IP65", "Pré-câblé", "Conforme normes"],
  },
  {
    id: "armoire-distribution",
    name: "Armoire de distribution industrielle",
    category: "distribution",
    description:
      "Tableau général basse tension sur mesure pour bâtiments administratifs, bancaires et industriels.",
    specs: ["Sur mesure", "Basse tension", "Disjoncteurs qualité", "Repérage complet"],
  },
  {
    id: "lampadaire-solaire-60w",
    name: "Lampadaire solaire tout-en-un 60 W",
    category: "eclairage",
    description:
      "Éclairage public autonome avec panneau, batterie et détecteur intégrés — zéro raccordement réseau.",
    specs: ["60 W LED", "Autonome", "Détecteur de présence", "IP66"],
  },
  {
    id: "kit-solaire-pro-3kva",
    name: "Kit solaire professionnel 3 kVA",
    category: "kits",
    description:
      "Le kit éprouvé sur nos installations de bureaux d'ONG et stations de radio : panneaux, onduleur hybride et stockage lithium.",
    specs: ["3 kVA", "Panneaux + lithium", "Installation incluse", "Formation incluse"],
    highlight: true,
  },
  {
    id: "kit-solaire-institution-5kva",
    name: "Kit solaire institutionnel 5 kVA",
    category: "kits",
    description:
      "Configuration renforcée pour agences bancaires, bâtiments administratifs et bureaux d'organisations internationales.",
    specs: ["5 kVA", "Autonomie renforcée", "Supervision", "Contrat maintenance"],
  },
];
