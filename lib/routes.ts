import type { Kit } from "@/lib/data/kits";
import type { ProductCategorySlug } from "@/lib/data/products";
import { services } from "@/lib/data/services";

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
 * La page d'un domaine d'expertise (phase 5, oct. 2026 — c'étaient des ancres
 * de /services). Reçoit le slug du service ; le segment d'URL peut différer
 * (`maintenance-froid` → /services/maintenance-climatisation).
 */
export function serviceHref(slug: string): string {
  const service = services.find((item) => item.slug === slug);
  return `/services/${service?.urlSlug ?? slug}`;
}

/** La page d'une ville — `/zones/<ville>` (phase 6, oct. 2026). */
export function zoneHref(slug: string): string {
  return `/zones/${slug}`;
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
