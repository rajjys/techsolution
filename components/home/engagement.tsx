import Image from "next/image";
import { Leaf, MapPin, Medal } from "lucide-react";

import { Reveal } from "@/components/motion";
import { Section, SectionHeading } from "@/components/section";
import { site } from "@/lib/site";

const pillars = [
  {
    icon: Medal,
    title: "Excellence certifiée",
    description:
      "Qualité, performance et durabilité garanties sur chaque installation — aux standards des institutions et bailleurs.",
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

/** Vision, mission et piliers — contenu de la farde officielle. */
export function Engagement() {
  return (
    <Section className="overflow-hidden bg-slate-50">
      <div className="container grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal className="relative order-2 lg:order-1">
          <div className="relative">
            <div
              className="absolute -inset-3 rounded-[2rem] bg-gradient-to-tr from-navy-200/50 to-solar-200/50 blur-lg"
              aria-hidden="true"
            />
            <div className="relative overflow-hidden rounded-3xl shadow-soft ring-1 ring-navy-950/10">
              <Image
                src="https://images.unsplash.com/photo-1592833159155-c62df1b65634?auto=format&fit=crop&w=1400&q=85"
                alt="Panneaux solaires installés en pleine nature — énergie propre au service des communautés"
                width={680}
                height={540}
                sizes="(max-width: 1024px) 100vw, 44vw"
                className="h-[320px] w-full object-cover sm:h-[420px]"
              />
            </div>
            <div className="absolute -bottom-6 -right-4 max-w-[250px] rounded-2xl border border-slate-100 bg-white p-5 shadow-soft sm:right-6">
              <p className="font-display text-sm font-bold text-slate-900">
                « Bâtir un avenir où technologie rime avec écologie. »
              </p>
              <p className="mt-1.5 text-xs text-slate-500">
                L&apos;engagement {site.name}
              </p>
            </div>
          </div>
        </Reveal>

        <div className="order-1 lg:order-2">
          <SectionHeading
            eyebrow="Notre engagement"
            title={
              <>
                Une ingénierie au service de la{" "}
                <span className="bg-gradient-to-r from-solar-600 to-solar-500 bg-clip-text text-transparent">
                  révolution énergétique
                </span>
              </>
            }
            lead="Fournir des solutions fiables en énergie solaire et en technologies de proximité, tout en contribuant activement à la protection de l'environnement — c'est la mission qui guide chacun de nos projets."
          />

          <div className="mt-10 space-y-7">
            {pillars.map((pillar, index) => (
              <Reveal key={pillar.title} delay={0.08 * (index + 1)}>
                <div className="flex gap-5">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-navy-950 shadow-sm">
                    <pillar.icon className="size-5 text-solar-500" />
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
