import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Info, PackageCheck, ShieldCheck, Truck } from "lucide-react";

import { CtaPanel } from "@/components/cta-panel";
import { Reveal } from "@/components/motion";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/section";
import { Catalogue } from "@/components/products/catalogue";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Produits & Catalogue",
  description:
    "Catalogue d'équipements industriels Tech Solution RDC : panneaux solaires monocristallins, onduleurs hybrides, batteries lithium LiFePO₄, protection, distribution et éclairage public solaire.",
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
    description: "Chaque équipement est validé par l'étude de votre site.",
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
        eyebrow="Produits & Catalogue"
        title={
          <>
            Des équipements industriels{" "}
            <span className="bg-gradient-to-r from-solar-500 to-solar-400 bg-clip-text text-transparent">
              fiables et garantis
            </span>
          </>
        }
        lead="Panneaux, onduleurs hybrides, batteries lithium, protection et distribution : la sélection Tech Solution, dimensionnée pour vos charges réelles."
      >
        <Reveal mode="mount" delay={0.15}>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {commitments.map((commitment) => (
              <div
                key={commitment.title}
                className="flex items-start gap-3.5 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-solar-500/15">
                  <commitment.icon className="size-5 text-solar-500" />
                </span>
                <span>
                  <span className="block text-sm font-bold text-white">
                    {commitment.title}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-navy-100/75">
                    {commitment.description}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </PageHero>

      <Section className="bg-white">
        <div className="container">
          <Reveal>
            <Catalogue />
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-14 flex flex-col items-start justify-between gap-6 rounded-2xl border border-navy-100 bg-navy-50/60 p-7 md:flex-row md:items-center">
              <div className="flex items-start gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-navy-950">
                  <Info className="size-5 text-solar-500" />
                </span>
                <div>
                  <h2 className="font-display text-base font-bold text-slate-900">
                    Catalogue indicatif — configurations sur mesure
                  </h2>
                  <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-slate-600">
                    Les capacités et références exactes sont confirmées après
                    l&apos;audit gratuit de votre site : charges, autonomie
                    souhaitée et contraintes d&apos;implantation.
                  </p>
                </div>
              </div>
              <Button asChild className="shrink-0">
                <Link href="/contact">
                  Planifier mon audit
                  <ArrowRight />
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </Section>

      <CtaPanel
        title="Besoin d'une configuration complète ?"
        lead="Kits solaires professionnels, parcs batteries, armoires de distribution : nous assemblons la solution exacte pour votre site et assurons son installation."
      />
    </>
  );
}
