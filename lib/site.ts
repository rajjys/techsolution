import { clients, projects } from "@/lib/data/clients";

/**
 * Configuration système du site — TECH SOLUTION RDC.
 * Données issues de la farde officielle de l'entreprise (docs/FARDE TECH SOLUTION.pdf).
 */
export const site = {
  name: "Tech Solution RDC",
  legalName: "TECH SOLUTION RDC",
  domain: "techsolution.cd",
  url: "https://techsolution.cd",
  tagline: "La révolution énergétique",
  description:
    "Solutions énergétiques, solaires et infrastructures techniques en République Démocratique du Congo.",
  phone: "+243821250250",
  phoneDisplay: "+243 821 250 250",
  whatsappNumber: "243821250250",
  email: "info@techsolution.cd",
  /*
   * « Heure locale », et non « heure de l'Est » : la RDC a deux fuseaux.
   * Kinshasa est à UTC+1, Bunia à UTC+2, et les deux bureaux ouvrent de
   * 8h à 17h à leur heure (confirmé par l'entreprise, oct. 2026). Le libellé
   * précédent annonçait 7h–16h à un visiteur de Kinshasa.
   */
  hours: "Lun. – Sam., 8h00 – 17h00 (heure locale)",
  /**
   * Farde technique publique — téléchargeable sans formulaire. C'est une
   * copie de docs/FARDE TECH SOLUTION.pdf : la version publique est destinée
   * à être expurgée (coordonnées des clients notamment), l'originale reste
   * la source interne.
   */
  fardeUrl: "/farde-tech-solution.pdf",
  /**
   * Provinces où des installations ont été livrées, sur les 26 du pays.
   * Chiffre déclaré par l'entreprise : les 17 réalisations publiées n'en
   * documentent que trois (Ituri, Nord-Kivu, Sud-Kivu). Quand les six autres
   * seront nommées, les passer à `active: true` dans lib/data/drc.ts et
   * dériver ce nombre de là, pour que la carte les marque aussi.
   */
  provincesDelivered: 9,
  /**
   * Foyers équipés — chiffre **déclaré** par l'entreprise, qui ne figure pas
   * dans la farde (⚠️ À SOURCER). Il se compte à part des réalisations :
   * une installation documentée et un foyer équipé ne sont pas la même unité,
   * et les additionner (« 77+ installations ») faisait dire au site trois
   * nombres différents pour le même mot.
   */
  householdsEquipped: 60,
  foundedYear: 2024,
  approach: "100% client",
} as const;

/**
 * Identifiants légaux — fournis par l'entreprise.
 *
 * En RDC, ce sont les trois numéros qu'un acheteur institutionnel vérifie
 * avant d'ouvrir un dossier, et ils manquaient partout : le pied de page
 * affichait « Certifié & agréé » sans rien pour l'étayer. Ils sont repris
 * dans le balisage `Organization`, où ils servent de preuve d'entité.
 *
 * Note : le RCCM est immatriculé à Goma (`CD/GOM/…`) alors que le siège
 * d'exploitation est à Bunia. C'est l'état déclaré, on ne le corrige pas.
 */
export const legal = {
  rccm: "CD/GOM/RCCM/24-A-02549",
  idnat: "19-G4701-N41786J",
  nif: "A2417275E",
} as const;

/**
 * Comptes officiels — alimentent `sameAs` du balisage `Organization`.
 *
 * `sameAs` est ce qui relie le domaine aux profils dans le graphe d'entités
 * de Google. C'est le levier le plus direct contre la confusion de marque :
 * au moins cinq entités portent un nom voisin de « Tech Solution RDC », et
 * `techsolution.cd` ne sortait pas en première page sur son propre nom.
 *
 * ⚠️ Le profil LinkedIn est un profil **personnel** (`/in/`), pas une page
 * d'entreprise (`/company/`). Il fait moins bien le travail dans `sameAs` —
 * à remplacer si une page d'entreprise est créée.
 */
export const socialLinks = [
  {
    label: "Facebook",
    /* L'URL fournie passait par `/login/?next=` : c'est un mur de connexion,
       pas une adresse de profil. Seul l'identifiant est conservé. */
    href: "https://www.facebook.com/61573693041161",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/tech-solution-congo-a87308353",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/tech_solution_rdc",
  },
] as const;

/**
 * La direction — confirmé par l'entreprise (oct. 2026).
 *
 * Le parcours est celui qui a été communiqué, mot pour mot : l'école n'est
 * pas connue, elle n'est donc pas citée. Deux photos le montrent dans ses
 * deux rôles — en costume pour la direction, en tenue siglée sur un toit pour
 * l'ingénierie.
 */
export const leader = {
  name: "Jonathan Mupenda",
  role: "Fondateur, directeur général et ingénieur principal",
  training: "Ingénieur en électricité et électronique",
  photo: "/photos/jonathan-mupenda-ceo.webp",
  photoOnSite: "/photos/jonathan-mupenda-chantier-bras-croises.webp",
  /** Parcours — dans l'ordre, tel que confirmé. */
  career: [
    { period: "2019 – 2022", text: "Ingénieur systèmes solaires chez BBOXX" },
    {
      period: "2022 – 2024",
      text: "Responsable du centre de réparation de Bunia et de Goma",
    },
    { period: "2024", text: "Fonde Tech Solution RDC" },
  ],
  /** Ce que le secteur négligeait — la raison d'être de l'entreprise. */
  overlooked: ["la qualité du matériel", "l'entretien dans la durée", "la garantie"],
} as const;

