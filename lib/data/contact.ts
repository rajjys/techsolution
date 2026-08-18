import {
  BatteryCharging,
  Building2,
  CalendarClock,
  CalendarRange,
  Factory,
  Fuel,
  Home,
  PlugZap,
  Radio,
  School,
  Scale,
  ShieldCheck,
  Sun,
  SunMedium,
  Wrench,
  Zap,
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
 * Première question — les six domaines d'expertise, formulés en résultats.
 *
 * L'entonnoir affichait jusqu'ici `shortTitle` et `delivery` : « Backup &
 * stockage », « Télécoms & médias ». C'est notre organigramme, pas le
 * problème du visiteur — et docs/design-system.md §9 est explicite là-dessus.
 * Les libellés ci-dessous disent ce qu'il vient chercher ; le vocabulaire de
 * métier redescend dans le détail, où il sert de preuve sans occuper la place
 * du message.
 *
 * Ils sont plus courts que le champ `outcome` de `lib/data/services.ts`, qui
 * est une phrase de titre de section : une carte de choix se lit d'un coup
 * d'œil, dans une colonne de 250 px. Même intention, autre registre.
 *
 * L'identifiant reste le slug du service : c'est lui qui relie la demande au
 * domaine dans l'email, et il ne doit jamais diverger.
 */
const NEED_COPY: Record<string, { label: string; detail: string; icon: LucideIcon }> = {
  "energie-solaire": {
    label: "Ne plus subir les coupures",
    detail: "Une centrale solaire dimensionnée sur vos consommations réelles.",
    icon: Sun,
  },
  "backup-stockage": {
    label: "Garder l'essentiel allumé",
    detail: "Onduleurs et batteries qui prennent le relais, 24 h/24.",
    icon: BatteryCharging,
  },
  "infrastructure-electrique": {
    label: "Sécuriser mon installation",
    detail: "Tableaux, distribution électrique, protection foudre, conformité.",
    icon: Zap,
  },
  "telecom-medias": {
    label: "Alimenter un site isolé",
    detail: "Station radio, antenne, serveur : énergie autonome hors réseau.",
    icon: Radio,
  },
  "securite-electronique": {
    label: "Protéger mes locaux",
    detail: "Caméras, alarme et contrôle d'accès sur alimentation secourue.",
    icon: ShieldCheck,
  },
  "maintenance-froid": {
    label: "Entretenir mon installation",
    detail: "Contrat préventif, dépannage rapide, entretien des climatisations.",
    icon: Wrench,
  },
};

/**
 * Les six domaines. L'entrée « catalogue » n'en fait pas partie : elle ne
 * répond pas à la même question — « voilà mon problème » d'un côté, « je sais
 * déjà ce qu'il me faut » de l'autre. Elle est posée à part dans le
 * formulaire, sous la forme d'un raccourci, et non comme une septième option
 * de même poids.
 */
export const domainNeeds: Option<string>[] = services.map((service) => ({
  id: service.slug,
  label: NEED_COPY[service.slug]?.label ?? service.shortTitle,
  detail: NEED_COPY[service.slug]?.detail ?? service.delivery,
  icon: NEED_COPY[service.slug]?.icon ?? service.icon,
}));

/** Le raccourci catalogue, seul de son espèce. */
export const kitNeed: Option<string> = {
  id: KIT_NEED,
  label: "Je connais déjà ma puissance",
  detail: "Choisir directement dans le catalogue, de 650 Va à 30 kVA.",
  icon: SunMedium,
};

/** Tous les besoins confondus — pour retrouver un libellé depuis un identifiant. */
export const needs: Option<string>[] = [kitNeed, ...domainNeeds];

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
    detail: "Un logement, pour votre foyer.",
    icon: Home,
  },
  {
    id: "bureau",
    label: "Un bureau, un commerce",
    detail: "Bureau d'ONG, agence, boutique, atelier.",
    icon: Building2,
  },
  {
    id: "etablissement",
    label: "Un établissement recevant du public",
    detail: "École, centre de santé, hôtel, lieu de culte.",
    icon: School,
  },
  {
    id: "industriel",
    label: "Un site industriel ou télécom",
    detail: "Usine, antenne, station radio, dépôt.",
    icon: Factory,
  },
];

