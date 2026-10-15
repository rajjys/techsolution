import Link from "next/link";
import { Star } from "lucide-react";

import type { Kit } from "@/lib/data/kits";
import { kitHref } from "@/lib/routes";
import { cn } from "@/lib/utils";

/**
 * Un kit dans une liste de liens — catalogue et méga-menu.
 *
 * La puissance tient la place d'un prix (il n'y en a pas, décision du
 * propriétaire) : c'est le repère que l'œil cherche en premier, d'où la
 * pastille à largeur fixe qui aligne les neuf paliers en colonne. Le palier
 * et sa promesse viennent ensuite, du point de vue du client.
 */
export function KitLink({
  kit,
  onNavigate,
  compact = false,
  className,
}: {
  kit: Kit;
  /**
   * Colonne étroite (méga-menu) : la mention « Le plus demandé » y passait
   * sur deux lignes à côté de « Commercial ». Elle devient une étoile, et
   * reste dite en toutes lettres aux lecteurs d'écran.
   */
  compact?: boolean;
  /** Fermeture du menu au clic — le lien navigue, le panneau doit se replier. */
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <Link
      href={kitHref(kit)}
      onClick={onNavigate}
      className={cn(
        "group/kit flex items-center gap-3.5 rounded-xl px-2.5 py-2 transition-colors hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solar-500",
        className,
      )}
    >
      <span className="flex h-10 w-[4.75rem] shrink-0 items-center justify-center rounded-lg bg-brand-50 font-display text-[15px] font-bold tabular-nums text-brand-700 ring-1 ring-inset ring-brand-100 transition-colors group-hover/kit:bg-white">
        {kit.power}
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-2 text-[15px] font-semibold leading-tight text-slate-900">
          {kit.tier}
          {kit.featured ? (
            compact ? (
              <span title="Le plus demandé" className="inline-flex">
                <Star
                  className="size-3.5 fill-brand-600 text-brand-600"
                  aria-hidden="true"
                />
                <span className="sr-only">— le plus demandé</span>
              </span>
            ) : (
              <span className="whitespace-nowrap rounded-full bg-brand-600 px-1.5 py-px text-[9.5px] font-bold uppercase tracking-[0.1em] text-white">
                Le plus demandé
              </span>
            )
          ) : null}
        </span>
        <span className="mt-0.5 block truncate text-[13px] text-slate-500">
          {kit.outcome}
        </span>
      </span>
    </Link>
  );
}
