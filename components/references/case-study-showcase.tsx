"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { CaseStudyCard } from "@/components/references/case-study-card";
import { ReachMap } from "@/components/references/reach-map";
import { caseStudies } from "@/lib/data/case-studies";
import { cn } from "@/lib/utils";

/**
 * Bouton de navigation du carrousel — rectangulaire comme le reste du site,
 * avec l'anneau de survol commun.
 */
function CarouselButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-11 w-12 items-center justify-center rounded-xl border-2 border-white/25 text-white transition-all duration-200
      hover:border-white hover:bg-white hover:text-brand-900 hover:ring-4 hover:ring-offset-1 hover:ring-white/30 hover:ring-offset-brand-900
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solar-500 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-900"
    >
      {children}
    </button>
  );
}

/**
 * Vitrine des études de cas — un projet à la fois, la carte de la RDC à
 * côté, centrée sur la ville du projet affiché.
 *
 * Un projet à la fois plutôt qu'une grille de six : six grandes cartes
 * image coûtent un écran entier sur mobile pour dire ce qu'une seule dit
 * déjà. La carte fait le lien entre le projet et le territoire.
 *
 * Partagée par l'accueil et /references — seuls diffèrent la présence du
 * lien « tous les projets » et la visibilité de la carte sur mobile.
 */
export function CaseStudyShowcase({
  showMapOnMobile = false,
  allProjectsHref,
}: {
  showMapOnMobile?: boolean;
  /** Lien « tous les projets » — inutile sur la page qui les liste déjà. */
  allProjectsHref?: string;
}) {
  const [index, setIndex] = React.useState(0);
  const [dir, setDir] = React.useState(1);
  const reduce = useReducedMotion();
  const active = caseStudies[index];

  const go = (next: number) => {
    const n = (next + caseStudies.length) % caseStudies.length;
    setDir(n === index ? 1 : n > index ? 1 : -1);
    setIndex(n);
  };

  return (
    <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
      {/* Étude de cas + contrôles */}
      <div className="order-2 lg:order-1">
        <div className="relative h-[440px] sm:h-[500px] lg:h-[560px]">
          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <motion.div
              key={active.slug}
              className="absolute inset-0"
              initial={reduce ? { opacity: 0 } : { opacity: 0, x: dir * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, x: dir * -40 }}
              transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
              <CaseStudyCard study={active} variant="feature" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Contrôles — progression et navigation à gauche, sortie à droite */}
        <div className="mt-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Progression — masquée sous 420 px, faute de place */}
            <div className="hidden items-center gap-1.5 min-[420px]:flex">
              {caseStudies.map((study, i) => (
                <button
                  key={study.slug}
                  onClick={() => go(i)}
                  aria-label={`Projet à ${study.city}`}
                  aria-current={i === index ? "true" : undefined}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    i === index
                      ? "w-7 bg-solar-500"
                      : "w-2 bg-white/25 hover:bg-white/50",
                  )}
                />
              ))}
            </div>

            {/* gap-2.5 : les anneaux de survol (4 px) ne se touchent pas */}
            <div className="flex items-center gap-2.5">
              <CarouselButton
                label="Projet précédent"
                onClick={() => go(index - 1)}
              >
                <ArrowLeft className="size-5" />
              </CarouselButton>
              <CarouselButton
                label="Projet suivant"
                onClick={() => go(index + 1)}
              >
                <ArrowRight className="size-5" />
              </CarouselButton>
            </div>
          </div>

          {allProjectsHref ? (
            <Link
              href={allProjectsHref}
              className="group inline-flex h-11 shrink-0 items-center gap-2 rounded-xl border-2 border-white/25 px-4 text-[15px] font-semibold text-white transition-all duration-200
              hover:border-white hover:bg-white hover:text-brand-900 hover:ring-4 hover:ring-offset-1 hover:ring-white/30 hover:ring-offset-brand-900 focus-visible:outline-none
              focus-visible:ring-2 focus-visible:ring-solar-500 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-900 sm:px-5"
            >
              Tous les projets
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          ) : (
            <p className="shrink-0 text-sm font-medium text-brand-200">
              {index + 1} / {caseStudies.length}
            </p>
          )}
        </div>
      </div>

      {/* Carte — suit la ville du projet affiché */}
      <div
        className={cn(
          "order-1 w-full items-start justify-center lg:order-2 lg:flex lg:aspect-square",
          showMapOnMobile ? "flex" : "hidden lg:flex",
        )}
      >
        <ReachMap activeCity={active.city} />
      </div>
    </div>
  );
}
