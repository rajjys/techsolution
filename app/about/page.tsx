import type { Metadata } from "next";
import { Eye, Target } from "lucide-react";

import { CtaPanel } from "@/components/cta-panel";
import { Engagement } from "@/components/home/engagement";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { PageHero } from "@/components/page-hero";
import { Section, SectionHeading } from "@/components/section";
import { values } from "@/lib/data/clients";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Tech Solution RDC — notre mission, notre vision et nos valeurs. Une ingénierie au service de la révolution énergétique en République Démocratique du Congo.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="À propos"
        title={
          <>
            Une ingénierie au service de la{" "}
            <span className="bg-gradient-to-r from-solar-500 to-solar-400 bg-clip-text text-transparent">
              révolution énergétique
            </span>
          </>
        }
        lead={`Depuis ${site.foundedYear}, Tech Solution conçoit et déploie des solutions solaires et techniques fiables à travers la RDC — avec une exigence : des installations qui durent.`}
      />

      {/* Vision & Mission */}
      <Section className="bg-white">
        <div className="container grid gap-6 md:grid-cols-2 lg:gap-8">
          <Reveal className="rounded-3xl border border-slate-200 bg-slate-50 p-8 lg:p-10">
            <span className="flex size-12 items-center justify-center rounded-xl bg-navy-950">
              <Eye className="size-6 text-solar-500" />
            </span>
            <h2 className="mt-6 text-2xl font-bold text-slate-900">
              Notre vision
            </h2>
            <p className="mt-3 leading-relaxed text-slate-600">
              Devenir un leader incontournable dans la transformation
              énergétique et technologique en Afrique, en apportant des
              solutions durables, accessibles et innovantes au service des
              communautés.
            </p>
          </Reveal>

          <Reveal delay={0.08} className="rounded-3xl border border-slate-200 bg-slate-50 p-8 lg:p-10">
            <span className="flex size-12 items-center justify-center rounded-xl bg-navy-950">
              <Target className="size-6 text-solar-500" />
            </span>
            <h2 className="mt-6 text-2xl font-bold text-slate-900">
              Notre mission
            </h2>
            <p className="mt-3 leading-relaxed text-slate-600">
              Fournir des solutions fiables en énergie solaire et en
              technologies de proximité, tout en contribuant activement à la
              protection de l&apos;environnement et à la lutte contre la
              déforestation.
            </p>
          </Reveal>
        </div>
      </Section>

      <Engagement />

      {/* Valeurs */}
      <Section className="bg-white">
        <div className="container">
          <SectionHeading
            align="center"
            eyebrow="Nos valeurs"
            title="Ce qui guide chacune de nos interventions"
            lead="Sept principes au cœur de notre manière de travailler, sur chaque chantier."
          />
          <Stagger className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((value, index) => (
              <StaggerItem key={value.title}>
                <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
                  <span className="font-display text-2xl font-bold text-solar-500">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 text-lg font-bold text-slate-900">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {value.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Section>

      <CtaPanel />
    </>
  );
}
