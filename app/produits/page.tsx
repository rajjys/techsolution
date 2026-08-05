import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Info, PackageCheck, ShieldCheck, Truck } from "lucide-react";

import { Reveal } from "@/components/motion";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/section";
import { KitsCatalogue } from "@/components/products/kits-catalogue";
import { Button } from "@/components/ui/button";

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
        breadcrumb={[{ label: "Produits" }]}
        eyebrow="Kits solaires"
        title={
          <>
            Des kits solaires hybrides{" "}
            <span className="text-brand-600">
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

      <Section className="bg-white">
        <div className="container">
          <Reveal>
            <KitsCatalogue />
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-14 flex flex-col items-start justify-between gap-6 rounded-2xl border border-brand-100 bg-brand-50/60 p-7 md:flex-row md:items-center">
              <div className="flex items-start gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-950">
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
    </>
  );
}
