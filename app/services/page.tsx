import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { Glow } from "@/components/glow";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { PageHero } from "@/components/page-hero";
import { Section, SectionHeading } from "@/components/section";
import { ServiceCard } from "@/components/services/service-card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { faqs, processSteps, services, type Service } from "@/lib/data/services";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Services & Expertise",
  description:
    "Énergie solaire, systèmes backup, infrastructures électriques industrielles, télécoms, sécurité électronique et maintenance",
  alternates: { canonical: "/services" },
};

/**
 * Bloc détaillé d'une expertise.
 *
 * L'image est en `fill` dans une colonne étirée (`items-stretch`) : sa hauteur
 * suit exactement celle du texte, quelle que soit la longueur de ce dernier.
 * C'est ce qui règle le désalignement image/texte — plutôt qu'une hauteur
 * fixe qui ne peut être juste que pour un seul des six blocs.
 */
function ExpertiseBlock({
  service,
  index,
}: {
  service: Service;
  index: number;
}) {
  const reversed = index % 2 === 1;
  const number = String(index + 1).padStart(2, "0");

  return (
    <div
      id={service.slug}
      className="grid items-stretch gap-8 py-12 lg:grid-cols-2 lg:gap-16 lg:py-20"
    >
      <Reveal
        y={24}
        className={cn("min-w-0", reversed && "lg:order-2")}
      >
        <div className="relative aspect-[4/3] h-full overflow-hidden rounded-3xl shadow-soft ring-1 ring-slate-900/5 lg:aspect-auto lg:min-h-[26rem]">
          <Image
            src={service.image}
            alt={service.imageAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 46vw"
            className="object-cover"
          />
          {/* Voile bas — assure le contraste de la pastille sur toute image */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-brand-950/25 via-transparent to-transparent"
            aria-hidden="true"
          />
          <span className="absolute left-5 top-5 inline-flex size-12 items-center justify-center rounded-2xl bg-white/95 shadow-md backdrop-blur">
            <service.icon
              className="size-6 text-brand-700"
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </span>
        </div>
      </Reveal>

      <div
        className={cn(
          "flex min-w-0 flex-col justify-center",
          reversed && "lg:order-1",
        )}
      >
        <Reveal delay={0.08}>
          {/* Numéro de chapitre — le repère de progression, sans redite */}
          <div className="flex items-center gap-3">
            <span className="font-display text-sm font-bold tabular-nums text-brand-600">
              {number}
            </span>
            <span
              className="h-px w-10 bg-brand-300"
              aria-hidden="true"
            />
          </div>

          <h3 className="mt-4 text-balance text-[24px] font-bold leading-[1.18] text-slate-900 sm:text-[28px] lg:text-[32px] lg:leading-[1.15]">
            {service.title}
          </h3>

          <p className="mt-5 text-[15px] leading-relaxed text-slate-600 sm:text-base lg:text-[17px] lg:leading-[1.75]">
            {service.description}
          </p>
        </Reveal>

        <Reveal delay={0.14}>
          <ul className="mt-7 space-y-2.5 border-t border-dashed border-slate-300 pt-7">
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

        <Reveal delay={0.2}>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
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
            Des capacités d&apos;ingénierie{" "}
            <span className="text-brand-600">complètes</span> pour vos
            infrastructures
          </>
        }
        lead="De l'audit de charge à la maintenance : nous concevons, installons et entretenons vos systèmes énergétiques et techniques, partout en RDC."
      >
        <Reveal mode="mount" delay={0.15}>
          <nav
            aria-label="Accès rapide aux expertises"
            className="mt-9 flex flex-wrap gap-2.5"
          >
            {services.map((service) => (
              <a
                key={service.slug}
                href={`#${service.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-card transition-all duration-200 hover:border-brand-300 hover:text-brand-700 hover:ring-4 hover:ring-brand-100 hover:ring-offset-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
              >
                <service.icon
                  className="size-4 text-solar-600"
                  aria-hidden="true"
                />
                {service.shortTitle}
              </a>
            ))}
          </nav>
        </Reveal>
      </PageHero>

      {/* Vue d'ensemble — la réponse en cinq secondes */}
      <Section className="bg-white">
        <div className="container">
          <SectionHeading
            align="center"
            eyebrow="Vue d'ensemble"
            title="Six domaines, une seule équipe responsable."
          />

          <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:mt-14 lg:grid-cols-3 lg:gap-6">
            {services.map((service) => (
              <StaggerItem key={service.slug} y={18} className="h-full">
                <ServiceCard service={service} href={`#${service.slug}`} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Section>

      {/*
        Détail — un seul chapitre teinté plutôt que six bandes alternées :
        les blocs se lisent comme une suite, séparés par un simple filet.
      */}
      <section
        aria-label="Détail des expertises"
        className="relative isolate bg-surface-cool"
      >
        <Glow variant="cool" corner="bottom-right" />
        <div className="container divide-y divide-slate-200/80">
          {services.map((service, index) => (
            <ExpertiseBlock
              key={service.slug}
              service={service}
              index={index}
            />
          ))}
        </div>
      </section>

      {/* Méthode — le sombre est réservé à la preuve */}
      <Section className="relative isolate overflow-hidden bg-brand-950">
        <Glow variant="dark" corner="top-right" />
        <div className="container relative">
          <SectionHeading
            align="center"
            onDark
            eyebrow="Notre méthode"
            title="Une démarche 100% client, en quatre étapes"
            lead="Du premier contact à la maintenance : un interlocuteur unique et des engagements datés."
          />

          <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-6">
            {processSteps.map((step) => (
              <StaggerItem key={step.step} y={18} className="h-full">
                <div className="h-full rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition-colors duration-300 hover:border-white/25 hover:bg-white/[0.07] lg:p-7">
                  <span className="font-display text-4xl font-bold tabular-nums text-solar-400">
                    {step.step}
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-brand-200">
                    {step.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Section>

      {/* FAQ */}
      <Section className="bg-white">
        <div className="container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
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
