import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";

import { Glow } from "@/components/glow";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { PageHero } from "@/components/page-hero";
import { KitLink } from "@/components/products/kit-link";
import { CaseStudyCard } from "@/components/references/case-study-card";
import { Section, SectionHeading } from "@/components/section";
import { ServiceCard } from "@/components/services/service-card";
import { Button } from "@/components/ui/button";
import { caseStudies } from "@/lib/data/case-studies";
import { projects } from "@/lib/data/clients";
import { kitSegments, kitsForSegment } from "@/lib/data/kits";
import { zones } from "@/lib/data/locations";
import { findServiceByPath, services, type Service } from "@/lib/data/services";
import {
  caseStudyHref,
  contactHref,
  productCategoryHref,
  serviceHref,
  zoneHref,
} from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { cn, placeLabel } from "@/lib/utils";

/** Six domaines préparés au build ; tout autre segment répond 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.urlSlug ?? service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = findServiceByPath(slug);
  if (!service) return {};
  return pageMetadata({
    path: serviceHref(service.slug),
    title: service.metaTitle,
    description: service.metaDescription,
  });
}

/** Les domaines dont le catalogue de kits est la réponse directe. */
const KIT_SERVICES = new Set(["energie-solaire", "backup-stockage"]);

/** Le H1 en deux temps — le métier, puis l'accent — coupé au premier « : » ou « , ». */
function splitTitle(title: string): [string, string] {
  /* Espace insécable avant « : » — sans elle, le titre passait à la ligne
     juste avant les deux-points et la chute commençait par « : alarme ». */
  const typeset = title.replace(/ ([:;!?])/g, "\u00a0$1");
  const match = typeset.match(/^(.+?[:,])\s(.+)$/);
  return match ? [match[1], match[2]] : [typeset, ""];
}

/** Une phrase, un point final — `delivery` n'en porte pas toujours. */
function sentence(text: string) {
  return /[.!?]$/.test(text) ? text : `${text}.`;
}

/**
 * Page d'un domaine d'expertise — `/services/<domaine>`.
 *
 * Ces six domaines vivaient en ancres d'une seule page : aucune ne pouvait se
 * classer sur sa requête (« onduleur hybride RDC », « alarme Bunia »…). Chaque
 * page répond désormais à trois questions, dans l'ordre : que faites-vous,
 * l'avez-vous déjà fait (les réalisations du domaine, données à l'appui),
 * et que puis-je acheter (les kits, quand le domaine en a).
 *
 * Elle se termine sur les cinq autres domaines : le maillage entre services
 * est ce qui fait de /services un ensemble plutôt que six impasses.
 */
