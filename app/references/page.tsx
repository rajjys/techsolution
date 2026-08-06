import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Download, MapPin } from "lucide-react";

import { Glow } from "@/components/glow";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { PageHero } from "@/components/page-hero";
import { CaseStudyCard } from "@/components/references/case-study-card";
import { ReachMap } from "@/components/references/reach-map";
import { RealisationsList } from "@/components/references/realisations-list";
import { Section, SectionHeading } from "@/components/section";
import { Button } from "@/components/ui/button";
import { caseStudies, presenceCities } from "@/lib/data/case-studies";
import { clients, projects } from "@/lib/data/clients";
import { provinces } from "@/lib/data/drc";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Clients, Références & Présence en RDC",
  description:
    "Le track record Tech Solution RDC : MONUSCO, CARE, Save the Children, ALIMA, Afriland First Bank,...",
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

  const activeProvinces = provinces.filter((province) => province.active);

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
          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
            <div className="flex flex-wrap items-center gap-x-8 gap-y-5 sm:gap-x-10">
              {[
                { value: projects.length, label: "Installations livrées" },
                { value: clients.length, label: "Organisations clientes" },
                {
                  value: activeProvinces.length,
                  suffix: `/${provinces.length}`,
                  label: "Provinces livrées / couvertes",
                },
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-8 sm:gap-10"
                >
                  {index > 0 ? (
                    <span
                      className="h-10 w-px bg-brand-200"
                      aria-hidden="true"
                    />
                  ) : null}
                  <div>
                    <p className="font-display text-3xl font-bold tabular-nums text-slate-900 sm:text-4xl">
                      {stat.value}
                      {stat.suffix ? (
                        <span className="text-lg text-slate-400">
                          {stat.suffix}
                        </span>
                      ) : null}
                    </p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>

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

          <div className="mt-12 grid gap-10 lg:mt-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
            <Stagger className="grid gap-5 sm:grid-cols-2 lg:gap-6">
              {caseStudies.map((study) => (
                <StaggerItem key={study.slug} y={18} className="h-full">
                  <CaseStudyCard study={study} />
                </StaggerItem>
              ))}
            </Stagger>

            {/* Couverture — même carte que l'accueil, sans ville mise en avant */}
            <Reveal delay={0.1} className="lg:sticky lg:top-28 lg:self-start">
              <ReachMap />
              <div className="mt-6 border-t border-white/10 pt-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-solar-400">
                  Nos {presenceCities.length} villes d&apos;intervention
                </p>
                <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm font-medium text-white">
                  {presenceCities.map((city) => (
                    <span key={city.name} className="inline-flex items-center gap-1.5">
                      <MapPin
                        className="size-3.5 shrink-0 text-solar-400"
                        aria-hidden="true"
                      />
                      {city.name}
                    </span>
                  ))}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-brand-200">
                  Livré dans{" "}
                  <span className="font-semibold text-white">
                    {activeProvinces.length} provinces
                  </span>{" "}
                  depuis nos bases de l&apos;Est. Pour les{" "}
                  {provinces.length - activeProvinces.length} autres, nous
                  mobilisons une équipe projet.
                </p>
              </div>
            </Reveal>
          </div>
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
