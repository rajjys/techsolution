import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { BreadcrumbJsonLd } from "@/components/breadcrumb-json-ld";
import { Glow } from "@/components/glow";
import { Reveal } from "@/components/motion";
import { Eyebrow } from "@/components/section";
import { cn } from "@/lib/utils";

export type HeroImage = {
  src: string;
  /** Décrit le sujet : l'image est décorative, ce texte part en sr-only. */
  alt: string;
  /** `object-position` — pour amener le sujet dans la zone dégagée du voile. */
  position?: string;
  /**
   * Ce que la photo devient **sous `lg`**.
   *
   * Elle était jusqu'ici posée en fond derrière un voile à 97 % d'opacité :
   * elle coûtait ses octets et ne donnait rien à voir — un fantôme. Deux
   * sorties honnêtes, et une seule règle : **une photo mérite sa place dans
   * le flux, ou elle disparaît.**
   *
   * - `"band"` — bande pleine largeur sous le texte, vraiment visible.
   *   Réservé aux photos qui portent des visages, la marque ou une preuve :
   *   c'est ce qu'on achète, ça ne se cache pas derrière un dégradé.
   * - `"hidden"` (défaut) — rien sous `lg`. Pour les photos techniques ou
   *   abstraites, dont l'absence ne retire rien.
   */
  mobile?: "band" | "hidden";
};

/**
 * En-tête des pages intérieures.
 *
 * Volontairement **clair** : `brand-50`, la même surface que le hero de
 * l'accueil. Passer de l'accueil à /services ne doit pas donner l'impression
 * de changer de site. Le sombre reste réservé aux moments de preuve
 * (réalisations, méthode) et à la conclusion (pied de page).
 *
 * **Le texte et la photo ne se recouvrent pas.** À partir de `lg`, la photo
 * occupe sa moitié droite et touche le bord de l'écran ; le texte reste sur
 * la grille du conteneur, sur `brand-50` franc. C'est la grammaire « pleine
 * largeur » du §1 appliquée à l'en-tête.
 *
 * Il en a fallu deux tentatives pour y venir. La photo était d'abord posée en
 * fond, sous un voile qui devait la noyer pour qu'un titre sombre reste
 * lisible — la photo se réduisait alors au tiers droit, et tout sujet large
 * s'y faisait trancher. Ouvrir ce voile a rendu la photo visible et le chapô
 * illisible : la colonne de texte finit à 42–47 % de l'écran, là où le voile
 * n'était plus qu'à 0,47 puis 0,22 d'opacité. Les deux besoins étaient
 * inconciliables tant qu'ils partageaient la même surface.
 *
 * Il ne reste donc qu'un seul dispositif : un **masque en dégradé** sur le
 * bord gauche de l'image. Pas de voile — il n'y a plus rien à voiler.
 *
 * Ce masque est écrit en **onze paliers**, et c'est le sujet. Sur 10 % de
 * largeur il produisait une arête verticale franche : l'œil lit une ligne là
 * où le code croit poser un fondu. Il court désormais sur 54 % de la largeur
 * de l'image, en une courbe qui reste sous 4 % d'opacité jusqu'au bout de la
 * colonne de texte, puis monte franchement. Le texte garde son fond net, et
 * la photo naît sans couture.
 *
 * C'est le §10 appliqué : une rampe d'alpha à trois arrêts laisse voir sa
 * cassure de pente, et se lit comme un bord.
 *
 * Contraste mesuré sur le rendu, pas estimé : le pire pixel de fond sous la
 * ligne de chapô donne **6,7 : 1** sur les quatre en-têtes.
 *
 * ⚠️ Piège de mesure, consigné parce qu'il m'a fait décaler la courbe pour
 * rien : échantillonner une bande *à hauteur de texte* moyenne les glyphes
 * avec le fond et renvoie un contraste faussement mauvais — 4,0 : 1 là où le
 * fond réel donne 6,8. Il faut sonder une bande **sans glyphe**, juste sous
 * le dernier interligne, et y prendre le pixel le plus sombre.
 *
 * @see docs/design-system.md — « Rythme des fonds »
 */
