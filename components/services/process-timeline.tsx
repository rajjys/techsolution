"use client";

import * as React from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { Check } from "lucide-react";

import { processSteps } from "@/lib/data/services";

/**
 * Frise verticale du processus.
 *
 * Le rail se remplit au fil du défilement : le parcours « premier contact →
 * système entretenu » devient une progression que l'on voit avancer, plutôt
 * que quatre encadrés côte à côte. Chaque pastille reçoit un halo pulsé.
 *
 * Sous `prefers-reduced-motion`, le rail est rempli d'emblée et les halos
 * sont neutralisés (cf. globals.css) — le contenu reste identique.
 */
export function ProcessTimeline() {
  const ref = React.useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    /* Le rail commence à se remplir quand la frise entre dans le tiers bas
       de l'écran et finit quand sa base atteint le milieu. */
    offset: ["start 0.85", "end 0.55"],
  });

  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <ol ref={ref} className="relative mt-12 lg:mt-16">
      {/* Rail — creux, puis remplissage progressif par-dessus */}
      <div
        className="absolute inset-y-0 left-[15px] w-px bg-white/15 sm:left-[19px]"
        aria-hidden="true"
      />
      <motion.div
        className="absolute inset-y-0 left-[15px] w-px origin-top bg-gradient-to-b from-solar-500 via-solar-500 to-solar-500/30 sm:left-[19px]"
        style={{ scaleY: reduce ? 1 : progress }}
        aria-hidden="true"
      />

      {processSteps.map((step, index) => (
        <li
          key={step.step}
          className="relative pb-12 pl-12 last:pb-0 sm:pl-16 lg:pb-16"
        >
          {/* Pastille — halo pulsé, décalé pour ne pas se superposer */}
          <span
            className="absolute left-0 top-0 flex size-8 items-center justify-center sm:size-10"
            aria-hidden="true"
          >
            <span
              className="absolute size-4 animate-pulse-dot rounded-full bg-solar-500/60 sm:size-5"
              style={{ animationDelay: `${index * 0.6}s` }}
            />
            <span className="relative flex size-8 items-center justify-center rounded-full border border-solar-500/40 bg-brand-950 sm:size-10">
              {index === processSteps.length - 1 ? (
                <Check
                  className="size-4 text-solar-400 sm:size-5"
                  strokeWidth={2.5}
                />
              ) : (
                <span className="size-2.5 rounded-full bg-solar-500 sm:size-3" />
              )}
            </span>
          </span>

          <div className="pt-0.5 sm:pt-1.5">
            <p className="font-display text-sm font-bold tabular-nums tracking-[0.12em] text-solar-400">
              ÉTAPE {step.step}
            </p>
            <h3 className="mt-2 text-xl font-bold text-white sm:text-2xl lg:text-[26px]">
              {step.title}
            </h3>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-brand-200 sm:text-base sm:leading-[1.7]">
              {step.description}
            </p>
            <p className="mt-5 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white">
              <Check
                className="size-4 shrink-0 text-solar-400"
                strokeWidth={2.5}
                aria-hidden="true"
              />
              <span>
                <span className="text-brand-300">Vous recevez :</span>{" "}
                {step.deliverable}
              </span>
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
