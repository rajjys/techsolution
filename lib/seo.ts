import type { Metadata } from "next";

import { site } from "@/lib/site";

/**
 * Assembleur de métadonnées de page.
 *
 * Il existe pour une raison précise, vérifiée dans la doc de cette version de
 * Next (`generate-metadata.md`, §Merging) : les objets `metadata` de segments
 * différents sont fusionnés **en surface**. Un `openGraph` déclaré dans une
 * page **remplace donc entièrement** celui du layout — il n'en hérite pas
 * champ par champ.
 *
 * Aucune page ne déclarait le sien. Les huit pages servaient donc l'`og:title`,
 * l'`og:description` et surtout l'`og:url` de l'accueil : un lien vers un kit
 * collé dans WhatsApp affichait le titre, le texte et l'URL de la page
 * d'accueil. En RDC, où WhatsApp est le canal principal, c'est le partage
 * entier qui ne fonctionnait pas.
 *
 * Les images restent portées par la convention de fichier `opengraph-image` —
 * Next les résout par segment, elles ne passent pas par ici.
 */
export function pageMetadata({
  path,
  title,
  description,
  /** `article` pour les études de cas ; `website` partout ailleurs. */
  type = "website",
}: {
  /** Chemin absolu depuis la racine, sans domaine — `/produits`, `/` pour l'accueil. */
  path: string;
  /**
   * Titre court : le gabarit `%s | Tech Solution RDC` s'y ajoute.
   * Omis sur l'accueil, qui garde le titre par défaut du layout.
   */
  title?: string;
  description: string;
  type?: "website" | "article";
}): Metadata {
  /*
   * Le gabarit de titre ne s'applique pas à `openGraph.title` — il faut donc
   * composer le titre complet à la main, sans quoi la vignette n'annonce pas
   * la marque.
   */
  const fullTitle = title
    ? `${title} | ${site.name}`
    : `${site.name} — Énergie solaire, électricité & infrastructures techniques`;
  const url = `${site.url}${path === "/" ? "" : path}`;

  return {
    /* Omis sur l'accueil : le titre par défaut du layout s'applique alors. */
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      locale: "fr_CD",
      siteName: site.name,
      url,
      title: fullTitle,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}
