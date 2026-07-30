import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BatteryCharging, Sun, Zap } from "lucide-react";

import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ShowcaseKit = {
  name: string;
  power: string;
  segment: string;
  outcome: string;
  specs: { inverter: string; battery: string; panels: string };
  usage: string;
  image: string;
  imageAlt: string;
  highlight?: boolean;
};

const kits: ShowcaseKit[] = [
  {
    name: "Kit Solaire Hybride 1,5 kVA",
    power: "1,5 kVA",
    segment: "Monophasé · Compact",
    outcome: "L'essentiel du foyer, sans coupure.",
    specs: { inverter: "1,5 kVA", battery: "2,5 kWh", panels: "2 × 450 W" },
    usage: "Frigo, TV, laptop, éclairage & décodeur.",
    image: "/gallery-web/kit-15.jpg",
    imageAlt: "Onduleur hybride et batterie lithium Tech Solution",
  },
  {
    name: "Kit Solaire Hybride 5 kVA",
    power: "5 kVA",
    segment: "Monophasé · Best-seller résidentiel",
    outcome: "Toute la villa en autonomie 24/7.",
    specs: { inverter: "5 kVA", battery: "5 kWh", panels: "6 × 550 W" },
    usage: "Congélateur, frigo, TV 100\", cafetière & éclairage complet.",
    image: "/gallery-web/kit-5.jpg",
    imageAlt: "Installation solaire résidentielle par les équipes Tech Solution",
    highlight: true,
  },
  {
    name: "Kit Solaire Hybride 10 kVA",
    power: "10 kVA",
    segment: "Monophasé · Grand confort / Bureau",
    outcome: "Le confort total : clim, frigo & bureau.",
    specs: { inverter: "10 kVA", battery: "10 kWh", panels: "12 × 550 W" },
    usage: "2 climatiseurs 9000 BTU, congélateur, TV & équipements de bureau.",
    image: "/gallery-web/kit-10.jpg",
    imageAlt: "Centrale solaire résidentielle vue du ciel en RDC",
  },
  {
    name: "Kit Solaire Semi-Industriel 30 kVA",
    power: "30 kVA",
    segment: "Triphasé · Commercial & Projets",
    outcome: "La puissance d'un établissement entier.",
    specs: { inverter: "30 kVA · 3ϕ", battery: "52 kWh", panels: "48 × 550 W" },
    usage: "Hôtel, auberge, centre de santé, usine & PME.",
    image: "/gallery-web/kit-30.jpg",
    imageAlt: "Grande centrale solaire commerciale Tech Solution",
  },
];

function SpecCell({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Zap;
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center px-2 py-4 text-center">
      <Icon className="size-5 text-brand-600" strokeWidth={2} />
      <span className="mt-2 font-display text-base font-bold leading-none text-navy-950">
        {value}
      </span>
      <span className="mt-1 text-[11px] font-medium uppercase tracking-wide text-slate-400">
        {label}
      </span>
    </div>
  );
}

export function KitsShowcase() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold leading-[1.15] text-slate-900 md:text-4xl lg:text-[40px] lg:leading-[1.1]">
            Prêt à passer à l&apos;énergie qui dure ?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600 md:text-lg">
            Choisissez la configuration la plus proche de vos besoins — nous
            l&apos;ajustons à votre site lors d&apos;une étude gratuite.
          </p>
        </Reveal>

        <Stagger className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {kits.map((kit) => (
            <StaggerItem key={kit.name} className="h-full">
              <article
                className={cn(
                  "group flex h-full flex-col overflow-hidden rounded-3xl border bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift",
                  kit.highlight
                    ? "border-navy-300 ring-1 ring-navy-950/5"
                    : "border-slate-200",
                )}
              >
                {/* Visuel + puissance */}
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  <Image
                    src={kit.image}
                    alt={kit.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 45vw"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/25 to-transparent"
                    aria-hidden="true"
                  />
                  {kit.highlight ? (
                    <span className="absolute right-4 top-4 rounded-full bg-solar-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-navy-950 shadow-sm">
                      Le plus demandé
                    </span>
                  ) : null}
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <span className="text-xs font-semibold uppercase tracking-wide text-solar-400">
                      {kit.segment}
                    </span>
                    <p className="mt-1 font-display text-4xl font-bold leading-none text-white">
                      {kit.power}
                    </p>
                  </div>
                </div>

                {/* Contenu */}
                <div className="flex flex-1 flex-col p-6 lg:p-7">
                  <h3 className="text-xl font-bold leading-snug text-slate-900 lg:text-2xl">
                    {kit.outcome}
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">{kit.name}</p>

                  {/* Fiche technique */}
                  <div className="mt-5 grid grid-cols-3 divide-x divide-slate-200 rounded-2xl border border-slate-200 bg-slate-50/70">
                    <SpecCell icon={Zap} value={kit.specs.inverter} label="Onduleur" />
                    <SpecCell
                      icon={BatteryCharging}
                      value={kit.specs.battery}
                      label="Lithium"
                    />
                    <SpecCell icon={Sun} value={kit.specs.panels} label="Panneaux" />
                  </div>

                  <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-600">
                    <span className="font-semibold text-slate-800">
                      Idéal pour&nbsp;:
                    </span>{" "}
                    {kit.usage}
                  </p>

                  <Button
                    variant={kit.highlight ? "default" : "outline"}
                    className="mt-6 w-full"
                    asChild
                  >
                    <Link
                      href={`/contact?produit=${encodeURIComponent(kit.name)}`}
                    >
                      Demander cette configuration
                      <ArrowRight />
                    </Link>
                  </Button>
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.1} className="mt-14 text-center">
          <p className="text-lg font-semibold text-slate-900">
            Vous ne trouvez pas la puissance exacte ?
          </p>
          <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/contact">
                Parlons de votre projet
                <ArrowRight />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/produits">Voir tout le catalogue</Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
