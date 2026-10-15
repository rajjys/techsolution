import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BatteryCharging,
  Plug,
  SunMedium,
  Zap,
} from "lucide-react";

import { WhatsAppIcon } from "@/components/icons";
import { Reveal } from "@/components/motion";
import { PageHero } from "@/components/page-hero";
import { KitCommitments } from "@/components/products/kit-commitments";
import { Section, SectionHeading } from "@/components/section";
import { Button } from "@/components/ui/button";
import { caseStudies } from "@/lib/data/case-studies";
import { KitQuoteLink } from "@/components/products/kit-quote";
import {
  findKit,
  kitNeighbours,
  kitSegmentPhotos,
  kitSegments,
  kits,
  type Kit,
} from "@/lib/data/kits";
import { findProductCategory } from "@/lib/data/products";
import { caseStudyHref, kitHref, productCategoryHref } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { buildProductWhatsAppLink } from "@/lib/whatsapp";

/** Les neuf fiches sont préparées au build ; tout autre slug répond 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return kits.map((kit) => ({ slug: kit.slug }));
}

const category = findProductCategory("kits-solaires")!;

function segmentOf(kit: Kit) {
  return kitSegments.find((segment) => segment.id === kit.segment)!;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const kit = findKit(slug);
  if (!kit) return {};
  return pageMetadata({
    path: kitHref(kit),
    title: `${kit.name} — ${kit.tier}`,
    /* La composition d'abord : c'est ce qu'on compare d'un résultat à l'autre. */
    description: `${kit.inverter}, ${kit.battery}, ${kit.panels}. ${kit.outcome} Audit gratuit et pose incluse en RDC.`,
  });
}

const COMPOSITION = [
  { key: "inverter", icon: Zap, label: "Onduleur" },
  { key: "battery", icon: BatteryCharging, label: "Batterie" },
  { key: "panels", icon: SunMedium, label: "Panneaux" },
] as const;

/**
 * Fiche d'un kit — `/produits/kits-solaires/<slug>`.
 *
 * Elle répond, dans l'ordre, aux trois questions qu'on se pose devant un
 * kit : qu'y a-t-il dedans, que fait-il tourner, et est-ce le bon palier ?
 * La troisième est celle que le catalogue papier ne posait pas : les deux
 * paliers voisins sont proposés en bas, avec ce qu'ils changent.
 *
 * Aucun prix — décision du propriétaire, balisage compris (pas d'`Offer`).
 */
