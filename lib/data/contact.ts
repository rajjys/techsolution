import {
  Building2,
  CalendarClock,
  Factory,
  Fuel,
  Home,
  PlugZap,
  Ruler,
  School,
  SunMedium,
  Wrench,
  ZapOff,
  type LucideIcon,
} from "lucide-react";

/**
 * Options de l'entonnoir de contact.
 *
 * Le principe : le prospect **clique** son contexte et ne **tape** que ses
 * coordonnées. Chaque réponse épargne un aller-retour au commercial — savoir
 * qu'il s'agit d'une villa sous groupe électrogène pour dans trois mois vaut
 * plus qu'un paragraphe libre.
 *
 * Ces listes sont la source unique : le formulaire les affiche, l'API les
 * relit pour reconstituer les libellés dans l'email. Un identifiant qui
 * change ici change partout.
 */
export type Option<T extends string> = {
  id: T;
  label: string;
  detail: string;
  icon: LucideIcon;
};

export type Intent = "kit" | "etude" | "depannage" | "autre";
export type SiteType = "maison" | "bureau" | "etablissement" | "industriel";
export type Situation = "aucun-reseau" | "instable" | "groupe" | "extension";
export type Timing = "urgent" | "trois-mois" | "cette-annee" | "etude";

export const intents: Option<Intent>[] = [
  {
    id: "kit",
    label: "Un kit du catalogue",
    detail: "Je sais à peu près quelle puissance il me faut.",
    icon: SunMedium,
  },
  {
    id: "etude",
    label: "Une étude sur mesure",
    detail: "Dimensionnez pour moi, à partir de mes besoins réels.",
    icon: Ruler,
  },
  {
    id: "depannage",
    label: "Un dépannage, une maintenance",
    detail: "Une installation existante à réparer ou à entretenir.",
    icon: Wrench,
  },
  {
    id: "autre",
    label: "Autre chose",
    detail: "Électricité, sécurité électronique, télécoms.",
    icon: PlugZap,
  },
];

export const siteTypes: Option<SiteType>[] = [
  {
    id: "maison",
    label: "Une maison, une villa",
    detail: "Usage domestique",
    icon: Home,
  },
  {
    id: "bureau",
    label: "Un bureau, un commerce",
    detail: "ONG, agence, boutique",
    icon: Building2,
  },
  {
    id: "etablissement",
    label: "Un établissement",
    detail: "École, santé, hôtel",
    icon: School,
  },
  {
    id: "industriel",
    label: "Un site industriel ou télécom",
    detail: "Atelier, antenne, station",
    icon: Factory,
  },
];

export const situations: Option<Situation>[] = [
  {
    id: "aucun-reseau",
    label: "Aucun réseau",
    detail: "Le site n'est pas raccordé.",
    icon: ZapOff,
  },
  {
    id: "instable",
    label: "Un réseau instable",
    detail: "Des coupures régulières.",
    icon: PlugZap,
  },
  {
    id: "groupe",
    label: "Un groupe électrogène",
    detail: "Je veux réduire le carburant.",
    icon: Fuel,
  },
  {
    id: "extension",
    label: "Du solaire déjà en place",
    detail: "À étendre ou à reprendre.",
    icon: SunMedium,
  },
];

export const timings: Option<Timing>[] = [
  {
    id: "urgent",
    label: "Dès que possible",
    detail: "Le site est à l'arrêt ou presque.",
    icon: CalendarClock,
  },
  {
    id: "trois-mois",
    label: "Dans les trois mois",
    detail: "Le budget est prévu.",
    icon: CalendarClock,
  },
  {
    id: "cette-annee",
    label: "Cette année",
    detail: "Le projet est acté, la date non.",
    icon: CalendarClock,
  },
  {
    id: "etude",
    label: "Je me renseigne",
    detail: "Je compare avant de décider.",
    icon: CalendarClock,
  },
];

/** Retrouve le libellé d'une option à partir de son identifiant. */
export function labelOf<T extends string>(
  options: Option<T>[],
  id: string | undefined,
): string | undefined {
  return options.find((option) => option.id === id)?.label;
}
