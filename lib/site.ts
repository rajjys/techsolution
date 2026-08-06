/**
 * Configuration centrale du site — TECH SOLUTION RDC.
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
  base: "Bunia, Province de l'Ituri — RDC",
  hours: "Lun. – Sam., 8h00 – 17h00",
  /**
   * Farde technique publique — téléchargeable sans formulaire. C'est une
   * copie de docs/FARDE TECH SOLUTION.pdf : la version publique est destinée
   * à être expurgée (coordonnées des clients notamment), l'originale reste
   * la source interne.
   */
  fardeUrl: "/farde-tech-solution.pdf",
  foundedYear: 2024,
  approach: "100% client",
} as const;

export type Office = {
  city: string;
  /** Siège ou antenne — affiché en pastille à côté de la ville. */
  role: string;
  street: string;
  region: string;
  headquarters?: boolean;
};

/**
 * Implantations — Bunia est le siège ; Kinshasa couvre l'Ouest du pays.
 * Source unique consommée par le pied de page et la page contact.
 */
export const offices: Office[] = [
  {
    city: "Bunia",
    role: "Siège",
    street: "Boulevard de la Libération, près du Rond-Point Zéro",
    region: "Province de l'Ituri",
    headquarters: true,
  },
  {
    city: "Kinshasa",
    role: "Antenne",
    street: "Limete, 2ᵉ Rue Industrielle",
    region: "Ville-province de Kinshasa",
  },
];

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

/** Chiffres clés — tous documentés dans la farde de l'entreprise. */
export const metrics = [
  {
    value: 17,
    suffix: "+",
    label: "Projets livrés",
    detail: "Installations documentées et opérationnelles",
  },
  {
    value: 10,
    suffix: "+",
    label: "Clients institutionnels",
    detail: "ONG internationales, banques et entreprises",
  },
  {
    value: 26,
    suffix: "",
    label: "Provinces couvertes",
    detail: "Capacité d'intervention sur toute la RDC",
  },
  {
    value: 100,
    suffix: "%",
    label: "Démarche client",
    detail: "Engagement qualité de bout en bout",
  },
] as const;
