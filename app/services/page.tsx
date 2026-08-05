import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

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
import { faqs, services, type Service } from "@/lib/data/services";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Services & Expertise",
  description:
    "Énergie solaire, systèmes backup, infrastructures électriques industrielles, télécoms, sécurité électronique et maintenance",
  alternates: { canonical: "/services" },
};

/**
 * Une expertise = une section pleine largeur, avec sa propre surface.
 *
 * Trois choses la distinguent de la suivante : le fond (blanc / teinté en
 * alternance), le côté de l'image, et surtout son titre — la panne que le
 * client cherche à résoudre, pas l'intitulé technique du métier. L'image
 * occupe la moitié de la section et touche le bord de l'écran dès `lg` :
 * c'est ce qui donne à chaque bloc une scène plutôt qu'une ligne de tableau.
 */
function ExpertiseSection({
  service,
  index,
}: {
  service: Service;
  index: number;
}) {
  /* Impair : image à droite sur fond teinté. Pair : image à gauche sur blanc. */
  const flipped = index % 2 === 1;
  const number = String(index + 1).padStart(2, "0");

  return (
    <section
      id={service.slug}
      aria-labelledby={`${service.slug}-title`}
      className={cn(
        "relative isolate overflow-hidden lg:min-h-[36rem]",
        flipped ? "bg-surface-cool" : "bg-white",
      )}
    >
      {flipped ? (
        <Glow variant="cool" corner="bottom-left" />
      ) : (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-slate-200"
          aria-hidden="true"
        />
      )}

      {/*
        Image : en flux au-dessus du texte sous lg, puis épinglée sur une
        moitié de la section, du bord de l'écran jusqu'à la gouttière.
      */}
      <div
        className={cn(
          "relative aspect-[4/3] w-full sm:aspect-[16/9] lg:absolute lg:inset-y-0 lg:aspect-auto lg:w-1/2",
          flipped ? "lg:right-0" : "lg:left-0",
        )}
      >
        <Image
          src={service.image}
          alt={service.imageAlt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-brand-950/30 via-transparent to-transparent"
          aria-hidden="true"
        />
        <span className="absolute bottom-5 left-5 inline-flex items-center gap-2.5 rounded-full bg-white/95 py-2 pl-2.5 pr-4 shadow-md backdrop-blur lg:bottom-8 lg:left-8">
          <span className="flex size-8 items-center justify-center rounded-full bg-brand-950">
            <service.icon
              className="size-4 text-solar-400"
              strokeWidth={2}
              aria-hidden="true"
            />
          </span>
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-slate-700">
            {service.shortTitle}
          </span>
        </span>
      </div>

      <div className="container relative">
        <div className="grid lg:grid-cols-2">
          <div
            className={cn(
              "py-12 sm:py-16 lg:py-24",
              flipped
                ? "lg:col-start-1 lg:pr-14 xl:pr-20"
                : "lg:col-start-2 lg:pl-14 xl:pl-20",
            )}
          >
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="font-display text-sm font-bold tabular-nums text-brand-600">
                  {number}
                </span>
                <span className="h-px w-8 bg-brand-300" aria-hidden="true" />
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  {service.title}
                </span>
              </div>

              {/* Le titre porte la panne du client, pas l'intitulé du métier */}
              <h2
                id={`${service.slug}-title`}
                className="mt-5 text-balance text-[26px] font-bold leading-[1.15] text-slate-900 sm:text-[30px] lg:text-[34px] lg:leading-[1.12]"
              >
                {service.outcome}
              </h2>

              <p className="mt-5 text-[15px] leading-relaxed text-slate-600 sm:text-base lg:text-[17px] lg:leading-[1.75]">
                {service.description}
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <ul className="mt-8 grid gap-2.5 border-t border-dashed border-slate-300 pt-8">
                {service.capabilities.map((capability) => (
                  <li key={capability} className="flex items-start gap-3">
                    <Check
                      className="mt-[3px] size-4 shrink-0 text-solar-600"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    />
                    <span className="text-[15px] leading-relaxed text-slate-700">
                      {capability}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.16}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Button asChild>
                  <Link href={`/contact?service=${service.slug}`}>
                    Étudier mon projet
                  </Link>
                </Button>
                <Button variant="outline-ember" className="group" asChild>
                  <Link
                    href={`/references?domaine=${service.slug}#realisations`}
                  >
                    Voir les réalisations
                    <span className="sr-only"> en {service.shortTitle}</span>
                    <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ServicesPage() {
  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Services" }]}
        eyebrow="Services & Expertise"
        title={
          <>
            Six expertises, un seul objectif :{" "}
            <span className="text-brand-600">
              que votre site ne s&apos;arrête jamais.
            </span>
          </>
        }
        lead="Délestages, carburant, matériel grillé, sites isolés : nous traitons la cause — de l'audit de charge jusqu'au contrat d'entretien, partout en RDC."
      />

      {/* Index — la porte d'entrée : on part du besoin, pas du catalogue */}
      <Section className="relative isolate bg-surface-cool-deep">
        <Glow variant="cool-deep" corner="bottom-right" />
        <div className="container relative">
          <SectionHeading
            align="center"
            eyebrow="Par où commencer"
            title="Identifiez la panne, nous avons le domaine."
            lead="Six expertises, une seule équipe responsable de bout en bout. Choisissez la vôtre — le détail suit juste en dessous."
          />

          <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:mt-14 lg:grid-cols-3 lg:gap-6">
            {services.map((service, index) => (
              <StaggerItem key={service.slug} y={18} className="h-full">
                <ServiceCard
                  service={service}
                  href={`#${service.slug}`}
                  index={index}
                />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Section>

      {services.map((service, index) => (
        <ExpertiseSection
          key={service.slug}
          service={service}
          index={index}
        />
      ))}

      {/* Méthode — le sombre est réservé à la preuve */}
      <Section className="relative isolate overflow-hidden bg-brand-950">
        <Glow variant="dark" corner="top-right" />
        <div className="container relative">
          <SectionHeading
            rule
            onDark
            eyebrow="Notre méthode"
            title="De votre première question à un système entretenu."
            lead="Quatre étapes, un interlocuteur unique, et un livrable à chacune. Rien ne vous est facturé avant que vous ayez le devis en main."
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
