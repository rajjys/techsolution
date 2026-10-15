import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Clock, Mail, MapPin, Phone } from "lucide-react";

import { Glow } from "@/components/glow";
import { WhatsAppIcon } from "@/components/icons";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { PageHero } from "@/components/page-hero";
import { CaseStudyCard } from "@/components/references/case-study-card";
import { Section, SectionHeading } from "@/components/section";
import { Button } from "@/components/ui/button";
import { caseStudies } from "@/lib/data/case-studies";
import { projects } from "@/lib/data/clients";
import { findZone, zones } from "@/lib/data/locations";
import { serviceForCategory } from "@/lib/data/services";
import { officeJsonLd } from "@/lib/jsonld";
import { contactHref, serviceHref, zoneHref } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { officeMapsUrl, offices, site } from "@/lib/site";
import { buildWhatsAppLink } from "@/lib/whatsapp";

/** Quatre villes préparées au build ; une autre répond 404 (palier 3 : pas de page). */
export const dynamicParams = false;

export function generateStaticParams() {
  return zones.map((zone) => ({ slug: zone.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const zone = findZone(slug);
  if (!zone) return {};
  return pageMetadata({
    path: zoneHref(zone.slug),
    title: `Installation solaire à ${zone.name}`,
    description: zone.metaDescription,
  });
}

/** Le nombre en toutes lettres jusqu'à dix — un H1 ne dit pas « 3 chantiers ». */
const WORDS = ["zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix"];

/**
 * La page d'une ville — `/zones/<ville>`.
 *
 * Palier 1 (bureau) : l'adresse, les horaires à l'heure locale, l'équipe, et
 * le balisage `LocalBusiness` — le même que /contact, sous le même `@id`.
 * Palier 2 (ville prouvée) : pas d'adresse à baliser, donc pas de
 * `LocalBusiness` — une page de ville n'invente jamais un bureau.
 *
 * Dans les deux cas, la preuve vient avant le discours : les réalisations de
 * la ville, puis les domaines qu'elles couvrent, puis les autres villes.
 */
export default async function ZonePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const zone = findZone(slug);
  if (!zone) notFound();

  const office = zone.officeCity
    ? offices.find((item) => item.city === zone.officeCity)
    : undefined;
  const cityProjects = projects.filter((project) => project.city === zone.name);
  const cityStudies = caseStudies.filter((study) => study.city === zone.name);
  const rows = cityProjects.filter((project) => !project.caseStudy);
  const count = cityProjects.length;
  const accent = zone.h1[1].replace("{count}", WORDS[count] ?? String(count));
  /* Les domaines réellement livrés ici — pas la liste complète. */
  const delivered = [...new Set(cityProjects.map((project) => project.category))]
    .map((category) => serviceForCategory(category))
    .filter((service) => service !== undefined);
  const otherZones = zones.filter((item) => item.slug !== zone.slug);
  const mapsUrl = office ? officeMapsUrl(office) : undefined;

  return (
    <>
      {office ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(officeJsonLd(office)) }}
        />
      ) : null}

      <PageHero
        breadcrumb={[
          { label: "Zones d'intervention", href: "/zones" },
          { label: zone.name },
        ]}
        eyebrow={office ? `${office.role} · ${zone.province}` : zone.province}
        title={
          <>
            {zone.h1[0].replace(" :", " :")}{" "}
            <span className="text-brand-600">{accent}</span>
          </>
        }
        lead={zone.lead}
        image={{
          src: zone.image,
          alt: zone.imageAlt,
          position: zone.imagePosition,
          /* Une installation réelle de la ville, ou l'équipe : ça se montre. */
          mobile: "band",
        }}
        actions={
          <>
            <Button className="group" asChild>
              <Link href={contactHref()}>
                Demander un audit gratuit
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button variant="link" asChild>
              <Link href="#realisations">{`Nos réalisations à ${zone.name}`}</Link>
            </Button>
          </>
        }
      />

      {/* Le bureau ou l'équipe — ce qui fait de cette page une page locale */}
      <Section className="bg-white">
        <div className="container grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              rule
              eyebrow={office ? "Le bureau" : "Sur place"}
              title={
                office
                  ? `Notre ${office.role.toLowerCase()} de ${zone.name}.`
                  : `Comment nous intervenons à ${zone.name}.`
              }
            />
            <Reveal delay={0.1}>
              <ul className="mt-8 space-y-4">
                {zone.localFacts.map((fact) => (
                  <li key={fact} className="flex items-start gap-3">
                    <Check className="mt-[3px] size-4 shrink-0 text-solar-600" strokeWidth={2.5} aria-hidden="true" />
                    <span className="text-[15px] leading-relaxed text-slate-700">{fact}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7 lg:p-8">
              {office ? (
                <>
                  <p className="flex items-start gap-3 text-[15px] text-slate-800">
                    <MapPin className="mt-0.5 size-5 shrink-0 text-brand-600" aria-hidden="true" />
                    <span>
                      <span className="block font-semibold text-slate-900">{office.street}</span>
                      <span className="text-slate-600">{`${office.city}, ${office.region}`}</span>
                    </span>
                  </p>
                  <p className="mt-4 flex items-start gap-3 text-[15px] text-slate-700">
                    <Clock className="mt-0.5 size-5 shrink-0 text-brand-600" aria-hidden="true" />
                    {`Lundi – samedi, 8 h – 17 h (heure de ${zone.name})`}
                  </p>
                </>
              ) : (
                <p className="text-[15px] leading-relaxed text-slate-700">
                  {`Pas de bureau ouvert au public à ${zone.name} : le numéro et l'adresse email sont les mêmes partout.`}
                </p>
              )}
              <p className="mt-4 flex items-center gap-3 text-[15px]">
                <Phone className="size-5 shrink-0 text-brand-600" aria-hidden="true" />
                <a href={`tel:${site.phone}`} className="font-semibold text-slate-900 hover:text-brand-700">
                  {site.phoneDisplay}
                </a>
              </p>
              <p className="mt-3 flex items-center gap-3 text-[15px]">
                <Mail className="size-5 shrink-0 text-brand-600" aria-hidden="true" />
                <a href={`mailto:${site.email}`} className="text-slate-700 hover:text-brand-700">
                  {site.email}
                </a>
              </p>
              <div className="mt-6 flex flex-wrap gap-3 border-t border-dashed border-slate-200 pt-6">
                <Button variant="neutral" size="sm" asChild>
                  <a href={buildWhatsAppLink()} target="_blank" rel="noopener noreferrer">
                    <WhatsAppIcon className="size-4 text-[#25D366]" />
                    WhatsApp
                  </a>
                </Button>
                {mapsUrl ? (
                  <Button variant="neutral" size="sm" asChild>
                    <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                      <MapPin className="size-4 text-brand-600" />
                      Ouvrir dans Maps
                    </a>
                  </Button>
                ) : null}
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* La preuve — ce qui a été livré dans cette ville */}
      <Section id="realisations" className="relative isolate scroll-mt-24 bg-surface-cool">
        <Glow variant="cool" corner="bottom-right" />
        <div className="container relative">
          <SectionHeading
            rule
            eyebrow="Ce que nous avons livré"
            title={`Nos réalisations à ${zone.name}.`}
            lead={`${count} réalisation${count > 1 ? "s" : ""} documentée${count > 1 ? "s" : ""}, avec leur client.`}
          />
          {cityStudies.length > 0 ? (
            <Stagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {cityStudies.map((study) => (
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
                  key={`${project.title}-${project.client}`}
                  className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                >
                  <span className="block text-[15px] font-semibold text-slate-900">{project.title}</span>
                  <span className="shrink-0 text-sm text-slate-500">{project.client}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </Section>

      {/* Les domaines livrés ici, puis les autres villes */}
      <Section className="bg-white">
        <div className="container grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading rule size="block" eyebrow="Nos domaines" title={`Ce que nous avons fait à ${zone.name}.`} />
            <ul className="mt-6 space-y-2">
              {delivered.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={serviceHref(service.slug)}
                    className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-brand-50"
                  >
                    <service.icon className="size-5 shrink-0 text-brand-600" strokeWidth={1.8} aria-hidden="true" />
                    <span className="text-[15px] font-semibold text-slate-900">{service.title}</span>
                    <ArrowRight className="ml-auto size-4 text-brand-600 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/services"
              className="mt-4 inline-flex items-center gap-2 px-3 text-sm font-semibold text-brand-700 underline-offset-4 hover:underline"
            >
              Nos six expertises
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <div>
            <SectionHeading rule size="block" eyebrow="Ailleurs en RDC" title="Nos autres zones d'intervention." />
            <ul className="mt-6 space-y-2">
              {otherZones.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={zoneHref(item.slug)}
                    className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-brand-50"
                  >
                    <MapPin className="size-5 shrink-0 text-solar-600" aria-hidden="true" />
                    <span className="text-[15px] font-semibold text-slate-900">{`Installation solaire à ${item.name}`}</span>
                    {item.province !== item.name ? (
                      <span className="text-sm text-slate-500">{item.province}</span>
                    ) : null}
                    <ArrowRight className="ml-auto size-4 text-brand-600 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/zones"
              className="mt-4 inline-flex items-center gap-2 px-3 text-sm font-semibold text-brand-700 underline-offset-4 hover:underline"
            >
              Toutes nos zones, et partout ailleurs en RDC
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
