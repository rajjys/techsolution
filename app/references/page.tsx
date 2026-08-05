import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  MapPin,
  MapPinned,
  Phone,
} from "lucide-react";

import { DrcMap } from "@/components/drc-map";
import { Glow } from "@/components/glow";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { PageHero } from "@/components/page-hero";
import { CaseStudyCard } from "@/components/references/case-study-card";
import { Section, SectionHeading } from "@/components/section";
import { Button } from "@/components/ui/button";
import { caseStudies } from "@/lib/data/case-studies";
import { clients, projects, sectorGroups } from "@/lib/data/clients";
import { provinces } from "@/lib/data/drc";
import { services } from "@/lib/data/services";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Clients, Références & Présence en RDC",
  description:
    "Le track record Tech Solution RDC : MONUSCO, CARE, Save the Children, ALIMA, Afriland First Bank,...",
  alternates: { canonical: "/references" },
};

/**
 * Catégories de réalisation — cantonnées aux quatre familles du système
 * (solar, brand, ember, slate). L'ambre, l'émeraude et le ciel employés
 * jusqu'ici n'appartenaient à aucune d'elles.
 */
const projectCategoryStyles: Record<string, string> = {
  Solaire: "border-solar-500/30 bg-solar-50 text-solar-800",
  Backup: "border-brand-200 bg-brand-50 text-brand-800",
  Électricité: "border-ember-200 bg-ember-50 text-ember-800",
  Télécoms: "border-brand-200 bg-white text-brand-700",
  Sécurité: "border-slate-300 bg-white text-slate-700",
  Maintenance: "border-slate-200 bg-slate-100 text-slate-600",
};

/** Puce de filtre — même grammaire que les chips d'ancrage de /services. */
function FilterChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? "true" : undefined}
      className={cn(
        "inline-flex items-center rounded-full border px-4 py-2 text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
        active
          ? "border-brand-600 bg-brand-600 font-semibold text-white"
          : "border-slate-200 bg-white font-medium text-slate-700 shadow-card hover:border-brand-300 hover:text-brand-700 hover:ring-4 hover:ring-brand-100 hover:ring-offset-1",
      )}
    >
      {children}
    </Link>
  );
}

