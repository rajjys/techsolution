import Image from "next/image";
import Link from "next/link";
import {
  AirVent,
  ArrowRight,
  BatteryCharging,
  Factory,
  Hotel,
  Laptop,
  Lightbulb,
  Refrigerator,
  School,
  Snowflake,
  Stethoscope,
  SunMedium,
  Tv,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { KitsRail } from "@/components/home/kits-rail";
import { Reveal } from "@/components/motion";
import { Eyebrow } from "@/components/section";
import { cn } from "@/lib/utils";

type Appliance = { icon: LucideIcon; label: string };

type ShowcaseKit = {
  name: string;
  slug: string;
  power: string;
  segment: string;
  outcome: string;
  specs: { inverter: string; battery: string; panels: string };
  /** Max 4 — remplace la phrase « Idéal pour » : on scanne, on ne lit pas. */
  appliances: Appliance[];
  image: string;
  imageAlt: string;
  highlight?: boolean;
};

/**
 * Quatre paliers couvrant toute l'échelle (foyer → villa → bureau →
 * établissement). Les paliers intermédiaires (650 Va, 3, 8, 12, 20 kVA)
 * vivent dans le catalogue — cf. lib/data/kits.ts.
 */
const kits: ShowcaseKit[] = [
  {
    name: "Kit Solaire Hybride 1,5 kVA",
    slug: "kit-solaire-hybride-15-kva",
    power: "1,5 kVA",
    segment: "Monophasé · Compact",
    outcome: "L'essentiel du foyer, sans coupure.",
    specs: { inverter: "1,5 kVA", battery: "2,5 kWh", panels: "2 × 450 W" },
    appliances: [
      { icon: Refrigerator, label: "Frigo" },
      { icon: Tv, label: "TV" },
      { icon: Laptop, label: "Laptop" },
      { icon: Lightbulb, label: "Éclairage" },
    ],
    image: "/gallery-web/kit-15.jpg",
    imageAlt: "Onduleur hybride et batterie lithium Tech Solution",
  },
  {
    name: "Kit Solaire Hybride 5 kVA",
    slug: "kit-solaire-hybride-5-kva",
    power: "5 kVA",
    segment: "Monophasé · Résidentiel",
    outcome: "Toute la villa en autonomie 24/7.",
    specs: { inverter: "5 kVA", battery: "5 kWh", panels: "6 × 550 W" },
    appliances: [
      { icon: Snowflake, label: "Congélateur" },
      { icon: Refrigerator, label: "Frigo" },
      { icon: Tv, label: 'TV 100"' },
      { icon: Lightbulb, label: "Éclairage" },
    ],
    image: "/gallery-web/kit-5.jpg",
    imageAlt:
      "Installation solaire résidentielle par les équipes Tech Solution",
    highlight: true,
  },
  {
    name: "Kit Solaire Hybride 10 kVA",
    slug: "kit-solaire-hybride-10-kva",
    power: "10 kVA",
    segment: "Monophasé · Grand confort",
    outcome: "Le confort total : clim, frigo & bureau.",
    specs: { inverter: "10 kVA", battery: "10 kWh", panels: "12 × 550 W" },
    appliances: [
      { icon: AirVent, label: "2 clims" },
      { icon: Refrigerator, label: "Frigo" },
      { icon: Tv, label: 'TV 100"' },
      { icon: Laptop, label: "Bureau" },
    ],
    image: "/gallery-web/kit-10.jpg",
    imageAlt: "Centrale solaire résidentielle vue du ciel en RDC",
  },
  {
    name: "Kit Solaire Semi-Industriel 30 kVA",
    slug: "kit-solaire-semi-industriel-30-kva",
    power: "30 kVA",
    segment: "Triphasé · Commercial",
    outcome: "La puissance d'un établissement entier.",
    specs: { inverter: "30 kVA · 3ϕ", battery: "52 kWh", panels: "48 × 550 W" },
    appliances: [
      { icon: Hotel, label: "Hôtel" },
      { icon: Stethoscope, label: "Santé" },
      { icon: School, label: "École" },
      { icon: Factory, label: "Usine" },
    ],
    image: "/gallery-web/kit-30.jpg",
    imageAlt: "Grande centrale solaire commerciale Tech Solution",
  },
];

/** Cellule de la fiche technique — valeur au-dessus, libellé en dessous. */
function SpecCell({
  icon: Icon,
  value,
  label,
}: {
  icon: LucideIcon;
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center px-2 py-3.5 text-center">
      <Icon className="size-[18px] text-brand-600" strokeWidth={2} />
      <span className="mt-2 font-display text-[15px] font-bold leading-none text-navy-950">
        {value}
      </span>
      <span className="mt-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </span>
    </div>
  );
}

function KitCard({ kit }: { kit: ShowcaseKit }) {
  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-[0_18px_45px_-28px_rgba(11,25,44,0.45)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_-28px_rgba(11,25,44,0.5)]",
        kit.highlight
          ? "border-solar-400 ring-1 ring-solar-400/30"
          : "border-slate-200",
      )}
    >
      {/* Visuel — il illustre, il ne porte plus l'information */}
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <Image
          src={kit.image}
          alt={kit.imageAlt}
          fill
          sizes="(max-width: 640px) 82vw, 360px"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.04]"
        />
        {kit.highlight ? (
          <span className="absolute right-4 top-4 rounded-full bg-solar-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-navy-950 shadow-sm">
            Le plus demandé
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-6">
        {/* Ancre de la carte : la puissance joue le rôle du prix */}
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
          {kit.segment}
        </span>
        <p className="mt-2 font-display text-[32px] font-bold leading-none text-navy-950">
          {kit.power}
        </p>
        <h3 className="mt-3 text-[15px] font-medium leading-relaxed text-slate-600">
          {kit.outcome}
        </h3>

        {/* Fiche technique — trois colonnes, comme sur l'ancienne carte */}
        <div className="mt-6 grid grid-cols-3 divide-x divide-slate-200 rounded-xl border border-slate-200 bg-slate-50/70">
          <SpecCell icon={Zap} value={kit.specs.inverter} label="Onduleur" />
          <SpecCell
            icon={BatteryCharging}
            value={kit.specs.battery}
            label="Lithium"
          />
          <SpecCell
            icon={SunMedium}
            value={kit.specs.panels}
            label="Panneaux"
          />
        </div>

        {/* Ce que ça fait tourner — pictogrammes plutôt qu'une phrase */}
        <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
          Fait tourner
        </p>
        <ul className="mt-3 grid grid-cols-4 gap-2">
          {kit.appliances.map((item) => (
            <li
              key={item.label}
              className="flex min-w-0 flex-col items-center gap-2 text-center"
            >
              <item.icon
                className="size-5 text-brand-600"
                strokeWidth={1.8}
                aria-hidden="true"
              />
              <span className="text-[11px] leading-tight text-slate-500">
                {item.label}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-7">
          <Link
            href={`/contact?produit=${kit.slug}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-navy-950 px-5 py-3.5 text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-navy-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
          >
            Demander ce kit
            <span className="sr-only"> — {kit.name}</span>
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}

/**
 * Filet final — sélection des kits puis appel à l'action.
 * Rail horizontal à toutes les tailles : trois cartes visibles, la
 * quatrième dépasse pour signaler la suite.
 */
export function KitsSelector() {
  return (
    <section
      aria-labelledby="kits-title"
      className="relative isolate bg-[#F4F7FE] py-14 sm:py-20 lg:py-28"
    >
      {/* Radiance bleue pleine largeur — écho de la grille des solutions */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[radial-gradient(75rem_38rem_at_50%_0%,rgba(49,48,208,0.12),transparent_62%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(55rem_35rem_at_0%_100%,rgba(255,184,0,0.09),transparent_60%)]" />
      </div>

      <div className="container">
        <Reveal className="max-w-3xl">
          <div className="flex items-center gap-4">
            <Eyebrow>Nos kits solaires</Eyebrow>
            <span
              className="h-px flex-1 border-t border-dashed border-slate-300"
              aria-hidden="true"
            />
          </div>
          <h2
            id="kits-title"
            className="mt-6 text-balance text-[26px] font-bold leading-[1.18] text-slate-900 sm:text-3xl sm:leading-[1.15] md:text-4xl lg:text-[42px] lg:leading-[1.1]"
          >
            Choisissez la puissance.{" "}
            <span className="text-brand-600">Nous ajustons le reste.</span>
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-slate-600 sm:text-base md:text-lg">
            Quatre configurations clés en main, du foyer à l&apos;établissement.
            Chacune est redimensionnée sur votre site lors d&apos;un audit de
            charge gratuit.
          </p>
        </Reveal>

        <div className="mt-10 lg:mt-14">
          <KitsRail>
            {kits.map((kit, index) => (
              <Reveal
                key={kit.slug}
                delay={index * 0.07}
                y={18}
                className="w-[80vw] max-w-[20rem] shrink-0 snap-start sm:w-[20rem] lg:w-[22.5rem] lg:max-w-none"
              >
                <div className="h-full">
                  <KitCard kit={kit} />
                </div>
              </Reveal>
            ))}
          </KitsRail>
        </div>

        {/* Filet de sécurité — pour ceux qu'aucun palier ne couvre */}
        <Reveal delay={0.1} className="mt-8 lg:mt-10">
          <div className="flex flex-col items-start gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-card sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
            <div>
              <p className="text-lg font-bold text-slate-900 sm:text-xl">
                Aucune de ces puissances ne correspond ?
              </p>
              <p className="mt-1.5 text-[15px] leading-relaxed text-slate-600 sm:text-base">
                Nos ingénieurs dimensionnent votre installation sur mesure,
                après un audit de charge gratuit — partout en RDC.
              </p>
            </div>

            <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4 lg:shrink-0">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-xl bg-[#C2410C] px-7 py-3.5 text-base font-semibold text-white transition-colors duration-200 hover:bg-[#9A3412] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C2410C] focus-visible:ring-offset-2"
              >
                Obtenez un devis gratuit
              </Link>
              <Link
                href="/produits"
                className="group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl border-2 border-[#C2410C] px-[26px] py-3 text-base font-semibold text-[#C2410C] transition-colors duration-200 hover:bg-black/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C2410C] focus-visible:ring-offset-2"
              >
                Tout le catalogue
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
