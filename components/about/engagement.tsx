import Image from "next/image";
import { Leaf, MapPin, Medal } from "lucide-react";

import { Reveal } from "@/components/motion";
import { Section, SectionHeading } from "@/components/section";

const pillars = [
  {
    icon: Medal,
    title: "Excellence certifiée",
    description:
      "Qualité, performance et durabilité garanties sur chaque installation — aux standards des institutions et des bailleurs.",
  },
  {
    icon: MapPin,
    title: "Proximité locale",
    description:
      "Des solutions pensées pour les réalités congolaises, déployées par des équipes présentes sur le terrain.",
  },
  {
    icon: Leaf,
    title: "Engagement durable",
    description:
      "Promotion des énergies renouvelables et lutte active contre la déforestation, au cœur de notre mission.",
  },
];

/**
 * Ce qui ne se voit pas sur une facture — l'image du chantier d'un côté,
 * les trois engagements de l'autre. Contenu de la farde officielle.
 */
export function Engagement() {
  return (
    <Section className="overflow-hidden bg-white">
      <div className="container grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal className="relative order-2 lg:order-1" y={30}>
          <div className="relative overflow-hidden rounded-3xl shadow-soft ring-1 ring-slate-900/5">
            <Image
              src="/gallery-web/engagement.jpg"
              alt="Équipe Tech Solution installant une centrale solaire en RDC"
              width={1400}
              height={933}
              sizes="(max-width: 1024px) 100vw, 46vw"
              className="h-[320px] w-full object-cover sm:h-[440px]"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-brand-950/45 via-transparent to-transparent"
              aria-hidden="true"
            />
            <figure className="absolute inset-x-5 bottom-5 rounded-2xl bg-white/95 p-5 shadow-md backdrop-blur sm:inset-x-7 sm:bottom-7">
              <blockquote className="font-display text-[15px] font-bold leading-snug text-slate-900 sm:text-base">
                « Bâtir un avenir où la technologie rime avec l&apos;écologie. »
              </blockquote>
              <figcaption className="mt-1.5 text-xs text-slate-500">
                La ligne de conduite que nous nous sommes donnée
              </figcaption>
            </figure>
          </div>
        </Reveal>

        <div className="order-1 lg:order-2">
          <SectionHeading
            rule
            eyebrow="Notre engagement"
            title="Une installation qui dure vaut mieux qu'une installation qui impressionne."
            lead="Le matériel bon marché revient toujours plus cher : en pannes, en déplacements, en journées d'activité perdues. Nous dimensionnons pour la durée, et nous restons joignables après la mise en service."
          />

          <div className="mt-10 space-y-7">
            {pillars.map((pillar, index) => (
              <Reveal key={pillar.title} delay={0.08 * (index + 1)}>
                <div className="flex gap-5">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-950 shadow-sm">
                    <pillar.icon className="size-5 text-solar-400" />
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {pillar.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
