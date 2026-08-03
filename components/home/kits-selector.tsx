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

import { Reveal } from "@/components/motion";
import { Eyebrow } from "@/components/section";
import { cn } from "@/lib/utils";

type Appliance = { icon: LucideIcon; label: string };

type ShowcaseKit = {
  name: string;
  slug: string;
  power: string;
  /** Bandeau haut de carte ; remplacé par « Le plus demandé » si highlight. */
  segment: string;
  outcome: string;
  specs: { inverter: string; battery: string; panels: string };
  /** Max 4 — remplace la phrase « Idéal pour » : on scanne, on ne lit pas. */
  appliances: Appliance[];
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
  },
  {
    name: "Kit Solaire Hybride 5 kVA",
    slug: "kit-solaire-hybride-5-kva",
    power: "5 kVA",
    segment: "Monophasé · Villa",
    outcome: "Toute la villa en autonomie 24/7.",
    specs: { inverter: "5 kVA", battery: "5 kWh", panels: "6 × 550 W" },
    appliances: [
      { icon: Snowflake, label: "Congélateur" },
      { icon: Refrigerator, label: "Frigo" },
      { icon: Tv, label: 'TV 100"' },
      { icon: Lightbulb, label: "Éclairage" },
    ],
    highlight: true,
  },
  {
    name: "Kit Solaire Hybride 10 kVA",
    slug: "kit-solaire-hybride-10-kva",
    power: "10 kVA",
    segment: "Monophasé · Confort",
    outcome: "Clim, frigo et bureau, sans arbitrage.",
    specs: { inverter: "10 kVA", battery: "10 kWh", panels: "12 × 550 W" },
    appliances: [
      { icon: AirVent, label: "2 clims" },
      { icon: Refrigerator, label: "Frigo" },
      { icon: Tv, label: 'TV 100"' },
      { icon: Laptop, label: "Bureau" },
    ],
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
  },
];

const specRows = [
  { key: "inverter" as const, icon: Zap, label: "Onduleur" },
  { key: "battery" as const, icon: BatteryCharging, label: "Lithium" },
  { key: "panels" as const, icon: SunMedium, label: "Panneaux" },
];

