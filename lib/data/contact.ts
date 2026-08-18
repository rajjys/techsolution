import {
  BatteryCharging,
  Building2,
  CalendarClock,
  CalendarRange,
  Cctv,
  Factory,
  Fuel,
  Home,
  PlugZap,
  Radio,
  Scale,
  School,
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

/**
 * Identifiant historique du raccourci « catalogue ».
 *
 * Il n'est plus une réponse possible à la première question : un kit **est**
 * une installation solaire, pas une catégorie parallèle — le proposer à côté
 * des six domaines revenait à mettre l'enfant à côté du parent, et le visiteur
 * devait trancher entre « je veux du solaire » et « je veux un kit », ce qui
 * n'est pas un choix. La puissance est désormais demandée plus loin dans le
 * parcours solaire, une fois qu'on sait ce qu'il y a à alimenter.
 *
 * L'identifiant survit pour les liens `?need=kit` déjà en place sur /produits :
 * ils sont réécrits vers le solaire à l'entrée.
 */
export const KIT_NEED = "kit";

/**
 * Première question — les six domaines, nommés par ce qu'on installe.
 *
 * Deux formulations ont été essayées et écartées. « Backup & stockage » :
 * notre organigramme, pas le besoin du visiteur. Puis « Ne plus subir les
 * coupures » : un argument de vente, alors qu'à ce stade la vente est faite —
 * on a lu le site, on vient passer commande, pas se faire convaincre une fois
 * de plus. Il reste ce qu'on livre, dit en groupe nominal simple, complétant
 * la question sans effort de lecture. Le vocabulaire technique tient dans le
 * détail, où il sert de preuve.
 *
 * L'identifiant reste le slug du service : c'est lui qui relie la demande au
 * domaine dans l'email, et il ne doit jamais diverger.
 */
const NEED_COPY: Record<
  string,
  { label: string; detail: string; icon: LucideIcon }
> = {
  "energie-solaire": {
    label: "Une installation solaire",
    detail: "Panneaux, onduleur et batteries, dimensionnés sur mesure.",
    icon: Sun,
  },
  "backup-stockage": {
    label: "Un système de secours",
    detail: "Onduleurs et batteries qui prennent le relais dès la coupure.",
    icon: BatteryCharging,
  },
  "infrastructure-electrique": {
    label: "Une installation électrique",
    detail: "Tableaux, câblage, mise à la terre, protection foudre.",
    icon: Zap,
  },
  "telecom-medias": {
    label: "L'alimentation d'un site isolé",
    detail: "Antenne, station radio, serveur : de l'énergie sans réseau.",
    icon: Radio,
  },
  "securite-electronique": {
    label: "Des caméras, une alarme",
    detail: "Vidéosurveillance, contrôle d'accès, alimentation secourue.",
    icon: Cctv,
  },
  "maintenance-froid": {
    label: "Un entretien ou un dépannage",
    detail: "Contrat préventif, réparation, entretien des climatisations.",
    icon: Wrench,
  },
};

/** Les six domaines — la totalité des réponses à la première question. */
export const needs: Option<string>[] = services.map((service) => ({
  id: service.slug,
  label: NEED_COPY[service.slug]?.label ?? service.shortTitle,
  detail: NEED_COPY[service.slug]?.detail ?? service.delivery,
  icon: NEED_COPY[service.slug]?.icon ?? service.icon,
}));

/** Le domaine que sert le catalogue de kits — cible de `?need=kit`. */
export const SOLAR_NEED = "energie-solaire";

/**
 * Normalise un besoin reçu par l'URL. `?need=kit` vient des appels posés sur
 * /produits : ils désignent le catalogue, donc le solaire.
 */
export function resolveNeed(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  if (raw === KIT_NEED) return SOLAR_NEED;
  return needs.find((option) => option.id === raw)?.id;
}

/**
 * Domaines pour lesquels l'état électrique actuel du site change le
 * dimensionnement. Pour une mise en conformité ou une alarme, la question
 * n'apprend rien : on ne la pose pas.
 */
const POWER_NEEDS = new Set([
  "energie-solaire",
  "backup-stockage",
  "telecom-medias",
]);

export function needsSituation(need: string | null): boolean {
  return need !== null && POWER_NEEDS.has(need);
}

/**
 * Domaines que le catalogue couvre réellement — les kits sont des ensembles
 * solaires hybrides (onduleur + batteries + panneaux). Un site télécom ou une
 * mise en conformité se chiffrent sur mesure : leur poser l'échelle de
 * puissance du catalogue n'aurait pas de sens.
 */
const CATALOGUE_NEEDS = new Set(["energie-solaire", "backup-stockage"]);

export function needsPowerTier(need: string | null): boolean {
  return need !== null && CATALOGUE_NEEDS.has(need);
}

/**
 * « Qu'y a-t-il à … ? » — le verbe suit le domaine choisi.
 *
 * Demander ce qu'il y a « à alimenter » à quelqu'un venu pour un contrat
 * d'entretien sonnait faux : il ne vient rien alimenter.
 */
export function siteQuestion(need: string | null): {
  title: string;
  hint: string;
} {
  if (need === "maintenance-froid") {
    return {
      title: "Qu'y a-t-il à entretenir ?",
      hint: "C'est ce qui donne l'étendue du contrat.",
    };
  }
  if (need === "securite-electronique") {
    return {
      title: "Qu'y a-t-il à protéger ?",
      hint: "C'est ce qui donne le nombre de points à couvrir.",
    };
  }
  return {
    title: "Qu'y a-t-il à alimenter ?",
    hint: "C'est ce qui donne la taille de l'installation.",
  };
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
