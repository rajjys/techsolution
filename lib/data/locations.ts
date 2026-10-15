/**
 * Zones d'intervention — une page par ville, mais seulement là où il y a
 * quelque chose de local à dire (docs/SEO-STRATEGY.md §5).
 *
 * Trois paliers :
 * 1. **Bureau** — une adresse, une équipe permanente, des horaires : page
 *    complète avec balisage `LocalBusiness` (Bunia, Kinshasa).
 * 2. **Ville prouvée** — des réalisations documentées et des faits locaux
 *    fournis par l'entreprise, mais pas d'adresse : page sans `LocalBusiness`
 *    (Goma, Mahagi).
 * 3. **Ville desservie** — l'entreprise y intervient, rien n'y est encore
 *    documenté : pas de page, une mention honnête sur /zones. Une ville monte
 *    d'un palier à sa première réalisation documentée.
 *
 * Une page de ville dont le contenu resterait vrai sans le nom de la ville
 * n'est pas une page locale : c'est une page-portail, et Google la traite
 * comme telle. D'où les `localFacts`, tous fournis par l'entreprise.
 */
export type ZoneTier = 1 | 2;

export type Zone = {
  slug: string;
  name: string;
  province: string;
  tier: ZoneTier;
  /** Ville du bureau dans `offices` (lib/site.ts) — palier 1 seulement. */
  officeCity?: string;
  /** Équipe technique permanente sur place (confirmé, oct. 2026). */
  permanentTeam: boolean;
  /**
   * H1, en deux temps : le métier et le lieu, puis l'accent. `{count}` est
   * remplacé par le nombre de réalisations documentées dans la ville.
   */
  h1: [string, string];
  metaDescription: string;
  /** Une phrase d'ouverture, propre à la ville. */
  lead: string;
  /** Ce que l'entreprise a dit de son activité ici — rien d'autre. */
  localFacts: string[];
  image: string;
  imageAlt: string;
  imagePosition?: string;
  /** Dernière révision réelle — `lastmod`. */
  revised: string;
  lon: number;
  lat: number;
};

const FOUNDER_REPAIR_CENTRE =
  "Notre fondateur, Jonathan Mupenda, a dirigé de 2022 à 2024 le centre de réparation de Bunia et de Goma.";

