import {
  Building2,
  CalendarClock,
  Factory,
  Fuel,
  Home,
  PlugZap,
  School,
  SunMedium,
  ZapOff,
  type LucideIcon,
} from "lucide-react";

import { services } from "@/lib/data/services";

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

export type SiteType = "maison" | "bureau" | "etablissement" | "industriel";
export type Situation = "aucun-reseau" | "instable" | "groupe" | "extension";
export type Timing = "urgent" | "trois-mois" | "cette-annee" | "etude";

/** Identifiant du besoin : le catalogue, ou l'un des six domaines. */
export const KIT_NEED = "kit";

/**
 * Première question — dérivée des domaines d'expertise, plus l'entrée
 * « catalogue ». Une question vague (« autre chose ») ne mène nulle part et
 * n'apprend rien au commercial : chaque réponse est désormais un domaine
 * réel, qui pilote la suite du parcours et arrive nommé dans l'email.
 */
export const needs: Option<string>[] = [
  {
    id: KIT_NEED,
    label: "Un kit du catalogue",
    detail: "Une puissance clés en main, de 650 Va à 30 kVA.",
    icon: SunMedium,
  },
  ...services.map((service) => ({
    id: service.slug,
    label: service.shortTitle,
    detail: service.delivery,
    icon: service.icon,
  })),
];

/**
 * Domaines pour lesquels l'état électrique actuel du site change le
 * dimensionnement. Pour une mise en conformité ou une alarme, la question
 * n'apprend rien : on ne la pose pas.
 */
const POWER_NEEDS = new Set([
  KIT_NEED,
  "energie-solaire",
  "backup-stockage",
  "telecom-medias",
]);

export function needsSituation(need: string | null): boolean {
  return need !== null && POWER_NEEDS.has(need);
}

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
  id: string | undefined | null,
): string | undefined {
  return options.find((option) => option.id === id)?.label;
}
