"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Reveal } from "@/components/motion";
import { Eyebrow } from "@/components/section";
import { CaseStudyCard } from "@/components/references/case-study-card";
import { ReachMap } from "@/components/references/reach-map";
import { caseStudies } from "@/lib/data/case-studies";
import { cn } from "@/lib/utils";

/* ─── Section ─── */

export function CaseStudiesReach() {
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
    <section className="relative overflow-hidden bg-brand-900 py-14 sm:py-20 lg:py-28">
      <div
        className="absolute -right-40 -top-40 size-[480px] rounded-full bg-solar-500/10 blur-3xl"
        aria-hidden="true"
      />
      <div className="container relative">
        {/* En-tête centré — même grammaire que les autres sections */}
        <Reveal className="text-center">
          <Eyebrow onDark className="justify-center">
            Nos réalisations
          </Eyebrow>
          <h2 className="mx-auto mt-6 text-balance text-[26px] font-bold leading-[1.15] text-white sm:text-3xl sm:leading-[1.12] md:text-4xl lg:text-[46px] lg:leading-[1.08]">
            Nos réalisations, d&apos;un bout à l&apos;autre de la RDC.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-brand-200 sm:text-base md:text-lg">
            Des installations livrées à travers{" "}
            <span className="font-semibold text-solar-400">9 provinces</span> —
            parcourez nos projets.
          </p>
        </Reveal>

        <div className="mt-14 grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Étude de cas + contrôles du carrousel (gauche) */}
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

            {/* Contrôles — rattachés à la carte : progression et navigation
                à gauche, accès au catalogue à droite, sur une seule ligne */}
            <div className="mt-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 sm:gap-5">
                {/* Progression — masquée sous 420 px, faute de place */}
                <div className="hidden items-center gap-1.5 min-[420px]:flex">
                {caseStudies.map((cs, i) => (
                  <button
                    key={cs.slug}
                    onClick={() => go(i)}
                    aria-label={`Projet à ${cs.city}`}
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

              <Link
                href="/references"
                className="group inline-flex h-11 shrink-0 items-center gap-2 rounded-xl border-2 border-white/25 px-4 text-[15px] font-semibold text-white transition-all duration-200 
                hover:border-white hover:bg-white hover:text-brand-900 hover:ring-4 hover:ring-offset-1 hover:ring-white/30 hover:ring-offset-brand-900 focus-visible:outline-none 
                focus-visible:ring-2 focus-visible:ring-solar-500 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-900 sm:px-5"
              >
                Tous les projets
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Carte — masquée sur mobile, à droite sur laptop */}
          <div className="hidden lg:order-2 lg:flex lg:aspect-square lg:w-full lg:items-start lg:justify-center">
            <ReachMap activeCity={active.city} />
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Bouton de navigation du carrousel — rectangulaire comme le reste de la
 * page (kits, CTA), avec l'anneau de survol commun.
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
