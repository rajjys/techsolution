import {
  AirVent,
  Building2,
  PackageCheck,
  ShieldCheck,
  Truck,
  Wrench,
  Factory,
  Home,
  Hotel,
  Laptop,
  Lightbulb,
  Refrigerator,
  School,
  Smartphone,
  Snowflake,
  Sprout,
  Stethoscope,
  Tv,
  type LucideIcon,
} from "lucide-react";

import type { ProductCategorySlug } from "@/lib/data/products";

export type KitSegment = "residentiel" | "professionnel" | "industriel";

/** Ce qu'un kit fait tourner — un appareil, ou un lieu pour les fortes puissances. */
export type KitLoad = {
  icon: LucideIcon;
  /** Libellé court — pastilles compactes de l'accueil. */
  label: string;
  /** Libellé explicite — liste de la page produits, où la place ne manque pas. */
  detail?: string;
};

export type Kit = {
  /**
   * Identifiant d'URL — lisible et indexable. C'est le dernier segment de la
   * fiche produit (`/produits/kits-solaires/<slug>`) et il voyage dans
   * `/contact?kit=<slug>`.
   */
  slug: string;
  /**
   * Anciens identifiants, encore présents dans des liens partagés et des URL
   * `/contact?kit=` indexées. `findKit` les résout ; ils ne servent à rien
   * d'autre.
   */
  previousSlugs?: string[];
  /** Gamme de rattachement — tous les kits sont des « kits solaires ». */
  category: ProductCategorySlug;
  name: string;
  power: string;
  phase: "Monophasé" | "Triphasé";
  segment: KitSegment;
  /** Palier, en un mot — affiché à côté de la phase. */
  tier: string;
  /** La promesse en une ligne, du point de vue du client. */
  outcome: string;
  /** Composition officielle, en toutes lettres — fiche détaillée. */
  inverter: string;
  battery: string;
  panels: string;
  /** Les mêmes valeurs en repères courts — colonnes du comparatif et cartes. */
  specs: { inverter: string; battery: string; panels: string };
  /**
   * Pictos plutôt qu'une phrase : on scanne, on ne lit pas. Quatre au plus.
   * Jusqu'à 10 kVA on liste des appareils ; au-delà, des lieux — c'est la
   * frontière naturelle du catalogue, et celle du client non technique.
   */
  runs: KitLoad[];
  /** Phrase d'origine du catalogue, conservée comme source. */
  usage: string;
  /** Le plus demandé de son segment. */
  featured?: boolean;
  /** Mis en avant dans la sélection de la page d'accueil. */
  showcase?: boolean;
};

/**
 * Segments — libellés du point de vue du client. Personne ne se reconnaît
 * dans « résidentiel » ou « industriel » : on se reconnaît dans « ma maison ».
 */
export const kitSegments: {
  id: KitSegment;
  label: string;
  detail: string;
  icon: LucideIcon;
}[] = [
  {
    id: "residentiel",
    label: "Ma maison",
    detail: "Foyer, appartement, villa",
    icon: Home,
  },
  {
    id: "professionnel",
    label: "Mon bureau",
    detail: "Bureau, commerce, ONG",
    icon: Building2,
  },
  {
    id: "industriel",
    label: "Mon établissement",
    detail: "École, santé, hôtel, usine",
    icon: Factory,
  },
];

/**
 * Photo d'une fiche kit, par segment. Aucun kit n'a sa propre photo : ce sont
 * des chantiers de l'entreprise qui montrent le **type** d'installation, et
 * leur texte alternatif ne prétend pas montrer le kit lui-même.
 */
export const kitSegmentPhotos: Record<
  KitSegment,
  { src: string; alt: string; position: string }
> = {
  residentiel: {
    src: "/photos/backup-onduleur-technicien.webp",
    alt: "Technicien Tech Solution RDC fixant un onduleur hybride au mur",
    position: "50% 40%",
  },
  professionnel: {
    src: "/photos/onduleurs-muraux-batiment.webp",
    alt: "Onduleurs, chemins de câbles et coffret de distribution installés par Tech Solution RDC",
    position: "50% 50%",
  },
  industriel: {
    src: "/photos/drone-quartier-couverture.webp",
    alt: "Vue aérienne de toitures équipées de panneaux solaires",
    position: "50% 55%",
  },
};