export default async function KitPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const kit = findKit(slug);
  /* Un ancien slug trouve son kit mais n'a pas de page : seul le slug
     courant est servi ici. */
  if (!kit || kit.slug !== slug) notFound();

  const segment = segmentOf(kit);
  const photo = kitSegmentPhotos[kit.segment];
  const { lower, higher } = kitNeighbours(kit);
  /* Les réalisations qui renvoient à ce kit — le lien va dans les deux sens. */
  const comparableStudies = caseStudies.filter(
    (study) => study.relatedKit?.slug === kit.slug,
  );
  const customExample = caseStudies.find((study) => study.beyondCatalogue);
  const powerAt = kit.name.indexOf(kit.power);
  const namePrefix = powerAt > 0 ? kit.name.slice(0, powerAt).trim() : kit.name;
  const nameAccent = powerAt > 0 ? kit.name.slice(powerAt) : "";

  /*
   * `Service`, et non `Product` — décision du 15 oct. 2026, sur une erreur
   * de la Search Console : « Either "offers", "review" or "aggregateRating"
   * should be specified ».
   *
   * Pour Google, un `Product` doit porter une offre, un avis ou une note. Or
   * une `Offer` exige un `price` (developers.google.com, « Product
   * snippet », màj du 8 sept. 2026) ; les prix ne sont pas publics, un
   * `price: 0` dirait que le kit est gratuit, et le site n'a aucun avis
   * client à baliser. Aucune des trois issues n'est honnête.
   *
   * `Service` est aussi le type exact : le kit se vend posé — dimensionnement,
   * pose et garantie compris, prix sur devis après audit (la section « Le
   * prix d'un kit n'est pas celui d'un carton »). `Service` n'a pas de
   * résultat enrichi chez Google, donc pas de champ exigé : le balisage reste
   * lisible par les moteurs et les assistants, sans erreur.
   *
   * Règle pour tout futur produit (batteries nomades…) : `Product` seulement
   * avec un prix public ou de vrais avis affichés sur la page — sinon rien.
   */
  const kitJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${site.url}${kitHref(kit)}#kit`,
    name: kit.name,
    serviceType: "Fourniture et installation d'un kit solaire hybride",
    category: category.name,
    description: `${kit.outcome} Composition type : ${kit.inverter}, ${kit.battery}, ${kit.panels}, raccordement ${kit.phase.toLowerCase()}. Dimensionnement, pose par nos techniciens et garantie d'un an renouvelable compris ; prix sur devis après l'audit de charge gratuit.`,
    url: `${site.url}${kitHref(kit)}`,
    image: `${site.url}${photo.src}`,
    provider: { "@type": "Organization", name: site.legalName, url: site.url },
    areaServed: { "@type": "Country", name: "République Démocratique du Congo" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(kitJsonLd) }}
      />

      <PageHero
        breadcrumb={[
          { label: "Produits", href: "/produits" },
          { label: category.shortName, href: productCategoryHref(category.slug) },
          { label: kit.name },
        ]}
        eyebrow={`${segment.label} · ${kit.tier}`}
        title={
          nameAccent ? (
            <>
              {namePrefix}{" "}
              <span className="text-brand-600">{nameAccent}</span>
            </>
          ) : (
            kit.name
          )
        }
        lead={`${kit.outcome} Composition type, ajustée à votre site après l'audit gratuit.`}
        image={{ ...photo, mobile: "hidden" }}
        actions={
          <>
            <Button className="group" asChild>
              <KitQuoteLink kitSlug={kit.slug}>
                Demander ce kit
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
              </KitQuoteLink>
            </Button>
            <Button variant="neutral" asChild>
              <a
                href={buildProductWhatsAppLink(kit.name)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon className="size-4 text-[#25D366]" />
                En parler sur WhatsApp
              </a>
            </Button>
          </>
        }
      >
        <Reveal mode="mount" delay={0.2}>
          {/* Les trois repères du kit, comme les chiffres de /references */}
          <dl className="mt-9 grid grid-cols-3 divide-x divide-brand-200">
            {COMPOSITION.map(({ key, label }, index) => (
              <div
                key={key}
                className={index === 0 ? "pr-3 sm:pr-4" : "px-3 last:pr-0 sm:px-6"}
              >
                {/* Une seule ligne par repère : « 48 × 550 W » passait sur
                    deux à 390 px. Le corps descend plutôt que de couper. */}
                <dd className="whitespace-nowrap font-display text-base font-bold tabular-nums text-slate-900 min-[400px]:text-xl sm:text-2xl">
                  {kit.specs[key]}
                </dd>
                <dt className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 sm:text-xs">
                  {label}
                </dt>
              </div>
            ))}
          </dl>
        </Reveal>
      </PageHero>

      {/* Composition et usages */}
      <Section className="bg-white">
        <div className="container grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading
              rule
              size="block"
              eyebrow="Composition"
              title="Ce que contient le kit."
            />
            <Reveal delay={0.1}>
              <dl className="mt-8 divide-y divide-slate-100 border-y border-slate-100">
                {COMPOSITION.map(({ key, icon: Icon, label }) => (
                  <div
                    key={key}
                    className="flex flex-col gap-0.5 py-4 sm:flex-row sm:items-baseline sm:gap-4"
                  >
                    <dt className="inline-flex shrink-0 items-center gap-2 text-sm text-slate-500 sm:w-40">
                      <Icon
                        className="size-4 shrink-0 text-solar-600"
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                      {label}
                    </dt>
                    <dd className="text-[15px] font-semibold text-slate-900">
                      {kit[key]}
                    </dd>
                  </div>
                ))}
                <div className="flex flex-col gap-0.5 py-4 sm:flex-row sm:items-baseline sm:gap-4">
                  <dt className="inline-flex shrink-0 items-center gap-2 text-sm text-slate-500 sm:w-40">
                    <Plug
                      className="size-4 shrink-0 text-solar-600"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                    Raccordement
                  </dt>
                  <dd className="text-[15px] font-semibold text-slate-900">
                    {kit.phase}
                  </dd>
                </div>
              </dl>
            </Reveal>
          </div>

          <div>
            <SectionHeading
              rule
              size="block"
              eyebrow="Usages"
              title="Ce qu'il fait tourner."
            />
            <Reveal delay={0.15}>
              <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                {kit.runs.map((load) => (
                  <li key={load.label} className="flex items-start gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-50">
                      <load.icon
                        className="size-[18px] text-brand-700"
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                    </span>
                    <span className="pt-2 text-[15px] leading-snug text-slate-700">
                      {load.detail ?? load.label}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 border-t border-dashed border-slate-200 pt-4 text-[13px] leading-relaxed text-slate-500">
                {`Simultanément et en continu, réseau coupé. Le détail du catalogue : ${kit.usage.toLowerCase()}`}
              </p>
            </Reveal>
          </div>
        </div>

        {/*
          L'appel au moment où l'on a fini de lire le kit — sinon il faut
          remonter jusqu'au hero pour le demander. La réserve sur la
          composition y prend place : c'est elle qui rend la demande sans
          risque.
        */}
        <div className="container mt-12">
          <Reveal>
            <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-7 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
              <div className="min-w-0">
                <p className="text-base font-bold text-slate-900">
                  {`Le ${kit.name}, ajusté à votre site.`}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">
                  Composition type du catalogue : elle est ajustée après
                  l&apos;audit de charge de votre site, gratuit et sans
                  engagement.
                </p>
              </div>
              {/* Une seule rangée sur téléphone, comme au pied de page :
                  l'appel prend la place, WhatsApp devient une icône. */}
              <div className="flex shrink-0 gap-3">
                <Button className="group flex-1 sm:flex-none" asChild>
                  <KitQuoteLink kitSlug={kit.slug}>
                    Demander ce kit
                    <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </KitQuoteLink>
                </Button>
                <Button variant="neutral" className="px-4 sm:px-7" asChild>
                  <a
                    href={buildProductWhatsAppLink(kit.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="En parler sur WhatsApp"
                  >
                    <WhatsAppIcon className="size-5 text-[#25D366] sm:size-4" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </a>
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      <KitCommitments />

      {/* Le bon palier ? — les deux voisins sur l'échelle */}
      <Section className="bg-white">
        <div className="container">
          <SectionHeading
            rule
            eyebrow="Le bon palier ?"
            title="Un cran en dessous, un cran au-dessus."
            lead="Si ce kit vous paraît trop juste ou trop large, ses voisins sur l'échelle le sont peut-être moins."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {[
              { neighbour: lower, label: "Plus léger", icon: ArrowDownRight },
              { neighbour: higher, label: "Plus puissant", icon: ArrowUpRight },
            ].map(({ neighbour, label, icon: Icon }) =>
              neighbour ? (
                <Reveal key={label} delay={0.1}>
                  <Link
                    href={kitHref(neighbour)}
                    className="group flex h-full items-start gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-soft hover:ring-4 hover:ring-brand-200 hover:ring-offset-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 sm:p-7"
                  >
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-50">
                      <Icon className="size-5 text-brand-600" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                        {label}
                      </span>
                      <span className="mt-1 block font-display text-2xl font-bold text-slate-900">
                        {neighbour.power}
                        <span className="ml-2 text-base font-semibold text-slate-500">
                          {neighbour.tier}
                        </span>
                      </span>
                      <span className="mt-1.5 block text-sm leading-relaxed text-slate-600">
                        {neighbour.outcome}
                      </span>
                    </span>
                  </Link>
                </Reveal>
              ) : (
                <Reveal key={label} delay={0.1}>
                  <div className="flex h-full flex-col justify-center gap-2 rounded-2xl border border-dashed border-slate-300 p-6 text-sm leading-relaxed text-slate-500 sm:p-7">
                    {higher ? (
                      "C'est le plus petit kit de la gamme."
                    ) : (
                      <>
                        <span>
                          C&apos;est le plus grand kit de la gamme — au-delà,
                          nous dimensionnons sur mesure.
                        </span>
                        {customExample ? (
                          <Link
                            href={caseStudyHref(customExample.slug)}
                            className="font-semibold text-brand-700 underline-offset-4 hover:underline"
                          >
                            {`Exemple : ${customExample.h1.charAt(0).toLowerCase()}${customExample.h1.slice(1)}`}
                          </Link>
                        ) : null}
                      </>
                    )}
                  </div>
                </Reveal>
              ),
            )}
          </div>
          {comparableStudies.length > 0 ? (
            <div className="mt-10">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                Sur le terrain, à ce palier
              </h3>
              <ul className="mt-4 grid gap-4 md:grid-cols-2">
                {comparableStudies.map((study) => (
                  <li key={study.slug}>
                    <Link
                      href={caseStudyHref(study.slug)}
                      className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-slate-50 p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-300 hover:bg-white hover:shadow-soft hover:ring-4 hover:ring-brand-200 hover:ring-offset-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                    >
                      <span className="text-[15px] font-bold text-slate-900">{study.h1}</span>
                      <span className="mt-1.5 text-sm leading-relaxed text-slate-600">
                        {/* « Comparable » : même palier, autre composition —
                            jamais présenté comme ce kit-là. */}
                        {`${study.spec ? `${study.spec} — ` : ""}${study.relatedKit?.relation === "installed" ? "ce kit, installé" : "une installation de puissance comparable"}.`}
                      </span>
                      <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
                        Voir l&apos;étude de cas
                        <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <Reveal delay={0.15}>
            <Link
              href={productCategoryHref(category.slug)}
              className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 underline-offset-4 hover:underline"
            >
              {`Comparer les ${kits.length} paliers côte à côte`}
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
