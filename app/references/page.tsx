import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Download, MapPin } from "lucide-react";

import { Glow } from "@/components/glow";
import { Reveal } from "@/components/motion";
import { PageHero } from "@/components/page-hero";
import { CaseStudyShowcase } from "@/components/references/case-study-showcase";
import { RealisationsList } from "@/components/references/realisations-list";
import { Section, SectionHeading } from "@/components/section";
import { Button } from "@/components/ui/button";
import { presenceCities } from "@/lib/data/case-studies";
import { clients, projects } from "@/lib/data/clients";
import { provinces } from "@/lib/data/drc";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Clients, Références & Présence en RDC",
  description:
    `Le track record ${site.name} : MONUSCO, CARE, Save the Children, ALIMA, Afriland First Bank,...`,
  alternates: { canonical: "/references" },
};

export default async function ReferencesPage({
  searchParams,
}: {
  searchParams: Promise<{ domaine?: string }>;
}) {
  /* `?domaine=` vient des CTA de /services : il fixe l'état initial de la
     liste, qui se filtre ensuite côté client. */
  const { domaine } = await searchParams;

  return (
    <>
      <PageHero
        compact
        breadcrumb={[{ label: "Références" }]}
        eyebrow="Nos réalisations"
        title={
          <>
            Ce que nous avons livré,{" "}
            <span className="text-brand-600">et où.</span>
          </>
        }
        lead={`${projects.length} installations en service pour ${clients.length} organisations — ONG internationales, banques, programmes d'État, médias et entreprises.`}
      >
        <Reveal mode="mount" delay={0.15}>
          <div className="mt-8 flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
            {/* Grille de trois : à 360 px les colonnes tiennent, les filets
                séparent sans qu'aucun libellé n'aille à la ligne de trop. */}
            <dl className="grid grid-cols-3 divide-x divide-brand-200">
              {[
                { value: `${projects.length}`, label: "Installations" },
                { value: `${clients.length}`, label: "Organisations" },
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

            {/* Le catalogue s'emporte : rien à demander, rien à attendre */}
            <Button variant="neutral" className="shrink-0" asChild>
              <a href={site.fardeUrl} download>
                <Download className="size-4 text-brand-600" />
                Télécharger la farde (PDF)
              </a>
            </Button>
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
            title="Six chantiers, racontés de bout en bout."
            lead="Le contexte, la contrainte, la solution retenue et le résultat. Ouvrez celui qui ressemble le plus au vôtre."
          />

          {/* Un projet à la fois, la carte à côté : six grandes cartes
              image coûtaient un écran entier sur mobile. */}
          <div className="mt-12 lg:mt-14">
            <CaseStudyShowcase showMapOnMobile />
          </div>

          <Reveal delay={0.1}>
            <p className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/10 pt-6 text-sm text-brand-200">
              <span className="font-semibold text-white">
                Nos {presenceCities.length} villes d&apos;intervention :
              </span>
              {presenceCities.map((city) => (
                <span
                  key={city.name}
                  className="inline-flex items-center gap-1.5 font-medium text-white"
                >
                  <MapPin
                    className="size-3.5 shrink-0 text-solar-400"
                    aria-hidden="true"
                  />
                  {city.name}
                </span>
              ))}
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

          <RealisationsList initialDomain={domaine} />

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