/**
 * Kits solaires clés en main — composition officielle Tech Solution
 * (source : catalogue « Nos kits solaires »). Prix communiqués sur devis.
 * L'ordre du tableau est celui de l'échelle de puissance : ne pas le casser.
 */
export const kits: Kit[] = [
  {
    slug: "kit-solaire-hybride-650-va",
    category: "kits-solaires",
    name: "Kit Solaire Hybride 650 VA",
    power: "650 VA",
    phase: "Monophasé",
    segment: "residentiel",
    tier: "Essentiel",
    outcome: "L'éclairage et l'essentiel, sans coupure.",
    inverter: "1 onduleur hybride 850 VA / 12 V",
    battery: "1 batterie gel 150 Ah / 12 V",
    panels: "1 panneau 450 W",
    specs: { inverter: "850 VA", battery: "150 Ah", panels: "1 × 450 W" },
    runs: [
      { icon: Tv, label: 'TV 32"', detail: "Une TV 32 pouces" },
      { icon: Laptop, label: "Laptop", detail: "Un ordinateur portable" },
      { icon: Lightbulb, label: "8 lampes", detail: "8 points d’éclairage" },
      { icon: Smartphone, label: "Recharge", detail: "Recharge des téléphones" },
    ],
    usage: 'TV 32", laptop, 8 lampes, fer à repasser 400 W, décodeur, téléphone.',
  },
  {
    slug: "kit-solaire-hybride-1-5-kva",
    category: "kits-solaires",
    name: "Kit Solaire Hybride 1,5 kVA",
    power: "1,5 kVA",
    phase: "Monophasé",
    segment: "residentiel",
    tier: "Compact",
    outcome: "L'essentiel du foyer, sans coupure.",
    inverter: "1 onduleur 1,5 kVA",
    battery: "1 batterie lithium 2,5 kWh",
    panels: "2 panneaux 450 W",
    specs: { inverter: "1,5 kVA", battery: "2,5 kWh", panels: "2 × 450 W" },
    runs: [
      { icon: Refrigerator, label: "Frigo", detail: "Réfrigérateur" },
      { icon: Tv, label: "TV", detail: "Une TV 55 pouces" },
      { icon: Laptop, label: "Laptop", detail: "Un ordinateur portable" },
      { icon: Lightbulb, label: "Éclairage", detail: "Éclairage complet du logement" },
    ],
    usage: 'Frigo 120 L, TV 55", laptop, 14 lampes, fer à repasser, décodeur.',
    showcase: true,
  },
  {
    slug: "kit-solaire-hybride-3-kva",
    category: "kits-solaires",
    name: "Kit Solaire Hybride 3 kVA",
    power: "3 kVA",
    phase: "Monophasé",
    segment: "residentiel",
    tier: "Familial",
    outcome: "Le foyer complet, congélateur inclus.",
    inverter: "1 onduleur 3 kVA",
    battery: "1 batterie lithium 5 kWh",
    panels: "4 panneaux 450 W",
    specs: { inverter: "3 kVA", battery: "5 kWh", panels: "4 × 450 W" },
    runs: [
      { icon: Snowflake, label: "Congélateur", detail: "Congélateur" },
      { icon: Refrigerator, label: "Frigo", detail: "Réfrigérateur" },
      { icon: Tv, label: 'TV 55"', detail: "Une TV 55 pouces" },
      { icon: Lightbulb, label: "30 lampes", detail: "30 points d’éclairage" },
    ],
    usage: 'Congélateur, frigo, TV 55", laptop, 30 lampes, fer à repasser, décodeur.',
  },
  {
    slug: "kit-solaire-hybride-5-kva",
    category: "kits-solaires",
    name: "Kit Solaire Hybride 5 kVA",
    power: "5 kVA",
    phase: "Monophasé",
    segment: "residentiel",
    tier: "Villa",
    outcome: "Toute la villa en autonomie 24/7.",
    inverter: "1 onduleur hybride 5 kVA",
    battery: "1 batterie lithium 5 kWh",
    panels: "6 panneaux 550 W",
    specs: { inverter: "5 kVA", battery: "5 kWh", panels: "6 × 550 W" },
    runs: [
      { icon: Snowflake, label: "Congélateur", detail: "Congélateur" },
      { icon: Refrigerator, label: "Frigo", detail: "Réfrigérateur" },
      { icon: Tv, label: 'TV 100"', detail: "Une TV 100 pouces" },
      { icon: Lightbulb, label: "Éclairage", detail: "Éclairage complet du logement" },
    ],
    usage: 'Congélateur, frigo, TV 100", laptop, cafetière, éclairage complet.',
    featured: true,
    showcase: true,
  },
  {
    slug: "kit-solaire-hybride-8-kva",
    previousSlugs: ["kit-solaire-8-kva"],
    category: "kits-solaires",
    name: "Kit Solaire Hybride 8 kVA",
    power: "8 kVA",
    phase: "Monophasé",
    segment: "professionnel",
    tier: "Bureau",
    outcome: "Un petit bureau qui ne s'arrête pas.",
    inverter: "1 onduleur hybride 8 kVA",
    battery: "1 batterie lithium 10 kWh",
    panels: "10 panneaux 550 W",
    specs: { inverter: "8 kVA", battery: "10 kWh", panels: "10 × 550 W" },
    runs: [
      { icon: Snowflake, label: "Congélateur", detail: "Congélateur" },
      { icon: Refrigerator, label: "Frigo", detail: "Réfrigérateur" },
      { icon: Tv, label: 'TV 100"', detail: "Une TV 100 pouces" },
      { icon: Lightbulb, label: "Éclairage", detail: "Éclairage complet du logement" },
    ],
    usage: 'Fer à repasser, congélateur, frigo, TV 100", bouilloire, éclairage.',
  },
  {
    slug: "kit-solaire-hybride-10-kva",
    category: "kits-solaires",
    name: "Kit Solaire Hybride 10 kVA",
    power: "10 kVA",
    phase: "Monophasé",
    segment: "professionnel",
    tier: "Confort",
    outcome: "Clim, frigo et bureau, sans arbitrage.",
    inverter: "1 onduleur hybride 10 kVA",
    battery: "1 batterie lithium 10 kWh",
    panels: "12 panneaux 550 W",
    specs: { inverter: "10 kVA", battery: "10 kWh", panels: "12 × 550 W" },
    runs: [
      { icon: AirVent, label: "2 clims", detail: "2 climatiseurs 9000 BTU" },
      { icon: Refrigerator, label: "Frigo", detail: "Réfrigérateur" },
      { icon: Tv, label: 'TV 100"', detail: "Une TV 100 pouces" },
      { icon: Laptop, label: "Bureau", detail: "Poste de travail complet" },
    ],
    usage: '2 climatiseurs 9000 BTU, frigo, fer à repasser, congélateur, TV 100".',
    featured: true,
    showcase: true,
  },
  {
    slug: "kit-solaire-hybride-12-kva",
    previousSlugs: ["kit-solaire-12-kva"],
    category: "kits-solaires",
    name: "Kit Solaire Hybride 12 kVA",
    power: "12 kVA",
    phase: "Monophasé",
    segment: "professionnel",
    tier: "Bâtiment",
    outcome: "Un bâtiment entier, école ou auberge.",
    inverter: "2 onduleurs hybrides 6 kVA",
    battery: "1 batterie lithium 17,5 kWh",
    panels: "14 panneaux 550 W",
    specs: { inverter: "2 × 6 kVA", battery: "17,5 kWh", panels: "14 × 550 W" },
    runs: [
      { icon: Building2, label: "Appartement", detail: "Un appartement entier" },
      { icon: School, label: "École", detail: "Une école" },
      { icon: Sprout, label: "Ferme", detail: "Une ferme" },
      { icon: Hotel, label: "Auberge", detail: "Une auberge" },
    ],
    usage: "Appartement, école, ferme, auberge, université.",
  },
  {
    slug: "kit-solaire-hybride-20-kva",
    previousSlugs: ["kit-solaire-20-kva"],
    category: "kits-solaires",
    name: "Kit Solaire Hybride 20 kVA",
    power: "20 kVA",
    phase: "Monophasé",
    segment: "industriel",
    tier: "Collectif",
    outcome: "Un site recevant du public, en continu.",
    inverter: "2 onduleurs 10 kVA",
    battery: "1 batterie lithium 35 kWh",
    panels: "30 panneaux 550 W",
    specs: { inverter: "2 × 10 kVA", battery: "35 kWh", panels: "30 × 550 W" },
    runs: [
      { icon: Stethoscope, label: "Centre de santé", detail: "Un centre de santé" },
      { icon: School, label: "École", detail: "Une école" },
      { icon: Hotel, label: "Hôtel", detail: "Un hôtel" },
      { icon: Building2, label: "Appartement", detail: "Un appartement entier" },
    ],
    usage: "Centre de santé, appartement, école, hôtel, université.",
  },
  {
    slug: "kit-solaire-hybride-30-kva-triphase",
    previousSlugs: ["kit-solaire-semi-industriel-30-kva"],
    category: "kits-solaires",
    /* Le seul triphasé de la gamme : c'est le premier critère d'un acheteur
       à ce palier, il appartient donc au nom. Le catalogue d'origine le
       disait « semi-industriel ». */
    name: "Kit Solaire Hybride 30 kVA Triphasé",
    power: "30 kVA",
    phase: "Triphasé",
    segment: "industriel",
    tier: "Commercial",
    outcome: "La puissance d'un établissement entier.",
    inverter: "1 onduleur hybride 30 kVA triphasé",
    battery: "1 batterie lithium 52 kWh",
    panels: "48 panneaux 550 W",
    specs: { inverter: "30 kVA · 3ϕ", battery: "52 kWh", panels: "48 × 550 W" },
    runs: [
      { icon: Hotel, label: "Hôtel", detail: "Un hôtel" },
      { icon: Stethoscope, label: "Santé", detail: "Un centre de santé" },
      { icon: School, label: "École", detail: "Une école" },
      { icon: Factory, label: "Usine", detail: "Un atelier industriel" },
    ],
    usage: "Hôpital, auberge, centre de santé, appartement, école, université, usine.",
    featured: true,
    showcase: true,
  },
];

