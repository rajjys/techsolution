import Image from "next/image";

import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

/**
 * Logo officiel TECH SOLUTION (public/assets).
 * - `nav`  : marque + wordmark empilé avec tagline sous le wordmark
 *            (lockup compact recomposé pour les barres de navigation)
 * - `full` : lockup complet original avec tagline (pied de page, usages larges)
 */
export function Logo({
  onDark = false,
  variant = "nav",
  className,
}: {
  onDark?: boolean;
  variant?: "nav" | "full";
  className?: string;
}) {
  const src =
    variant === "full"
      ? onDark
        ? "/assets/logo-full-white.png"
        : "/assets/logo-full-blue.png"
      : onDark
        ? "/assets/logo-nav-white.png"
        : "/assets/logo-nav-blue.png";

  /*
   * Dimensions **d'affichage**, pas dimensions du fichier.
   *
   * Les originaux font 2924 et 3058 px de large. Déclarés tels quels et sans
   * `sizes`, `next/image` en déduisait qu'il fallait la plus grande variante
   * disponible et servait `w=3840` — 44 Ko et 41 Ko pour deux lockups affichés
   * à 170 px de large, préchargés sur toutes les pages. En déclarant la taille
   * réelle de rendu, le srcset retombe sur 1x/2x, soit ~5 Ko.
   *
   * Le ratio est conservé (3,514 pour `nav`, 2,334 pour `full`) et la taille
   * visible reste pilotée par les classes ci-dessous — rien ne bouge à l'écran.
   */
  const dims =
    variant === "full"
      ? { width: 187, height: 80 }
      : { width: 169, height: 48 };

  return (
    <Image
      src={src}
      alt={`${site.name} — ${site.tagline}`}
      width={dims.width}
      height={dims.height}
      /*
       * Seul le lockup de navigation est préchargé : il est dans l'en-tête,
       * donc au-dessus de la ligne de flottaison. Celui du pied de page était
       * préchargé lui aussi, alors qu'il n'apparaît qu'après toute la page.
       */
      priority={variant === "nav"}
      loading={variant === "nav" ? undefined : "lazy"}
      className={cn(
        variant === "full" ? "h-20 w-auto" : "h-11 w-auto lg:h-12",
        className,
      )}
    />
  );
}
