import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, CheckCircle2 } from "lucide-react";

import { CtaPanel } from "@/components/cta-panel";
import { Reveal } from "@/components/motion";
import { PageHero } from "@/components/page-hero";
import { Section, SectionHeading } from "@/components/section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { faqs, processSteps, services } from "@/lib/data/services";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Services & Expertise",
  description:
    "Énergie solaire, systèmes backup, infrastructures électriques industrielles, télécoms, sécurité électronique et maintenance",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services & Expertise"
        title={
          <>
            Des capacités d&apos;ingénierie{" "}
            <span className="bg-gradient-to-r from-solar-500 to-solar-400 bg-clip-text text-transparent">
              complètes
            </span>{" "}
            pour vos infrastructures
          </>
        }
        lead="Six domaines d'expertise, une seule équipe responsable : audit, conception, installation et maintenance de vos systèmes énergétiques et techniques."
      >
        <Reveal mode="mount" delay={0.15}>
          <nav
            aria-label="Accès rapide aux services"
            className="mt-10 flex flex-wrap gap-2.5"
          >
            {services.map((service) => (
              <a
                key={service.slug}
                href={`#${service.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-navy-100 backdrop-blur transition-colors hover:border-solar-500/60 hover:bg-solar-500/10 hover:text-solar-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solar-500"
              >
                <service.icon className="size-4 text-solar-500" />
                {service.shortTitle}
              </a>
            ))}
          </nav>
        </Reveal>
      </PageHero>

      {/* Détail des services */}
      <div className="bg-white">
        {services.map((service, index) => {
          const reversed = index % 2 === 1;
          return (
            <Section
              key={service.slug}
              id={service.slug}
              className={cn(index % 2 === 1 ? "bg-slate-50" : "bg-white")}
            >
              <div className="container grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
                <Reveal
                  className={cn("relative", reversed && "lg:order-2")}
                  y={30}
                >
                  <div className="relative">
                    <div
                      className={cn(
                        "absolute -inset-3 rounded-[2rem] blur-lg",
                        reversed
                          ? "bg-gradient-to-tl from-solar-200/60 to-navy-200/40"
                          : "bg-gradient-to-tr from-navy-200/50 to-solar-200/50",
                      )}
                      aria-hidden="true"
                    />
                    <div className="relative overflow-hidden rounded-3xl shadow-soft ring-1 ring-navy-950/10">
                      <Image
                        src={service.image}
                        alt={service.imageAlt}
                        width={680}
                        height={480}
                        sizes="(max-width: 1024px) 100vw, 44vw"
                        className="h-[300px] w-full object-cover sm:h-[400px]"
                      />
                      <div
                        className="absolute inset-0 bg-gradient-to-t from-navy-950/35 to-transparent"
                        aria-hidden="true"
                      />
                      <span className="absolute left-4 top-4 inline-flex size-12 items-center justify-center rounded-xl bg-white/95 shadow-md backdrop-blur">
                        <service.icon className="size-6 text-navy-900" />
                      </span>
                    </div>
                  </div>
                </Reveal>

                <div className={cn(reversed && "lg:order-1")}>
                  <SectionHeading
                    eyebrow={`Expertise ${String(index + 1).padStart(2, "0")}`}
                    title={service.title}
                    lead={service.description}
                  />

                  <Reveal delay={0.1}>
                    <ul className="mt-8 grid gap-3">
                      {service.capabilities.map((capability) => (
                        <li
                          key={capability}
                          className="flex items-start gap-3 text-sm font-medium text-slate-700"
                        >
                          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-solar-600" />
                          {capability}
                        </li>
                      ))}
                    </ul>
                  </Reveal>

                  <Reveal delay={0.18}>
                    <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
                      <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-navy-800">
                        <BadgeCheck className="size-4 text-solar-600" />
                        Références livrées
                      </p>
                      <ul className="mt-3 space-y-2">
                        {service.references.map((reference) => (
                          <li
                            key={reference}
                            className="flex items-start gap-2.5 text-sm text-slate-600"
                          >
                            <span
                              className="mt-[7px] size-1.5 shrink-0 rounded-full bg-solar-500"
                              aria-hidden="true"
                            />
                            {reference}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Reveal>

                  <Reveal delay={0.24}>
                    <div className="mt-8 flex flex-wrap gap-3">
                      <Button asChild>
                        <Link href="/contact">
                          Étudier mon projet
                          <ArrowRight />
                        </Link>
                      </Button>
                      <Button variant="ghost" asChild>
                        <Link href="/produits">Voir les équipements</Link>
                      </Button>
                    </div>
                  </Reveal>
                </div>
              </div>
            </Section>
          );
        })}
      </div>

      {/* Processus */}
      <Section className="relative overflow-hidden bg-navy-950">
        <div className="absolute inset-0 bg-grid-navy" aria-hidden="true" />
        <div
          className="absolute -right-32 top-0 size-[420px] rounded-full bg-solar-500/10 blur-3xl"
          aria-hidden="true"
        />
        <div className="container relative">
          <SectionHeading
            align="center"
            onDark
            eyebrow="Notre méthode"
            title="Une démarche 100% client, en 4 étapes"
            lead="Du premier contact à la maintenance, un interlocuteur unique et des engagements clairs."
          />

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, index) => (
              <Reveal key={step.step} delay={0.1 * index} className="h-full">
                <div className="group relative h-full rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur transition-colors duration-300 hover:border-solar-500/50 hover:bg-white/10">
                  <span className="font-display text-4xl font-bold text-solar-500/90">
                    {step.step}
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-navy-100/80">
                    {step.description}
                  </p>
                  {index < processSteps.length - 1 ? (
                    <ArrowRight
                      className="absolute -right-4 top-1/2 hidden size-5 -translate-y-1/2 text-solar-500/60 lg:block"
                      aria-hidden="true"
                    />
                  ) : null}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section className="bg-slate-50">
        <div className="container grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="Questions fréquentes"
              title="Tout ce qu'il faut savoir avant de lancer votre projet"
              lead="Une autre question ? Notre équipe vous répond sous 24 h ouvrées, par téléphone, email ou WhatsApp."
            />
            <Reveal delay={0.15}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/contact">
                    Poser ma question
                    <ArrowRight />
                  </Link>
                </Button>
              </div>
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

      <CtaPanel
        title="Votre site mérite une énergie fiable et durable"
        lead="Décrivez-nous votre besoin : nos ingénieurs planifient l'audit gratuit de votre site et vous remettent un dimensionnement précis."
      />
    </>
  );
}
