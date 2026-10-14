import Image from "next/image";
import { BriefcaseBusiness, HardHat } from "lucide-react";

import { Reveal } from "@/components/motion";
import { SectionHeading } from "@/components/section";
import { leader, site } from "@/lib/site";

/**
 * La direction — un nom et un visage derrière les installations.
 *
 * Un moteur de recherche, comme un assistant conversationnel, pèse qui se
 * tient derrière une affirmation technique ; un acheteur aussi. Le site
 * n'avait aucun nom : il en a un, avec ses deux rôles, et rien de plus que ce
 * que l'entreprise a confirmé. La biographie viendra d'elle.
 *
 * Même grammaire que « Notre engagement » juste après, mais l'image à droite :
 * deux sections pleine largeur qui se suivent du même côté se liraient comme
 * deux lignes d'un tableau.
 */
export function Leadership() {
  const roles = [
    {
      icon: BriefcaseBusiness,
      title: "Direction générale",
      text: "Il dirige l'entreprise, ses deux bureaux et ses équipes techniques.",
    },
    {
      icon: HardHat,
      title: "Ingénierie",
      text: "Ingénieur principal, il conduit la conception technique des systèmes que l'entreprise installe.",
    },
  ];

  return (
    <section
      aria-labelledby="direction-title"
      className="relative isolate overflow-hidden bg-white lg:min-h-[34rem]"
    >
      <div className="relative aspect-[4/3] w-full sm:aspect-[16/9] lg:absolute lg:inset-y-0 lg:right-0 lg:aspect-auto lg:w-1/2">
        <Image
          src={leader.photo}
          alt={`${leader.name}, ${leader.role.toLowerCase()} de ${site.name}`}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover object-[50%_22%]"
        />
      </div>

      <div className="container relative">
        <div className="grid lg:grid-cols-2">
          <div className="py-12 sm:py-16 lg:py-24 lg:pr-14 xl:pr-20">
            <SectionHeading
              id="direction-title"
              rule
              eyebrow="La direction"
              title="Une entreprise dirigée par son ingénieur."
              lead={`${leader.name} est à la fois le directeur général de ${site.name} et son ingénieur principal : la décision technique et la décision d'entreprise se prennent au même endroit.`}
            />

            <Reveal delay={0.1}>
              <p className="mt-8 font-display text-xl font-bold text-slate-900">
                {leader.name}
              </p>
              <p className="mt-0.5 text-sm font-medium text-slate-500">
                {leader.role}
              </p>
            </Reveal>

            <div className="mt-7 space-y-5 border-t border-dashed border-slate-300 pt-7">
              {roles.map((role, index) => (
                <Reveal key={role.title} delay={0.08 * (index + 1)}>
                  <div className="flex items-start gap-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-100/60">
                      <role.icon
                        className="size-5 text-brand-700"
                        strokeWidth={1.8}
                        aria-hidden="true"
                      />
                    </span>
                    <div className="min-w-0 pt-1">
                      <h3 className="text-base font-bold text-slate-900">
                        {role.title}
                      </h3>
                      <p className="mt-1 text-[15px] leading-relaxed text-slate-600">
                        {role.text}
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