export const zones: Zone[] = [
  {
    slug: "kinshasa",
    name: "Kinshasa",
    province: "Kinshasa",
    tier: 1,
    officeCity: "Kinshasa",
    permanentTeam: true,
    h1: ["Installation solaire à Kinshasa :", "notre antenne, nos chantiers."],
    metaDescription:
      "Antenne de Kinshasa (157 Avenue Mbomu, commune de Kinshasa) et équipe sur place. L'hôtel Gracia (38,5 kWc) et un bar de Mbudi sont passés au solaire.",
    lead: "Nos deux clients documentés à Kinshasa avaient le même problème : quand la SNEL coupait, leurs appareils s'arrêtaient. Notre antenne et son équipe technique travaillent depuis la commune de Kinshasa.",
    localFacts: [
      "Une équipe technique permanente, basée à Kinshasa.",
      "Ouvert du lundi au samedi, de 8 h à 17 h, heure de Kinshasa.",
      "Audit de charge sur site et devis gratuits, réponse sous 24 h ouvrées.",
    ],
    image: "/photos/hotel-gracia-champ-solaire-toiture.webp",
    imageAlt: "Champ de panneaux solaires sur la toiture de l'hôtel Gracia, Kinshasa en arrière-plan",
    imagePosition: "50% 45%",
    revised: "2026-10-15",
    lon: 15.31,
    lat: -4.32,
  },
  {
    slug: "bunia",
    name: "Bunia",
    province: "Ituri",
    tier: 1,
    officeCity: "Bunia",
    permanentTeam: true,
    h1: ["Installation solaire à Bunia :", "notre siège, {count} chantiers documentés."],
    metaDescription:
      "Siège de Tech Solution RDC (32 Avenue Bakuwasa, Hoho) : CARE, ALIMA, Save the Children, Afriland et cinq radios équipées à Bunia et en Ituri.",
    lead: "Bunia est notre siège et la ville où nous avons le plus livré : bureaux d'ONG internationales, agence bancaire, stations de radio, salles communautaires.",
    localFacts: [
      "Le siège de l'entreprise et une équipe technique permanente.",
      "Ouvert du lundi au samedi, de 8 h à 17 h, heure de Bunia.",
      FOUNDER_REPAIR_CENTRE,
      "Audit de charge sur site et devis gratuits, réponse sous 24 h ouvrées.",
    ],
    image: "/photos/equipe-trois-techniciens.webp",
    imageAlt: "Trois techniciens Tech Solution RDC en tenue de chantier",
    imagePosition: "50% 30%",
    revised: "2026-10-15",
    lon: 30.25,
    lat: 1.56,
  },
  {
    slug: "goma",
    name: "Goma",
    province: "Nord-Kivu",
    tier: 2,
    permanentTeam: true,
    h1: ["Installation solaire à Goma :", "une équipe sur place."],
    metaDescription:
      "Une équipe technique permanente à Goma : le serveur de GRECOM-RDC alimenté au solaire, une salle communautaire équipée. Audit et devis gratuits.",
    lead: "Nous n'avons pas de bureau à Goma, mais une équipe technique permanente — et deux installations livrées, dont l'alimentation solaire du serveur de GRECOM-RDC.",
    localFacts: [
      "Une équipe technique permanente à Goma, sans bureau ouvert au public : on nous joint au même numéro, par téléphone ou par WhatsApp.",
      FOUNDER_REPAIR_CENTRE,
      "Audit de charge sur site et devis gratuits, réponse sous 24 h ouvrées.",
    ],
    image: "/photos/drone-ensemble-panneaux.webp",
    imageAlt: "Vue aérienne de panneaux solaires installés par Tech Solution RDC sur une toiture",
    revised: "2026-10-15",
    lon: 29.22,
    lat: -1.68,
  },
  {
    slug: "mahagi",
    name: "Mahagi",
    province: "Ituri",
    tier: 2,
    permanentTeam: false,
    h1: ["Installation solaire à Mahagi :", "{count} chantiers livrés."],
    metaDescription:
      "Le bureau administratif du territoire (PDL-145T), l'agence CADECO et la radio La Colombe : trois installations livrées à Mahagi, en Ituri.",
    lead: "Mahagi est la ville où nous avons le plus livré après Bunia : le bureau administratif du territoire, l'agence bancaire CADECO et une station de radio.",
    localFacts: [
      "Mahagi est dans l'Ituri, la province de notre siège de Bunia.",
      "Pour chaque chantier, des techniciens sont recrutés sur place et travaillent sous contrat ; la maintenance locale fonctionne de la même façon.",
      "Audit de charge sur site et devis gratuits, réponse sous 24 h ouvrées.",
    ],
    image: "/photos/mahagi-batiment-administratif.webp",
    imageAlt: "Bâtiment administratif du territoire de Mahagi, équipé par Tech Solution RDC",
    imagePosition: "50% 40%",
    revised: "2026-10-15",
    lon: 30.98,
    lat: 2.3,
  },
];

/**
 * Palier 3 — l'entreprise y intervient, rien n'y est encore documenté (ou une
 * seule réalisation, sans faits locaux). Pas de page : une mention sur /zones.
 */
export const servedCities: { name: string; province: string }[] = [
  { name: "Butembo", province: "Nord-Kivu" },
  { name: "Beni", province: "Nord-Kivu" },
  { name: "Kisangani", province: "Tshopo" },
  { name: "Lubumbashi", province: "Haut-Katanga" },
  { name: "Matadi", province: "Kongo-Central" },
];

/** La façon de travailler hors des villes à équipe permanente (confirmé). */
export const SERVED_CITY_MODEL =
  "Pour chaque chantier, des techniciens sont recrutés sur place et travaillent sous contrat ; la maintenance locale fonctionne de la même façon.";

export function findZone(slug: string): Zone | undefined {
  return zones.find((zone) => zone.slug === slug);
}

/** La page d'une ville, quand elle en a une (comparaison sans casse ni accent). */
export function zoneForCity(city: string): Zone | undefined {
  const key = (value: string) =>
    value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  return zones.find((zone) => key(zone.name) === key(city));
}
