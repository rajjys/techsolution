import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

import { Glow } from "@/components/glow";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { PageHero } from "@/components/page-hero";
import { Section, SectionHeading } from "@/components/section";
import { Button } from "@/components/ui/button";
import { caseStudies } from "@/lib/data/case-studies";
import { projects } from "@/lib/data/clients";
import { provinces } from "@/lib/data/drc";
import { SERVED_CITY_MODEL, servedCities, zones } from "@/lib/data/locations";
import { caseStudyHref, contactHref, zoneHref } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { offices } from "@/lib/site";

/** Provinces où une réalisation est documentée — compté, pas déclaré. */
const documentedProvinces = new Set(projects.map((project) => project.province)).size;

export const metadata: Metadata = pageMetadata({
  path: "/zones",
  title: "Zones d'intervention en RDC",
  description: `Bureaux à Bunia et Kinshasa, une équipe permanente à Goma, ${projects.filter((project) => project.city === "Mahagi").length} chantiers à Mahagi — et des interventions partout en RDC, avec des techniciens recrutés sur place.`,
});

/**
 * /zones — où l'entreprise intervient, dit honnêtement.
 *
 * Trois statuts, jamais confondus : un bureau, une ville où des réalisations
 * sont documentées, une ville où l'on intervient sans rien y avoir encore
 * documenté. Seuls les deux premiers ont une page ; le troisième est nommé
 * ici, avec la façon dont l'entreprise y travaille — c'est la place légitime
 * de « Lubumbashi » ou « Beni » tant qu'aucun chantier n'y est publié.
 */
export default function ZonesPage() {
  const ltj = caseStudies.find((study) => study.city === "Butembo");

  return (
    <>
      <PageHero
        compact
        breadcrumb={[{ label: "Zones d'intervention" }]}
        eyebrow="Zones d'intervention"
        title={
          <>
            Où nous intervenons en RDC&nbsp;:{" "}
            <span className="text-brand-600">
              {`deux bureaux, des chantiers documentés dans ${documentedProvinces} provinces.`}
            </span>
          </>
        }
        lead={`Un siège à Bunia, une antenne à Kinshasa, une équipe permanente à Goma. Ailleurs, sur les ${provinces.length} provinces, nous recrutons les techniciens sur place pour chaque chantier.`}
      />

      {/* Les villes qui ont leur page — la teinte d'index (§1, règle 8) */}
      <Section className="relative isolate bg-surface-cool-deep">
        <Glow variant="cool-deep" corner="bottom-right" />
        <div className="container relative">
          <SectionHeading
            rule
            eyebrow="Nos villes"
            title="Un bureau, ou des chantiers à montrer."
          />
          <Stagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {zones.map((zone) => {
              const office = offices.find((item) => item.city === zone.officeCity);
              const count = projects.filter((project) => project.city === zone.name).length;
              const status = office
                ? office.role
                : zone.permanentTeam
                  ? "Équipe permanente"
                  : "Chantiers livrés";
              return (
                <StaggerItem key={zone.slug} className="h-full">
                  <Link
                    href={zoneHref(zone.slug)}
                    className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-soft hover:ring-4 hover:ring-brand-200 hover:ring-offset-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                  >
                    <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.1em] text-brand-700">
                      {status}
                    </span>
                    <span className="mt-4 flex items-center gap-2 text-xl font-bold text-slate-900">
                      <MapPin className="size-5 text-solar-600" aria-hidden="true" />
                      {zone.name}
                    </span>
                    {/* Kinshasa est une ville-province : on ne le dit pas deux fois. */}
                    {zone.province !== zone.name ? (
                      <span className="mt-1 text-sm text-slate-500">{zone.province}</span>
                    ) : null}
                    <span className="mt-4 text-sm leading-relaxed text-slate-600">
                      {`${count} réalisation${count > 1 ? "s" : ""} documentée${count > 1 ? "s" : ""}`}
                    </span>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-brand-700">
                      {`Installation solaire à ${zone.name}`}
                      <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </span>
                  </Link>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </Section>

      {/* Ailleurs — nommé, sans page inventée */}
      <Section className="bg-white">
        <div className="container grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <SectionHeading
              rule
              eyebrow="Ailleurs en RDC"
              title="Nous intervenons aussi là où nous n'avons pas de bureau."
              lead={SERVED_CITY_MODEL}
            />
            <Reveal delay={0.1}>
              <Button className="group mt-8" asChild>
                <Link href={contactHref()}>
                  Parler de mon site
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </Button>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <ul className="divide-y divide-slate-200 border-y border-slate-200">
              {servedCities.map((city) => (
                <li key={city.name} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-4">
                  <span className="flex items-center gap-2 text-[15px] font-semibold text-slate-900">
                    <MapPin className="size-4 text-slate-400" aria-hidden="true" />
                    {city.name}
                    <span className="text-sm font-normal text-slate-500">{city.province}</span>
                  </span>
                  {/* Butembo a une réalisation racontée : on y renvoie. */}
                  {ltj && city.name === ltj.city ? (
                    <Link
                      href={caseStudyHref(ltj.slug)}
                      className="text-sm font-semibold text-brand-700 underline-offset-4 hover:underline"
                    >
                      Une réalisation : système backup
                    </Link>
                  ) : (
                    <span className="text-sm text-slate-500">Intervention sur demande</span>
                  )}
                </li>
              ))}
              <li className="py-4 text-sm text-slate-500">
                {`Et sur l'ensemble des ${provinces.length} provinces, sur étude.`}
              </li>
            </ul>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
