import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { Section, SectionHeading } from "@/components/section";
import { Button } from "@/components/ui/button";
import { services } from "@/lib/data/services";

/** Aperçu des domaines d'expertise — cartes vers /services. */
export function Solutions() {
  return (
    <Section className="bg-white">
      <div className="container">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Nos expertises"
            title={
              <>
                Des solutions d&apos;ingénierie{" "}
                <span className="text-navy-700">de bout en bout</span>
              </>
            }
            lead="De l'audit énergétique à la maintenance, une seule équipe responsable de la performance de vos installations."
          />
          <Reveal delay={0.1} className="shrink-0">
            <Button variant="outline" asChild>
              <Link href="/services">
                Tous nos services
                <ArrowRight />
              </Link>
            </Button>
          </Reveal>
        </div>

        <Stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <StaggerItem key={service.slug}>
              <Link
                href={`/services#${service.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-navy-200 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solar-500 focus-visible:ring-offset-2"
              >
                <span className="flex size-12 items-center justify-center rounded-xl bg-solar-500/15 transition-colors duration-300 group-hover:bg-solar-500">
                  <service.icon className="size-6 text-solar-700 transition-colors duration-300 group-hover:text-navy-950" />
                </span>
                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  {service.title}
                </h3>
                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-slate-600">
                  {service.excerpt}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-800">
                  En savoir plus
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}
