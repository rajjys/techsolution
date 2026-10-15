import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Fuel,
  MapPin,
  PackageCheck,
} from "lucide-react";

import { Glow } from "@/components/glow";
import { Reveal } from "@/components/motion";
import { CaseStudyCard } from "@/components/references/case-study-card";
import { BreadcrumbJsonLd } from "@/components/breadcrumb-json-ld";
import { Section, SectionHeading } from "@/components/section";
import { Button } from "@/components/ui/button";
import {
  caseStudies,
  relatedCaseStudies,
  type Evidence,
} from "@/lib/data/case-studies";
import { findKit } from "@/lib/data/kits";
import { zoneForCity } from "@/lib/data/locations";
import { serviceForCategory } from "@/lib/data/services";
import {
  caseStudyHref,
  contactHref,
  kitHref,
  serviceHref,
  zoneHref,
} from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { leader, site } from "@/lib/site";
import { cn, placeLabel } from "@/lib/utils";

/** Huit études préparées au build ; un ancien slug est redirigé avant d'arriver ici. */
export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = caseStudies.find((item) => item.slug === slug);
  if (!study) return {};
  return pageMetadata({
    path: caseStudyHref(study.slug),
    title: study.metaTitle,
    description: study.summary,
    /* Une réalisation racontée est un contenu daté, pas une page de site. */
    type: "article",
  });
}

const EVIDENCE_LABEL: Record<Evidence, string> = {
  installateur: "Donnée de l'installateur",
  client: "Selon le client",
};

function EvidenceChip({ evidence, onDark = false }: { evidence: Evidence; onDark?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10.5px] font-semibold",
        evidence === "installateur"
          ? onDark
            ? "bg-white/10 text-brand-100"
            : "bg-brand-50 text-brand-700"
          : onDark
            ? "bg-white/10 text-brand-200"
            : "bg-slate-100 text-slate-600",
      )}
    >
      {EVIDENCE_LABEL[evidence]}
    </span>
  );
}

/**
 * Une étude de cas — `/references/<client-intervention-ville>`.
 *
 * Elle répond en dix secondes à « ont-ils déjà fait ça, ici ? » — le lieu, le
 * client, l'échelle tiennent dans l'en-tête — puis donne le détail dans
 * l'ordre où on le cherche : le contexte, le problème, ce qui a été posé, ce
 * que ça alimente, ce qui a changé.
 *
 * Chaque chiffre porte sa provenance (`installateur` ou `client`), et ce qui
 * n'a pas été confirmé n'apparaît pas : pas d'autonomie en heures, pas
 * d'économie calculée, pas de « zéro coupure ». La page se termine sur ce
 * qui la relie au reste du site : le domaine, le kit le plus proche, les
 * réalisations voisines.
 */
