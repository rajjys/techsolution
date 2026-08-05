import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  PackageCheck,
  Ruler,
  ShieldCheck,
  Truck,
} from "lucide-react";

import { Glow } from "@/components/glow";
import { Reveal } from "@/components/motion";
import { PageHero } from "@/components/page-hero";
import { Section, SectionHeading } from "@/components/section";
import { KitsTable } from "@/components/products/kits-table";
import { PowerLadder } from "@/components/products/power-ladder";
import { Button } from "@/components/ui/button";
import { kits } from "@/lib/data/kits";

export const metadata: Metadata = {
  title: "Kits solaires & Catalogue",
  description:
    "Kits solaires hybrides: de 650 Va à 30 kVA triphasé. Onduleurs hybrides, batteries lithium et panneaux dimensionnés",
  alternates: { canonical: "/produits" },
};

const commitments = [
  {
    icon: ShieldCheck,
    title: "Équipements certifiés",
    description: "Marques éprouvées, conformes aux normes internationales.",
  },
  {
    icon: PackageCheck,
    title: "Dimensionnement inclus",
    description: "Chaque kit est validé par l'audit gratuit de votre site.",
  },
  {
    icon: Truck,
    title: "Livraison & installation",
    description: "Pose par nos techniciens, partout en RDC.",
  },
];

export default function ProduitsPage() {
  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Produits" }]}
        eyebrow="Kits solaires"
        title={
          <>
            De la lampe qui reste allumée à{" "}
            <span className="text-brand-600">l&apos;établissement entier.</span>
          </>
        }
        lead={`${kits.length} kits hybrides clés en main, de 650 Va à 30 kVA triphasé. Situez-vous sur l'échelle : la composition suit.`}
      >
        <Reveal mode="mount" delay={0.15}>
          <div className="mt-9 grid gap-4 sm:grid-cols-3">
            {commitments.map((commitment) => (
              <div
                key={commitment.title}
                className="flex items-start gap-3.5 rounded-2xl border border-slate-200 bg-white p-5 shadow-card"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-100/60">
                  <commitment.icon className="size-5 text-brand-600" />
                </span>
                <span>
                  <span className="block text-sm font-bold text-slate-900">
                    {commitment.title}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-slate-600">
                    {commitment.description}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </PageHero>

      {/* L'échelle — on se situe, puis on affine cran par cran */}
      <Section className="relative isolate bg-surface-cool-deep">
        <Glow variant="cool-deep" corner="bottom-right" />
        <div className="container relative">
          <SectionHeading
            align="center"
            eyebrow="Trouvez votre palier"
            title="Une seule échelle, du foyer à l'usine."
            lead="Repérez d'abord la zone qui vous correspond, puis avancez d'un cran : chaque palier affiche ce qu'il fait tourner et ce qu'il contient."
          />

          <div className="mt-12 lg:mt-16">
            <PowerLadder />
          </div>
        </div>
      </Section>

      {/* Le comparatif — l'échelle fait choisir, le tableau fait vérifier */}
      <Section className="bg-white">
        <div className="container">
          <SectionHeading
            rule
            eyebrow="Comparatif complet"
            title="Les neuf paliers, côte à côte."
            lead="Les compositions types de notre catalogue. La composition exacte est confirmée après l'audit gratuit de votre site."
          />

          <Reveal delay={0.1} className="mt-10 lg:mt-12">
            <KitsTable />
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-12 flex flex-col items-start gap-6 rounded-2xl border border-brand-100 bg-brand-50/60 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
              <div className="flex items-start gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-950">
                  <Ruler className="size-5 text-solar-400" />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                    Aucun palier ne correspond ?
                  </h2>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600">
                    Centrales hybrides, parcs batteries, triphasé sur mesure :
                    nous dimensionnons hors catalogue à partir de vos charges
                    réelles, de l&apos;autonomie visée et de vos contraintes
                    d&apos;implantation.
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
    </>
  );
}
