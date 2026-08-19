import { site } from "@/lib/site";

export type Crumb = { label: string; href?: string };

/**
 * Balisage `BreadcrumbList` du fil d'Ariane.
 *
 * Le fil existait visuellement sur toutes les pages intérieures mais n'était
 * balisé nulle part. C'est l'un des rares balisages qui produit encore un
 * résultat **visible** dans Google : le chemin affiché sous le titre, à la
 * place de l'URL nue. Sur un site à trois niveaux comme celui-ci, il fait
 * lire « techsolution.cd › Références › Mahagi » au lieu d'une adresse.
 *
 * Le dernier maillon est la page courante : il porte sa position mais pas de
 * lien, conformément à la recommandation de Google.
 */
export function BreadcrumbJsonLd({ trail }: { trail: Crumb[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.label,
      ...(crumb.href ? { item: `${site.url}${crumb.href}` } : {}),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