export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = caseStudies.find((item) => item.slug === slug);
  if (!study) notFound();

  /* Le domaine dont relève cette réalisation — préqualifie /contact et
     porte le premier lien de sortie. */
  const relatedService = serviceForCategory(study.category);
  const relatedKit = study.relatedKit ? findKit(study.relatedKit.slug) : undefined;
  const related = relatedCaseStudies(study);
  /* La page de la ville, quand elle en a une (bureaux et villes prouvées). */
  const zone = zoneForCity(study.city);
  const url = `${site.url}${caseStudyHref(study.slug)}`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: study.h1,
    description: study.summary,
    image: [`${site.url}${study.image}`],
    datePublished: study.published,
    dateModified: study.revised,
    mainEntityOfPage: url,
    author: { "@type": "Organization", name: site.legalName, url: site.url },
    publisher: {
      "@type": "Organization",
      name: site.legalName,
      logo: { "@type": "ImageObject", url: `${site.url}/assets/logo-full-blue.png` },
    },
    contentLocation: {
      "@type": "Place",
      name: [study.district, study.city].filter(Boolean).join(", "),
      address: {
        "@type": "PostalAddress",
        addressLocality: study.city,
        addressRegion: study.province,
        addressCountry: "CD",
      },
    },
    /* Le client, quand il a accepté d'être nommé. */
    ...(study.clientNamed
      ? { about: { "@type": "Organization", name: study.client } }
      : {}),
  };

  const facts = [
    {
      label: "Lieu",
      value: [study.district, placeLabel(study.city, study.province)]
        .filter(Boolean)
        .join(" · "),
    },
    { label: "Secteur", value: study.sector },
    study.year ? { label: "Mise en service", value: String(study.year) } : null,
    study.spec ? { label: "Système", value: study.spec } : null,
  ].filter((fact): fact is { label: string; value: string } => Boolean(fact));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <BreadcrumbJsonLd
        trail={[
          { label: "Accueil", href: "/" },
          { label: "Références", href: "/references" },
          { label: study.title },
        ]}
      />

      {/* En-tête — le sombre est la couleur de la preuve */}
      <section className="relative isolate overflow-hidden bg-brand-950">
        <Glow variant="dark" corner="top-right" />
        <div className="container relative pb-12 pt-8 md:pb-16 md:pt-10">
          <nav aria-label="Fil d'Ariane">
            <ol className="flex flex-wrap items-center gap-1 text-xs font-medium text-brand-300">
              <li>
                <Link href="/" className="rounded transition-colors hover:text-white">
                  Accueil
                </Link>
              </li>
              <li className="flex items-center gap-1">
                <ChevronRight className="size-3.5 shrink-0 text-brand-400" aria-hidden="true" />
                <Link href="/references" className="rounded transition-colors hover:text-white">
                  Références
                </Link>
              </li>
              <li className="flex min-w-0 items-center gap-1">
                <ChevronRight className="size-3.5 shrink-0 text-brand-400" aria-hidden="true" />
                <span className="truncate font-semibold text-brand-100">{study.title}</span>
              </li>
            </ol>
          </nav>

          <Reveal mode="mount" className="mt-8 max-w-4xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-solar-500 px-3 py-1 text-xs font-bold text-slate-900">
                {study.category}
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-100">
                <MapPin className="size-4 text-solar-500" aria-hidden="true" />
                {placeLabel(study.city, study.province)}
              </span>
            </div>
            <h1 className="mt-4 text-balance text-3xl font-bold leading-[1.12] text-white md:text-5xl">
              {study.h1}
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-brand-100/85">
              {study.summary}
            </p>
          </Reveal>

          {/* Les repères — lieu, secteur, année, échelle */}
          <dl className="mt-10 grid gap-x-8 gap-y-6 border-t border-white/10 pt-8 sm:grid-cols-2 lg:grid-cols-4">
            {facts.map((fact) => (
              <div key={fact.label} className="min-w-0">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-300">
                  {fact.label}
                </dt>
                <dd className="mt-1.5 text-[15px] font-semibold text-white">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <Section className="bg-white">
        <div className="container grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div className="min-w-0">
            <Reveal className="overflow-hidden rounded-3xl shadow-soft ring-1 ring-brand-950/10">
              <Image
                src={study.image}
                alt={study.imageAlt}
                width={1200}
                height={800}
                priority
                sizes="(max-width: 1024px) 100vw, 56vw"
                className="aspect-[3/2] h-auto w-full object-cover"
                style={study.imagePosition ? { objectPosition: study.imagePosition } : undefined}
              />
            </Reveal>

            <div className="mt-10 space-y-10">
              {study.context ? (
                <Reveal>
                  <h2 className="text-xl font-bold text-slate-900">Le contexte</h2>
                  <p className="mt-3 leading-relaxed text-slate-600">{study.context}</p>
                </Reveal>
              ) : null}

              <Reveal>
                <h2 className="text-xl font-bold text-slate-900">Le problème</h2>
                <p className="mt-3 leading-relaxed text-slate-600">{study.challenge}</p>
              </Reveal>

              <Reveal>
                <h2 className="text-xl font-bold text-slate-900">Ce que nous avons installé</h2>
                <p className="mt-3 leading-relaxed text-slate-600">{study.solution}</p>

                {study.specs ? (
                  <dl className="mt-6 divide-y divide-slate-100 border-y border-slate-100">
                    {study.specs.map((spec) => (
                      <div
                        key={spec.label}
                        className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:items-baseline sm:gap-4"
                      >
                        <dt className="text-sm text-slate-500">{spec.label}</dt>
                        <dd className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <span className="font-display text-xl font-bold tabular-nums text-slate-900">
                            {spec.value}
                          </span>
                          <span className="text-sm text-slate-600">{spec.meaning}</span>
                          <EvidenceChip evidence={spec.evidence} />
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
              </Reveal>

              {study.loads ? (
                <Reveal>
                  <h2 className="text-xl font-bold text-slate-900">Ce que le système alimente</h2>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                    {study.loads.map((load) => (
                      <li key={load} className="flex items-start gap-3">
                        <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-50">
                          <Check className="size-3.5 text-brand-600" strokeWidth={2.5} aria-hidden="true" />
                        </span>
                        <span className="text-[15px] text-slate-700">{load}</span>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ) : null}

              {study.gallery ? (
                <Reveal>
                  <h2 className="text-xl font-bold text-slate-900">Sur le chantier</h2>
                  <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4">
                    {study.gallery.map((photo) => (
                      <figure
                        key={photo.src}
                        className={cn(
                          "overflow-hidden rounded-2xl ring-1 ring-brand-950/10",
                          photo.wide ? "col-span-2 aspect-[16/9]" : "aspect-[4/5]",
                        )}
                      >
                        <Image
                          src={photo.src}
                          alt={photo.alt}
                          width={photo.width}
                          height={photo.height}
                          sizes={
                            photo.wide
                              ? "(max-width: 1024px) 100vw, 56vw"
                              : "(max-width: 1024px) 50vw, 28vw"
                          }
                          className="h-full w-full object-cover"
                          style={photo.position ? { objectPosition: photo.position } : undefined}
                        />
                      </figure>
                    ))}
                  </div>
                </Reveal>
              ) : null}
            </div>
          </div>

          {/* Ce qui a changé, puis l'appel */}
          <Reveal delay={0.15}>
            <div className="space-y-5 lg:sticky lg:top-28">
              {study.fuel ? (
                <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-card lg:p-8">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="inline-flex items-center gap-2 text-lg font-bold text-slate-900">
                      <Fuel className="size-5 text-brand-600" aria-hidden="true" />
                      Carburant du groupe
                    </h2>
                    <EvidenceChip evidence="client" />
                  </div>
                  <dl className="mt-5 grid grid-cols-2 divide-x divide-slate-200">
                    <div className="pr-4">
                      <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                        Avant
                      </dt>
                      <dd className="mt-1 font-display text-xl font-bold tabular-nums text-slate-900">
                        {study.fuel.before}
                      </dd>
                    </div>
                    <div className="pl-4">
                      <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                        Après
                      </dt>
                      {study.fuel.after ? (
                        <dd className="mt-1 font-display text-xl font-bold tabular-nums text-brand-700">
                          {study.fuel.after}
                        </dd>
                      ) : (
                        <dd className="mt-1.5 text-sm font-medium leading-snug text-slate-500">
                          Pas encore chiffré
                        </dd>
                      )}
                    </div>
                  </dl>
                  <p className="mt-4 border-t border-dashed border-slate-200 pt-4 text-[13px] leading-relaxed text-slate-500">
                    {study.fuel.note}
                  </p>
                </div>
              ) : null}

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7 lg:p-8">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg font-bold text-slate-900">Résultats</h2>
                  {study.resultsReported ? <EvidenceChip evidence="client" /> : null}
                </div>
                <ul className="mt-5 space-y-4">
                  {study.results.map((result) => (
                    <li key={result} className="flex items-start gap-3">
                      <Check className="mt-0.5 size-5 shrink-0 text-brand-600" aria-hidden="true" />
                      <span className="text-sm font-medium text-slate-700">{result}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 border-t border-slate-200 pt-6">
                  <p className="text-sm text-slate-600">Un projet similaire en vue ?</p>
                  {/*
                    Préqualifié par la catégorie de la réalisation : la fiche
                    d'un système solaire ouvre l'entonnoir sur le solaire. Le
                    lien est porté par la donnée (Service.projectCategory).
                  */}
                  <Button block className="mt-4" asChild>
                    <Link
                      href={
                        relatedService
                          ? contactHref({ service: relatedService.slug })
                          : contactHref()
                      }
                    >
                      Demander une étude
                      <ArrowRight />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Ce qui relie cette réalisation au reste du site */}
      <Section className="relative isolate bg-surface-cool">
        <Glow variant="cool" corner="bottom-right" />
        <div className="container relative">
          <SectionHeading
            rule
            eyebrow="Pour aller plus loin"
            title="Le domaine, le matériel, les chantiers voisins."
          />

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {relatedService ? (
              <Link
                href={serviceHref(relatedService.slug)}
                className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-soft hover:ring-4 hover:ring-brand-200 hover:ring-offset-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-50">
                  <relatedService.icon className="size-5 text-brand-600" strokeWidth={1.8} aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                    Le domaine
                  </span>
                  <span className="mt-1 block text-lg font-bold text-slate-900">
                    {relatedService.title}
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-slate-600">
                    {relatedService.outcome}
                  </span>
                </span>
              </Link>
            ) : null}

            {relatedKit && study.relatedKit ? (
              <Link
                href={kitHref(relatedKit)}
                className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-soft hover:ring-4 hover:ring-brand-200 hover:ring-offset-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-50">
                  <PackageCheck className="size-5 text-brand-600" strokeWidth={1.8} aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                    {study.relatedKit.relation === "installed"
                      ? "Le kit installé"
                      : "Le kit du catalogue le plus proche"}
                  </span>
                  <span className="mt-1 block text-lg font-bold text-slate-900">{relatedKit.name}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-slate-600">
                    {`${relatedKit.specs.inverter} · ${relatedKit.specs.battery} · ${relatedKit.specs.panels} — ${relatedKit.outcome}`}
                  </span>
                </span>
              </Link>
            ) : (
              <Link
                href="/references"
                className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-soft hover:ring-4 hover:ring-brand-200 hover:ring-offset-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-50">
                  <MapPin className="size-5 text-brand-600" strokeWidth={1.8} aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                    Toutes nos réalisations
                  </span>
                  <span className="mt-1 block text-lg font-bold text-slate-900">
                    Le relevé complet, client et lieu à l&apos;appui
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-slate-600">
                    De Bunia à Kinshasa, chaque installation documentée.
                  </span>
                </span>
              </Link>
            )}
            {zone ? (
              <Link
                href={zoneHref(zone.slug)}
                className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-soft hover:ring-4 hover:ring-brand-200 hover:ring-offset-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-50">
                  <MapPin className="size-5 text-brand-600" strokeWidth={1.8} aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                    La ville
                  </span>
                  <span className="mt-1 block text-lg font-bold text-slate-900">
                    {`Installation solaire à ${zone.name}`}
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-slate-600">
                    {`Nos autres réalisations à ${zone.name}, et comment nous y intervenons.`}
                  </span>
                </span>
              </Link>
            ) : null}
          </div>

          <h2 className="mt-14 text-lg font-bold text-slate-900">D&apos;autres réalisations</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <CaseStudyCard key={item.slug} study={item} />
            ))}
          </div>

          {/* La signature — un nom derrière l'ingénierie (cf. /about) */}
          <Link
            href="/about"
            className="group mt-12 flex items-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-white/60 p-4 transition-colors hover:border-brand-300 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 sm:max-w-xl"
          >
            <Image
              src={leader.photoOnSite}
              alt=""
              width={56}
              height={56}
              sizes="56px"
              className="size-14 shrink-0 rounded-full object-cover object-[50%_22%]"
            />
            <span className="text-sm leading-relaxed text-slate-600">
              <span className="block font-semibold text-slate-900">
                {`${site.name} — ingénierie dirigée par ${leader.name}`}
              </span>
              {leader.role}
            </span>
            <ArrowRight className="ml-auto size-4 shrink-0 text-brand-600 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </Section>
    </>
  );
}
