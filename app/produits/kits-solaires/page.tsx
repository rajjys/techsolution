import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Download, Ruler } from "lucide-react";

import { Reveal } from "@/components/motion";
import { PageHero } from "@/components/page-hero";
import { Section, SectionHeading } from "@/components/section";
import { KitCommitments } from "@/components/products/kit-commitments";
import { KitsExplorer } from "@/components/products/kits-explorer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { kits } from "@/lib/data/kits";
import { findProductCategory } from "@/lib/data/products";
import { faqs } from "@/lib/data/services";
import { contactHref, serviceHref } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

/*
 * La gamme « kits solaires » — ce qui était /produits jusqu'en octobre 2026.
 * /produits est devenu le catalogue, qui accueillera les autres gammes
 * (batteries portables…) ; chaque kit a désormais sa fiche en dessous.
 */
const category = findProductCategory("kits-solaires")!;

export const metadata: Metadata = pageMetadata({
  path: "/produits/kits-solaires",
  title: "Kits solaires hybrides — 650 VA à 30 kVA",
  description:
    "Neuf kits hybrides clés en main, du foyer à l’usine : onduleur, batteries lithium LiFePO₄ et panneaux, dimensionnés après audit. Pose incluse en RDC.",
});

/**
 * Bornes de l'échelle, lues aux extrémités de `kits` — le tableau est ordonné
 * par puissance croissante. Écrites en dur, elles auraient survécu à l'ajout
 * d'un palier sans que personne ne s'en aperçoive.
 */
const powerRange = `de ${kits[0].power} à ${kits[kits.length - 1].power} ${kits[kits.length - 1].phase.toLowerCase()}`;

export default function KitsSolairesPage() {
  return (
    <>
      <PageHero
        compact
        breadcrumb={[
          { label: "Produits", href: "/produits" },
          { label: category.name },
        ]}
        eyebrow="Kits solaires"
        title={
          <>
            Kits solaires hybrides,{" "}
            <span className="text-brand-600">du foyer à l&apos;usine.</span>
          </>
        }
        lead={`Choisissez ce que vous devez alimenter — quelques lampes, une villa, une clinique, une usine. L'échelle vous place sur le bon kit, ${powerRange}, et en détaille la composition.`}
        image={{
          src: "/photos/produits-onduleur-batterie.webp",
          alt: "Onduleur hybride et batterie lithium avant installation",
          position: "50% 52%",
          /*
           * Vraies personnes, vrai produit : elle mérite d'être vue sur
           * mobile aussi, en bande sous le texte.
           */
          mobile: "band",
        }}
        actions={
          <>
            <Button className="group" asChild>
              <Link href={contactHref({ need: "kit" })}>
                Demander un devis
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button variant="neutral" asChild>
              <a href={site.fardeUrl} download>
                <Download className="size-4 text-brand-600" />
                Télécharger le catalogue
              </a>
            </Button>
          </>
        }
      />

      <KitsExplorer />

      {/* Ce qui accompagne chaque kit, puis le hors-catalogue */}
      <KitCommitments>
        <Reveal delay={0.15}>
          <div className="mt-14 flex flex-col items-start gap-6 rounded-2xl border border-brand-100 bg-white p-6 shadow-card sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
            <div className="flex items-start gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-950">
                <Ruler className="size-5 text-solar-400" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
                  Aucun palier ne correspond ?
                </h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600">
                  Systèmes solaires hybrides, parcs batteries, triphasé sur mesure :
                  nous dimensionnons hors catalogue à partir de vos charges
                  réelles et de vos contraintes d&apos;implantation.
                </p>
              </div>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4 lg:shrink-0">
              <Button asChild>
                <Link href={contactHref({ need: "kit" })}>Planifier mon audit</Link>
              </Button>
              <Button variant="outline-strong" className="group" asChild>
                <Link href={serviceHref("energie-solaire")}>
                  Notre expertise solaire
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </KitCommitments>

      {/* Les dernières questions avant de s'engager */}
      <Section className="bg-white">
        <div className="container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              rule
              eyebrow="Questions fréquentes"
              title="Encore une hésitation ?"
              lead="Les questions qu'on nous pose le plus souvent avant de commander. Pour les autres, notre équipe répond sous 24 h ouvrées."
            />
            <Reveal delay={0.15}>
              <Button className="group mt-8" asChild>
                <Link href={contactHref({ need: "kit" })}>
                  Poser ma question
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </Button>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={faq.question} value={`faq-${index}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
