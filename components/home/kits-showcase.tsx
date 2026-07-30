import Link from "next/link";
import { ArrowRight, BatteryCharging, Sun, Zap } from "lucide-react";

import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { kits } from "@/lib/data/kits";
import { cn } from "@/lib/utils";

/** Sélection curatée de 4 kits (source unique : lib/data/kits.ts) + badge marketing. */
const showcase: { id: string; badge: string; highlight?: boolean }[] = [
  { id: "kit-1-5kva", badge: "Monophasé • Compact" },
  { id: "kit-5kva", badge: "Monophasé • Best-seller résidentiel", highlight: true },
  { id: "kit-10kva", badge: "Monophasé • Grand confort / Bureau" },
  { id: "kit-30kva", badge: "Triphasé • Commercial & Projets" },
];

const cards = showcase.map((s) => {
  const kit = kits.find((k) => k.id === s.id)!;
  return { ...kit, badge: s.badge, highlight: s.highlight };
});

export function KitsShowcase() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="container">
        {/* En-tête */}
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full border border-brand-200 bg-brand-100/60 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-brand-700">
            Configurations clés en main
          </span>
          <h2 className="mt-5 text-3xl font-bold leading-[1.15] text-slate-900 md:text-4xl lg:text-[36px] lg:leading-[42px]">
            Des architectures solaires éprouvées.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600 md:text-lg">
            Sélectionnez la configuration adaptée à vos besoins ou demandez un
            sur-mesure.
          </p>
        </Reveal>

        {/* Grille des 4 kits */}
        <Stagger className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((kit) => (
            <StaggerItem key={kit.id} className="h-full">
              <article
                className={cn(
                  "group relative flex h-full flex-col rounded-2xl border bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-soft",
                  kit.highlight
                    ? "border-navy-300 ring-1 ring-navy-950/5"
                    : "border-slate-200 hover:border-slate-400",
                )}
              >
                {kit.highlight ? (
                  <span className="absolute right-5 top-0 -translate-y-1/2 rounded-full bg-solar-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-navy-950 shadow-sm">
                    Le plus demandé
                  </span>
                ) : null}

                <span
                  className={cn(
                    "inline-flex w-fit items-center rounded-full px-3 py-1 text-[11px] font-semibold",
                    kit.highlight
                      ? "bg-solar-500/15 text-solar-800"
                      : "bg-slate-100 text-slate-600",
                  )}
                >
                  {kit.badge}
                </span>

                <div className="mt-4">
                  <p className="font-display text-3xl font-bold text-navy-950">
                    {kit.power}
                  </p>
                  <h3 className="mt-1 text-sm font-semibold text-slate-500">
                    {kit.name}
                  </h3>
                </div>

                <ul className="mt-5 space-y-3 border-t border-slate-100 pt-5">
                  <li className="flex items-start gap-2.5 text-sm text-slate-600">
                    <Zap className="mt-0.5 size-4 shrink-0 text-brand-600" />
                    {kit.inverter}
                  </li>
                  <li className="flex items-start gap-2.5 text-sm text-slate-600">
                    <BatteryCharging className="mt-0.5 size-4 shrink-0 text-brand-600" />
                    {kit.battery}
                  </li>
                  <li className="flex items-start gap-2.5 text-sm text-slate-600">
                    <Sun className="mt-0.5 size-4 shrink-0 text-brand-600" />
                    {kit.panels}
                  </li>
                </ul>

                <div className="mt-5 rounded-xl bg-slate-50 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                    Usages typiques
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    {kit.usage}
                  </p>
                </div>

                <Button
                  variant={kit.highlight ? "default" : "outline"}
                  size="sm"
                  className="mt-6 w-full"
                  asChild
                >
                  <Link href={`/contact?produit=${encodeURIComponent(kit.name)}`}>
                    Demander cette configuration
                    <ArrowRight />
                  </Link>
                </Button>
              </article>
            </StaggerItem>
          ))}
        </Stagger>

        {/* Pied de section */}
        <Reveal delay={0.1} className="mt-14 text-center">
          <p className="text-lg font-semibold text-slate-900">
            Vous ne trouvez pas la puissance exacte ?
          </p>
          <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/produits">
                Voir tout notre catalogue de kits
                <ArrowRight />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/contact">Étude sur-mesure</Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
