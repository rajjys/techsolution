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
  foundedYear: 2024,
  approach: "100% client",
} as const;

export type NavLink = {
  label: string;
  href: string;
};

export const navLinks: NavLink[] = [
  { label: "Services", href: "/services" },
  { label: "Produits", href: "/produits" },
  { label: "Références", href: "/references" },
  { label: "À propos", href: "/about" },
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
