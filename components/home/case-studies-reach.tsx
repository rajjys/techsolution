import { Glow } from "@/components/glow";
import { Reveal } from "@/components/motion";
import { CaseStudyShowcase } from "@/components/references/case-study-showcase";
import { Eyebrow } from "@/components/section";
import { deliveredProvinces } from "@/lib/data/clients";

/**
 * Réalisations — un projet à la fois, la carte de la RDC à côté.
 * La vitrine est partagée avec /references : même carrousel, même carte.
 */
export function CaseStudiesReach() {
  return (
    <section className="relative isolate overflow-hidden bg-brand-900 py-14 sm:py-20 lg:py-28">
      <Glow variant="dark" corner="top-right" />
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
            Des installations livrées dans{" "}
            <span className="font-semibold text-solar-400">
              {deliveredProvinces.length} provinces
            </span>{" "}
            — parcourez nos projets.
          </p>
        </Reveal>

        <div className="mt-14">
          <CaseStudyShowcase allProjectsHref="/references" />
        </div>
      </div>
    </section>
  );
}
