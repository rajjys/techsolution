import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, Download, MapPin } from "lucide-react";

import { Glow } from "@/components/glow";
import { Reveal } from "@/components/motion";
import { PageHero } from "@/components/page-hero";
import { CaseStudyShowcase } from "@/components/references/case-study-showcase";
import {
  RealisationsList,
  RealisationsListFromUrl,
} from "@/components/references/realisations-list";
import { Section, SectionHeading } from "@/components/section";
import { Button } from "@/components/ui/button";
import { caseStudies, presenceCities } from "@/lib/data/case-studies";
import { zoneForCity } from "@/lib/data/locations";
import { zoneHref } from "@/lib/routes";
import { clients, projects } from "@/lib/data/clients";
import { provinces } from "@/lib/data/drc";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  path: "/references",
  /*
   * Le sujet et le lieu dans le titre : « Réalisations — MONUSCO, CARE… »
   * nommait des clients sans dire de quoi ni où. Les noms passent dans la
   * description, où ils donnent la raison de cliquer.
   */
  title: "Réalisations solaires et électriques en RDC",
  description: `${projects.length} installations documentées de Bunia à Kinshasa — MONUSCO, CARE, Afriland, CADECO, l’hôtel Gracia — dont ${caseStudies.length} racontées de bout en bout.`,
});

/**
 * /references — statique : le `?domaine=` des liens de /services est lu par
 * la liste elle-même, côté client (cf. `RealisationsListFromUrl`).
 */
export default function ReferencesPage() {
  return (
    <>
      <PageHero
        compact
        breadcrumb={[{ label: "Références" }]}
        eyebrow="Nos réalisations"
        title={
          <>
            {/* Le sujet d'abord, la voix de la marque ensuite : le H1 dit de
                quoi parle la page, la chute garde « et où ». */}
            Nos réalisations en RDC&nbsp;:{" "}
            <span className="text-brand-600">ce que nous avons livré, et où.</span>
          </>
        }
        lead={`${projects.length} installations documentées pour ${clients.length} clients nommés — ONG internationales, banques, programmes d'État, médias, hôtellerie et entreprises.`}
        image={{
          /*
           * Une installation de l'entreprise, vue du drone. L'image
           * précédente (hôtel Bambou, Kisangani) venait d'un autre
           * installateur : sur la page des réalisations, c'était la pire
           * place pour une photo qui n'en est pas une.
           */
          src: "/photos/drone-ensemble-panneaux.webp",
          alt: "Vue aérienne de panneaux solaires installés par Tech Solution RDC sur une toiture",
          position: "50% 50%",
          /* La preuve de l'échelle livrée — elle vaut d'être vue. */
          mobile: "band",
        }}
        actions={
          <>
            <Button variant="neutral" asChild>
              <a href={site.fardeUrl} download>
                <Download className="size-4 text-brand-600" />
                Télécharger la farde (PDF)
              </a>
            </Button>
          </>
        }
      >
        <Reveal mode="mount" delay={0.2}>
          <div className="mt-9">
            {/* Grille de trois : à 360 px les colonnes tiennent, les filets
                séparent sans qu'aucun libellé n'aille à la ligne de trop. */}
            <dl className="grid grid-cols-3 divide-x divide-brand-200">
              {[
                { value: `${projects.length}`, label: "Installations" },
                { value: `${clients.length}`, label: "Clients nommés" },
                {
                  value: `${site.provincesDelivered}`,
                  suffix: `/${provinces.length}`,
                  label: "Provinces",
                },
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  className={index === 0 ? "pr-4" : "px-4 last:pr-0 sm:px-6"}
                >
                  <dd className="font-display text-3xl font-bold tabular-nums text-slate-900 sm:text-4xl">
                    {stat.value}
                    {stat.suffix ? (
                      <span className="text-lg text-slate-400">
                        {stat.suffix}
                      </span>
                    ) : null}
                  </dd>
                  <dt className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 sm:text-xs">
                    {stat.label}
                  </dt>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </PageHero>

      {/* Projets phares + couverture — le sombre est la couleur de la preuve */}
      <Section className="relative isolate overflow-hidden bg-brand-900">
        <Glow variant="dark" corner="top-right" />
        <div className="container relative">
          <SectionHeading
            rule
            onDark
            eyebrow="Projets phares"
            title={`${caseStudies.length} chantiers, racontés de bout en bout.`}
            lead="Le contexte, la contrainte, la solution retenue et le résultat. Ouvrez celui qui ressemble le plus au vôtre."
          />

          {/* Un projet à la fois, la carte à côté : autant de grandes cartes
              image coûtaient un écran entier sur mobile. */}
          <div className="mt-12 lg:mt-14">
            <CaseStudyShowcase showMapOnMobile />
          </div>

          <Reveal delay={0.1}>
            <p className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/10 pt-6 text-sm text-brand-200">
              <span className="font-semibold text-white">
                {`Nos ${presenceCities.length} villes d'intervention :`}
              </span>
              {presenceCities.map((city) => {
                /* Les villes qui ont leur page y mènent ; les autres sont
                   nommées, sans lien vers une page qui n'existe pas. */
                const zone = zoneForCity(city.name);
                const label = (
                  <>
                    <MapPin className="size-3.5 shrink-0 text-solar-400" aria-hidden="true" />
                    {city.name}
                  </>
                );
                return zone ? (
                  <Link
                    key={city.name}
                    href={zoneHref(zone.slug)}
                    className="inline-flex items-center gap-1.5 font-medium text-white underline-offset-4 hover:text-solar-300 hover:underline"
                  >
                    {label}
                  </Link>
                ) : (
                  <span key={city.name} className="inline-flex items-center gap-1.5 font-medium text-white">
                    {label}
                  </span>
                );
              })}
              <span className="w-full sm:w-auto">
                — et une équipe projet mobilisable dans les{" "}
                {provinces.length - site.provincesDelivered} autres provinces.
              </span>
            </p>
          </Reveal>
        </div>
      </Section>

      {/* Toutes les réalisations — une seule liste, facettes repliées */}
      <Section id="realisations" className="scroll-mt-24 bg-white">
        <div className="container">
          <SectionHeading
            rule
            eyebrow="Le relevé complet"
            title="Chaque ligne est une installation en service."
            lead="Aucune n'est une intention ni un projet à l'étude : ce sont des chantiers livrés, avec leur client et leur localisation."
          />

          <Suspense fallback={<RealisationsList />}>
            <RealisationsListFromUrl />
          </Suspense>

          <Reveal delay={0.1}>
            <div className="mt-12 flex flex-col items-start gap-5 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
              <p className="max-w-2xl text-sm leading-relaxed text-slate-600">
                <span className="font-semibold text-slate-900">
                  Le dossier technique complet
                </span>{" "}
                — fiches de chantier, photographies et compositions installées —
                est téléchargeable sans formalité.
              </p>
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row md:shrink-0">
                <Button variant="neutral" asChild>
                  <a href={site.fardeUrl} download>
                    <Download className="size-4 text-brand-600" />
                    Télécharger la farde
                  </a>
                </Button>
                <Button className="group" asChild>
                  <Link href="/contact">
                    Parler de mon site
                    <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
