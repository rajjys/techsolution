import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

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
};

/**
 * En-tête des pages intérieures.
 *
 * Volontairement **clair** : `brand-50`, la même surface que le hero de
 * l'accueil. Passer de l'accueil à /services ne doit pas donner l'impression
 * de changer de site. Le sombre reste réservé aux moments de preuve
 * (réalisations, méthode) et à la conclusion (pied de page).
 *
 * Avec une photo, deux dispositifs se superposent :
 *
 * 1. un **masque en dégradé** sur l'image elle-même — c'est lui qui supprime
 *    le bord franc. Un simple voile posé par-dessus laissait voir l'arête où
 *    la photo commençait, comme un mur derrière un nuage ;
 * 2. un **voile de la couleur du fond** pour le contraste du texte. Sur
 *    mobile il est uniforme : un dégradé y faisait varier la lisibilité d'une
 *    ligne à l'autre, et le chapô passait en dessous du seuil.
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
        image && "min-h-[30rem] lg:min-h-[34rem]",
      )}
    >
      {image ? (
        <>
          {/*
            Sous lg la photo occupe tout le cadre ; à partir de lg elle part du
            quart gauche. Dans les deux cas le masque la fait naître en fondu.
          */}
          <div
            className="absolute inset-0 -z-10 lg:left-[24%]
            [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_34%)]
            [mask-image:linear-gradient(to_bottom,transparent_0%,black_34%)]
            lg:[-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_46%)]
            lg:[mask-image:linear-gradient(to_right,transparent_0%,black_46%)]"
            aria-hidden="true"
          >
            <Image
              src={image.src}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: image.position ?? "50% 45%" }}
            />
          </div>

          {/*
            Voile uniforme sous lg — la lisibilité ne doit pas dépendre de
            l'endroit où tombe la ligne. Il redevient directionnel à partir de
            lg, où le texte est cantonné à la moitié gauche.
          */}
          <div
            className="absolute inset-0 -z-10 bg-brand-50/90
            lg:bg-gradient-to-r lg:from-brand-50 lg:from-24% lg:via-brand-50/75 lg:via-46% lg:to-transparent lg:to-72%"
            aria-hidden="true"
          />
        </>
      ) : (
        <Glow variant="cool" corner="bottom-right" />
      )}

      <div
        className={cn(
          "container relative flex flex-col pt-8 sm:pt-10 lg:pt-14",
          compact ? "pb-8 lg:pb-10" : "pb-10 sm:pb-14 lg:pb-20",
          image && "min-h-[30rem] lg:min-h-[34rem]",
        )}
      >
        {/* Toujours en tête et aligné à gauche, comme sur toutes les pages */}
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
          <Reveal
            mode="mount"
            className={cn(image ? "max-w-xl" : "max-w-3xl")}
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
            <Reveal mode="mount" delay={0.12}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
                {actions}
              </div>
            </Reveal>
          ) : null}

          {children}
        </div>
      </div>
    </section>
  );
}