export const situations: Option<Situation>[] = [
  {
    id: "aucun-reseau",
    label: "Pas d'électricité du tout",
    detail: "Le site n'est raccordé à rien.",
    icon: ZapOff,
  },
  {
    id: "instable",
    label: "Le réseau, avec des coupures",
    detail: "Il est là, mais on ne peut pas compter dessus.",
    icon: PlugZap,
  },
  {
    id: "groupe",
    label: "Un groupe électrogène",
    detail: "Et une facture de carburant à faire baisser.",
    icon: Fuel,
  },
  {
    id: "extension",
    label: "Du solaire déjà installé",
    detail: "À étendre, à réparer ou à reprendre.",
    icon: SunMedium,
  },
];

export const timings: Option<Timing>[] = [
  /* Quatre horloges identiques ne distinguaient rien : l'écran se lisait
     comme une seule réponse répétée. Une icône par degré d'urgence. */
  {
    id: "urgent",
    label: "Le plus vite possible",
    detail: "Le site est à l'arrêt, ou tout comme.",
    icon: Zap,
  },
  {
    id: "trois-mois",
    label: "Dans les trois mois",
    detail: "Le budget est déjà prévu.",
    icon: CalendarClock,
  },
  {
    id: "cette-annee",
    label: "Cette année",
    detail: "Le projet est acté, la date non.",
    icon: CalendarRange,
  },
  {
    id: "etude",
    label: "Je compare encore",
    detail: "Je veux d'abord savoir ce que ça implique.",
    icon: Scale,
  },
];

/** Retrouve le libellé d'une option à partir de son identifiant. */
export function labelOf<T extends string>(
  options: Option<T>[],
  id: string | undefined | null,
): string | undefined {
  return options.find((option) => option.id === id)?.label;
}

/* ─────────────────────────────────────────────────────────────────────────
 * Règles de saisie — source unique.
 *
 * Le formulaire les applique **avant** l'envoi et l'API les réapplique après
 * réception : deux barrières, une seule définition. Sans ça, le visiteur
 * découvrait chaque erreur au retour du réseau, une par une, sous un libellé
 * qui nommait le champ en anglais (« Champ « name » : Nom trop court »).
 *
 * Les messages sont rédigés pour être lus par le visiteur, pas par le
 * développeur : ils disent quoi faire, pas ce qui est invalide.
 * ───────────────────────────────────────────────────────────────────────── */

/** Champs saisis à la main — les seuls qui peuvent être en erreur. */
export type ContactField = "name" | "phone" | "city" | "email" | "message";

/** Un numéro congolais s'écrit de dix façons : on reste large, on nettoie après. */
export const PHONE_PATTERN = /^\+?[0-9\s().-]{8,20}$/;

export const FIELD_LABELS: Record<ContactField, string> = {
  name: "Nom complet",
  phone: "Téléphone",
  city: "Ville du site",
  email: "Email",
  message: "Précisions",
};

/**
 * Valide un champ isolément. Retourne `undefined` si tout va bien, sinon le
 * message à afficher sous le champ.
 */
export function validateField(
  field: ContactField,
  raw: string,
): string | undefined {
  const value = raw.trim();
  switch (field) {
    case "name":
      if (value.length === 0) return "Indiquez votre nom.";
      if (value.length < 2) return "Ce nom paraît trop court.";
      if (value.length > 120) return "Ce nom est trop long.";
      return undefined;
    case "phone":
      if (value.length === 0) return "Indiquez un numéro où vous rappeler.";
      if (!PHONE_PATTERN.test(value))
        return "Numéro incomplet — exemple : +243 821 250 250";
      return undefined;
    case "city":
      if (value.length === 0) return "Indiquez la ville du site.";
      if (value.length < 2) return "Ce nom de ville paraît trop court.";
      if (value.length > 120) return "Ce nom de ville est trop long.";
      return undefined;
    case "email":
      /* Facultatif : vide est valide. Rempli, il doit être exploitable. */
      if (value.length === 0) return undefined;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value))
        return "Cette adresse email semble incomplète.";
      return undefined;
    case "message":
      if (value.length > 5000) return "Message trop long (5 000 caractères).";
      return undefined;
  }
}

/** Valide tout le bloc de coordonnées d'un coup. */
export function validateContact(
  values: Record<ContactField, string>,
): Partial<Record<ContactField, string>> {
  const errors: Partial<Record<ContactField, string>> = {};
  for (const field of Object.keys(FIELD_LABELS) as ContactField[]) {
    const error = validateField(field, values[field] ?? "");
    if (error) errors[field] = error;
  }
  return errors;
}