/** Kits mis en avant sur la page d'accueil, dans l'ordre de l'échelle. */
export const showcaseKits = kits.filter((kit) => kit.showcase);

/**
 * Un kit par son identifiant, ancien compris. Toute recherche par slug passe
 * par ici — la page contact, l'API et les fiches — pour qu'un lien partagé
 * avant le renommage arrive toujours sur le bon kit.
 */
export function findKit(slug: string | null | undefined): Kit | undefined {
  if (!slug) return undefined;
  return kits.find(
    (kit) => kit.slug === slug || kit.previousSlugs?.includes(slug),
  );
}

/** Kits d'un segment, dans l'ordre de l'échelle. */
export function kitsForSegment(segment: KitSegment): Kit[] {
  return kits.filter((kit) => kit.segment === segment);
}

/** Les paliers voisins d'un kit sur l'échelle — « un cran en dessous / au-dessus ». */
export function kitNeighbours(kit: Kit): { lower?: Kit; higher?: Kit } {
  const index = kits.findIndex((item) => item.slug === kit.slug);
  return { lower: kits[index - 1], higher: kits[index + 1] };
}

/**
 * Ce qui accompagne chaque kit — vaut pour les neuf. Ces quatre engagements
 * étaient écrits dans /produits ; ils servent désormais au catalogue, à la
 * gamme et à chaque fiche.
 */
export const kitCommitments: {
  icon: LucideIcon;
  title: string;
  text: string;
}[] = [
  {
    icon: ShieldCheck,
    title: "Équipements certifiés",
    text: "Onduleurs hybrides, batteries lithium LiFePO₄ et panneaux monocristallins de marques éprouvées.",
  },
  {
    icon: PackageCheck,
    title: "Dimensionnement inclus",
    text: "La composition annoncée est un point de départ : elle est ajustée après l'audit de charge de votre site.",
  },
  {
    icon: Truck,
    title: "Livraison & installation",
    text: "Acheminement et pose par nos propres techniciens, dans les 26 provinces.",
  },
  {
    icon: Wrench,
    title: "Garantie & maintenance",
    text: "Un an renouvelable sur les kits, et un contrat d'entretien planifié si vous le souhaitez.",
  },
];