function KitCard({ kit }: { kit: ShowcaseKit }) {
  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border bg-white transition-all duration-300 hover:-translate-y-1",
        kit.highlight
          ? "border-solar-400 shadow-[0_22px_50px_-24px_rgba(11,25,44,0.45)] hover:shadow-[0_32px_66px_-24px_rgba(11,25,44,0.5)]"
          : "border-slate-200 shadow-[0_14px_40px_-30px_rgba(11,25,44,0.5)] hover:shadow-[0_26px_58px_-28px_rgba(11,25,44,0.45)]",
      )}
    >
      {/* Bandeau — porte le segment, ou la mise en avant */}
      <div
        className={cn(
          "px-4 py-2.5 text-center text-[10.5px] font-bold uppercase tracking-[0.14em]",
          kit.highlight
            ? "bg-solar-500 text-navy-950"
            : "bg-slate-100 text-slate-500",
        )}
      >
        {kit.highlight ? "Le plus demandé" : kit.segment}
      </div>

      <div className="flex flex-1 flex-col p-6">
        {/* Ancre de la carte : la puissance joue le rôle du prix */}
        <p className="font-display text-[34px] font-bold leading-none text-navy-950">
          {kit.power}
        </p>
        {/* Deux lignes réservées : les fiches techniques restent alignées
            d'une carte à l'autre, quelle que soit la longueur de la phrase */}
        <h3 className="mt-3 min-h-[3.05rem] text-[15px] font-medium leading-relaxed text-slate-600">
          {kit.outcome}
        </h3>

        {/* Composition — libellé à gauche, valeur alignée à droite */}
        <dl className="mt-6 divide-y divide-slate-100 border-y border-slate-100">
          {specRows.map(({ key, icon: Icon, label }) => (
            <div
              key={key}
              className="flex items-center justify-between gap-3 py-2.5"
            >
              <dt className="inline-flex items-center gap-2 text-[13px] text-slate-500">
                <Icon
                  className="size-4 shrink-0 text-brand-600"
                  strokeWidth={2}
                  aria-hidden="true"
                />
                {label}
              </dt>
              <dd className="whitespace-nowrap font-display text-[13.5px] font-bold text-navy-950">
                {kit.specs[key]}
              </dd>
            </div>
          ))}
        </dl>

        {/* Ce que ça fait tourner — pictogrammes plutôt qu'une phrase */}
        <p className="mt-5 text-[10.5px] font-bold uppercase tracking-[0.14em] text-slate-400">
          Fait tourner
        </p>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {kit.appliances.map((item) => (
            <li
              key={item.label}
              className="inline-flex items-center gap-1.5 rounded-full bg-brand-100/50 px-2.5 py-1 text-[11px] font-medium text-slate-600"
            >
              <item.icon
                className="size-3.5 shrink-0 text-brand-600"
                strokeWidth={2}
                aria-hidden="true"
              />
              {item.label}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-6">
          <Link
            href={`/contact?produit=${kit.slug}`}
            className={cn(
              "inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-[15px] font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
              kit.highlight
                ? "bg-navy-950 text-white hover:bg-navy-800"
                : "border-2 border-navy-950 text-navy-950 hover:bg-navy-950 hover:text-white",
            )}
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
 * Grille de quatre dès lg ; en dessous, rail à défilement horizontal
 * (scroll-snap natif, sans JS) pour éviter d'empiler les cartes.
 */
export function KitsSelector() {
  return (
    <section
      aria-labelledby="kits-title"
      className="relative isolate bg-[#E8EEFA] py-14 sm:py-20 lg:py-28"
    >
      {/* Radiance bleue pleine largeur */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[radial-gradient(75rem_38rem_at_50%_0%,rgba(49,48,208,0.16),transparent_62%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(55rem_35rem_at_0%_100%,rgba(255,184,0,0.10),transparent_60%)]" />
      </div>

      <div className="container">
        <Reveal className="max-w-3xl">
          <div className="flex items-center gap-4">
            <Eyebrow>Nos kits solaires</Eyebrow>
            <span
              className="h-px flex-1 border-t border-dashed border-slate-400/60"
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
            Quatre configurations clés en main, du foyer à
            l&apos;établissement — redimensionnées sur votre site après un
            audit gratuit.
          </p>
        </Reveal>

        {/* Rail sous lg, grille de quatre à partir de lg */}
        <div className="no-scrollbar -mx-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:-mx-6 sm:gap-5 sm:px-6 lg:mx-0 lg:mt-14 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-0">
          {kits.map((kit, index) => (
            <Reveal
              key={kit.slug}
              delay={index * 0.07}
              y={18}
              className="w-[80vw] max-w-[19rem] shrink-0 snap-start sm:w-[19rem] lg:w-auto lg:max-w-none lg:shrink"
            >
              <div className="h-full">
                <KitCard kit={kit} />
              </div>
            </Reveal>
          ))}
        </div>

        {/* Filet de sécurité — pour ceux qu'aucun palier ne couvre */}
        <Reveal delay={0.1} className="mt-8 lg:mt-10">
          <div className="flex flex-col items-start gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-card sm:p-7 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
            <p className="text-lg font-bold text-slate-900 sm:text-xl">
              Une autre puissance ?{" "}
              <span className="font-medium text-slate-600">
                Nous dimensionnons sur mesure, après audit gratuit.
              </span>
            </p>

            <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4 lg:shrink-0">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-xl bg-[#C2410C] px-7 py-3.5 text-base font-semibold text-white transition-colors duration-200 hover:bg-[#9A3412] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C2410C] focus-visible:ring-offset-2"
              >
                Devis gratuit
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
