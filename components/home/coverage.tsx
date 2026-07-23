import Link from "next/link";
import { ArrowRight, MapPinned, Radio } from "lucide-react";

import { DrcMap } from "@/components/drc-map";
import { Reveal } from "@/components/motion";
import { Section, SectionHeading } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { provinces } from "@/lib/data/drc";

/** Empreinte géographique — carte RDC + provinces actives. */
export function Coverage() {
  const activeProvinces = provinces.filter((p) => p.active);

  return (
    <Section className="bg-white">
      <div className="container grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
        <div>
          <SectionHeading
            eyebrow="Présence en RDC"
            title="Une capacité d'intervention sur tout le territoire national"
            lead="Nos équipes opèrent depuis l'Est de la RDC et se mobilisent dans les 26 provinces pour les études, installations et maintenances — y compris sur sites isolés."
          />

          <Reveal delay={0.12}>
            <dl className="mt-10 grid grid-cols-2 gap-6">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <MapPinned className="size-4 text-solar-600" />
                  Provinces livrées
                </dt>
                <dd className="mt-2 font-display text-3xl font-bold text-navy-950">
                  {activeProvinces.length}
                  <span className="ml-2 text-sm font-semibold text-slate-500">
                    / 26 couvertes
                  </span>
                </dd>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <Radio className="size-4 text-solar-600" />
                  Villes actives
                </dt>
                <dd className="mt-2 font-display text-3xl font-bold text-navy-950">
                  6
                  <span className="ml-2 text-sm font-semibold text-slate-500">
                    sites livrés
                  </span>
                </dd>
              </div>
            </dl>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-8">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Provinces avec réalisations livrées
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {activeProvinces.map((province) => (
                  <Badge key={province.name} variant="solar">
                    {province.name}
                  </Badge>
                ))}
                <Badge variant="outline">+ mobilisation nationale</Badge>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.28}>
            <Button className="mt-10" asChild>
              <Link href="/references">
                Voir nos références par province
                <ArrowRight />
              </Link>
            </Button>
          </Reveal>
        </div>

        <Reveal delay={0.15} y={34}>
          <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-6 shadow-card sm:p-8">
            <DrcMap />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
