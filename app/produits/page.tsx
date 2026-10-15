import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Glow } from "@/components/glow";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { PageHero } from "@/components/page-hero";
import { KitLink } from "@/components/products/kit-link";
import { Section, SectionHeading } from "@/components/section";
import { Button } from "@/components/ui/button";
import { caseStudies } from "@/lib/data/case-studies";
import { kitSegments, kits, kitsForSegment } from "@/lib/data/kits";
import { productCategories } from "@/lib/data/products";
import { caseStudyHref, contactHref, productCategoryHref } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/produits",
  title: "Produits solaires — kits hybrides et sur mesure",
  description: `Kits solaires hybrides de ${kits[0].power} à ${kits[kits.length - 1].power} pour la maison, le bureau et l’établissement, et systèmes sur mesure au-delà. Audit gratuit, pose incluse en RDC.`,
});

/**
 * Le catalogue — l'entrée de toutes les gammes.
 *
 * Il n'y en a qu'une aujourd'hui, les kits solaires ; les batteries portables
 * et autres accessoires viendront s'y ajouter, chacune avec sa page de gamme
 * (`/produits/<gamme>`) et ses fiches en dessous. D'où un catalogue qui ne
 * recopie pas la gamme : il ne montre ni l'échelle ni le comparatif, il
 * oriente — par usage d'abord, parce qu'on sait ce qu'on veut alimenter bien
 * avant de savoir combien de kVA il faut.
 *
 * Le foyer passe en premier. Le site parlait surtout aux institutions, et des
 * particuliers l'ont fait remarquer : la première colonne est la leur.
 */
export default function ProduitsPage() {
  const kitsCategory = productCategories[0];
  /* La preuve du « sur mesure » : un système au-delà du catalogue. */
  const customExample = caseStudies.find((study) => study.beyondCatalogue);

  return (
    <>
      <PageHero
        compact
        breadcrumb={[{ label: "Produits" }]}
        eyebrow="Produits"
        title={
          <>
            Kits solaires et systèmes sur mesure,{" "}
            <span className="text-brand-600">
              du foyer à l&apos;établissement.
            </span>
          </>
        }
        lead="Partez de ce que vous devez alimenter — une maison, un bureau, un établissement entier. Chaque kit a sa fiche ; au-delà du plus grand, nous dimensionnons sur mesure."
        image={{
          src: "/photos/toiture-residence-duo.webp",
          alt: "Deux techniciens Tech Solution RDC sur la toiture d'une maison équipée de panneaux solaires",
          position: "50% 45%",
          /* Une maison et l'équipe : c'est la preuve que les foyers
             cherchaient, elle se montre aussi sur mobile. */
          mobile: "band",
        }}
      />

      {/* L'index — la teinte la plus soutenue de la page (§1, règle 8) */}
      <Section className="relative isolate bg-surface-cool-deep">
        <Glow variant="cool-deep" corner="bottom-right" />
        <div className="container relative">
          <SectionHeading
            rule
            eyebrow={kitsCategory.name}
            title="Choisissez d'abord ce que vous devez alimenter."
            lead={`${kits.length} paliers, de ${kits[0].power} à ${kits[kits.length - 1].power}. Chaque fiche détaille la composition, les appareils alimentés et le palier voisin.`}
          />

          <Stagger className="mt-10 grid gap-5 lg:mt-12 lg:grid-cols-3">
            {kitSegments.map((segment) => {
              const segmentKits = kitsForSegment(segment.id);
              return (
                <StaggerItem key={segment.id}>
                  <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-6">
                    <div className="flex items-center gap-3 border-b border-dashed border-slate-200 pb-4">
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-50">
                        <segment.icon
                          className="size-5 text-brand-600"
                          strokeWidth={1.8}
                          aria-hidden="true"
                        />
                      </span>
                      <div>
                        <h2 className="text-lg font-bold leading-tight text-slate-900">
                          {segment.label}
                        </h2>
                        <p className="text-[13px] text-slate-500">
                          {segment.detail}
                        </p>
                      </div>
                    </div>
                    <ul className="-mx-2.5 mt-3 flex-1 space-y-0.5">
                      {segmentKits.map((kit) => (
                        <li key={kit.slug}>
                          <KitLink kit={kit} />
                        </li>
                      ))}
                    </ul>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>

          <Reveal delay={0.1}>
            <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-xl text-sm leading-relaxed text-slate-600">
                Hésitant entre deux paliers ? L&apos;échelle et le comparatif
                les mettent côte à côte, composition comprise.
              </p>
              <Button variant="outline-strong" className="group" asChild>
                <Link href={productCategoryHref(kitsCategory.slug)}>
                  {`Comparer les ${kits.length} kits`}
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Hors catalogue — pleine largeur, l'image touche le bord (§1) */}
      <section className="relative isolate overflow-hidden bg-white">
        <div className="relative aspect-[4/3] w-full sm:aspect-[16/9] lg:absolute lg:inset-y-0 lg:right-0 lg:aspect-auto lg:w-1/2">
          <Image
            src="/photos/equipe-trois-techniciens.webp"
            alt="Trois techniciens Tech Solution RDC en tenue de chantier"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-[50%_30%]"
          />
        </div>
        <div className="container relative">
          <div className="grid lg:grid-cols-2">
            <div className="py-12 sm:py-16 lg:py-24 lg:pr-14 xl:pr-20">
              <SectionHeading
                rule
                eyebrow="Hors catalogue"
                title={`Au-delà de ${kits[kits.length - 1].power}, le système se conçoit pour votre site.`}
                lead="Hôtels, sites industriels, bâtiments publics : quand les charges dépassent le plus grand kit, nous partons de l'audit de votre site — puissance, stockage et triphasé compris."
              />
              <Reveal delay={0.1}>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
                  <Button className="group" asChild>
                    <Link href={contactHref({ service: "energie-solaire" })}>
                      Demander une étude
                      <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button variant="outline-strong" asChild>
                    <Link
                      href={
                        customExample
                          ? caseStudyHref(customExample.slug)
                          : "/references"
                      }
                    >
                      {customExample
                        ? `Exemple : ${customExample.client}`
                        : "Voir nos réalisations"}
                    </Link>
                  </Button>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