export function PageHero({
  eyebrow,
  title,
  lead,
  breadcrumb,
  compact = false,
  image,
  actions,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead?: string;
  /** Fil d'Ariane — l'accueil est ajouté automatiquement en tête. */
  breadcrumb?: { label: string; href?: string }[];
  /**
   * En-tête resserré, quand la section suivante est le cœur de la page et
   * doit apparaître sans faire défiler.
   */
  compact?: boolean;
  image?: HeroImage;
  /** Appels à l'action, posés sous le chapô — jamais à côté. */
  actions?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const trail = [{ label: "Accueil", href: "/" }, ...(breadcrumb ?? [])];

  return (
    <section
      className={cn(
        "relative isolate overflow-hidden bg-brand-50",
        image && "lg:min-h-[39rem]",
      )}
    >
      {image ? (
        <>
          {/*
            Sous lg la photo occupe tout le cadre ; à partir de lg elle part du
            cinquième gauche. Dans les deux cas le masque la fait naître en
            fondu — c'est lui qui supprime l'arête.
            ⚠️ Les pourcentages du masque sont relatifs à ce bloc, pas à
            l'écran : à `left-[20%]`, `black 26%` tombe à 20 + 0,26 × 80 = 41 %
            de l'écran. Le voile doit devenir transparent APRÈS ce point, sans
            quoi la photo est atténuée deux fois et vire au fantôme.
          */}
          <div
            className="absolute inset-0 -z-10 hidden lg:left-[42%] lg:block
            lg:[-webkit-mask-image:linear-gradient(to_right,transparent_0%,#00000004_10%,#0000000d_16%,#0000001c_21%,#00000036_26%,#00000059_30%,#00000085_34%,#000000b3_38%,#000000d6_42%,#000000f0_47%,#000000ff_54%)]
            lg:[mask-image:linear-gradient(to_right,transparent_0%,#00000004_10%,#0000000d_16%,#0000001c_21%,#00000036_26%,#00000059_30%,#00000085_34%,#000000b3_38%,#000000d6_42%,#000000f0_47%,#000000ff_54%)]"
            aria-hidden="true"
          >
            <Image
              src={image.src}
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 80vw, 1px"
              className="object-cover"
              style={{ objectPosition: image.position ?? "50% 45%" }}
            />
          </div>

        </>
      ) : (
        <Glow variant="cool" corner="bottom-right" />
      )}

      <div
        className={cn(
          "container relative flex flex-col pt-10 sm:pt-12 lg:pt-16",
          compact ? "pb-10 lg:pb-14" : "pb-12 sm:pb-16 lg:pb-24",
          image && "lg:min-h-[39rem]",
        )}
      >
        {/* Toujours en tête et aligné à gauche, comme sur toutes les pages */}
        {breadcrumb ? <BreadcrumbJsonLd trail={trail} /> : null}
        {breadcrumb ? (
          <nav aria-label="Fil d'Ariane" className="mb-7 lg:mb-9">
            <ol className="flex flex-wrap items-center gap-1 text-xs font-medium text-slate-500">
              {trail.map((crumb, index) => (
                <li key={crumb.label} className="flex items-center gap-1">
                  {index > 0 ? (
                    <ChevronRight
                      className="size-3.5 shrink-0 text-slate-400"
                      aria-hidden="true"
                    />
                  ) : null}
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      className="rounded transition-colors hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-slate-700">
                      {crumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        <div className={cn(image && "flex flex-1 flex-col justify-center")}>
          {/*
            Avec une photo, tout le contenu tient dans la colonne gauche —
            texte, actions et chiffres compris. Un tableau de chiffres qui
            déborde sur la moitié droite finit sous la partie dégagée du
            voile, donc illisible.
          */}
          <Reveal
            mode="mount"
            className={cn(image ? "max-w-lg xl:max-w-xl" : "max-w-3xl")}
          >
            <Eyebrow>{eyebrow}</Eyebrow>
            <h1
              className={cn(
                "mt-5 text-balance font-bold leading-[1.15] tracking-[-0.01em] text-slate-900",
                image
                  ? "text-[30px] sm:text-4xl sm:leading-[1.12] md:text-[44px] lg:text-[48px] lg:leading-[1.08]"
                  : "text-[30px] sm:text-4xl sm:leading-[1.12] md:text-5xl lg:text-[56px] lg:leading-[1.06]",
              )}
            >
              {title}
            </h1>
            {lead ? (
              <p
                className={cn(
                  "mt-5 text-base leading-relaxed text-slate-600 sm:text-lg",
                  image ? "" : "max-w-2xl",
                )}
              >
                {lead}
              </p>
            ) : null}
            {/* L'image est décorative : son sujet est décrit ici. */}
            {image ? <span className="sr-only">{image.alt}</span> : null}
          </Reveal>

          {actions ? (
            <Reveal
              mode="mount"
              delay={0.12}
              className={cn(image && "max-w-lg xl:max-w-xl")}
            >
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
                {actions}
              </div>
            </Reveal>
          ) : null}

          <div className={cn(image && "max-w-lg xl:max-w-xl")}>{children}</div>
        </div>
      </div>

      {/*
        Bande mobile. Elle sort du conteneur pour toucher les deux bords —
        une photo de plein pied qu'on regarde, et non un fond qu'on devine.
        Placée **sous** le texte : au-dessus, elle repousserait le h1 et les
        actions sous la ligne de flottaison, exactement le défaut que le
        §6 bis du système reproche aux préambules d'en-tête.
      */}
      {image?.mobile === "band" ? (
        <div className="relative -mt-2 block h-56 w-full sm:h-72 lg:hidden">
          <Image
            src={image.src}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: image.position ?? "50% 45%" }}
          />
        </div>
      ) : null}
    </section>
  );
}
