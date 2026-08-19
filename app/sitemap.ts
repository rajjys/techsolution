import type { MetadataRoute } from "next";

import { caseStudies } from "@/lib/data/case-studies";
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
  "": "2026-08-18",
  "/services": "2026-08-18",
  "/produits": "2026-08-18",
  "/references": "2026-08-17",
  "/contact": "2026-08-18",
  "/about": "2026-08-18",
  "/confidentialite": "2026-08-18",
};

/** Révision des six études de cas — elles partagent leur source de données. */
const CASE_STUDIES_REVISED = "2026-08-18";

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
   * Les six études de cas. Elles étaient absentes : c'est pourtant le seul
   * contenu du site qui associe une ville réelle à une réalisation réelle,
   * donc exactement ce qui sert la recherche locale. Elles sont liées depuis
   * /references, mais un lien ne vaut pas une déclaration.
   */
  const studies: MetadataRoute.Sitemap = caseStudies.map((study) => ({
    url: `${site.url}/references/${study.slug}`,
    lastModified: new Date(CASE_STUDIES_REVISED),
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  return [...pages, ...studies];
}
