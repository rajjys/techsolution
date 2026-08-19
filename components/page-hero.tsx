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
 *    mobile il reste quasi opaque sur les deux tiers hauts — tout le bloc de
 *    texte, actions comprises — puis s'ouvre franchement en bas. Il ne
 *    s'allégeait autrefois qu'à partir de 60 %, et les boutons tombaient dans
 *    la zone claire : le contour du secondaire se confondait avec la photo.
 *
 * Les deux dégradés sont écrits en **paliers rapprochés** plutôt qu'en trois
 * arrêts. Une rampe d'alpha linéaire se voit : l'œil détecte la cassure de
 * pente là où elle commence, et lit une arête que le code ne contient pas.
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
        image && "min-h-[34rem] lg:min-h-[39rem]",
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
            className="absolute inset-0 -z-10 lg:left-[20%]
            [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_30%)]
            [mask-image:linear-gradient(to_bottom,transparent_0%,black_30%)]
            lg:[-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_26%)]
            lg:[mask-image:linear-gradient(to_right,transparent_0%,black_26%)]"
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
            Voile de contraste. Sous lg il couvre tout le bloc de texte,
            boutons compris, et ne s'ouvre que dans le dernier cinquième.
            À partir de lg il devient directionnel et libère complètement le
            tiers droit, où la photo doit se lire pour ce qu'elle est — la
            bande franche commence toujours vers 67 %, comme avant.
          */}
          <div
            className="absolute inset-0 -z-10
            bg-[linear-gradient(to_bottom,rgb(242_242_253/0.98)_0%,rgb(242_242_253/0.97)_66%,rgb(242_242_253/0.86)_80%,rgb(242_242_253/0.55)_92%,rgb(242_242_253/0.34)_100%)]
            lg:bg-[linear-gradient(to_right,rgb(242_242_253)_0%,rgb(242_242_253)_34%,rgb(242_242_253/0.97)_39%,rgb(242_242_253/0.88)_44%,rgb(242_242_253/0.72)_49%,rgb(242_242_253/0.5)_54%,rgb(242_242_253/0.28)_59%,rgb(242_242_253/0.1)_63%,rgb(242_242_253/0)_67%)]"
            aria-hidden="true"
          />
        </>
      ) : (
        <Glow variant="cool" corner="bottom-right" />
      )}

      <div
        className={cn(
          "container relative flex flex-col pt-10 sm:pt-12 lg:pt-16",
          compact ? "pb-10 lg:pb-14" : "pb-12 sm:pb-16 lg:pb-24",
          image && "min-h-[34rem] lg:min-h-[39rem]",
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
    </section>
  );
}
