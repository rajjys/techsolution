import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, MapPin } from "lucide-react";

import { CtaPanel } from "@/components/cta-panel";
import { Reveal } from "@/components/motion";
import { Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import { caseStudies } from "@/lib/data/case-studies";

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = caseStudies.find((c) => c.slug === slug);
  if (!study) return { title: "Étude de cas introuvable" };
  return {
    title: `${study.title} — ${study.city}`,
    description: study.summary,
    alternates: { canonical: `/references/${study.slug}` },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = caseStudies.find((c) => c.slug === slug);
  if (!study) notFound();

  return (
    <>
      {/* En-tête */}
      <section className="relative overflow-hidden bg-navy-950">
        <div className="absolute inset-0 bg-grid-navy" aria-hidden="true" />
        <div
          className="absolute -right-32 -top-40 size-[440px] rounded-full bg-solar-500/15 blur-3xl"
          aria-hidden="true"
        />
        <div className="container relative py-14 md:py-20">
          <Reveal mode="mount" className="max-w-3xl">
            <Link
              href="/references"
              className="inline-flex items-center gap-2 text-sm font-semibold text-navy-200 transition-colors hover:text-solar-500"
            >
              <ArrowLeft className="size-4" />
              Toutes nos références
            </Link>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-solar-500 px-3 py-1 text-xs font-bold text-navy-950">
                {study.category}
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-navy-100">
                <MapPin className="size-4 text-solar-500" />
                {study.city} — {study.province}
              </span>
            </div>
            <h1 className="mt-4 text-3xl font-bold leading-[1.12] text-white md:text-5xl">
              {study.title}
            </h1>
            <p className="mt-4 text-lg text-navy-100/85">{study.client}</p>
          </Reveal>
        </div>
      </section>

      <Section className="bg-white">
        <div className="container grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <Reveal className="overflow-hidden rounded-3xl shadow-soft ring-1 ring-navy-950/10">
              <Image
                src={study.image}
                alt={study.imageAlt}
                width={1200}
                height={800}
                className="h-auto w-full object-cover"
              />
            </Reveal>

            <Reveal delay={0.1} className="mt-10 space-y-8">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Le défi</h2>
                <p className="mt-3 leading-relaxed text-slate-600">
                  {study.challenge}
                </p>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Notre solution
                </h2>
                <p className="mt-3 leading-relaxed text-slate-600">
                  {study.solution}
                </p>
              </div>
            </Reveal>
          </div>

          {/* Résultats */}
          <Reveal delay={0.15}>
            <div className="sticky top-28 rounded-3xl border border-slate-200 bg-slate-50 p-7 lg:p-8">
              <h2 className="text-lg font-bold text-slate-900">Résultats</h2>
              <ul className="mt-5 space-y-4">
                {study.results.map((result) => (
                  <li key={result} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-solar-600" />
                    <span className="text-sm font-medium text-slate-700">
                      {result}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 border-t border-slate-200 pt-6">
                <p className="text-sm text-slate-600">
                  Un projet similaire en vue ?
                </p>
                <Button className="mt-4 w-full" asChild>
                  <Link
                    href={`/contact?produit=${encodeURIComponent(
                      `Projet similaire à : ${study.title} (${study.city})`,
                    )}`}
                  >
                    Demander une étude
                    <ArrowRight />
                  </Link>
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      <CtaPanel
        title="Votre site mérite la même fiabilité"
        lead="Décrivez-nous votre besoin : nos ingénieurs planifient l'audit gratuit de votre site et vous remettent un dimensionnement précis."
      />
    </>
  );
}
