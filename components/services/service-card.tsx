import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Service } from "@/lib/data/services";

/**
 * Carte d'expertise — partagée par la section « Nos solutions » de l'accueil
 * et par la vue d'ensemble de /services. C'est volontairement le *même*
 * composant et non une imitation : c'est le point de continuité le plus
 * concret entre l'accueil et les pages intérieures.
 *
 * Ordre de lecture imposé : le résultat pour le client d'abord, le « comment »
 * technique ensuite.
 */
export function ServiceCard({
  service,
  href,
  className,
}: {
  service: Service;
  /** Par défaut l'ancre de la page services ; la page elle-même passe `#slug`. */
  href?: string;
  className?: string;
}) {
  return (
    <Link
      href={href ?? `/services#${service.slug}`}
      // `relative` : sans bloc conteneur positionné, le <span class="sr-only">
      // se positionnerait par rapport à la section et échapperait au rognage.
      className={cn(
        `group relative flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-card ring-0 ring-brand-200 transition-all duration-300
        hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-soft hover:ring-4 hover:ring-offset-1
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 sm:p-7`,
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <service.icon
          className="size-6 shrink-0 text-solar-600"
          strokeWidth={1.8}
          aria-hidden="true"
        />
        <h3 className="text-[17px] font-bold leading-snug text-slate-900 sm:text-lg">
          {service.shortTitle}
        </h3>
      </div>

      <hr className="mt-5 border-t border-dashed border-slate-200" />

      <ul className="mt-5 space-y-3">
        {[service.outcome, service.delivery].map((point) => (
          <li key={point} className="flex items-start gap-3">
            <Check
              className="mt-[3px] size-4 shrink-0 text-solar-600"
              strokeWidth={2.5}
              aria-hidden="true"
            />
            <span className="text-sm leading-relaxed text-slate-600">
              {point}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-8">
        <hr className="border-t border-dashed border-slate-200" />
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-slate-900 transition-colors group-hover:text-brand-600">
          En savoir plus
          <span className="sr-only"> sur {service.shortTitle}</span>
          <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
