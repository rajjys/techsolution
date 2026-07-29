import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Info, PackageCheck, ShieldCheck, Truck } from "lucide-react";

import { CtaPanel } from "@/components/cta-panel";
import { Reveal } from "@/components/motion";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/section";
import { KitsCatalogue } from "@/components/products/kits-catalogue";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Kits solaires & Catalogue",
  description:
    "Kits solaires hybrides clés en main Tech Solution RDC : de 650 Va à 30 kVA triphasé. Onduleurs hybrides, batteries lithium et panneaux dimensionnés — pour maisons, commerces, hôtels et sites industriels.",
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
        eyebrow="Kits solaires"
        title={
          <>
            Des kits solaires hybrides{" "}
            <span className="bg-gradient-to-r from-solar-500 to-solar-400 bg-clip-text text-transparent">
              clés en main
            </span>
          </>
        }
        lead="De 650 Va à 30 kVA triphasé : onduleurs hybrides, batteries lithium et panneaux, dimensionnés pour vos charges réelles — de la maison au site industriel."
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
            <KitsCatalogue />
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-14 flex flex-col items-start justify-between gap-6 rounded-2xl border border-navy-100 bg-navy-50/60 p-7 md:flex-row md:items-center">
              <div className="flex items-start gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-navy-950">
                  <Info className="size-5 text-solar-500" />
                </span>
                <div>
                  <h2 className="font-display text-base font-bold text-slate-900">
                    Compositions types — ajustables à votre site
                  </h2>
                  <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-slate-600">
                    Ces kits sont nos configurations les plus déployées. La
                    composition exacte est confirmée après l&apos;audit gratuit
                    de votre site : charges, autonomie souhaitée et contraintes
                    d&apos;implantation.
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
        title="Besoin d'une configuration sur mesure ?"
        lead="Au-delà des kits standards, nous concevons des centrales hybrides et parcs batteries dimensionnés exactement pour votre site — et assurons l'installation partout en RDC."
      />
    </>
  );
}
