"use client";

import * as React from "react";

import { Glow } from "@/components/glow";
import { Reveal } from "@/components/motion";
import { Section, SectionHeading } from "@/components/section";
import { KitsTable } from "@/components/products/kits-table";
import { PowerLadder } from "@/components/products/power-ladder";
import { kits } from "@/lib/data/kits";

/**
 * Les deux vues du catalogue, et l'état qu'elles partagent.
 *
 * L'échelle fait *choisir*, le comparatif fait *vérifier* — mais ce sont deux
 * vues du même choix : cliquer une ligne du tableau ramène à la règle, palier
 * sélectionné. Sans état commun, l'une renverrait l'autre à zéro.
 */
export function KitsExplorer() {
  /* Ouvert sur le plus demandé du premier segment — le 5 kVA. */
  const [index, setIndex] = React.useState(() =>
    Math.max(
      0,
      kits.findIndex((kit) => kit.featured),
    ),
  );
  const ladderRef = React.useRef<HTMLDivElement>(null);

  const selectFromTable = (next: number) => {
    setIndex(next);
    ladderRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      {/* L'échelle — le cœur de la page, juste sous l'en-tête */}
      <section
        ref={ladderRef}
        aria-labelledby="echelle-title"
        className="relative isolate overflow-x-clip scroll-mt-24 bg-surface-cool-deep pb-14 pt-10 sm:pb-20 lg:pb-24 lg:pt-14"
      >
        <Glow variant="cool-deep" corner="bottom-right" />
        <div className="container relative">
          <SectionHeading
            id="echelle-title"
            rule
            eyebrow="Trouvez votre palier"
            title="Une seule échelle, du foyer à l'usine."
          />

          <div className="mt-8 lg:mt-10">
            <PowerLadder index={index} onSelect={setIndex} />
          </div>

          <p className="mt-5 text-center text-xs text-slate-500">
            Parcourez les paliers au clic ou avec les flèches ← →. Composition
            type, ajustée à votre site après l&apos;audit gratuit.
          </p>
        </div>
      </section>

      {/* Le comparatif — la même gamme, vue d'un seul coup d'œil */}
      <Section className="bg-white">
        <div className="container">
          <SectionHeading
            rule
            eyebrow="Comparatif complet"
            title={`Les ${kits.length} paliers, côte à côte.`}
            lead="Cliquez une puissance pour la retrouver détaillée sur l'échelle."
          />

          <Reveal delay={0.1} className="mt-10 lg:mt-12">
            <KitsTable activeIndex={index} onSelect={selectFromTable} />
          </Reveal>
        </div>
      </Section>
    </>
  );
}
