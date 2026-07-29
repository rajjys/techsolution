export type KitSegment = "residentiel" | "professionnel" | "industriel";

export type Kit = {
  id: string;
  name: string;
  power: string;
  phase: "Monophasé" | "Triphasé";
  segment: KitSegment;
  inverter: string;
  battery: string;
  panels: string;
  usage: string;
  featured?: boolean;
};

export const kitSegments: { id: KitSegment | "tous"; label: string }[] = [
  { id: "tous", label: "Tous les kits" },
  { id: "residentiel", label: "Résidentiel" },
  { id: "professionnel", label: "Professionnel" },
  { id: "industriel", label: "Industriel" },
];

/**
 * Kits solaires clés en main — composition officielle Tech Solution
 * (source : catalogue « Nos kits solaires »). Prix communiqués sur devis.
 */
export const kits: Kit[] = [
  {
    id: "kit-650va",
    name: "Kit Solaire Hybride 650 Va",
    power: "650 Va",
    phase: "Monophasé",
    segment: "residentiel",
    inverter: "1 onduleur hybride 850 Va / 12 V",
    battery: "1 batterie gel 150 Ah / 12 V",
    panels: "1 panneau 450 W",
    usage: "TV 32\", laptop, 8 lampes, fer à repasser 400 W, décodeur, téléphone.",
  },
  {
    id: "kit-1-5kva",
    name: "Kit Solaire Hybride 1,5 kVA",
    power: "1,5 kVA",
    phase: "Monophasé",
    segment: "residentiel",
    inverter: "1 onduleur 1,5 kVA",
    battery: "1 batterie lithium 2,5 kWh",
    panels: "2 panneaux 450 W",
    usage: "Frigo 120 L, TV 55\", laptop, 14 lampes, fer à repasser, décodeur.",
  },
  {
    id: "kit-3kva",
    name: "Kit Solaire Hybride 3 kVA",
    power: "3 kVA",
    phase: "Monophasé",
    segment: "residentiel",
    inverter: "1 onduleur 3 kVA",
    battery: "1 batterie lithium 5 kWh",
    panels: "4 panneaux 450 W",
    usage: "Congélateur, frigo, TV 55\", laptop, 30 lampes, fer à repasser, décodeur.",
  },
  {
    id: "kit-5kva",
    name: "Kit Solaire Hybride 5 kVA",
    power: "5 kVA",
    phase: "Monophasé",
    segment: "residentiel",
    inverter: "1 onduleur hybride 5 kVA",
    battery: "1 batterie lithium 5 kWh",
    panels: "6 panneaux 550 W",
    usage: "Congélateur, frigo, TV 100\", laptop, cafetière, éclairage complet.",
    featured: true,
  },
  {
    id: "kit-8kva",
    name: "Kit Solaire 8 kVA",
    power: "8 kVA",
    phase: "Monophasé",
    segment: "professionnel",
    inverter: "1 onduleur hybride 8 kVA",
    battery: "1 batterie lithium 10 kWh",
    panels: "10 panneaux 550 W",
    usage: "Fer à repasser, congélateur, frigo, TV 100\", bouilloire, éclairage.",
  },
  {
    id: "kit-10kva",
    name: "Kit Solaire Hybride 10 kVA",
    power: "10 kVA",
    phase: "Monophasé",
    segment: "professionnel",
    inverter: "1 onduleur hybride 10 kVA",
    battery: "1 batterie lithium 10 kWh",
    panels: "12 panneaux 550 W",
    usage: "2 climatiseurs 9000 BTU, frigo, fer à repasser, congélateur, TV 100\".",
    featured: true,
  },
  {
    id: "kit-12kva",
    name: "Kit Solaire 12 kVA",
    power: "12 kVA",
    phase: "Monophasé",
    segment: "professionnel",
    inverter: "2 onduleurs hybrides 6 kVA",
    battery: "1 batterie lithium 17,5 kWh",
    panels: "14 panneaux 550 W",
    usage: "Appartement, école, ferme, auberge, université.",
  },
  {
    id: "kit-20kva",
    name: "Kit Solaire 20 kVA",
    power: "20 kVA",
    phase: "Monophasé",
    segment: "industriel",
    inverter: "2 onduleurs 10 kVA",
    battery: "1 batterie lithium 35 kWh",
    panels: "30 panneaux 550 W",
    usage: "Centre de santé, appartement, école, hôtel, université.",
  },
  {
    id: "kit-30kva",
    name: "Kit Solaire Semi-Industriel 30 kVA",
    power: "30 kVA",
    phase: "Triphasé",
    segment: "industriel",
    inverter: "1 onduleur hybride 30 kVA triphasé",
    battery: "1 batterie lithium 52 kWh",
    panels: "48 panneaux 550 W",
    usage: "Hôpital, auberge, centre de santé, appartement, école, université, usine.",
    featured: true,
  },
];
