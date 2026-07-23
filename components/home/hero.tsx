import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  MapPinned,
  ShieldCheck,
  Sun,
  Zap,
} from "lucide-react";

import { Reveal } from "@/components/motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";

const heroChecks = [
  "Étude gratuite, sans engagement",
  "Devis sous 24 h ouvrées",
  "Couverture des 26 provinces",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-grid-slate" aria-hidden="true" />
      <div
        className="absolute -right-52 top-10 size-[560px] rounded-full bg-solar-100/70 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -left-40 bottom-0 size-[380px] rounded-full bg-navy-100/60 blur-3xl"
        aria-hidden="true"
      />

      <div className="container relative grid items-center gap-14 py-16 md:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:py-24">
        {/* Colonne texte */}
        <div>
          <Reveal mode="mount">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="navy" className="py-1.5 pl-2.5 pr-4">
                <span className="flex size-5 items-center justify-center rounded-full bg-solar-500">
                  <ShieldCheck className="!size-3.5 text-navy-950" />
                </span>
                Certifié &amp; Agréé en RDC
              </Badge>
              <Badge variant="solar-soft">
                <Zap />
                {site.tagline} — depuis {site.foundedYear}
              </Badge>
            </div>
          </Reveal>

          <Reveal mode="mount" delay={0.08}>
            <h1 className="mt-6 text-4xl font-bold leading-[1.08] md:text-5xl xl:text-[3.4rem]">
              Leader en solutions énergétiques,{" "}
              <span className="relative whitespace-nowrap">
                <span className="relative z-10 bg-gradient-to-r from-solar-600 via-solar-500 to-solar-600 bg-clip-text text-transparent">
                  solaires
                </span>
                <span
                  className="absolute inset-x-0 bottom-1 z-0 h-3 -rotate-1 rounded-sm bg-solar-200/70"
                  aria-hidden="true"
                />
              </span>{" "}
              &amp; infrastructures techniques en RDC
            </h1>
          </Reveal>

          <Reveal mode="mount" delay={0.16}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
              Nous concevons, installons et maintenons des centrales solaires,
              systèmes backup et infrastructures électriques pour les
              institutions, ONG internationales, banques et entreprises — avec
              une ingénierie sur mesure et une capacité d&apos;intervention sur
              tout le territoire national.
            </p>
          </Reveal>

          <Reveal mode="mount" delay={0.24}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button variant="solar" size="lg" asChild>
                <Link href="/contact">
                  Demander une étude gratuite
                  <ArrowRight />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/references">Découvrir nos réalisations</Link>
              </Button>
            </div>
          </Reveal>

          <Reveal mode="mount" delay={0.32}>
            <ul className="mt-8 flex flex-col gap-2.5 text-sm font-medium text-slate-700 sm:flex-row sm:flex-wrap sm:gap-x-6">
              {heroChecks.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 shrink-0 text-solar-600" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* Colonne visuelle */}
        <Reveal mode="mount" delay={0.2} y={34} className="relative">
          <div className="relative">
            <div
              className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-solar-200/60 via-transparent to-navy-200/50 blur-xl"
              aria-hidden="true"
            />
            <div className="relative overflow-hidden rounded-3xl shadow-lift ring-1 ring-navy-950/10">
              <Image
                src="https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=1400&q=85"
                alt="Centrale solaire en toiture au lever du soleil — installation photovoltaïque professionnelle"
                width={720}
                height={560}
                priority
                sizes="(max-width: 1024px) 100vw, 46vw"
                className="h-[340px] w-full object-cover sm:h-[420px] lg:h-[520px]"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-navy-950/45 via-transparent to-transparent"
                aria-hidden="true"
              />

              {/* Carte statistique intégrée */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 rounded-2xl border border-white/20 bg-navy-950/70 p-4 backdrop-blur-md">
                <div>
                  <p className="font-display text-2xl font-bold text-white">
                    17<span className="text-solar-500">+</span>
                  </p>
                  <p className="text-xs font-medium text-navy-100">
                    Projets livrés depuis {site.foundedYear}
                  </p>
                </div>
                <div className="h-9 w-px bg-white/15" aria-hidden="true" />
                <div>
                  <p className="font-display text-2xl font-bold text-white">
                    10<span className="text-solar-500">+</span>
                  </p>
                  <p className="text-xs font-medium text-navy-100">
                    Clients institutionnels
                  </p>
                </div>
                <div className="hidden h-9 w-px bg-white/15 sm:block" aria-hidden="true" />
                <div className="hidden sm:block">
                  <p className="font-display text-2xl font-bold text-white">
                    6
                  </p>
                  <p className="text-xs font-medium text-navy-100">
                    Villes d&apos;intervention
                  </p>
                </div>
              </div>
            </div>

            {/* Badges flottants */}
            <div className="absolute -left-5 top-8 hidden animate-float md:block">
              <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3.5 pr-5 shadow-soft">
                <span className="flex size-10 items-center justify-center rounded-xl bg-solar-500/15">
                  <Sun className="size-5 text-solar-600" />
                </span>
                <span className="leading-tight">
                  <span className="block font-display text-sm font-bold text-slate-900">
                    100% Énergie propre
                  </span>
                  <span className="text-xs text-slate-500">
                    Conforme &amp; durable
                  </span>
                </span>
              </div>
            </div>

            <div className="absolute -right-4 top-1/2 hidden -translate-y-8 animate-float-delayed md:block">
              <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3.5 pr-5 shadow-soft">
                <span className="flex size-10 items-center justify-center rounded-xl bg-navy-950">
                  <MapPinned className="size-5 text-solar-500" />
                </span>
                <span className="leading-tight">
                  <span className="block font-display text-sm font-bold text-slate-900">
                    Couverture nationale
                  </span>
                  <span className="text-xs text-slate-500">
                    26 provinces — RDC
                  </span>
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
