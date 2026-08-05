import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Gauge, MapPin } from "lucide-react";

import { cn } from "@/lib/utils";
import type { CaseStudy } from "@/lib/data/case-studies";

/**
 * Carte d'étude de cas — partagée par le carrousel de l'accueil et la grille
 * de /references. Une image, un voile, la catégorie et le repère technique en
 * haut, l'identité du projet en bas.
 *
 * `feature` : la carte pleine du carrousel (résumé et pied de carte).
 * `grid`    : la version compacte, quand six cartes cohabitent.
 *
 * Les deux vivent sur fond `brand-900` : l'anneau au survol s'y décale.
 */
export function CaseStudyCard({
  study,
  variant = "grid",
  className,
}: {
  study: CaseStudy;
  variant?: "grid" | "feature";
  className?: string;
}) {
  const feature = variant === "feature";

  return (
    <Link
      href={`/references/${study.slug}`}
      className={cn(
        `group relative block overflow-hidden rounded-3xl transition-all duration-300
        ring-offset-2 hover:ring-4 hover:ring-white/45 hover:ring-offset-brand-900
        focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-solar-500`,
        feature ? "h-full" : "aspect-[4/5] sm:aspect-[4/3] lg:aspect-[3/4]",
        className,
      )}
    >
      <Image
        src={study.image}
        alt={study.imageAlt}
        fill
        sizes={
          feature
            ? "(max-width: 1024px) 100vw, 46vw"
            : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 32vw"
        }
        className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/85 via-40% to-brand-950/15"
        aria-hidden="true"
      />

      {/* Badges haut */}
      <div className="absolute inset-x-5 top-5 flex items-center justify-between gap-3">
        <span className="inline-flex items-center rounded-full border border-white/20 bg-brand-950/60 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-solar-400 backdrop-blur">
          {study.category}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-brand-950/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
          <Gauge className="size-3.5 text-solar-400" aria-hidden="true" />
          {study.spec}
        </span>
      </div>

      {/* Contenu bas */}
      <div className={cn("absolute inset-x-0 bottom-0", feature ? "p-6 sm:p-8" : "p-5 sm:p-6")}>
        <h3
          className={cn(
            "line-clamp-2 font-bold leading-snug text-white",
            feature ? "text-xl sm:text-2xl lg:text-[28px]" : "text-lg",
          )}
        >
          {study.title}
        </h3>
        <p className="mt-1.5 text-sm font-semibold text-solar-300">
          {study.client}
        </p>

        {feature ? (
          <p className="mt-3 line-clamp-2 text-[15px] leading-relaxed text-brand-100">
            {study.summary}
          </p>
        ) : null}

        <div
          className={cn(
            "flex items-center justify-between gap-3 border-t border-white/10",
            feature ? "mt-5 pt-4" : "mt-4 pt-3",
          )}
        >
          <span className="inline-flex min-w-0 items-center gap-1.5 text-sm font-semibold text-solar-400">
            <MapPin className="size-4 shrink-0" aria-hidden="true" />
            <span className="truncate">
              {study.city} — {study.province}
            </span>
          </span>
          <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-white">
            {feature ? "Voir le projet" : null}
            <span className="sr-only"> — {study.title}</span>
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}
