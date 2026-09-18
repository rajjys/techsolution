import { Glow } from "@/components/glow";
import { Reveal } from "@/components/motion";
import { CaseStudyShowcase } from "@/components/references/case-study-showcase";
import { Eyebrow } from "@/components/section";
import { projects } from "@/lib/data/clients";
import { site } from "@/lib/site";

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
          {/*
            Le surtitre disait « Nos réalisations » et le titre le répétait mot
            pour mot : deux lignes pour une seule information. Le surtitre
            change donc de registre, et le titre porte enfin ce que la page
            d'accueil gardait pour /references — la nature des clients. Des
            agences onusiennes, des ONG internationales et des banques : c'est
            l'argument le plus fort du site, et il était absent de la page la
            plus visitée.
          */}
          <Eyebrow onDark className="justify-center">
            Preuves sur le terrain
          </Eyebrow>
          <h2 className="mx-auto mt-6 text-balance text-[26px] font-bold leading-[1.15] text-white sm:text-3xl sm:leading-[1.12] md:text-4xl lg:text-[46px] lg:leading-[1.08]">
            Des foyers aux grandes organisations, nous installons votre autonomie énergétique.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-brand-200 sm:text-base md:text-lg">
            <span className="font-semibold text-solar-400">
              {projects.length + 60 }+ installations 
            </span>{" "}
            en service dans{" "}
            <span className="font-semibold text-solar-400">
              {site.provincesDelivered} provinces
            </span>{" "}
            — Découvrez nos installations, du solaire résidentiel aux projets de grande envergure.
          </p>
        </Reveal>

        <div className="mt-14">
          <CaseStudyShowcase allProjectsHref="/references" />
        </div>
      </div>
    </section>
  );
}
