import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Glow } from "@/components/glow";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { PageHero } from "@/components/page-hero";
import { Section, SectionHeading } from "@/components/section";
import { ProcessTimeline } from "@/components/services/process-timeline";
import { ServiceCard } from "@/components/services/service-card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { faqs, processSteps, services } from "@/lib/data/services";
import { pageMetadata } from "@/lib/seo";
import { serviceHref } from "@/lib/routes";

export const metadata: Metadata = pageMetadata({
  path: "/services",
  /*
   * Le hub ne dispute plus « installation solaire » à la page du domaine
   * solaire (/services/energie-solaire) : une intention, une URL. Il porte
   * l'ensemble — les six métiers et la méthode.
   */
  title: "Services solaires et électriques en RDC",
  description:
    "Six expertises, une seule équipe : solaire, backup lithium, électricité, télécoms, sécurité, maintenance. Audit de charge et devis gratuits, partout en RDC.",
});

export default function ServicesPage() {
  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Services" }]}
        eyebrow="Services & Expertise"
        title={
          <>
            Énergie solaire et électricité&nbsp;:{" "}
            {/*
              Littéral gabarit et non du texte JSX : une expression suivie de
              texte sur plusieurs lignes perd son espace de tête, JSX rognant
              chaque ligne avant de les joindre. Rendu tel quel : « 6expertises ».
            */}
            <span className="text-brand-600">
              {`${services.length} expertises pour que le courant ne s'arrête plus.`}
            </span>
          </>
        }
        lead={`Délestages, carburant, matériel grillé, sites isolés : nous traitons la cause, de l'audit de charge au contrat d'entretien. Pour les foyers, les entreprises et les sites industriels, partout en RDC.`}
        image={{
          src: "/photos/toiture-duo-fixation.webp",
          alt: "Deux techniciens Tech Solution RDC fixant un système solaire en toiture",
          position: "50% 72%",
          /* Deux techniciens au travail, marque visible. */
          mobile: "band",
        }}
        actions={
          <>
            <Button className="group" asChild>
              <Link href="/contact">
                Demander une étude gratuite
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </Button>
          </>
        }
      />

      {/* Index — la porte d'entrée : on part du besoin, pas du catalogue */}
      <Section className="relative isolate bg-surface-cool-deep">
        <Glow variant="cool-deep" corner="bottom-right" />
        <div className="container relative">
          <SectionHeading
            align="center"
            eyebrow="Par où commencer"
            title="Identifiez la panne, nous avons le domaine."
            lead={`${services.length} expertises, une seule équipe responsable de bout en bout. Chaque domaine a sa page : ce que nous faisons, et ce que nous avons déjà livré.`}
          />

          <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:mt-14 lg:grid-cols-3 lg:gap-6">
            {services.map((service, index) => (
              <StaggerItem key={service.slug} y={18} className="h-full">
                <ServiceCard
                  service={service}
                  href={serviceHref(service.slug)}
                  index={index}
                />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Section>

      {/* Méthode — le sombre est réservé à la preuve */}
      <Section className="relative isolate overflow-hidden bg-brand-950">
        <Glow variant="dark" corner="top-right" />
        <div className="container relative">
          <SectionHeading
            rule
            onDark
            eyebrow="Notre méthode"
            title="De votre première question à un système entretenu."
            lead={`${processSteps.length} étapes, un interlocuteur unique, et un livrable à chacune. Rien ne vous est facturé avant que vous ayez le devis en main.`}
          />
          <ProcessTimeline />
        </div>
      </Section>

      {/* FAQ */}
      <Section className="relative isolate bg-surface-cool">
        <Glow variant="cool" corner="bottom-right" />
        <div className="container relative grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              rule
              eyebrow="Questions fréquentes"
              title="Ce qu'il faut savoir avant de lancer un projet"
              lead="Une autre question ? Notre équipe répond sous 24 h ouvrées, par téléphone, email ou WhatsApp."
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