export type Office = {
  city: string;
  /** Siège ou antenne — affiché en pastille à côté de la ville. */
  role: string;
  street: string;
  region: string;
  headquarters?: boolean;
  /**
   * La fiche Google Business Profile, une fois validée — relevée dans le
   * code « Locator Plus » de la fiche (15 oct. 2026). Sans elle, pas de
   * coordonnées : le centre-ville n'est pas l'adresse du bureau, et un `geo`
   * approximatif contredirait la fiche au lieu de la confirmer.
   */
  google?: {
    placeId: string;
    /** Identifiant décimal de la fiche (CID) — `maps.google.com/?cid=`. */
    cid: string;
    lat: number;
    lon: number;
  };
};

/**
 * Implantations — Bunia est le siège ; Kinshasa couvre l'Ouest du pays.
 * Source unique consommée par le pied de page et la page contact.
 *
 * Ce sont les **deux seuls** bureaux (confirmé, oct. 2026) : pas de bureau à
 * Goma, bien que le RCCM y soit immatriculé, et pas de boutique à Lubumbashi
 * — la photo `boutique-tech-solution-lubumbashi` montre un partenaire qui
 * affiche notre visuel. Les deux bureaux partagent le même numéro.
 */
export const offices: Office[] = [
  {
    city: "Bunia",
    role: "Siège",
    street: "32 Avenue Bakuwasa, Quartier Hoho, Commune de Mbunya",
    region: "Province de l'Ituri",
    headquarters: true,
    google: {
      placeId: "ChIJbxNQLnwrZBcRMNJNxcfTxlo",
      cid: "6541148363764388400",
      lat: 1.5403231,
      lon: 30.2400022,
    },
  },
  {
    city: "Kinshasa",
    role: "Antenne",
    /* Même écriture que Bunia — numéro, voie, commune — et la même partout :
       site, balisage, fiche Google, réseaux sociaux. */
    street: "157 Avenue Mbomu, Commune de Kinshasa",
    region: "Ville-province de Kinshasa",
    /* Fiche Google pas encore validée (15 oct. 2026) : `google` à ajouter
       dès qu'elle l'est. */
  },
];

/** Siège social — source unique pour le NAP principal. */
export function getHeadquarters(): Office {
  return offices.find((office) => office.headquarters) ?? offices[0];
}

/** Adresse postale complète sur une ligne (cohérence NAP footer / contact / JSON-LD). */
export function formatOfficeAddress(office: Office): string {
  return `${office.street}, ${office.city}, ${office.region}`;
}

/**
 * Le lien Google Maps d'un bureau. Avec une fiche validée, il ouvre **la
 * fiche** (avis, photos, horaires, itinéraire) par son Place ID — les visites
 * comptent pour elle. Sans fiche, une recherche sur l'adresse.
 *
 * @see https://developers.google.com/maps/documentation/urls/get-started
 */
export function officeMapsUrl(office: Office): string {
  const query = encodeURIComponent(
    office.google ? site.name : formatOfficeAddress(office),
  );
  const placeId = office.google
    ? `&query_place_id=${office.google.placeId}`
    : "";
  return `https://www.google.com/maps/search/?api=1&query=${query}${placeId}`;
}

/**
 * L'itinéraire jusqu'au bureau — le lien « Itinéraire » du pied de page.
 * Vers une fiche validée, la demande compte dans ses statistiques
 * (« demandes d'itinéraire »).
 */
export function officeDirectionsUrl(office: Office): string {
  const destination = encodeURIComponent(
    office.google ? site.name : formatOfficeAddress(office),
  );
  const placeId = office.google
    ? `&destination_place_id=${office.google.placeId}`
    : "";
  return `https://www.google.com/maps/dir/?api=1&destination=${destination}${placeId}`;
}

export type NavLink = {
  label: string;
  href: string;
};

/**
 * Navigation principale — sans « Contact » : l'appel à l'action du header,
 * le bouton flottant et la conclusion du pied de page y mènent déjà.
 */
export const navLinks: NavLink[] = [
  { label: "Services", href: "/services" },
  { label: "Produits", href: "/produits" },
  { label: "Références", href: "/references" },
  { label: "À propos", href: "/about" },
];

/** Pied de page — le plan du site y reste complet, Contact compris. */
export const footerLinks: NavLink[] = [
  ...navLinks,
  { label: "Contact", href: "/contact" },
];

/**
 * Chiffres clés de /about — dérivés de la donnée, sauf les foyers (déclarés).
 *
 * Ils disaient « 17+ projets » et « 10+ clients » écrits à la main, quand le
 * reste du site en comptait déjà 19 et 12. Les foyers remplacent « 100 %
 * démarche client », qui est un slogan (il reste au pied de page) : c'est le
 * chiffre qui manquait aux particuliers, et le site leur parlait trop peu.
 */
export const metrics = [
  {
    value: projects.length,
    suffix: "",
    label: "Installations documentées",
    detail: "Chantiers livrés, avec leur client et leur lieu",
  },
  {
    value: site.householdsEquipped,
    suffix: "+",
    label: "Foyers équipés",
    detail: "Maisons et villas alimentées au solaire",
  },
  {
    value: clients.length,
    suffix: "",
    label: "Clients nommés",
    detail: "ONG internationales, banques, programmes d'État, hôtellerie",
  },
  {
    value: 26,
    suffix: "",
    label: "Provinces couvertes",
    detail: "Capacité d'intervention sur toute la RDC",
  },
];
