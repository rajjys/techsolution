import type { Kit } from "@/lib/data/kits";
import type { ProductCategorySlug } from "@/lib/data/products";

/**
 * Le seul endroit où l'on fabrique une URL interne vers une entité.
 *
 * Les adresses vont bouger — les services passeront d'ancres à de vraies
 * pages, les études de cas changeront de slug. Écrites en dur dans quarante
 * composants, chacune de ces migrations laisserait des liens vers des
 * redirections ; écrites ici, elles tiennent en une ligne.
 *
 * @see docs/SEO-STRATEGY.md §9 — le plan des URL
 */

export function productCategoryHref(slug: ProductCategorySlug): string {
  return `/produits/${slug}`;
}

export function kitHref(kit: Pick<Kit, "category" | "slug">): string {
  return `/produits/${kit.category}/${kit.slug}`;
}

/**
 * Un domaine d'expertise. Ancre de /services tant que chaque domaine n'a pas
 * sa page (phase 5 du plan) — c'est la ligne à changer ce jour-là.
 */
export function serviceHref(slug: string): string {
  return `/services#${slug}`;
}

export function caseStudyHref(slug: string): string {
  return `/references/${slug}`;
}

/** /contact, préqualifié — mêmes paramètres que ceux que l'entonnoir lit. */
export function contactHref(
  params: { kit?: string; service?: string; need?: string } = {},
): string {
  const query = new URLSearchParams(
    Object.entries(params).filter(
      (entry): entry is [string, string] => Boolean(entry[1]),
    ),
  ).toString();
  return query ? `/contact?${query}` : "/contact";
}