export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = findServiceByPath(slug);
  if (!service) notFound();

  const [titleLead, titleAccent] = splitTitle(service.h1);
  const studies = caseStudies.filter((study) => {
    const related = services.find(
      (item: Service) => item.projectCategory === study.category,
    );
    return related?.slug === service.slug;
  });
  /* Les réalisations du domaine qui n'ont pas d'étude de cas : elles
     comptent aussi, sur une ligne. */
  const rows = projects.filter(
    (project) => project.category === service.projectCategory && !project.caseStudy,
  );
  const others = services.filter((item) => item.slug !== service.slug);
  /* Les villes à page où ce domaine a été livré — le maillage service ↔ ville. */
  const deliveredZones = zones.filter((zone) =>
    projects.some(
      (project) => project.city === zone.name && project.category === service.projectCategory,
    ),
  );
  const showKits = KIT_SERVICES.has(service.slug);

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    serviceType: service.shortTitle,
    description: service.metaDescription,
    url: `${site.url}${serviceHref(service.slug)}`,
    provider: { "@type": "Organization", name: site.legalName, url: site.url },
    areaServed: { "@type": "Country", name: "République Démocratique du Congo" },
  };

  /* Alternance des surfaces : blanc, teinté, blanc… selon les sections présentes. */
  const tinted = (position: number) => (position % 2 === 1 ? "bg-surface-cool" : "bg-white");
  let position = 0;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />

      <PageHero
        breadcrumb={[
          { label: "Services", href: "/services" },
          { label: service.shortTitle },
        ]}
        eyebrow={service.title}
        title={
          titleAccent ? (
            <>
              {titleLead}{" "}
              <span className="text-brand-600">{titleAccent}</span>
            </>
          ) : (
            titleLead
          )
        }
        lead={sentence(service.excerpt)}
        image={{
          src: service.image,
          alt: service.imageAlt,
          position: "50% 50%",
        }}
        actions={
          <>
            <Button className="group" asChild>
              <Link href={contactHref({ service: service.slug })}>
                Étudier mon projet
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </Button>
            {/* Un renvoi sur la même page n'est pas une action (§3) */}
            <Button variant="link" asChild>
              <Link href="#realisations">Voir les réalisations</Link>
            </Button>
          </>
        }
      />

      {/* Ce que nous faisons */}
      <Section className={tinted(position++)}>
        <div className="container grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <SectionHeading rule eyebrow="Ce que nous faisons" title={service.outcome} />
            <Reveal delay={0.1}>
              <p className="mt-6 text-[15px] leading-relaxed text-slate-600 sm:text-base lg:text-[17px] lg:leading-[1.75]">
                {service.description}
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7 lg:p-8">
              <h2 className="text-lg font-bold text-slate-900">Concrètement</h2>
              <ul className="mt-5 space-y-3">
                {service.capabilities.map((capability) => (
                  <li key={capability} className="flex items-start gap-3">
                    <Check
                      className="mt-[3px] size-4 shrink-0 text-solar-600"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    />
                    <span className="text-[15px] leading-relaxed text-slate-700">
                      {capability}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* La preuve — les réalisations du domaine */}
      <Section
        id="realisations"
        className={cn("relative isolate scroll-mt-24", tinted(position++))}
      >
        {position % 2 === 0 ? <Glow variant="cool" corner="bottom-right" /> : null}
        <div className="container relative">
          <SectionHeading
            rule
            eyebrow="Ce que nous avons livré"
            title={`${service.shortTitle} : nos réalisations.`}
            lead={
              studies.length + rows.length > 0
                ? `${studies.length + rows.length} réalisation${studies.length + rows.length > 1 ? "s" : ""} documentée${studies.length + rows.length > 1 ? "s" : ""} dans ce domaine, avec leur client et leur lieu.`
                : undefined
            }
          />

          {studies.length > 0 ? (
            <Stagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {studies.map((study) => (
                <StaggerItem key={study.slug} className="h-full">
                  <CaseStudyCard study={study} />
                </StaggerItem>
              ))}
            </Stagger>
          ) : null}

          {rows.length > 0 ? (
            <ul className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
              {rows.map((project) => (
                <li
                  key={`${project.title}-${project.city}`}
                  className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                >
                  <span>
                    <span className="block text-[15px] font-semibold text-slate-900">
                      {project.title}
                    </span>
                    <span className="text-sm text-slate-500">{project.client}</span>
                  </span>
                  <span className="shrink-0 text-sm font-medium text-slate-600">
                    {placeLabel(project.city, project.province)}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}

          {deliveredZones.length > 0 ? (
            <p className="mt-6 text-sm text-slate-600">
              {"Livré notamment à "}
              {deliveredZones.map((zone, index) => (
                <span key={zone.slug}>
                  {index > 0 ? (index === deliveredZones.length - 1 ? " et " : ", ") : null}
                  <Link
                    href={zoneHref(zone.slug)}
                    className="font-semibold text-brand-700 underline-offset-4 hover:underline"
                  >
                    {zone.name}
                  </Link>
                </span>
              ))}
              .
            </p>
          ) : null}

          <Reveal delay={0.1}>
            <Link
              href={`/references?domaine=${service.slug}#realisations`}
              className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 underline-offset-4 hover:underline"
            >
              Toutes nos réalisations, client et lieu à l&apos;appui
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </Section>

      {/* Ce qu'on peut acheter — seulement là où le catalogue répond */}
      {showKits ? (
        <Section className={cn("relative isolate", tinted(position++))}>
          {position % 2 === 0 ? <Glow variant="cool" corner="bottom-left" /> : null}
          <div className="container relative">
            <SectionHeading
              rule
              eyebrow="Les kits du catalogue"
              title="Une composition prête, ajustée après l'audit."
              lead="Onduleur hybride, batterie lithium et panneaux, du foyer à l'établissement. Au-delà de 30 kVA, nous dimensionnons sur mesure."
            />
            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {kitSegments.map((segment) => (
                <div
                  key={segment.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card"
                >
                  <p className="flex items-center gap-2 text-sm font-bold text-slate-900">
                    <segment.icon className="size-4 text-brand-600" aria-hidden="true" />
                    {segment.label}
                  </p>
                  <ul className="-mx-2.5 mt-3 space-y-0.5">
                    {kitsForSegment(segment.id).map((kit) => (
                      <li key={kit.slug}>
                        <KitLink kit={kit} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <Link
              href={productCategoryHref("kits-solaires")}
              className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 underline-offset-4 hover:underline"
            >
              Comparer les kits côte à côte
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </Section>
      ) : null}

      {/* Les autres domaines — /services est un ensemble, pas six impasses */}
      <Section className={cn("relative isolate", tinted(position++))}>
        {position % 2 === 0 ? <Glow variant="cool" corner="bottom-right" /> : null}
        <div className="container relative">
          <SectionHeading
            rule
            eyebrow="Nos autres expertises"
            title="Une seule équipe, de l'audit à l'entretien."
          />
          <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {others.map((item) => (
              <StaggerItem key={item.slug} className="h-full" y={18}>
                <ServiceCard service={item} href={serviceHref(item.slug)} />
              </StaggerItem>
            ))}
          </Stagger>
          {studies[0] ? (
            <p className="mt-8 text-sm text-slate-600">
              {"Un exemple dans ce domaine : "}
              <Link
                href={caseStudyHref(studies[0].slug)}
                className="font-semibold text-brand-700 underline-offset-4 hover:underline"
              >
                {studies[0].h1}
              </Link>
            </p>
          ) : null}
        </div>
      </Section>
    </>
  );
}
