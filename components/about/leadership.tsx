import Image from "next/image";
import { Handshake, ShieldCheck, Target, Wallet } from "lucide-react";

import { Reveal } from "@/components/motion";
import { SectionHeading } from "@/components/section";
import { leader, site } from "@/lib/site";

/**
 * La direction — un nom, un parcours et une raison d'être derrière les
 * installations.
 *
 * Un moteur de recherche, comme un assistant conversationnel, pèse qui se
 * tient derrière une affirmation technique ; un acheteur aussi. Tout ce qui
 * figure ici a été confirmé par l'entreprise (oct. 2026) — l'école
 * d'ingénieur n'étant pas connue, elle n'est pas citée.
 *
 * Le portrait est cadré, pas en pleine hauteur : en demi-écran à fond perdu,
 * il mesurait 720 × 1 096 px à 1 440 — un visage plus grand que l'écran, qui
 * écrasait le texte qu'il devait signer. Il reste à droite (« Notre
 * engagement », juste après, a son image à gauche) et suit la lecture.
 *
 * Sur téléphone, il vient entre le titre et le parcours : on lit qui, on
 * voit qui, puis on lit ce qu'il a fait.
 */
const overlooked = new Intl.ListFormat("fr", { type: "conjunction" }).format(
  leader.overlooked,
);

/** Sa démarche, en trois principes — ceux qu'il a lui-même énoncés. */
const principles = [
  {
    icon: ShieldCheck,
    title: "La qualité avant le prix",
    text: "La durabilité du matériel compte davantage que son prix d'achat.",
  },
  {
    icon: Handshake,
    title: "Un partenariat, pas une pose",
    text: "Une relation qui suit l'installation sur toute sa durée de vie, plutôt qu'une intervention sans lendemain.",
  },
  {
    icon: Wallet,
    title: "Le paiement échelonné",
    text: "Pour que les foyers et les entreprises accèdent au solaire sans tout payer à l'installation.",
  },
];

export function Leadership() {
  return (
    <section
      aria-labelledby="direction-title"
      className="bg-white py-12 sm:py-16 lg:py-24"
    >
      <div className="container grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:grid-rows-[auto_1fr] lg:gap-x-16 lg:gap-y-0 xl:grid-cols-[minmax(0,1fr)_24rem] xl:gap-x-24">
        <div className="lg:col-start-1 lg:row-start-1">
          <SectionHeading
            id="direction-title"
            rule
            eyebrow="La direction"
            title="Fondée pour ce que le solaire négligeait."
            lead={`${leader.name} fonde ${site.name} en ${site.foundedYear} pour ce que le secteur solaire négligeait : ${overlooked}.`}
          />
        </div>

        <div className="lg:sticky lg:top-28 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-slate-100 ring-1 ring-slate-200 sm:max-w-md lg:aspect-[4/5] lg:max-w-none">
            <Image
              src={leader.photo}
              alt={`${leader.name}, fondateur et directeur général de ${site.name}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 448px, 384px"
              className="object-cover object-[50%_22%]"
            />
          </div>
        </div>

        <div className="lg:col-start-1 lg:row-start-2">
          <Reveal delay={0.1}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 lg:mt-8">
              <p className="font-display text-xl font-bold text-slate-900">
                {leader.name}
              </p>
              <p className="text-sm font-medium text-slate-500">
                {leader.training}
              </p>
            </div>
            <p className="mt-0.5 text-sm font-semibold text-brand-700">
              {leader.role}
            </p>

            {/* Le parcours — dans l'ordre, sans rien ajouter */}
            <ol className="mt-6 space-y-2.5 border-l-2 border-brand-100 pl-5">
              {leader.career.map((step) => (
                <li key={step.period} className="relative">
                  <span
                    className="absolute -left-[1.6rem] top-1.5 size-2.5 rounded-full border-2 border-white bg-brand-600 ring-1 ring-brand-200"
                    aria-hidden="true"
                  />
                  <span className="block text-xs font-bold tabular-nums tracking-wide text-slate-500">
                    {step.period}
                  </span>
                  <span className="block text-[15px] leading-snug text-slate-800">
                    {step.text}
                  </span>
                </li>
              ))}
            </ol>
          </Reveal>

          <div className="mt-8 space-y-5 border-t border-dashed border-slate-300 pt-7">
            {principles.map((principle, index) => (
              <Reveal key={principle.title} delay={0.08 * (index + 1)}>
                <div className="flex items-start gap-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-100/60">
                    <principle.icon
                      className="size-5 text-brand-700"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  </span>
                  <div className="min-w-0 pt-1">
                    <h3 className="text-base font-bold text-slate-900">
                      {principle.title}
                    </h3>
                    <p className="mt-1 text-[15px] leading-relaxed text-slate-600">
                      {principle.text}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3}>
            <p className="mt-8 flex items-start gap-3 rounded-2xl bg-brand-50 p-4 text-[15px] font-medium leading-relaxed text-slate-800">
              <Target
                className="mt-0.5 size-5 shrink-0 text-brand-600"
                aria-hidden="true"
              />
              Son objectif : résoudre le problème de l&apos;électricité en
              RDC par l&apos;énergie solaire.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