export default async function ReferencesPage({
  searchParams,
}: {
  searchParams: Promise<{ domaine?: string }>;
}) {
  const { domaine } = await searchParams;
  const activeProvinces = provinces.filter((p) => p.active);
  const totalProvinces = provinces.length;

  /* Le domaine vient de /services ; la catégorie correspondante est portée
     par le service lui-même (cf. `projectCategory`). */
  const activeService = services.find((service) => service.slug === domaine);
  const visibleProjects = activeService
    ? projects.filter(
        (project) => project.category === activeService.projectCategory,
      )
    : projects;

  return (
    <>
      <PageHero
        compact
        breadcrumb={[{ label: "Références" }]}
        eyebrow="Clients & Références"
        title={
          <>
            Avant de nous croire,{" "}
            <span className="text-brand-600">vérifiez.</span>
          </>
        }
        lead={`${projects.length} installations livrées pour ${clients.length} organisations. Les personnes de contact figurent dans la farde technique, transmise sur demande.`}
      >
        <Reveal mode="mount" delay={0.15}>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-5 sm:gap-x-10">
            {[
              { value: projects.length, label: "Réalisations livrées" },
              { value: clients.length, label: "Clients institutionnels" },
              {
                value: activeProvinces.length,
                suffix: `/${totalProvinces}`,
                label: "Provinces livrées / couvertes",
              },
            ].map((stat, index) => (
              <div key={stat.label} className="flex items-center gap-8 sm:gap-10">
                {index > 0 ? (
                  <span className="h-10 w-px bg-brand-200" aria-hidden="true" />
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
        </Reveal>
      </PageHero>

      {/* Projets phares — le sombre est la couleur de la preuve */}
      <Section className="relative isolate overflow-hidden bg-brand-900">
        <Glow variant="dark" corner="top-right" />
        <div className="container relative">
          <SectionHeading
            rule
            onDark
            eyebrow="Projets phares"
            title="Six chantiers, racontés de bout en bout."
            lead="Le contexte, la contrainte, la solution retenue et le résultat mesuré. Ouvrez celui qui ressemble le plus au vôtre."
          />

          <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-6">
            {caseStudies.map((study) => (
              <StaggerItem key={study.slug} y={18} className="h-full">
                <CaseStudyCard study={study} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Section>

      {/* Toutes les réalisations — filtrables par domaine depuis /services */}
      <Section id="realisations" className="scroll-mt-24 bg-white">
        <div className="container">
          <SectionHeading
            rule
            eyebrow="Toutes les réalisations"
            title={
              activeService
                ? `${visibleProjects.length} installation${visibleProjects.length > 1 ? "s" : ""} en ${activeService.shortTitle.toLowerCase()}`
                : `${projects.length} installations, chacune sur un site réel.`
            }
            lead="Aucune ligne n'est une intention : ce sont des chantiers livrés, avec leur client et leur localisation."
          />

          {/* Filtre par domaine — les libellés viennent des services */}
          <div
            role="group"
            aria-label="Filtrer les réalisations par domaine"
            className="mt-8 flex flex-wrap gap-2"
          >
            <FilterChip href="/references#realisations" active={!activeService}>
              Tous les domaines
            </FilterChip>
            {services.map((service) => (
              <FilterChip
                key={service.slug}
                href={`/references?domaine=${service.slug}#realisations`}
                active={activeService?.slug === service.slug}
              >
                {service.shortTitle}
              </FilterChip>
            ))}
          </div>

          <Stagger className="mt-10 divide-y divide-slate-100 border-y border-slate-200">
            {visibleProjects.map((project, index) => {
              /* Les six projets documentés mènent à leur étude de cas ; les
                 autres restent de simples lignes, sans fausse affordance. */
              const rowClass = cn(
                "group flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:gap-6",
                project.caseStudy &&
                  "-mx-3 rounded-xl px-3 transition-colors hover:bg-brand-50/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
              );

              const content = (
                <>
                  <span
                      className={cn(
                        "inline-flex shrink-0 items-center self-start rounded-full border px-2.5 py-0.5 text-[11px] font-semibold sm:w-28 sm:justify-center",
                        projectCategoryStyles[project.category],
                      )}
                    >
                      {project.category}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-[15px] font-bold leading-snug text-slate-900">
                        {project.title}
                        {project.caseStudy ? (
                          <ArrowUpRight
                            className="ml-1.5 inline size-4 text-brand-600 opacity-0 transition-opacity group-hover:opacity-100"
                            aria-hidden="true"
                          />
                        ) : null}
                      </span>
                      <span className="mt-0.5 block text-sm text-slate-500">
                        {project.client}
                        {project.caseStudy ? (
                          <span className="ml-2 text-xs font-semibold text-brand-600">
                            Étude de cas
                          </span>
                        ) : null}
                      </span>
                    </span>

                    <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-slate-600 sm:w-52">
                      <MapPin
                        className="size-3.5 shrink-0 text-solar-600"
                        aria-hidden="true"
                      />
                      {project.city} — {project.province}
                    </span>
                </>
              );

              return (
                <StaggerItem
                  key={`${project.title}-${project.city}-${index}`}
                  y={10}
                >
                  {project.caseStudy ? (
                    <Link
                      href={`/references/${project.caseStudy}`}
                      className={rowClass}
                    >
                      {content}
                    </Link>
                  ) : (
                    <div className={rowClass}>{content}</div>
                  )}
                </StaggerItem>
              );
            })}
          </Stagger>

          {visibleProjects.length === 0 ? (
            <p className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-600">
              Aucune réalisation publiée dans ce domaine pour le moment — nous y
              intervenons pourtant.{" "}
              <Link
                href="/contact"
                className="font-semibold text-brand-700 underline underline-offset-4"
              >
                Demandez la farde technique
              </Link>{" "}
              pour les références détaillées.
            </p>
          ) : null}
        </div>
      </Section>

      {/* Par secteur — ce que le service achats vient vérifier */}
      <Section className="relative isolate bg-surface-cool">
        <Glow variant="cool" corner="bottom-left" />
        <div className="container relative">
          <SectionHeading
            rule
            eyebrow="Par secteur"
            title="Vos exigences, nous les avons déjà satisfaites."
            lead="Bailleurs, banques centrales, programmes d'État, ONG internationales : chaque secteur impose ses documents et ses contrôles."
          />

          <div className="mt-12 space-y-10 lg:mt-14">
            {sectorGroups.map((group) => {
              const groupClients = clients.filter(
                (client) => client.sectorGroup === group.id,
              );
              if (groupClients.length === 0) return null;

              return (
                <Reveal key={group.id}>
                  <div className="flex items-center gap-3 border-b border-slate-300/70 pb-4">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-950">
                      <group.icon
                        className="size-4 text-solar-400"
                        aria-hidden="true"
                      />
                    </span>
                    <h3 className="font-display text-lg font-bold text-slate-900">
                      {group.label}
                    </h3>
                    <span className="ml-auto shrink-0 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                      {groupClients.length} réf.
                    </span>
                  </div>

                  <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {groupClients.map((client) => (
                      <li
                        key={client.name}
                        className="flex items-start gap-3.5 rounded-2xl border border-slate-200 bg-white p-4 shadow-card"
                      >
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-950 font-display text-xs font-bold text-solar-400">
                          {client.monogram}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-bold leading-snug text-slate-900">
                            {client.name}
                          </p>
                          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                            <MapPin
                              className="size-3 shrink-0 text-solar-600"
                              aria-hidden="true"
                            />
                            {client.city}
                          </p>
                          <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                            {client.services.map((service) => (
                              <li
                                key={service}
                                className="inline-flex items-center gap-1 text-xs text-slate-600"
                              >
                                <BadgeCheck
                                  className="size-3 shrink-0 text-solar-600"
                                  aria-hidden="true"
                                />
                                {service}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={0.1}>
            <div className="mt-12 flex flex-col items-start justify-between gap-5 rounded-2xl bg-brand-950 p-6 sm:p-8 md:flex-row md:items-center">
              <div className="flex items-start gap-4">
                <Phone
                  className="mt-1 size-5 shrink-0 text-solar-400"
                  aria-hidden="true"
                />
                <p className="max-w-2xl text-sm leading-relaxed text-brand-200">
                  <span className="font-semibold text-white">
                    Appelez-les.
                  </span>{" "}
                  Fonction et téléphone direct de chaque personne de contact
                  figurent dans notre farde technique, transmise sur demande aux
                  services achats et logistique.
                </p>
              </div>
              <Button variant="primary-dark" className="group shrink-0" asChild>
                <Link href="/contact">
                  Demander la farde
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Couverture — la carte a besoin d'un fond clair */}
      <Section className="bg-white">
        <div className="container grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <Reveal y={30} className="order-2 lg:order-1">
            <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-6 shadow-card sm:p-8">
              <DrcMap />
            </div>
          </Reveal>

          <div className="order-1 lg:order-2">
            <SectionHeading
              rule
              eyebrow="Couverture"
              title="Où que soit votre site, nous savons y aller."
              lead={`Nos équipes sont basées dans l'Est, où ${activeProvinces.length} provinces ont déjà été livrées. Pour le reste du territoire, nous mobilisons une équipe projet.`}
            />

            <Reveal delay={0.12}>
              <div className="mt-8">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                  <MapPinned
                    className="size-4 text-solar-600"
                    aria-hidden="true"
                  />
                  Les {totalProvinces} provinces de la RDC
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {provinces.map((province) => (
                    <span
                      key={province.name}
                      className={
                        province.active
                          ? "inline-flex items-center gap-1.5 rounded-full bg-solar-500 px-2.5 py-1 text-xs font-bold text-slate-900"
                          : "inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-500"
                      }
                    >
                      {province.active ? (
                        <span
                          className="size-1.5 rounded-full bg-slate-900"
                          aria-hidden="true"
                        />
                      ) : null}
                      {province.name}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-xs leading-relaxed text-slate-500">
                  <span className="font-semibold text-slate-700">
                    En surbrillance :
                  </span>{" "}
                  les provinces où des installations sont livrées et
                  opérationnelles. Villes d&apos;intervention : Bunia, Mahagi,
                  Aveba, Butembo, Goma et Numbi.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>
    </>
  );
}
