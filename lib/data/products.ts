/**
 * Gammes du catalogue.
 *
 * Une gamme = un dossier sous `app/produits/` (`/produits/kits-solaires`),
 * et ses produits en dessous (`/produits/kits-solaires/<slug>`). Les kits
 * sont aujourd'hui la seule gamme ; les batteries portables et autres
 * accessoires viendront s'ajouter ici, chacun avec sa propre donnée typée —
 * un power bank n'a ni onduleur ni panneaux, il ne rentrera pas dans `Kit`.
 *
 * Ce fichier ne porte que ce que toutes les gammes ont en commun : ce dont
 * le méga-menu, le catalogue et le sitemap ont besoin pour les lister.
 */
export type ProductCategorySlug = "kits-solaires";

export type ProductCategory = {
  slug: ProductCategorySlug;
  /** Intitulé complet — titre de la page de gamme. */
  name: string;
  /** Intitulé court — menu et fil d'Ariane. */
  shortName: string;
  /** Une ligne, du point de vue du client. */
  description: string;
  /** Dernière révision réelle du contenu de la gamme — `lastmod` du sitemap. */
  revised: string;
};

export const productCategories: ProductCategory[] = [
  {
    slug: "kits-solaires",
    name: "Kits solaires hybrides",
    shortName: "Kits solaires",
    description:
      "Onduleur, batterie lithium et panneaux en un seul ensemble, du foyer à l'établissement.",
    /* La catégorie et ses fiches : balisage `Service` et appel en fin de
       composition, 15 oct. */
    revised: "2026-10-15",
  },
];

export function findProductCategory(
  slug: string,
): ProductCategory | undefined {
  return productCategories.find((category) => category.slug === slug);
}
