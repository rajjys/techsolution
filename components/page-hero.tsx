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
  children?: React.ReactNode;
}) {
  const trail = [{ label: "Accueil", href: "/" }, ...(breadcrumb ?? [])];

  return (
    <section className="relative isolate overflow-hidden bg-brand-50">
      <Glow variant="cool" corner="bottom-right" />

      <div
        className={cn(
          "container relative pt-8 sm:pt-10 lg:pt-14",
          compact ? "pb-8 lg:pb-10" : "pb-10 sm:pb-14 lg:pb-20",
        )}
      >
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

        <Reveal mode="mount" className="max-w-3xl">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-5 text-balance text-[30px] font-bold leading-[1.15] tracking-[-0.01em] text-slate-900 sm:text-4xl sm:leading-[1.12] md:text-5xl lg:text-[56px] lg:leading-[1.06]">
            {title}
          </h1>
          {lead ? (
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              {lead}
            </p>
          ) : null}
        </Reveal>

        {children}
      </div>
    </section>
  );
}
