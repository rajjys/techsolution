import Image from "next/image";

import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

/**
 * Logo officiel TECH SOLUTION (public/assets).
 * - `nav`  : lockup de navigation, **scindé en deux pièces** — voir plus bas
 * - `full` : lockup complet original avec tagline (pied de page, usages larges)
 *
 * Le lockup de navigation était un PNG monobloc. Il est désormais servi en
 * deux images, découpées dans l'original au creux qui sépare le glyphe du
 * wordmark (x 745–840 sur 2924, mesuré sur le profil d'opacité). Deux besoins
 * l'imposaient, et aucun n'était satisfaisable sur une image unique :
 *
 * 1. **L'ampoule en solaire sur fond de marque.** Un PNG ne se recolore pas
 *    par région en CSS. Le glyphe a donc sa propre pièce, remplie de
 *    `solar-500` à partir de l'alpha de l'original.
 * 2. **Le wordmark disparaît sous `sm`.** Sur un téléphone, la place manque et
 *    le glyphe seul suffit à identifier la marque.
 *
 * La découpe inclut l'intervalle dans la pièce du glyphe : rendues côte à côte
 * sans `gap`, les deux pièces reproduisent exactement l'original.
 */
export function Logo({
  onDark = false,
  variant = "nav",
  alwaysWordmark = false,
  className,
}: {
  onDark?: boolean;
  variant?: "nav" | "full";
  /**
   * Force le wordmark, même sous `sm`. Réservé au panneau du menu mobile :
   * il est masqué dans la barre parce que la place y manque, pas parce que
   * le nom gênerait — et dans le panneau, la place ne manque pas.
   */
  alwaysWordmark?: boolean;
  className?: string;
}) {
  if (variant === "nav") {
    return (
      <span
        className={cn(
          "inline-flex h-11 items-center lg:h-12",
          className,
        )}
        role="img"
        aria-label={`${site.name} — ${site.tagline}`}
      >
        <Image
          src={
            onDark
              ? "/assets/logo-mark-nav-solar.png"
              : "/assets/logo-mark-nav-blue.png"
          }
          alt=""
          width={97}
          height={96}
          priority
          className="h-full w-auto"
        />
        {/*
          Masqué sous `sm` : sur un téléphone la barre doit laisser la place au
          menu et au CTA, et le glyphe seul identifie déjà la marque.
        */}
        <Image
          src={
            onDark
              ? "/assets/logo-word-nav-white.png"
              : "/assets/logo-word-nav-black.png"
          }
          alt=""
          width={240}
          height={96}
          priority
          className={cn(
            "h-full w-auto",
            alwaysWordmark ? "block" : "hidden sm:block",
          )}
        />
      </span>
    );
  }

  const src = onDark
    ? "/assets/logo-full-white.png"
    : "/assets/logo-full-blue.png";

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
  const dims = { width: 187, height: 80 };

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
      loading="lazy"
      className={cn("h-20 w-auto", className)}
    />
  );
}
