import {
  BatteryCharging,
  CalendarCheck,
  MapPin,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { Eyebrow } from "@/components/section";

type Commitment = { icon: LucideIcon; title: string; text: string };

/**
 * Engagements transverses — volontairement indépendants du domaine
 * (solaire, backup, électricité, sécurité, maintenance) : ils valent
 * pour l'ensemble des interventions.
 */
const commitments: Commitment[] = [
  {
    icon: BatteryCharging,
    title: "Matériel industriel",
    text: "Batteries 100 % lithium, onduleurs hybrides et composants éprouvés. Jamais de plomb.",
  },
  {
    icon: ShieldCheck,
    title: "Garantie renouvelable",
    text: "Un an renouvelable sur les batteries, et un service après-vente réellement joignable.",
  },
  {
    icon: MapPin,
    title: "Équipes en RDC",
    text: "Techniciens basés sur place, mobilisables rapidement sur tout le territoire.",
  },
  {
    icon: CalendarCheck,
    title: "Suivi & maintenance",
    text: "Mise en service, formation de vos équipes et contrats d'entretien planifiés.",
  },
];

/** Section autonome — les engagements qui accompagnent chaque chantier. */
export function Offerings() {
  return (
    <section
      aria-labelledby="offerings-title"
      className="border-t border-slate-100 bg-white py-14 sm:py-20 lg:py-24"
    >
      <div className="container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow className="justify-center">Ce que nous offrons</Eyebrow>
          <h2
            id="offerings-title"
            className="mt-4 text-[26px] font-bold leading-[1.18] text-slate-900 sm:text-3xl sm:leading-[1.15] md:text-4xl"
          >
            Le même standard, quel que soit le chantier.
          </h2>
        </Reveal>

        <Stagger className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-8 lg:mt-16 lg:grid-cols-4 lg:gap-y-0 lg:divide-x lg:divide-slate-200">
          {commitments.map((item) => (
            <StaggerItem key={item.title} className="lg:px-6">
              <div className="flex flex-col items-center text-center">
                <span className="flex size-14 items-center justify-center rounded-2xl bg-brand-100/60 sm:size-16">
                  <item.icon
                    className="size-7 text-brand-600 sm:size-8 lg:size-9"
                    strokeWidth={1.5}
                  />
                </span>
                <h3 className="mt-5 text-base font-bold text-slate-900 lg:text-lg">
                  {item.title}
                </h3>
                <p className="mt-2 max-w-[16rem] text-sm leading-relaxed text-slate-600">
                  {item.text}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
