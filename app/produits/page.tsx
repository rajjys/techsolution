import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  PackageCheck,
  Ruler,
  ShieldCheck,
  Truck,
  Wrench,
} from "lucide-react";

import { Glow } from "@/components/glow";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { PageHero } from "@/components/page-hero";
import { Section, SectionHeading } from "@/components/section";
import { KitsExplorer } from "@/components/products/kits-explorer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { kits } from "@/lib/data/kits";
import { faqs } from "@/lib/data/services";

export const metadata: Metadata = {
  title: "Kits solaires & Catalogue",
  description:
    "Kits solaires hybrides: de 650 Va à 30 kVA triphasé. Onduleurs hybrides, batteries lithium et panneaux dimensionnés",
  alternates: { canonical: "/produits" },
};

/** Ce qui accompagne chaque kit — vaut pour les neuf, d'où la place ici. */
const commitments = [
  {
    icon: ShieldCheck,
    title: "Équipements certifiés",
    text: "Onduleurs hybrides, batteries lithium LiFePO₄ et panneaux monocristallins de marques éprouvées.",
  },
  {
    icon: PackageCheck,
    title: "Dimensionnement inclus",
    text: "La composition annoncée est un point de départ : elle est ajustée après l'audit de charge de votre site.",
  },
  {
    icon: Truck,
    title: "Livraison & installation",
    text: "Acheminement et pose par nos propres techniciens, dans les 26 provinces.",
  },
  {
    icon: Wrench,
    title: "Garantie & maintenance",
    text: "Un an renouvelable sur les kits, et un contrat d'entretien planifié si vous le souhaitez.",
  },
];

export default function ProduitsPage() {
  return (
    <>
      <PageHero
        compact
        breadcrumb={[{ label: "Produits" }]}
        eyebrow="Kits solaires"
        title={
          <>
            De la lampe qui reste allumée à{" "}
            <span className="text-brand-600">l&apos;établissement entier.</span>
          </>
        }
        lead={`${kits.length} kits hybrides clés en main, de 650 Va à 30 kVA triphasé. Situez-vous sur l'échelle : la composition suit.`}
      />

      <KitsExplorer />

      {/* Ce qui accompagne chaque kit — même grammaire que « Ce que nous offrons » */}
      <Section className="relative isolate bg-surface-cool">
        <Glow variant="cool" corner="bottom-left" />
        <div className="container relative">
          <SectionHeading
            align="center"
            eyebrow="Compris dans chaque kit"
            title="Le prix d'un kit n'est pas celui d'un carton."
          />

          <Stagger className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-8 lg:mt-16 lg:grid-cols-4 lg:gap-y-0 lg:divide-x lg:divide-slate-300/70">
            {commitments.map((item) => (
              <StaggerItem key={item.title} className="lg:px-6">
                <div className="flex flex-col items-center text-center">
                  <span className="flex size-14 items-center justify-center rounded-2xl bg-white shadow-card sm:size-16">
                    <item.icon
                      className="size-7 text-brand-600 sm:size-8"
                      strokeWidth={1.5}
                    />
                  </span>
                  <h3 className="mt-5 text-base font-bold text-slate-900 lg:text-lg">
                    {item.title}
                  </h3>
                  <p className="mt-2 max-w-[17rem] text-sm leading-relaxed text-slate-600">
                    {item.text}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

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
                    Centrales hybrides, parcs batteries, triphasé sur mesure :
                    nous dimensionnons hors catalogue à partir de vos charges
                    réelles et de vos contraintes d&apos;implantation.
                  </p>
                </div>
              </div>

              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4 lg:shrink-0">
                <Button asChild>
                  <Link href="/contact">Planifier mon audit</Link>
                </Button>
                <Button variant="outline-ember" className="group" asChild>
                  <Link href="/services#energie-solaire">
                    Notre expertise solaire
                    <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

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
                <Link href="/contact">
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
