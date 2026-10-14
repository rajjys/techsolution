import type { MetadataRoute } from "next";

import { caseStudies } from "@/lib/data/case-studies";
import { kits } from "@/lib/data/kits";
import { productCategories } from "@/lib/data/products";
import { caseStudyHref, kitHref, productCategoryHref } from "@/lib/routes";
import { site } from "@/lib/site";

/**
 * Date de dernière révision du contenu, par route.
 *
 * **Volontairement figée, et non `new Date()`.** Un `lastmod` recalculé à
 * chaque build fait dire à toutes les pages qu'elles ont changé à chaque
 * déploiement : le signal devient faux, et Google apprend à l'ignorer.
 * À mettre à jour à la main quand le contenu d'une page change réellement —
 * c'est le prix d'un signal auquel on peut se fier.
 */
const REVISED: Record<string, string> = {
  /* Octobre 2026 : chiffres dérivés de la donnée, photos d'autres
     installateurs retirées, /produits devenu le catalogue. */
  "": "2026-10-14",
  "/services": "2026-10-14",
  "/produits": "2026-10-14",
  "/references": "2026-10-14",
  "/contact": "2026-08-18",
  "/about": "2026-10-14",
  "/confidentialite": "2026-08-18",
};


export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = Object.entries(REVISED).map(
    ([route, revised]) => ({
      url: `${site.url}${route}`,
      lastModified: new Date(revised),
      changeFrequency: route === "" ? "weekly" : "monthly",
      priority:
        route === ""
          ? 1
          : route === "/contact"
            ? 0.9
            : route === "/confidentialite"
              ? 0.3
              : 0.8,
    }),
  );

  /*
   * Les études de cas. Elles étaient absentes : c'est pourtant le seul
   * contenu du site qui associe une ville réelle à une réalisation réelle,
   * donc exactement ce qui sert la recherche locale. Elles sont liées depuis
   * /references, mais un lien ne vaut pas une déclaration.
   */
  const studies: MetadataRoute.Sitemap = caseStudies.map((study) => ({
    url: `${site.url}${caseStudyHref(study.slug)}`,
    /* La date de l'étude elle-même : en réviser une ne rajeunit pas les autres. */
    lastModified: new Date(study.revised),
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  /* Les gammes et leurs fiches — la date est celle de la gamme. */
  const catalogue: MetadataRoute.Sitemap = productCategories.flatMap(
    (category) => [
      {
        url: `${site.url}${productCategoryHref(category.slug)}`,
        lastModified: new Date(category.revised),
        changeFrequency: "monthly" as const,
        priority: 0.8,
      },
      ...kits
        .filter((kit) => kit.category === category.slug)
        .map((kit) => ({
          url: `${site.url}${kitHref(kit)}`,
          lastModified: new Date(category.revised),
          changeFrequency: "monthly" as const,
          priority: 0.7,
        })),
    ],
  );

  return [...pages, ...catalogue, ...studies];
}
