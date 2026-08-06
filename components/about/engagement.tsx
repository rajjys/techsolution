import Image from "next/image";
import { Leaf, MapPin, Medal } from "lucide-react";

import { Reveal } from "@/components/motion";
import { SectionHeading } from "@/components/section";

const pillars = [
  {
    icon: Medal,
    title: "Excellence certifiée",
    description: "Aux standards des institutions et des bailleurs.",
  },
  {
    icon: MapPin,
    title: "Proximité locale",
    description: "Des équipes présentes sur le terrain, pas à distance.",
  },
  {
    icon: Leaf,
    title: "Engagement durable",
    description: "Du renouvelable contre la déforestation, pas un argument.",
  },
];

/**
 * Notre engagement — l'image occupe la moitié de la section et touche le bord
 * de l'écran, comme les expertises de /services : une photo de chantier
 * mérite une scène, pas une vignette flottante à côté d'un mur de texte.
 */
export function Engagement() {
  return (
    <section
      aria-labelledby="engagement-title"
      className="relative isolate overflow-hidden bg-white lg:min-h-[34rem]"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-slate-200"
        aria-hidden="true"
      />

      <div className="relative aspect-[4/3] w-full sm:aspect-[16/9] lg:absolute lg:inset-y-0 lg:left-0 lg:aspect-auto lg:w-1/2">
        <Image
          src="/gallery-web/nzulo-station-eau-nord-kivu.jpg"
          alt="Centrale solaire de la station de traitement d'eau de Nzulo, Nord-Kivu"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      <div className="container relative">
        <div className="grid lg:grid-cols-2">
          <div className="py-12 sm:py-16 lg:col-start-2 lg:py-24 lg:pl-14 xl:pl-20">
            <SectionHeading
              id="engagement-title"
              rule
              eyebrow="Notre engagement"
              title="Une installation qui dure vaut mieux qu'une installation qui impressionne."
              lead="Le matériel bon marché revient toujours plus cher : en pannes, en déplacements, en journées perdues. Nous dimensionnons pour la durée."
            />

            <div className="mt-9 space-y-5 border-t border-dashed border-slate-300 pt-8">
              {pillars.map((pillar, index) => (
                <Reveal key={pillar.title} delay={0.08 * (index + 1)}>
                  <div className="flex items-start gap-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-100/60">
                      <pillar.icon
                        className="size-5 text-brand-700"
                        strokeWidth={1.8}
                        aria-hidden="true"
                      />
                    </span>
                    <div className="min-w-0 pt-1">
                      <h3 className="text-base font-bold text-slate-900">
                        {pillar.title}
                      </h3>
                      <p className="mt-1 text-[15px] leading-relaxed text-slate-600">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
