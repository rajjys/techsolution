import type { MetadataRoute } from "next";

import { caseStudies } from "@/lib/data/case-studies";
import { kits } from "@/lib/data/kits";
import { productCategories } from "@/lib/data/products";
import { zones } from "@/lib/data/locations";
import { services } from "@/lib/data/services";
import {
  caseStudyHref,
  kitHref,
  productCategoryHref,
  serviceHref,
  zoneHref,
} from "@/lib/routes";
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
  "/services": "2026-10-15",
  "/produits": "2026-10-14",
  "/references": "2026-10-15",
  "/contact": "2026-10-15",
  "/about": "2026-10-15",
  "/confidentialite": "2026-08-18",
  "/zones": "2026-10-15",
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

  /* Les six domaines — chacun sa page depuis octobre 2026. */
  const servicePages: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${site.url}${serviceHref(service.slug)}`,
    lastModified: new Date(service.revised),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  /* Les villes — bureaux et villes prouvées ; les autres n'ont pas de page. */
  const zonePages: MetadataRoute.Sitemap = zones.map((zone) => ({
    url: `${site.url}${zoneHref(zone.slug)}`,
    lastModified: new Date(zone.revised),
    changeFrequency: "monthly",
    priority: zone.tier === 1 ? 0.8 : 0.7,
  }));

  return [...pages, ...servicePages, ...zonePages, ...catalogue, ...studies];
}
