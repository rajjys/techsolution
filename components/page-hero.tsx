import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Glow } from "@/components/glow";
import { Reveal } from "@/components/motion";
import { Eyebrow } from "@/components/section";
import { cn } from "@/lib/utils";

/**
 * En-tête des pages intérieures.
 *
 * Volontairement **clair** : `brand-50`, la même surface que le hero de
 * l'accueil. Passer de l'accueil à /services ne doit pas donner l'impression
 * de changer de site. Le sombre reste réservé aux moments de preuve
 * (réalisations, méthode) et à la conclusion (pied de page).
 *
 * `children` reçoit le contenu propre à la page — chips d'ancrage, chiffres,
 * engagements — posé sous le chapô.
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
  /**
   * Illustration posée **à côté** du texte, jamais dessous : une photo de
   * chantier porte souvent la marque ou un visage, qu'un voile de lisibilité
   * viendrait masquer. Colonne à part, donc, qui passe sous le texte en
   * dessous de `lg`.
   */
  image?: { src: string; alt: string };
  children?: React.ReactNode;
}) {
  const trail = [{ label: "Accueil", href: "/" }, ...(breadcrumb ?? [])];

  return (
    <section
      className={cn(
        "relative isolate overflow-hidden bg-brand-50",
        image && "min-h-[28rem] lg:min-h-[32rem]",
      )}
    >
      {image ? (
        <>
          {/*
            Même dispositif que le hero de l'accueil : l'image occupe le bord
            droit d'un seul tenant, et c'est le voile — de la couleur du fond —
            qui fait la jonction. Aucune coupure entre le texte et la photo.
          */}
          <div className="absolute inset-0 -z-10 lg:left-[36%]" aria-hidden="true">
            <Image
              src={image.src}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-[50%_42%]"
            />
          </div>
          {/*
            Sous lg le voile est vertical : dense en haut, où se lit le texte,
            il s'éclaircit vers le bas pour laisser voir le chantier.
          */}
          <div
            className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-50 from-25% via-brand-50/90 via-62% to-brand-50/45
            lg:bg-gradient-to-r lg:from-brand-50 lg:from-30% lg:via-brand-50/80 lg:via-52% lg:to-transparent lg:to-72%"
            aria-hidden="true"
          />
        </>
      ) : (
        <Glow variant="cool" corner="bottom-right" />
      )}

      <div
        className={cn(
          "container relative pt-8 sm:pt-10 lg:pt-14",
          compact ? "pb-8 lg:pb-10" : "pb-10 sm:pb-14 lg:pb-20",
          image && "flex min-h-[28rem] flex-col justify-center lg:min-h-[32rem]",
        )}
      >
        {breadcrumb ? (
          <nav
            aria-label="Fil d'Ariane"
            className={cn("mb-7 lg:mb-9", image && "lg:mb-8")}
          >
            <ol
              className={cn(
                "flex flex-wrap items-center gap-1 text-xs font-medium text-slate-500",
                image && "justify-center lg:justify-start",
              )}
            >
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

        <Reveal
          mode="mount"
          className={cn(
            image ? "max-w-xl text-center lg:text-left" : "max-w-3xl",
          )}
        >
          <Eyebrow className={image ? "justify-center lg:justify-start" : undefined}>
            {eyebrow}
          </Eyebrow>
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

        {children}
      </div>
    </section>
  );
}
